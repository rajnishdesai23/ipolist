import { Metadata } from "next";
import { IPO } from "@/types/ipo";
import { BlogPost } from "@/types/blog";
import { formatINR, formatPercentage } from "../utils/formatters";

const getSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://ipolist.in";
};

export const SITE_CONFIG = {
  name: "IPO List",
  title: "IPO List 2026: Live IPO GMP Today & Allotment Status",
  description:
    "Track live IPO GMP today, expected listing gains, official registrar allotment status, dates & subscription for Mainboard and SME IPOs in India.",
  url: getSiteUrl(),
  ogImage: "/og-image.png",
  twitterHandle: "@IPOListIndia",
};

/**
 * Generates dynamic high-CTR metadata for any IPO with real-time GMP & dates
 */
export function constructIpoMetadata(ipo: IPO): Metadata {
  const gmpVal = ipo.gmp?.value ?? 0;
  const gmpPct = ipo.gmp?.percentage ?? 0;
  const priceBand = ipo.priceBand?.raw || (ipo.priceBand?.max ? formatINR(ipo.priceBand.max) : "TBA");
  const lotSize = ipo.lotSize ? `${ipo.lotSize} Shares` : "TBA";
  const estListing = ipo.gmp?.estListingText || (ipo.gmp?.expectedListingPrice ? formatINR(ipo.gmp.expectedListingPrice) : "TBA");
  const registrar = ipo.registrar?.name || "Official Registrar";
  const dates = (ipo.dates?.rawRange || (ipo.dates?.open ? `${ipo.dates.open} to ${ipo.dates.close || ""}` : "TBA")).replace(/[–—]/g, " to ");

  // High-CTR Dynamic Title under 55 characters (Google truncates at 60)
  const gmpSnippet = gmpVal > 0 ? `GMP +₹${gmpVal}` : "GMP & Review";
  const title = `${ipo.name} IPO ${gmpSnippet}`;

  // Search-Intent Focused Meta Description (under 150 chars)
  const description = `${ipo.name} IPO GMP today is +₹${gmpVal} (${gmpPct > 0 ? `+${gmpPct}%` : "0%"}), expected listing at ${estListing}. Check price band ${priceBand}, dates & allotment link.`;

  // Comprehensive Keyword Cluster
  const keywords = [
    `${ipo.name.toLowerCase()} ipo gmp`,
    `${ipo.name.toLowerCase()} ipo gmp today`,
    `${ipo.name.toLowerCase()} ipo allotment status`,
    `${ipo.name.toLowerCase()} ipo allotment date`,
    `${ipo.name.toLowerCase()} ipo allotment link`,
    `${ipo.name.toLowerCase()} expected listing price`,
    `${ipo.name.toLowerCase()} ipo subscription status`,
    `${ipo.name.toLowerCase()} ipo review`,
    `${ipo.name.toLowerCase()} ipo price band`,
    `${ipo.name.toLowerCase()} ipo dates`,
    `${ipo.name.toLowerCase()} ipo lot size`,
    `${ipo.name.toLowerCase()} registrar ${registrar.toLowerCase()}`,
    `${ipo.type.toLowerCase()} ipo india`,
    "ipo gmp today",
    "ipo allotment status check online",
    "latest ipo gmp 2026",
  ];

  const canonicalPath = `/ipo/${ipo.slug}`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: SITE_CONFIG.name,
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: `${ipo.name} IPO GMP Today, Price Band & Allotment Status`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: SITE_CONFIG.twitterHandle,
      images: [SITE_CONFIG.ogImage],
    },
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

/**
 * Generates SEO metadata for Blog Posts & Guides
 */
export function constructBlogMetadata(post: BlogPost): Metadata {
  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.excerpt;
  const canonicalPath = `/blog/${post.slug}`;

  return {
    title,
    description,
    keywords: [
      ...(post.tags || []),
      "ipo guide india",
      "how to apply for ipo",
      "ipo investment strategy",
      "stock market ipo 2026",
    ],
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: SITE_CONFIG.name,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author.name],
      locale: "en_IN",
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
      creator: SITE_CONFIG.twitterHandle,
      images: [post.coverImage || SITE_CONFIG.ogImage],
    },
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}
