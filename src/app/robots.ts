import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/portal-console-x9182-admin-secure/", "/admin/", "/api/"],
    },
    sitemap: [`${SITE_CONFIG.url}/sitemap.xml`, `${SITE_CONFIG.url}/feed.xml`],
  };
}
