import React from 'react'
import { Wallet, X } from 'lucide-react'
import { formatIDR } from '../../utils/formatters'

const QUICK_AMOUNTS = [50000, 100000, 20000, 10000, 5000]

function getQuickPay(total) {
  const options = [total]
  const sorted = QUICK_AMOUNTS.slice().sort((a, b) => a - b)
  for (const amt of sorted) {
    const multiple = Math.ceil(total / amt) * amt
    if (multiple > total && !options.includes(multiple)) options.push(multiple)
    if (options.length >= 4) break
  }
  return options.slice(0, 4)
}

export default function PaymentModal({ cartTotal, onClose, onConfirm }) {
  const [cashReceived, setCashReceived] = React.useState('')

  const numericReceived = parseInt(cashReceived.replace(/\D/g, '')) || 0
  const changeAmount = numericReceived - cartTotal
  const isValid = numericReceived > 0 && changeAmount >= 0

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '')
    setCashReceived(val ? formatIDR(val).replace('Rp', '').trim() : '')
  }

  const setQuick = (amount) => {
    setCashReceived(formatIDR(amount).replace('Rp', '').trim())
  }

  const quickOptions = getQuickPay(cartTotal)

  return (
    <div className="modal-overlay" style={{ zIndex: 70 }}>
      <div className="card animate-zoom-in" style={{
        width: '100%', maxWidth: 480,
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Wallet size={22} color="var(--secondary)" /> Pembayaran Tunai
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
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Total */}
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '20px', textAlign: 'center'
          }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Total Tagihan</p>
            <p style={{ fontSize: 42, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-1px' }}>
              {formatIDR(cartTotal)}
            </p>
          </div>

          {/* Cash Input */}
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Uang Diterima (Rp)
            </label>
            <input
              type="text"
              value={cashReceived}
              onChange={handleChange}
              autoFocus
              className="input-base"
              style={{ padding: '14px 16px', fontSize: 26, fontWeight: 700, textAlign: 'right' }}
              placeholder="0"
            />
          </div>

          {/* Quick Amounts */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${quickOptions.length}, 1fr)`, gap: 10 }}>
            {quickOptions.map((amt, i) => (
              <button
                key={amt}
                onClick={() => setQuick(amt)}
                style={{
                  padding: '10px 6px', borderRadius: 10, fontWeight: 700, fontSize: 13,
                  background: i === 0 ? 'rgba(107,142,35,0.15)' : '#27272a',
                  color: i === 0 ? 'var(--primary)' : 'var(--text-primary)',
                  border: `1px solid ${i === 0 ? 'rgba(107,142,35,0.4)' : 'var(--border)'}`,
                  cursor: 'pointer', transition: 'all 0.1s'
                }}
              >
                {i === 0 ? 'Pas' : formatIDR(amt).replace('Rp\u00A0', '').replace('Rp', '')}
              </button>
            ))}
          </div>

          {/* Change */}
          <div style={{
            paddingTop: 16, borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Kembalian</span>
            <span style={{
              fontSize: 28, fontWeight: 900,
              color: changeAmount < 0 ? 'var(--danger)' : 'var(--primary)'
            }}>
              {cashReceived === '' ? 'Rp 0' : formatIDR(Math.max(changeAmount, 0))}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '0 24px 24px' }}>
          <button
            disabled={!isValid}
            onClick={() => onConfirm(numericReceived, changeAmount)}
            className="btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: 17 }}
          >
            Selesaikan Pembayaran
          </button>
        </div>
      </div>
    </div>
  )
}
