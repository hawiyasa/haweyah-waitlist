import { Metadata } from 'next';
import { notFound } from 'next/navigation';
// هنا المسار الصحيح لملف السوبابيز بناءً على هيكلة مجلداتك
import { supabase } from '../../lib/supabase'; 

interface Props {
  params: {
    id: string;
  };
}

// 1. دالة جلب بيانات المنتج من قاعدة البيانات
async function getProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

// 2. توليد SEO دنياميكي لكل منتج (Dynamic Metadata) ليقرأه جوجل
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.id);

  if (!product) {
    return { title: 'المنتج غير موجود | حاوية' };
  }

  return {
    title: `${product.name} بسعر الجملة | حاوية`,
    description: product.description || `اشتري ${product.name} بسعر المصنع مباشرة. اطلب الآن لتجار التجزئة والمطاعم.`,
    openGraph: {
      title: `${product.name} - سوق الجملة`,
      description: product.description || '',
      images: [{ url: product.image_url || '/logo.png' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      images: [product.image_url || '/logo.png'],
    }
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  // 3. إعداد كود JSON-LD لتسوق جوجل (Google Merchant / Rich Results)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image_url,
    description: product.description,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: 'حاوية' 
    },
    offers: {
      '@type': 'Offer',
      url: `https://haweyah.com/products/${product.id}`,
      priceCurrency: 'SAR',
      price: product.price,
      availability: product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  const WHATSAPP = "966535189367";
  const waMsg = encodeURIComponent(
    `مرحباً، أريد طلب هذا المنتج من منصة حاوية:\n📦 ${product.name}\n💰 السعر: ${product.price} ﷼ / ${product.unit}\nالكمية المطلوبة: `
  );
  const waUrl = `https://wa.me/${WHATSAPP}?text=${waMsg}`;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* حقن سكريبت جوجل بداخل الصفحة بصمت (لـ SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-2xl font-extrabold text-green-800 tracking-tight">حاوية</a>
          <a href="/products" className="text-sm text-gray-500 hover:text-green-700 font-bold transition-colors">
            ← العودة للمنتجات
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
          {/* صورة المنتج */}
          <div className="h-64 md:h-full min-h-[300px] bg-gray-50 flex items-center justify-center relative">
            {product.image_url ? (
               <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
               <div className="text-gray-300 text-6xl">📦</div>
            )}
            {product.in_stock === false && (
              <span className="absolute top-4 right-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                نفدت الكمية
              </span>
            )}
          </div>

          {/* تفاصيل المنتج */}
          <div className="p-8 flex flex-col justify-center">
            <div className="text-sm text-green-700 font-bold mb-2">{product.category}</div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>
            
            <div className="text-4xl font-extrabold text-green-700 mb-6">
              {product.price} <span className="text-xl text-gray-500 font-normal">﷼ / {product.unit}</span>
            </div>

            <div className="space-y-3 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
               <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-sm">الحد الأدنى للطلب</span>
                  <span className="font-bold text-gray-900 text-sm">{product.min_order || 1} {product.unit}</span>
               </div>
               <div className="flex justify-between border-b border-gray-200 pb-2 pt-1">
                  <span className="text-gray-500 text-sm">حالة التوفر</span>
                  <span className={`font-bold text-sm ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.in_stock ? 'متوفر للتوريد' : 'غير متوفر مؤقتاً'}
                  </span>
               </div>
               <div className="flex justify-between pt-1">
                  <span className="text-gray-500 text-sm">رمز المنتج (SKU)</span>
                  <span className="font-bold text-gray-900 text-sm">{product.sku || 'غير محدد'}</span>
               </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-2">وصف المنتج</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description || 'لا يوجد وصف تفصيلي متاح لهذا المنتج حالياً. تواصل معنا لمزيد من المعلومات.'}
              </p>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100">
              <a 
                href={waUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full text-white font-bold py-4 rounded-xl shadow-md text-center transition-all text-lg ${
                  product.in_stock ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-400 cursor-not-allowed pointer-events-none'
                }`}
              >
                {product.in_stock ? '💬 الطلب عبر الواتساب' : 'المنتج غير متوفر'}
              </a>
              <p className="text-center text-xs text-gray-400 mt-3">
                يتم تأكيد الأسعار والكميات النهائية عبر الواتساب
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 py-8 border-t border-gray-800 mt-auto">
        <div className="max-w-4xl mx-auto px-6 text-center text-gray-500 text-sm">
          جميع الحقوق محفوظة © 2026 منصة حاوية
        </div>
      </footer>
    </div>
  );
}