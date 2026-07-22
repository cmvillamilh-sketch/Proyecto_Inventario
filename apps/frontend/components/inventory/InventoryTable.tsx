'use client';

import { useRouter } from 'next/navigation';

type Movement = {
  id: string;
  date: string;
  material: {
    id: string;
    code: string;
    description: string;
  };
  movementType: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  user: string;
  observation: string;
};

export default function InventoryTable({ items }: { items: Movement[] }) {
  const router = useRouter();

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #e6eef8' }}>
            <th style={{ padding: 14 }}>Fecha</th>
            <th style={{ padding: 14 }}>Material</th>
            <th style={{ padding: 14 }}>Tipo de movimiento</th>
            <th style={{ padding: 14 }}>Cantidad</th>
            <th style={{ padding: 14 }}>Stock anterior</th>
            <th style={{ padding: 14 }}>Stock nuevo</th>
            <th style={{ padding: 14 }}>Usuario</th>
            <th style={{ padding: 14 }}>Observación</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: 14 }}>{item.date}</td>
              <td style={{ padding: 14 }}>{`${item.material.code} - ${item.material.description}`}</td>
              <td style={{ padding: 14 }}>{item.movementType}</td>
              <td style={{ padding: 14 }}>{item.quantity}</td>
              <td style={{ padding: 14 }}>{item.previousStock}</td>
              <td style={{ padding: 14 }}>{item.newStock}</td>
              <td style={{ padding: 14 }}>{item.user}</td>
              <td style={{ padding: 14 }}>{item.observation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
