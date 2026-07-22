'use client';

type StatusBannerProps = {
  type?: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
};

const styles = {
  success: { background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46' },
  error: { background: '#fef2f2', border: '1px solid #ef4444', color: '#991b1b' },
  info: { background: '#eff6ff', border: '1px solid #3b82f6', color: '#1d4ed8' },
};

export default function StatusBanner({ type = 'info', message, onClose }: StatusBannerProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 12, gap: 12, ...styles[type] }}>
      <div style={{ fontSize: 14, lineHeight: 1.5 }}>{message}</div>
      {onClose ? (
        <button onClick={onClose} style={{ border: 'none', background: 'transparent', color: 'inherit', cursor: 'pointer', fontWeight: 700 }}>
          ×
        </button>
      ) : null}
    </div>
  );
}
