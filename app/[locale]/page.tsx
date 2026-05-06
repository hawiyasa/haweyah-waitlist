import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { supabase } from "../lib/supabase";
import HomeClient from "./HomeClient";


export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL("https://www.hawiyasa.com"),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://www.hawiyasa.com/${locale}`,
      languages: {
        ar: "https://www.hawiyasa.com/ar",
        en: "https://www.hawiyasa.com/en",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `https://www.hawiyasa.com/${locale}`,
      siteName: locale === "ar" ? "منصة حاوية" : "Hawiyah Platform",
      locale: locale === "ar" ? "ar_SA" : "en_SA",
      type: "website",
      images: [{ url: "https://www.hawiyasa.com/logo.png", width: 800, height: 600, alt: "Hawiyah" }],
    },
  };
}

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { locale } = await params;
  const { tab: tabParam } = await searchParams;
  const offersTab = tabParam === "clearance" ? "clearance" : "products";

  const { data: latestProducts } = await supabase
    .from("products")
    .select("*")
    .or("badge.is.null,badge.neq.تصفية")
    .order("created_at", { ascending: false })
    .limit(6);

  const { data: clearanceProducts } = await supabase
    .from("products")
    .select("*")
    .eq("badge", "تصفية")
    .order("created_at", { ascending: false })
    .limit(6);

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: locale === "ar" ? "منصة حاوية" : "Hawiyah Platform",
    url: "https://www.hawiyasa.com",
    logo: "https://www.hawiyasa.com/logo.png",
    description:
      locale === "ar"
        ? "سوق الجملة الافتراضي يربط الموردين والمصانع مباشرة بتجار الجملة والتجزئة والهايبرات في المملكة."
        : "The virtual wholesale marketplace connecting suppliers with wholesalers, retailers, and hypermarkets across Saudi Arabia.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+966-53-518-9367",
      contactType: "customer service",
      areaServed: "SA",
      availableLanguage: locale === "ar" ? "Arabic" : "English",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <h1 className="sr-only">
        {locale === "ar"
          ? "منصة حاوية - سوق الجملة الافتراضي لتوريد المواد الغذائية في السعودية"
          : "Hawiyah — Saudi Arabia's virtual wholesale marketplace for food and FMCG"}
      </h1>
      <HomeClient
        initialFeatured={latestProducts || []}
        initialClearance={clearanceProducts || []}
        offersTab={offersTab}
        locale={locale}
      />
    </>
  );
}