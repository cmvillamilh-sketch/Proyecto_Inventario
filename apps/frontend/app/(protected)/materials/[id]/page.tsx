'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiFetch } from '../../../../lib/api';
import StatusBanner from '../../../../components/ui/StatusBanner';

export default function MaterialDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [material, setMaterial] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch(`/materials/${id}`);
        setMaterial(data || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo cargar el material.');
        setMaterial(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  if (loading) return <div style={{ padding: 24, background: '#fff', borderRadius: 18, boxShadow: '0 14px 44px rgba(15, 23, 42, 0.08)' }}>Cargando material...</div>;

  if (!material) {
    return (
      <div style={{ padding: 24, background: '#fff', borderRadius: 18, boxShadow: '0 14px 44px rgba(15, 23, 42, 0.08)' }}>
        {error ? <StatusBanner type="error" message={error} onClose={() => setError(null)} /> : null}
        <h2 style={{ margin: '0 0 12px' }}>Material no encontrado</h2>
        <p style={{ margin: 0, color: '#64748b' }}>Verifica que el material exista o regresa a la lista de materiales.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <h2 style={{ margin: 0 }}>{material.description}</h2>
          <p style={{ margin: '8px 0 0', color: '#64748b' }}>Detalle completo del material seleccionado.</p>
        </div>
        <button onClick={() => router.push(`/materials/${id}/edit`)} style={{ padding: '12px 18px', borderRadius: 12, border: 'none', background: '#f59e0b', color: '#fff', cursor: 'pointer' }}>
          Editar material
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
        <div style={{ background: '#fff', padding: 20, borderRadius: 18, boxShadow: '0 14px 44px rgba(15, 23, 42, 0.08)' }}>
          <h3 style={{ margin: 0, fontSize: 16, color: '#0f172a' }}>Identificación</h3>
          <p style={{ margin: '12px 0 0', color: '#475569' }}><strong>Código:</strong> {material.code}</p>
          <p style={{ margin: '8px 0 0', color: '#475569' }}><strong>Descripción:</strong> {material.description}</p>
        </div>

        <div style={{ background: '#fff', padding: 20, borderRadius: 18, boxShadow: '0 14px 44px rgba(15, 23, 42, 0.08)' }}>
          <h3 style={{ margin: 0, fontSize: 16, color: '#0f172a' }}>Categoría</h3>
          <p style={{ margin: '12px 0 0', color: '#475569' }}><strong>Categoría:</strong> {material.category}</p>
          <p style={{ margin: '8px 0 0', color: '#475569' }}><strong>Unidad de medida:</strong> {material.unitOfMeasure}</p>
        </div>

        <div style={{ background: '#fff', padding: 20, borderRadius: 18, boxShadow: '0 14px 44px rgba(15, 23, 42, 0.08)' }}>
          <h3 style={{ margin: 0, fontSize: 16, color: '#0f172a' }}>Stock</h3>
          <p style={{ margin: '12px 0 0', color: '#475569' }}><strong>Stock actual:</strong> {material.currentStock ?? 0}</p>
          <p style={{ margin: '8px 0 0', color: '#475569' }}><strong>Stock mínimo:</strong> {material.minimumStock}</p>
        </div>
      </div>
    </div>
  );
}
