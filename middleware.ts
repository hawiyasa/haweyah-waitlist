import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["ar", "en"],
  defaultLocale: "ar",
});

export const config = {
  matcher: [
    // ✅ استثنِ dashboard وapi والملفات الثابتة
    "/((?!dashboard|api|_next|_vercel|.*\\..*).*)",
  ],
};