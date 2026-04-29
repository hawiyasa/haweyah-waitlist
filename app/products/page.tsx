import { notFound } from "next/navigation";
import { supabase } from "../lib/supabase";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const WHATSAPP = "966535189367";
  const waMsg = encodeURIComponent(
    `مرحباً، أريد طلب هذا المنتج من منصة حاوية:\n📦 ${product.name}\n💰 السعر: ${product.price} ﷼ / ${product.unit}\nالكمية المطلوبة: `
  );
  const waUrl = `https://wa.me/${WHATSAPP}?text=${waMsg}`;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-2xl font-extrabold text-green-800">حاوية</a>
          <a href="/products" className="text-sm text-gray-500 hover:text-green-700 font-bold transition-colors">
            ← العودة للمنتجات
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
          {/* صورة */}
          <div className="h-64 md:h-full min-h-[300px] bg-gray-50 flex items-center justify-center relative">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-300 text-6xl">📦</div>
            )}
            {product.in_stock === false && (
              <span className="absolute top-4 right-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">نفدت الكمية</span>
            )}
          </div>

          {/* تفاصيل */}
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
                <span className="text-gray-500 text-sm">الحد الأدنى للطلب</span>
                <span className="font-bold text-gray-900 text-sm">{product.min_order || "غير محدد"}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500 text-sm">حالة التوفر</span>
                <span className={`font-bold text-sm ${product.in_stock !== false ? "text-green-600" : "text-red-600"}`}>
                  {product.in_stock !== false ? "متوفر للتوريد" : "غير متوفر مؤقتاً"}
                </span>
              </div>
            </div>

            {product.description && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-2">وصف المنتج</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full text-white font-bold py-4 rounded-xl shadow-md text-center transition-all text-lg ${
                product.in_stock === false
                  ? "bg-gray-400 cursor-not-allowed pointer-events-none"
                  : "bg-green-700 hover:bg-green-800"
              }`}
            >
              {product.in_stock === false ? "المنتج غير متوفر" : "💬 الطلب عبر الواتساب"}
            </a>
            <p className="text-center text-xs text-gray-400 mt-3">
              يتم تأكيد الأسعار والكميات النهائية عبر الواتساب
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 py-8 mt-auto">
        <div className="max-w-4xl mx-auto px-6 text-center text-gray-500 text-sm">
          جميع الحقوق محفوظة © 2026 منصة حاوية
        </div>
      </footer>
    </div>
  );
}