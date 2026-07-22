import { redirect } from 'next/navigation';
import { getMaterialsSummary } from '../services/materials.service';
import { getServerAuth } from '../lib/auth/server';

export default async function HomePage() {
  const auth = getServerAuth();

  if (!auth) {
    redirect('/login');
  }

  const summary = await getMaterialsSummary(auth.token);

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">ManteStock</h1>
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Total de materiales</h2>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{summary.totalMaterials}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Unidades totales en stock</h2>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{summary.totalStockUnits}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Materiales con stock bajo</h2>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{summary.lowStockCount}</p>
        </div>
      </section>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Materiales con stock bajo</h2>
      {summary.lowStockMaterials.length === 0 ? (
        <p className="text-sm text-gray-500">No hay materiales con stock bajo.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Código
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Descripción
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Stock actual
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Stock mínimo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {summary.lowStockMaterials.map((material) => (
                <tr key={material.id} className="bg-amber-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{material.code}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{material.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{material.currentStock}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{material.minimumStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
