import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  async findAll() {
    return await this.materialRepository.find();
  }

  async findOne(id: string) {
    const material = await this.materialRepository.findOne({ where: { id } });
    if (!material) {
      throw new NotFoundException('Material no encontrado');
    }
    return material;
  }

  async create(data: CreateMaterialDto) {
    const existing = await this.materialRepository.findOne({ where: { code: data.code } });
    if (existing) {
      throw new BadRequestException('El código del material ya existe');
    }

    const newMaterial = this.materialRepository.create({
      ...data,
      currentStock: 0,
    });

    return await this.materialRepository.save(newMaterial);
  }

  async update(id: string, data: UpdateMaterialDto) {
    const material = await this.materialRepository.findOne({ where: { id } });
    if (!material) {
      throw new NotFoundException('Material no encontrado');
    }

    if (data.code && data.code !== material.code) {
      const duplicate = await this.materialRepository.findOne({ where: { code: data.code } });
      if (duplicate) {
        throw new BadRequestException('El código del material ya existe');
      }
    }

    Object.assign(material, data);
    return await this.materialRepository.save(material);
  }

  async remove(id: string) {
    const material = await this.materialRepository.findOne({ where: { id } });
    if (!material) {
      throw new NotFoundException('Material no encontrado');
    }

    await this.materialRepository.remove(material);
    return material;
  }
}
