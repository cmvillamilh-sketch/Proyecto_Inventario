import Link from 'next/link';
import { redirect } from 'next/navigation';
import MaterialList from '../../components/materials/MaterialList';
import { getMaterials } from '../../services/materials.service';
import { getServerAuth } from '../../lib/auth/server';

interface MaterialsPageProps {
  searchParams: {
    search?: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function MaterialsPage({ searchParams }: MaterialsPageProps) {
  const auth = getServerAuth();

  if (!auth) {
    redirect('/login');
  }

  const materials = await getMaterials(auth.token, searchParams.search);

  return (
    <main>
      <h1>Materiales</h1>
      <Link href="/materials/new">Nuevo material</Link>
      <form method="GET">
        <input type="text" name="search" defaultValue={searchParams.search ?? ''} />
        <button type="submit">Buscar</button>
        {searchParams.search ? <Link href="/materials">Limpiar</Link> : null}
      </form>
      <MaterialList materials={materials} />
    </main>
  );
}
