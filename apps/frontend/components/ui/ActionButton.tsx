'use client';

type ActionButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  onClick?: () => void;
};

const styles = {
  primary: { background: '#0ea5e9', color: '#fff' },
  secondary: { background: '#10b981', color: '#fff' },
  danger: { background: '#ef4444', color: '#fff' },
  ghost: { background: '#f8fafc', color: '#020617', border: '1px solid #cbd5e1' },
};

export default function ActionButton({ label, variant = 'primary', onClick }: ActionButtonProps) {
  return (
    <button onClick={onClick} style={{ padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', ...styles[variant] }}>
      {label}
    </button>
  );
}
