'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../lib/api';
import MaterialsTable from '../../../components/materials/MaterialsTable';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetch('/materials');
      setMaterials(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleDelete(id: string) {
    if (!confirm('¿Eliminar material?')) return;
    apiFetch(`/materials/${id}`, { method: 'DELETE' })
      .then(() => load())
      .catch((err) => alert(err instanceof Error ? err.message : String(err)));
  }

  const filtered = materials.filter((m) => {
    const term = q.toLowerCase();
    return !term || m.code.toLowerCase().includes(term) || m.description.toLowerCase().includes(term) || (m.category || '').toLowerCase().includes(term);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Materiales</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input placeholder="Buscar..." value={q} onChange={(e) => setQ(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #e2e8f0' }} />
          <Link href="/materials/new"><button style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#10b981', color: '#fff' }}>Nuevo Material</button></Link>
        </div>
      </div>

      {loading ? <div>Cargando...</div> : <MaterialsTable items={filtered} onDelete={handleDelete} />}
    </div>
  );
}
