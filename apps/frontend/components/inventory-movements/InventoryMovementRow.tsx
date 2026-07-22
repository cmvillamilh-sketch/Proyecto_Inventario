import { InventoryMovement } from '../../types/inventory-movement';

interface InventoryMovementRowProps {
  movement: InventoryMovement;
}

const movementTypeLabels: Record<InventoryMovement['type'], string> = {
  ENTRY: 'Entrada',
  EXIT: 'Salida',
  ADJUSTMENT: 'Ajuste',
};

const movementTypeBadgeClasses: Record<InventoryMovement['type'], string> = {
  ENTRY: 'bg-green-100 text-green-800',
  EXIT: 'bg-red-100 text-red-800',
  ADJUSTMENT: 'bg-amber-100 text-amber-800',
};

export default function InventoryMovementRow({ movement }: InventoryMovementRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-700">{new Date(movement.createdAt).toLocaleString()}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{movement.material.code}</td>
      <td className="px-4 py-3 text-sm text-gray-700">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${movementTypeBadgeClasses[movement.type]}`}
        >
          {movementTypeLabels[movement.type]}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{movement.quantity}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{movement.reason}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{movement.createdBy ?? '—'}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{movement.material.currentStock}</td>
    </tr>
  );
}
