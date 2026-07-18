import InventoryMovementTable from './InventoryMovementTable';
import { InventoryMovement } from '../../types/inventory-movement';

interface InventoryMovementListProps {
  movements: InventoryMovement[];
}

export default function InventoryMovementList({ movements }: InventoryMovementListProps) {
  return <InventoryMovementTable movements={movements} />;
}
