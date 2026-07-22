'use client';

import { ChangeEvent } from 'react';

export default function InventoryFilters({ q, setQ, category, setCategory, categories }: {
  q: string;
  setQ: (s: string) => void;
  category: string;
  setCategory: (s: string) => void;
  categories: string[];
}) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <input placeholder="Buscar..." value={q} onChange={(e: ChangeEvent<HTMLInputElement>) => setQ(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #e2e8f0' }} />

      <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #e2e8f0' }}>
        <option value="">Todas las categorías</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}
