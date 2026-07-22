'use client';

import type { ReactNode } from 'react';

type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section style={{ background: '#fff', padding: 18, borderRadius: 16, boxShadow: '0 8px 24px rgba(2,6,23,0.06)' }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        {description ? <p style={{ margin: '8px 0 0', color: '#64748b' }}>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
