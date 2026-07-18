'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      localStorage.setItem('mante-stock-token', data.accessToken);
      localStorage.setItem('mante-stock-user', JSON.stringify(data.user));
      setMessage(`Login correcto. Usuario: ${data.user.username}`);
      router.push('/');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f4f6fb', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ width: 360, padding: 24, borderRadius: 16, background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        <h1 style={{ marginBottom: 24, textAlign: 'center' }}>ManteStock</h1>
        <label style={{ display: 'block', marginBottom: 8 }}>Usuario</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 8, border: '1px solid #cbd5e1' }} />

        <label style={{ display: 'block', marginBottom: 8 }}>Contraseña</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 20, borderRadius: 8, border: '1px solid #cbd5e1' }} />

        <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>

        {message ? <p style={{ marginTop: 16, color: message.includes('correcto') ? '#0a7f3e' : '#b42318', textAlign: 'center' }}>{message}</p> : null}
      </form>
    </main>
  );
}
