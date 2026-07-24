'use client';

import { useEffect, useState } from 'react';
import StatsCard from '../../components/StatsCard';

const panelStyle = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 16,
  padding: 18,
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
};

const quickActions = [
  { label: 'Registrar entrada', hint: 'Agregar movimiento de stock' },
  { label: 'Crear material', hint: 'Agregar nuevo repuesto' },
  { label: 'Generar reporte', hint: 'Ver resumen mensual' },
];

const stockLevels = [
  { label: 'Repuestos críticos', value: 78, color: '#ef4444' },
  { label: 'Stock estable', value: 64, color: '#2563eb' },
  { label: 'Consumo semanal', value: 42, color: '#14b8a6' },
];

const recentActivity = [
  'Última sincronización: hace 2 horas',
  'Materiales creados hoy: 5',
  'Usuarios activos: 8',
];

export default function HomePage() {
  const [user, setUser] = useState<{ username?: string; role?: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('mante-stock-token');
    const savedUser = localStorage.getItem('mante-stock-user');

    if (!token || !savedUser) {
      window.location.href = '/login';
      return;
    }

    setUser(JSON.parse(savedUser));
  }, []);

  if (!user) return null;

  const stats = {
    materials: 124,
    inventory: 560,
    users: 8,
    reports: 3,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <section
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          background: 'linear-gradient(135deg, #0f172a 0%, #2563eb 100%)',
          color: '#fff',
          padding: 20,
          borderRadius: 18,
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Bienvenido</p>
          <h1 style={{ margin: '4px 0 0', fontSize: 24 }}>{user.username}</h1>
          <p style={{ margin: '8px 0 0', maxWidth: 560, opacity: 0.9 }}>
            Aquí tienes un resumen claro del estado operativo del inventario y las tareas más relevantes del día.
          </p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.14)', padding: '10px 14px', borderRadius: 999, minWidth: 170 }}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>Estado del sistema</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>Operativo • 99.2%</div>
        </div>
      </section>

      <section style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <StatsCard title="Materiales" value={stats.materials} />
        <StatsCard title="Inventario" value={stats.inventory} />
        <StatsCard title="Usuarios" value={stats.users} />
        <StatsCard title="Reportes" value={stats.reports} />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.9fr', gap: 16, alignItems: 'start' }}>
        <div style={panelStyle as React.CSSProperties}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Resumen de inventario</h3>
            <span style={{ color: '#64748b', fontSize: 13 }}>Última actualización hoy</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {stockLevels.map((item) => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#334155', marginBottom: 4 }}>
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div style={{ height: 10, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
                  <div style={{ width: `${item.value}%`, height: '100%', borderRadius: 999, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={panelStyle as React.CSSProperties}>
          <h3 style={{ margin: 0, marginBottom: 12 }}>Acciones rápidas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {quickActions.map((action) => (
              <button
                key={action.label}
                style={{
                  textAlign: 'left',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '12px 14px',
                  background: '#f8fafc',
                  cursor: 'pointer',
                  color: '#0f172a',
                }}
              >
                <div style={{ fontWeight: 600 }}>{action.label}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{action.hint}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={panelStyle as React.CSSProperties}>
          <h3 style={{ marginTop: 0 }}>Actividad reciente</h3>
          <ul style={{ margin: '12px 0 0', paddingLeft: 18, color: '#475467', lineHeight: 1.7 }}>
            {recentActivity.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={panelStyle as React.CSSProperties}>
          <h3 style={{ marginTop: 0 }}>Estado del sistema</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
              <span>Conexión con la BD</span>
              <strong style={{ color: '#16a34a' }}>Normal</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
              <span>Autenticación</span>
              <strong style={{ color: '#2563eb' }}>Activa</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
              <span>Sincronización</span>
              <strong style={{ color: '#f59e0b' }}>Pendiente</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
