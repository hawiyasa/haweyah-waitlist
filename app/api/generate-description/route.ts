import { NextRequest, NextResponse } from "next/server"

// ✅ توليد محلي ذكي — يعمل دائماً بدون API
function generateLocal(name: string, category: string, price: string, unit: string): string {
  const templates: Record<string, string[]> = {
    "مواد غذائية": [
      `اشتري ${name} بالجملة بسعر ${price} ريال/${unit} — توريد مباشر للمطاعم والمحلات في السعودية.`,
      `${name} جملة بأفضل الأسعار — ${price} ريال/${unit}. توريد سريع لكافة مناطق المملكة.`,
    ],
    "شوكلاتات وسناكات": [
      `${name} بالجملة للمحلات والهايبرماركت — ${price} ريال/${unit}. أسعار تنافسية مع ضمان الجودة.`,
      `وفّر مع ${name} بسعر الجملة ${price} ريال/${unit} — مناسب للتوزيع والبيع بالتجزئة.`,
    ],
    "مشروبات": [
      `${name} بسعر جملة ${price} ريال/${unit} — توريد للكافيهات والمطاعم والمحلات في السعودية.`,
      `اطلب ${name} بالجملة — ${price} ريال/${unit}. أفضل أسعار المشروبات للموردين والتجار.`,
    ],
    "منظفات وعناية شخصية": [
      `${name} جملة للمحلات والمستودعات — ${price} ريال/${unit}. توريد مباشر بكميات كبيرة.`,
      `اشترِ ${name} بالجملة بسعر ${price} ريال/${unit} — مناسب للفنادق والمستشفيات والمحلات.`,
    ],
    "زيوت وسمون": [
      `${name} بالجملة — ${price} ريال/${unit}. أفضل أسعار الزيوت الغذائية للمطاعم والمصانع بالمملكة.`,
      `وفّر على ${name} بسعر ${price} ريال/${unit} — جملة للمطاعم والمخابز والمصانع الغذائية.`,
    ],
    "بقوليات وحبوب": [
      `${name} بسعر الجملة ${price} ريال/${unit} — توريد للمطاعم والمحلات في جميع مناطق السعودية.`,
      `اطلب ${name} بالجملة — ${price} ريال/${unit}. أسعار مميزة للتجار والمطاعم والتوزيع.`,
    ],
  }

  const list = templates[category] || [
    `${name} بالجملة بسعر ${price} ريال/${unit} — توريد مباشر للتجار والمحلات في المملكة العربية السعودية.`,
    `اشترِ ${name} بسعر ${price} ريال/${unit}. جملة مع ضمان الجودة وتوصيل سريع لكافة مناطق المملكة.`,
  ]

  return list[Math.floor(Math.random() * list.length)]
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, category, price, unit } = body

    if (!name || !price || !unit) {
      return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 })
    }

    // ─── محاولة OpenAI إذا كان المفتاح موجود ───
    const apiKey = process.env.OPENAI_API_KEY
    if (apiKey && apiKey.startsWith("sk-")) {
      try {
        const prompt = `اكتب وصف SEO احترافي للمنتج التالي باللغة العربية لموقع بيع جملة سعودي.
الوصف يجب أن يكون بين 120-160 حرف، يحتوي كلمات بحث مهمة، يستهدف التجار وأصحاب المحلات، بدون إيموجي.
المنتج: ${name} | القسم: ${category} | السعر: ${price} ريال / ${unit}
اكتب الوصف فقط:`

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 200,
            temperature: 0.7,
          }),
        })

        if (res.ok) {
          const data = await res.json()
          const description = data.choices?.[0]?.message?.content?.trim()
          if (description) {
            return NextResponse.json({ description, source: "ai" })
          }
        }
      } catch {
        // سقط OpenAI — نكمل بالتوليد المحلي
      }
    }

    // ─── التوليد المحلي الذكي (fallback مضمون) ───
    const description = generateLocal(name, category, price, unit)
    return NextResponse.json({ description, source: "local" })

  } catch (err) {
    return NextResponse.json(
      { error: `خطأ داخلي: ${err instanceof Error ? err.message : "unknown"}` },
      { status: 500 }
    )
  }
}