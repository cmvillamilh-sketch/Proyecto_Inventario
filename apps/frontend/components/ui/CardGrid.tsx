'use client';

import type { ReactNode } from 'react';

type CardGridProps = {
  children: ReactNode;
};

export default function CardGrid({ children }: CardGridProps) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>{children}</div>;
}
