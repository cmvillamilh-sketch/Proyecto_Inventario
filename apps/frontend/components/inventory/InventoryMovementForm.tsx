'use client';

import { useMemo, useState } from 'react';
import FormField from '../ui/FormField';
import StatusBanner from '../ui/StatusBanner';

type MaterialOption = {
  id: string;
  code: string;
  description: string;
};

const movementTypes = ['Entrada', 'Salida', 'Ajuste'];

type Props = {
  materials: MaterialOption[];
  onSubmit: (payload: { materialId: string; type: string; quantity: number; observation: string; user: string }) => void;
};

export default function InventoryMovementForm({ materials, onSubmit }: Props) {
  const [form, setForm] = useState({
    materialId: materials[0]?.id || '',
    type: movementTypes[0],
    quantity: 0,
    observation: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isValid = useMemo(() => {
    return form.materialId.trim().length > 0 && form.type.trim().length > 0 && form.quantity > 0;
  }, [form]);

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!form.materialId.trim()) nextErrors.materialId = 'Selecciona un material.';
    if (!form.type.trim()) nextErrors.type = 'Selecciona un tipo de movimiento.';
    if (!form.quantity || form.quantity <= 0) nextErrors.quantity = 'La cantidad debe ser mayor que cero.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!validate()) {
      setMessage({ type: 'error', text: 'Corrige los errores del formulario.' });
      return;
    }

    onSubmit({
      materialId: form.materialId,
      type: form.type,
      quantity: form.quantity,
      observation: form.observation,
      user: 'admin',
    });
    setMessage({ type: 'success', text: 'Movimiento registrado correctamente.' });
    setForm({ materialId: materials[0]?.id || '', type: movementTypes[0], quantity: 0, observation: '' });
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 18, width: '100%', background: '#fff', padding: 24, borderRadius: 18, boxShadow: '0 14px 44px rgba(15, 23, 42, 0.08)' }}>
      <h3 style={{ margin: 0 }}>Registrar movimiento</h3>
      {message ? <StatusBanner type={message.type} message={message.text} onClose={() => setMessage(null)} /> : null}

      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: '1fr 1fr', minWidth: 0 }}>
        <FormField label="Material" error={errors.materialId}>
          <select
            value={form.materialId}
            onChange={(e) => setForm({ ...form, materialId: e.target.value })}
            style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #cbd5e1' }}
          >
            {materials.map((material) => (
              <option key={material.id} value={material.id}>
                {material.code} - {material.description}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Tipo de movimiento" error={errors.type}>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #cbd5e1' }}
          >
            {movementTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </FormField>
      </div>

      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: '1fr 1fr', minWidth: 0 }}>
        <FormField label="Cantidad" error={errors.quantity}>
          <input
            type="number"
            min={1}
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
            style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #cbd5e1' }}
          />
        </FormField>

        <FormField label="Usuario">
          <input
            type="text"
            value="admin"
            readOnly
            style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #cbd5e1', background: '#f8fafc' }}
          />
        </FormField>
      </div>

      <FormField label="Observación">
        <textarea
          value={form.observation}
          onChange={(e) => setForm({ ...form, observation: e.target.value })}
          placeholder="Notas opcionales sobre el movimiento"
          rows={4}
          style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #cbd5e1', resize: 'vertical' }}
        />
      </FormField>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          disabled={!isValid || materials.length === 0}
          style={{ padding: '12px 18px', borderRadius: 12, border: 'none', background: materials.length === 0 ? '#94a3b8' : '#0ea5e9', color: '#fff', cursor: materials.length === 0 ? 'not-allowed' : 'pointer' }}
        >
          Registrar movimiento
        </button>
      </div>
    </form>
  );
}
