import Link from 'next/link';
import MaterialList from '../../components/materials/MaterialList';
import { getMaterials } from '../../services/materials.service';

export const dynamic = 'force-dynamic';

export default async function MaterialsPage() {
  const materials = await getMaterials();

  return (
    <main>
      <h1>Materiales</h1>
      <Link href="/materials/new">Nuevo material</Link>
      <MaterialList materials={materials} />
    </main>
  );
}
