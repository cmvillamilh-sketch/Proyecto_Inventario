import { MovementType } from './inventory-movement';

export interface CreateInventoryMovementDto {
  materialId: string;
  type: MovementType;
  quantity: number;
  reason: string;
}
