import React, { useRef, useEffect } from 'react'
import { Bot, Send, X } from 'lucide-react'

const INITIAL_MESSAGE = {
  role: 'model',
  text: 'Halo Manajer! Saya Asisten AI Mr & Tea Jasuke. Ada yang ingin dianalisis dari data penjualan kita hari ini?'
}

export default function AiChat({ transactions, filter, onClose }) {
  const [messages, setMessages] = React.useState([INITIAL_MESSAGE])
  const [input, setInput] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const ask = async (e) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userQuery = input.trim()
    setMessages((prev) => [...prev, { role: 'user', text: userQuery }])
    setInput('')
    setIsTyping(true)

    try {
      const salesDataStr = transactions.length > 0
        ? transactions.map((t) => `${t.id} - Total: ${t.total} - Items: ${t.items.map((i) => i.name).join(',')}`).join('\n')
        : 'Belum ada transaksi pada periode ini.'

      const systemPrompt = `Anda adalah Asisten Bisnis Ahli untuk Mr & Tea Jasuke (Toko Jasuke dan Minuman). 
      Tugas Anda adalah membantu Manajer menganalisis data penjualan dan memberikan rekomendasi bisnis yang cerdas, singkat, dan praktis.
      
      Gunakan data transaksi berikut sebagai dasar jawaban Anda:
      PERIODE LAPORAN: ${filter}
      TOTAL TRANSAKSI: ${transactions.length}
      TOTAL PENDAPATAN: ${transactions.reduce((sum, t) => sum + t.total, 0)}
      DETAIL TRANSAKSI TERAKHIR:
      ${salesDataStr.substring(0, 1000)}
      
      Jawab dalam bahasa Indonesia dengan nada profesional, ramah, dan ringkas (maksimal 3 paragraf).`

      const historyForApi = messages.map((msg) => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }))
      historyForApi.push({ role: 'user', parts: [{ text: userQuery }] })

      const payload = {
        contents: historyForApi,
        systemInstruction: { parts: [{ text: systemPrompt }] },
      }

      const apiKey = ''
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      const candidate = result.candidates?.[0]

      if (candidate?.content?.parts?.[0]?.text) {
        setMessages((prev) => [...prev, { role: 'model', text: candidate.content.parts[0].text }])
      } else {
        setMessages((prev) => [...prev, { role: 'model', text: 'Maaf, API Key perlu dikonfigurasi untuk membalas secara real-time.' }])
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'model', text: 'Oops! Koneksi ke AI terputus. Pastikan internet lancar.' }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(env(safe-area-inset-bottom) + 80px)',
      right: 24,
      width: 380,
      maxWidth: 'calc(100vw - 32px)',
      height: 520,
      maxHeight: '72dvh',
      background: 'var(--bg-card)',
      border: '1px solid var(--border-hover)',
      borderRadius: 20,
      boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
      overflow: 'hidden',
      animation: 'slideInBottom 0.3s ease',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', background: '#111111',
        borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'rgba(107,142,35,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Bot size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Jasuke AI Analyst</div>
            <div style={{ fontSize: 11, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', animation: 'pulse-dot 2s infinite', display: 'inline-block' }} />
              Online
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: '#27272a', border: 'none', borderRadius: 8,
          width: 30, height: 30, display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)'
        }}>
          <X size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="custom-scrollbar" style={{
        flex: 1, padding: '16px', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 12,
        background: '#0d0d0d'
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              maxWidth: '84%',
              padding: '10px 14px',
              borderRadius: msg.role === 'model' ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
              background: msg.role === 'model' ? '#27272a' : 'var(--primary)',
              color: '#e4e4e7',
              alignSelf: msg.role === 'model' ? 'flex-start' : 'flex-end',
              fontSize: 13,
              lineHeight: 1.55,
              whiteSpace: 'pre-line',
            }}
          >
            {msg.text}
          </div>
        ))}
        {isTyping && (
          <div style={{
            padding: '12px 16px', borderRadius: '4px 18px 18px 18px',
            background: '#27272a', alignSelf: 'flex-start',
            display: 'flex', gap: 5, alignItems: 'center'
          }}>
            {[0, 150, 300].map((delay) => (
              <span key={delay} style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#52525b', display: 'inline-block',
                animation: `bounce-dot 0.8s ease ${delay}ms infinite`
              }} />
            ))}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={ask} style={{
        padding: '12px 14px', background: '#111111',
        borderTop: '1px solid var(--border)',
        display: 'flex', gap: 10, flexShrink: 0
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
          placeholder="Tanya soal penjualan..."
          className="input-base"
          style={{ flex: 1, padding: '10px 14px', fontSize: 13 }}
        />
        <button
          type="submit"
          disabled={isTyping || !input.trim()}
          className="btn-primary"
          style={{ width: 42, height: 42, padding: 0, flexShrink: 0 }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
