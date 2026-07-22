import InventoryMovementRow from './InventoryMovementRow';
import { InventoryMovement } from '../../types/inventory-movement';

interface InventoryMovementTableProps {
  movements: InventoryMovement[];
}

export default function InventoryMovementTable({ movements }: InventoryMovementTableProps) {
  if (movements.length === 0) {
    return <p className="text-sm text-gray-500">No hay movimientos registrados.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Fecha</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Material</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Tipo</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Cantidad</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Motivo</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Responsable
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Stock actual
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {movements.map((movement) => (
            <InventoryMovementRow key={movement.id} movement={movement} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
