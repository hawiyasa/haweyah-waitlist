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
    title: isAr ? "سياسة الخصوصية | حاوية" : "Privacy Policy | Hawiyah",
    alternates: { canonical: `https://www.hawiyasa.com/${locale}/privacy` },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-white font-sans text-gray-800">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href={`/${locale}`} className="text-2xl font-extrabold text-green-800 tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-green-800 text-white rounded-md flex items-center justify-center text-sm">ح</div>
            حاوية
          </Link>
          <Link href={`/${locale}`} className="text-sm text-gray-500 hover:text-green-700 font-medium">
            {isAr ? "← العودة للرئيسية" : "← Back to Home"}
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-sm text-gray-500 font-medium mb-2">
            {isAr ? "تاريخ آخر تحديث: 27 أبريل 2026" : "Last updated: April 27, 2026"}
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900">
            {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
          </h1>
        </div>

        <div className="prose prose-gray max-w-none space-y-10">
          <p className="text-lg text-gray-600 leading-relaxed">
            {isAr
              ? 'تلتزم منصة "حاوية" بحماية خصوصية بيانات عملائها من الموردين والمصانع وتجار التجزئة.'
              : '"Hawiyah" is committed to protecting the privacy of data belonging to its clients — suppliers, manufacturers, and retailers.'}
          </p>

          {[
            {
              title: isAr ? "1. المعلومات التي نجمعها" : "1. Information We Collect",
              content: isAr
                ? "نجمع البيانات الضرورية لتسهيل العمليات التجارية: اسم الشركة، السجل التجاري، المدينة، اسم المسؤول، رقم الجوال، والبريد الإلكتروني."
                : "We collect data necessary to facilitate business operations: company name, commercial registration, city, contact person name, mobile number, and email.",
            },
            {
              title: isAr ? "2. كيف نستخدم معلوماتك" : "2. How We Use Your Information",
              content: isAr
                ? "نستخدم البيانات لتأكيد هويتك كمنشأة تجارية، للتواصل معك لتأكيد طلبات الجملة وعروض الأسعار، وإرسال تنبيهات حول العروض الحصرية."
                : "We use data to verify your identity as a business entity, contact you to confirm bulk orders and price offers, and send notifications about exclusive deals.",
            },
            {
              title: isAr ? "3. مشاركة البيانات مع أطراف ثالثة" : "3. Data Sharing with Third Parties",
              content: isAr
                ? "نحن لا نبيع بياناتك أبداً. تتم المشاركة فقط بالقدر اللازم لإتمام العملية التجارية (مثل شركة الشحن أو المورد المباشر)."
                : "We never sell your data. Sharing only occurs to the extent necessary to complete a business transaction (e.g., shipping company or direct supplier).",
            },
            {
              title: isAr ? "4. أمن البيانات" : "4. Data Security",
              content: isAr
                ? "نتخذ تدابير أمنية تقنية وتنظيمية (تشفير SSL وقواعد بيانات محمية) لحماية معلوماتك من الوصول غير المصرح به."
                : "We implement technical and organizational security measures (SSL encryption and protected databases) to safeguard your information from unauthorized access.",
            },
            {
              title: isAr ? "5. التواصل معنا" : "5. Contact Us",
              content: isAr
                ? "للاستفسار: info@hawiyasa.com | +966535189367"
                : "For inquiries: info@hawiyasa.com | +966535189367",
            },
          ].map((section) => (
            <section key={section.title} className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {section.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        <p>{isAr ? "جميع الحقوق محفوظة © 2026 منصة حاوية لتقنية المعلومات" : "All rights reserved © 2026 Hawiyah Information Technology"}</p>
      </footer>
    </div>
  );
}