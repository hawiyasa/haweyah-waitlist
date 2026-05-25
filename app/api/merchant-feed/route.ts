import { supabase } from "../../lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// تنظيف النص من HTML وعلامات XML وتحديد الطول
function clean(text: string | null | undefined, max = 5000): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "")       // احذف HTML tags
    .replace(/&/g, "&amp;")        // escape علامات XML
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\s+/g, " ")          // نظّف مسافات زائدة
    .trim()
    .slice(0, max);                 // حدّ الطول
}

export async function GET() {
  const BASE_URL = "https://www.hawiyasa.com";

  // ✅ اختر الأعمدة الضرورية فقط — لا تستخدم select("*")
  const { data: products } = await supabase
    .from("products")
    .select("id, name, description, price, image_url, category, in_stock")
    .order("created_at", { ascending: false });

  const items = (products || [])
    .map((p) => {
      const title = clean(p.name, 150);
      const desc  = clean(p.description, 5000) || title;
      const price = `${Number(p.price).toFixed(2)} SAR`;
      const avail = p.in_stock === false ? "out of stock" : "in stock";
      const link  = `${BASE_URL}/ar/products/${p.id}`;
      const img   = p.image_url || "https://www.hawiyasa.com/logo.png";

      return `
    <item>
      <g:id>${p.id}</g:id>
      <g:title>${title}</g:title>
      <g:description>${desc}</g:description>
      <g:link>${link}</g:link>
      <g:image_link>${img}</g:image_link>
      <g:price>${price}</g:price>
      <g:availability>${avail}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>حاوية</g:brand>
      <g:mpn>${p.id}</g:mpn>
      ${p.category ? `<g:product_type>${clean(p.category, 100)}</g:product_type>` : ""}
    </item>`;
    })
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>حاوية - منتجات الجملة</title>
    <link>${BASE_URL}</link>
    <description>سوق الجملة الافتراضي في السعودية</description>
    ${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}