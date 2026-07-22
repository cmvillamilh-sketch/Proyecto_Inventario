'use client';

import { useMemo, useState } from 'react';
import InventoryFilters from '../../../components/inventory/InventoryFilters';
import InventoryTable from '../../../components/inventory/InventoryTable';
import StatsCard from '../../../components/StatsCard';

export default function InventoryPage() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');

  // Simulated inventory data
  const items = useMemo(() => [
    { id: '1', code: 'MAT-001', description: 'Fusible 10A', category: 'Eléctrico', stock: 12, minimumStock: 5 },
    { id: '2', code: 'MAT-002', description: 'Tornillo M8', category: 'Mecánico', stock: 3, minimumStock: 10 },
    { id: '3', code: 'MAT-003', description: 'Líquido refrigerante', category: 'Químico', stock: 0, minimumStock: 2 },
    { id: '4', code: 'MAT-004', description: 'Cinta aislante', category: 'Eléctrico', stock: 25, minimumStock: 5 },
  ], []);

  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);

  const filtered = items.filter((it) => {
    const term = q.toLowerCase();
    if (category && it.category !== category) return false;
    return !term || it.code.toLowerCase().includes(term) || it.description.toLowerCase().includes(term) || it.category.toLowerCase().includes(term);
  });

  const stats = useMemo(() => ({ materials: items.length, low: items.filter((it) => it.stock <= it.minimumStock && it.stock > 0).length, critical: items.filter((it) => it.stock <= 0).length }), [items]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Inventario</h2>

        <div style={{ display: 'flex', gap: 12 }}>
          <InventoryFilters q={q} setQ={setQ} category={category} setCategory={setCategory} categories={categories} />
        </div>
      </div>

      <section style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <StatsCard title="Materiales" value={stats.materials} />
        <StatsCard title="Bajo stock" value={stats.low} />
        <StatsCard title="Crítico" value={stats.critical} />
      </section>

      <section>
        <InventoryTable items={filtered} />
      </section>
    </div>
  );
}
