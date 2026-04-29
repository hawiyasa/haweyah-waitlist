import { supabase } from "./lib/supabase"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE = "https://haweyah.com"

  // الصفحات الثابتة
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,               lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/products`, lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/about`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ]

  // الصفحات الديناميكية للمنتجات
  const { data: products } = await supabase
    .from("products")
    .select("id, updated_at")
    .order("created_at", { ascending: false })

  const productPages: MetadataRoute.Sitemap = (products || []).map((p) => ({
    url: `${BASE}/products/${p.id}`,
    lastModified: new Date(p.updated_at || Date.now()),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticPages, ...productPages]
}