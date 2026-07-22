'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMaterials } from '../../services/materials.service';
import { inventoryMovementsService } from '../../services/inventory-movements.service';
import { getClientToken } from '../../lib/auth/client';
import { Material } from '../../types/material';
import { MovementType } from '../../types/inventory-movement';
import { CreateInventoryMovementDto } from '../../types/inventory-movement.dto';

const initialFormState: CreateInventoryMovementDto = {
  materialId: '',
  type: 'ENTRY',
  quantity: 1,
  reason: '',
};

const movementTypeOptions: { value: MovementType; label: string }[] = [
  { value: 'ENTRY', label: 'Entrada' },
  { value: 'EXIT', label: 'Salida' },
  { value: 'ADJUSTMENT', label: 'Ajuste' },
];

export default function InventoryMovementForm() {
  const router = useRouter();
  const [form, setForm] = useState<CreateInventoryMovementDto>(initialFormState);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    getMaterials(getClientToken() ?? '')
      .then((data) => {
        if (isMounted) {
          setMaterials(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setErrorMessage('No fue posible cargar los materiales.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    const nextValue = name === 'quantity' ? Number(value) : value;
    setForm((prev) => ({ ...prev, [name]: nextValue } as CreateInventoryMovementDto));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await inventoryMovementsService.create(form, getClientToken() ?? '');
      setForm(initialFormState);
      router.refresh();
      router.push('/inventory-movements');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No fue posible registrar el movimiento.');
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
        <label htmlFor="materialId" className={labelClassName}>
          Material
        </label>
        <select
          id="materialId"
          name="materialId"
          value={form.materialId}
          onChange={handleChange}
          disabled={isSubmitting || isLoading}
          required
          className={fieldClassName}
        >
          <option value="" disabled>
            {isLoading ? 'Cargando materiales...' : 'Seleccione un material'}
          </option>
          {materials.map((material) => (
            <option key={material.id} value={material.id}>
              {material.code} (stock: {material.currentStock})
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="type" className={labelClassName}>
          Tipo
        </label>
        <select
          id="type"
          name="type"
          value={form.type}
          onChange={handleChange}
          disabled={isSubmitting}
          className={fieldClassName}
        >
          {movementTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="quantity" className={labelClassName}>
          Cantidad
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min={1}
          value={form.quantity}
          onChange={handleChange}
          disabled={isSubmitting}
          className={fieldClassName}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="reason" className={labelClassName}>
          Motivo
        </label>
        <input
          id="reason"
          name="reason"
          value={form.reason}
          onChange={handleChange}
          disabled={isSubmitting}
          className={fieldClassName}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || isLoading}
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
