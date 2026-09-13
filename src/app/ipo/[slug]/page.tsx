import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Flame,
  Users,
  Building,
  DollarSign,
  Phone,
  Mail,
  Globe,
  PieChart,
  Target,
  BarChart3,
} from "lucide-react";
import { getIpoBySlug, getAllIpos } from "@/lib/data/ipoRepository";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LeaderboardAd } from "@/components/ads/LeaderboardAd";
import { BrokerCtaCard } from "@/components/ads/BrokerCtaCard";
import { formatINR } from "@/lib/utils/formatters";
import { getStatusBadgeConfig } from "@/lib/utils/status";

import { IpoLogo } from "@/components/ui/IpoLogo";
import { TimelineStepper } from "@/components/ipo/TimelineStepper";
import { getRegistrarPortalUrl } from "@/lib/utils/registrar";
import { constructIpoMetadata } from "@/lib/seo/metadata";
import { generateIpoJsonLd, generateBreadcrumbJsonLd, generateFaqJsonLd } from "@/lib/seo/schema";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const ipo = await getIpoBySlug(params.slug);
  if (!ipo) return { title: "IPO Details | IPO List" };
  return constructIpoMetadata(ipo);
}

export async function generateStaticParams() {
  const ipos = await getAllIpos();
  return ipos.map((ipo) => ({ slug: ipo.slug }));
}

export const revalidate = 60;

export default async function IpoDetailPage({ params }: { params: { slug: string } }) {
  const ipo = await getIpoBySlug(params.slug);
  if (!ipo) notFound();

  const statusConfig = getStatusBadgeConfig(ipo.status);
  const isSme = ipo.type === "SME";
  const gmpVal = ipo.gmp?.value ?? 0;
  const gmpPct = ipo.gmp?.percentage ?? 0;
  const isPositive = gmpVal > 0;

  // Generate dynamic, search-optimized FAQs if none are attached
  const resolvedFaqs = (ipo.faqs && ipo.faqs.length > 0) ? ipo.faqs : [
    {
      question: `What is ${ipo.name} IPO GMP today?`,
      answer: `${ipo.name} IPO GMP today is ₹${gmpVal} (${gmpPct > 0 ? `+${gmpPct}%` : "0%"}). The expected listing price is ${ipo.gmp?.estListingText || (ipo.gmp?.expectedListingPrice ? formatINR(ipo.gmp.expectedListingPrice) : "TBA")}.`,
    },
    {
      question: `How can I check ${ipo.name} IPO allotment status?`,
      answer: `You can check ${ipo.name} IPO allotment status directly on the ${ipo.registrar?.name || "official registrar"} portal or on the BSE India website using your 10-digit PAN number or IPO Application Number.`,
    },
    {
      question: `What is the price band and market lot size for ${ipo.name} IPO?`,
      answer: `${ipo.name} IPO price band is ${ipo.priceBand?.raw || (ipo.priceBand?.max ? formatINR(ipo.priceBand.max) : "TBA")}. The minimum market lot size is ${ipo.lotSize ? `${ipo.lotSize} shares` : "1 lot"}.`,
    },
    {
      question: `Where will ${ipo.name} IPO be listed?`,
      answer: `${ipo.name} IPO shares will be listed on ${ipo.issueDetails?.listingExchange || "NSE & BSE stock exchanges"}.`,
    },
  ];

  // Full-Spectrum Structured Data for Google SERP
  const ipoJsonLd = generateIpoJsonLd(ipo);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: isSme ? "SME IPOs" : "Mainboard IPOs", url: isSme ? "/ipo/sme" : "/ipo/mainboard" },
    { name: ipo.name, url: `/ipo/${ipo.slug}` },
  ]);
  const faqJsonLd = generateFaqJsonLd(resolvedFaqs);

  return (
    <div className="space-y-8 pb-16">
      {/* Search Engine Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ipoJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Breadcrumb
        items={[
          { name: "All IPOs", url: "/ipo" },
          { name: ipo.name, url: `/ipo/${ipo.slug}` },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <LeaderboardAd />

        {/* Hero Header Card — Clean, Airy, Elegant & De-cluttered */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-8 lg:p-10 shadow-card space-y-6 sm:space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-8">
            {/* Left side: Logo + Bigger Thinner Title + Badges */}
            <div className="flex items-start gap-3.5 sm:gap-5 flex-1 min-w-0">
              <IpoLogo name={ipo.name} logoUrl={ipo.logoUrl} size="lg" className="mt-1 shrink-0 shadow-sm" />
              <div className="space-y-2 flex-1 min-w-0">
                {/* Badges row with refined spacing */}
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                  <span
                    className={`text-xs font-semibold px-3 py-0.5 rounded-full border ${
                      isSme
                        ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800"
                        : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800"
                    }`}
                  >
                    {ipo.type} IPO
                  </span>

                  {ipo.issueDetails?.listingExchange && (
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/70 px-2.5 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-700/60">
                      Listing: {ipo.issueDetails.listingExchange}
                    </span>
                  )}

                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border ${statusConfig.className}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                    <span>{statusConfig.label}</span>
                  </div>
                </div>

                {/* Company Name: BIGGER, THINNER, SLEEK! */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-light sm:font-normal text-slate-900 dark:text-white font-heading tracking-tight leading-tight">
                  {ipo.name}
                </h1>

                {/* Subtitle with proper breathing room */}
                <div className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal flex-wrap">
                  {ipo.issueDetails?.issueType && (
                    <span>Issue Type: <strong className="text-slate-700 dark:text-slate-300 font-medium">{ipo.issueDetails.issueType}</strong></span>
                  )}
                  {ipo.lotSize && (
                    <>
                      <span>•</span>
                      <span>Lot Size: <strong className="text-slate-700 dark:text-slate-300 font-medium">{ipo.lotSize} Shares</strong></span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right side: Sleek, Uncluttered Live GMP Card */}
            <div className="bg-gradient-to-br from-slate-50 to-emerald-50/20 dark:from-slate-800/60 dark:to-emerald-950/20 p-4 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col items-start lg:items-end shrink-0 shadow-sm space-y-3 w-full lg:w-auto lg:min-w-[260px]">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block lg:text-right">
                  Live Grey Market Premium (GMP)
                </span>
                <div className="flex items-baseline gap-2 mt-1 lg:justify-end">
                  <span
                    className={`text-3xl sm:text-4xl font-light sm:font-normal tracking-tight ${
                      isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {isPositive ? `+₹${gmpVal}` : "₹0"}
                  </span>
                  {gmpPct > 0 && (
                    <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full border border-emerald-200/60">
                      +{gmpPct}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 lg:text-right font-normal">
                  Expected Listing:{" "}
                  <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {ipo.gmp?.estListingText || (ipo.gmp?.expectedListingPrice ? formatINR(ipo.gmp.expectedListingPrice) : "TBA")}
                  </strong>
                </p>
              </div>

              {/* Action Button */}
              <div className="w-full lg:w-auto pt-1">
                {ipo.status === "LIVE" ? (
                  <a
                    href="https://zerodha.com/open-account"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full lg:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-2.5 rounded-xl text-xs shadow-sm hover:shadow transition-all"
                  >
                    <span>Apply via Zerodha</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <a
                    href={getRegistrarPortalUrl(ipo.registrar?.name, ipo.registrar?.website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full lg:w-auto bg-slate-900 hover:bg-blue-600 text-white dark:bg-slate-800 dark:hover:bg-blue-600 font-medium px-5 py-2.5 rounded-xl text-xs shadow-sm hover:shadow transition-all"
                  >
                    <span>Check Allotment Status</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-medium uppercase text-slate-400 block">Price Band</span>
              <span className="text-base font-normal sm:font-medium text-slate-900 dark:text-white">
                {ipo.priceBand?.raw || (ipo.priceBand?.max ? formatINR(ipo.priceBand.max) : "TBA")}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-medium uppercase text-slate-400 block">Lot Size</span>
              <span className="text-base font-normal sm:font-medium text-slate-900 dark:text-white">
                {ipo.lotSize ? `${ipo.lotSize} Shares` : "TBA"}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-medium uppercase text-slate-400 block">Issue Size</span>
              <span className="text-base font-normal sm:font-medium text-slate-900 dark:text-white">
                {ipo.issueDetails?.issueSize || "TBA"}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-medium uppercase text-slate-400 block">Face Value</span>
              <span className="text-base font-normal sm:font-medium text-slate-900 dark:text-white">
                {ipo.issueDetails?.faceValue || "₹10 per share"}
              </span>
            </div>
          </div>
        </section>

        {/* Timeline Dates Stepper Component */}
        <TimelineStepper dates={ipo.dates} status={ipo.status} />

        {/* Market Lot Size Table */}
        {ipo.marketLot && ipo.marketLot.length > 0 && (
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg sm:text-xl font-normal sm:font-medium text-slate-900 dark:text-white">
                {ipo.name} Market Lot Size & Application Amounts
              </h2>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4">Application Type</th>
                    <th className="py-3 px-4">Lots</th>
                    <th className="py-3 px-4">Shares</th>
                    <th className="py-3 px-4 text-right">Application Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {ipo.marketLot.map((lot, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{lot.application}</td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{lot.lots}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{lot.shares}</td>
                      <td className="py-3 px-4 text-right font-medium sm:font-semibold text-blue-600 dark:text-blue-400">{lot.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Reservation Table */}
        {ipo.reservation && ipo.reservation.length > 0 && (
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg sm:text-xl font-normal sm:font-medium text-slate-900 dark:text-white">
                {ipo.name} IPO Reservation / Investor Portions
              </h2>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4">Investor Category</th>
                    <th className="py-3 px-4">Shares Offered</th>
                    <th className="py-3 px-4 text-right">% Allocation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {ipo.reservation.map((res, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{res.category}</td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{res.sharesOffered}</td>
                      <td className="py-3 px-4 text-right font-medium sm:font-semibold text-purple-600 dark:text-purple-400">{res.percentage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Company Financials Table */}
        {ipo.financials && ipo.financials.length > 0 && (
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg sm:text-xl font-normal sm:font-medium text-slate-900 dark:text-white">
                {ipo.name} Financial Performance (Amount in ₹ Crores)
              </h2>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4">Period Ended</th>
                    <th className="py-3 px-4">Total Revenue</th>
                    <th className="py-3 px-4">Expenses</th>
                    <th className="py-3 px-4">Profit After Tax (PAT)</th>
                    <th className="py-3 px-4 text-right">Total Assets</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {ipo.financials.map((fin, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{fin.period || fin["Period Ended"] || `FY ${idx}`}</td>
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-semibold">{fin.revenue || fin["Revenue"] || "N/A"}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{fin.expense || fin["Expense"] || "N/A"}</td>
                      <td className="py-3 px-4 font-medium sm:font-semibold text-emerald-600 dark:text-emerald-400">{fin.pat || fin["PAT"] || "N/A"}</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-800 dark:text-slate-200">{fin.assets || fin["Assets"] || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Valuation & KPIs */}
        {ipo.valuationKPIs && Object.keys(ipo.valuationKPIs).length > 0 && (
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg sm:text-xl font-normal sm:font-medium text-slate-900 dark:text-white">
                {ipo.name} Valuation & Key Performance Indicators (KPIs)
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
              {Object.entries(ipo.valuationKPIs).map(([key, val], idx) => {
                if (!val || key === "kpi") return null;
                const formattedKey = key.replace(/_/g, " ").replace(/:/g, "").toUpperCase();
                return (
                  <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">{formattedKey}</span>
                    <span className="text-sm font-medium sm:font-semibold text-slate-900 dark:text-white mt-0.5 block">{val}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Objects of the Issue */}
        {ipo.objectsOfIssue && ipo.objectsOfIssue.length > 0 && (
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg sm:text-xl font-normal sm:font-medium text-slate-900 dark:text-white">
                Objects of the Issue & Utilisation of Proceeds
              </h2>
            </div>

            <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {ipo.objectsOfIssue.map((obj, idx) => (
                <li key={idx} className="flex items-start justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{obj.purpose}</span>
                  </div>
                  {obj.amount && obj.amount !== "₹-" && (
                    <span className="font-medium sm:font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">{obj.amount} Cr</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Registrar Gateway & Allotment Box */}
        {ipo.registrar && (
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                  Official Registrar
                </span>
                <h2 className="text-lg sm:text-xl font-normal sm:font-medium text-slate-900 dark:text-white">
                  {ipo.name} Allotment Status & Registrar
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Registrar Name: <strong>{ipo.registrar.name}</strong>
                </p>
              </div>

              {ipo.registrar.website && (
                <a
                  href={ipo.registrar.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm self-start sm:self-auto"
                >
                  <span>Check Allotment Status</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              {ipo.registrar.phone && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">Phone</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{ipo.registrar.phone}</span>
                  </div>
                </div>
              )}

              {ipo.registrar.email && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">Email</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{ipo.registrar.email}</span>
                  </div>
                </div>
              )}

              {ipo.registrar.website && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <div className="truncate">
                    <span className="text-[10px] font-bold text-slate-400 block">Website</span>
                    <a href={ipo.registrar.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 truncate block hover:underline">
                      {ipo.registrar.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}


        {/* Broker CTA Card */}
        <BrokerCtaCard variant="horizontal" broker="zerodha" />

        {/* Search-Optimized FAQ Section for Google Rich Accordions */}
        {resolvedFaqs.length > 0 && (
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="text-lg sm:text-xl font-normal sm:font-medium text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Frequently Asked Questions on {ipo.name} IPO
            </h2>
            <div className="space-y-3 pt-2">
              {resolvedFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5"
                >
                  <h3 className="font-normal sm:font-medium text-xs sm:text-sm text-slate-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
