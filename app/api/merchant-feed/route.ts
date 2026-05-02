import { supabase } from "../../lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const BASE_URL = "https://www.hawiyasa.com";

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const items = (products || [])
    .map((p) => `
    <item>
      <g:id>${p.id}</g:id>
      <g:title>${p.name}</g:title>
      <g:description>${p.description || `${p.name} بسعر الجملة`}</g:description>
      <g:link>${BASE_URL}/products/${p.id}</g:link>
      <g:image_link>${p.image_url || "https://www.hawiyasa.com/logo.png"}</g:image_link>
      <g:price>${p.price} SAR</g:price>
      <g:availability>${p.in_stock === false ? "out of stock" : "in stock"}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>حاوية</g:brand>
      <g:mpn>${p.id}</g:mpn>
      ${p.category ? `<g:product_type>${p.category}</g:product_type>` : ""}
    </item>`)
    .join("");

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
      "Content-Type": "application/xml",
      "Cache-Control": "no-store",
    },
  });
}