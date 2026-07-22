import { redirect } from 'next/navigation';
import UsersTable from '../../components/users/UsersTable';
import { getUsers } from '../../services/users.service';
import { getServerAuth } from '../../lib/auth/server';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const auth = getServerAuth();

  if (!auth) {
    redirect('/login');
  }

  if (auth.role !== 'ADMIN') {
    redirect('/materials');
  }

  const users = await getUsers(auth.token);

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Usuarios</h1>
      <UsersTable users={users} />
    </main>
  );
}
