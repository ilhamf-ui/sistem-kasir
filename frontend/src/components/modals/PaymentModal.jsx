import React from 'react'
import { Wallet, X, QrCode, Banknote } from 'lucide-react'
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
  const [method, setMethod] = React.useState('Tunai')
  const [cashReceived, setCashReceived] = React.useState('')

  const numericReceived = parseInt(cashReceived.replace(/\D/g, '')) || 0
  const changeAmount = numericReceived - cartTotal
  const isCashValid = numericReceived > 0 && changeAmount >= 0
  const isQrisValid = method === 'QRIS'

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '')
    setCashReceived(val ? formatIDR(val).replace('Rp', '').trim() : '')
  }

  const setQuick = (amount) => {
    setCashReceived(formatIDR(amount).replace('Rp', '').trim())
  }

  const quickOptions = getQuickPay(cartTotal)

  const handleConfirm = () => {
    if (method === 'QRIS') {
      onConfirm(cartTotal, 0, 'QRIS')
    } else {
      onConfirm(numericReceived, changeAmount, 'Tunai')
    }
  }

  const METHODS = [
    { key: 'Tunai', label: 'Tunai', icon: <Banknote size={18} /> },
    { key: 'QRIS',  label: 'QRIS',  icon: <QrCode size={18} /> },
  ]

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
            <Wallet size={22} color="var(--secondary)" /> Pembayaran
          </h3>
          <button onClick={onClose} style={{
            background: '#27272a', border: 'none', borderRadius: '50%',
            width: 34, height: 34, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)'
          }}>
            <X size={16} />
          </button>
        </div>

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

          {/* Method Selector */}
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
              Metode Pembayaran
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {METHODS.map(m => {
                const active = method === m.key
                const isQris = m.key === 'QRIS'
                return (
                  <button
                    key={m.key}
                    onClick={() => { setMethod(m.key); setCashReceived('') }}
                    style={{
                      padding: '14px 12px', borderRadius: 12, cursor: 'pointer',
                      fontWeight: 700, fontSize: 15, fontFamily: 'Inter, sans-serif',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'all 0.18s',
                      border: active
                        ? `2px solid ${isQris ? '#3b82f6' : 'var(--primary)'}`
                        : '2px solid var(--border)',
                      background: active
                        ? isQris ? 'rgba(59,130,246,0.12)' : 'rgba(107,142,35,0.12)'
                        : '#18181b',
                      color: active
                        ? isQris ? '#60a5fa' : 'var(--primary)'
                        : 'var(--text-muted)',
                      boxShadow: active
                        ? `0 0 0 1px ${isQris ? 'rgba(59,130,246,0.2)' : 'rgba(107,142,35,0.2)'}`
                        : 'none',
                    }}
                  >
                    {m.icon}
                    {m.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Cash fields — only when Tunai selected */}
          {method === 'Tunai' && (
            <>
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
            </>
          )}

          {/* QRIS info line */}
          {method === 'QRIS' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 16px', borderRadius: 12,
              background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)'
            }}>
              <QrCode size={18} color="#60a5fa" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Pelanggan membayar melalui QRIS. Konfirmasi setelah pembayaran berhasil.
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '0 24px 24px' }}>
          <button
            disabled={method === 'Tunai' ? !isCashValid : false}
            onClick={handleConfirm}
            className="btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: 17 }}
          >
            {method === 'QRIS' ? <QrCode size={20} /> : <Banknote size={20} />}
            Selesaikan Pembayaran {method}
          </button>
        </div>

      </div>
    </div>
  )
}
