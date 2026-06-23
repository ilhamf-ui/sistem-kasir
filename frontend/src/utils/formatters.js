// Currency formatter for Indonesian Rupiah
export const formatIDR = (num) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num || 0)

// Calculate price of a single cart item (base + size + toppings)
export const calculateItemPrice = (item, toppingsPrices = {}) => {
  let total = item.basePrice || 0
  if (item.size && item.sizes && item.sizes[item.size]) {
    total = item.sizes[item.size]
  }
  let toppingsTotal = 0
  if (item.toppings && item.toppings.length > 0) {
    item.toppings.forEach((t) => {
      let tPrice = toppingsPrices[t] || 3000
      if (item.category === 'Jasuke' && item.size === 'Large' && t === 'Mozarella') {
        tPrice *= 2
      }
      toppingsTotal += tPrice
    })
  }
  return total + toppingsTotal
}

// Generate quick-pay amounts above cart total (rounded to nearest 5000/10000/50000)
export const getQuickAmounts = (total) => {
  const multiples = [5000, 10000, 20000, 50000, 100000]
  const results = [total] // first is "pas"
  for (const m of multiples) {
    const rounded = Math.ceil(total / m) * m
    if (rounded > total && !results.includes(rounded)) {
      results.push(rounded)
    }
    if (results.length >= 4) break
  }
  return results.slice(0, 4)
}
