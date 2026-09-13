import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Sparkles,
  Layers,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Flame,
  Search,
  HelpCircle,
} from "lucide-react";
import { getAllIpos, getLiveIpos, getUpcomingIpos, getTopGmpIpos } from "@/lib/data/ipoRepository";
import { getRecentBlogs } from "@/lib/data/blogRepository";
import { IpoCard } from "@/components/ipo/IpoCard";
import { IpoTable } from "@/components/ipo/IpoTable";
import { BlogCard } from "@/components/blog/BlogCard";
import { ProfitCalculator } from "@/components/tools/ProfitCalculator";
import { generateFaqJsonLd } from "@/lib/seo/schema";
import { formatINR } from "@/lib/utils/formatters";

export const revalidate = 60;

export default async function HomePage() {
  const allIpos = await getAllIpos();
  const liveIpos = await getLiveIpos();
  const upcomingIpos = await getUpcomingIpos();
  const topGmpIpos = await getTopGmpIpos(6);
  const recentBlogs = await getRecentBlogs(3);

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
        "Mainboard IPOs are larger issues listed on the main exchange with smaller lot sizes (approx ₹14,000–₹15,000 per application). SME IPOs are listed on NSE Emerge or BSE SME with minimum application values of ₹1,00,000 to ₹1,40,000.",
    },
  ];

  const faqSchema = generateFaqJsonLd(homeFaqs);

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      {/* JSON-LD Schema for FAQs */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white py-10 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.25),rgba(255,255,255,0))]" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 text-blue-300 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>India&apos;s #1 Real-Time IPO & GMP Intelligence Hub</span>
          </div>

          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-heading leading-tight">
            Track Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">IPO GMP</span>, Allotment & Dates
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Real-time Grey Market Premium updates, market lot sizes, instant registrar allotment status, and institutional reviews for Mainboard & SME IPOs.
          </p>

          {/* Quick Metrics Ticker Counter */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-3xl mx-auto pt-2 sm:pt-4">
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 p-3 sm:p-3.5 rounded-2xl">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Open IPOs</span>
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-400">{liveIpos.length} Active</span>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 p-3 sm:p-3.5 rounded-2xl">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Upcoming</span>
              <span className="text-xl sm:text-2xl font-extrabold text-blue-400">{upcomingIpos.length} Pipeline</span>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 p-3 sm:p-3.5 rounded-2xl">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Mainboard</span>
              <span className="text-xl sm:text-2xl font-extrabold text-purple-400">{mainboardIpos.length} Issues</span>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 p-3 sm:p-3.5 rounded-2xl">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">SME Segment</span>
              <span className="text-xl sm:text-2xl font-extrabold text-amber-400">{smeIpos.length} Issues</span>
            </div>
          </div>
        </div>
      </section>

      {/* Top GMP Gainers Carousel / Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                Top Grey Market Premium (GMP) Gainers
              </h2>
              <p className="text-xs text-slate-500">Highest expected listing returns right now</p>
            </div>
          </div>
          <Link
            href="/ipo-gmp"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Full Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {topGmpIpos.slice(0, 3).map((ipo) => {
            const gmpVal = ipo.gmp?.value ?? 0;
            const gmpPct = ipo.gmp?.percentage ?? 0;
            const isPositive = gmpVal > 0;
            return (
              <div
                key={ipo.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all flex items-center justify-between"
              >
                <div className="space-y-1">
                  <Link
                    href={`/ipo/${ipo.slug}`}
                    className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 line-clamp-1"
                  >
                    {ipo.name}
                  </Link>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>Price: {ipo.priceBand?.raw || formatINR(ipo.priceBand?.max || 0)}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">
                      Exp: {ipo.gmp?.estListingText || (ipo.gmp?.expectedListingPrice ? formatINR(ipo.gmp.expectedListingPrice) : "—")}
                    </span>
                  </div>
                </div>
                <div
                  className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-extrabold ${
                    isPositive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {isPositive ? `+₹${gmpVal}` : "₹0"}
                  {gmpPct > 0 && <span className="ml-1 text-[10px]">({gmpPct}%)</span>}
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
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
              Current & Upcoming IPOs in India
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Live updates for Mainboard & SME issues on NSE & BSE
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/ipo-gmp"
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              Live GMP Board
            </Link>
            <Link
              href="/ipo-allotment"
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              Allotment Checker
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
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
              Latest IPO Reviews & Educational Guides
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Fundamental analysis, GMP daily bulletins, and bidding strategies
            </p>
          </div>
          <Link
            href="/blog"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
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
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
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
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-start gap-2">
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
