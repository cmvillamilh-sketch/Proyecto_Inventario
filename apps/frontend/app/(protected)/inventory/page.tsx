'use client';

import { useEffect, useMemo, useState } from 'react';
import InventoryFilters from '../../../components/inventory/InventoryFilters';
import InventoryTable from '../../../components/inventory/InventoryTable';
import InventoryMovementForm from '../../../components/inventory/InventoryMovementForm';
import StatusBanner from '../../../components/ui/StatusBanner';
import StatsCard from '../../../components/StatsCard';
import { apiFetch } from '../../../lib/api';

type Movement = {
  id: string;
  date: string;
  material: { id: string; code: string; description: string };
  movementType: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  user: string;
  observation: string;
  createdAt: string;
};

type MaterialOption = {
  id: string;
  code: string;
  description: string;
};

export default function InventoryPage() {
  const [q, setQ] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [movements, setMovements] = useState<Movement[]>([]);
  const [materials, setMaterials] = useState<MaterialOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadMaterials() {
    try {
      const data = await apiFetch('/materials');
      const options = Array.isArray(data)
        ? data.map((item: any) => ({ id: item.id, code: item.code, description: item.description }))
        : [];
      setMaterials(options);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los materiales.');
    }
  }

  async function loadMovements() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/inventory');
      const items = Array.isArray(data)
        ? data.map((item: any) => ({
            id: item.id,
            date: new Date(item.createdAt).toISOString().split('T')[0],
            material: item.material,
            movementType: item.movementType,
            quantity: item.quantity,
            previousStock: item.previousStock,
            newStock: item.newStock,
            user: item.user,
            observation: item.observation,
            createdAt: item.createdAt,
          }))
        : [];
      setMovements(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los movimientos.');
      setMovements([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMaterials();
    loadMovements();
  }, []);

  const filtered = useMemo(() => {
    return movements.filter((item) => {
      const query = q.toLowerCase();
      const matchesQuery =
        !query ||
        [item.date, item.material.code, item.material.description, item.movementType, item.user, item.observation].some((value) => value.toLowerCase().includes(query));
      const matchesType = !typeFilter || item.movementType === typeFilter;
      const matchesFrom = !dateFrom || item.date >= dateFrom;
      const matchesTo = !dateTo || item.date <= dateTo;
      return matchesQuery && matchesType && matchesFrom && matchesTo;
    });
  }, [movements, q, typeFilter, dateFrom, dateTo]);

  const stats = useMemo(
    () => ({
      total: movements.length,
      entries: movements.filter((item) => item.movementType === 'Entrada').length,
      exits: movements.filter((item) => item.movementType === 'Salida').length,
      adjustments: movements.filter((item) => item.movementType === 'Ajuste').length,
    }),
    [movements],
  );

  async function handleCreateMovement(payload: { materialId: string; type: string; quantity: number; observation: string; user: string }) {
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      await apiFetch('/inventory', {
        method: 'POST',
        body: JSON.stringify({
          materialId: payload.materialId,
          movementType: payload.type,
          quantity: payload.quantity,
          observation: payload.observation,
          user: payload.user,
        }),
      });

      await loadMovements();
      setSuccess('Movimiento registrado correctamente.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el movimiento.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 540px', display: 'grid', gap: 16 }}>
          <div>
            <h2 style={{ margin: 0 }}>Inventario</h2>
            <p style={{ margin: '8px 0 0', color: '#64748b' }}>Gestiona los movimientos de inventario y registra entradas, salidas y ajustes de stock.</p>
          </div>

          <section style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <StatsCard title="Movimientos" value={stats.total} />
            <StatsCard title="Entradas" value={stats.entries} />
            <StatsCard title="Salidas" value={stats.exits} />
            <StatsCard title="Ajustes" value={stats.adjustments} />
          </section>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <InventoryFilters
              q={q}
              setQ={setQ}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              dateFrom={dateFrom}
              setDateFrom={setDateFrom}
              dateTo={dateTo}
              setDateTo={setDateTo}
            />
          </div>

          {success ? <StatusBanner type="success" message={success} onClose={() => setSuccess(null)} /> : null}
          {error ? <StatusBanner type="error" message={error} onClose={() => setError(null)} /> : null}

          <section>
            {loading ? (
              <div style={{ padding: 24, background: '#fff', borderRadius: 18, boxShadow: '0 14px 44px rgba(15, 23, 42, 0.08)' }}>Cargando movimientos...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 24, background: '#fff', borderRadius: 18, boxShadow: '0 14px 44px rgba(15, 23, 42, 0.08)' }}>
                <h3 style={{ marginTop: 0 }}>No hay movimientos</h3>
                <p style={{ margin: 0, color: '#64748b' }}>Registra el primer movimiento para comenzar a rastrear el stock.</p>
              </div>
            ) : (
              <InventoryTable items={filtered} />
            )}
          </section>
        </div>

        <div style={{ width: '100%', maxWidth: 520 }}>
          <InventoryMovementForm materials={materials} onSubmit={handleCreateMovement} />
          {saving ? <p style={{ margin: '12px 0 0', color: '#64748b' }}>Guardando movimiento...</p> : null}
        </div>
      </div>
    </div>
  );
}
