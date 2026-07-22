import InventoryMovementRow from './InventoryMovementRow';
import { InventoryMovement } from '../../types/inventory-movement';

interface InventoryMovementTableProps {
  movements: InventoryMovement[];
}

export default function InventoryMovementTable({ movements }: InventoryMovementTableProps) {
  if (movements.length === 0) {
    return <p>No hay movimientos registrados.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Material</th>
          <th>Tipo</th>
          <th>Cantidad</th>
          <th>Motivo</th>
          <th>Responsable</th>
          <th>Stock actual</th>
        </tr>
      </thead>
      <tbody>
        {movements.map((movement) => (
          <InventoryMovementRow key={movement.id} movement={movement} />
        ))}
      </tbody>
    </table>
  );
}
