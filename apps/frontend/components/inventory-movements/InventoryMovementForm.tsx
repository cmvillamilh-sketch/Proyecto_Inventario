'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMaterials } from '../../services/materials.service';
import { inventoryMovementsService } from '../../services/inventory-movements.service';
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

    getMaterials()
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
      await inventoryMovementsService.create(form);
      setForm(initialFormState);
      router.refresh();
      router.push('/inventory-movements');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No fue posible registrar el movimiento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="materialId">Material</label>
        <select
          id="materialId"
          name="materialId"
          value={form.materialId}
          onChange={handleChange}
          disabled={isSubmitting || isLoading}
          required
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
      <div>
        <label htmlFor="type">Tipo</label>
        <select id="type" name="type" value={form.type} onChange={handleChange} disabled={isSubmitting}>
          {movementTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="quantity">Cantidad</label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min={1}
          value={form.quantity}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label htmlFor="reason">Motivo</label>
        <input id="reason" name="reason" value={form.reason} onChange={handleChange} disabled={isSubmitting} />
      </div>
      <button type="submit" disabled={isSubmitting || isLoading}>
        {isSubmitting ? 'Guardando...' : 'Guardar'}
      </button>
      {errorMessage ? <p>{errorMessage}</p> : null}
    </form>
  );
}
