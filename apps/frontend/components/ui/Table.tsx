'use client';

import { ReactNode } from 'react';

type TableProps = {
  headers: ReactNode[];
  children: ReactNode;
  className?: string;
};

export default function Table({ headers, children, className }: TableProps) {
  return (
    <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 18, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)' }} className={className}>
      <table style={{ width: '100%', minWidth: 760, borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead style={{ background: '#f8fafc' }}>
          <tr>
            {headers.map((header, index) => (
              <th key={index} style={{ padding: '16px 20px', textAlign: 'left', color: '#475569', fontSize: 13, fontWeight: 700, letterSpacing: '0.01em' }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
