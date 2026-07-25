export interface CreateMaterialDto {
  code: string;
  description: string;
  category: string;
  unitOfMeasure: string;
  minimumStock: number;
  unitValue?: number | null;
}

export interface UpdateMaterialDto {
  code?: string;
  description?: string;
  category?: string;
  unitOfMeasure?: string;
  minimumStock?: number;
  currentStock?: number;
  unitValue?: number | null;
}
