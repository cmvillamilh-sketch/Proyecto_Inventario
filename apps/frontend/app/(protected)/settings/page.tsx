'use client';

import { useState } from 'react';
import SearchBar from '../../../components/ui/SearchBar';
import ActionButton from '../../../components/ui/ActionButton';
import FormSection from '../../../components/ui/FormSection';

export default function SettingsPage() {
  const [company, setCompany] = useState('ManteStock');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('America/New_York');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Configuración</h2>
        <SearchBar value="" onChange={() => {}} placeholder="Buscar configuración..." />
      </div>

      <FormSection title="Ajustes generales" description="Configuración de la plataforma y opciones visuales.">
        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Nombre de la empresa</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Moneda</label>
            <input value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Zona horaria</label>
            <input value={timezone} onChange={(e) => setTimezone(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <ActionButton label="Guardar" variant="secondary" onClick={() => alert('Simulado')} />
          </div>
        </div>
      </FormSection>
    </div>
  );
}
