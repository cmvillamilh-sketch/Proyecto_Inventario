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

  const fieldClassName =
    'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none';
  const labelClassName = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="code" className={labelClassName}>
          Código
        </label>
        <input id="code" name="code" value={form.code} onChange={handleChange} disabled={isSubmitting} className={fieldClassName} />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className={labelClassName}>
          Descripción
        </label>
        <input
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          disabled={isSubmitting}
          className={fieldClassName}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="category" className={labelClassName}>
          Categoría
        </label>
        <input
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          disabled={isSubmitting}
          className={fieldClassName}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="unitOfMeasure" className={labelClassName}>
          Unidad
        </label>
        <input
          id="unitOfMeasure"
          name="unitOfMeasure"
          value={form.unitOfMeasure}
          onChange={handleChange}
          disabled={isSubmitting}
          className={fieldClassName}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="minimumStock" className={labelClassName}>
          Stock mínimo
        </label>
        <input
          id="minimumStock"
          name="minimumStock"
          type="number"
          value={form.minimumStock}
          onChange={handleChange}
          disabled={isSubmitting}
          className={fieldClassName}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Guardando...' : 'Guardar'}
      </button>
      {errorMessage ? (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>
      ) : null}
    </form>
  );
}
