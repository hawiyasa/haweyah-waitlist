import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "منصة حاوية | سوق الجملة الافتراضي الأكبر لقطاع الأغذية",
  description: "نربط المصانع والموردين مباشرة مع تجار التجزئة والمطاعم. أسعار المصنع، عروض تصفية، وتوريد يومي في مكان واحد.",
  keywords: "جملة, توريد, مواد غذائية, السعودية, B2B, حاوية, موردين, تجار",
  openGraph: {
    title: "منصة حاوية | سوق الجملة الافتراضي",
    description: "نربط المصانع والموردين مع تجار التجزئة والمطاعم في السعودية.",
    url: "https://www.hawiyasa.com",
    locale: "ar_SA",
    type: "website",
  },
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
          .logo-navbar { mix-blend-mode: multiply; }
          .logo-footer { mix-blend-mode: screen; }
        `}</style>
      </head>
      <body className="font-sans bg-white antialiased">
        {children}
      </body>
      <GoogleAnalytics gaId="G-FH8S4SSDSR" />
    </html>
  );
}