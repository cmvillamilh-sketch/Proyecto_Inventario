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
    <button type="button" onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
}
