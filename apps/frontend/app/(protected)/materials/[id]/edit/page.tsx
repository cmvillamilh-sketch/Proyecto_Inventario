'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '../../../../../lib/api';
import MaterialForm from '../../../../../components/materials/MaterialForm';

export default function EditMaterialPage() {
  const params = useParams();
  const id = params.id as string;
  const [initial, setInitial] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await apiFetch(`/materials/${id}`);
        setInitial(data || null);
      } catch (err) {
        console.error(err);
        setInitial(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!initial) return <div>Material no encontrado</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ margin: 0 }}>Editar Material</h2>
      <MaterialForm initial={initial} mode="edit" />
    </div>
  );
}
