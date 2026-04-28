// app/waitlist-success/page.tsx
export default function WaitlistSuccessPage() {
    return (
      <div dir="rtl" className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-extrabold text-green-800 mb-3">تم استلام طلبك بنجاح</h1>
          <p className="text-gray-600 mb-6">سيتواصل معك فريق المبيعات قريباً لإكمال إجراءات التفعيل.</p>
          <a href="/#join-form" className="inline-block bg-green-700 text-white font-bold px-5 py-3 rounded-lg">
            العودة للرئيسية
          </a>
        </div>
      </div>
    );
  }