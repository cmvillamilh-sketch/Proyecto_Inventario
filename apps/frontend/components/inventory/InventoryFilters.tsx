'use client';

import { ChangeEvent } from 'react';

type Props = {
  q: string;
  setQ: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;
};

const movementTypes = ['Todas', 'Entrada', 'Salida', 'Ajuste'];

export default function InventoryFilters({ q, setQ, typeFilter, setTypeFilter, dateFrom, setDateFrom, dateTo, setDateTo }: Props) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <input
        placeholder="Buscar movimientos..."
        value={q}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
        style={{ minWidth: 220, padding: 12, borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc' }}
      />

      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        style={{ minWidth: 160, padding: 12, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}
      >
        {movementTypes.map((type) => (
          <option key={type} value={type === 'Todas' ? '' : type}>{type}</option>
        ))}
      </select>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: '#475569' }}>
        Desde
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          style={{ padding: 12, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}
        />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: '#475569' }}>
        Hasta
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          style={{ padding: 12, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}
        />
      </label>
    </div>
  );
}
