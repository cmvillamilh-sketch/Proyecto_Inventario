'use client';

import { useRouter } from 'next/navigation';
import { clearAuthCookies } from '../../lib/auth/client';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    clearAuthCookies();
    router.refresh();
    router.push('/login');
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
    >
      Cerrar sesión
    </button>
  );
}
