"use client";
import { useState } from "react";



export default function ContactPage() {
  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [email, setEmail]     = useState("");
  const [type, setType]       = useState("استفسار عام");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    const tgMessage = `📧 رسالة تواصل جديدة — منصة حاوية
  
  👤 الاسم: ${name}
  📞 الجوال: ${phone}
  ✉️ الإيميل: ${email}
  🏷️ نوع الرسالة: ${type}
  
  📝 المحتوى:
  ${message}`;
  
    try {
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: tgMessage }),
      });
  
      const data = await res.json();
  
      if (!res.ok || !data.ok) {
        throw new Error("Telegram send failed");
      }
  
      setSuccess(true);
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (err) {
      alert("تعذر إرسال الرسالة، تأكد من إعدادات التليجرام في السيرفر.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-2xl font-extrabold text-green-800 no-underline">حاوية</a>
          <a href="/" className="text-sm text-gray-500 hover:text-green-700 no-underline">← العودة للرئيسية</a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">تواصل معنا</h1>
          <p className="text-gray-600 max-w-lg mx-auto">فريق مبيعات حاوية جاهز للإجابة على كافة استفساراتكم.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-700"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">تم استلام رسالتك بنجاح</h3>
              <p className="text-gray-500 mb-6">سيتواصل معك فريق خدمة العملاء في أقرب وقت ممكن.</p>
              <button onClick={() => setSuccess(false)} className="text-green-700 font-bold text-sm hover:underline">إرسال رسالة أخرى</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">الاسم الكامل <span className="text-red-500">*</span></label>
                  <input required value={name} onChange={e => setName(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">رقم الجوال <span className="text-red-500">*</span></label>
                  <input required dir="ltr" type="tel" placeholder="05XXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-right focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">البريد الإلكتروني</label>
                  <input type="email" dir="ltr" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-right focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">نوع الرسالة</label>
                  <select value={type} onChange={e => setType(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none bg-white">
                    <option>استفسار عام</option>
                    <option>الانضمام كمورد / مصنع</option>
                    <option>شكوى / اقتراح</option>
                    <option>شراكة استراتيجية</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">الرسالة <span className="text-red-500">*</span></label>
                <textarea required rows={4} value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="اكتب استفسارك هنا..."
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none resize-none"></textarea>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={loading}
                  className="w-full md:w-auto px-8 py-3 bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-bold rounded-lg transition-colors">
                  {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}