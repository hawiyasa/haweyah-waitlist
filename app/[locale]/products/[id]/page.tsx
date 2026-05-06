import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import type { Metadata } from "next";
import WhatsappButton from "./WhatsappButton";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

async function getProduct(id: string) {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data;
}

async function getRelatedProducts(category: string | null | undefined, currentId: string) {
  if (!category) return [];
  const { data } = await supabase
    .from("products").select("*").eq("category", category).neq("id", currentId).limit(4).order("created_at", { ascending: false });
  return data || [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const isAr = locale === "ar";
  const product = await getProduct(id);
  if (!product) return { title: isAr ? "منتج غير موجود" : "Product Not Found" };

  const title = isAr
    ? `${product.name} بالجملة — ${product.price} ﷼/${product.unit} | حاوية`
    : `${product.name} Wholesale — ${product.price} SAR/${product.unit} | Hawiyah`;

  const description =
    product.description ||
    (isAr
      ? `اشترِ ${product.name} بسعر الجملة ${product.price} ريال/${product.unit}. توريد مباشر للتجار في السعودية.`
      : `Buy ${product.name} at wholesale price ${product.price} SAR/${product.unit}. Direct supply for traders in Saudi Arabia.`);

  return {
    title,
    description,
    alternates: { canonical: `https://www.hawiyasa.com/${locale}/products/${id}` },
    openGraph: {
      title,
      description,
      images: [{ url: product.image_url || "https://www.hawiyasa.com/logo.png", width: 800, height: 600, alt: product.name }],
      locale: isAr ? "ar_SA" : "en_SA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id, locale } = await params;
  const isAr = locale === "ar";
  const product = await getProduct(id);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.category, product.id);

  const waUrl = `https://wa.me/966574668349?text=${encodeURIComponent(
    `مرحباً، أريد طلب هذا المنتج من منصة حاوية:\n📦 ${product.name}\n💰 السعر: ${product.price} ﷼ / ${product.unit}\nالكمية المطلوبة: `
  )}`;

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.image_url ? [product.image_url] : ["https://www.hawiyasa.com/logo.png"],
    description: product.description || `${product.name} - ${product.price} SAR/${product.unit}`,
    sku: product.id,
    brand: { "@type": "Brand", name: "Hawiyah" },
    offers: {
      "@type": "Offer",
      url: `https://www.hawiyasa.com/${locale}/products/${product.id}`,
      priceCurrency: "SAR",
      price: String(product.price),
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
      availability: product.in_stock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Hawiyah" },
    },
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href={`/${locale}`} className="text-2xl font-extrabold text-green-800">حاوية</a>
          <a href={`/${locale}/products`} className="text-sm text-gray-500 hover:text-green-700 font-bold transition-colors">
            {isAr ? "← العودة للمنتجات" : "← Back to Products"}
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 mb-16">
          <div className="h-64 md:h-full min-h-[300px] bg-gray-50 flex items-center justify-center relative">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-300 text-6xl">📦</div>
            )}
            {product.in_stock === false && (
              <span className="absolute top-4 right-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                {isAr ? "نفدت الكمية" : "Out of Stock"}
              </span>
            )}
          </div>
          <div className="p-8 flex flex-col justify-center">
            {product.category && (
              <div className="text-sm text-green-700 font-bold mb-2">{product.category}</div>
            )}
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>
            <div className="text-4xl font-extrabold text-green-700 mb-6">
              {product.price} <span className="text-xl text-gray-500 font-normal">﷼ / {product.unit}</span>
            </div>
            <div className="space-y-3 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500 text-sm">{isAr ? "الحد الأدنى للطلب" : "Minimum Order"}</span>
                <span className="font-bold text-gray-900 text-sm">{product.min_order || (isAr ? "غير محدد" : "Not specified")}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500 text-sm">{isAr ? "حالة التوفر" : "Availability"}</span>
                <span className={`font-bold text-sm ${product.in_stock !== false ? "text-green-600" : "text-red-600"}`}>
                  {product.in_stock !== false ? (isAr ? "متوفر" : "In Stock") : (isAr ? "غير متوفر" : "Out of Stock")}
                </span>
              </div>
            </div>
            {product.description && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-2">{isAr ? "وصف المنتج" : "Product Description"}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>
            )}
            <WhatsappButton
              waUrl={waUrl}
              productId={product.id}
              productName={product.name}
              productCategory={product.category}
              productPrice={product.price}
              inStock={product.in_stock}
              locale={locale}
            />
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900">
                {isAr ? "منتجات أخرى" : "Related Products"}
              </h2>
              <a href={`/${locale}/products`} className="text-sm font-bold text-green-700 hover:underline">
                {isAr ? "عرض الكل ←" : "View All →"}
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <a href={`/${locale}/products/${p.id}`} key={p.id}
                  className="group block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="h-36 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    ) : (
                      <div className="text-gray-400 text-lg">📦</div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="text-xs text-gray-400 mb-1">{p.category}</div>
                    <div className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-1">{p.name}</div>
                    <div className="text-base font-extrabold text-green-700">{p.price} ﷼</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}