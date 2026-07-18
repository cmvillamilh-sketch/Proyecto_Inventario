import MaterialRow from './MaterialRow';
import { Material } from '../../types/material';

interface MaterialTableProps {
  materials: Material[];
}

export default function MaterialTable({ materials }: MaterialTableProps) {
  if (materials.length === 0) {
    return <p>No hay materiales registrados.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Descripción</th>
          <th>Categoría</th>
          <th>Unidad</th>
          <th>Stock mínimo</th>
          <th>Stock actual</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {materials.map((material) => (
          <MaterialRow key={material.id} material={material} />
        ))}
      </tbody>
    </table>
  );
}
