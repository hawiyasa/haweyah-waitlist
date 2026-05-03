import type { Metadata } from "next";
import { supabase } from "./lib/supabase";
import HomeClient from "./HomeClient";

export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hawiyasa.com"),
  title: "منصة حاوية | توريد المواد الغذائية بالجملة للتجار والهايبرات والتموينات",
  description: "منصة حاوية: سوق الجملة الافتراضي يربط الموردين والمصانع مباشرة بتجار الجملة والتجزئة والهايبرات والتموينات في المملكة العربية السعودية. أسعار المصنع وتوريد يومي.",
  keywords: "توريد مواد غذائية, تجار جملة, تجار تجزئة, هايبر ماركت, تموينات, بقالة, توريد بالجملة, السعودية, B2B, منصة حاوية, موردين غذائيين, جدة, الرياض",
  alternates: {
    canonical: "https://www.hawiyasa.com",
  },
  openGraph: {
    title: "منصة حاوية | توريد المواد الغذائية بالجملة للتجار والهايبرات والتموينات",
    description: "سوق الجملة الافتراضي يربط الموردين بتجار الجملة والتجزئة والهايبرات والتموينات في السعودية.",
    url: "https://www.hawiyasa.com",
    siteName: "منصة حاوية",
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: "https://www.hawiyasa.com/logo.png",
        width: 800,
        height: 600,
        alt: "منصة حاوية",
      },
    ],
  },
};

export default async function HomePage() {
  const { data: latestProducts } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "منصة حاوية",
    url: "https://www.hawiyasa.com",
    logo: "https://www.hawiyasa.com/logo.png",
    description: "سوق الجملة الافتراضي يربط الموردين والمصانع مباشرة بتجار الجملة والتجزئة والهايبرات والتموينات في المملكة العربية السعودية.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+966-53-518-9367",
      contactType: "customer service",
      areaServed: "SA",
      availableLanguage: "Arabic",
    },
    knowsAbout: [
      "توريد المواد الغذائية بالجملة",
      "تجار الجملة والتجزئة في السعودية",
      "توريد الهايبرات والتموينات والبقالات",
      "تجارة B2B الغذائية في المملكة",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <h1 className="sr-only">
        منصة حاوية - سوق الجملة الافتراضي لتوريد المواد الغذائية لتجار الجملة والتجزئة والهايبرات والتموينات في المملكة العربية السعودية.
      </h1>
      <HomeClient initialFeatured={latestProducts || []} />
    </>
  );
}