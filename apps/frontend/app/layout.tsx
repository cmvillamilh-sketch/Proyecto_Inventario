import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import LogoutButton from '../components/auth/LogoutButton';
import { getServerAuth } from '../lib/auth/server';

export const metadata: Metadata = {
  title: 'ManteStock',
  description: 'Gestión de inventario para mantenimiento industrial',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const auth = getServerAuth();

  return (
    <html lang="es">
      <body>
        {auth ? (
          <header>
            <span>ManteStock</span>
            <span>
              {auth.username} ({auth.role})
            </span>
            <nav>
              <Link href="/materials">Materiales</Link>
              <Link href="/inventory-movements">Inventario</Link>
              {auth.role === 'ADMIN' ? <Link href="/users">Usuarios</Link> : null}
            </nav>
            <LogoutButton />
          </header>
        ) : null}
        {children}
      </body>
    </html>
  );
}
