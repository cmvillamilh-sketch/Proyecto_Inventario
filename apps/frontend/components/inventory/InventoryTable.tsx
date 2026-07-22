'use client';

import { useRouter } from 'next/navigation';

type Item = {
  id: string;
  code: string;
  description: string;
  category: string;
  stock: number;
  minimumStock: number;
};

function statusFor(item: Item) {
  if (item.stock <= 0) return { label: 'Crítico', color: '#ef4444' };
  if (item.stock <= item.minimumStock) return { label: 'Bajo', color: '#f59e0b' };
  return { label: 'Normal', color: '#10b981' };
}

export default function InventoryTable({ items }: { items: Item[] }) {
  const router = useRouter();

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #e6eef8' }}>
            <th style={{ padding: 12 }}>Código</th>
            <th style={{ padding: 12 }}>Descripción</th>
            <th style={{ padding: 12 }}>Categoría</th>
            <th style={{ padding: 12 }}>Stock</th>
            <th style={{ padding: 12 }}>Stock mínimo</th>
            <th style={{ padding: 12 }}>Estado</th>
            <th style={{ padding: 12, width: 260 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => {
            const s = statusFor(it);
            return (
              <tr key={it.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: 12 }}>{it.code}</td>
                <td style={{ padding: 12 }}>{it.description}</td>
                <td style={{ padding: 12 }}>{it.category}</td>
                <td style={{ padding: 12 }}>{it.stock}</td>
                <td style={{ padding: 12 }}>{it.minimumStock}</td>
                <td style={{ padding: 12 }}><span style={{ color: s.color, fontWeight: 700 }}>{s.label}</span></td>
                <td style={{ padding: 12 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => router.push(`/inventory/movements`)} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: '#0ea5e9', color: '#fff', cursor: 'pointer' }}>Ver movimiento</button>
                    <button onClick={() => alert('Ajustar stock (simulado)')} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: '#f59e0b', color: '#fff', cursor: 'pointer' }}>Ajustar stock</button>
                    <button onClick={() => alert('Exportar (simulado)')} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: '#64748b', color: '#fff', cursor: 'pointer' }}>Exportar</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
