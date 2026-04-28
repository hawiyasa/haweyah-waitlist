import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "منصة حاوية | سوق الجملة الافتراضي الأكبر لقطاع الأغذية",
  description: "نربط المصانع والموردين مباشرة مع تجار التجزئة والمطاعم. أسعار المصنع، عروض تصفية، وتوريد يومي في مكان واحد.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <style>{`
          /* ✅ إصلاح خلفية اللوقو في الـ Navbar — الخلفية بيضاء */
          .logo-navbar {
            mix-blend-mode: multiply;
          }

          /* ✅ إصلاح خلفية اللوقو في الـ Footer — الخلفية داكنة */
          .logo-footer {
            mix-blend-mode: screen;
          }
        `}</style>
      </head>
      <body className="font-sans bg-white antialiased">{children}</body>
    </html>
  );
}