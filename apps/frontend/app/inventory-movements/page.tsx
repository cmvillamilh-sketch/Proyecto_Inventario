import Link from 'next/link';
import InventoryMovementList from '../../components/inventory-movements/InventoryMovementList';
import { inventoryMovementsService } from '../../services/inventory-movements.service';

export const dynamic = 'force-dynamic';

export default async function InventoryMovementsPage() {
  const movements = await inventoryMovementsService.getAll();

  return (
    <main>
      <h1>Movimientos de inventario</h1>
      <Link href="/inventory-movements/new">Nuevo movimiento</Link>
      <InventoryMovementList movements={movements} />
    </main>
  );
}
