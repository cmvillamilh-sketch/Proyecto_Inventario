'use client';

import { useEffect, useState } from 'react';
import StatsCard from '../../components/StatsCard';

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

  // Simulated data for dashboard
  const stats = {
    materials: 124,
    inventory: 560,
    users: 8,
    reports: 3,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <section>
        <h1 style={{ margin: 0 }}>Panel de Control</h1>
        <p style={{ marginTop: 8, color: '#6b7280' }}>Resumen rápido del sistema para <strong>{user.username}</strong>.</p>
      </section>

      <section style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <StatsCard title="Materiales" value={stats.materials} />
        <StatsCard title="Inventario" value={stats.inventory} />
        <StatsCard title="Usuarios" value={stats.users} />
        <StatsCard title="Reportes" value={stats.reports} />
      </section>

      <section style={{ marginTop: 8 }}>
        <div style={{ background: '#fff', padding: 18, borderRadius: 12, boxShadow: '0 8px 24px rgba(2,6,23,0.06)' }}>
          <h3 style={{ marginTop: 0 }}>Actividad reciente (simulada)</h3>
          <ul style={{ marginTop: 12, color: '#475467' }}>
            <li>Última sincronización: hace 2 horas</li>
            <li>Materiales creados hoy: 5</li>
            <li>Usuarios activos: {stats.users}</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
