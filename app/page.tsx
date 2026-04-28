"use client";
import { useState, useEffect } from "react";
import { getProducts, Product } from "./lib/products";

function FeaturedProducts() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    setFeatured(getProducts().slice(0, 4));
  }, []);

  if (featured.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300 mb-3">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" /><path d="M9 21V9" />
        </svg>
        <p className="text-sm">لا توجد منتجات حالياً — ستظهر هنا بعد الإضافة من لوحة التحكم</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {featured.map((p) => (
        <div key={p.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="h-36 bg-gray-50 flex items-center justify-center relative overflow-hidden">
            {p.image ? (
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-lg">
                {p.name.substring(0, 2)}
              </div>
            )}
            {p.badge && (
              <span className="absolute top-2 right-2 bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">{p.badge}</span>
            )}
          </div>
          <div className="p-3">
            <div className="text-xs text-gray-400 mb-1">{p.category}</div>
            <div className="font-bold text-gray-900 text-sm leading-tight mb-1">{p.name}</div>
            <div className="text-xs text-gray-400 mb-1">{p.unit}</div>
            {p.minOrder && <div className="text-xs text-orange-600 font-bold mb-1">الحد الأدنى: {p.minOrder}</div>}
            <div className="text-base font-extrabold text-green-700">{p.price} ﷼</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // قراءة رابط الصفحة لاكتشاف هل تم الإرسال بنجاح
    if (window.location.search.includes('success=1')) {
      setSuccess(true);
      // مسح الرابط لتنظيفه
      window.history.replaceState({}, document.title, window.location.pathname + '#join-form');
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
              <a key={s.id} href={`#${s.id}`} className={`px-4 py-3 text-sm font-bold text-center border-b-2 transition-all whitespace-nowrap ${active === s.id ? "text-green-700 border-green-700" : "text-gray-500 border-transparent"}`}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <section id="home" className="min-h-[88vh] flex items-center bg-gradient-to-br from-white via-white to-green-50 px-6 py-20">
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 border border-green-200 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
              قريباً في المملكة العربية السعودية
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              سوق الجملة الافتراضي<br />الأكبر لقطاع <span className="text-green-700">الأغذية</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              نربط المصانع والموردين مباشرة مع تجار الجملة والتجزئة والمطاعم.<br />أسعار المصنع، عروض تصفية، وتوريد يومي في مكان واحد.
            </p>
            <div className="flex gap-8">
              {[{ n: "+500", l: "منتج جملة" }, { n: "+120", l: "مورد ومصنع" }, { n: "12", l: "مدينة سعودية" }].map((s) => (
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
                <p className="text-sm text-gray-500 mb-4">سيتواصل معك فريق المبيعات قريباً.</p>
                <button onClick={() => setSuccess(false)} type="button" className="bg-green-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg">
                  إرسال طلب جديد
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-center font-bold text-gray-900 mb-1">انضم لقائمة الانتظار</h2>
                <p className="text-center text-xs text-gray-400 mb-5">سجّل الآن لتكون من أوائل المستفيدين فور الإطلاق</p>

                <form action="/api/waitlist" method="POST" className="space-y-4" onSubmit={() => setLoading(true)}>
                  <div className="mb-5">
                    <label className="block text-xs font-bold text-gray-700 mb-2">نوع الحساب <span className="text-red-500">*</span></label>
                    <select name="userType" className="w-full px-3 py-3 border border-gray-300 rounded-lg text-[16px] bg-white outline-none">
                      <option value="buyer">مشتري / تاجر</option>
                      <option value="supplier">مورد / مصنع</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-700">اسم الشركة / المؤسسة <span className="text-red-500">*</span></label>
                      <input name="company" required placeholder="مثال: مؤسسة النور..." className="px-3 py-3 border border-gray-300 rounded-lg text-[16px] outline-none" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-700">المدينة <span className="text-red-500">*</span></label>
                      <input name="city" required placeholder="جدة، الرياض..." className="px-3 py-3 border border-gray-300 rounded-lg text-[16px] outline-none" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-700">اسم المسؤول <span className="text-red-500">*</span></label>
                    <input name="name" required placeholder="الاسم الكامل" className="px-3 py-3 border border-gray-300 rounded-lg text-[16px] outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-700">رقم الجوال <span className="text-red-500">*</span></label>
                    <input name="phone" required dir="ltr" placeholder="05XXXXXXXX" type="tel" className="px-3 py-3 border border-gray-300 rounded-lg text-[16px] outline-none text-right" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-70 text-white font-bold py-3.5 rounded-lg shadow-md text-center text-base">
                    {loading ? "جاري الإرسال..." : "تأكيد الطلب والانضمام"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* بقية الأقسام (العروض، الموردين، الاستيراد) والفوتر */}
      <section id="offers" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold tracking-widest text-green-700 uppercase mb-2">عروض اليوم</p>
              <h2 className="text-3xl font-extrabold text-gray-900">العروض والمنتجات الحالية</h2>
            </div>
            <a href="/products" className="hidden md:flex items-center gap-1 text-green-700 font-bold text-sm">مشاهدة الكل ←</a>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      <section id="suppliers" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center py-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">قسم الموردين</h2>
          <p className="text-gray-500">هذا القسم قيد التجهيز</p>
        </div>
      </section>

      <footer className="bg-gray-900 pt-16 pb-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
          جميع الحقوق محفوظة © 2026 منصة حاوية
        </div>
      </footer>
    </div>
  );
}