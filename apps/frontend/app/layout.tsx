import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import LogoutButton from '../components/auth/LogoutButton';
import Sidebar from '../components/layout/Sidebar';
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
          <div className="flex min-h-screen">
            <Sidebar role={auth.role} />
            <div className="flex-1 flex flex-col">
              <header className="border-b border-gray-200 bg-white px-6 py-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {auth.username} ({auth.role})
                </span>
                <LogoutButton />
              </header>
              <main className="flex-1">{children}</main>
            </div>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
