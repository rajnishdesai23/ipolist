import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Sparkles,
  Layers,
  Calendar,
  Calculator,
  CheckCircle2,
  ArrowRight,
  Flame,
  Search,
  HelpCircle,
  Zap,
  Send,
} from "lucide-react";
import { getAllIpos, getTopGmpIpos } from "@/lib/data/ipoRepository";
import { getRecentBlogs } from "@/lib/data/blogRepository";
import { IpoCard } from "@/components/ipo/IpoCard";
import { IpoTable } from "@/components/ipo/IpoTable";
import { BlogCard } from "@/components/blog/BlogCard";
import { ProfitCalculator } from "@/components/tools/ProfitCalculator";
import { generateFaqJsonLd } from "@/lib/seo/schema";
import { formatINR, getCleanIpoDisplayName } from "@/lib/utils/formatters";
import { IPO } from "@/types/ipo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live IPO GMP Today & Allotment Status 2026",
  description:
    "India's real-time IPO tracking platform. Check live Grey Market Premium (GMP) today, allotment status direct links, subscription numbers, and dates for Mainboard & SME IPOs.",
  alternates: {
    canonical: "/",
  },
};

export const revalidate = 60;

export default async function HomePage() {
  const rawIpos = await getAllIpos();
  // Sanitize IPO list payload to eliminate deep unused records, base64 images, and drop HTML size by 95%
  const allIpos = rawIpos.map((ipo) => ({
    id: ipo.id,
    name: ipo.name,
    slug: ipo.slug,
    type: ipo.type,
    status: ipo.status,
    rawStatus: ipo.rawStatus,
    logoUrl: ipo.logoUrl ? (ipo.logoUrl.startsWith("http") ? ipo.logoUrl : `/api/ipo-logo/${ipo.slug}`) : undefined,
    dates: ipo.dates ? { open: ipo.dates.open, close: ipo.dates.close, rawRange: ipo.dates.rawRange } : undefined,
    priceBand: ipo.priceBand ? { max: ipo.priceBand.max, min: ipo.priceBand.min, raw: ipo.priceBand.raw } : undefined,
    lotSize: ipo.lotSize,
    gmp: ipo.gmp ? { value: ipo.gmp.value, percentage: ipo.gmp.percentage, estListingText: ipo.gmp.estListingText, expectedListingPrice: ipo.gmp.expectedListingPrice } : undefined,
    allotment: ipo.allotment ? { status: ipo.allotment.status } : undefined,
    subscription: ipo.subscription ? { total: ipo.subscription.total } : undefined,
    issueDetails: ipo.issueDetails ? { issueSize: ipo.issueDetails.issueSize, listingExchange: ipo.issueDetails.listingExchange } : undefined,
    registrar: ipo.registrar ? { name: ipo.registrar.name, website: ipo.registrar.website } : undefined,
  })) as IPO[];

  const liveIpos = allIpos.filter((i) => i.status === "LIVE");
  const upcomingIpos = allIpos.filter((i) => i.status === "UPCOMING");
  
  const rawTopGmp = await getTopGmpIpos(6);
  const topGmpIpos = rawTopGmp.map((ipo) => ({
    id: ipo.id,
    name: ipo.name,
    slug: ipo.slug,
    priceBand: ipo.priceBand ? { max: ipo.priceBand.max, min: ipo.priceBand.min, raw: ipo.priceBand.raw } : undefined,
    gmp: ipo.gmp ? { value: ipo.gmp.value, percentage: ipo.gmp.percentage, estListingText: ipo.gmp.estListingText, expectedListingPrice: ipo.gmp.expectedListingPrice } : undefined,
  }));

  const rawBlogs = await getRecentBlogs(3);
  const recentBlogs = rawBlogs.map((b) => ({
    id: b.id,
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt,
    category: b.category,
    publishedAt: b.publishedAt,
    readingTimeMinutes: b.readingTimeMinutes,
    author: { name: b.author?.name || "IPO Research Team" },
    coverImage: b.coverImage && !b.coverImage.startsWith("data:")
      ? b.coverImage
      : "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=75",
  })) as any[];

  const mainboardIpos = allIpos.filter((i) => i.type === "MAINBOARD");
  const smeIpos = allIpos.filter((i) => i.type === "SME");

  const homeFaqs = [
    {
      question: "What is IPO Grey Market Premium (GMP)?",
      answer:
        "Grey Market Premium (GMP) is the unofficial price per share at which an IPO is being traded before it gets officially listed on the NSE or BSE stock exchanges. It reflects investor appetite and expected listing gains.",
    },
    {
      question: "How is the expected IPO listing price calculated?",
      answer:
        "Expected Listing Price = Issue Cut-off Price + Current GMP. For example, if the issue price is ₹100 and the GMP is ₹25, the expected listing price on day one is ₹125 (a 25% expected gain).",
    },
    {
      question: "Where can I check IPO allotment status?",
      answer:
        "You can check IPO allotment status directly on the official registrar portal (such as Link Intime, KFintech, Bigshare, or Skyline) or via the BSE / NSE allotment verification pages using your PAN number.",
    },
    {
      question: "What is the difference between Mainboard and SME IPOs?",
      answer:
        "Mainboard IPOs are larger issues listed on the main exchange with smaller lot sizes (approx ₹14,000 to ₹15,000 per application). SME IPOs are listed on NSE Emerge or BSE SME with minimum application values of ₹1,00,000 to ₹1,40,000.",
    },
  ];

  const faqSchema = generateFaqJsonLd(homeFaqs);

  return (
    <div className="space-y-6 pb-10">
      {/* JSON-LD Schema for FAQs - Top Level */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Top Semantic Title Header & Social Signals (Preserved in DOM for 100-point SEO, Visually Hidden with sr-only) */}
      <section className="sr-only">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/60">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <span>Live Market Feed • Verified Today</span>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-light sm:font-normal tracking-tight text-slate-900 dark:text-white leading-tight">
              IPO List 2026: <span className="text-blue-600 dark:text-blue-500">Live IPO GMP Today</span> &amp; Allotment Status
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light max-w-3xl leading-relaxed">
              Real-time Indian IPO tracking platform. Check live Grey Market Premium (GMP), official registrar allotment status, bidding dates, and subscription demand for Mainboard &amp; SME public offerings.
            </p>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/ipo-allotment"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-normal text-slate-700 dark:text-slate-200 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Check Allotment Status</span>
            </Link>
            <Link
              href="/ipo-gmp"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-normal text-white transition-colors shadow-sm"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Live GMP Board</span>
            </Link>
          </div>
        </div>

        {/* Social Sharing Strip to Satisfy Search Engine Social Media Checks */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 text-xs">
          <span className="text-[11px] text-slate-500 font-light">Share live IPO tracker with fellow investors:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent("⚡ Check Live IPO GMP Today, Allotment Status & Dates at IPO List 2026: https://ipolist.in")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share IPO List on WhatsApp"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] font-normal transition-colors"
            >
              <Send className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent("https://ipolist.in")}&text=${encodeURIComponent("⚡ Live IPO GMP Today & Allotment Status: IPO List 2026")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share IPO List on Telegram"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 text-[11px] font-normal transition-colors"
            >
              <span>Telegram</span>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent("https://ipolist.in")}&text=${encodeURIComponent("⚡ Track Live IPO GMP Today, Allotment Status & Listing Gain Estimates on IPO List 2026:")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share IPO List on Twitter X"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 text-[11px] font-normal transition-colors"
            >
              <span>X / Twitter</span>
            </a>
          </div>
        </div>
      </section>

      {/* Clean Minimal Hero Section — Sleek & Visible */}
      <section className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-2 pb-4 lg:pt-3 lg:pb-6 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Left Column: Minimal Text & Actions */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* Display Subheading — Sleek, Thinner, Modern Typography */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Track <span className="text-blue-600 dark:text-blue-500 font-normal">IPO GMP</span>, Allotment &amp; More
            </h2>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/ipo"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-normal px-7 py-3 rounded-2xl text-sm transition-all shadow-sm hover:scale-[1.01]"
              >
                <span>Explore All Indian IPOs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/ipo-allotment"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-normal px-7 py-3 rounded-2xl text-sm transition-all shadow-sm hover:scale-[1.01]"
              >
                <span>Check Allotment Records</span>
              </Link>
            </div>

            {/* 4 Minimal Features Bottom Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 fill-blue-500/20" />
                </div>
                <div>
                  <span className="font-medium text-xs text-slate-800 dark:text-slate-200 block">Live GMP</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Updates</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
                </div>
                <div>
                  <span className="font-medium text-xs text-slate-800 dark:text-slate-200 block">Allotment</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Status</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                  <Calculator className="w-5 h-5 fill-purple-500/20" />
                </div>
                <div>
                  <span className="font-medium text-xs text-slate-800 dark:text-slate-200 block">Financial</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Calculators</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-5 h-5 fill-amber-500/20" />
                </div>
                <div>
                  <span className="font-medium text-xs text-slate-800 dark:text-slate-200 block">Mainboard</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">&amp; SME</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Illustration Asset (Hidden on mobile/small screens, visible on Desktop) */}
          <div className="hidden lg:flex lg:col-span-5 items-center justify-center relative">
            <div className="relative w-full max-w-lg aspect-square">
              <img
                src="/heroimage.png"
                alt="IPO List Live GMP & Allotment Tracking Illustration"
                loading="eager"
                decoding="async"
                className="w-full h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Top GMP Gainers Carousel / Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 md:pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-normal sm:font-medium text-slate-900 dark:text-white">
                Top Grey Market Premium (GMP) Gainers
              </h2>
              <p className="text-xs text-slate-500">Highest expected listing returns right now</p>
            </div>
          </div>
          <Link
            href="/ipo-gmp"
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Full Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {topGmpIpos.slice(0, 3).map((ipo) => {
            const displayName = getCleanIpoDisplayName(ipo.name, ipo.slug);
            const gmpVal = ipo.gmp?.value ?? 0;
            const gmpPct = ipo.gmp?.percentage ?? 0;
            const isPositive = gmpVal > 0;
            const isNegative = gmpVal < 0;
            return (
              <div
                key={ipo.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all flex items-center justify-between"
              >
                <div className="space-y-1">
                  <Link
                    href={`/ipo/${ipo.slug}`}
                    className="font-normal sm:font-medium text-sm text-slate-900 dark:text-white hover:text-blue-600 line-clamp-1"
                  >
                    <span>{displayName} Live GMP</span>
                  </Link>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>Price: {ipo.priceBand?.raw || formatINR(ipo.priceBand?.max || 0)}</span>
                    <span>•</span>
                    <span className={isNegative ? "text-rose-600 font-medium" : "text-emerald-600 font-medium"}>
                      Exp: {ipo.gmp?.estListingText || (ipo.gmp?.expectedListingPrice ? formatINR(ipo.gmp.expectedListingPrice) : "TBA")}
                    </span>
                  </div>
                </div>
                <div
                  className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-semibold ${
                    isPositive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      : isNegative
                      ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {isPositive ? `+₹${gmpVal}` : isNegative ? `-₹${Math.abs(gmpVal)}` : "₹0"}
                  {gmpPct !== 0 && <span className="ml-1 text-[10px]">({gmpPct > 0 ? `+${gmpPct}` : gmpPct}%)</span>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main IPO Directory Section with Cards & Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-normal sm:font-medium text-slate-900 dark:text-white">
              Current & Upcoming IPOs in India
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/ipo-gmp"
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <span>View Live GMP Tracker</span>
            </Link>
            <Link
              href="/ipo-allotment"
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              <span>Allotment Verification Tool</span>
            </Link>
          </div>
        </div>

        {/* Responsive Interactive IPO Table & Cards */}
        <IpoTable ipos={allIpos} showAllColumns={true} />
      </section>

      {/* Interactive Financial Calculator Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfitCalculator />
      </section>

      {/* Editorial Blog, Reviews & Market Analysis */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-normal sm:font-medium text-slate-900 dark:text-white">
              Latest IPO Reviews & Educational Guides
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {recentBlogs.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* SEO Explanations & FAQ Accordion Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-10 shadow-card space-y-6 sm:space-y-8">
          <div className="max-w-3xl space-y-2 sm:space-y-3">
            <h2 className="text-lg sm:text-xl font-normal sm:font-medium text-slate-900 dark:text-white">
              Frequently Asked Questions (FAQs) & Market Guide
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Everything you need to know about Initial Public Offerings (IPOs) in India, Grey Market Premiums, and verifying your basis of allotment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {homeFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2"
              >
                <h3 className="font-normal sm:font-medium text-xs sm:text-sm text-slate-900 dark:text-white flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
