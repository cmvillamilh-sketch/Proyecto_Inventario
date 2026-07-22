import MaterialForm from '../../../components/materials/MaterialForm';

export default function NewMaterialPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Nuevo material</h1>
      <MaterialForm />
    </main>
  );
}
