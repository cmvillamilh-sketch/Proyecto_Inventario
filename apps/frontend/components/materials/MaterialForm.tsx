'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createMaterial, updateMaterial } from '../../services/materials.service';
import { getClientToken } from '../../lib/auth/client';
import { Material } from '../../types/material';
import { CreateMaterialDto } from '../../types/material.dto';

const initialFormState: CreateMaterialDto = {
  code: '',
  description: '',
  category: '',
  unitOfMeasure: '',
  minimumStock: 0,
};

interface MaterialFormProps {
  initialData?: Material;
}

export default function MaterialForm({ initialData }: MaterialFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<CreateMaterialDto>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        code: initialData.code,
        description: initialData.description,
        category: initialData.category,
        unitOfMeasure: initialData.unitOfMeasure,
        minimumStock: initialData.minimumStock,
      });
    }
  }, [initialData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const isNumericField = name === 'minimumStock' || name === 'currentStock';
    const nextValue = isNumericField ? Number(value) : value;
    setForm((prev) => ({ ...prev, [name]: nextValue } as CreateMaterialDto));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const token = getClientToken() ?? '';

      if (initialData) {
        await updateMaterial(initialData.id, form, token);
      } else {
        await createMaterial(form, token);
      }

      setForm(initialFormState);
      router.refresh();
      router.push('/materials');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No fue posible guardar el material.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="code">Código</label>
        <input id="code" name="code" value={form.code} onChange={handleChange} disabled={isSubmitting} />
      </div>
      <div>
        <label htmlFor="description">Descripción</label>
        <input id="description" name="description" value={form.description} onChange={handleChange} disabled={isSubmitting} />
      </div>
      <div>
        <label htmlFor="category">Categoría</label>
        <input id="category" name="category" value={form.category} onChange={handleChange} disabled={isSubmitting} />
      </div>
      <div>
        <label htmlFor="unitOfMeasure">Unidad</label>
        <input id="unitOfMeasure" name="unitOfMeasure" value={form.unitOfMeasure} onChange={handleChange} disabled={isSubmitting} />
      </div>
      <div>
        <label htmlFor="minimumStock">Stock mínimo</label>
        <input id="minimumStock" name="minimumStock" type="number" value={form.minimumStock} onChange={handleChange} disabled={isSubmitting} />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar'}
      </button>
      {errorMessage ? <p>{errorMessage}</p> : null}
    </form>
  );
}
