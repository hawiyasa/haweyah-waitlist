// app/terms/page.tsx
import Link from "next/link";

export default function TermsPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-white font-sans text-gray-800">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold text-green-800">حاوية</Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-green-700">← العودة للرئيسية</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">الشروط والأحكام</h1>
        
        <div className="prose prose-gray max-w-none space-y-6">
          <p>تاريخ آخر تحديث: 27 أبريل 2026</p>
          
          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. مقدمة</h3>
          <p>مرحباً بكم في منصة "حاوية" (شار إليها بـ "المنصة" أو "نحن"). بدخولك واستخدامك لمنصة حاوية لتجارة الجملة B2B، فإنك توافق على الالتزام بالشروط والأحكام التالية. المنصة مخصصة للتعاملات التجارية (B2B) بين الموردين والمصانع من جهة، والتجار والمطاعم والمنشآت من جهة أخرى.</p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. دور المنصة</h3>
          <p>تعمل منصة "حاوية" كوسيط تقني (سوق افتراضي) يربط بين الموردين (البائعين) والتجار (المشترين). نحن لا نملك المنتجات المعروضة، ولا نتدخل في تصنيعها أو تخزينها، ما لم يُنص على خلاف ذلك صراحة في بعض الخدمات المحددة (مثل الاستيراد المدار).</p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. التسعير والكميات (للمشترين)</h3>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>الأسعار المعروضة هي أسعار الجملة، وقد تتغير بناءً على الكميات المتاحة من قبل المورد.</li>
            <li>كل منتج يخضع لـ "الحد الأدنى للطلب" (MOQ) المحدد من قبل المورد، ولا يمكن إتمام الطلب لكميات أقل.</li>
            <li>المنصة غير مسؤولة عن نفاذ الكمية لدى المورد بعد عرض المنتج، ويتم تأكيد الطلب نهائياً فقط بعد تواصل فريق المبيعات.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. التزامات الموردين والمصانع</h3>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>يجب أن تكون جميع المنتجات المعروضة أصلية ومطابقة لمواصفات الهيئة العامة للغذاء والدواء في المملكة العربية السعودية.</li>
            <li>يلتزم المورد بتوفير تواريخ صلاحية صالحة وفترات تخزين مناسبة للمنتجات الغذائية.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. الاستيراد الدولي</h3>
          <p>خدمة "الاستيراد من أوروبا" تخضع لآليات تسعير وشحن منفصلة. الأسعار المعروضة للاستيراد قد لا تشمل الرسوم الجمركية النهائية أو ضريبة القيمة المضافة ما لم يُذكر ذلك بوضوح في عرض السعر الرسمي (Quotation).</p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. التعديلات</h3>
          <p>نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. يُعتبر استمرارك في استخدام المنصة بعد أي تعديلات بمثابة موافقة منك على الشروط الجديدة.</p>
        </div>
      </main>
    </div>
  );
}