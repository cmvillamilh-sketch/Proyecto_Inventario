export interface Material {
  id: string;
  code: string;
  description: string;
  category: string;
  unitOfMeasure: string;
  minimumStock: number;
  currentStock: number;
  unitValue?: number | null;
}

export interface MaterialsSummary {
  totalMaterials: number;
  totalStockUnits: number;
  lowStockCount: number;
  lowStockMaterials: Material[];
  totalInventoryValue: number;
  valueByCategory: { category: string; totalValue: number }[];
  materialCountByCategory: { category: string; count: number }[];
}
