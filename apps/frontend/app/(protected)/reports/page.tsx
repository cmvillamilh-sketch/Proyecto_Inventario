'use client';

import { useMemo, useState } from 'react';
import SearchBar from '../../../components/ui/SearchBar';
import ActionButton from '../../../components/ui/ActionButton';
import DataTable from '../../../components/ui/DataTable';
import StatsCard from '../../../components/StatsCard';

const reports = [
  { id: 'r1', name: 'Stock general', type: 'Inventario', created: '2026-07-20', status: 'Listo' },
  { id: 'r2', name: 'Materiales críticos', type: 'Inventario', created: '2026-07-18', status: 'Listo' },
  { id: 'r3', name: 'Usuarios activos', type: 'Usuarios', created: '2026-07-19', status: 'En preparación' },
];

export default function ReportsPage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => reports.filter((report) => report.name.toLowerCase().includes(query.toLowerCase()) || report.type.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Reportes</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <SearchBar value={query} onChange={setQuery} placeholder="Buscar reporte..." />
          <ActionButton label="Generar reporte" variant="secondary" onClick={() => alert('Simulado')} />
        </div>
      </div>

      <section style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <StatsCard title="Reportes disponibles" value={reports.length} />
        <StatsCard title="Listos" value={reports.filter((item) => item.status === 'Listo').length} />
        <StatsCard title="En preparación" value={reports.filter((item) => item.status !== 'Listo').length} />
      </section>

      <DataTable
        headers={['Nombre', 'Tipo', 'Creado', 'Estado', 'Acciones']}
        rows={filtered.map((report) => (
          <tr key={report.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
            <td style={{ padding: 14 }}>{report.name}</td>
            <td style={{ padding: 14 }}>{report.type}</td>
            <td style={{ padding: 14 }}>{report.created}</td>
            <td style={{ padding: 14 }}>{report.status}</td>
            <td style={{ padding: 14, display: 'flex', gap: 8 }}>
              <ActionButton label="Ver" variant="ghost" onClick={() => alert('Simulado')} />
              <ActionButton label="Exportar" variant="secondary" onClick={() => alert('Simulado')} />
            </td>
          </tr>
        ))}
      />
    </div>
  );
}
