'use client';

import type { ReactNode } from 'react';

type FormFieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

export default function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{label}</label>
      {children}
      {error ? <div style={{ color: '#b91c1c', fontSize: 13 }}>{error}</div> : null}
    </div>
  );
}
