import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// 🛠️ هذا الجزء يحل مشكلة الأيفون (سفاري يمنع LocalStorage في التصفح الخفي)
const safeStorage = {
  getItem: (key: string) => {
    if (typeof window === "undefined") return null;
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  },
  setItem: (key: string, value: string) => {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(key, value); } catch (e) {}
  },
  removeItem: (key: string) => {
    if (typeof window === "undefined") return;
    try { window.localStorage.removeItem(key); } catch (e) {}
  },
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: safeStorage,
  },
});