import { notFound } from "next/navigation";
import { supabase } from "../../lib/supabase";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  const { data, error } = await supabase
    .from("products").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data;
}

// دالة جديدة لجلب المنتجات ذات الصلة من نفس القسم
async function getRelatedProducts(category: string | null | undefined, currentId: string) {
  if (!category) return [];
  
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .neq("id", currentId) // استبعاد المنتج الحالي
    .limit(4) // عرض 4 منتجات فقط كحد أقصى
    .order("created_at", { ascending: false });
    
  return data || [];
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  // جلب المنتجات ذات الصلة
  const relatedProducts = await getRelatedProducts(product.category, product.id);

  const waUrl = `https://wa.me/966535189367?text=${encodeURIComponent(
    `مرحباً، أريد طلب هذا المنتج من منصة حاوية:\n📦 ${product.name}\n💰 السعر: ${product.price} ﷼ / ${product.unit}\nالكمية المطلوبة: `
  )}`;

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
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 mb-16">
          <div className="h-64 md:h-full min-h-[300px] bg-gray-50 flex items-center justify-center relative">
            {product.image_url
              ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              : <div className="text-gray-300 text-6xl">📦</div>
            }
            {product.in_stock === false && (
              <span className="absolute top-4 right-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">نفدت الكمية</span>
            )}
          </div>
          <div className="p-8 flex flex-col justify-center">
            {product.category && <div className="text-sm text-green-700 font-bold mb-2">{product.category}</div>}
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
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className={`block w-full text-white font-bold py-4 rounded-xl text-center text-lg transition-colors ${
                product.in_stock === false ? "bg-gray-400 pointer-events-none" : "bg-green-700 hover:bg-green-800"
              }`}>
              {product.in_stock === false ? "المنتج غير متوفر" : "💬 الطلب عبر الواتساب"}
            </a>
          </div>
        </div>

        {/* ───── قسم منتجات ذات صلة ───── */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900">منتجات من نفس القسم</h2>
              <a href="/products" className="text-sm font-bold text-green-700 hover:underline">عرض الكل ←</a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <a href={`/products/${p.id}`} key={p.id} className="group block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="h-36 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-lg">
                        📦
                      </div>
                    )}
                    {p.in_stock === false && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        نفدت الكمية
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="text-xs text-gray-400 mb-1">{p.category}</div>
                    <div className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-1">{p.name}</div>
                    <div className="text-xs text-gray-400 mb-1">{p.unit}</div>
                    <div className="text-base font-extrabold text-green-700">{p.price} ﷼</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ───── الفوتر الشامل ───── */}
      <footer className="bg-gray-900 pt-16 pb-8 border-t border-gray-800 mt-auto">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/logo.png" alt="حاوية" width={34} height={34} className="object-contain brightness-0 invert" />
                <span className="text-2xl font-extrabold text-white tracking-tight">حاوية</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                سوق الجملة الافتراضي لقطاع الأغذية في المملكة العربية السعودية. نربط المصانع والموردين مباشرة بتجار الجملة والتجزئة والمطاعم.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">المنصة</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="/" className="hover:text-green-500 transition-colors">الرئيسية</a></li>
                <li><a href="/products" className="hover:text-green-500 transition-colors">منتجات الجملة</a></li>
                <li><a href="/#suppliers" className="hover:text-green-500 transition-colors">شبكة الموردين</a></li>
                <li><a href="/#europe" className="hover:text-green-500 transition-colors">الاستيراد الدولي</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">الشركة</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="/about" className="hover:text-green-500 transition-colors">من نحن</a></li>
                <li><a href="/contact" className="hover:text-green-500 transition-colors">تواصل معنا</a></li>
                <li><a href="/terms" className="hover:text-green-500 transition-colors">الشروط والأحكام</a></li>
                <li><a href="/privacy" className="hover:text-green-500 transition-colors">سياسة الخصوصية</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">دعم العملاء</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span dir="ltr">+966 53 518 9367</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>info@hawiyasa.com</span>
                </li>
                <li className="mt-4">
                  <a href="/contact" className="inline-block border border-gray-700 hover:border-green-600 text-gray-300 hover:text-white text-xs font-bold py-2 px-4 rounded transition-colors">
                    نموذج الاستفسارات
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs">
              جميع الحقوق محفوظة © 2026 <strong className="text-gray-300 font-normal">منصة حاوية لتقنية المعلومات</strong>
            </p>
            <div className="flex gap-4 text-gray-500">
              <span className="text-xs">المملكة العربية السعودية - جدة</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}