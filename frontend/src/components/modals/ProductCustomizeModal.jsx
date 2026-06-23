import React from 'react'
import { X, CheckCircle } from 'lucide-react'
import { formatIDR, calculateItemPrice } from '../../utils/formatters'

export default function ProductCustomizeModal({ product, toppings, onClose, onAdd }) {
  const [selected, setSelected] = React.useState({
    ...product,
    size: product.hasSizes ? Object.keys(product.sizes)[0] : undefined,
    toppings: [],
    notes: '',
    qty: 1,
  })

  const price = calculateItemPrice(selected, toppings)

  const toggleTopping = (topping) => {
    setSelected((prev) => {
      const has = prev.toppings.includes(topping)
      return {
        ...prev,
        toppings: has ? prev.toppings.filter((t) => t !== topping) : [...prev.toppings, topping],
      }
    })
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 70 }}>
      <div className="card animate-zoom-in" style={{
        width: '100%', maxWidth: 520,
        display: 'flex', flexDirection: 'column',
        maxHeight: '92dvh'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 20px 16px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(0,0,0,0.2)', flexShrink: 0
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>
            Custom: {product.name}
          </h3>
          <button onClick={onClose} style={{
            background: '#27272a', border: 'none', borderRadius: '50%',
            width: 34, height: 34, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)',
            flexShrink: 0
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="custom-scrollbar" style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Size Selection */}
          {product.hasSizes && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-secondary)' }}>Pilih Ukuran</span>
                <span style={{ fontSize: 11, color: 'var(--secondary)', background: 'rgba(244,180,0,0.1)', padding: '4px 10px', borderRadius: 6 }}>Wajib</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {Object.entries(product.sizes).map(([size, sizePrice]) => {
                  const isActive = selected.size === size
                  return (
                    <button
                      key={size}
                      onClick={() => setSelected({ ...selected, size })}
                      style={{
                        padding: '14px 12px', borderRadius: 14,
                        border: `2px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                        background: isActive ? 'rgba(107,142,35,0.12)' : 'var(--bg-elevated)',
                        color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
                      }}
                    >
                      <span style={{ fontSize: 16 }}>{size}</span>
                      <span style={{ fontSize: 13, fontWeight: 400, opacity: 0.85 }}>{formatIDR(sizePrice)}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Toppings */}
          {product.hasToppings && (
            <div>
              <div style={{ marginBottom: 14 }}>
                <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-secondary)' }}>Topping Tambahan</span>
                {selected.category === 'Jasuke' && selected.size === 'Large' && (
                  <p style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 4 }}>
                    *Porsi Large: Harga Mozarella 2x lipat
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(toppings).map(([topping, basePrice]) => {
                  const isSelected = selected.toppings.includes(topping)
                  const isMozarellaLarge = selected.category === 'Jasuke' && selected.size === 'Large' && topping === 'Mozarella'
                  const displayPrice = isMozarellaLarge ? basePrice * 2 : basePrice
                  return (
                    <div
                      key={topping}
                      onClick={() => toggleTopping(topping)}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '14px 16px', borderRadius: 14, cursor: 'pointer',
                        border: `2px solid ${isSelected ? 'var(--secondary)' : 'var(--border)'}`,
                        background: isSelected ? 'rgba(244,180,0,0.08)' : 'rgba(255,255,255,0.02)',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                          background: isSelected ? 'var(--secondary)' : 'transparent',
                          border: isSelected ? 'none' : '2px solid var(--border-hover)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s'
                        }}>
                          {isSelected && <CheckCircle size={14} color="#1A1A1A" strokeWidth={3} />}
                        </div>
                        <span style={{ fontWeight: 500, fontSize: 14, color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                          {topping}
                          {isMozarellaLarge && <span style={{ fontSize: 11, color: 'var(--secondary)', fontWeight: 700, marginLeft: 6 }}>(x2)</span>}
                        </span>
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14, color: isSelected ? 'var(--secondary)' : 'var(--text-muted)' }}>
                        +{formatIDR(displayPrice)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 15, color: 'var(--text-secondary)', marginBottom: 10 }}>
              Catatan Opsional
            </label>
            <input
              type="text"
              value={selected.notes}
              onChange={(e) => setSelected({ ...selected, notes: e.target.value })}
              className="input-base"
              style={{ padding: '12px 16px', fontSize: 14 }}
              placeholder="Contoh: Ekstra keju parut..."
            />
          </div>
        </div>

        {/* Footer / Add to Cart */}
        <div style={{
          padding: '16px 20px 20px', borderTop: '1px solid var(--border)',
          background: 'rgba(0,0,0,0.2)', flexShrink: 0
        }}>
          <button
            onClick={() => { onAdd(selected); onClose() }}
            className="btn-primary"
            style={{
              width: '100%', padding: '16px 20px', fontSize: 16,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}
          >
            <span>Simpan ke Keranjang</span>
            <span style={{ fontSize: 18, fontWeight: 900 }}>{formatIDR(price)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
