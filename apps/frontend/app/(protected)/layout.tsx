import type { ReactNode } from 'react';

import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto' }}>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f4f6fb' }}>
            <Topbar />
            <Breadcrumb />

            <main style={{ flex: 1, padding: 24 }}>
              {children}
            </main>

            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
