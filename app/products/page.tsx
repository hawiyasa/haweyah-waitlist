"use client"
import { useState, useEffect } from "react"
// استيراد Supabase client بدلاً من الملف الوهمي
import { supabase } from "../lib/supabase"

const WHATSAPP = "966535189367"

// تعريف نوع المنتج بناءً على قاعدة البيانات الجديدة
type Product = {
  id: string
  name: string
  category: string
  price: number
  unit: string
  min_order?: number
  image_url?: string
  in_stock?: boolean
}

function buildWaUrl(p: Product) {
  const msg = encodeURIComponent(
    `مرحباً، أود الاستفسار عن:\n📦 ${p.name}\n💰 السعر: ${p.price} ﷼ / ${p.unit}\n📦 أقل كمية: ${p.min_order ?? "غير محدد"}`
  )
  return `https://wa.me/${WHATSAPP}?text=${msg}`
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  // سحبنا التصنيفات (Categories) ديناميكياً من المنتجات بدلاً من ملف ثابت
  const [categories, setCategories] = useState<string[]>(["الكل"])
  const [activeCategory, setActiveCategory] = useState("الكل")
  const [search, setSearch] = useState("")
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      // جلب جميع المنتجات من Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
      } else if (data) {
        setProducts(data);
        
        // استخراج التصنيفات الفريدة من المنتجات لإظهارها في القائمة الجانبية
        const uniqueCategories = Array.from(new Set(data.map(p => p.category)));
        setCategories(["الكل", ...uniqueCategories]);
      }
      setLoaded(true);
    }

    fetchProducts();
  }, [])

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
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-[16px] focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
          />
          <a href="/" className="text-sm text-gray-500 hover:text-green-700 shrink-0">← الرئيسية</a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">منتجات الجملة</h1>
          <p className="text-gray-500 mt-1">تصفح المنتجات واطلب مباشرة عبر واتساب — بدون تسجيل</p>
        </div>

        <div className="md:hidden mb-6">
        <label className="block text-xs font-bold text-gray-700 mb-2">القسم</label>          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-[16px] focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-6">
          <aside className="hidden md:block w-48 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-20">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm">الأقسام</h3>
              </div>

              {categories.map((cat, i) => (
                <div key={cat}>
                  <input
                    id={`desktop-cat-${i}`}
                    type="radio"
                    name="desktop-category"
                    className="sr-only"
                    checked={activeCategory === cat}
                    onChange={() => setActiveCategory(cat)}
                  />
                  abel
                    htmlFor={`desktop-cat-${i}`}
                    className={`block w-full cursor-pointer text-right px-4 py-3 text-sm transition-all border-b border-gray-50 last:border-0 ${
                      activeCategory === cat
                        ? "bg-green-50 text-green-700 font-bold"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cat}
                  </label>
                </div>
              ))}
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {!loaded ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-4xl mb-3">⏳</div>
                <p>جاري التحميل من قاعدة البيانات...</p>
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
                <p className="text-xs text-gray-400 mb-4">{filtered.length} منتج متوفر</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filtered.map((p) => (
                    <div key={p.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                      {/* تم تغليف الصورة برابط لصفحة المنتج (SEO/Merchant) */}
                      <a href={`/products/${p.id}`} className="block relative">
                        <div className="h-36 bg-gray-50 flex items-center justify-center overflow-hidden">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="text-5xl text-gray-300">📦</div>
                          )}
                        </div>
                        {p.in_stock === false && (
                          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            نفدت الكمية
                          </span>
                        )}
                      </a>

                      <div className="p-3 flex flex-col flex-1">
                        <div className="text-xs text-gray-400 mb-0.5">{p.category}</div>
                        <a href={`/products/${p.id}`} className="font-bold text-gray-900 text-sm leading-tight mb-1 hover:text-green-700 transition-colors line-clamp-2">
                          {p.name}
                        </a>
                        <div className="text-xs text-gray-400 mb-1">{p.unit}</div>

                        <div className="mt-auto">
                          {p.min_order && (
                            <div className="text-xs text-orange-600 font-bold mb-2">⚠️ أقل طلب: {p.min_order}</div>
                          )}
                          <div className="text-base font-extrabold text-green-700 mb-3">{p.price} ﷼</div>

                          <a
                            href={buildWaUrl(p)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-3 rounded-lg text-center transition-colors"
                          >
                            💬 للطلب والتفاوض
                          </a>
                        </div>
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
                ><a href="/" className="hover:text-green-500 transition-colors">الرئيسية</a></li>
                ><a href="/products" className="hover:text-green-500 transition-colors">منتجات الجملة</a></li>
                ><a href="/#suppliers" className="hover:text-green-500 transition-colors">شبكة الموردين</a></li>
                ><a href="/#europe" className="hover:text-green-500 transition-colors">الاستيراد الدولي</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">الشركة</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                ><a href="/about" className="hover:text-green-500 transition-colors">من نحن</a></li>
                ><a href="/contact" className="hover:text-green-500 transition-colors">تواصل معنا</a></li>
                ><a href="/terms" className="hover:text-green-500 transition-colors">الشروط والأحكام</a></li>
                ><a href="/privacy" className="hover:text-green-500 transition-colors">سياسة الخصوصية</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">دعم العملاء</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                >
                  <span dir="ltr">+966 53 518 9367</span>
                </li>
                >
                  <span>info@hawiyasa.com</span>
                </li>
                >
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