import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = (formData.get("name") as string || "").trim();
    const phone = (formData.get("phone") as string || "").trim();
    const message = (formData.get("message") as string || "").trim();

    if (!name || !phone || !message) {
      // إعادة توجيه إذا كانت الحقول ناقصة (مع أنه يوجد required في HTML)
      return NextResponse.redirect(new URL("/contact?error=missing", request.url), 303);
    }

    const text = `✉️ رسالة تواصل جديدة — منصة حاوية\n\nالاسم: ${name}\nالجوال: ${phone}\nالرسالة:\n${message}`;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (token && chatId) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
        cache: "no-store", // تعطيل التخزين المؤقت للطلب
      });
    }
  } catch (error) {
    console.error("Error submitting contact form:", error);
  }

  // إعادة التوجيه لنفس الصفحة مع إضافة parameter النجاح في الرابط
  return NextResponse.redirect(new URL("/contact?success=1", request.url), 303);
}