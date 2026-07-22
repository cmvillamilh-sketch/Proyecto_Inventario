'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';

type Props = {
  initial?: any;
  mode: 'new' | 'edit';
};

export default function MaterialForm({ initial = {}, mode }: Props) {
  const [form, setForm] = useState({
    code: initial.code || '',
    description: initial.description || '',
    category: initial.category || '',
    unitOfMeasure: initial.unitOfMeasure || '',
    minimumStock: initial.minimumStock || 0,
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'new') {
        await apiFetch('/materials', {
          method: 'POST',
          body: JSON.stringify(form),
        });
        router.push('/materials');
      } else {
        await apiFetch(`/materials/${initial.id}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
        router.push('/materials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 18, borderRadius: 12, boxShadow: '0 8px 24px rgba(2,6,23,0.06)' }}>
      <div style={{ display: 'grid', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Código</label>
          <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Descripción</label>
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }} />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Categoría</label>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>U. Medida</label>
            <input value={form.unitOfMeasure} onChange={(e) => setForm({ ...form, unitOfMeasure: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Stock mínimo</label>
          <input type="number" value={form.minimumStock} onChange={(e) => setForm({ ...form, minimumStock: Number(e.target.value) })} style={{ width: 140, padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }} />
        </div>

        {error ? <div style={{ color: '#b42318' }}>{error}</div> : null}

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={loading} style={{ padding: '10px 14px', borderRadius: 8, border: 'none', background: '#0ea5e9', color: '#fff', cursor: 'pointer' }}>{loading ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </div>
    </form>
  );
}
