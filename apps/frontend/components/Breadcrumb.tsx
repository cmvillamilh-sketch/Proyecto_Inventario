'use client';

import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
  const pathname = usePathname() || '/';
  const parts = pathname.split('/').filter(Boolean);

  return (
    <div style={{ padding: '12px 24px', fontSize: 13, color: '#475467' }}>
      {parts.length === 0 ? (
        <span>Inicio</span>
      ) : (
        <>
          <span style={{ marginRight: 6 }}>Inicio</span>
          {parts.map((p, i) => (
            <span key={i} style={{ marginRight: 6 }}>{`/ ${p}`}</span>
          ))}
        </>
      )}
    </div>
  );
}
