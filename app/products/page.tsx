import { supabase } from "../lib/supabase";
import ProductsClient from "./ProductsClient";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hawiyasa.com"),
  title: "منتجات الجملة | حاوية — توريد تجار الجملة والتجزئة والهايبرات والتموينات",
  description: "تصفح منتجات الجملة المتاحة على منصة حاوية. مواد غذائية ومنظفات بأسعار المصنع للتجار والهايبرات والتموينات والبقالات في السعودية.",
  keywords: "منتجات جملة, مواد غذائية بالجملة, توريد تجار, هايبر ماركت, تموينات, بقالة, السعودية, حاوية",
  alternates: {
    canonical: "https://www.hawiyasa.com/products",
  },
  openGraph: {
    title: "منتجات الجملة | حاوية",
    description: "مواد غذائية ومنظفات بأسعار المصنع للتجار والهايبرات والتموينات في السعودية.",
    url: "https://www.hawiyasa.com/products",
    siteName: "منصة حاوية",
    locale: "ar_SA",
    type: "website",
    images: [{ url: "https://www.hawiyasa.com/logo.png", width: 800, height: 600, alt: "منصة حاوية" }],
  },
};

export default async function ProductsPage() {
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return <ProductsClient products={products || []} />;
}