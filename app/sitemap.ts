import { supabase } from "./lib/supabase";
import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = "https://www.hawiyasa.com";
  const locales = ["ar", "en"];

  const { data: products } = await supabase
    .from("products")
    .select("id, created_at")
    .order("created_at", { ascending: false });

  // صفحات المنتجات × اللغتين
  const productUrls = (products || []).flatMap((p) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/products/${p.id}`,
      lastModified: new Date(p.created_at || Date.now()),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }))
  );

  // الصفحات الثابتة × اللغتين
  const staticPages = [
    { path: "",         freq: "daily"   as const, priority: 1.0 },
    { path: "/products", freq: "daily"  as const, priority: 0.9 },
    { path: "/about",    freq: "monthly" as const, priority: 0.5 },
    { path: "/contact",  freq: "monthly" as const, priority: 0.5 },
    { path: "/terms",    freq: "monthly" as const, priority: 0.4 },
    { path: "/privacy",  freq: "monthly" as const, priority: 0.4 },
  ];

  const staticUrls = staticPages.flatMap(({ path, freq, priority }) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: freq,
      priority,
    }))
  );

  // redirect من الـ root للـ /ar (اختياري)
  const rootUrl = {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1.0,
  };

  return [rootUrl, ...staticUrls, ...productUrls];
}