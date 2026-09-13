import React from "react";
import { Metadata } from "next";
import { HelpCircle, TrendingUp, ShieldAlert, BookOpen } from "lucide-react";
import { getAllIpos } from "@/lib/data/ipoRepository";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LeaderboardAd } from "@/components/ads/LeaderboardAd";
import { BrokerCtaCard } from "@/components/ads/BrokerCtaCard";
import { IpoGmpView } from "@/components/ipo/IpoGmpView";
import { SITE_CONFIG } from "@/lib/seo/metadata";
import {
  generateFaqJsonLd,
  generateBreadcrumbJsonLd,
  generateDatasetJsonLd,
  generateItemListJsonLd,
  GMP_PAGE_FAQS,
} from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "IPO GMP Today 2026 | Live Grey Market Premium for Mainboard & SME IPOs",
  description:
    "Check live IPO GMP (Grey Market Premium) today in India. Daily updated expected listing gains, Kostak rates, Subject to Sauda, and price bands for latest Mainboard & SME IPOs.",
  keywords: [
    "ipo gmp today",
    "live ipo gmp",
    "current ipo gmp 2026",
    "grey market premium today",
    "sme ipo gmp",
    "mainboard ipo gmp",
    "expected listing price ipo",
    "ipo kostak rates",
    "chittorgarh ipo gmp",
    "ipowatch gmp today",
  ],
  openGraph: {
    title: "IPO GMP Today 2026 | Live Grey Market Premium & Expected Listing Gains",
    description:
      "Track latest Grey Market Premium (GMP) for all ongoing and upcoming Mainboard & SME IPOs in India. Real-time listing price estimates & Kostak rates.",
    url: `${SITE_CONFIG.url}/ipo-gmp`,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: "Live IPO GMP Today India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPO GMP Today 2026 | Live Grey Market Premium",
    description: "Daily updated IPO Grey Market Premium rates & expected listing gains.",
    creator: SITE_CONFIG.twitterHandle,
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/ipo-gmp`,
  },
};

export const revalidate = 60;

export default async function IpoGmpPage() {
  const ipos = await getAllIpos();

  // Structured Data for Google SERP
  const faqSchema = generateFaqJsonLd(GMP_PAGE_FAQS);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "IPO GMP Today", url: "/ipo-gmp" },
  ]);
  const datasetSchema = generateDatasetJsonLd(
    "IPO Grey Market Premium (GMP) Live Dataset India",
    "Real-time dataset of Grey Market Premium rates, estimated listing gains, and price bands for ongoing Mainboard and SME IPOs in India.",
    `${SITE_CONFIG.url}/ipo-gmp`
  );
  const itemListSchema = generateItemListJsonLd(
    "Top IPO GMP Rankings Today",
    ipos.slice(0, 15).map((ipo, idx) => ({
      name: `${ipo.name} GMP ₹${ipo.gmp?.value ?? 0}`,
      url: `/ipo/${ipo.slug}`,
      position: idx + 1,
    }))
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Search Engine Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <Breadcrumb items={[{ name: "IPO GMP Today", url: "/ipo-gmp" }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-4xl font-light sm:font-normal tracking-tight text-slate-900 dark:text-white leading-tight">
              IPO GMP Today (Grey Market Premium Live)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Real-time Grey Market Premium rates, estimated listing gains, and price bands for ongoing Mainboard & SME IPOs in India.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live Desk • Updated Hourly</span>
          </div>
        </div>

        <LeaderboardAd />

        {/* Interactive GMP View Switcher (List & Grid Options) */}
        <IpoGmpView ipos={ipos} />

        <BrokerCtaCard variant="horizontal" broker="angelone" />

        {/* Semantic Educational SEO Guide for Search Rank Dominance */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-medium sm:font-semibold text-slate-900 dark:text-white">
              Complete Guide to Understanding IPO Grey Market Premium (GMP)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>What is IPO GMP?</span>
              </h3>
              <p>
                Grey Market Premium (GMP) is the unofficial cash premium at which IPO applications or shares change hands before the official listing on BSE and NSE. A rising GMP signals strong listing day enthusiasm.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>Calculating Estimated Listing Price</span>
              </h3>
              <p>
                Estimated Listing Price = Cut-Off Price Band + Latest GMP. If the price band is ₹200 and GMP is ₹60, the expected listing price is ₹260 (+30% expected listing gain).
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>Kostak & Sauda Meaning</span>
              </h3>
              <p>
                Kostak is the fixed profit made by selling your IPO application before allotment. Subject to Sauda guarantees profit only if shares are allotted in the lottery.
              </p>
            </div>
          </div>

          {/* Search FAQ Accordion Container */}
          <div className="pt-2 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Frequently Asked Questions About IPO GMP
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {GMP_PAGE_FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5"
                >
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {faq.question}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
