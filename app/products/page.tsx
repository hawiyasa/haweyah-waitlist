"use client"
import { useState, useEffect } from "react"
import { getProducts, CATEGORIES, Product } from "../lib/products"

const WHATSAPP = "966535189367"

function buildWaUrl(p: Product) {
  const msg = encodeURIComponent(
    `مرحباً، أود الاستفسار عن:\n📦 ${p.name}\n💰 السعر: ${p.price} ﷼ / ${p.unit}\n📦 أقل كمية: ${p.minOrder ?? "غير محدد"}`
  )
  return `https://wa.me/${WHATSAPP}?text=${msg}`
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState("الكل")
  const [search, setSearch] = useState("")
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setProducts(getProducts())
    setLoaded(true)
  }, [])

  const categories = ["الكل", ...CATEGORIES]

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "الكل" || p.category === activeCategory
    const matchSearch = p.name.includes(search) || p.category.includes(search)
    return matchCat && matchSearch
  })

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <a href="/" className="text-2xl font-extrabold text-green-800 shrink-0">حاوية</a>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 ابحث عن منتج..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
          />
          <a href="/" className="text-sm text-gray-500 hover:text-green-700 shrink-0">← الرئيسية</a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">منتجات الجملة</h1>
          <p className="text-gray-500 mt-1">تصفح المنتجات واطلب مباشرة عبر واتساب — بدون تسجيل</p>
        </div>

        <div className="md:hidden mb-6 ios-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-2 pb-2 px-1 w-max ios-click">
            {categories.map((cat, i) => (
              <label
                key={cat}
                htmlFor={`mobile-cat-${i}`}
                className={`cursor-pointer whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all select-none ${
                  activeCategory === cat
                    ? "bg-green-700 text-white"
                    : "bg-white text-gray-600 border border-gray-200 shadow-sm"
                }`}
              >
                <input
                  id={`mobile-cat-${i}`}
                  type="radio"
                  name="mobile-category"
                  className="sr-only"
                  checked={activeCategory === cat}
                  onChange={() => setActiveCategory(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          <aside className="hidden md:block w-48 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-20">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm">الأقسام</h3>
              </div>

              {categories.map((cat, i) => (
                <label
                  key={cat}
                  htmlFor={`desktop-cat-${i}`}
                  className={`block w-full cursor-pointer text-right px-4 py-3 text-sm transition-all border-b border-gray-50 last:border-0 ${
                    activeCategory === cat
                      ? "bg-green-50 text-green-700 font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <input
                    id={`desktop-cat-${i}`}
                    type="radio"
                    name="desktop-category"
                    className="sr-only"
                    checked={activeCategory === cat}
                    onChange={() => setActiveCategory(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {!loaded ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-4xl mb-3">⏳</div>
                <p>جاري التحميل...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">📦</div>
                <p className="font-bold text-lg text-gray-500">
                  {products.length === 0 ? "لا توجد منتجات حالياً" : "لا توجد منتجات في هذا القسم"}
                </p>
                {products.length === 0 && (
                  <p className="text-sm mt-2">ستظهر المنتجات هنا بعد إضافتها من لوحة التحكم</p>
                )}
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-400 mb-4">{filtered.length} منتج</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filtered.map((p) => (
                    <div key={p.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <div className="h-36 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="text-5xl">📦</div>
                        )}

                        {p.badge && (
                          <span className="absolute top-2 right-2 bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {p.badge}
                          </span>
                        )}
                      </div>

                      <div className="p-3">
                        <div className="text-xs text-gray-400 mb-0.5">{p.category}</div>
                        <div className="font-bold text-gray-900 text-sm leading-tight mb-1">{p.name}</div>
                        <div className="text-xs text-gray-400 mb-1">{p.unit}</div>

                        {p.minOrder && (
                          <div className="text-xs text-orange-600 font-bold mb-2">⚠️ أقل طلب: {p.minOrder}</div>
                        )}

                        <div className="text-base font-extrabold text-green-700 mb-3">{p.price} ﷼</div>

                        <a
                          href={buildWaUrl(p)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-2 rounded-lg text-center ios-click"
                        >
                          💬 للطلب والتفاوض
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 pt-16 pb-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="text-2xl font-extrabold text-white mb-4 tracking-tight flex items-center gap-2">
                <div className="w-8 h-8 bg-green-700 text-white rounded-md flex items-center justify-center text-sm">ح</div>
                حاوية
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                سوق الجملة الافتراضي لقطاع الأغذية في المملكة العربية السعودية.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">المنصة</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="/" className="hover:text-green-500 transition-colors">الرئيسية</a></li>
                <li><a href="/products" className="hover:text-green-500 transition-colors">منتجات الجملة</a></li>
                <li><a href="/#suppliers" className="hover:text-green-500 transition-colors">شبكة الموردين</a></li>
                <li><a href="/#europe" className="hover:text-green-500 transition-colors">الاستيراد الدولي</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">الشركة</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="/about" className="hover:text-green-500 transition-colors">من نحن</a></li>
                <li><a href="/contact" className="hover:text-green-500 transition-colors">تواصل معنا</a></li>
                <li><a href="/terms" className="hover:text-green-500 transition-colors">الشروط والأحكام</a></li>
                <li><a href="/privacy" className="hover:text-green-500 transition-colors">سياسة الخصوصية</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">دعم العملاء</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span dir="ltr">+966 53 518 9367</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>info@haweyah.com</span>
                </li>
                <li className="mt-4">
                  <a href="/contact" className="inline-block border border-gray-700 hover:border-green-600 text-gray-300 hover:text-white text-xs font-bold py-2 px-4 rounded transition-colors">
                    نموذج الاستفسارات
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs">
              جميع الحقوق محفوظة © 2026 <strong className="text-gray-300 font-normal">منصة حاوية لتقنية المعلومات</strong>
            </p>
            <span className="text-xs text-gray-500">المملكة العربية السعودية - جدة</span>
          </div>
        </div>
      </footer>
    </div>
  )
}