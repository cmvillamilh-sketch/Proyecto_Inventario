import './globals.css';
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
          <header className="border-b border-gray-200 bg-white">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between flex-wrap gap-3">
              <span className="text-lg font-semibold text-gray-900">ManteStock</span>
              <span className="text-sm text-gray-500">
                {auth.username} ({auth.role})
              </span>
              <nav className="flex items-center gap-4">
                <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link href="/materials" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                  Materiales
                </Link>
                <Link href="/inventory-movements" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                  Inventario
                </Link>
                {auth.role === 'ADMIN' ? (
                  <Link href="/users" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                    Usuarios
                  </Link>
                ) : null}
              </nav>
              <LogoutButton />
            </div>
          </header>
        ) : null}
        {children}
      </body>
    </html>
  );
}
