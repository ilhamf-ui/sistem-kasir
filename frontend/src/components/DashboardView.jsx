import React, { useState, useMemo } from 'react'
import { FileSpreadsheet, Calendar, CalendarDays, CalendarCheck, Trash2, Package, Bot, Filter } from 'lucide-react'
import { formatIDR, calculateItemPrice } from '../utils/formatters'
import AiChat from './AiChat'
import * as XLSX from 'xlsx'

const FILTERS = [
  { key: 'Harian', icon: Calendar },
  { key: 'Mingguan', icon: CalendarDays },
  { key: 'Bulanan', icon: CalendarCheck },
]

export default function DashboardView({ transactions, filter, setFilter, role, onDeleteTransaction, onRefresh }) {
  const [aiOpen, setAiOpen] = useState(false)
  const [shiftFilter, setShiftFilter] = useState('Semua')

  const productSummary = useMemo(() => {
    const summary = {}
    transactions.forEach(trx => {
      trx.items.forEach(item => {
        const itemName = item.size ? `${item.name} (${item.size})` : item.name
        if (!summary[itemName]) summary[itemName] = { qty: 0, revenue: 0, category: item.category }
        summary[itemName].qty += item.qty
        summary[itemName].revenue += calculateItemPrice(item, {}) * item.qty
      })
    })
    return Object.entries(summary).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.qty - a.qty)
  }, [transactions])

  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0)

  // Daftar shift unik yang ada di transaksi
  const availableShifts = useMemo(() => {
    const shifts = [...new Set(transactions.map(t => t.shift))].sort((a, b) => a - b)
    return shifts
  }, [transactions])

  // Transaksi yang sudah difilter per shift
  const filteredByShift = useMemo(() => {
    if (shiftFilter === 'Semua') return transactions
    return transactions.filter(t => String(t.shift) === String(shiftFilter))
  }, [transactions, shiftFilter])

  // Pendapatan harian dari semua transaksi (untuk CSV)
  const dailyRevenue = useMemo(() => {
    const daily = {}
    transactions.forEach(t => {
      const d = new Date(t.time)
      const dateKey = d.toLocaleDateString('id-ID')
      if (!daily[dateKey]) daily[dateKey] = { date: dateKey, total: 0, count: 0 }
      daily[dateKey].total += t.total
      daily[dateKey].count += 1
    })
    return Object.values(daily).sort((a, b) => {
      // parse dd/mm/yyyy
      const [da, ma, ya] = a.date.split('/').map(Number)
      const [db, mb, yb] = b.date.split('/').map(Number)
      return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db)
    })
  }, [transactions])

  const exportToXLSX = () => {
    if (transactions.length === 0) return

    const wb = XLSX.utils.book_new()

    // ── Tentukan periode label ──────────────────────────────────────────────
    const sortedTrx = [...transactions].sort((a, b) => new Date(a.time) - new Date(b.time))
    const firstDate = new Date(sortedTrx[0].time).toLocaleDateString('id-ID')
    const lastDate = new Date(sortedTrx[sortedTrx.length - 1].time).toLocaleDateString('id-ID')
    const periodeLabel = firstDate === lastDate ? firstDate : `${firstDate} – ${lastDate}`

    // ── Sheet 1 : Ringkasan ────────────────────────────────────────────────
    const ws1Data = [
      ['LAPORAN PENJUALAN MR & TEA JASUKE'],
      [],
      ['Total Penjualan', totalRevenue],
      ['Total Transaksi', transactions.length],
      ['Periode', periodeLabel],
    ]
    const ws1 = XLSX.utils.aoa_to_sheet(ws1Data)
    ws1['!cols'] = [{ wch: 20 }, { wch: 25 }]
    XLSX.utils.book_append_sheet(wb, ws1, 'Ringkasan')

    // ── Sheet 2 : Riwayat Transaksi ────────────────────────────────────────
    const ws2Header = ['ID', 'Tanggal', 'Waktu', 'Kasir', 'Shift', 'Metode Bayar', 'Total', 'Uang Diterima', 'Kembalian', 'Detail Item']
    const ws2Rows = transactions.map(t => {
      const d = new Date(t.time)
      const tanggal = d.toLocaleDateString('id-ID')
      const jam = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
        .format(d).replace('.', ':') + ' WIB'
      const detail = t.items.map(i => `${i.qty}x ${i.size ? `${i.name} (${i.size})` : i.name}`).join(' | ')
      const diterima = t.paymentMethod === 'QRIS' ? t.total : (t.received ?? t.total)
      const kembalian = t.paymentMethod === 'QRIS' ? 0 : (t.change ?? 0)
      return [t.id, tanggal, jam, t.cashier, `S-${t.shift}`, t.paymentMethod || 'Tunai', t.total, diterima, kembalian, detail]
    })
    const ws2 = XLSX.utils.aoa_to_sheet([ws2Header, ...ws2Rows])
    ws2['!cols'] = [{ wch: 16 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 8 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 50 }]
    XLSX.utils.book_append_sheet(wb, ws2, 'Riwayat Transaksi')

    // ── Sheet 3 : Rekap Produk ─────────────────────────────────────────────
    const ws3Header = ['Nama Produk', 'Jumlah Terjual', 'Pendapatan']
    const ws3Rows = productSummary.map(item => [item.name, item.qty, item.revenue])
    const ws3 = XLSX.utils.aoa_to_sheet([ws3Header, ...ws3Rows])
    ws3['!cols'] = [{ wch: 28 }, { wch: 16 }, { wch: 16 }]
    XLSX.utils.book_append_sheet(wb, ws3, 'Rekap Produk')

    // ── Sheet 4 : Pendapatan Pembayaran ────────────────────────────────────
    const tunaiTrx = transactions.filter(t => (t.paymentMethod || 'Tunai') === 'Tunai')
    const qrisTrx = transactions.filter(t => t.paymentMethod === 'QRIS')
    const totalTunai = tunaiTrx.reduce((s, t) => s + t.total, 0)
    const totalQris = qrisTrx.reduce((s, t) => s + t.total, 0)

    // Rekap pendapatan per hari berdasarkan metode pembayaran
    const dailyPayment = {}

    transactions.forEach(t => {
      const tanggal = new Date(t.time).toLocaleDateString('id-ID')

      if (!dailyPayment[tanggal]) {
        dailyPayment[tanggal] = {
          tunai: 0,
          qris: 0,
          total: 0
        }
      }

      if ((t.paymentMethod || 'Tunai') === 'QRIS') {
        dailyPayment[tanggal].qris += t.total
      } else {
        dailyPayment[tanggal].tunai += t.total
      }

      dailyPayment[tanggal].total += t.total
    })

    const ws4Data = [
      ['Metode Bayar', 'Jumlah Transaksi', 'Total Pendapatan'],
      ['Tunai', tunaiTrx.length, totalTunai],
      ['QRIS', qrisTrx.length, totalQris],
      [],
      ['Total Tunai', '', totalTunai],
      ['Total QRIS', '', totalQris],
      ['Grand Total', '', totalTunai + totalQris],
      [],
      ['Pendapatan Per Hari'],
      ['Tanggal', 'Tunai', 'QRIS', 'Total']
    ]

    Object.entries(dailyPayment)
      .sort((a, b) => {
        const [da, ma, ya] = a[0].split('/').map(Number)
        const [db, mb, yb] = b[0].split('/').map(Number)
        return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db)
      })
      .forEach(([tanggal, data]) => {
        ws4Data.push([
          tanggal,
          data.tunai,
          data.qris,
          data.total
        ])
      })

    const ws4 = XLSX.utils.aoa_to_sheet(ws4Data)
    ws4['!cols'] = [{ wch: 16 }, { wch: 20 }, { wch: 20 }]
    XLSX.utils.book_append_sheet(wb, ws4, 'Pendapatan Pembayaran')

    // ── Sheet 5 : Produk Terjual Harian ───────────────────────────────────
    const dailyProductMap = {}
    transactions.forEach(t => {
      const d = new Date(t.time)
      const dateKey = d.toLocaleDateString('id-ID')
      t.items.forEach(item => {
        const prodName = item.size ? `${item.name} (${item.size})` : item.name
        const key = `${dateKey}||${prodName}`
        if (!dailyProductMap[key]) dailyProductMap[key] = { tanggal: dateKey, produk: prodName, qty: 0, pendapatan: 0 }
        dailyProductMap[key].qty += item.qty
        dailyProductMap[key].pendapatan += calculateItemPrice(item, {}) * item.qty
      })
    })
    const ws5Header = ['Tanggal', 'Produk', 'Qty', 'Pendapatan']
    const ws5Rows = Object.values(dailyProductMap)
      .sort((a, b) => {
        const [da, ma, ya] = a.tanggal.split('/').map(Number)
        const [db, mb, yb] = b.tanggal.split('/').map(Number)
        return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db) || a.produk.localeCompare(b.produk)
      })
      .map(r => [r.tanggal, r.produk, r.qty, r.pendapatan])
    const ws5 = XLSX.utils.aoa_to_sheet([ws5Header, ...ws5Rows])
    ws5['!cols'] = [{ wch: 14 }, { wch: 30 }, { wch: 8 }, { wch: 16 }]
    XLSX.utils.book_append_sheet(wb, ws5, 'Produk Terjual Harian')

    // ── Download ───────────────────────────────────────────────────────────
    const today = new Date().toLocaleDateString('id-ID').replace(/\//g, '-')
    XLSX.writeFile(wb, `Laporan_${filter}_Jasuke_${today}.xlsx`)
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      height: '100%', background: '#0e0e0e', overflow: 'hidden'
    }}>
      <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 100px' }}>

        {/* Header Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--secondary)', marginBottom: 14 }}>
              Dashboard Laporan
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', background: '#0a0a0a', padding: 4, borderRadius: 14, border: '1px solid var(--border)', gap: 2 }}>
              {FILTERS.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 10, border: 'none',
                    fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    background: filter === key ? 'var(--primary)' : 'transparent',
                    color: filter === key ? 'white' : 'var(--text-muted)',
                    boxShadow: filter === key ? '0 2px 8px var(--primary-glow)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={14} />
                  {key === 'Harian' ? 'Hari Ini' : key === 'Mingguan' ? 'Minggu Ini' : 'Bulan Ini'}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={exportToXLSX}
            disabled={transactions.length === 0}
            className="btn-primary"
            style={{ padding: '12px 20px', fontSize: 14, gap: 8 }}
          >
            <FileSpreadsheet size={18} /> Export Excel
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
          <StatCard label={`Total Penjualan ${filter}`} value={formatIDR(totalRevenue)} valueColor="white" />
          <StatCard
            label="Total Transaksi"
            value={<>{transactions.length} <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)' }}>struk</span></>}
            valueColor="white"
          />
          <StatCard
            label="Akses Sistem"
            value={role === 'Manager' ? 'Mode Manajer' : 'Cashier'}
            valueColor="var(--primary)"
            valueFontSize={20}
          />
        </div>

        {/* Tables */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.8fr)', gap: 20, alignItems: 'start' }}>

          {/* Product Summary */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Package size={18} color="var(--secondary)" />
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Rekap Produk</h3>
            </div>
            <div className="custom-scrollbar" style={{ maxHeight: 520, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#111', zIndex: 1 }}>
                  <tr style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Nama Item</th>
                    <th style={{ padding: '12px 10px', textAlign: 'center', fontWeight: 600 }}>Porsi</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>Pendapatan</th>
                  </tr>
                </thead>
                <tbody>
                  {productSummary.length === 0 ? (
                    <tr><td colSpan={3} style={{ padding: 28, textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 13 }}>Belum ada data penjualan.</td></tr>
                  ) : productSummary.map((item, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid var(--border)', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>
                        {item.name}
                        {item.category === 'Custom' && (
                          <span style={{ marginLeft: 6, padding: '1px 5px', borderRadius: 4, fontSize: 9, background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}>Custom</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 10px', fontSize: 14, fontWeight: 700, textAlign: 'center' }}>{item.qty}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--primary)', fontWeight: 600, textAlign: 'right' }}>{formatIDR(item.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transaction History */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Riwayat Transaksi</h3>
                {/* Shift Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Filter size={13} color="var(--text-muted)" />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shift:</span>
                  <div style={{ display: 'flex', background: '#0a0a0a', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
                    {['Semua', ...availableShifts].map(s => (
                      <button
                        key={s}
                        onClick={() => setShiftFilter(String(s))}
                        style={{
                          padding: '5px 12px', border: 'none', cursor: 'pointer',
                          fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                          background: shiftFilter === String(s) ? 'var(--primary)' : 'transparent',
                          color: shiftFilter === String(s) ? 'white' : 'var(--text-muted)',
                          transition: 'all 0.2s'
                        }}
                      >
                        {s === 'Semua' ? 'Semua' : `S-${s}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Shift summary when filtered */}
              {shiftFilter !== 'Semua' && (
                <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(107,142,35,0.1)', border: '1px solid rgba(107,142,35,0.2)', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Transaksi: <strong style={{ color: 'white' }}>{filteredByShift.length}</strong>
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Pendapatan Shift: <strong style={{ color: 'var(--primary)' }}>{formatIDR(filteredByShift.reduce((s, t) => s + t.total, 0))}</strong>
                  </span>
                </div>
              )}
            </div>
            <div className="custom-scrollbar" style={{ maxHeight: 520, overflowX: 'auto', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                <thead style={{ position: 'sticky', top: 0, background: '#111', zIndex: 1 }}>
                  <tr style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Waktu</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>ID</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Item</th>
                    <th style={{ padding: '12px 10px', textAlign: 'center', fontWeight: 600 }}>Shift</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Kasir</th>
                    <th style={{ padding: '12px 10px', textAlign: 'center', fontWeight: 600 }}>Metode</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredByShift.length === 0 ? (
                    <tr><td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 13 }}>Belum ada transaksi{shiftFilter !== 'Semua' ? ` di Shift ${shiftFilter}` : ''}.</td></tr>
                  ) : filteredByShift.map(t => (
                    <tr
                      key={t.id}
                      style={{ borderTop: '1px solid var(--border)', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>
                        <div style={{ fontWeight: 600 }}>
                          {new Date(t.time).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </div>

                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {new Intl.DateTimeFormat('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          })
                            .format(new Date(t.time))
                            .replace('.', ':')}{' '}
                          WIB
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: 'white' }}>{t.id}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        title={t.items.map(i => `${i.qty}x ${i.name}`).join(', ')}>
                        {t.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(107,142,35,0.15)', color: 'var(--primary)', border: '1px solid rgba(107,142,35,0.25)' }}>S-{t.shift}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{t.cashier}</td>
                      <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                        {(t.paymentMethod === 'QRIS') ? (
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                            background: 'rgba(59,130,246,0.15)', color: '#60a5fa',
                            border: '1px solid rgba(59,130,246,0.3)', whiteSpace: 'nowrap'
                          }}>📱 QRIS</span>
                        ) : (
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                            background: 'rgba(34,197,94,0.12)', color: '#4ade80',
                            border: '1px solid rgba(34,197,94,0.25)', whiteSpace: 'nowrap'
                          }}>💵 Tunai</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
                          <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 13 }}>{formatIDR(t.total)}</span>
                          <button
                            onClick={() => onDeleteTransaction(t.id, t.total)}
                            style={{
                              padding: '5px 7px', border: 'none', borderRadius: 8,
                              background: 'transparent', color: 'var(--danger)', cursor: 'pointer',
                              opacity: 0.6, transition: 'all 0.15s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = 'rgba(239,68,68,0.12)' }}
                            onMouseLeave={e => { e.currentTarget.style.opacity = 0.6; e.currentTarget.style.background = 'transparent' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat FAB */}
      {role === 'Manager' && !aiOpen && (
        <button
          onClick={() => setAiOpen(true)}
          className="btn-primary"
          style={{
            position: 'fixed', bottom: 90, right: 24,
            width: 58, height: 58, borderRadius: '50%', padding: 0,
            boxShadow: '0 8px 30px rgba(107,142,35,0.45)',
            zIndex: 40, transition: 'transform 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Bot size={26} />
        </button>
      )}
      {role === 'Manager' && aiOpen && (
        <AiChat
          transactions={transactions}
          filter={filter}
          onClose={() => setAiOpen(false)}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          [data-dashboard-grid] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function StatCard({ label, value, valueColor, valueFontSize = 28 }) {
  return (
    <div className="card" style={{ padding: '20px 22px' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: valueFontSize, fontWeight: 900, color: valueColor, lineHeight: 1.2 }}>{value}</p>
    </div>
  )
}
