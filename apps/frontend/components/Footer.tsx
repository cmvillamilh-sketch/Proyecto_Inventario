'use client';

export default function Footer() {
  return (
    <footer style={{ padding: 20, textAlign: 'center', fontSize: 13, color: '#64748b' }}>
      © {new Date().getFullYear()} ManteStock — Proyecto de práctica
    </footer>
  );
}
