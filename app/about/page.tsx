// app/about/page.tsx
import Link from "next/link";

export default function AboutPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold text-green-800">حاوية</Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-green-700">← العودة للرئيسية</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">رقمنة قطاع الجملة في السعودية</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">منصة "حاوية" هي الجسر التقني المباشر بين المصانع وتجار التجزئة.</p>
        </div>

        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-200 mb-12">
          <h2 className="text-2xl font-bold text-green-800 mb-4">رؤيتنا</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            في سوق تقليدي يعتمد بشكل كبير على الوسطاء والموزعين المتعددين، لاحظنا الفجوة الواسعة بين سعر المصنع وسعر التكلفة النهائي على المطاعم والسوبرماركت. <strong>رؤيتنا هي تبسيط سلاسل الإمداد الغذائية</strong> في المملكة، وتوفير الشفافية الكاملة في التسعير، ليتمكن التاجر من الشراء بسعر المصنع، وليتمكن المورد من الوصول لقاعدة عملاء أوسع دون تكاليف تسويق عالية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-700"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">للتجار والمطاعم</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex gap-2"><span>•</span> وصول مباشر لأسعار المصانع.</li>
              <li className="flex gap-2"><span>•</span> عروض تصفية حصرية وكميات جملة ضخمة.</li>
              <li className="flex gap-2"><span>•</span> توريد يومي مجدول يوفر عليك مساحات التخزين.</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">للمصانع والموردين</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex gap-2"><span>•</span> قناة مبيعات B2B رقمية جاهزة.</li>
              <li className="flex gap-2"><span>•</span> بيع الكميات الفائضة والاقتراب من انتهاء الصلاحية بسرعة.</li>
              <li className="flex gap-2"><span>•</span> الوصول لمئات نقاط البيع في المدن الرئيسية.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}