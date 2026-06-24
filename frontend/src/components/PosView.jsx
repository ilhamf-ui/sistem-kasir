import React, { useState } from 'react'
import { ShoppingCart, Plus } from 'lucide-react'
import { formatIDR, calculateItemPrice } from '../utils/formatters'
import CartPanel from './CartPanel'
import CustomMenuModal from './modals/CustomMenuModal'
import ProductCustomizeModal from './modals/ProductCustomizeModal'
import PaymentModal from './modals/PaymentModal'

const CATEGORIES = ['Semua', 'Jasuke', 'Minuman', 'Cemilan']

export default function PosView({
  menuItems, toppings, cart, setCart,
  cashierName, shiftNumber,
  onPaymentSuccess, showMessage
}) {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [customMenuOpen, setCustomMenuOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [mobileCartOpen, setMobileCartOpen] = useState(false)

  const cartTotal = cart.reduce((acc, item) => acc + calculateItemPrice(item, toppings) * item.qty, 0)
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0)
  const filteredProducts = menuItems.filter(item => activeCategory === 'Semua' || item.category === activeCategory)

  const addToCart = (product) => {
    if (product.hasSizes || product.hasToppings) {
      setSelectedProduct(product)
    } else {
      setCart(prev => {
        const existingIdx = prev.findIndex(c => c.id === product.id)
        if (existingIdx >= 0) {
          const updated = [...prev]
          updated[existingIdx] = { ...updated[existingIdx], qty: updated[existingIdx].qty + 1 }
          return updated
        }
        return [...prev, { ...product, qty: 1, notes: '' }]
      })
    }
  }

  const updateQty = (idx, delta) => {
    setCart(prev => {
      const updated = [...prev]
      updated[idx] = { ...updated[idx], qty: updated[idx].qty + delta }
      if (updated[idx].qty <= 0) updated.splice(idx, 1)
      return updated
    })
  }

  const removeItem = (idx) => {
    setCart(prev => {
      const updated = [...prev]
      updated.splice(idx, 1)
      if (updated.length === 0) setMobileCartOpen(false)
      return updated
    })
  }

  const handlePaymentConfirm = async (received, change) => {
    if (change < 0) {
      showMessage('Pembayaran Gagal', 'Uang yang diterima kurang dari total tagihan!')
      return
    }
    await onPaymentSuccess({
      items: cart,
      total: cartTotal,
      received,
      change,
      cashier: cashierName,
      shift: shiftNumber,
    })
    setCart([])
    setPaymentOpen(false)
    setMobileCartOpen(false)
    showMessage('Transaksi Berhasil! ✅', `Total: ${formatIDR(cartTotal)}\nKembalian: ${formatIDR(change)}`)
  }

  return (
    <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden', position: 'relative' }}>

      {/* Product Grid */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        height: '100%', overflow: 'hidden', background: '#121212'
      }}>
        {/* Topbar */}
        <div style={{
          height: 72, borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 28px', background: 'rgba(26,26,26,0.85)',
          backdropFilter: 'blur(12px)', flexShrink: 0
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--secondary)' }}>Kasir POS</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
            <span>S-{shiftNumber} •</span>
            <strong style={{ color: 'var(--text-primary)' }}>{cashierName}</strong>
          </div>
        </div>

        {/* Category Filter */}
        <div className="hide-scrollbar" style={{
          padding: '14px 28px', overflowX: 'auto', flexShrink: 0
        }}>
          <div style={{
            display: 'inline-flex', background: '#0a0a0a',
            padding: '4px', borderRadius: 14, border: '1px solid var(--border)',
            gap: 2, whiteSpace: 'nowrap'
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 18px', borderRadius: 10, border: 'none',
                  fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s',
                  background: activeCategory === cat ? 'var(--primary)' : 'transparent',
                  color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                  boxShadow: activeCategory === cat ? '0 2px 8px var(--primary-glow)' : 'none'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '4px 28px 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 16
          }}>
            {/* Custom Menu Button */}
            <div
              onClick={() => setCustomMenuOpen(true)}
              style={{
                cursor: 'pointer', borderRadius: 18,
                border: '2px dashed var(--border)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: 16, color: 'var(--text-muted)',
                minHeight: 190, transition: 'all 0.2s',
                background: 'rgba(26,26,26,0.3)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--primary)'
                e.currentTarget.style.color = 'var(--primary)'
                e.currentTarget.style.background = 'rgba(107,142,35,0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-muted)'
                e.currentTarget.style.background = 'rgba(26,26,26,0.3)'
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: '#27272a', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                marginBottom: 10, transition: 'background 0.2s'
              }}>
                <Plus size={22} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Menu Custom</span>
              <span style={{ fontSize: 11, marginTop: 4, opacity: 0.7 }}>Tambah manual</span>
            </div>

            {/* Product Cards */}
            {filteredProducts.map(item => (
              <ProductCard key={item.id} item={item} onClick={() => addToCart(item)} />
            ))}
          </div>
        </div>

        {/* Mobile Cart Button */}
        {cart.length > 0 && (
          <div style={{
            padding: '12px 16px 16px',
            background: '#121212', borderTop: '1px solid rgba(255,255,255,0.05)',
            flexShrink: 0, display: 'none'
          }} className="mobile-cart-btn">
            <button
              onClick={() => setMobileCartOpen(true)}
              className="btn-primary"
              style={{
                width: '100%', padding: '14px 20px', fontSize: 15,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShoppingCart size={18} /> {totalItems} Item
              </span>
              <span>{formatIDR(cartTotal)}</span>
            </button>
          </div>
        )}
      </div>

      {/* Desktop Cart Panel */}
      <div style={{ width: 380, flexShrink: 0, height: '100%' }} className="desktop-cart">
        <CartPanel
          cart={cart}
          toppings={toppings}
          onUpdateQty={updateQty}
          onRemove={removeItem}
          onCheckout={() => setPaymentOpen(true)}
        />
      </div>

      {/* Mobile Cart Panel (overlay) */}
      {false && (
        <div className="mobile-cart-overlay">
          <CartPanel
            cart={cart}
            toppings={toppings}
            onUpdateQty={updateQty}
            onRemove={removeItem}
            onCheckout={() => { setMobileCartOpen(false); setPaymentOpen(true) }}
            isMobileOpen={mobileCartOpen}
            onClose={() => setMobileCartOpen(false)}
          />
        </div>
      )}
      {mobileCartOpen && (
        <div className="mobile-cart-overlay">
          <CartPanel
            cart={cart}
            toppings={toppings}
            onUpdateQty={updateQty}
            onRemove={removeItem}
            onCheckout={() => {
              setMobileCartOpen(false)
              setPaymentOpen(true)
            }}
            isMobileOpen={mobileCartOpen}
            onClose={() => setMobileCartOpen(false)}
          />
        </div>
      )}
      {/* Modals */}
      {selectedProduct && (
        <ProductCustomizeModal
          product={selectedProduct}
          toppings={toppings}
          onClose={() => setSelectedProduct(null)}
          onAdd={(configured) => setCart(prev => [...prev, configured])}
        />
      )}
      {customMenuOpen && (
        <CustomMenuModal
          onClose={() => setCustomMenuOpen(false)}
          onAdd={(item) => setCart(prev => [...prev, item])}
        />
      )}
      {paymentOpen && (
        <PaymentModal
          cartTotal={cartTotal}
          onClose={() => setPaymentOpen(false)}
          onConfirm={handlePaymentConfirm}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-cart { display: none !important; }
          .mobile-cart-btn { display: block !important; }
        }
        .mobile-cart-overlay {
          position: fixed; inset: 0; z-index: 30;
        }
      `}</style>
    </div>
  )
}

// Product Card
function ProductCard({ item, onClick }) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <div
      onClick={() => {
        alert(item.name)
        onClick()
      }}
    >
      <div style={{ height: 140, overflow: 'hidden', position: 'relative' }}>
        <img
          src={item.image}
          alt={item.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: hovered ? 1 : 0.8,
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.4s'
          }}
          loading="lazy"
        />
        {item.hasSizes && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
            fontSize: 10, padding: '3px 8px', borderRadius: 6,
            color: 'white', border: '1px solid rgba(255,255,255,0.15)'
          }}>
            Customizable
          </div>
        )}
      </div>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <h3 style={{ fontWeight: 700, fontSize: 14, color: 'white', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.name}
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.category}
        </p>
        <p style={{ fontWeight: 700, color: 'var(--secondary)', fontSize: 14, marginTop: 8 }}>
          {item.hasSizes ? `Mulai ${formatIDR(item.sizes['Medium'])}` : formatIDR(item.basePrice)}
        </p>
      </div>
    </div>
  )
}
