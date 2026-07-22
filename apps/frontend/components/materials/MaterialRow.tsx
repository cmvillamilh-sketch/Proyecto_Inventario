'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteMaterial } from '../../services/materials.service';
import { getClientToken } from '../../lib/auth/client';
import { Material } from '../../types/material';

interface MaterialRowProps {
  material: Material;
}

export default function MaterialRow({ material }: MaterialRowProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = async () => {
    const confirmed = window.confirm('¿Desea eliminar este material?');
    if (!confirmed) {
      return;
    }

    setErrorMessage('');
    setIsDeleting(true);

    try {
      await deleteMaterial(material.id, getClientToken() ?? '');
      router.refresh();
    } catch (error) {
      setErrorMessage('No fue posible eliminar el material.');
    } finally {
      setIsDeleting(false);
    }
  };

  const isLowStock = material.currentStock <= material.minimumStock;

  return (
    <tr className={isLowStock ? 'bg-amber-50' : 'hover:bg-gray-50'}>
      <td className="px-4 py-3 text-sm text-gray-700">{material.code}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{material.description}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{material.category}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{material.unitOfMeasure}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{material.minimumStock}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{material.currentStock}</td>
      <td className="px-4 py-3 text-sm text-gray-700">
        <Link href={`/materials/${material.id}/edit`} className="text-blue-600 hover:text-blue-800 font-medium mr-3">
          Editar
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </button>
        {errorMessage ? (
          <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>
        ) : null}
      </td>
    </tr>
  );
}
