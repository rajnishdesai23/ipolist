import { Metadata } from "next";
import { IPO } from "@/types/ipo";
import { BlogPost } from "@/types/blog";
import { formatINR, formatPercentage } from "../utils/formatters";

export const SITE_CONFIG = {
  name: "IPO List",
  title: "IPO List — Live IPO GMP, Allotment Status, Dates & Subscription India",
  description:
    "Track latest Mainboard & SME IPOs in India. Real-time Grey Market Premium (GMP), live subscription status, allotment link checker, expected listing gains and IPO reviews.",
  url: "https://ipolist.in",
  ogImage: "https://ipolist.in/og-image.png",
  twitterHandle: "@IPOListIndia",
};

export function constructIpoMetadata(ipo: IPO): Metadata {
  const gmpVal = ipo.gmp?.value ?? 0;
  const gmpPct = ipo.gmp?.percentage ?? 0;
  const gmpText = gmpVal > 0 ? `GMP Today ${formatINR(gmpVal)} (${formatPercentage(gmpPct)})` : "GMP & Price";
  const title = `${ipo.name} ${gmpText}, Price Band, Dates & Allotment | IPO List`;
  const description = `${ipo.name} GMP today is ${formatINR(gmpVal)}. Check price band (${ipo.priceBand?.raw || formatINR(ipo.priceBand?.max || 0)}), lot size (${ipo.lotSize || "TBA"}), allotment date, and expected listing price.`;

  return {
    title,
    description,
    keywords: [
      `${ipo.name.toLowerCase()} gmp`,
      `${ipo.name.toLowerCase()} allotment`,
      `${ipo.name.toLowerCase()} price band`,
      `${ipo.name.toLowerCase()} review`,
    ],
    openGraph: {
      title,
      description,
      url: `${SITE_CONFIG.url}/ipo/${ipo.slug}`,
      siteName: SITE_CONFIG.name,
      type: "website",
      images: [
        {
          url: SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: `${ipo.name} GMP & Details`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: SITE_CONFIG.twitterHandle,
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/ipo/${ipo.slug}`,
    },
  };
}

export function constructBlogMetadata(post: BlogPost): Metadata {
  const title = post.seo?.metaTitle || `${post.title} | IPO List`;
  const description = post.seo?.metaDescription || post.excerpt;

  return {
    title,
    description,
    keywords: post.tags,
    openGraph: {
      title,
      description,
      url: `${SITE_CONFIG.url}/blog/${post.slug}`,
      siteName: SITE_CONFIG.name,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage || SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.coverImage || SITE_CONFIG.ogImage],
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/blog/${post.slug}`,
    },
  };
}
