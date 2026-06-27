import React, { useState } from 'react'

export default function LoginView({ shiftNumber, setShiftNumber, onOpenShift, onManagerLogin }) {
  const [managerMode, setManagerMode] = useState(false)
  const [managerPass, setManagerPass] = useState('')
  const [passError, setPassError] = useState('')

  const handleManagerSubmit = (e) => {
    e.preventDefault()
    if (managerPass === 'manajer123') {
      onManagerLogin()
    } else {
      setPassError('Password salah!')
      setTimeout(() => setPassError(''), 2000)
    }
  }

  return (
    <div style={{
      minHeight: '100dvh', width: '100vw',
      background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif', padding: 16
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: '#161616', borderRadius: 24,
        border: '1px solid #27272a',
        padding: '36px 32px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)'
      }}>
        {/* Logo & Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18,
            background: 'linear-gradient(135deg, #6b8e23, #8ab428)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 26, color: 'white',
            margin: '0 auto 16px',
            boxShadow: '0 6px 24px rgba(107,142,35,0.4)'
          }}>J</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#a3c233', marginBottom: 4 }}>
            Mr &amp; Tea Jasuke
          </h1>
          <p style={{ fontSize: 13, color: '#71717a' }}>Kasir Mr.Tea &amp; Jasuke</p>
        </div>

        {!managerMode ? (
          /* Cashier Login Form */
          <form onSubmit={onOpenShift}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a1a1aa', marginBottom: 6 }}>
                Nama Kasir
              </label>
              <input
                name="cashierName"
                type="text"
                placeholder="Masukkan nama Anda..."
                required
                style={{
                  width: '100%', padding: '13px 16px',
                  background: '#27272a', border: '1px solid #3f3f46',
                  borderRadius: 12, color: 'white', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#6b8e23'}
                onBlur={e => e.target.style.borderColor = '#3f3f46'}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              {/* Shift Ke */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a1a1aa', marginBottom: 6 }}>
                  Shift Ke-
                </label>
                <div style={{
                  background: '#27272a', border: '1px solid #3f3f46',
                  borderRadius: 12, display: 'flex',
                  alignItems: 'center', justifyContent: 'space-between',
                  padding: '0 8px 0 16px', height: 48
                }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'white' }}>{shiftNumber}</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <button
                      type="button"
                      onClick={() => setShiftNumber(shiftNumber + 1)}
                      style={{
                        border: 'none', background: 'transparent',
                        color: 'white', cursor: 'pointer',
                        fontSize: 12, padding: 0, lineHeight: 1
                      }}
                    >▲</button>
                    <button
                      type="button"
                      onClick={() => setShiftNumber(Math.max(1, shiftNumber - 1))}
                      style={{
                        border: 'none', background: 'transparent',
                        color: 'white', cursor: 'pointer',
                        fontSize: 12, padding: 0, lineHeight: 1
                      }}
                    >▼</button>
                  </div>
                </div>
              </div>

              {/* Modal Laci */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a1a1aa', marginBottom: 6 }}>
                  Modal Laci
                </label>
                <input
                  name="startingCash"
                  type="number"
                  defaultValue={0}
                  min={0}
                  style={{
                    width: '100%', padding: '13px 16px',
                    background: '#27272a', border: '1px solid #3f3f46',
                    borderRadius: 12, color: 'white', fontSize: 14,
                    outline: 'none', boxSizing: 'border-box',
                    fontFamily: 'Inter, sans-serif', height: 48,
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#6b8e23'}
                  onBlur={e => e.target.style.borderColor = '#3f3f46'}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%', padding: '14px 20px',
                background: 'linear-gradient(135deg, #6b8e23, #8ab428)',
                border: 'none', borderRadius: 12,
                color: 'white', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 16px rgba(107,142,35,0.35)',
                transition: 'opacity 0.2s, transform 0.15s',
                marginBottom: 12
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Buka Shift &amp; Mulai Kasir
            </button>

            <button
              type="button"
              onClick={() => setManagerMode(true)}
              style={{
                width: '100%', padding: '12px 20px',
                background: '#27272a', border: '1px solid #3f3f46',
                borderRadius: 12, color: '#a1a1aa', fontSize: 13,
                fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#3f3f46'; e.currentTarget.style.color = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#27272a'; e.currentTarget.style.color = '#a1a1aa' }}
            >
              Akses Manajer (Laporan)
            </button>
          </form>
        ) : (
          /* Manager Login Form */
          <form onSubmit={handleManagerSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a1a1aa', marginBottom: 6 }}>
                Password Manajer
              </label>
              <input
                type="password"
                value={managerPass}
                onChange={e => setManagerPass(e.target.value)}
                placeholder="Masukkan password..."
                autoFocus
                style={{
                  width: '100%', padding: '13px 16px',
                  background: '#27272a', border: `1px solid ${passError ? '#ef4444' : '#3f3f46'}`,
                  borderRadius: 12, color: 'white', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'border-color 0.2s'
                }}
              />
              {passError && (
                <p style={{ color: '#ef4444', fontSize: 12, marginTop: 6, fontWeight: 500 }}>{passError}</p>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: '100%', padding: '14px 20px',
                background: 'linear-gradient(135deg, #6b8e23, #8ab428)',
                border: 'none', borderRadius: 12,
                color: 'white', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 16px rgba(107,142,35,0.35)',
                marginBottom: 12
              }}
            >
              Masuk sebagai Manajer
            </button>

            <button
              type="button"
              onClick={() => { setManagerMode(false); setManagerPass(''); setPassError('') }}
              style={{
                width: '100%', padding: '12px 20px',
                background: '#27272a', border: '1px solid #3f3f46',
                borderRadius: 12, color: '#a1a1aa', fontSize: 13,
                fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#3f3f46'; e.currentTarget.style.color = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#27272a'; e.currentTarget.style.color = '#a1a1aa' }}
            >
              ← Kembali
            </button>
          </form>
        )}
      </div>
    </div>
  )
}