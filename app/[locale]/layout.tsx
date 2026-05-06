import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { GoogleAnalytics } from "@next/third-parties/google";
import "../globals.css";

const locales = ["ar", "en"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("layoutTitle"),
    description: t("layoutDesc"),
    keywords: "wholesale, supply, food, Saudi Arabia, B2B, Hawiyah, suppliers, traders",
    openGraph: {
      title: t("layoutTitle"),
      description: t("layoutDesc"),
      url: "https://www.hawiyasa.com",
      locale: locale === "ar" ? "ar_SA" : "en_SA",
      type: "website",
    },
    icons: { icon: "/logo.png", apple: "/logo.png" },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <style>{`
          .logo-navbar { mix-blend-mode: multiply; }
          .logo-footer { mix-blend-mode: screen; }
        `}</style>
      </head>
      <body className="font-sans bg-white antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId="G-FH8S4SSDSR" />
    </html>
  );
}