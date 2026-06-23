// POST /api/transactions
// Nitro auto-imports addTransaction from utils/store.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body || !body.items || !Array.isArray(body.items)) {
    throw createError({ statusCode: 400, message: 'Data transaksi tidak valid' })
  }

  const trx = {
    id: `TRX-${Date.now()}`,
    cashier: body.cashier || 'Kasir',
    shift: body.shift || 1,
    items: body.items,
    total: body.total || 0,
    received: body.received || 0,
    change: body.change || 0,
    time: new Date().toISOString()
  }

  addTransaction(trx)
  return { success: true, data: trx }
})
