import { redirect } from 'next/navigation';
import { Package, Layers, AlertTriangle, DollarSign } from 'lucide-react';
import { getMaterialsSummary } from '../services/materials.service';
import { getServerAuth } from '../lib/auth/server';
import CategoryCharts from '../components/dashboard/CategoryCharts';

const iosFontFamily = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif";

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export default async function HomePage() {
  const auth = getServerAuth();

  if (!auth) {
    redirect('/login');
  }

  const summary = await getMaterialsSummary(auth.token);
  const maxCategoryValue = Math.max(...summary.valueByCategory.map((item) => item.totalValue), 1);

  return (
    <div style={{ backgroundColor: '#F2F2F7', fontFamily: iosFontFamily, minHeight: '100%' }}>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">ManteStock</h1>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
              <Package size={18} className="text-blue-500" />
            </div>
            <h2 className="text-sm font-medium text-gray-500">Total de materiales</h2>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{summary.totalMaterials}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">
              <Layers size={18} className="text-emerald-500" />
            </div>
            <h2 className="text-sm font-medium text-gray-500">Unidades totales en stock</h2>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{summary.totalStockUnits}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
              <AlertTriangle size={18} className="text-amber-500" />
            </div>
            <h2 className="text-sm font-medium text-gray-500">Materiales con stock bajo</h2>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{summary.lowStockCount}</p>
          </div>
          <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundImage: 'linear-gradient(180deg, #32ADE6, #0A84FF)' }}>
            <div className="w-9 h-9 rounded-lg bg-white/25 flex items-center justify-center mb-3">
              <DollarSign size={18} className="text-white" />
            </div>
            <h2 className="text-sm font-medium text-white/80">Valor total del inventario</h2>
            <p className="mt-1 text-3xl font-semibold text-white">{currencyFormatter.format(summary.totalInventoryValue)}</p>
          </div>
        </section>

        <p className="text-xs font-semibold uppercase tracking-wide text-[#8E8E93] mb-2">Valor por categoría</p>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-8">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            {summary.valueByCategory.map((item) => (
              <div key={item.category} className="flex items-center gap-3 mb-3 last:mb-0">
                <span className="w-28 shrink-0 text-sm text-gray-700 truncate">{item.category}</span>
                <div className="flex-1 h-3 rounded-full bg-[#F2F2F7] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0A84FF]"
                    style={{ width: `${(item.totalValue / maxCategoryValue) * 100}%` }}
                  />
                </div>
                <span className="w-24 shrink-0 text-right text-xs text-gray-500">
                  {currencyFormatter.format(item.totalValue)}
                </span>
              </div>
            ))}
          </div>
          <CategoryCharts materialCountByCategory={summary.materialCountByCategory} />
        </div>

        <p className="text-xs font-semibold uppercase tracking-wide text-[#8E8E93] mb-2">Materiales con stock bajo</p>
        {summary.lowStockMaterials.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">No hay materiales con stock bajo.</p>
          </div>
        ) : (
          <div className="rounded-xl bg-white shadow-sm overflow-hidden">
            {summary.lowStockMaterials.map((material, index) => (
              <div
                key={material.id}
                className={`flex items-center gap-3 px-4 py-3 ${
                  index !== summary.lowStockMaterials.length - 1 ? 'border-b-[0.5px] border-[#E5E5EA]' : ''
                }`}
              >
                <div className="w-9 h-9 rounded-[7px] bg-amber-500 flex items-center justify-center shrink-0">
                  <AlertTriangle size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{material.description}</p>
                  <p className="text-xs text-gray-500">{material.code}</p>
                </div>
                <p className="text-sm text-gray-500 shrink-0">
                  {material.currentStock} / mín. {material.minimumStock}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
