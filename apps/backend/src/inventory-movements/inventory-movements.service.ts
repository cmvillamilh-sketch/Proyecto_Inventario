import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Material } from '../materials/entities/material.entity';
import { MovementType } from './enums/movement-type.enum';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';
import { FindInventoryMovementsDto } from './dto/find-inventory-movements.dto';
import { InventoryMovement } from './entities/inventory-movement.entity';

@Injectable()
export class InventoryMovementsService {
  constructor(
    @InjectRepository(InventoryMovement)
    private readonly inventoryMovementRepository: Repository<InventoryMovement>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(filters: FindInventoryMovementsDto) {
    const where: FindOptionsWhere<InventoryMovement> = {};

    if (filters.materialId) {
      where.material = { id: filters.materialId };
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.createdBy) {
      where.createdBy = filters.createdBy;
    }

    if (filters.dateFrom && filters.dateTo) {
      where.createdAt = Between(
        new Date(`${filters.dateFrom}T00:00:00.000`),
        new Date(`${filters.dateTo}T23:59:59.999`),
      );
    } else if (filters.dateFrom) {
      where.createdAt = MoreThanOrEqual(new Date(`${filters.dateFrom}T00:00:00.000`));
    } else if (filters.dateTo) {
      where.createdAt = LessThanOrEqual(new Date(`${filters.dateTo}T23:59:59.999`));
    }

    return this.inventoryMovementRepository.find({
      where,
      relations: { material: true },
    });
  }

  async findOne(id: string) {
    const inventoryMovement = await this.inventoryMovementRepository.findOne({
      where: { id },
      relations: { material: true },
    });

    if (!inventoryMovement) {
      throw new NotFoundException(`InventoryMovement with id ${id} not found`);
    }

    return inventoryMovement;
  }

  private calculateNewStock(currentStock: number, movementType: MovementType, quantity: number): number {
    switch (movementType) {
      case MovementType.ENTRY:
        return currentStock + quantity;
      case MovementType.EXIT:
        if (quantity > currentStock) {
          throw new BadRequestException('Insufficient stock');
        }
        return currentStock - quantity;
      case MovementType.ADJUSTMENT:
        return quantity;
      default:
        return currentStock;
    }
  }

  async create(data: CreateInventoryMovementDto, createdBy: string) {
    return this.dataSource.transaction(async (manager) => {
      const materialRepository = manager.getRepository(Material);
      const inventoryMovementRepository = manager.getRepository(InventoryMovement);

      const material = await materialRepository.findOne({ where: { id: data.materialId } });
      if (!material) {
        throw new NotFoundException(`Material with id ${data.materialId} not found`);
      }

      const newStock = this.calculateNewStock(material.currentStock, data.type, data.quantity);
      material.currentStock = newStock;

      await materialRepository.save(material);

      const inventoryMovement = inventoryMovementRepository.create({
        ...data,
        material,
        createdBy,
      });

      const savedInventoryMovement = await inventoryMovementRepository.save(inventoryMovement);

      return inventoryMovementRepository.findOne({
        where: { id: savedInventoryMovement.id },
        relations: { material: true },
      });
    });
  }

  async update(id: string) {
    await this.findOne(id);
    throw new ForbiddenException('Los movimientos de inventario son inmutables');
  }

  async remove(id: string) {
    await this.findOne(id);
    throw new ForbiddenException('Los movimientos de inventario son inmutables');
  }
}
