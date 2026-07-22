import { redirect } from 'next/navigation';
import MaterialForm from '../../../../components/materials/MaterialForm';
import { getMaterialById } from '../../../../services/materials.service';
import { getServerAuth } from '../../../../lib/auth/server';

interface EditMaterialPageProps {
  params: {
    id: string;
  };
}

export default async function EditMaterialPage({ params }: EditMaterialPageProps) {
  const auth = getServerAuth();

  if (!auth) {
    redirect('/login');
  }

  const material = await getMaterialById(params.id, auth.token);

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Editar material</h1>
      <MaterialForm initialData={material} />
    </main>
  );
}
