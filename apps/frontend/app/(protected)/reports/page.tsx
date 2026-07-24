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

const stockSeries = [
  { label: 'Repuestos', value: 72, color: '#2563eb' },
  { label: 'Herramientas', value: 54, color: '#14b8a6' },
  { label: 'Consumibles', value: 38, color: '#f59e0b' },
];

const movementSeries = [
  { label: 'Entradas', value: 38, color: '#22c55e' },
  { label: 'Salidas', value: 24, color: '#f97316' },
  { label: 'Ajustes', value: 14, color: '#3b82f6' },
];

const chartCardStyle = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 16,
  padding: 16,
  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
};

function StockBarChart() {
  const max = Math.max(...stockSeries.map((item) => item.value));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {stockSeries.map((item) => (
        <div key={item.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#475569', marginBottom: 4 }}>
            <span>{item.label}</span>
            <span>{item.value}%</span>
          </div>
          <div style={{ height: 10, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
            <div
              style={{
                width: `${(item.value / max) * 100}%`,
                height: '100%',
                borderRadius: 999,
                background: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function MovementDonutChart() {
  const total = movementSeries.reduce((sum, item) => sum + item.value, 0);
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <svg width="140" height="140" viewBox="0 0 120 120" role="img" aria-label="Distribución de movimientos">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="18" />
        {movementSeries.map((item) => {
          const strokeLength = (item.value / total) * circumference;
          const circle = (
            <circle
              key={item.label}
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 60 60)"
            />
          );
          offset += strokeLength;
          return circle;
        })}
        <circle cx="60" cy="60" r="24" fill="#ffffff" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {movementSeries.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, display: 'inline-block' }} />
            <span style={{ color: '#334155', fontSize: 13 }}>{item.label}: {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => reports.filter((report) => report.name.toLowerCase().includes(query.toLowerCase()) || report.type.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0 }}>Reportes</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <SearchBar value={query} onChange={setQuery} placeholder="Buscar reporte..." />
          <ActionButton label="Generar reporte" variant="secondary" onClick={() => alert('Simulado')} />
        </div>
      </div>

      <section style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <StatsCard title="Reportes disponibles" value={reports.length} />
        <StatsCard title="Listos" value={reports.filter((item) => item.status === 'Listo').length} />
        <StatsCard title="En preparación" value={reports.filter((item) => item.status !== 'Listo').length} />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <div style={chartCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16 }}>Stock por categoría</h3>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>Estado actual del inventario</p>
            </div>
          </div>
          <StockBarChart />
        </div>

        <div style={chartCardStyle}>
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>Movimientos del mes</h3>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>Entradas, salidas y ajustes</p>
          </div>
          <MovementDonutChart />
        </div>
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
