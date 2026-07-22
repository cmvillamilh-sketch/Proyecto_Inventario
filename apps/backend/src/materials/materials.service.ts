import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, QueryFailedError, Repository } from 'typeorm';
import { Material } from './entities/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  async findAll(search?: string) {
    if (search) {
      return this.materialRepository.find({
        where: [{ code: ILike(`%${search}%`) }, { description: ILike(`%${search}%`) }],
      });
    }

    return this.materialRepository.find();
  }

  async getSummary() {
    const materials = await this.materialRepository.find();
    const lowStockMaterials = materials.filter((material) => material.currentStock <= material.minimumStock);

    return {
      totalMaterials: materials.length,
      totalStockUnits: materials.reduce((sum, material) => sum + material.currentStock, 0),
      lowStockCount: lowStockMaterials.length,
      lowStockMaterials,
    };
  }

  async findOne(id: string) {
    const material = await this.materialRepository.findOne({ where: { id } });
    if (!material) {
      throw new NotFoundException(`Material with id ${id} not found`);
    }
    return material;
  }

  async create(data: CreateMaterialDto, createdBy: string) {
    const material = this.materialRepository.create({
      ...data,
      currentStock: 0,
      createdBy,
    });

    try {
      return await this.materialRepository.save(material);
    } catch (error) {
      if (error instanceof QueryFailedError && (error.driverError as { code?: string })?.code === '23505') {
        throw new ConflictException('Ya existe un material con ese code');
      }
      throw error;
    }
  }

  async update(id: string, data: UpdateMaterialDto) {
    const material = await this.findOne(id);
    if (!material) {
      throw new NotFoundException(`Material with id ${id} not found`);
    }
    await this.materialRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    const material = await this.findOne(id);
    if (!material) {
      throw new NotFoundException(`Material with id ${id} not found`);
    }
    return this.materialRepository.remove(material);
  }
}
