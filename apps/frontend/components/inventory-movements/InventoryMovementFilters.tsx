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
  return (
    <form method="GET">
      <div>
        <label htmlFor="materialId">Material</label>
        <select id="materialId" name="materialId" defaultValue={currentFilters.materialId ?? ''}>
          <option value="">Todos</option>
          {materials.map((material) => (
            <option key={material.id} value={material.id}>
              {material.code}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="type">Tipo</label>
        <select id="type" name="type" defaultValue={currentFilters.type ?? ''}>
          <option value="">Todos</option>
          <option value="ENTRY">Entrada</option>
          <option value="EXIT">Salida</option>
          <option value="ADJUSTMENT">Ajuste</option>
        </select>
      </div>
      <div>
        <label htmlFor="createdBy">Responsable</label>
        <input id="createdBy" name="createdBy" type="text" defaultValue={currentFilters.createdBy ?? ''} />
      </div>
      <div>
        <label htmlFor="dateFrom">Desde</label>
        <input id="dateFrom" name="dateFrom" type="date" defaultValue={currentFilters.dateFrom ?? ''} />
      </div>
      <div>
        <label htmlFor="dateTo">Hasta</label>
        <input id="dateTo" name="dateTo" type="date" defaultValue={currentFilters.dateTo ?? ''} />
      </div>
      <button type="submit">Filtrar</button>
      <Link href="/inventory-movements">Limpiar filtros</Link>
    </form>
  );
}
