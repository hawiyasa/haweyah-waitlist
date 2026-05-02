import type { Metadata } from "next";
import { supabase } from "./lib/supabase";
import HomeClient from "./HomeClient";

export const revalidate = 60; // تحديث المنتجات المعروضة في الرئيسية كل دقيقة

// ✅ Meta Tags قوية جداً لجذب الشركات ومدراء المشتريات
export const metadata: Metadata = {
  title: "منصة حاوية | توريد السوبر ماركت وإدارة سلاسل الإمداد",
  description: "منصة حاوية: الشريك الاستراتيجي لتوريد المواد الغذائية بالجملة للهايبر ماركت والسوبر ماركت في السعودية. حلول متكاملة في إدارة سلاسل الإمداد والاستيراد والتصدير.",
  keywords: "توريد مواد غذائية, سلاسل إمداد, توريد سوبر ماركت, هايبر ماركت, استيراد وتصدير, جملة غذائية, السعودية, تعاقدات تجارية B2B, منصة حاوية, موردين غذائيين",
};

export default async function HomePage() {
  // جلب آخر المنتجات لعرضها في الرئيسية
  const { data: latestProducts } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  // ✅ JSON-LD ليخبر قوقل أن حاوية هي مؤسسة B2B وتوريد كبرى
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "منصة حاوية",
    url: "https://haweyah.com",
    logo: "https://haweyah.com/logo.png",
    description: "منصة رائدة في إدارة سلاسل الإمداد، وتوريد المواد الغذائية بالجملة للهايبر ماركت والأسواق الكبرى في المملكة العربية السعودية.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+966-53-518-9367",
      contactType: "customer service",
      areaServed: "SA",
      availableLanguage: "Arabic"
    },
    knowsAbout: [
      "سلاسل الإمداد Supply Chain",
      "توريد السوبر ماركت والهايبر ماركت",
      "الاستيراد والتصدير",
      "تجارة المواد الغذائية بالجملة B2B"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      
      <h1 className="sr-only">
        منصة حاوية - لإدارة سلاسل الإمداد وتوريد السوبر ماركت والهايبر ماركت بالجملة في السعودية. حلول الاستيراد والتصدير وتوفير المواد الغذائية والمنظفات بأسعار تنافسية.
      </h1>

      {/* ✅ إصلاح الخطأ: تمرير initialFeatured بدلاً من latestProducts */}
      <HomeClient initialFeatured={latestProducts || []} />
    </>
  );
}