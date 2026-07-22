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
    <main>
      <h1>ManteStock</h1>
      <section>
        <div>
          <h2>Total de materiales</h2>
          <p>{summary.totalMaterials}</p>
        </div>
        <div>
          <h2>Unidades totales en stock</h2>
          <p>{summary.totalStockUnits}</p>
        </div>
        <div>
          <h2>Materiales con stock bajo</h2>
          <p>{summary.lowStockCount}</p>
        </div>
      </section>
      <h2>Materiales con stock bajo</h2>
      {summary.lowStockMaterials.length === 0 ? (
        <p>No hay materiales con stock bajo.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Stock actual</th>
              <th>Stock mínimo</th>
            </tr>
          </thead>
          <tbody>
            {summary.lowStockMaterials.map((material) => (
              <tr key={material.id}>
                <td>{material.code}</td>
                <td>{material.description}</td>
                <td>{material.currentStock}</td>
                <td>{material.minimumStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
