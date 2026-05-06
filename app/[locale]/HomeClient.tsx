"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

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

const WHATSAPP = "966574668349";

function buildWaUrl(product: Product, msg: string) {
  const text = msg
    .replace("{name}", product.name)
    .replace("{price}", String(product.price))
    .replace("{unit}", product.unit);
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

function ProductCard({ p, locale }: { p: Product; locale: string }) {
  const t = useTranslations("card");
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
      <a href={`/${locale}/products/${p.id}`} className="block h-36 bg-gray-50 relative overflow-hidden flex-shrink-0">
        {p.image_url ? (
          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">📦</div>
        )}
        {p.in_stock === false && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {t("outOfStock")}
          </span>
        )}
        {p.badge === "تصفية" && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {t("clearanceBadge")}
          </span>
        )}
      </a>
      <div className="p-3 flex flex-col flex-1">
        <div className="text-xs text-gray-400 mb-0.5">{p.category}</div>
        <a href={`/${locale}/products/${p.id}`} className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-2 block">
          {p.name}
        </a>
        <div className="text-xs text-gray-400 mb-1">{p.unit}</div>
        {p.min_order && (
          <div className="text-xs text-orange-600 font-bold mb-1">{t("minOrder")} {p.min_order}</div>
        )}
        <div className="text-base font-extrabold text-green-700 mb-3">{p.price} ﷼</div>
        {p.in_stock === false ? (
          <div className="block w-full text-center text-white text-xs font-bold py-2.5 rounded-lg bg-gray-300 select-none">
            {t("unavailable")}
          </div>
        ) : (
          <a
            href={buildWaUrl(p, t("waMsg"))}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center text-white text-xs font-bold py-2.5 rounded-lg bg-green-700"
          >
            {t("orderNow")}
          </a>
        )}
      </div>
    </div>
  );
}

function FeaturedProducts({
  products,
  emptyMsg,
  locale,
}: {
  products: Product[];
  emptyMsg: string;
  locale: string;
}) {
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
      {products.map((p) => (
        <ProductCard key={p.id} p={p} locale={locale} />
      ))}
    </div>
  );
}

interface HomeClientProps {
  initialFeatured: Product[];
  initialClearance: Product[];
  offersTab?: "products" | "clearance";
  locale: string;
}

export default function HomeClient({
  initialFeatured,
  initialClearance,
  offersTab = "products",
  locale,
}: HomeClientProps) {
  const tNav = useTranslations("nav");
  const tHero = useTranslations("hero");
  const tForm = useTranslations("form");
  const tServices = useTranslations("services");
  const tOffers = useTranslations("offers");
  const tSuppliers = useTranslations("suppliers");
  const tEurope = useTranslations("europe");
  const tFooter = useTranslations("footer");

  const pathname = usePathname();

  const [userType, setUserType] = useState<"buyer" | "supplier">("buyer");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  const isRtl = locale === "ar";

  // ✅ رابط مباشر بدون JS — فوري على iOS بدون تأخير
  const switchLocaleHref = pathname.replace(`/${locale}`, `/${locale === "ar" ? "en" : "ar"}`);

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
    { id: "home",      label: tNav("home") },
    { id: "services",  label: tNav("services") },
    { id: "offers",    label: tNav("offers") },
    { id: "suppliers", label: tNav("suppliers") },
    { id: "europe",    label: tNav("europe") },
  ];

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-white font-sans">

      {/* ═══ NAVBAR ═══ */}
      <nav className={`sticky top-0 z-[100] bg-white border-b border-gray-200 ${scrolled ? "shadow-sm" : ""}`}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between border-b border-gray-100">
          <a href={`/${locale}`} className="flex items-center gap-2.5">
            <img src="/logo.png" alt="حاوية" width={38} height={38} className="object-contain" />
            <span className="text-2xl font-extrabold text-green-800 tracking-tight">حاوية</span>
          </a>
          <div className="flex items-center gap-3">
            {/* ✅ تم تحويله لـ <a> بدل <button> — يشتغل فوراً على iOS بدون تأخير */}
            <a
              href={switchLocaleHref}
              className="flex items-center gap-1.5 text-sm font-bold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-green-500 hover:text-green-700 transition-colors"
            >
              🌐 {locale === "ar" ? "English" : "العربية"}
            </a>
            <a
              href="#join-form"
              className="bg-green-700 text-white text-sm font-bold px-4 py-2 rounded-lg"
            >
              {tNav("join")}
            </a>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex min-w-max">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap ${
                  active === s.id
                    ? "text-green-700 border-green-700"
                    : "text-gray-500 border-transparent"
                }`}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="home" className="min-h-[88vh] flex items-center bg-gradient-to-br from-white via-white to-green-50 px-6 py-20">
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 border border-green-200 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
              {tHero("badge")}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              {tHero("title1")}<br />
              {tHero("title2")} <span className="text-green-700">{tHero("titleAccent")}</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 whitespace-pre-line">
              {tHero("subtitle")}
            </p>
            <div className="flex flex-col gap-3 mb-8">
              {[tHero("f1"), tHero("f2"), tHero("f3")].map((f) => (
                <div key={f} className="text-sm text-gray-700 font-medium">{f}</div>
              ))}
            </div>
            <div className="flex gap-8">
              {[
                { n: tHero("stat1n"), l: tHero("stat1l") },
                { n: tHero("stat2n"), l: tHero("stat2l") },
                { n: tHero("stat3n"), l: tHero("stat3l") },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-extrabold text-green-700">{s.n}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* FORM */}
          <div id="join-form" className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
            {success ? (
              <div className="text-center py-8 bg-green-50 rounded-xl">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-700">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-green-800 mb-2">{tForm("successTitle")}</h3>
                <p className="text-sm text-gray-500 mb-4">{tForm("successBody")}</p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="bg-green-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg"
                >
                  {tForm("successBtn")}
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-center font-bold text-gray-900 mb-1">{tForm("title")}</h2>
                <p className="text-center text-xs text-gray-400 mb-5">{tForm("subtitle")}</p>
                <form
                  action="/api/waitlist"
                  method="POST"
                  className="space-y-4"
                  onSubmit={() => setLoading(true)}
                >
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      {tForm("accountType")} <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="userType"
                      value={userType}
                      onChange={(e) => setUserType(e.target.value as "buyer" | "supplier")}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white focus:border-green-500 outline-none"
                      style={{ fontSize: "16px" }}
                    >
                      <option value="buyer">{tForm("buyer")}</option>
                      <option value="supplier">{tForm("supplier")}</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-700">
                        {tForm("company")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="company"
                        required
                        placeholder={tForm("companyPlaceholder")}
                        className="px-3 py-3 border border-gray-300 rounded-lg focus:border-green-500 outline-none"
                        style={{ fontSize: "16px" }}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-700">
                        {tForm("city")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="city"
                        required
                        placeholder={tForm("cityPlaceholder")}
                        className="px-3 py-3 border border-gray-300 rounded-lg focus:border-green-500 outline-none"
                        style={{ fontSize: "16px" }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-700">
                      {tForm("contactName")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      required
                      placeholder={tForm("contactPlaceholder")}
                      className="px-3 py-3 border border-gray-300 rounded-lg focus:border-green-500 outline-none"
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-700">
                      {tForm("phone")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="phone"
                      required
                      dir="ltr"
                      placeholder={tForm("phonePlaceholder")}
                      type="tel"
                      className="px-3 py-3 border border-gray-300 rounded-lg focus:border-green-500 outline-none text-right"
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-700">
                      {tForm("businessType")} <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="businessType"
                      required
                      className="px-3 py-3 border border-gray-300 rounded-lg bg-white focus:border-green-500 outline-none"
                      style={{ fontSize: "16px" }}
                    >
                      <option value="">{tForm("businessTypePlaceholder")}</option>
                      <option value="importer">{tForm("importer")}</option>
                      <option value="manufacturer">{tForm("manufacturer")}</option>
                      <option value="distributor">{tForm("distributor")}</option>
                      <option value="exporter">{tForm("exporter")}</option>
                      <option value="retailer">{tForm("retailer")}</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-700 disabled:opacity-70 text-white font-bold py-3 rounded-lg shadow-md"
                  >
                    {loading ? tForm("submitting") : tForm("submit")}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id="services" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold tracking-widest text-green-700 uppercase mb-2">{tServices("label")}</p>
            <h2 className="text-3xl font-extrabold text-gray-900">{tServices("title")}</h2>
            <p className="text-gray-500 mt-2 max-w-xl">{tServices("subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { bg: "bg-green-50",  stroke: "#01696f", title: tServices("s1title"), body: tServices("s1body") },
              { bg: "bg-orange-50", stroke: "#da7101", title: tServices("s2title"), body: tServices("s2body") },
              { bg: "bg-blue-50",   stroke: "#006494", title: tServices("s3title"), body: tServices("s3body") },
              { bg: "bg-green-50",  stroke: "#01696f", title: tServices("s4title"), body: tServices("s4body") },
            ].map((s, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl p-7 flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <div className="w-5 h-5 rounded" style={{ background: s.stroke, opacity: 0.7 }} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ OFFERS ═══ */}
      <section id="offers" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold tracking-widest text-green-700 uppercase mb-2">{tOffers("label")}</p>
              <h2 className="text-3xl font-extrabold text-gray-900">{tOffers("title")}</h2>
              <p className="text-gray-500 mt-2">{tOffers("subtitle")}</p>
            </div>
            <a
              href={`/${locale}/products`}
              className="hidden md:flex items-center gap-1 text-green-700 font-bold text-sm hover:underline shrink-0"
            >
              {tOffers("viewAll")}
            </a>
          </div>
          <div className="flex gap-2 mb-6">
            <a
              href={`/${locale}#offers`}
              className={`px-5 py-2 rounded-xl text-sm font-bold block text-center ${
                offersTab === "products"
                  ? "bg-green-700 text-white"
                  : "bg-white border border-gray-200 text-gray-600"
              }`}
            >
              {tOffers("tabProducts")}
            </a>
            <a
              href={`/${locale}?tab=clearance#offers`}
              className={`px-5 py-2 rounded-xl text-sm font-bold block text-center ${
                offersTab === "clearance"
                  ? "bg-orange-500 text-white"
                  : "bg-white border border-gray-200 text-gray-600"
              }`}
            >
              {tOffers("tabClearance")}
            </a>
          </div>
          {offersTab === "products" ? (
            <FeaturedProducts
              products={initialFeatured}
              emptyMsg={tOffers("emptyProducts")}
              locale={locale}
            />
          ) : (
            <FeaturedProducts
              products={initialClearance}
              emptyMsg={tOffers("emptyClearance")}
              locale={locale}
            />
          )}
          <div className="text-center mt-8">
            <a
              href={
                offersTab === "clearance"
                  ? `/${locale}/products?tab=clearance`
                  : `/${locale}/products`
              }
              className={`inline-flex items-center gap-2 text-white font-bold px-8 py-3 rounded-xl shadow-md ${
                offersTab === "clearance" ? "bg-orange-500" : "bg-green-700"
              }`}
            >
              {offersTab === "clearance" ? tOffers("btnClearance") : tOffers("btnProducts")}
            </a>
          </div>
        </div>
      </section>

      {/* ═══ SUPPLIERS ═══ */}
      <section id="suppliers" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-green-700 uppercase mb-2">{tSuppliers("label")}</p>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{tSuppliers("title")}</h2>
          <p className="text-gray-500 mb-10">{tSuppliers("subtitle")}</p>
          <div className="relative rounded-2xl overflow-hidden border border-gray-100">
            <div className="blur-md opacity-40 pointer-events-none grid grid-cols-3 gap-4 p-6">
              {["A", "B", "C"].map((e) => (
                <div key={e} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <div className="w-10 h-10 rounded-full bg-gray-300 mb-3"></div>
                  <div className="h-3 bg-gray-300 rounded w-4/5 mb-2"></div>
                  <div className="h-2.5 bg-gray-200 rounded w-3/5"></div>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-white/90">
              <h3 className="text-lg font-extrabold text-gray-900 mb-2">{tSuppliers("comingSoonTitle")}</h3>
              <span className="bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                {tSuppliers("comingSoonBadge")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ EUROPE ═══ */}
      <section id="europe" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-green-700 uppercase mb-2">{tEurope("label")}</p>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{tEurope("title")}</h2>
          <p className="text-gray-500 mb-10">{tEurope("subtitle")}</p>
          <div className="relative rounded-2xl overflow-hidden border border-gray-100">
            <div className="blur-sm pointer-events-none select-none grid grid-cols-4 gap-3 p-6">
              {["Germany", "France", "Netherlands", "Spain", "Poland", "Italy", "Turkey", "Egypt"].map((c) => (
                <div key={c} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                  <div className="text-xs font-bold text-gray-800">{c}</div>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-white/90">
              <h3 className="text-lg font-extrabold text-gray-900 mb-2">{tEurope("comingSoonTitle")}</h3>
              <span className="bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                {tEurope("comingSoonBadge")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-gray-900 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/logo.png" alt="حاوية" width={34} height={34} className="object-contain brightness-0 invert" />
                <span className="text-2xl font-extrabold text-white">حاوية</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{tFooter("tagline")}</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{tFooter("platform")}</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href={`/${locale}`} className="hover:text-green-500">{tFooter("home")}</a></li>
                <li><a href={`/${locale}/products`} className="hover:text-green-500">{tFooter("products")}</a></li>
                <li><a href={`/${locale}/contact`} className="hover:text-green-500">{tFooter("contact")}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{tFooter("company")}</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href={`/${locale}/about`} className="hover:text-green-500">{tFooter("about")}</a></li>
                <li><a href={`/${locale}/terms`} className="hover:text-green-500">{tFooter("terms")}</a></li>
                <li><a href={`/${locale}/privacy`} className="hover:text-green-500">{tFooter("privacy")}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{tFooter("support")}</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><span dir="ltr">+966 57 466 8349</span></li>
                <li><span>info@hawiyasa.com</span></li>
                <li>
                  <a href={`/${locale}/contact`} className="hover:text-green-500">
                    {tFooter("contact")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs">{tFooter("copyright")}</p>
            <span className="text-gray-500 text-xs">{tFooter("location")}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}