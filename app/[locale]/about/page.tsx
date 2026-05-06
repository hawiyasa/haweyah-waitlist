import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "من نحن | منصة حاوية" : "About Us | Hawiyah",
    description: isAr
      ? "تعرف على منصة حاوية وكيف نرقّم قطاع الجملة الغذائي في السعودية"
      : "Learn about Hawiyah and how we're digitizing Saudi Arabia's wholesale food sector",
    alternates: { canonical: `https://www.hawiyasa.com/${locale}/about` },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const t = await getTranslations({ locale, namespace: "nav" });
  const tF = await getTranslations({ locale, namespace: "footer" });

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href={`/${locale}`} className="text-2xl font-extrabold text-green-800">حاوية</Link>
          <Link href={`/${locale}`} className="text-sm text-gray-500 hover:text-green-700">
            {isAr ? "← العودة للرئيسية" : "← Back to Home"}
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            {isAr ? "رقمنة قطاع الجملة في السعودية" : "Digitizing Saudi Arabia's Wholesale Sector"}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            {isAr
              ? 'منصة "حاوية" هي الجسر التقني المباشر بين المصانع وتجار التجزئة.'
              : '"Hawiyah" is the direct digital bridge between factories and retailers.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-200 mb-12">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            {isAr ? "رؤيتنا" : "Our Vision"}
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            {isAr
              ? "في سوق تقليدي يعتمد بشكل كبير على الوسطاء والموزعين المتعددين، لاحظنا الفجوة الواسعة بين سعر المصنع وسعر التكلفة النهائي. رؤيتنا هي تبسيط سلاسل الإمداد الغذائية في المملكة، وتوفير الشفافية الكاملة في التسعير."
              : "In a traditional market heavily reliant on multiple intermediaries, we identified the wide gap between factory prices and final costs for restaurants and supermarkets. Our vision is to simplify food supply chains in the Kingdom and provide full pricing transparency."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-700">
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/>
                <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/>
                <path d="M12 3v6"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {isAr ? "للتجار والمطاعم" : "For Traders & Restaurants"}
            </h3>
            <ul className="space-y-3 text-gray-600">
              {(isAr
                ? ["وصول مباشر لأسعار المصانع.", "عروض تصفية حصرية وكميات جملة ضخمة.", "توريد يومي مجدول يوفر عليك مساحات التخزين."]
                : ["Direct access to factory prices.", "Exclusive clearance deals and bulk quantities.", "Scheduled daily supply to save on storage space."]
              ).map((item) => (
                <li key={item} className="flex gap-2"><span>•</span> {item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <polyline points="16 11 18 13 22 9"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {isAr ? "للمصانع والموردين" : "For Factories & Suppliers"}
            </h3>
            <ul className="space-y-3 text-gray-600">
              {(isAr
                ? ["قناة مبيعات B2B رقمية جاهزة.", "بيع الكميات الفائضة والاقتراب من انتهاء الصلاحية بسرعة.", "الوصول لمئات نقاط البيع في المدن الرئيسية."]
                : ["A ready-made digital B2B sales channel.", "Quickly sell excess stock and near-expiry quantities.", "Reach hundreds of retail points across major cities."]
              ).map((item) => (
                <li key={item} className="flex gap-2"><span>•</span> {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}