const MENU_ITEMS = [
  { id: "p1", name: "Jasuke", category: "Jasuke", hasSizes: true, sizes: { "Medium": 1e4, "Large": 2e4 }, hasToppings: true, image: "/images/jasuke.jpg" },
  { id: "p2", name: "Cilok Paket Isi 5", category: "Cemilan", hasSizes: false, hasToppings: false, basePrice: 5e3, image: "/images/cilok.jpg" },
  { id: "p3", name: "Pangsit Ayam", category: "Cemilan", hasSizes: false, hasToppings: false, basePrice: 13e3, image: "/images/pangsit.jpg" },
  { id: "p4", name: "Pangsit Keju", category: "Cemilan", hasSizes: false, hasToppings: false, basePrice: 13e3, image: "/images/pangsit.jpg" },
  { id: "p5", name: "Mix Ayam & Keju", category: "Cemilan", hasSizes: false, hasToppings: false, basePrice: 15e3, image: "/images/pangsit.jpg" },
  { id: "m1", name: "Teh Original", category: "Minuman", hasSizes: true, sizes: { "Medium": 3e3, "Large": 5e3 }, hasToppings: false, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400&h=300" },
  { id: "m2", name: "Jeruk Peras", category: "Minuman", hasSizes: true, sizes: { "Medium": 4e3, "Large": 6e3 }, hasToppings: false, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=400&h=300" },
  { id: "m3", name: "Jeruk Nipis", category: "Minuman", hasSizes: true, sizes: { "Medium": 5e3, "Large": 7e3 }, hasToppings: false, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400&h=300" },
  { id: "m4", name: "Teh Kampul", category: "Minuman", hasSizes: true, sizes: { "Medium": 5e3, "Large": 7e3 }, hasToppings: false, image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&q=80&w=400&h=300" },
  { id: "m5", name: "Milk Tea", category: "Minuman", hasSizes: true, sizes: { "Medium": 6e3, "Large": 8e3 }, hasToppings: false, image: "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&q=80&w=400&h=300" },
  { id: "m6", name: "Kopi", category: "Minuman", hasSizes: true, sizes: { "Medium": 5e3, "Large": 7e3 }, hasToppings: false, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400&h=300" },
  { id: "m7", name: "Susu Putih", category: "Minuman", hasSizes: true, sizes: { "Medium": 5e3, "Large": 7e3 }, hasToppings: false, image: "/images/susu_putih.jpg" },
  { id: "m8", name: "Susu Coklat", category: "Minuman", hasSizes: true, sizes: { "Medium": 5e3, "Large": 7e3 }, hasToppings: false, image: "/images/susu_coklat.jpg" },
  { id: "m9", name: "Milo", category: "Minuman", hasSizes: true, sizes: { "Medium": 6e3, "Large": 8e3 }, hasToppings: false, image: "/images/milo.jpg" },
  { id: "m10", name: "Soda Gembira", category: "Minuman", hasSizes: true, sizes: { "Medium": 1e4, "Large": 12e3 }, hasToppings: false, image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&q=80&w=400&h=300" },
  { id: "m11", name: "Nutrisari", category: "Minuman", hasSizes: true, sizes: { "Medium": 5e3, "Large": 7e3 }, hasToppings: false, image: "/images/nutrisari.jpg" },
  { id: "m12", name: "Nutrisari Tea", category: "Minuman", hasSizes: true, sizes: { "Medium": 6e3, "Large": 8e3 }, hasToppings: false, image: "/images/nutrisari_tea.jpg" }
];
const JASUKE_TOPPINGS = {
  "Mozarella": 3e3,
  "Coklat": 3e3,
  "Cream Cheese": 3e3,
  "Matcha": 3e3,
  "Tiramisu": 3e3
};
let transactions = [];
function getTransactions() {
  return transactions;
}
function addTransaction(trx) {
  transactions.unshift(trx);
  return trx;
}
function deleteTransaction(id) {
  const before = transactions.length;
  transactions = transactions.filter((t) => t.id !== id);
  return transactions.length < before;
}

export { JASUKE_TOPPINGS as J, MENU_ITEMS as M, addTransaction as a, deleteTransaction as d, getTransactions as g };
//# sourceMappingURL=store.mjs.map
