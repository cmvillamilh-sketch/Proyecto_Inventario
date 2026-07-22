import { InventoryMovement } from '../../types/inventory-movement';

interface InventoryMovementRowProps {
  movement: InventoryMovement;
}

const movementTypeLabels: Record<InventoryMovement['type'], string> = {
  ENTRY: 'Entrada',
  EXIT: 'Salida',
  ADJUSTMENT: 'Ajuste',
};

export default function InventoryMovementRow({ movement }: InventoryMovementRowProps) {
  return (
    <tr>
      <td>{new Date(movement.createdAt).toLocaleString()}</td>
      <td>{movement.material.code}</td>
      <td>{movementTypeLabels[movement.type]}</td>
      <td>{movement.quantity}</td>
      <td>{movement.reason}</td>
      <td>{movement.createdBy ?? '—'}</td>
      <td>{movement.material.currentStock}</td>
    </tr>
  );
}
