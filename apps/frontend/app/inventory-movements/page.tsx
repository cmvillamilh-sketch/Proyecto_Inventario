import Link from 'next/link';
import { redirect } from 'next/navigation';
import InventoryMovementList from '../../components/inventory-movements/InventoryMovementList';
import { inventoryMovementsService } from '../../services/inventory-movements.service';
import { getServerAuth } from '../../lib/auth/server';

export const dynamic = 'force-dynamic';

export default async function InventoryMovementsPage() {
  const auth = getServerAuth();

  if (!auth) {
    redirect('/login');
  }

  const movements = await inventoryMovementsService.getAll(auth.token);

  return (
    <main>
      <h1>Movimientos de inventario</h1>
      <Link href="/inventory-movements/new">Nuevo movimiento</Link>
      <InventoryMovementList movements={movements} />
    </main>
  );
}
