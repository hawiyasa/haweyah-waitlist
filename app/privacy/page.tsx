// app/privacy/page.tsx
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-white font-sans text-gray-800">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold text-green-800 tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-green-800 text-white rounded-md flex items-center justify-center text-sm">ح</div>
            حاوية
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-green-700 font-medium">← العودة للرئيسية</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-sm text-gray-500 font-medium mb-2">تاريخ آخر تحديث: 27 أبريل 2026</p>
          <h1 className="text-3xl font-extrabold text-gray-900">سياسة الخصوصية</h1>
        </div>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-gray-600 leading-relaxed mb-10">
            تلتزم منصة "حاوية" بحماية خصوصية بيانات عملائها من الموردين والمصانع وتجار التجزئة. تشرح هذه السياسة كيفية جمعنا للمعلومات، استخدامها، ومشاركتها في إطار تعاملات التجارة الإلكترونية بين الشركات (B2B).
          </p>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">1. المعلومات التي نجمعها</h2>
            <p className="text-gray-600 leading-relaxed mb-3">نحن نجمع البيانات الضرورية لتسهيل العمليات التجارية، وتشمل:</p>
            <ul className="space-y-2 text-gray-600 list-disc list-inside bg-gray-50 p-5 rounded-xl border border-gray-100">
              <li><strong className="text-gray-900">بيانات المنشأة:</strong> اسم الشركة/المؤسسة، السجل التجاري، والمدينة.</li>
              <li><strong className="text-gray-900">بيانات التواصل:</strong> اسم المسؤول، رقم الجوال (الواتساب)، والبريد الإلكتروني.</li>
              <li><strong className="text-gray-900">بيانات التوريد:</strong> عناوين المستودعات، احتياجات الشراء، والكميات المفضلة.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">2. كيف نستخدم معلوماتك؟</h2>
            <p className="text-gray-600 leading-relaxed mb-3">نستخدم هذه البيانات للأغراض التجارية والتشغيلية التالية:</p>
            <ul className="space-y-2 text-gray-600 list-disc list-inside pl-2">
              <li>تأكيد وتوثيق هويتك كمنشأة تجارية (تاجر أو مورد).</li>
              <li>التواصل معك عبر فريق المبيعات لتأكيد طلبات الجملة وعروض الأسعار.</li>
              <li>تسهيل عمليات الربط اللوجستي والتوصيل إلى مستودعاتك.</li>
              <li>إرسال تنبيهات حول العروض الحصرية، تصفيات المصانع، وفرص التوريد الجديدة.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">3. مشاركة البيانات مع أطراف ثالثة</h2>
            <p className="text-gray-600 leading-relaxed">
              <strong>نحن لا نبيع بياناتك أبداً.</strong> تتم مشاركة معلوماتك فقط بالقدر اللازم لإتمام العملية التجارية. على سبيل المثال: نشارك عنوان مستودعك ورقم التواصل الخاص بك مع شركة الشحن أو المورد المباشر لضمان تسليم البضائع بنجاح.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">4. أمن البيانات</h2>
            <p className="text-gray-600 leading-relaxed">
              نتخذ تدابير أمنية تقنية وتنظيمية (مثل تشفير SSL وقواعد بيانات محمية) لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الإفصاح. نحن نتعامل مع بياناتك التجارية كأسرار عمل لا يجوز تسريبها للمنافسين.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">5. التواصل معنا</h2>
            <p className="text-gray-600 leading-relaxed">
              إذا كانت لديك أي أسئلة حول سياسة الخصوصية أو كيفية تعاملنا مع بيانات منشأتك، يمكنك التواصل معنا عبر:
            </p>
            <div className="mt-4 bg-gray-50 p-5 rounded-xl border border-gray-100 inline-block w-full">
              <p className="text-gray-900 mb-2"><strong>البريد الإلكتروني:</strong> privacy@haweyah.com</p>
              <p className="text-gray-900"><strong>رقم المبيعات والدعم:</strong> 966535189367+</p>
            </div>
          </section>

        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        <p>جميع الحقوق محفوظة © 2026 منصة حاوية لتقنية المعلومات</p>
      </footer>
    </div>
  );
}