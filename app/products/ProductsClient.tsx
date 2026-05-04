"use client";
import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  unit: string;
  category?: string | null;
  image_url?: string | null;
  in_stock?: boolean | null;
  min_order?: string | null;
  badge?: string | null;
}

const WHATSAPP = "966535189367";

function buildWaUrl(product: Product) {
  const msg = encodeURIComponent(
    `مرحباً، أريد طلب هذا المنتج من منصة حاوية:\n📦 ${product.name}\n💰 السعر: ${product.price} ﷼ / ${product.unit}\nالكمية المطلوبة: `
  );
  return `https://wa.me/${WHATSAPP}?text=${msg}`;
}

export default function ProductsClient({ products }: { products: Product[] }) {
  const [selectedCat, setSelectedCat] = useState("الكل");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "clearance">("products");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "clearance") setActiveTab("clearance");
  }, []);

  const tabFiltered = products.filter((p) =>
    activeTab === "clearance" ? p.badge === "تصفية" : p.badge !== "تصفية"
  );

  const categories = [
    "الكل",
    ...Array.from(new Set(tabFiltered.map((p) => p.category || "عام").filter(Boolean))),
  ];

  const filtered = tabFiltered.filter((p) => {
    const matchCat = selectedCat === "الكل" || p.category === selectedCat;
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans flex flex-col">

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-2xl font-extrabold text-green-800">حاوية</a>
          <span className="text-sm text-gray-500 hidden sm:block">المنتجات والعروض</span>
        </div>
      </header>

      {/* تابات */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex gap-2 py-3">
          <button type="button" onClick={() => { setActiveTab("products"); setSelectedCat("الكل"); }}
            className={`px-5 py-2 rounded-xl text-sm font-bold ${
              activeTab === "products" ? "bg-green-700 text-white" : "bg-gray-100 text-gray-600"
            }`}>
            📦 المنتجات
          </button>
          <button type="button" onClick={() => { setActiveTab("clearance"); setSelectedCat("الكل"); }}
            className={`px-5 py-2 rounded-xl text-sm font-bold ${
              activeTab === "clearance" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"
            }`}>
            🏷️ تصفية وستوكات
          </button>
        </div>
      </div>

      {/* بحث */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="🔍  ابحث عن منتج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xl border border-gray-300 rounded-xl px-4 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600"
            style={{ fontSize: "16px" }}
          />
          <div className="md:hidden">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600"
              style={{ fontSize: "16px" }}>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-8 gap-8">

        {/* sidebar */}
        <aside className="hidden md:block w-52 flex-shrink-0">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">الفئات</h2>
          <div className="flex flex-col gap-1">
            {categories.map((cat) => (
              <button key={cat} type="button" onClick={() => setSelectedCat(cat)}
                className={`w-full text-right px-4 py-2.5 rounded-lg text-sm font-medium ${
                  selectedCat === cat
                    ? activeTab === "clearance" ? "bg-orange-500 text-white" : "bg-green-700 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <div className="text-5xl mb-4">{activeTab === "clearance" ? "🏷️" : "📦"}</div>
              <p className="font-bold text-gray-500 text-lg mb-1">لا توجد نتائج</p>
              <p className="text-sm">جرّب تغيير الفئة أو كلمة البحث</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-400">{filtered.length} منتج</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col"
                  >
                    {/* صورة — a مستقل ينقل لصفحة المنتج */}
                    <a
                      href={`/products/${product.id}`}
                      className="block h-48 bg-gray-50 relative overflow-hidden flex-shrink-0"
                    >
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl text-gray-200">📦</div>
                      )}
                      {product.in_stock === false && (
                        <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">نفد</span>
                      )}
                      {product.badge === "تصفية" && (
                        <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">🏷️ تصفية</span>
                      )}
                      {product.category && (
                        <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">{product.category}</span>
                      )}
                    </a>

                    <div className="p-5 flex flex-col flex-1">
                      {/* اسم المنتج — a مستقل */}
                      <a
                        href={`/products/${product.id}`}
                        className="font-bold text-gray-900 text-base leading-tight mb-1 line-clamp-2 block"
                      >
                        {product.name}
                      </a>

                      {product.description && (
                        <p className="text-xs text-gray-400 line-clamp-2 mb-3">{product.description}</p>
                      )}

                      <div className="mt-auto">
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className="text-2xl font-extrabold text-green-700">{product.price}</span>
                          <span className="text-sm text-gray-400">﷼ / {product.unit}</span>
                        </div>
                        {product.min_order && (
                          <p className="text-xs text-gray-400 mb-3">الحد الأدنى: {product.min_order}</p>
                        )}

                        {/* زر واتساب — a مستقل تماماً بدون أي JS */}
                        {product.in_stock === false ? (
                          <div className="block w-full text-center text-white text-sm font-bold py-3 rounded-xl bg-gray-300 select-none">
                            غير متوفر
                          </div>
                        ) : (
                          <a
                            href={buildWaUrl(product)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center text-white text-sm font-bold py-3 rounded-xl bg-green-700"
                          >
                            💬 اطلب الآن
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      <footer className="bg-gray-900 pt-16 pb-8 mt-auto">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/logo.png" alt="حاوية" width={34} height={34} className="object-contain brightness-0 invert" />
                <span className="text-2xl font-extrabold text-white">حاوية</span>
              </div>
              <p className="text-gray-400 text-sm">سوق الجملة الافتراضي لقطاع الأغذية في المملكة العربية السعودية.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">المنصة</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="/" className="hover:text-green-500">الرئيسية</a></li>
                <li><a href="/products" className="hover:text-green-500">منتجات الجملة</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">الشركة</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="/about" className="hover:text-green-500">من نحن</a></li>
                <li><a href="/terms" className="hover:text-green-500">الشروط والأحكام</a></li>
                <li><a href="/privacy" className="hover:text-green-500">سياسة الخصوصية</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">دعم العملاء</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><span dir="ltr">+966 53 518 9367</span></li>
                <li><span>info@hawiyasa.com</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs">جميع الحقوق محفوظة © 2026 منصة حاوية لتقنية المعلومات</p>
            <span className="text-gray-500 text-xs">المملكة العربية السعودية - جدة</span>
          </div>
        </div>
      </footer>
    </div>
  );
}