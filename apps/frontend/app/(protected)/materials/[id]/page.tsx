'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiFetch } from '../../../../lib/api';

export default function MaterialDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [material, setMaterial] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await apiFetch(`/materials/${id}`);
        setMaterial(data || null);
      } catch (err) {
        console.error(err);
        setMaterial(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!material) return <div>Material no encontrado</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>{material.description}</h2>
        <div>
          <button onClick={() => router.push(`/materials/${id}/edit`)} style={{ marginRight: 8, padding: '8px 12px', borderRadius: 8, border: 'none', background: '#f59e0b', color: '#fff' }}>Editar</button>
        </div>
      </div>

      <div style={{ background: '#fff', padding: 18, borderRadius: 12, boxShadow: '0 8px 24px rgba(2,6,23,0.06)' }}>
        <p><strong>Código:</strong> {material.code}</p>
        <p><strong>Categoría:</strong> {material.category}</p>
        <p><strong>U. Medida:</strong> {material.unitOfMeasure}</p>
        <p><strong>Stock actual:</strong> {material.currentStock ?? 0}</p>
        <p><strong>Stock mínimo:</strong> {material.minimumStock}</p>
      </div>
    </div>
  );
}
