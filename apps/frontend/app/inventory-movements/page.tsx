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
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Movimientos de inventario</h1>
      <div className="mb-6">
        <Link
          href="/inventory-movements/new"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Nuevo movimiento
        </Link>
      </div>
      <InventoryMovementFilters materials={materials} currentFilters={searchParams} />
      <InventoryMovementList movements={movements} />
    </main>
  );
}
