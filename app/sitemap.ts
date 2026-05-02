import { supabase } from "./lib/supabase";  
import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = "https://haweyah.com";

  const { data: products } = await supabase
    .from("products")
    .select("id, updated_at")
    .order("created_at", { ascending: false });

  const productUrls = (products || []).map((p) => ({
    url: `${BASE_URL}/products/${p.id}`,
    lastModified: new Date(p.updated_at || Date.now()),
    changeFrequency: "always" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, changeFrequency: "always", priority: 1.0 },
    { url: `${BASE_URL}/products`, changeFrequency: "always", priority: 0.9 },
    { url: `${BASE_URL}/about`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, changeFrequency: "weekly", priority: 0.5 },
    ...productUrls,
  ];
}