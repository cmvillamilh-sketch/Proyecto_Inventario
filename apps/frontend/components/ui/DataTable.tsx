'use client';

import type { ReactNode } from 'react';

type DataTableProps = {
  headers: string[];
  rows: ReactNode[];
};

export default function DataTable({ headers, rows }: DataTableProps) {
  return (
    <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 16, boxShadow: '0 8px 24px rgba(2,6,23,0.06)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #e6eef8' }}>
            {headers.map((header) => (
              <th key={header} style={{ padding: 14 }}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}
