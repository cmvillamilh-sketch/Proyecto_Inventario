'use client';

import { useState } from 'react';
import SearchBar from '../../../components/ui/SearchBar';
import ActionButton from '../../../components/ui/ActionButton';
import FormSection from '../../../components/ui/FormSection';

export default function ProfilePage() {
  const [name, setName] = useState('Administrador');
  const [email, setEmail] = useState('admin@mante-stock.com');
  const [phone, setPhone] = useState('+1 555 123 4567');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Perfil</h2>
        <SearchBar value="" onChange={() => {}} placeholder="Buscar perfil..." />
      </div>

      <FormSection title="Información personal" description="Actualiza tus datos de usuario y contacto.">
        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Nombre completo</label>
            <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Correo electrónico</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Teléfono</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <ActionButton label="Guardar cambios" variant="secondary" onClick={() => alert('Simulado')} />
          </div>
        </div>
      </FormSection>
    </div>
  );
}
