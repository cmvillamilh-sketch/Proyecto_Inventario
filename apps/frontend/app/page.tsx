'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username?: string; role?: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('mante-stock-token');
    const savedUser = localStorage.getItem('mante-stock-user');

    if (!token || !savedUser) {
      router.replace('/login');
      return;
    }

    setUser(JSON.parse(savedUser));
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('mante-stock-token');
    localStorage.removeItem('mante-stock-user');
    router.replace('/login');
  }

  if (!user) {
    return null;
  }

  return (
    <main style={{ minHeight: '100vh', padding: 32, background: '#f4f6fb', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', background: '#fff', padding: 24, borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        <h1 style={{ marginBottom: 8 }}>Bienvenido a ManteStock</h1>
        <p style={{ marginBottom: 24, color: '#475467' }}>Sesión activa para <strong>{user.username}</strong> con rol <strong>{user.role}</strong>.</p>
        <button onClick={handleLogout} style={{ padding: '10px 16px', border: 'none', borderRadius: 8, background: '#b42318', color: '#fff', cursor: 'pointer' }}>
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}
