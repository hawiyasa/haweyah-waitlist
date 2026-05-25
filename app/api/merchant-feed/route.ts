import { supabase } from "../../lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function clean(text: string | null | undefined, max = 5000): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function getImageUrl(imageUrl: string | null): string {
  if (!imageUrl) return "https://www.hawiyasa.com/logo.png";

  // base64 أو data URI — استخدم صورة افتراضية
  if (imageUrl.startsWith("data:")) {
    return "https://www.hawiyasa.com/logo.png";
  }

  // رابط كامل — استخدمه مباشرة
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  // مسار جزئي — أكمله برابط Supabase Storage
  return `${SUPABASE_URL}/storage/v1/object/public/products/${imageUrl}`;
}

export async function GET() {
  const BASE_URL = "https://www.hawiyasa.com";

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
      const img   = getImageUrl(p.image_url);

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