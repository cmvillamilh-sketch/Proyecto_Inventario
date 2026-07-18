import MaterialForm from '../../../../components/materials/MaterialForm';
import { getMaterialById } from '../../../../services/materials.service';

interface EditMaterialPageProps {
  params: {
    id: string;
  };
}

export default async function EditMaterialPage({ params }: EditMaterialPageProps) {
  const material = await getMaterialById(params.id);

  return (
    <main>
      <h1>Editar material</h1>
      <MaterialForm initialData={material} />
    </main>
  );
}
