import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/api/"],
      },
    ],
    sitemap: "https://www.hawiyasa.com/sitemap.xml", // ✅ تم التصحيح
    host: "https://www.hawiyasa.com",               // ✅ تم التصحيح
  };
}