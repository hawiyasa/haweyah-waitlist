import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();

  const userType = String(form.get("userType") || "");
  const company = String(form.get("company") || "").trim();
  const city = String(form.get("city") || "").trim();
  const name = String(form.get("name") || "").trim();
  const phone = String(form.get("phone") || "").trim();

  if (!company || !city || !name || !phone) {
    return NextResponse.redirect(new URL("/?error=missing#join-form", request.url), 303);
  }

  const typeLabel = userType === "supplier" ? "مورد / مصنع" : "مشتري / تاجر";
  const text = `طلب انضمام جديد — منصة حاوية

النوع: ${typeLabel}
الشركة: ${company}
المسؤول: ${name}
الجوال: ${phone}
المدينة: ${city}`;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
    cache: "no-store",
  });

  if (!tg.ok) {
    return NextResponse.redirect(new URL("/?error=send#join-form", request.url), 303);
  }

  return NextResponse.redirect(new URL("/waitlist-success", request.url), 303);
}