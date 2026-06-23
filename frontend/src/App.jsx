import React, { useState, useEffect, useMemo } from 'react'
import { Store, LayoutDashboard, LogOut } from 'lucide-react'
import { useApi } from './hooks/useApi'
import { formatIDR } from './utils/formatters'

import LoginView from './components/LoginView'
import PosView from './components/PosView'
import DashboardView from './components/DashboardView'
import CloseShiftModal from './components/modals/CloseShiftModal'
import { MessageDialog, ConfirmDialog } from './components/modals/DialogSystem'

export default function App() {
  // ── Auth & Navigation ──────────────────────────────────────────
  const [view, setView] = useState('login')
  const [role, setRole] = useState(null)
  const [cashierName, setCashierName] = useState('')
  const [shiftNumber, setShiftNumber] = useState(1)
  const [activeShift, setActiveShift] = useState(null)

  // ── Data from Backend ──────────────────────────────────────────
  const [menuItems, setMenuItems] = useState([])
  const [toppings, setToppings] = useState({})
  const [transactions, setTransactions] = useState([])
  const [reportFilter, setReportFilter] = useState('Harian')

  // ── Cart ───────────────────────────────────────────────────────
  const [cart, setCart] = useState([])

  // ── Modals ─────────────────────────────────────────────────────
  const [closeShiftOpen, setCloseShiftOpen] = useState(false)
  const [messageDialog, setMessageDialog] = useState({ title: '', message: '' })
  const [confirmDialog, setConfirmDialog] = useState({ message: '', onConfirm: null })

  const api = useApi()

  // ── Fetch initial data ─────────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      try {
        const [menu, tops] = await Promise.all([api.getMenu(), api.getToppings()])
        setMenuItems(menu)
        setToppings(tops)
      } catch {
        showMessage('Koneksi Backend', 'Gagal memuat data. Pastikan server backend sudah berjalan di port 3000.')
      }
    }
    loadData()
  }, [])

  // ── Fetch transactions when filter or view changes ─────────────
  const fetchTransactions = async (filter = reportFilter) => {
    try {
      const data = await api.getTransactions(filter)
      setTransactions(data)
    } catch {
      // silent
    }
  }

  useEffect(() => {
    if (view === 'dashboard') fetchTransactions(reportFilter)
  }, [view, reportFilter])

  // ── Helpers ─────────────────────────────────────────────────────
  const showMessage = (title, message) => setMessageDialog({ title, message })
  const showConfirm = (message, onConfirm) => setConfirmDialog({ message, onConfirm })

  // ── Auth Handlers ──────────────────────────────────────────────
  const handleOpenShift = (e) => {
    e.preventDefault()
    const name = e.target.cashierName.value
    const startingCash = Number(e.target.startingCash.value)
    setRole('Cashier')
    setCashierName(name)
    setActiveShift({ startTime: new Date(), startingCash })
    setView('pos')
  }

  const handleManagerLogin = () => {
    setRole('Manager')
    setView('dashboard')
  }

  const handleLogout = () => {
    setRole(null)
    setCashierName('')
    setActiveShift(null)
    setCart([])
    setView('login')
  }

  // ── Payment ────────────────────────────────────────────────────
  const handlePaymentSuccess = async (trxData) => {
    try {
      const newTrx = await api.postTransaction(trxData)
      // Optimistic update if on dashboard
      setTransactions(prev => [newTrx, ...prev])
      return newTrx
    } catch {
      showMessage('Error', 'Gagal menyimpan transaksi ke server.')
      throw new Error('Payment failed')
    }
  }

  // ── Delete Transaction ─────────────────────────────────────────
  const handleDeleteTransaction = (id, total) => {
    showConfirm(
      `Batalkan transaksi ${id} senilai ${formatIDR(total)}?\n\nData pendapatan akan otomatis dikurangi.`,
      async () => {
        try {
          await api.deleteTransaction(id)
          await fetchTransactions()
        } catch {
          showMessage('Error', 'Gagal menghapus transaksi.')
        }
        setConfirmDialog({ message: '', onConfirm: null })
      }
    )
  }

  // ── Close Shift ────────────────────────────────────────────────
  const handleConfirmCloseShift = (actual, expected) => {
    const variance = actual - expected
    showMessage(
      `✅ Shift ${shiftNumber} Berhasil Ditutup`,
      `Kasir: ${cashierName}\nExpected Kas: ${formatIDR(expected)}\nFisik Laci: ${formatIDR(actual)}\nSelisih: ${formatIDR(variance)}`
    )
    setShiftNumber(prev => prev + 1)
    setActiveShift(null)
    setCashierName('')
    setCart([])
    setCloseShiftOpen(false)
    setRole(null)
    setView('login')
  }

  // ── LOGIN VIEW ─────────────────────────────────────────────────
  if (view === 'login') {
    return (
      <>
        <LoginView
          shiftNumber={shiftNumber}
          setShiftNumber={setShiftNumber}
          onOpenShift={handleOpenShift}
          onManagerLogin={handleManagerLogin}
        />
        {messageDialog.title && (
          <MessageDialog
            title={messageDialog.title}
            message={messageDialog.message}
            onClose={() => setMessageDialog({ title: '', message: '' })}
          />
        )}
      </>
    )
  }

  // ── MAIN LAYOUT ────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', height: '100dvh', width: '100vw', background: 'var(--bg-main)', overflow: 'hidden' }}>

      {/* Sidebar (desktop) */}
      <div className="sidebar-desktop" style={{
        width: 72, flexShrink: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '20px 0',
        background: '#0A0A0A', borderRight: '1px solid var(--border)'
      }}>
        {/* Logo */}
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: 'linear-gradient(135deg, var(--primary), #8ab428)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: 20, color: 'white',
          marginBottom: 28, boxShadow: '0 4px 14px var(--primary-glow)'
        }}>J</div>

        {/* Nav Icons */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, width: '100%', padding: '0 10px' }}>
          {role === 'Cashier' && (
            <SidebarBtn active={view === 'pos'} onClick={() => setView('pos')} tooltip="Kasir">
              <Store size={22} />
            </SidebarBtn>
          )}
          <SidebarBtn active={view === 'dashboard'} onClick={() => setView('dashboard')} tooltip="Laporan">
            <LayoutDashboard size={22} />
          </SidebarBtn>
        </nav>

        {/* Logout */}
        {role === 'Cashier' ? (
          <SidebarBtn onClick={() => setCloseShiftOpen(true)} danger tooltip="Tutup Shift">
            <LogOut size={22} />
          </SidebarBtn>
        ) : (
          <SidebarBtn onClick={handleLogout} tooltip="Keluar">
            <LogOut size={22} />
          </SidebarBtn>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minWidth: 0 }}>
        {view === 'pos' && role === 'Cashier' && (
          <PosView
            menuItems={menuItems}
            toppings={toppings}
            cart={cart}
            setCart={setCart}
            cashierName={cashierName}
            shiftNumber={shiftNumber}
            onPaymentSuccess={handlePaymentSuccess}
            showMessage={showMessage}
          />
        )}
        {view === 'dashboard' && (
          <DashboardView
            transactions={transactions}
            filter={reportFilter}
            setFilter={setReportFilter}
            role={role}
            onDeleteTransaction={handleDeleteTransaction}
            onRefresh={() => fetchTransactions()}
          />
        )}
      </div>

      {/* Mobile Bottom Nav */}
      <div className="bottomnav-mobile" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: 64, display: 'none',
        background: '#0A0A0A', borderTop: '1px solid var(--border)',
        alignItems: 'center', justifyContent: 'space-around',
        padding: '0 8px', zIndex: 50
      }}>
        {role === 'Cashier' && (
          <MobileNavBtn active={view === 'pos'} onClick={() => setView('pos')} label="Kasir">
            <Store size={22} />
          </MobileNavBtn>
        )}
        <MobileNavBtn active={view === 'dashboard'} onClick={() => setView('dashboard')} label="Laporan">
          <LayoutDashboard size={22} />
        </MobileNavBtn>
        {role === 'Cashier' ? (
          <MobileNavBtn onClick={() => setCloseShiftOpen(true)} label="Tutup Shift" danger>
            <LogOut size={22} />
          </MobileNavBtn>
        ) : (
          <MobileNavBtn onClick={handleLogout} label="Keluar">
            <LogOut size={22} />
          </MobileNavBtn>
        )}
      </div>

      {/* Modals */}
      {closeShiftOpen && (
        <CloseShiftModal
          shiftNumber={shiftNumber}
          activeShift={activeShift}
          transactions={transactions}
          onClose={() => setCloseShiftOpen(false)}
          onConfirm={handleConfirmCloseShift}
        />
      )}

      {messageDialog.title && (
        <MessageDialog
          title={messageDialog.title}
          message={messageDialog.message}
          onClose={() => setMessageDialog({ title: '', message: '' })}
        />
      )}

      {confirmDialog.message && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog({ message: '', onConfirm: null })}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .bottomnav-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .bottomnav-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}

// Sidebar button
function SidebarBtn({ active, onClick, danger, tooltip, children }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%', padding: '12px', borderRadius: 12, border: 'none',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          cursor: 'pointer', transition: 'all 0.15s',
          background: active ? 'var(--bg-card)' : 'transparent',
          color: danger ? 'var(--danger)' : active ? 'var(--primary)' : 'var(--text-muted)'
        }}
      >
        {children}
      </button>
      {hovered && tooltip && (
        <div style={{
          position: 'absolute', left: 'calc(100% + 10px)', top: '50%',
          transform: 'translateY(-50%)',
          background: danger ? 'var(--danger)' : '#27272a',
          color: 'white', fontSize: 12, fontWeight: 600,
          padding: '5px 10px', borderRadius: 8, whiteSpace: 'nowrap',
          pointerEvents: 'none', zIndex: 200
        }}>
          {tooltip}
        </div>
      )}
    </div>
  )
}

// Mobile bottom nav button
function MobileNavBtn({ active, onClick, danger, label, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 3, background: 'none', border: 'none',
        cursor: 'pointer', padding: '6px 14px', borderRadius: 12, minWidth: 56,
        color: danger ? 'var(--danger)' : active ? 'var(--primary)' : 'var(--text-muted)',
        fontSize: 10, fontWeight: 600, fontFamily: 'Inter, sans-serif', transition: 'color 0.15s'
      }}
    >
      {children}
      <span>{label}</span>
    </button>
  )
}
