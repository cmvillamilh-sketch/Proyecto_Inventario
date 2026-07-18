import MaterialTable from './MaterialTable';
import { Material } from '../../types/material';

interface MaterialListProps {
  materials: Material[];
}

export default function MaterialList({ materials }: MaterialListProps) {
  return <MaterialTable materials={materials} />;
}
