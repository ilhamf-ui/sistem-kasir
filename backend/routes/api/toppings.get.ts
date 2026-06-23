// GET /api/toppings
// Nitro auto-imports JASUKE_TOPPINGS from utils/store.ts
export default defineEventHandler(() => {
  return { success: true, data: JASUKE_TOPPINGS }
})
