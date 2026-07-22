import { User } from '../../types/user';

interface UsersTableProps {
  users: User[];
}

export default function UsersTable({ users }: UsersTableProps) {
  if (users.length === 0) {
    return <p>No hay usuarios registrados.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Rol</th>
          <th>Activo</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.role}</td>
            <td>{user.isActive ? 'Sí' : 'No'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
