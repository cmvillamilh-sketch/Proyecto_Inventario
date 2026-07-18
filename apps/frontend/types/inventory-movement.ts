export type MovementType = 'ENTRY' | 'EXIT' | 'ADJUSTMENT';

export interface InventoryMovement {
  id: string;
  type: MovementType;
  quantity: number;
  reason: string;
  createdAt: string;
  material: {
    id: string;
    code: string;
    currentStock: number;
  };
}
