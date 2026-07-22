'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../lib/api';
import MaterialsTable from '../../../components/materials/MaterialsTable';
import SearchInput from '../../../components/ui/SearchInput';
import StatusBanner from '../../../components/ui/StatusBanner';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/materials');
      setMaterials(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar la lista de materiales.');
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleConfirmDelete(id: string) {
    setConfirmDeleteId(id);
  }

  async function handleDelete() {
    if (!confirmDeleteId) return;
    setError(null);
    try {
      await apiFetch(`/materials/${confirmDeleteId}`, { method: 'DELETE' });
      setSuccess('Material eliminado correctamente.');
      setConfirmDeleteId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el material.');
    }
  }

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return materials.filter((m) => {
      return (
        !term ||
        m.code.toLowerCase().includes(term) ||
        m.description.toLowerCase().includes(term) ||
        (m.category || '').toLowerCase().includes(term)
      );
    });
  }, [materials, q]);

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div>
          <h2 style={{ margin: 0 }}>Materiales</h2>
          <p style={{ margin: '8px 0 0', color: '#64748b' }}>Gestiona tus materiales con búsqueda, edición y eliminación segura.</p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <SearchInput value={q} onChange={setQ} placeholder="Buscar por código, descripción o categoría" />
          <Link href="/materials/new">
            <button style={{ padding: '12px 18px', borderRadius: 12, border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer' }}>Nuevo Material</button>
          </Link>
        </div>
      </div>

      {error ? <StatusBanner type="error" message={error} onClose={() => setError(null)} /> : null}
      {success ? <StatusBanner type="success" message={success} onClose={() => setSuccess(null)} /> : null}

      {loading ? (
        <div style={{ padding: 24, background: '#fff', borderRadius: 18, boxShadow: '0 14px 44px rgba(15, 23, 42, 0.08)' }}>Cargando materiales...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 24, background: '#fff', borderRadius: 18, boxShadow: '0 14px 44px rgba(15, 23, 42, 0.08)' }}>
          <p style={{ margin: 0, color: '#475569' }}>No se han encontrado materiales.</p>
          {materials.length > 0 ? <p style={{ margin: '8px 0 0', color: '#64748b' }}>Ajusta tu búsqueda para encontrar material por código, descripción o categoría.</p> : <p style={{ margin: '8px 0 0', color: '#64748b' }}>Crea un nuevo material para comenzar.</p>}
        </div>
      ) : (
        <MaterialsTable items={filtered} onDelete={handleConfirmDelete} />
      )}

      <ConfirmDialog
        open={Boolean(confirmDeleteId)}
        title="Eliminar material"
        message="¿Estás seguro de que deseas eliminar este material? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
