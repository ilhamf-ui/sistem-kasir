// GET /api/transactions?filter=Harian
// Nitro auto-imports getTransactions from utils/store.ts
export default defineEventHandler((event) => {
  const query = getQuery(event)
  const filter = query.filter as string | undefined

  let data = getTransactions()

  if (filter) {
    const now = new Date()
    data = data.filter(t => {
      const tDate = new Date(t.time)
      if (filter === 'Harian') {
        return tDate.getDate() === now.getDate() &&
               tDate.getMonth() === now.getMonth() &&
               tDate.getFullYear() === now.getFullYear()
      } else if (filter === 'Mingguan') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return tDate >= oneWeekAgo && tDate <= now
      } else if (filter === 'Bulanan') {
        return tDate.getMonth() === now.getMonth() &&
               tDate.getFullYear() === now.getFullYear()
      }
      return true
    })
  }

  return { success: true, data }
})
