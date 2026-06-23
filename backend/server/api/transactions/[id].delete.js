// DELETE /api/transactions/:id
import { deleteTransaction } from '../../utils/store'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Transaction ID required' })
  }

  const deleted = deleteTransaction(id)

  if (!deleted) {
    throw createError({ statusCode: 404, message: 'Transaction not found' })
  }

  return { success: true, message: `Transaction ${id} deleted` }
})
