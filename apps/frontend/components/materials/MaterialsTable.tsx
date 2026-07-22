'use client';

import { useRouter } from 'next/navigation';

type Material = {
  id: string;
  code: string;
  description: string;
  category: string;
  unitOfMeasure: string;
  minimumStock: number;
  currentStock?: number;
};

export default function MaterialsTable({ items, onDelete }: { items: Material[]; onDelete: (id: string) => void }) {
  const router = useRouter();

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #e6eef8' }}>
            <th style={{ padding: 12 }}>Código</th>
            <th style={{ padding: 12 }}>Descripción</th>
            <th style={{ padding: 12 }}>Categoría</th>
            <th style={{ padding: 12 }}>U. Medida</th>
            <th style={{ padding: 12 }}>Stock</th>
            <th style={{ padding: 12 }}>Mínimo</th>
            <th style={{ padding: 12, width: 220 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((m) => (
            <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: 12 }}>{m.code}</td>
              <td style={{ padding: 12 }}>{m.description}</td>
              <td style={{ padding: 12 }}>{m.category}</td>
              <td style={{ padding: 12 }}>{m.unitOfMeasure}</td>
              <td style={{ padding: 12 }}>{m.currentStock ?? 0}</td>
              <td style={{ padding: 12 }}>{m.minimumStock}</td>
              <td style={{ padding: 12 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => router.push(`/materials/${m.id}`)} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: '#0ea5e9', color: '#fff', cursor: 'pointer' }}>Ver</button>
                  <button onClick={() => router.push(`/materials/${m.id}/edit`)} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: '#f59e0b', color: '#fff', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => onDelete(m.id)} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer' }}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
