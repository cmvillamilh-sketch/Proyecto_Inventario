import Link from 'next/link';
import { redirect } from 'next/navigation';
import MaterialList from '../../components/materials/MaterialList';
import { getMaterials } from '../../services/materials.service';
import { getServerAuth } from '../../lib/auth/server';

export const dynamic = 'force-dynamic';

export default async function MaterialsPage() {
  const auth = getServerAuth();

  if (!auth) {
    redirect('/login');
  }

  const materials = await getMaterials(auth.token);

  return (
    <main>
      <h1>Materiales</h1>
      <Link href="/materials/new">Nuevo material</Link>
      <MaterialList materials={materials} />
    </main>
  );
}
