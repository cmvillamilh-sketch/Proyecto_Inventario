'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import FormField from '../ui/FormField';
import StatusBanner from '../ui/StatusBanner';

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
    minimumStock: initial.minimumStock ?? 0,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const submitLabel = mode === 'new' ? 'Crear material' : 'Actualizar material';

  const isFormValid = useMemo(() => {
    return (
      form.code.trim().length > 0 &&
      form.description.trim().length > 0 &&
      form.category.trim().length > 0 &&
      form.unitOfMeasure.trim().length > 0 &&
      Number.isFinite(form.minimumStock) &&
      form.minimumStock >= 0
    );
  }, [form]);

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!form.code.trim()) nextErrors.code = 'El código es obligatorio.';
    if (!form.description.trim()) nextErrors.description = 'La descripción es obligatoria.';
    if (!form.category.trim()) nextErrors.category = 'La categoría es obligatoria.';
    if (!form.unitOfMeasure.trim()) nextErrors.unitOfMeasure = 'La unidad de medida es obligatoria.';
    if (form.minimumStock === null || form.minimumStock === '' || Number.isNaN(form.minimumStock)) {
      nextErrors.minimumStock = 'El stock mínimo debe ser un número válido.';
    } else if (form.minimumStock < 0) {
      nextErrors.minimumStock = 'El stock mínimo no puede ser negativo.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    if (!validate()) return;

    setLoading(true);
    try {
      if (mode === 'new') {
        await apiFetch('/materials', {
          method: 'POST',
          body: JSON.stringify(form),
        });
        setMessage({ type: 'success', text: 'Material creado correctamente.' });
        setTimeout(() => router.push('/materials'), 700);
      } else {
        await apiFetch(`/materials/${initial.id}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
        setMessage({ type: 'success', text: 'Material actualizado correctamente.' });
        setTimeout(() => router.push('/materials'), 700);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error al guardar el material.' });
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    router.push('/materials');
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, borderRadius: 18, boxShadow: '0 14px 44px rgba(15, 23, 42, 0.08)' }}>
      <div style={{ display: 'grid', gap: 22 }}>
        {message ? <StatusBanner type={message.type} message={message.text} onClose={() => setMessage(null)} /> : null}

        <div style={{ display: 'grid', gap: 18 }}>
          <FormField label="Código" error={errors.code}>
            <input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="MAT-001"
              style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid #cbd5e1' }}
            />
          </FormField>

          <FormField label="Descripción" error={errors.description}>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Fusible 10A"
              style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid #cbd5e1' }}
            />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <FormField label="Categoría" error={errors.category}>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Eléctrico"
                style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid #cbd5e1' }}
              />
            </FormField>

            <FormField label="U. Medida" error={errors.unitOfMeasure}>
              <input
                value={form.unitOfMeasure}
                onChange={(e) => setForm({ ...form, unitOfMeasure: e.target.value })}
                placeholder="unidad"
                style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid #cbd5e1' }}
              />
            </FormField>
          </div>

          <FormField label="Stock mínimo" error={errors.minimumStock}>
            <input
              type="number"
              value={form.minimumStock}
              onChange={(e) => setForm({ ...form, minimumStock: Number(e.target.value) })}
              min={0}
              placeholder="0"
              style={{ width: 200, padding: 14, borderRadius: 12, border: '1px solid #cbd5e1' }}
            />
          </FormField>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button type="button" onClick={handleCancel} style={{ padding: '12px 18px', borderRadius: 12, border: '1px solid #cbd5e1', background: '#fff', color: '#0f172a', cursor: 'pointer' }}>
            Cancelar
          </button>
          <button type="submit" disabled={loading || !isFormValid} style={{ padding: '12px 18px', borderRadius: 12, border: 'none', background: loading ? '#94a3b8' : '#0ea5e9', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Guardando...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
