"use client";

import { useState } from "react";

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

export default function ProductsClient({ products }: { products: Product[] }) {
  const [selectedCat, setSelectedCat] = useState("الكل");
  const [search, setSearch] = useState("");

  const categories = [
    "الكل",
    ...Array.from(new Set(products.map((p) => p.category || "عام").filter(Boolean))),
  ];

  const filtered = products.filter((p) => {
    const matchCat    = selectedCat === "الكل" || p.category === selectedCat;
    const matchSearch = search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const WHATSAPP = "966535189367";
  function buildWaUrl(product: Product) {
    const msg = encodeURIComponent(
      `مرحباً، أريد طلب هذا المنتج من منصة حاوية:\n📦 ${product.name}\n💰 السعر: ${product.price} ﷼ / ${product.unit}\nالكمية المطلوبة: `
    );
    return `https://wa.me/${WHATSAPP}?text=${msg}`;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-2xl font-extrabold text-green-800 tracking-tight">حاوية</a>
          <span className="text-sm text-gray-500 font-medium hidden sm:block">
            سوق الجملة للمواد الغذائية ومستلزمات التنظيف
          </span>
        </div>
      </header>

      {/* Search */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <input
            type="text"
            placeholder="🔍  ابحث عن منتج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xl border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
          />
        </div>
      </div>

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-8 gap-8">
        {/* Sidebar */}
        <aside className="hidden md:block w-52 flex-shrink-0">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">الفئات</h2>
          <div className="flex flex-col gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`w-full text-right px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCat === cat
                    ? "bg-green-700 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1">
          {/* Mobile Categories */}
          <div className="flex md:hidden gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  selectedCat === cat
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Empty */}
          {filtered.length === 0 && (
            <div className="text-center py-24 text-gray-400">
              <div className="text-5xl mb-4">📦</div>
              <p className="font-bold text-gray-500 text-lg mb-1">لا توجد منتجات</p>
              <p className="text-sm">جرّب تغيير الفئة أو كلمة البحث</p>
            </div>
          )}

          {/* Products Grid */}
          {filtered.length > 0 && (
            <>
              <div className="mb-4 text-sm text-gray-400">{filtered.length} منتج</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <a
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col group"
                  >
                    <div className="h-48 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-5xl text-gray-200">📦</span>
                      )}
                      {product.in_stock === false && (
                        <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">نفد</span>
                      )}
                      {product.badge && (
                        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">{product.badge}</span>
                      )}
                      {product.category && (
                        <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">{product.category}</span>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 text-base leading-tight mb-1 line-clamp-2">{product.name}</h3>
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
                        <a
                          href={buildWaUrl(product)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`block w-full text-center text-white text-sm font-bold py-2.5 rounded-xl transition-colors ${
                            product.in_stock === false
                              ? "bg-gray-300 cursor-not-allowed pointer-events-none"
                              : "bg-green-700 hover:bg-green-800"
                          }`}
                        >
                          {product.in_stock === false ? "غير متوفر" : "💬 اطلب الآن"}
                        </a>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      <footer className="bg-gray-900 py-8 border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          جميع الحقوق محفوظة © 2026 منصة حاوية
        </div>
      </footer>
    </div>
  );
}