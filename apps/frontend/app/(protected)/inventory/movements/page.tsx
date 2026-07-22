'use client';

import { useMemo } from 'react';

export default function InventoryMovementsPage() {
  const movements = useMemo(() => [
    { id: 'm1', type: 'Entrada', date: '2026-07-20', responsible: 'Juan Pérez', quantity: 20, notes: 'Compra proveedor' },
    { id: 'm2', type: 'Salida', date: '2026-07-21', responsible: 'María López', quantity: 2, notes: 'Reemplazo fusible' },
    { id: 'm3', type: 'Salida', date: '2026-07-21', responsible: 'Carlos Díaz', quantity: 1, notes: 'Uso en mantenimiento' },
  ], []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ margin: 0 }}>Movimientos de Inventario</h2>

      <div style={{ background: '#fff', padding: 12, borderRadius: 12, boxShadow: '0 8px 24px rgba(2,6,23,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #e6eef8' }}>
              <th style={{ padding: 12 }}>Tipo</th>
              <th style={{ padding: 12 }}>Fecha</th>
              <th style={{ padding: 12 }}>Responsable</th>
              <th style={{ padding: 12 }}>Cantidad</th>
              <th style={{ padding: 12 }}>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: 12 }}>{m.type}</td>
                <td style={{ padding: 12 }}>{m.date}</td>
                <td style={{ padding: 12 }}>{m.responsible}</td>
                <td style={{ padding: 12 }}>{m.quantity}</td>
                <td style={{ padding: 12 }}>{m.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
