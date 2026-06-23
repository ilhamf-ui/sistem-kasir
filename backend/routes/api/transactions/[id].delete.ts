// DELETE /api/transactions/:id
// Nitro auto-imports deleteTransaction from utils/store.ts
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID transaksi diperlukan' })
  }

  const deleted = deleteTransaction(id)

  if (!deleted) {
    throw createError({ statusCode: 404, message: 'Transaksi tidak ditemukan' })
  }

  return { success: true, message: `Transaksi ${id} berhasil dihapus` }
})
