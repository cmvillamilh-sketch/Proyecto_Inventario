export interface Material {
  id: string;
  code: string;
  description: string;
  category: string;
  unitOfMeasure: string;
  minimumStock: number;
  currentStock: number;
}

export interface MaterialsSummary {
  totalMaterials: number;
  totalStockUnits: number;
  lowStockCount: number;
  lowStockMaterials: Material[];
}
