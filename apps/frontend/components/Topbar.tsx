'use client';

import UserMenu from './UserMenu';

export default function Topbar() {
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #e6eef8', background: '#fff' }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18 }}>Dashboard</h2>
      </div>

      <div>
        <UserMenu />
      </div>
    </header>
  );
}
