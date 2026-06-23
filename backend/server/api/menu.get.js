// GET /api/menu
import { MENU_ITEMS } from '../utils/store'

export default defineEventHandler(() => {
  return { success: true, data: MENU_ITEMS }
})
