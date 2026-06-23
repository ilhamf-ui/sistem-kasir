import React from 'react'
import { CheckCircle, Trash2 } from 'lucide-react'

// ── Message Dialog (info/success) ──────────────────────────────
export function MessageDialog({ title, message, onClose }) {
  if (!title && !message) return null
  return (
    <div className="modal-overlay" style={{ zIndex: 100 }}>
      <div className="card animate-zoom-in" style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ padding: '24px 24px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <CheckCircle size={22} color="var(--primary)" />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
            {message}
          </p>
        </div>
        <div style={{ padding: '12px 24px 20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ padding: '10px 24px', fontSize: 14 }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Confirm Dialog (destructive actions) ───────────────────────
export function ConfirmDialog({ message, onConfirm, onCancel }) {
  if (!message) return null
  return (
    <div className="modal-overlay" style={{ zIndex: 100 }}>
      <div className="card animate-zoom-in" style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ padding: '24px 24px 16px' }}>
          <h3 style={{
            fontSize: 18, fontWeight: 700, color: 'var(--danger)',
            marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8
          }}>
            <Trash2 size={20} /> Konfirmasi
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
            {message}
          </p>
        </div>
        <div style={{ padding: '12px 24px 20px', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px', fontSize: 14, fontWeight: 600,
              background: '#27272a', color: '#d4d4d8', border: 'none',
              borderRadius: 'var(--radius-md)', cursor: 'pointer'
            }}
          >
            Batal
          </button>
          <button onClick={onConfirm} className="btn-danger" style={{ padding: '10px 20px', fontSize: 14 }}>
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}
