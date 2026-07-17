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
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f1f5f9', // Gris claro industrial
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        padding: '40px 32px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        boxSizing: 'border-box'
      }}>
        {/* Header con estilo de Logotipo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            margin: '0 auto 16px auto',
            display: 'flex',
            height: '52px',
            width: '52px',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            backgroundColor: '#1d4ed8', // Azul industrial de marca
            fontSize: '20px',
            fontWeight: '700',
            color: '#ffffff'
          }}>
            MS
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', margin: '0' }}>
            Mante-Stock
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px', margin: '8px 0 0 0' }}>
            Control industrial de inventarios
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
              Usuario
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                padding: '12px 14px',
                fontSize: '15px',
                color: '#0f172a',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                padding: '12px 14px',
                fontSize: '15px',
                color: '#0f172a',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              borderRadius: '8px',
              backgroundColor: '#1d4ed8',
              padding: '14px',
              fontSize: '15px',
              fontWeight: '600',
              color: '#ffffff',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '10px'
            }}
          >
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        {/* Mensaje de error/éxito */}
        {message ? (
          <p style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '14px',
            color: message.includes('correcto') ? '#059669' : '#dc2626',
            fontWeight: '600',
            margin: '20px 0 0 0'
          }}>
            {message}
          </p>
        ) : null}
      </div>
    </main>
  );
}