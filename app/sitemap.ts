import { supabase } from "./lib/supabase";
import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = "https://www.hawiyasa.com";

  const { data: products } = await supabase
    .from("products")
    .select("id, created_at") // ✅ تم التصحيح
    .order("created_at", { ascending: false });

  const productUrls = (products || []).map((p) => ({
    url: `${BASE_URL}/products/${p.id}`,
    lastModified: new Date(p.created_at || Date.now()), // ✅ تم التصحيح
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    ...productUrls,
  ];
}