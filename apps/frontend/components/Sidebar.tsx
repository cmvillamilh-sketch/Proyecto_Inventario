'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Materiales', href: '/materials' },
  { label: 'Inventario', href: '/inventory' },
  { label: 'Usuarios', href: '/users' },
  { label: 'Reportes', href: '/reports' },
  { label: 'Configuración', href: '/settings' },
  { label: 'Perfil', href: '/profile' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{ width: 220, background: '#0f172a', color: '#e6eef8', padding: 20, minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>ManteStock</h3>
      </div>

      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(item.href);

            return (
              <li key={item.href} style={{ marginBottom: 12 }}>
                <Link
                  href={item.href}
                  style={{
                    color: '#e6eef8',
                    textDecoration: 'none',
                    display: 'block',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: isActive ? '#1e293b' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
