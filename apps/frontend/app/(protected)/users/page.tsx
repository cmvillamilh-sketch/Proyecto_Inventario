'use client';

import { useMemo, useState } from 'react';
import SearchBar from '../../../components/ui/SearchBar';
import ActionButton from '../../../components/ui/ActionButton';
import DataTable from '../../../components/ui/DataTable';
import Pill from '../../../components/ui/Pill';

const users = [
  { id: 'u1', username: 'admin', name: 'Administrador', role: 'Coordinador', status: 'Activo', lastLogin: '2026-07-21' },
  { id: 'u2', username: 'maria', name: 'María López', role: 'Técnico', status: 'Activo', lastLogin: '2026-07-20' },
  { id: 'u3', username: 'carlos', name: 'Carlos Díaz', role: 'Almacén', status: 'Inactivo', lastLogin: '2026-07-18' },
];

const getStatusColor = (status: string) => {
  if (status === 'Activo') return '#10b981';
  if (status === 'Inactivo') return '#f59e0b';
  return '#64748b';
};

export default function UsersPage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => users.filter((user) => user.username.toLowerCase().includes(query.toLowerCase()) || user.name.toLowerCase().includes(query.toLowerCase()) || user.role.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Usuarios</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <SearchBar value={query} onChange={setQuery} placeholder="Buscar usuario..." />
          <ActionButton label="Agregar usuario" variant="secondary" onClick={() => alert('Simulado')} />
        </div>
      </div>

      <DataTable
        headers={['Usuario', 'Nombre', 'Rol', 'Estado', 'Último login', 'Acciones']}
        rows={filtered.map((user) => (
          <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
            <td style={{ padding: 14 }}>{user.username}</td>
            <td style={{ padding: 14 }}>{user.name}</td>
            <td style={{ padding: 14 }}>{user.role}</td>
            <td style={{ padding: 14 }}><Pill label={user.status} color={getStatusColor(user.status)} /></td>
            <td style={{ padding: 14 }}>{user.lastLogin}</td>
            <td style={{ padding: 14, display: 'flex', gap: 8 }}>
              <ActionButton label="Editar" variant="ghost" onClick={() => alert('Simulado')} />
              <ActionButton label="Eliminar" variant="danger" onClick={() => alert('Simulado')} />
            </td>
          </tr>
        ))}
      />
    </div>
  );
}
