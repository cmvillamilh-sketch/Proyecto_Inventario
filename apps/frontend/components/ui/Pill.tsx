'use client';

type PillProps = {
  label: string;
  color: string;
};

export default function Pill({ label, color }: PillProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 999, background: `${color}1a`, color, fontWeight: 700, fontSize: 12 }}>
      {label}
    </span>
  );
}
