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
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Materiales</h1>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <Link
          href="/materials/new"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Nuevo material
        </Link>
        <form method="GET" className="flex items-center gap-2">
          <input
            type="text"
            name="search"
            defaultValue={searchParams.search ?? ''}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buscar
          </button>
          {searchParams.search ? (
            <Link
              href="/materials"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Limpiar
            </Link>
          ) : null}
        </form>
      </div>
      <MaterialList materials={materials} />
    </main>
  );
}
