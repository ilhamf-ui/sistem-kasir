import React from 'react'
import { Plus, X } from 'lucide-react'
import { formatIDR } from '../../utils/formatters'

export default function CustomMenuModal({ onClose, onAdd }) {
  const [name, setName] = React.useState('')
  const [price, setPrice] = React.useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !price) return
    const numericPrice = parseInt(price.replace(/\D/g, '')) || 0
    onAdd({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category: 'Custom',
      basePrice: numericPrice,
      hasSizes: false,
      hasToppings: false,
      qty: 1,
      notes: '',
    })
    onClose()
  }

  const handlePriceChange = (e) => {
    const val = e.target.value.replace(/\D/g, '')
    setPrice(val ? formatIDR(val).replace('Rp', '').trim() : '')
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 70 }}>
      <div className="card animate-zoom-in" style={{ width: '100%', maxWidth: 400 }}>
        {/* Header */}
        <div style={{
          padding: '20px 20px 16px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={20} color="var(--secondary)" /> Menu Custom
          </h3>
          <button onClick={onClose} style={{
            background: '#27272a', border: 'none', borderRadius: '50%',
            width: 32, height: 32, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)'
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Nama Produk / Pesanan
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-base"
              style={{ padding: '12px 16px', fontSize: 14 }}
              placeholder="Contoh: Plastik Besar, Es Batu, dll."
            />
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Harga (Rp)
            </label>
            <input
              type="text"
              required
              value={price}
              onChange={handlePriceChange}
              className="input-base"
              style={{ padding: '12px 16px', fontSize: 20, fontWeight: 700, textAlign: 'right' }}
              placeholder="0"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || !price}
            className="btn-primary"
            style={{ padding: '14px', fontSize: 15, marginTop: 4 }}
          >
            Tambahkan ke Keranjang
          </button>
        </form>
      </div>
    </div>
  )
}
