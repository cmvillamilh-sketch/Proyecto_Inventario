'use client';

type SortLabelProps = {
  label: string;
  active: boolean;
  direction: 'asc' | 'desc';
  onClick: () => void;
};

export default function SortLabel({ label, active, direction, onClick }: SortLabelProps) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', color: '#0f172a', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
      {label}
      <span style={{ fontSize: 12, color: '#64748b' }}>{active ? (direction === 'asc' ? '↑' : '↓') : '↕'}</span>
    </button>
  );
}
