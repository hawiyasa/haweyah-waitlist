import { supabase } from "./lib/supabase";
import type { MetadataRoute } from "next";

// ✅ هذا السطر يجبر Vercel على جلب أحدث المنتجات دائماً وعدم تخزين الـ Sitemap كملف ثابت قديم
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = "https://haweyah.com";

  // جلب جميع المنتجات
  const { data: products } = await supabase
    .from("products")
    .select("id, updated_at")
    .order("created_at", { ascending: false });

  // الصفحات الثابتة
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // الصفحات الديناميكية للمنتجات
  const productPages: MetadataRoute.Sitemap = (products || []).map((p) => ({
    url: `${BASE_URL}/products/${p.id}`,
    lastModified: new Date(p.updated_at || Date.now()),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}