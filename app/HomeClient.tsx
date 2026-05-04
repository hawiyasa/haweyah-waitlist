"use client";
import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  category?: string | null;
  price: number;
  unit: string;
  image_url?: string | null;
  in_stock?: boolean | null;
  min_order?: string | null;
  badge?: string | null;
  description?: string | null;
}

const WHATSAPP = "966535189367";

function buildWaUrl(product: Product) {
  const msg = encodeURIComponent(
    `مرحباً، أريد طلب هذا المنتج من منصة حاوية:\n📦 ${product.name}\n💰 السعر: ${product.price} ﷼ / ${product.unit}\nالكمية المطلوبة: `
  );
  return `https://wa.me/${WHATSAPP}?text=${msg}`;
}

function trackWhatsapp(product: Product) {
  // @ts-ignore
  window.gtag?.("event", "whatsapp_click", {
    product_id: product.id,
    product_name: product.name,
    product_category: product.category,
    product_price: product.price,
    page: "home",
  });
}

function ProductCard({ p }: { p: Product }) {
  return (
    <a
      href={`/products/${p.id}`}
      className="group block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
    >
      <div className="h-36 bg-gray-50 flex items-center justify-center relative overflow-hidden">
        {p.image_url ? (
          <img src={p.image_url} alt={p.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy" />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-lg">📦</div>
        )}
        {p.in_stock === false && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">نفدت الكمية</span>
        )}
        {p.badge === "تصفية" && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">🏷️ تصفية</span>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <div className="text-xs text-gray-400 mb-1">{p.category}</div>
        <div className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-1">{p.name}</div>
        <div className="text-xs text-gray-400 mb-1">{p.unit}</div>
        {p.min_order && <div className="text-xs text-orange-600 font-bold mb-1">الحد الأدنى: {p.min_order}</div>}
        <div className="text-base font-extrabold text-green-700 mb-3">{p.price} ﷼</div>

        {/* ✅ زر الكمبيوتر */}
        <a
          href={buildWaUrl(p)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => { e.stopPropagation(); trackWhatsapp(p); }}
          className={`hidden md:block w-full text-center text-white text-xs font-bold py-2 rounded-lg transition-colors ${
            p.in_stock === false
              ? "bg-gray-300 cursor-not-allowed pointer-events-none"
              : "bg-green-700 hover:bg-green-800"
          }`}
        >
          {p.in_stock === false ? "غير متوفر" : "💬 اطلب الآن"}
        </a>

        {/* ✅ زر الموبايل — بدون stopPropagation لضمان عمله على iOS */}
        <a
          href={buildWaUrl(p)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsapp(p)}
          className={`md:hidden w-full text-center text-white text-xs font-bold py-2.5 rounded-lg transition-colors touch-manipulation ${
            p.in_stock === false
              ? "bg-gray-300 pointer-events-none"
              : "bg-green-700 active:bg-green-900"
          }`}
          style={{ WebkitTapHighlightColor: "transparent", display: "block" }}
        >
          {p.in_stock === false ? "غير متوفر" : "💬 اطلب الآن"}
        </a>
      </div>
    </a>
  );
}

function FeaturedProducts({ products, emptyMsg }: { products: Product[]; emptyMsg: string }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300 mb-3">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" /><path d="M9 21V9" />
        </svg>
        <p className="text-sm">{emptyMsg}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((p) => <ProductCard key={p.id} p={p} />)}
    </div>
  );
}

interface HomeClientProps {
  initialFeatured: Product[];
  initialClearance: Product[];
}

export default function HomeClient({ initialFeatured, initialClearance }: HomeClientProps) {
  const [userType, setUserType] = useState<"buyer" | "supplier">("buyer");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [offersTab, setOffersTab] = useState<"products" | "clearance">("products");

  useEffect(() => {
    if (window.location.search.includes("success=1")) {
      setSuccess(true);
      window.history.replaceState({}, document.title, window.location.pathname + "#join-form");
    }
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      const secs = ["home", "offers", "suppliers", "europe"];
      let cur = "home";
      secs.forEach((id) => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 130) cur = id;
      });
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sections = [
    { id: "home", label: "الرئيسية" },
    { id: "offers", label: "العروض والمنتجات" },
    { id: "suppliers", label: "الموردين والتوريد" },
    { id: "europe", label: "الاستيراد من أوروبا" },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-white font-sans">

      <nav className={`sticky top-0 z-[100] bg-white border-b border-gray-200 transition-shadow ${scrolled ? "shadow-sm" : ""}`}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between border-b border-gray-100">
          <a href="#home" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="حاوية" width={38} height={38} className="object-contain" />
            <span className="text-2xl font-extrabold text-green-800 tracking-tight">حاوية</span>
          </a>
          <a href="#join-form" className="bg-green-700 text-white text-sm font-bold px-4 py-2 rounded-lg">سجّل الآن</a>
        </div>
        <div className="max-w-5xl mx-auto px-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex min-w-max">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}
                className={`px-4 py-3 text-sm font-bold text-center border-b-2 transition-all whitespace-nowrap ${
                  active === s.id ? "text-green-700 border-green-700" : "text-gray-500 border-transparent"
                }`}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="min-h-[88vh] flex items-center bg-gradient-to-br from-white via-white to-green-50 px-6 py-20">
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 border border-green-200 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
              اكبر شبكة موردين بالقطاع الغذائي في مكان واحد
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              سوق الجملة الافتراضي<br />
              الأكبر لقطاع <span className="text-green-700">الأغذية</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              نربط المصانع والموردين مباشرة مع تجار الجملة والتجزئة والمطاعم.<br />
              أسعار المصنع، عروض تصفية، وتوريد يومي في مكان واحد.
            </p>
            <div className="flex flex-col gap-3 mb-8">
              {[
                "✅ تواصل مباشر مع الموردين بدون وسطاء",
                "✅ عروض تصفية يومية بأسعار المصنع",
                "✅ استيراد مباشر من أوروبا وتركيا",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-700 font-medium">{f}</div>
              ))}
            </div>
            <div className="flex gap-8">
              {[
                { n: "+500", l: "منتج جملة" },
                { n: "+120", l: "مورد ومصنع" },
                { n: "12", l: "مدينة سعودية" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-extrabold text-green-700">{s.n}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div id="join-form" className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl relative z-10">
            {success ? (
              <div className="text-center py-8 bg-green-50 rounded-xl">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-700">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-green-800 mb-2">تم استلام طلبك بنجاح!</h3>
                <p className="text-sm text-gray-500 mb-4">سيتواصل معك فريق المبيعات قريباً لإكمال إجراءات التفعيل.</p>
                <button type="button" onClick={() => setSuccess(false)}
                  className="bg-green-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg">
                  إرسال طلب جديد
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-center font-bold text-gray-900 mb-1">ابدأ التوريد — سجّل مؤسستك</h2>
                <p className="text-center text-xs text-gray-400 mb-5">سجّل الآن لتكون من أوائل المستفيدين فور الإطلاق</p>
                <form action="/api/waitlist" method="POST" className="space-y-4" onSubmit={() => setLoading(true)}>
                  <div className="mb-5">
                    <label className="block text-xs font-bold text-gray-700 mb-2">نوع الحساب <span className="text-red-500">*</span></label>
                    <select name="userType" value={userType} onChange={(e) => setUserType(e.target.value as "buyer" | "supplier")}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg text-[16px] bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none">
                      <option value="buyer">مشتري / تاجر</option>
                      <option value="supplier">مورد / مصنع</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700">اسم الشركة / المؤسسة <span className="text-red-500">*</span></label>
                        <input name="company" required placeholder="مثال: مؤسسة النور..."
                          className="px-3 py-3 border border-gray-300 rounded-lg text-[16px] focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700">المدينة <span className="text-red-500">*</span></label>
                        <input name="city" required placeholder="جدة، الرياض..."
                          className="px-3 py-3 border border-gray-300 rounded-lg text-[16px] focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-700">اسم المسؤول <span className="text-red-500">*</span></label>
                      <input name="name" required placeholder="الاسم الكامل"
                        className="px-3 py-3 border border-gray-300 rounded-lg text-[16px] focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-700">رقم الجوال <span className="text-red-500">*</span></label>
                      <input name="phone" required dir="ltr" placeholder="05XXXXXXXX" type="tel"
                        className="px-3 py-3 border border-gray-300 rounded-lg text-[16px] focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-right" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-700">نوع النشاط <span className="text-red-500">*</span></label>
                      <select name="businessType" required
                        className="px-3 py-3 border border-gray-300 rounded-lg text-[16px] bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none">
                        <option value="">اختر نوع النشاط...</option>
                        <option value="importer">شركة استيراد</option>
                        <option value="manufacturer">مصنع / منتج</option>
                        <option value="distributor">موزع / تاجر جملة</option>
                        <option value="exporter">شركة تصدير</option>
                        <option value="retailer">تاجر تجزئة / هايبر</option>
                      </select>
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-70 text-white font-bold py-3 rounded-lg transition-all shadow-md cursor-pointer text-center">
                      {loading ? "جاري إرسال الطلب..." : "تأكيد الطلب والانضمام"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* قسم العروض */}
      <section id="offers" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold tracking-widest text-green-700 uppercase mb-2">عروض اليوم</p>
              <h2 className="text-3xl font-extrabold text-gray-900">العروض والمنتجات الحالية</h2>
              <p className="text-gray-500 mt-2">تصفح المنتجات واطلب مباشرة عبر واتساب — بدون تسجيل</p>
            </div>
            <a href="/products" className="hidden md:flex items-center gap-1 text-green-700 font-bold text-sm hover:underline shrink-0">
              مشاهدة الكل ←
            </a>
          </div>
          <div className="flex gap-2 mb-6">
            <button type="button" onClick={() => setOffersTab("products")}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                offersTab === "products" ? "bg-green-700 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-700"
              }`}>
              📦 المنتجات
            </button>
            <button type="button" onClick={() => setOffersTab("clearance")}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                offersTab === "clearance" ? "bg-orange-500 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-600"
              }`}>
              🏷️ تصفية وستوكات
            </button>
          </div>
          {offersTab === "products" ? (
            <FeaturedProducts products={initialFeatured} emptyMsg="لا توجد منتجات حالياً — ستظهر هنا بعد الإضافة من لوحة التحكم" />
          ) : (
            <FeaturedProducts products={initialClearance} emptyMsg="لا توجد منتجات تصفية حالياً — أضف منتجاً وضع badge = تصفية" />
          )}
          <div className="text-center mt-8">
            <a href={offersTab === "clearance" ? "/products?tab=clearance" : "/products"}
              className={`inline-flex items-center gap-2 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md ${
                offersTab === "clearance" ? "bg-orange-500 hover:bg-orange-600" : "bg-green-700 hover:bg-green-800"
              }`}>
              {offersTab === "clearance" ? "مشاهدة كل التصفية ←" : "مشاهدة جميع المنتجات ←"}
            </a>
          </div>
        </div>
      </section>

      {/* الموردين */}
      <section id="suppliers" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-bold tracking-widest text-green-700 uppercase mb-2">الموردون</p>
            <h2 className="text-3xl font-extrabold text-gray-900">الموردين والتوريد اليومي</h2>
            <p className="text-gray-500 mt-2">اطلب من الموردين المعتمدين مباشرة بكميات الجملة وجداول توريد يومية.</p>
          </div>
          <div className="relative rounded-2xl overflow-hidden">
            <div className="blur-md opacity-40 pointer-events-none grid grid-cols-3 gap-4 p-2">
              {["مصانع", "زراعي", "لحوم"].map((e, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold mb-3 text-gray-500">{e.substring(0, 1)}</div>
                  <div className="h-3 bg-gray-300 rounded w-4/5 mb-2"></div>
                  <div className="h-2.5 bg-gray-200 rounded w-3/5"></div>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center p-4 bg-white/90 z-20">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-extrabold text-gray-900 mb-2">هذا القسم قيد التجهيز</h3>
              <p className="text-gray-600 font-medium max-w-sm mx-auto text-sm leading-relaxed">نعمل على بناء شبكة موردين معتمدين للتوريد اليومي بأسعار المصنع.</p>
              <span className="mt-4 bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full">قريباً</span>
            </div>
          </div>
        </div>
      </section>

      {/* أوروبا */}
      <section id="europe" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-bold tracking-widest text-green-700 uppercase mb-3">الاستيراد الدولي</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">استورد بأسعار المصنع مباشرة</h2>
            <p className="text-gray-500">نربطك بكبار المصانع والموردين في أوروبا والشرق الأوسط. لا وسطاء، تسعير مباشر، وشحن منظم حتى باب مستودعك.</p>
          </div>
          <div className="relative rounded-2xl overflow-hidden">
            <div className="blur-sm pointer-events-none select-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div className="space-y-4">
                  {[
                    { title: "تواصل مباشر مع المصنع", desc: "بدون وسطاء، تتفاوض مباشرة وتحصل على أفضل سعر" },
                    { title: "شحن من الباب للباب", desc: "بحري أو جوي + جمارك + تسليم لمستودعك" },
                    { title: "منتجات معتمدة حلال", desc: "شهادات الحلال المعتمدة للسوق السعودي" },
                    { title: "أسعار تنافسية مضمونة", desc: "حجم الكونتينرات يتيح أسعاراً لا تجدها محلياً" },
                  ].map((f) => (
                    <div key={f.title} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{f.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {["ألمانيا", "فرنسا", "هولندا", "إسبانيا", "بولندا", "إيطاليا", "تركيا", "مصر"].map((c) => (
                    <div key={c} className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm">
                      <div className="text-xs font-bold text-gray-800">{c}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center p-4 bg-white/90 z-20">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-extrabold text-gray-900 mb-2">هذا القسم قيد التجهيز</h3>
              <p className="text-gray-600 font-medium max-w-sm mx-auto text-sm leading-relaxed">نعمل على بناء شبكة استيراد مباشرة من المصانع الأوروبية.</p>
              <span className="mt-4 bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full">قريباً</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 pt-16 pb-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/logo.png" alt="حاوية" width={34} height={34} className="object-contain brightness-0 invert" />
                <span className="text-2xl font-extrabold text-white tracking-tight">حاوية</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">سوق الجملة الافتراضي لقطاع الأغذية في المملكة العربية السعودية. نربط المصانع والموردين مباشرة بتجار الجملة والتجزئة والهايبرات والتموينات.</p>
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
                  <span>info@hawiyasa.com</span>
                </li>
                <li className="mt-4">
                  <a href="/contact" className="inline-block border border-gray-700 hover:border-green-600 text-gray-300 hover:text-white text-xs font-bold py-2 px-4 rounded transition-colors">نموذج الاستفسارات</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs">جميع الحقوق محفوظة © 2026 <strong className="text-gray-300 font-normal">منصة حاوية لتقنية المعلومات</strong></p>
            <div className="flex gap-4 text-gray-500"><span className="text-xs">المملكة العربية السعودية - جدة</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}