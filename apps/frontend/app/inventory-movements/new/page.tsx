import InventoryMovementForm from '../../../components/inventory-movements/InventoryMovementForm';

export default function NewInventoryMovementPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Nuevo movimiento de inventario</h1>
      <InventoryMovementForm />
    </main>
  );
}
