'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Table from '../ui/Table';
import SortLabel from '../ui/SortLabel';

type Material = {
  id: string;
  code: string;
  description: string;
  category: string;
  unitOfMeasure: string;
  minimumStock: number;
  currentStock?: number;
};

type SortColumn = 'code' | 'description' | 'category' | 'unitOfMeasure' | 'currentStock' | 'minimumStock';

const headers: { label: string; key: SortColumn | 'actions' }[] = [
  { label: 'Código', key: 'code' },
  { label: 'Descripción', key: 'description' },
  { label: 'Categoría', key: 'category' },
  { label: 'U. Medida', key: 'unitOfMeasure' },
  { label: 'Stock', key: 'currentStock' },
  { label: 'Mínimo', key: 'minimumStock' },
  { label: 'Acciones', key: 'actions' },
];

export default function MaterialsTable({ items, onDelete }: { items: Material[]; onDelete: (id: string) => void }) {
  const router = useRouter();
  const [sortColumn, setSortColumn] = useState<SortColumn>('code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const valueA = a[sortColumn] ?? '';
      const valueB = b[sortColumn] ?? '';

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }

      return sortDirection === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  }, [items, sortColumn, sortDirection]);

  function handleSort(column: SortColumn) {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      return;
    }

    setSortColumn(column);
    setSortDirection('asc');
  }

  return (
    <Table
      headers={headers.map((header) =>
        header.key === 'actions' ? (
          header.label
        ) : (
          <SortLabel
            key={header.key}
            label={header.label}
            active={sortColumn === header.key}
            direction={sortDirection}
            onClick={() => handleSort(header.key as SortColumn)}
          />
        ),
      )}
    >
      {sortedItems.map((m) => (
        <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
          <td style={{ padding: 16 }}>{m.code}</td>
          <td style={{ padding: 16 }}>{m.description}</td>
          <td style={{ padding: 16 }}>{m.category}</td>
          <td style={{ padding: 16 }}>{m.unitOfMeasure}</td>
          <td style={{ padding: 16 }}>{m.currentStock ?? 0}</td>
          <td style={{ padding: 16 }}>{m.minimumStock}</td>
          <td style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={() => router.push(`/materials/${m.id}`)} style={{ padding: '8px 12px', borderRadius: 10, border: 'none', background: '#0ea5e9', color: '#fff', cursor: 'pointer' }}>Ver</button>
              <button onClick={() => router.push(`/materials/${m.id}/edit`)} style={{ padding: '8px 12px', borderRadius: 10, border: 'none', background: '#f59e0b', color: '#fff', cursor: 'pointer' }}>Editar</button>
              <button onClick={() => onDelete(m.id)} style={{ padding: '8px 12px', borderRadius: 10, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer' }}>Eliminar</button>
            </div>
          </td>
        </tr>
      ))}
    </Table>
  );
}
