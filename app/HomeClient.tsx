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

function ProductCard({ p }: { p: Product }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
      <a href={`/products/${p.id}`} className="block h-36 bg-gray-50 relative overflow-hidden flex-shrink-0">
        {p.image_url ? (
          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">📦</div>
        )}
        {p.in_stock === false && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">نفدت</span>
        )}
        {p.badge === "تصفية" && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">🏷️ تصفية</span>
        )}
      </a>
      <div className="p-3 flex flex-col flex-1">
        <div className="text-xs text-gray-400 mb-0.5">{p.category}</div>
        <a href={`/products/${p.id}`} className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-2 block">
          {p.name}
        </a>
        <div className="text-xs text-gray-400 mb-1">{p.unit}</div>
        {p.min_order && (
          <div className="text-xs text-orange-600 font-bold mb-1">الحد الأدنى: {p.min_order}</div>
        )}
        <div className="text-base font-extrabold text-green-700 mb-3">{p.price} ﷼</div>
        {p.in_stock === false ? (
          <div className="block w-full text-center text-white text-xs font-bold py-2.5 rounded-lg bg-gray-300 select-none">
            غير متوفر
          </div>
        ) : (
          <a
            href={buildWaUrl(p)}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center text-white text-xs font-bold py-2.5 rounded-lg bg-green-700"
          >
            💬 اطلب الآن
          </a>
        )}
      </div>
    </div>
  );
}

function FeaturedProducts({ products, emptyMsg }: { products: Product[]; emptyMsg: string }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-3">📦</div>
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
  offersTab?: "products" | "clearance";
}

export default function HomeClient({ initialFeatured, initialClearance, offersTab = "products" }: HomeClientProps) {
  const [userType, setUserType] = useState<"buyer" | "supplier">("buyer");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    if (window.location.search.includes("success=1")) {
      setSuccess(true);
      window.history.replaceState({}, document.title, window.location.pathname + "#join-form");
    }
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      const secs = ["home", "services", "offers", "suppliers", "europe"];
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
    { id: "services", label: "خدماتنا" },
    { id: "offers", label: "العروض والمنتجات" },
    { id: "suppliers", label: "الموردين والتوريد" },
    { id: "europe", label: "الاستيراد من أوروبا" },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-white font-sans">

      <nav className={`sticky top-0 z-[100] bg-white border-b border-gray-200 ${scrolled ? "shadow-sm" : ""}`}>
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
                className={`px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap ${
                  active === s.id ? "text-green-700 border-green-700" : "text-gray-500 border-transparent"
                }`}>
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
                <div key={f} className="text-sm text-gray-700 font-medium">{f}</div>
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

          <div id="join-form" className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
            {success ? (
              <div className="text-center py-8 bg-green-50 rounded-xl">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-700">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-green-800 mb-2">تم استلام طلبك بنجاح!</h3>
                <p className="text-sm text-gray-500 mb-4">سيتواصل معك فريق المبيعات قريباً.</p>
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
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">نوع الحساب <span className="text-red-500">*</span></label>
                    <select name="userType" value={userType} onChange={(e) => setUserType(e.target.value as "buyer" | "supplier")}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white focus:border-green-500 outline-none"
                      style={{ fontSize: "16px" }}>
                      <option value="buyer">مشتري / تاجر</option>
                      <option value="supplier">مورد / مصنع</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-700">اسم الشركة <span className="text-red-500">*</span></label>
                      <input name="company" required placeholder="مؤسسة النور..."
                        className="px-3 py-3 border border-gray-300 rounded-lg focus:border-green-500 outline-none"
                        style={{ fontSize: "16px" }} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-700">المدينة <span className="text-red-500">*</span></label>
                      <input name="city" required placeholder="جدة، الرياض..."
                        className="px-3 py-3 border border-gray-300 rounded-lg focus:border-green-500 outline-none"
                        style={{ fontSize: "16px" }} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-700">اسم المسؤول <span className="text-red-500">*</span></label>
                    <input name="name" required placeholder="الاسم الكامل"
                      className="px-3 py-3 border border-gray-300 rounded-lg focus:border-green-500 outline-none"
                      style={{ fontSize: "16px" }} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-700">رقم الجوال <span className="text-red-500">*</span></label>
                    <input name="phone" required dir="ltr" placeholder="05XXXXXXXX" type="tel"
                      className="px-3 py-3 border border-gray-300 rounded-lg focus:border-green-500 outline-none text-right"
                      style={{ fontSize: "16px" }} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-700">نوع النشاط <span className="text-red-500">*</span></label>
                    <select name="businessType" required
                      className="px-3 py-3 border border-gray-300 rounded-lg bg-white focus:border-green-500 outline-none"
                      style={{ fontSize: "16px" }}>
                      <option value="">اختر نوع النشاط...</option>
                      <option value="importer">شركة استيراد</option>
                      <option value="manufacturer">مصنع / منتج</option>
                      <option value="distributor">موزع / تاجر جملة</option>
                      <option value="exporter">شركة تصدير</option>
                      <option value="retailer">تاجر تجزئة / هايبر</option>
                    </select>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-green-700 disabled:opacity-70 text-white font-bold py-3 rounded-lg shadow-md">
                    {loading ? "جاري إرسال الطلب..." : "تأكيد الطلب والانضمام"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ✅ قسم الخدمات — جديد */}
      <section id="services" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold tracking-widest text-green-700 uppercase mb-2">ما نقدمه</p>
            <h2 className="text-3xl font-extrabold text-gray-900">خدماتنا</h2>
            <p className="text-gray-500 mt-2 max-w-xl">
              منصة حاوية تجمع كل ما يحتاجه تاجر الجملة والتجزئة في مكان واحد.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="border border-gray-200 rounded-2xl p-7 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#01696f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/>
                  <path d="M16.5 9.4 7.55 4.24"/>
                  <polyline points="3.29 7 12 12 20.71 7"/>
                  <line x1="12" y1="22" x2="12" y2="12"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">العروض والمنتجات</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  تصفح مئات المنتجات الغذائية والمنظفات المتاحة بأسعار الجملة من موردين وشركات معتمدة، مع إمكانية الطلب المباشر بدون وسيط.
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-2xl p-7 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#da7101" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">التصفية والستوكات</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  فرص شراء حصرية على دفعات وستوكات الشركات والمصانع بأسعار تنافسية، مناسبة للتجار الباحثين عن هامش ربح أعلى.
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-2xl p-7 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006494" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">الاستيراد والتصدير من المصانع</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  نربطك مباشرة بالمصانع والموردين في أوروبا وتركيا والشرق الأوسط للاستيراد بسعر المصنع، أو لتصدير منتجاتك للأسواق الخارجية.
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-2xl p-7 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#01696f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">ربط التجار بالموردين للتوريد اليومي</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  نوصّل تجار الجملة والتجزئة بالموردين والشركات للتعاقد على التوريد المنتظم، مع عروض مخصصة وأسعار ثابتة لضمان استمرارية التشغيل.
                </p>
              </div>
            </div>

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
              <p className="text-gray-500 mt-2"> اطلب مباشر الان </p>
            </div>
            <a href="/products" className="hidden md:flex items-center gap-1 text-green-700 font-bold text-sm hover:underline shrink-0">
              مشاهدة الكل ←
            </a>
          </div>

          <div className="flex gap-2 mb-6">
            <a
              href="/#offers"
              className={`px-5 py-2 rounded-xl text-sm font-bold block text-center ${
                offersTab === "products" ? "bg-green-700 text-white" : "bg-white border border-gray-200 text-gray-600"
              }`}
            >
              📦 المنتجات
            </a>
            <a
              href="/?tab=clearance#offers"
              className={`px-5 py-2 rounded-xl text-sm font-bold block text-center ${
                offersTab === "clearance" ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600"
              }`}
            >
              🏷️ تصفية وستوكات
            </a>
          </div>

          {offersTab === "products"
            ? <FeaturedProducts products={initialFeatured} emptyMsg="لا توجد منتجات حالياً" />
            : <FeaturedProducts products={initialClearance} emptyMsg="لا توجد منتجات تصفية حالياً" />
          }

          <div className="text-center mt-8">
            <a
              href={offersTab === "clearance" ? "/products?tab=clearance" : "/products"}
              className={`inline-flex items-center gap-2 text-white font-bold px-8 py-3 rounded-xl shadow-md ${
                offersTab === "clearance" ? "bg-orange-500" : "bg-green-700"
              }`}>
              {offersTab === "clearance" ? "مشاهدة كل التصفية ←" : "مشاهدة جميع المنتجات ←"}
            </a>
          </div>
        </div>
      </section>

      <section id="suppliers" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-green-700 uppercase mb-2">الموردون</p>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">الموردين والتوريد اليومي</h2>
          <p className="text-gray-500 mb-10">اطلب من الموردين المعتمدين مباشرة بكميات الجملة.</p>
          <div className="relative rounded-2xl overflow-hidden border border-gray-100">
            <div className="blur-md opacity-40 pointer-events-none grid grid-cols-3 gap-4 p-6">
              {["مصانع", "زراعي", "لحوم"].map((e, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <div className="w-10 h-10 rounded-full bg-gray-300 mb-3"></div>
                  <div className="h-3 bg-gray-300 rounded w-4/5 mb-2"></div>
                  <div className="h-2.5 bg-gray-200 rounded w-3/5"></div>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-white/90">
              <h3 className="text-lg font-extrabold text-gray-900 mb-2">هذا القسم قيد التجهيز</h3>
              <span className="bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full">قريباً</span>
            </div>
          </div>
        </div>
      </section>

      <section id="europe" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-green-700 uppercase mb-2">الاستيراد الدولي</p>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">استورد بأسعار المصنع مباشرة</h2>
          <p className="text-gray-500 mb-10">نربطك بكبار المصانع والموردين في أوروبا والشرق الأوسط.</p>
          <div className="relative rounded-2xl overflow-hidden border border-gray-100">
            <div className="blur-sm pointer-events-none select-none grid grid-cols-4 gap-3 p-6">
              {["ألمانيا", "فرنسا", "هولندا", "إسبانيا", "بولندا", "إيطاليا", "تركيا", "مصر"].map((c) => (
                <div key={c} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                  <div className="text-xs font-bold text-gray-800">{c}</div>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-white/90">
              <h3 className="text-lg font-extrabold text-gray-900 mb-2">هذا القسم قيد التجهيز</h3>
              <span className="bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full">قريباً</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/logo.png" alt="حاوية" width={34} height={34} className="object-contain brightness-0 invert" />
                <span className="text-2xl font-extrabold text-white">حاوية</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">سوق الجملة الافتراضي لقطاع الأغذية في المملكة العربية السعودية.</p>
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