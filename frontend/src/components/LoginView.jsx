import React from 'react'

export default function LoginView({ shiftNumber, setShiftNumber, onOpenShift, onManagerLogin }) {
  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg-dark)', padding: 16
    }}>
      <div style={{
        width: '100%', maxWidth: 440, borderRadius: 24,
        background: 'var(--bg-card)', padding: '36px 32px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        border: '1px solid var(--border)'
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'linear-gradient(135deg, var(--primary), #8ab428)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 900, color: 'white',
            margin: '0 auto 16px', boxShadow: '0 8px 24px var(--primary-glow)'
          }}>J</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--secondary)', marginBottom: 6 }}>
            Mr & Tea Jasuke
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Sistem POS Terintegrasi</p>
        </div>

        {/* Cashier Form */}
        <form onSubmit={onOpenShift} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Nama Kasir
            </label>
            <input
              name="cashierName"
              type="text"
              required
              autoFocus
              className="input-base"
              style={{ padding: '14px 16px', fontSize: 15 }}
              placeholder="Masukkan nama Anda..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Shift Ke-
              </label>
              <input
                type="number"
                value={shiftNumber}
                min={1}
                onChange={(e) => setShiftNumber(Math.max(1, parseInt(e.target.value) || 1))}
                className="input-base"
                style={{ padding: '14px 16px', fontSize: 15 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Modal Laci
              </label>
              <input
                name="startingCash"
                type="number"
                required
                min={0}
                className="input-base"
                style={{ padding: '14px 16px', fontSize: 15 }}
                placeholder="Rp 0"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '16px', fontSize: 16, marginTop: 6 }}
          >
            Buka Shift &amp; Mulai Kasir
          </button>
        </form>

        {/* Manager Access */}
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <button
            type="button"
            onClick={onManagerLogin}
            style={{
              width: '100%', padding: '13px', borderRadius: 12, fontWeight: 700,
              background: '#27272a', color: 'var(--text-secondary)',
              border: '1px solid var(--border)', cursor: 'pointer',
              fontSize: 14, transition: 'all 0.15s', fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={e => { e.target.style.color = 'white'; e.target.style.background = '#3f3f46' }}
            onMouseLeave={e => { e.target.style.color = 'var(--text-secondary)'; e.target.style.background = '#27272a' }}
          >
            Akses Manajer (Laporan)
          </button>
        </div>
      </div>
    </div>
  )
}
