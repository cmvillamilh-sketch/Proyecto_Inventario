export interface CreateMaterialDto {
  code: string;
  description: string;
  category: string;
  unitOfMeasure: string;
  minimumStock: number;
  currentStock: number;
}

export interface UpdateMaterialDto {
  code?: string;
  description?: string;
  category?: string;
  unitOfMeasure?: string;
  minimumStock?: number;
  currentStock?: number;
}
