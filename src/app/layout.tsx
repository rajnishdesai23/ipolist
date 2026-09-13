import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MarketTicker } from "@/components/layout/MarketTicker";
import { MobileStickyAd } from "@/components/ads/MobileStickyAd";
import { getAllIpos } from "@/lib/data/ipoRepository";
import { getAllBlogs } from "@/lib/data/blogRepository";
import { SITE_CONFIG } from "@/lib/seo/metadata";
import { generateWebSiteJsonLd } from "@/lib/seo/schema";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: "%s | IPO List India",
  },
  description: SITE_CONFIG.description,
  keywords: [
    "IPO GMP",
    "IPO Grey Market Premium",
    "IPO Allotment Status",
    "Upcoming IPO 2026",
    "Mainboard IPO",
    "SME IPO",
    "Live IPO Subscription",
    "IPO Review",
    "Link Intime Allotment",
    "KFintech Allotment",
  ],
  authors: [{ name: "IPO List Research Team", url: SITE_CONFIG.url }],
  creator: "IPO List",
  publisher: "IPO List",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: "IPO List | Live IPO GMP & Allotment Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    creator: SITE_CONFIG.twitterHandle,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ipos = await getAllIpos();
  const blogs = await getAllBlogs();
  const websiteSchema = generateWebSiteJsonLd();

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {/* Top Live GMP Ticker Marquee */}
        <MarketTicker ipos={ipos} />

        {/* Global Navigation Header */}
        <Navbar ipos={ipos} blogs={blogs} />

        {/* Main Content Area */}
        <main className="flex-grow">{children}</main>

        {/* Global Footer */}
        <Footer />

        {/* Mobile Floating Sticky Monetization Bar */}
        <MobileStickyAd />
      </body>
    </html>
  );
}
