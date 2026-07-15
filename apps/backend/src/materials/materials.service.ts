import { Injectable } from '@nestjs/common';

@Injectable()
export class MaterialsService {
  private materials = [
    {
      id: '1',
      code: 'MAT-001',
      description: 'Fusible 10A',
      category: 'Eléctrico',
      unitOfMeasure: 'unidad',
      minimumStock: 5,
      currentStock: 12,
    },
  ];

  findAll() {
    return this.materials;
  }

  findOne(id: string) {
    return this.materials.find((material) => material.id === id);
  }

  create(data: any) {
    const newMaterial = {
      id: String(this.materials.length + 1),
      ...data,
      currentStock: 0,
    };

    this.materials.push(newMaterial);
    return newMaterial;
  }

  update(id: string, data: any) {
    const index = this.materials.findIndex((material) => material.id === id);
    if (index === -1) return null;

    this.materials[index] = {
      ...this.materials[index],
      ...data,
    };

    return this.materials[index];
  }

  remove(id: string) {
    const index = this.materials.findIndex((material) => material.id === id);
    if (index === -1) return null;

    const [removed] = this.materials.splice(index, 1);
    return removed;
  }
}
