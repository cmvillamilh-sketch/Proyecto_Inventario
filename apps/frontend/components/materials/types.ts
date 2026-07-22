export type Material = {
  id: string;
  code: string;
  description: string;
  category: string;
  unitOfMeasure: string;
  minimumStock: number;
  currentStock?: number;
};
