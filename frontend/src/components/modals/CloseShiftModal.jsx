import React from 'react'
import { LogOut, X } from 'lucide-react'
import { formatIDR } from '../../utils/formatters'

export default function CloseShiftModal({ shiftNumber, activeShift, transactions, onClose, onConfirm }) {
  const [actualCash, setActualCash] = React.useState('')

  const shiftSales = transactions
    .filter((t) => t.shift === shiftNumber)
    .reduce((sum, t) => sum + t.total, 0)

  const expectedCash = (activeShift?.startingCash || 0) + shiftSales

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '')
    setActualCash(val ? formatIDR(val).replace('Rp', '').trim() : '')
  }

  const handleConfirm = () => {
    const actual = parseInt(actualCash.replace(/\D/g, '')) || 0
    onConfirm(actual, expectedCash)
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 80 }}>
      <div className="card animate-zoom-in" style={{ width: '100%', maxWidth: 440 }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(239,68,68,0.06)'
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <LogOut size={20} /> Tutup Shift {shiftNumber}
          </h3>
          <button onClick={onClose} style={{
            background: '#27272a', border: 'none', borderRadius: '50%',
            width: 34, height: 34, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)'
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Shift Summary */}
          <div style={{
            background: '#18181b', border: '1px solid var(--border)',
            borderRadius: 14, padding: '18px', display: 'flex', flexDirection: 'column', gap: 12
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)' }}>
              <span>Modal Awal Laci</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{formatIDR(activeShift?.startingCash || 0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)' }}>
              <span>Total Penjualan Shift</span>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>+ {formatIDR(shiftSales)}</span>
            </div>
            <div style={{ height: 1, background: 'var(--border)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Expected Kas Laci</span>
              <span style={{ color: 'var(--secondary)' }}>{formatIDR(expectedCash)}</span>
            </div>
          </div>

          {/* Actual Cash Input */}
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Uang Fisik di Laci (Rp)
            </label>
            <input
              type="text"
              autoFocus
              value={actualCash}
              onChange={handleChange}
              className="input-base"
              style={{ padding: '14px 16px', fontSize: 22, fontWeight: 700, textAlign: 'right' }}
              placeholder="Hitung uang asli..."
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '0 24px 24px', borderTop: '1px solid var(--border)',
          paddingTop: 16, display: 'flex', gap: 12
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '14px', borderRadius: 12, fontWeight: 700,
              background: '#27272a', color: '#d4d4d8', border: 'none', cursor: 'pointer',
              fontSize: 15, transition: 'background 0.15s'
            }}
          >
            Batal
          </button>
          <button
            disabled={!actualCash}
            onClick={handleConfirm}
            className="btn-danger"
            style={{ flex: 1, padding: '14px', fontSize: 15 }}
          >
            Akhiri Sesi
          </button>
        </div>
      </div>
    </div>
  )
}
