"use client";
import { useState, useEffect } from "react";
import { getProducts, Product } from "./lib/products";

const BOT_TOKEN = "8782771855:AAGmosrUfAKDB4_WRQ9jUFyOKAt8ACMg4Xw";
const CHAT_ID   = "7426755981";

function FeaturedProducts() {
  const [featured, setFeatured] = useState<Product[]>([]);
  useEffect(() => { setFeatured(getProducts().slice(0, 4)); }, []);

  if (featured.length === 0) return (
    <div className="text-center py-12 text-gray-400">
      <div className="text-5xl mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
      </div>
      <p className="text-sm">لا توجد منتجات حالياً — ستظهر هنا بعد الإضافة من لوحة التحكم</p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {featured.map(p => (
        <div key={p.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="h-36 bg-gray-50 flex items-center justify-center relative overflow-hidden">
            {p.image
              ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
              : <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-lg">{p.name.substring(0,2)}</div>
            }
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
  const [userType, setUserType] = useState<"buyer"|"supplier">("buyer");
  const [company,  setCompany]  = useState("");
  const [city,     setCity]     = useState("");
  const [name,     setName]     = useState("");
  const [phone,    setPhone]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active,   setActive]   = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      const secs = ["home","offers","suppliers","europe"];
      let cur = "home";
      secs.forEach(id => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 130) cur = id;
      });
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const typeLabel = userType === "supplier" ? "مورد / مصنع" : "مشتري / تاجر";
    const msg = `طلب انضمام جديد — منصة حاوية\n\nالنوع: ${typeLabel}\nالشركة: ${company}\nالمسؤول: ${name}\nالجوال: ${phone}\nالمدينة: ${city}`;
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: msg }),
      });
    } catch (_) {}
    setLoading(false);
    setSuccess(true);
  };

  const sections = [
    { id:"home",      label:"الرئيسية"            },
    { id:"offers",    label:"العروض والمنتجات"     },
    { id:"suppliers", label:"الموردين والتوريد"    },
    { id:"europe",    label:"الاستيراد من أوروبا" },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-white font-sans">

      <nav className={`sticky top-0 z-[100] bg-white border-b border-gray-200 transition-shadow ${scrolled ? "shadow-sm" : ""}`}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between border-b border-gray-100">

          <a href="#home" className="flex items-center gap-2.5 no-underline">
            <img src="/logo.png" alt="حاوية" width={38} height={38} className="object-contain" />
            <span className="text-2xl font-extrabold text-green-800 tracking-tight">حاوية</span>
          </a>

          <a href="#home" className="bg-green-700 text-white text-sm font-bold px-4 py-2 rounded-lg no-underline">
            سجّل الآن
          </a>
        </div>

        <div className="max-w-5xl mx-auto px-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex min-w-max">
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`}
                className={`px-4 py-3 text-sm font-bold text-center border-b-2 transition-all whitespace-nowrap no-underline
                  ${active === s.id ? "text-green-700 border-green-700" : "text-gray-500 border-transparent"}`}>
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
              سوق الجملة الافتراضي<br />
              الأكبر لقطاع <span className="text-green-700">الأغذية</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              نربط المصانع والموردين مباشرة مع تجار الجملة والتجزئة والمطاعم.<br />
              أسعار المصنع، عروض تصفية، وتوريد يومي في مكان واحد.
            </p>
            <div className="flex gap-8">
              {[{n:"+500",l:"منتج جملة"},{n:"+120",l:"مورد ومصنع"},{n:"12",l:"مدينة سعودية"}].map(s => (
                <div key={s.l}>
                  <div className="text-2xl font-extrabold text-green-700">{s.n}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-2xl relative z-10">
            {success ? (
              <div className="text-center py-8 bg-green-50 rounded-xl">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-700"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="text-lg font-bold text-green-800 mb-2">تم استلام طلبك بنجاح!</h3>
                <p className="text-sm text-gray-500">سيتواصل معك فريق المبيعات قريباً لإكمال إجراءات التفعيل</p>
              </div>
            ) : (
              <>
                <h2 className="text-center font-bold text-gray-900 mb-1">انضم لقائمة الانتظار</h2>
                <p className="text-center text-xs text-gray-400 mb-5">سجّل الآن لتكون من أوائل المستفيدين فور الإطلاق</p>
                <div className="flex bg-gray-100 p-1 rounded-lg mb-5">
                  {(["buyer","supplier"] as const).map(t => (
                    <button key={t} type="button" onClick={() => setUserType(t)}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-all
                        ${userType === t ? "bg-white text-green-700 shadow-sm border border-gray-200" : "text-gray-500"}`}>
                      {t === "buyer" ? "مشتري / تاجر" : "مورد / مصنع"}
                    </button>
                  ))}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id:"company", label:"اسم الشركة / المؤسسة", ph:"مثال: مؤسسة النور...", val:company, set:setCompany },
                      { id:"city",    label:"المدينة",               ph:"جدة، الرياض...",      val:city,    set:setCity    },
                    ].map(f => (
                      <div key={f.id} className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700">{f.label} <span className="text-red-500">*</span></label>
                        <input required value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                          className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none" />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-700">اسم المسؤول <span className="text-red-500">*</span></label>
                    <input required value={name} onChange={e => setName(e.target.value)} placeholder="الاسم الكامل"
                      className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-700">رقم الجوال <span className="text-red-500">*</span></label>
                    <input required dir="ltr" value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="05XXXXXXXX" type="tel"
                      className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-right" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-70 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg">
                    {loading ? "جاري إرسال الطلب..." : "تأكيد الطلب والانضمام"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <section id="offers" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold tracking-widest text-green-700 uppercase mb-2">عروض اليوم</p>
              <h2 className="text-3xl font-extrabold text-gray-900">العروض والمنتجات الحالية</h2>
              <p className="text-gray-500 mt-2">تصفح المنتجات واطلب مباشرة عبر واتساب — بدون تسجيل</p>
            </div>
            <a href="/products" className="hidden md:flex items-center gap-1 text-green-700 font-bold text-sm hover:underline shrink-0">
              مشاهدة الكل ←
            </a>
          </div>
          <FeaturedProducts />
          <div className="text-center mt-8">
            <a href="/products"
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg">
              مشاهدة جميع المنتجات ←
            </a>
          </div>
        </div>
      </section>

      <section id="suppliers" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-bold tracking-widest text-green-700 uppercase mb-2">الموردون</p>
            <h2 className="text-3xl font-extrabold text-gray-900">الموردين والتوريد اليومي</h2>
            <p className="text-gray-500 mt-2">اطلب من الموردين المعتمدين مباشرة بكميات الجملة وجداول توريد يومية.</p>
          </div>
          <div className="relative rounded-2xl overflow-hidden">
            <div className="blur-md opacity-40 pointer-events-none grid grid-cols-3 gap-4 p-2">
              {["مصانع","زراعي","لحوم"].map((e,i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold mb-3 text-gray-500">{e.substring(0,1)}</div>
                  <div className="h-3 bg-gray-300 rounded w-4/5 mb-2"></div>
                  <div className="h-2.5 bg-gray-200 rounded w-3/5"></div>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-white/80 backdrop-blur-sm z-20 overflow-y-auto">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h3 className="text-lg md:text-xl font-extrabold text-gray-900 mb-2">هذا القسم قيد التجهيز</h3>
              <p className="text-gray-600 font-medium max-w-sm mx-auto text-sm leading-relaxed px-2">
                نعمل على بناء شبكة موردين معتمدين للتوريد اليومي بأسعار المصنع لتجار التجزئة.
              </p>
              <span className="mt-4 bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full shrink-0">قريباً</span>
            </div>
          </div>
        </div>
      </section>

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
                    { title:"تواصل مباشر مع المصنع",  desc:"بدون وسطاء، تتفاوض مباشرة وتحصل على أفضل سعر" },
                    { title:"شحن من الباب للباب",      desc:"بحري أو جوي + جمارك + تسليم لمستودعك" },
                    { title:"منتجات معتمدة حلال",      desc:"شهادات الحلال المعتمدة للسوق السعودي" },
                    { title:"أسعار تنافسية مضمونة",   desc:"حجم الكونتينرات يتيح أسعاراً لا تجدها محلياً" },
                  ].map(f => (
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
                  {["ألمانيا","فرنسا","هولندا","إسبانيا","بولندا","إيطاليا","تركيا","مصر"].map(c => (
                    <div key={c} className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm">
                      <div className="text-xs font-bold text-gray-800">{c}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-white/80 backdrop-blur-sm z-20 overflow-y-auto">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h3 className="text-lg md:text-xl font-extrabold text-gray-900 mb-2">هذا القسم قيد التجهيز</h3>
              <p className="text-gray-600 font-medium max-w-sm mx-auto text-sm leading-relaxed px-2">
                نعمل على بناء شبكة استيراد مباشرة من المصانع الأوروبية لضمان أفضل سعر وشهادات حلال معتمدة.
              </p>
              <span className="mt-4 bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full shrink-0">قريباً</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 pt-16 pb-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/logo.png" alt="حاوية" width={34} height={34} className="object-contain brightness-0 invert" />
                <span className="text-2xl font-extrabold text-white tracking-tight">حاوية</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                سوق الجملة الافتراضي لقطاع الأغذية في المملكة العربية السعودية. نربط المصانع والموردين مباشرة بتجار الجملة والتجزئة والمطاعم.
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span dir="ltr">+966 53 518 9367</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
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
            <div className="flex gap-4 text-gray-500">
              <span className="text-xs">المملكة العربية السعودية - جدة</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}