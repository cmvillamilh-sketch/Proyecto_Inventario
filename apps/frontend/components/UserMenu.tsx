'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
  const [user, setUser] = useState<{ username?: string; role?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem('mante-stock-user');
    if (raw) setUser(JSON.parse(raw));
  }, []);

  function handleLogout() {
    localStorage.removeItem('mante-stock-token');
    localStorage.removeItem('mante-stock-user');
    router.push('/login');
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {user ? (
        <>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600 }}>{user.username}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{user.role}</div>
          </div>
          <button onClick={handleLogout} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer' }}>
            Cerrar sesión
          </button>
        </>
      ) : (
        <button onClick={() => router.push('/login')} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#1f6feb', color: '#fff', cursor: 'pointer' }}>
          Iniciar sesión
        </button>
      )}
    </div>
  );
}
