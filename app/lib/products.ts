export type Product = {
  id: string
  name: string
  category: string
  price: string
  unit: string
  image: string
  badge: string
  description?: string    // ← أضفنا هذا السطر
  minOrder?: string
}

export const CATEGORIES = [
  "شوكولاتة وحلويات",
  "مشروبات",
  "معلبات ومواد غذائية",
  "منظفات ومستلزمات",
  "وجبات خفيفة",
  "مجمدات",
  "ألبان وأجبان",
  "أخرى",
]

const STORAGE_KEY = "haweyah_products"

export function getProducts(): Product[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveProducts(products: Product[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

export function addProduct(product: Product): void {
  const products = getProducts()
  products.unshift(product)
  saveProducts(products)
}

export function deleteProduct(id: string): void {
  const products = getProducts().filter(p => p.id !== id)
  saveProducts(products)
}

export function updateProduct(updated: Product): void {
  const products = getProducts().map(p => p.id === updated.id ? updated : p)
  saveProducts(products)
}