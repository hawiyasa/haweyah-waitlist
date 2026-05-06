"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ContactPage() {
  const { locale } = useParams() as { locale: string };
  const isAr = locale === "ar";
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.location.search.includes("success=1")) {
      setSuccess(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href={`/${locale}`} className="text-2xl font-extrabold text-green-800 tracking-tight">حاوية</a>
          <a href={`/${locale}`} className="text-sm text-gray-500 hover:text-green-700 font-bold transition-colors">
            {isAr ? "← العودة للرئيسية" : "← Back to Home"}
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-6 py-16">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {success ? (
            <div className="text-center py-8 bg-green-50 rounded-xl border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-700">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-green-800 mb-2">
                {isAr ? "تم إرسال رسالتك بنجاح!" : "Message Sent Successfully!"}
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                {isAr ? "سيتواصل معك فريق الدعم في أقرب وقت ممكن." : "Our support team will contact you as soon as possible."}
              </p>
              <button
                onClick={() => setSuccess(false)}
                type="button"
                className="text-green-700 font-bold text-sm bg-white border border-green-200 px-5 py-2.5 rounded-lg hover:bg-green-50 transition-colors"
              >
                {isAr ? "إرسال رسالة أخرى" : "Send Another Message"}
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
                {isAr ? "تواصل معنا" : "Contact Us"}
              </h1>
              <p className="text-gray-500 text-center mb-8 text-sm">
                {isAr
                  ? "لديك استفسار أو اقتراح؟ يسعدنا تواصلك معنا."
                  : "Have a question or suggestion? We'd love to hear from you."}
              </p>
              <form action="/api/contact" method="POST" className="space-y-5" onSubmit={() => setLoading(true)}>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    {isAr ? "الاسم الكامل" : "Full Name"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name" required
                    placeholder={isAr ? "محمد أحمد..." : "John Doe..."}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    style={{ fontSize: "16px" }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    {isAr ? "رقم الجوال" : "Mobile Number"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phone" required dir="ltr" type="tel"
                    placeholder="05XXXXXXXX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none text-right focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    style={{ fontSize: "16px" }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    {isAr ? "الرسالة" : "Message"} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message" required rows={4}
                    placeholder={isAr ? "اكتب استفسارك هنا..." : "Write your message here..."}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    style={{ fontSize: "16px" }}
                  />
                </div>
                <button
                  type="submit" disabled={loading}
                  className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl shadow-md text-base transition-all text-center"
                >
                  {loading
                    ? (isAr ? "جاري الإرسال..." : "Sending...")
                    : (isAr ? "إرسال الرسالة" : "Send Message")}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}