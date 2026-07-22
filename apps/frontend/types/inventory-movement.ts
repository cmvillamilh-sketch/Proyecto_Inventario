export type MovementType = 'ENTRY' | 'EXIT' | 'ADJUSTMENT';

export interface InventoryMovement {
  id: string;
  type: MovementType;
  quantity: number;
  reason: string;
  createdAt: string;
  createdBy: string | null;
  material: {
    id: string;
    code: string;
    currentStock: number;
  };
}

export interface InventoryMovementFilters {
  materialId?: string;
  type?: MovementType | '';
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
}
