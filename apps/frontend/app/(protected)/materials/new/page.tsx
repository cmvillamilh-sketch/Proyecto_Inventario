'use client';

import MaterialForm from '../../../../components/materials/MaterialForm';

export default function NewMaterialPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ margin: 0 }}>Nuevo Material</h2>
      <MaterialForm mode="new" />
    </div>
  );
}
