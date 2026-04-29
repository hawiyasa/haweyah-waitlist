import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// 🚀 هذا هو السر: نخبر Supabase ألا يحاول أبداً تخزين أو قراءة جلسات تسجيل الدخول!
// هذا يمنع Safari في الأيفون من عمل Block للطلب بسبب سياسات التتبع والـ Storage
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // لا تحفظ الجلسات
    autoRefreshToken: false, // لا تحدث التوكن
    detectSessionInUrl: false, // لا تبحث في الروابط
  },
  global: {
    fetch: (...args) => fetch(...args), // إجبار استخدام الـ fetch الأصلي للمتصفح
  },
});