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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const ipo = await getIpoBySlug(params.slug);
  if (!ipo) return { title: "IPO Details" };
  return {
    title: `${ipo.name} IPO Details, Live GMP, Dates, Price Band & Lot Size | IPO List`,
    description: `Check live ${ipo.name} IPO GMP today, price band, market lot size, reservation, key dates, financials, valuation, and registrar allotment details.`,
  };
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

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[
          { name: "All IPOs", url: "/ipo" },
          { name: ipo.name, url: `/ipo/${ipo.slug}` },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <LeaderboardAd />

        {/* Hero Header Card */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <IpoLogo name={ipo.name} logoUrl={ipo.logoUrl} size="xl" className="mt-1" />
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      isSme
                        ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300"
                        : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
                    }`}
                  >
                    {ipo.type} IPO
                  </span>
                  {ipo.issueDetails?.listingExchange && (
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      Listing: {ipo.issueDetails.listingExchange}
                    </span>
                  )}
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusConfig.className}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                    <span>{statusConfig.label}</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
                  {ipo.name}
                </h1>

                {ipo.issueDetails?.issueType && (
                  <p className="text-xs sm:text-sm text-slate-500">
                    Issue Type: <strong className="text-slate-700 dark:text-slate-300">{ipo.issueDetails.issueType}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Live GMP Display */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-start md:items-end flex-shrink-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Live Grey Market Premium (GMP)
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-2xl sm:text-3xl font-black ${
                    isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {isPositive ? `+₹${gmpVal}` : "₹0"}
                </span>
                {gmpPct > 0 && (
                  <span className="text-xs font-extrabold px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg">
                    +{gmpPct}%
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Expected Listing:{" "}
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {ipo.gmp?.estListingText || (ipo.gmp?.expectedListingPrice ? formatINR(ipo.gmp.expectedListingPrice) : "—")}
                </strong>
              </span>

              {/* Direct Action CTAs (No Fluff) */}
              <div className="mt-3 flex items-center gap-2">
                {ipo.status === "LIVE" ? (
                  <a
                    href="https://zerodha.com/open-account"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-md transition-all"
                  >
                    <span>Apply via Zerodha</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <a
                    href={getRegistrarPortalUrl(ipo.registrar?.name, ipo.registrar?.website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-md transition-all"
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
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Price Band</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                {ipo.priceBand?.raw || (ipo.priceBand?.max ? formatINR(ipo.priceBand.max) : "TBA")}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Lot Size</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                {ipo.lotSize ? `${ipo.lotSize} Shares` : "TBA"}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Issue Size</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                {ipo.issueDetails?.issueSize || "TBA"}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Face Value</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
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
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
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
                      <td className="py-3 px-4 text-right font-extrabold text-blue-600 dark:text-blue-400">{lot.amount}</td>
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
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
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
                      <td className="py-3 px-4 text-right font-extrabold text-purple-600 dark:text-purple-400">{res.percentage}</td>
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
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
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
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-semibold">{fin.revenue || fin["Revenue"] || "—"}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{fin.expense || fin["Expense"] || "—"}</td>
                      <td className="py-3 px-4 font-extrabold text-emerald-600 dark:text-emerald-400">{fin.pat || fin["PAT"] || "—"}</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-800 dark:text-slate-200">{fin.assets || fin["Assets"] || "—"}</td>
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
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
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
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 block">{val}</span>
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
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
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
                    <span className="font-extrabold text-blue-600 dark:text-blue-400 whitespace-nowrap">{obj.amount} Cr</span>
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
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
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

        {/* About Company */}
        {ipo.aboutCompany && (
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              About {ipo.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {ipo.aboutCompany}
            </p>
          </section>
        )}

        {/* Broker CTA Card */}
        <BrokerCtaCard variant="horizontal" broker="zerodha" />

        {/* FAQ Section */}
        {ipo.faqs && ipo.faqs.length > 0 && (
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Frequently Asked Questions on {ipo.name}
            </h2>
            <div className="space-y-3 pt-2">
              {ipo.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5"
                >
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
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
