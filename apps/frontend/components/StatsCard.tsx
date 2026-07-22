'use client';

export default function StatsCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div style={{ background: '#fff', padding: 18, borderRadius: 12, boxShadow: '0 8px 24px rgba(2,6,23,0.06)', minWidth: 180 }}>
      <div style={{ fontSize: 12, color: '#64748b' }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 22, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
