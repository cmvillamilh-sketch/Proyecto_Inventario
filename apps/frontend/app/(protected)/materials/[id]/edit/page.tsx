'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '../../../../../lib/api';
import MaterialForm from '../../../../../components/materials/MaterialForm';
import StatusBanner from '../../../../../components/ui/StatusBanner';

export default function EditMaterialPage() {
  const params = useParams();
  const id = params.id as string;
  const [initial, setInitial] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch(`/materials/${id}`);
        setInitial(data || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo cargar el material.');
        setInitial(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  if (loading) return <div style={{ padding: 24, background: '#fff', borderRadius: 18, boxShadow: '0 14px 44px rgba(15, 23, 42, 0.08)' }}>Cargando material...</div>;

  if (!initial) {
    return (
      <div style={{ padding: 24, background: '#fff', borderRadius: 18, boxShadow: '0 14px 44px rgba(15, 23, 42, 0.08)' }}>
        {error ? <StatusBanner type="error" message={error} onClose={() => setError(null)} /> : null}
        <h2 style={{ margin: '0 0 12px' }}>Material no encontrado</h2>
        <p style={{ margin: 0, color: '#64748b' }}>Verifica que la identificación sea correcta o regresa a la lista de materiales.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div>
        <h2 style={{ margin: 0 }}>Editar Material</h2>
        <p style={{ margin: '8px 0 0', color: '#64748b' }}>Actualiza los datos del material seleccionado.</p>
      </div>
      <MaterialForm initial={initial} mode="edit" />
    </div>
  );
}
