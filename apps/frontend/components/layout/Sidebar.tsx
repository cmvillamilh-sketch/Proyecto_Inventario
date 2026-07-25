'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ClipboardList, Users } from 'lucide-react';

interface SidebarProps {
  role: string;
}

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/materials', label: 'Materiales', icon: Package },
  { href: '/inventory-movements', label: 'Inventario', icon: ClipboardList },
];

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const items =
    role === 'ADMIN'
      ? [...navItems, { href: '/users', label: 'Usuarios', icon: Users }]
      : navItems;

  return (
    <aside className="w-56 shrink-0 min-h-screen bg-gray-900 flex flex-col">
      <div className="px-4 py-5">
        <span className="text-white font-semibold text-lg">ManteStock</span>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                isActive ? 'bg-blue-950 text-blue-400' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
