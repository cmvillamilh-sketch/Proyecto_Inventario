import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InventoryMovement, InventoryMovementType } from './inventory-movement.entity';
import { Material } from '../materials/material.entity';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';

@Injectable()
export class InventoryService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(InventoryMovement)
    private readonly inventoryRepository: Repository<InventoryMovement>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  findAll() {
    return this.inventoryRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const movement = await this.inventoryRepository.findOne({ where: { id } });
    if (!movement) {
      throw new NotFoundException('Movimiento de inventario no encontrado');
    }
    return movement;
  }

  async create(data: CreateInventoryMovementDto) {
    if (data.quantity <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor que cero');
    }

    const material = await this.materialRepository.findOne({ where: { id: data.materialId } });
    if (!material) {
      throw new BadRequestException('Material no encontrado');
    }

    const previousStock = material.currentStock;
    if (data.movementType === InventoryMovementType.SALIDA && data.quantity > previousStock) {
      throw new BadRequestException('No hay stock suficiente para la salida');
    }

    const newStock = data.movementType === InventoryMovementType.SALIDA ? previousStock - data.quantity : previousStock + data.quantity;

    return await this.dataSource.transaction(async (manager) => {
      material.currentStock = newStock;
      await manager.save(Material, material);

      const movement = manager.create(InventoryMovement, {
        material,
        movementType: data.movementType,
        quantity: data.quantity,
        previousStock,
        newStock,
        observation: data.observation || '',
        user: data.user?.trim() || 'system',
      });

      return await manager.save(InventoryMovement, movement);
    });
  }

  async remove(id: string) {
    const movement = await this.inventoryRepository.findOne({ where: { id } });
    if (!movement) {
      throw new NotFoundException('Movimiento de inventario no encontrado');
    }

    await this.inventoryRepository.remove(movement);
    return { deleted: true };
  }
}
