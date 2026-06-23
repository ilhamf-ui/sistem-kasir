// GET /api/toppings
import { JASUKE_TOPPINGS } from '../utils/store'

export default defineEventHandler(() => {
  return { success: true, data: JASUKE_TOPPINGS }
})
