import { supabase } from "../../lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const BASE_URL = "https://haweyah.com";

  // جلب المنتجات الحديثة
  const { data: products } = await supabase
    .from("products")
    .select("id, updated_at")
    .order("created_at", { ascending: false });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${BASE_URL}</loc><changefreq>always</changefreq><priority>1.0</priority></url>
  <url><loc>${BASE_URL}/products</loc><changefreq>always</changefreq><priority>0.9</priority></url>
  <url><loc>${BASE_URL}/about</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>
  <url><loc>${BASE_URL}/contact</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>
  ${(products || [])
    .map(
      (p) => `<url><loc>${BASE_URL}/products/${p.id}</loc><lastmod>${new Date(p.updated_at || Date.now()).toISOString()}</lastmod><changefreq>always</changefreq><priority>0.8</priority></url>`
    )
    .join("")}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "text/xml",
      "Cache-Control": "s-maxage=1, stale-while-revalidate",
    },
  });
}