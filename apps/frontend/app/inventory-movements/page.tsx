import Link from 'next/link';
import { redirect } from 'next/navigation';
import InventoryMovementList from '../../components/inventory-movements/InventoryMovementList';
import InventoryMovementFilters from '../../components/inventory-movements/InventoryMovementFilters';
import { inventoryMovementsService } from '../../services/inventory-movements.service';
import { getMaterials } from '../../services/materials.service';
import { getServerAuth } from '../../lib/auth/server';
import { InventoryMovementFilters as InventoryMovementFiltersType } from '../../types/inventory-movement';

interface InventoryMovementsPageProps {
  searchParams: {
    materialId?: string;
    type?: string;
    createdBy?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function InventoryMovementsPage({ searchParams }: InventoryMovementsPageProps) {
  const auth = getServerAuth();

  if (!auth) {
    redirect('/login');
  }

  const [materials, movements] = await Promise.all([
    getMaterials(auth.token),
    inventoryMovementsService.getAll(auth.token, searchParams as InventoryMovementFiltersType),
  ]);

  return (
    <main>
      <h1>Movimientos de inventario</h1>
      <Link href="/inventory-movements/new">Nuevo movimiento</Link>
      <InventoryMovementFilters materials={materials} currentFilters={searchParams} />
      <InventoryMovementList movements={movements} />
    </main>
  );
}
