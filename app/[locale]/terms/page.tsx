import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "الشروط والأحكام | حاوية" : "Terms & Conditions | Hawiyah",
    alternates: { canonical: `https://www.hawiyasa.com/${locale}/terms` },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const sections = isAr
    ? [
        { title: "1. مقدمة", body: 'بدخولك واستخدامك لمنصة حاوية لتجارة الجملة B2B، فإنك توافق على الالتزام بهذه الشروط. المنصة مخصصة للتعاملات التجارية بين الموردين والمصانع من جهة، والتجار والمطاعم والمنشآت من جهة أخرى.' },
        { title: "2. دور المنصة", body: 'تعمل "حاوية" كوسيط تقني يربط بين الموردين والتجار. نحن لا نملك المنتجات المعروضة، ولا نتدخل في تصنيعها أو تخزينها.' },
        { title: "3. التسعير والكميات", body: 'الأسعار المعروضة هي أسعار الجملة، وقد تتغير بناءً على الكميات المتاحة. كل منتج يخضع للحد الأدنى للطلب (MOQ) المحدد من قبل المورد.' },
        { title: "4. التزامات الموردين", body: 'يجب أن تكون جميع المنتجات أصلية ومطابقة لمواصفات هيئة الغذاء والدواء. يلتزم المورد بتوفير تواريخ صلاحية صالحة.' },
        { title: "5. الاستيراد الدولي", body: 'خدمة الاستيراد من أوروبا تخضع لآليات تسعير وشحن منفصلة. الأسعار قد لا تشمل الرسوم الجمركية أو ضريبة القيمة المضافة ما لم يُذكر ذلك في عرض السعر الرسمي.' },
        { title: "6. التعديلات", body: 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. يُعتبر استمرارك في استخدام المنصة بمثابة موافقة على الشروط الجديدة.' },
      ]
    : [
        { title: "1. Introduction", body: "By accessing and using the Hawiyah B2B wholesale platform, you agree to comply with these terms. The platform is dedicated to B2B transactions between suppliers/manufacturers and traders/restaurants/businesses." },
        { title: "2. Platform Role", body: "Hawiyah acts as a digital intermediary connecting suppliers and traders. We do not own the listed products and do not intervene in their manufacturing or storage." },
        { title: "3. Pricing & Quantities", body: "Listed prices are wholesale prices and may change based on supplier availability. Each product is subject to the Minimum Order Quantity (MOQ) set by the supplier." },
        { title: "4. Supplier Obligations", body: "All products must be authentic and comply with Saudi Food and Drug Authority standards. Suppliers must provide valid expiry dates for food products." },
        { title: "5. International Import", body: "The Europe import service is subject to separate pricing and shipping mechanisms. Prices may not include final customs duties or VAT unless clearly stated in the official quotation." },
        { title: "6. Amendments", body: "We reserve the right to modify these terms at any time. Your continued use of the platform constitutes acceptance of the updated terms." },
      ];

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-white font-sans text-gray-800">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href={`/${locale}`} className="text-2xl font-extrabold text-green-800">حاوية</Link>
          <Link href={`/${locale}`} className="text-sm text-gray-500 hover:text-green-700">
            {isAr ? "← العودة للرئيسية" : "← Back to Home"}
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-sm text-gray-500 mb-2">
            {isAr ? "تاريخ آخر تحديث: 27 أبريل 2026" : "Last updated: April 27, 2026"}
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900">
            {isAr ? "الشروط والأحكام" : "Terms & Conditions"}
          </h1>
        </div>
        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">{s.title}</h2>
              <p className="text-gray-600 leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}