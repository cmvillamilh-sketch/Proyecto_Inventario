'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteMaterial } from '../../services/materials.service';
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
      await deleteMaterial(material.id);
      router.refresh();
    } catch (error) {
      setErrorMessage('No fue posible eliminar el material.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <tr>
      <td>{material.code}</td>
      <td>{material.description}</td>
      <td>{material.category}</td>
      <td>{material.unitOfMeasure}</td>
      <td>{material.minimumStock}</td>
      <td>{material.currentStock}</td>
      <td>
        <Link href={`/materials/${material.id}/edit`}>Editar</Link>
        <button type="button" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </button>
        {errorMessage ? <p>{errorMessage}</p> : null}
      </td>
    </tr>
  );
}
