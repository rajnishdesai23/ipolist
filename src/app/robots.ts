import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/ipo-logo/"],
      disallow: [
        "/portal-console-x9182-admin-secure/",
        "/admin/",
        "/api/admin/",
        "/api/cron/",
      ],
    },
    sitemap: [`${SITE_CONFIG.url}/sitemap.xml`],
  };
}
