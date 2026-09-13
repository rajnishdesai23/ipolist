import { NextResponse } from "next/server";
import { getAllIpos } from "@/lib/data/ipoRepository";
import { getAllBlogs } from "@/lib/data/blogRepository";
import { SITE_CONFIG } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function GET() {
  const ipos = await getAllIpos();
  const blogs = await getAllBlogs();
  const baseUrl = SITE_CONFIG.url;

  const ipoItems = ipos.slice(0, 15).map((ipo) => {
    const pubDate = ipo.updatedAt ? new Date(ipo.updatedAt).toUTCString() : new Date().toUTCString();
    const gmpText = ipo.gmp?.value ? `Live GMP: ₹${ipo.gmp.value}` : "Upcoming IPO";
    return `
    <item>
      <title><![CDATA[${ipo.name} IPO GMP & Review (${ipo.type})]]></title>
      <link>${baseUrl}/ipo/${ipo.slug}</link>
      <guid isPermaLink="true">${baseUrl}/ipo/${ipo.slug}</guid>
      <description><![CDATA[${ipo.name} IPO. ${gmpText}. Check expected listing gains, price band, lot size, bidding dates and registrar allotment status.]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>${ipo.type} IPO</category>
    </item>`;
  });

  const blogItems = blogs.slice(0, 10).map((blog) => {
    const pubDate = new Date(blog.publishedAt).toUTCString();
    return `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${baseUrl}/blog/${blog.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${blog.slug}</guid>
      <description><![CDATA[${blog.excerpt || blog.title}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>${blog.category || "IPO Guide"}</category>
    </item>`;
  });

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_CONFIG.title}</title>
    <link>${baseUrl}</link>
    <description>${SITE_CONFIG.description}</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${ipoItems.join("")}
    ${blogItems.join("")}
  </channel>
</rss>`;

  return new NextResponse(rssXml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=1200, stale-while-revalidate=600",
    },
  });
}
