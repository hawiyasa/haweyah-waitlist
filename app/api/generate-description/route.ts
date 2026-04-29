import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { name, category, price, unit } = await req.json()

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY missing" }, { status: 500 })
  }

  const prompt = `اكتب وصف SEO احترافي للمنتج التالي باللغة العربية لموقع بيع جملة سعودي.
الوصف يجب أن:
- يكون بين 120-160 حرف فقط (مناسب لـ meta description)
- يحتوي على الكلمات المفتاحية الأكثر بحثاً
- يذكر السعر والوحدة إذا كان مفيداً
- يشجع التجار على الشراء بالجملة
- لا يحتوي على إيموجي

المنتج: ${name}
القسم: ${category}
السعر: ${price} ريال / ${unit}

اكتب الوصف فقط بدون أي مقدمة أو شرح:`

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    }),
  })

  const data = await res.json()
  const description = data.choices?.[0]?.message?.content?.trim()

  if (!description) return NextResponse.json({ error: "فشل التوليد" }, { status: 500 })

  return NextResponse.json({ description })
}