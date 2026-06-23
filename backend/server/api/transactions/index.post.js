// POST /api/transactions
import { addTransaction } from '../../utils/store'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  if (!body || !body.items || !Array.isArray(body.items)) {
    throw createError({ statusCode: 400, message: 'Invalid transaction data' })
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
