import Link from 'next/link';
import { Material } from '../../types/material';

interface InventoryMovementFiltersProps {
  materials: Material[];
  currentFilters: {
    materialId?: string;
    type?: string;
    createdBy?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export default function InventoryMovementFilters({ materials, currentFilters }: InventoryMovementFiltersProps) {
  const fieldClassName =
    'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none';
  const labelClassName = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <form method="GET" className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end mb-6">
      <div>
        <label htmlFor="materialId" className={labelClassName}>
          Material
        </label>
        <select id="materialId" name="materialId" defaultValue={currentFilters.materialId ?? ''} className={fieldClassName}>
          <option value="">Todos</option>
          {materials.map((material) => (
            <option key={material.id} value={material.id}>
              {material.code}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="type" className={labelClassName}>
          Tipo
        </label>
        <select id="type" name="type" defaultValue={currentFilters.type ?? ''} className={fieldClassName}>
          <option value="">Todos</option>
          <option value="ENTRY">Entrada</option>
          <option value="EXIT">Salida</option>
          <option value="ADJUSTMENT">Ajuste</option>
        </select>
      </div>
      <div>
        <label htmlFor="createdBy" className={labelClassName}>
          Responsable
        </label>
        <input
          id="createdBy"
          name="createdBy"
          type="text"
          defaultValue={currentFilters.createdBy ?? ''}
          className={fieldClassName}
        />
      </div>
      <div>
        <label htmlFor="dateFrom" className={labelClassName}>
          Desde
        </label>
        <input
          id="dateFrom"
          name="dateFrom"
          type="date"
          defaultValue={currentFilters.dateFrom ?? ''}
          className={fieldClassName}
        />
      </div>
      <div>
        <label htmlFor="dateTo" className={labelClassName}>
          Hasta
        </label>
        <input id="dateTo" name="dateTo" type="date" defaultValue={currentFilters.dateTo ?? ''} className={fieldClassName} />
      </div>
      <div className="sm:col-span-5 flex items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Filtrar
        </button>
        <Link
          href="/inventory-movements"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Limpiar filtros
        </Link>
      </div>
    </form>
  );
}
