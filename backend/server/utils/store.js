// ============================================================
// In-memory data store untuk POS Jasuke
// Data ini akan reset saat server restart (development mode)
// ============================================================

export const MENU_ITEMS = [
  { id: 'p1', name: 'Jasuke', category: 'Jasuke', hasSizes: true, sizes: { 'Medium': 10000, 'Large': 20000 }, hasToppings: true, image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: 'p2', name: 'Cilok Paket Isi 5', category: 'Cemilan', hasSizes: false, hasToppings: false, basePrice: 5000, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: 'p3', name: 'Pangsit Ayam', category: 'Cemilan', hasSizes: false, hasToppings: false, basePrice: 13000, image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: 'p4', name: 'Pangsit Keju', category: 'Cemilan', hasSizes: false, hasToppings: false, basePrice: 13000, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: 'p5', name: 'Mix Ayam & Keju', category: 'Cemilan', hasSizes: false, hasToppings: false, basePrice: 15000, image: 'https://images.unsplash.com/photo-1616682664551-0bb68153ce15?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: 'm1', name: 'Teh Original', category: 'Minuman', hasSizes: true, sizes: { 'Medium': 3000, 'Large': 5000 }, hasToppings: false, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: 'm2', name: 'Jeruk Peras', category: 'Minuman', hasSizes: true, sizes: { 'Medium': 4000, 'Large': 6000 }, hasToppings: false, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: 'm3', name: 'Jeruk Nipis', category: 'Minuman', hasSizes: true, sizes: { 'Medium': 5000, 'Large': 7000 }, hasToppings: false, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: 'm4', name: 'Teh Kampul', category: 'Minuman', hasSizes: true, sizes: { 'Medium': 5000, 'Large': 7000 }, hasToppings: false, image: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: 'm5', name: 'Milk Tea', category: 'Minuman', hasSizes: true, sizes: { 'Medium': 6000, 'Large': 8000 }, hasToppings: false, image: 'https://images.unsplash.com/photo-1517578239113-b03992dcdd25?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: 'm6', name: 'Kopi', category: 'Minuman', hasSizes: true, sizes: { 'Medium': 5000, 'Large': 7000 }, hasToppings: false, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: 'm7', name: 'Susu Putih', category: 'Minuman', hasSizes: true, sizes: { 'Medium': 5000, 'Large': 7000 }, hasToppings: false, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: 'm8', name: 'Susu Coklat', category: 'Minuman', hasSizes: true, sizes: { 'Medium': 5000, 'Large': 7000 }, hasToppings: false, image: 'https://images.unsplash.com/photo-1542310118-24300fa8892f?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: 'm9', name: 'Milo', category: 'Minuman', hasSizes: true, sizes: { 'Medium': 6000, 'Large': 8000 }, hasToppings: false, image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: 'm10', name: 'Soda Gembira', category: 'Minuman', hasSizes: true, sizes: { 'Medium': 10000, 'Large': 12000 }, hasToppings: false, image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&q=80&w=400&h=300' }
]

export const JASUKE_TOPPINGS = {
  'Mozarella': 3000,
  'Coklat': 3000,
  'Cream Cheese': 3000,
  'Matcha': 3000,
  'Tiramisu': 3000
}

// In-memory transaction store
let transactions = []

export function getTransactions() {
  return transactions
}

export function addTransaction(trx) {
  transactions.unshift(trx)
  return trx
}

export function deleteTransaction(id) {
  const before = transactions.length
  transactions = transactions.filter(t => t.id !== id)
  return transactions.length < before
}
