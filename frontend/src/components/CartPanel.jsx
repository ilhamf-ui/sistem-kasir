import React from 'react'
import { ShoppingCart, Minus, Plus, Trash2, Wallet, ChevronLeft } from 'lucide-react'
import { formatIDR, calculateItemPrice } from '../utils/formatters'

export default function CartPanel({ cart, toppings, onUpdateQty, onRemove, onCheckout, isMobileOpen, onClose }) {
  const cartTotal = cart.reduce((acc, item) => acc + calculateItemPrice(item, toppings) * item.qty, 0)
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0)

  return (
    <div style={{
      width: '100%',
      maxWidth: 380,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'var(--bg-card)',
      borderLeft: '1px solid var(--border)',
      flexShrink: 0,
      // Mobile: fixed overlay
      ...(isMobileOpen !== undefined ? {
        position: 'fixed', inset: 0, zIndex: 30,
        maxWidth: '100%',
        display: isMobileOpen ? 'flex' : 'none',
        animation: 'slideInRight 0.25s cubic-bezier(0.4,0,0.2,1)'
      } : {})
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(0,0,0,0.2)', flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isMobileOpen !== undefined && (
            <button onClick={onClose} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-secondary)', display: 'flex', alignItems: 'center'
            }}>
              <ChevronLeft size={24} />
            </button>
          )}
          <h2 style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingCart size={20} color="var(--secondary)" /> Keranjang
          </h2>
        </div>
        <span style={{
          background: 'rgba(107,142,35,0.15)', color: 'var(--primary)',
          fontWeight: 700, padding: '4px 12px', borderRadius: 8,
          fontSize: 13, border: '1px solid rgba(107,142,35,0.3)'
        }}>
          {totalItems} Item
        </span>
      </div>

      {/* Cart Items */}
      <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {cart.length === 0 ? (
          <div style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', opacity: 0.6
          }}>
            <ShoppingCart size={52} style={{ marginBottom: 16 }} />
            <p style={{ fontWeight: 600, fontSize: 16 }}>Keranjang kosong</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Pilih menu untuk memulai</p>
          </div>
        ) : (
          cart.map((item, idx) => {
            const itemPrice = calculateItemPrice(item, toppings)
            return (
              <div key={idx} style={{
                padding: '14px', borderRadius: 14,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column', gap: 8,
                transition: 'border-color 0.15s'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3, flex: 1 }}>
                    {item.category === 'Custom' && (
                      <span style={{
                        display: 'inline-block', padding: '1px 6px', borderRadius: 4,
                        fontSize: 10, background: 'rgba(59,130,246,0.15)',
                        color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)',
                        marginRight: 6, verticalAlign: 'middle'
                      }}>Custom</span>
                    )}
                    {item.name}{item.size ? ` (${item.size})` : ''}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--secondary)', fontSize: 14, flexShrink: 0 }}>
                    {formatIDR(itemPrice * item.qty)}
                  </span>
                </div>

                {item.toppings?.length > 0 && (
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    + {item.toppings.join(', ')}
                    {item.category === 'Jasuke' && item.size === 'Large' && item.toppings.includes('Mozarella') && (
                      <span style={{ color: 'var(--secondary)', marginLeft: 4, fontWeight: 700 }}>(x2)</span>
                    )}
                  </p>
                )}
                {item.notes && (
                  <p style={{
                    fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic',
                    background: 'rgba(255,255,255,0.04)', padding: '6px 10px', borderRadius: 8
                  }}>
                    Note: {item.notes}
                  </p>
                )}

                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.04)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: '#18181b', borderRadius: 10, padding: 4 }}>
                    <button onClick={() => onUpdateQty(idx, -1)} style={{
                      width: 30, height: 30, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', borderRadius: 8, border: 'none',
                      background: 'none', color: 'var(--text-secondary)', cursor: 'pointer',
                      transition: 'background 0.1s'
                    }}
                    onMouseEnter={e => e.target.style.background = '#27272a'}
                    onMouseLeave={e => e.target.style.background = 'none'}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ width: 28, textAlign: 'center', fontWeight: 700, fontSize: 14 }}>{item.qty}</span>
                    <button onClick={() => onUpdateQty(idx, 1)} style={{
                      width: 30, height: 30, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', borderRadius: 8, border: 'none',
                      background: 'none', color: 'var(--text-secondary)', cursor: 'pointer',
                      transition: 'background 0.1s'
                    }}
                    onMouseEnter={e => e.target.style.background = '#27272a'}
                    onMouseLeave={e => e.target.style.background = 'none'}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => onRemove(idx)} style={{
                    padding: '6px 8px', borderRadius: 8, border: 'none',
                    background: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 20px 20px', background: '#111111',
        borderTop: '1px solid var(--border)', flexShrink: 0
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: 14 }}>Total Tagihan</span>
          <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px' }}>{formatIDR(cartTotal)}</span>
        </div>
        <button
          disabled={cart.length === 0}
          onClick={onCheckout}
          className="btn-primary"
          style={{
            width: '100%', padding: '16px', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}
        >
          <Wallet size={18} /> Bayar Sekarang
        </button>
      </div>
    </div>
  )
}
