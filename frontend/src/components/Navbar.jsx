import React from 'react'
import { Store, LayoutDashboard, LogOut } from 'lucide-react'

export default function Navbar({ role, view, onNavigate, onCloseShift, onLogout }) {
  return (
    <div style={{
      width: '100%',
      height: 64,
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 16px',
      background: '#0A0A0A',
      borderTop: '1px solid var(--border)',
      zIndex: 50,
    }}
    className="navbar-mobile"
    >
      {role === 'Cashier' && (
        <NavBtn active={view === 'pos'} onClick={() => onNavigate('pos')}>
          <Store size={22} />
          <span>Kasir</span>
        </NavBtn>
      )}
      <NavBtn active={view === 'dashboard'} onClick={() => onNavigate('dashboard')}>
        <LayoutDashboard size={22} />
        <span>Laporan</span>
      </NavBtn>
      {role === 'Cashier' ? (
        <NavBtn onClick={onCloseShift} danger>
          <LogOut size={22} />
          <span>Tutup Shift</span>
        </NavBtn>
      ) : (
        <NavBtn onClick={onLogout}>
          <LogOut size={22} />
          <span>Keluar</span>
        </NavBtn>
      )}
    </div>
  )
}

function NavBtn({ active, onClick, danger, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 3,
        background: 'none', border: 'none', cursor: 'pointer',
        color: danger ? 'var(--danger)' : active ? 'var(--primary)' : 'var(--text-muted)',
        padding: '6px 16px', borderRadius: 12, minWidth: 56,
        transition: 'color 0.15s, background 0.15s',
        fontSize: 11, fontWeight: 600, fontFamily: 'Inter, sans-serif'
      }}
    >
      {children}
    </button>
  )
}
