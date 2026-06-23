// GET /api/menu
// Nitro auto-imports MENU_ITEMS from utils/store.ts
export default defineEventHandler(() => {
  return { success: true, data: MENU_ITEMS }
})
