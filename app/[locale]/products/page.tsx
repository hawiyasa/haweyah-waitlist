import { supabase } from "../../lib/supabase";
import ProductsClient from "./ProductsClient";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    metadataBase: new URL("https://www.hawiyasa.com"),
    title: isAr
      ? "منتجات الجملة | حاوية — توريد تجار الجملة والتجزئة والهايبرات"
      : "Wholesale Products | Hawiyah — Supply for Traders & Hypermarkets",
    description: isAr
      ? "تصفح منتجات الجملة على منصة حاوية. مواد غذائية ومنظفات بأسعار المصنع للتجار والهايبرات في السعودية."
      : "Browse wholesale products on Hawiyah. Food and cleaning products at factory prices for traders and hypermarkets in Saudi Arabia.",
    alternates: { canonical: `https://www.hawiyasa.com/${locale}/products` },
    openGraph: {
      title: isAr ? "منتجات الجملة | حاوية" : "Wholesale Products | Hawiyah",
      description: isAr
        ? "مواد غذائية ومنظفات بأسعار المصنع في السعودية."
        : "Food and cleaning products at factory prices in Saudi Arabia.",
      url: `https://www.hawiyasa.com/${locale}/products`,
      siteName: "Hawiyah",
      locale: isAr ? "ar_SA" : "en_SA",
      type: "website",
      images: [{ url: "https://www.hawiyasa.com/logo.png", width: 800, height: 600, alt: "Hawiyah" }],
    },
  };
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { locale } = await params;
  const { tab: tabParam } = await searchParams;
  const tab = tabParam === "clearance" ? "clearance" : "products";

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return <ProductsClient products={products ?? []} tab={tab} locale={locale} />;
}