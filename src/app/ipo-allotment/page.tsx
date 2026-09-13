import React from "react";
import { Metadata } from "next";
import { ExternalLink, ShieldCheck, CheckCircle2, HelpCircle, FileText } from "lucide-react";
import { getAllIpos } from "@/lib/data/ipoRepository";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LeaderboardAd } from "@/components/ads/LeaderboardAd";
import { BrokerCtaCard } from "@/components/ads/BrokerCtaCard";
import { IpoAllotmentTable } from "@/components/ipo/IpoAllotmentTable";
import { SITE_CONFIG } from "@/lib/seo/metadata";
import {
  generateFaqJsonLd,
  generateBreadcrumbJsonLd,
  generateDatasetJsonLd,
  generateItemListJsonLd,
  ALLOTMENT_PAGE_FAQS,
} from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "IPO Allotment Status Check Online 2026 | Link Intime, KFintech & BSE Direct Links",
  description:
    "Check IPO allotment status online with PAN Card or Application Number. Direct official registrar links for Link Intime, KFintech, Bigshare Services, and BSE India.",
  keywords: [
    "ipo allotment status",
    "check ipo allotment status online",
    "link intime ipo allotment status",
    "kfintech ipo allotment link",
    "bigshare ipo allotment status",
    "bse ipo allotment check by pan",
    "ipo allotment date 2026",
    "how to check ipo allotment status",
    "basis of allotment ipo",
  ],
  openGraph: {
    title: "IPO Allotment Status Check Online 2026 | Direct Registrar Links",
    description:
      "Instant verification of IPO share allotment status online. Direct links to Link Intime, KFintech, Bigshare, and BSE portals.",
    url: `${SITE_CONFIG.url}/ipo-allotment`,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: "IPO Allotment Status Check Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPO Allotment Status Check Online 2026",
    description: "Instant online allotment verification via official registrar portals.",
    creator: SITE_CONFIG.twitterHandle,
  },
  alternates: {
    canonical: "/ipo-allotment",
  },
};

export const revalidate = 60;

export default async function IpoAllotmentPage() {
  const ipos = await getAllIpos();

  // Structured Data for Google SERP
  const faqSchema = generateFaqJsonLd(ALLOTMENT_PAGE_FAQS);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "IPO Allotment Hub", url: "/ipo-allotment" },
  ]);
  const datasetSchema = generateDatasetJsonLd(
    "IPO Allotment Status Results & Registrar Gateways India",
    "Real-time database of IPO share allotment status, basis of allotment documents, and registrar portal gateways.",
    `${SITE_CONFIG.url}/ipo-allotment`
  );
  const itemListSchema = generateItemListJsonLd(
    "Recent IPO Allotment Status List",
    ipos.slice(0, 15).map((ipo, idx) => ({
      name: `${ipo.name} Allotment Status`,
      url: `/ipo/${ipo.slug}`,
      position: idx + 1,
    }))
  );

  const registrars = [
    {
      name: "KFin Technologies (KFintech)",
      url: "https://ipostatus.kfintech.com/",
      badge: "KFintech Direct Portal",
      popularCompanies: "Bajaj Housing, Premier Energies, Northern Arc",
    },
    {
      name: "MUFG / Link Intime India",
      url: "https://in.mpms.mufg.com/Initial_Offer/public-issues.html",
      badge: "Link Intime / MUFG Portal",
      popularCompanies: "Hero Motors, Western Carriers, Tata Tech",
    },
    {
      name: "Bigshare Services",
      url: "https://www.bigshareonline.com/ipo_Allotment.html",
      badge: "Bigshare Direct Portal",
      popularCompanies: "Mainboard & SME Public Offerings",
    },
    {
      name: "Skyline Financial",
      url: "https://www.skylinerta.com/ipo.php",
      badge: "Skyline Portal",
      popularCompanies: "BSE & NSE SME Offerings",
    },
    {
      name: "BSE Official Allotment",
      url: "https://www.bseindia.com/investors/appli_check.aspx",
      badge: "BSE India Direct",
      popularCompanies: "Check any IPO using PAN card",
    },
  ];

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

      <Breadcrumb items={[{ name: "IPO Allotment Hub", url: "/ipo-allotment" }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-light sm:font-normal tracking-tight text-slate-900 dark:text-white leading-tight">
              IPO Allotment Status Check
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Check real-time basis of allotment results with direct access to official registrars (Link Intime, KFintech, Bigshare, BSE).
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium self-start sm:self-auto shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Registrar Feeds Active</span>
          </div>
        </div>

        <LeaderboardAd />

        {/* 1. Allotment Status Table (OUT First & Sorted by Nearby Proximity) */}
        <IpoAllotmentTable ipos={ipos} />

        {/* 2. Official Registrar Direct Portals */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-medium sm:font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>Official Registrar Direct Portals</span>
            </h2>
            <span className="text-xs font-semibold text-slate-400">5 Direct Registrar Links</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {registrars.map((reg) => (
              <a
                key={reg.name}
                href={reg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:border-blue-500 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {reg.badge}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {reg.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{reg.popularCompanies}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-blue-600 font-bold">
                  <span>Open Official Server</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 3. Step-by-Step Verification Guide & Search Intent Content */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-heading">
              How to Check IPO Allotment Status Online (Step-by-Step)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Method 1: Via Official Registrar</span>
              </h3>
              <p>
                Visit the official registrar link (Link Intime, KFintech, or Bigshare). Select the IPO from the drop-down menu, choose PAN option, enter your 10-digit PAN number, and click Submit to view allotted shares.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Method 2: Via BSE India Portal</span>
              </h3>
              <p>
                Open the BSE Application Check portal. Select Issue Type as &quot;Equity&quot;, pick the IPO Name from the dropdown, enter your Application Number or PAN number, solve captcha, and click Search.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Method 3: Bank / UPI SMS Notification</span>
              </h3>
              <p>
                If allotted shares, your bank sends a debit SMS confirming funds deduction. If not allotted, you receive an SMS confirming the revocation of the blocked UPI mandate on T+2 day.
              </p>
            </div>
          </div>

          {/* Search FAQ Accordion Container */}
          <div className="pt-2 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Frequently Asked Questions About IPO Allotment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {ALLOTMENT_PAGE_FAQS.map((faq, idx) => (
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

        <BrokerCtaCard variant="horizontal" broker="upstox" />
      </div>
    </div>
  );
}
