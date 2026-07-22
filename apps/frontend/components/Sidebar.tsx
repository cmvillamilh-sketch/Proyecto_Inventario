'use client';

import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside style={{ width: 220, background: '#0f172a', color: '#e6eef8', padding: 20, minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>ManteStock</h3>
      </div>

      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginBottom: 12 }}>
            <Link href="/" style={{ color: '#e6eef8', textDecoration: 'none' }}>Dashboard</Link>
          </li>
          <li style={{ marginBottom: 12, opacity: 0.7 }}>
            <span>Materiales (próx.)</span>
          </li>
          <li style={{ marginBottom: 12, opacity: 0.7 }}>
            <span>Inventario (próx.)</span>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
