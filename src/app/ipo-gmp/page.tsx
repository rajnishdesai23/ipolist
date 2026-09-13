import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Flame, TrendingUp, ShieldAlert, ArrowRight } from "lucide-react";
import { getAllIpos } from "@/lib/data/ipoRepository";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LeaderboardAd } from "@/components/ads/LeaderboardAd";
import { BrokerCtaCard } from "@/components/ads/BrokerCtaCard";
import { formatINR, formatPercentage } from "@/lib/utils/formatters";

export const metadata: Metadata = {
  title: "IPO GMP Today — Live Grey Market Premium for Mainboard & SME IPOs",
  description:
    "Check live IPO GMP (Grey Market Premium) today in India. Daily updated expected listing gains and historical GMP trends.",
};

export const revalidate = 60;

export default async function IpoGmpPage() {
  const ipos = await getAllIpos();
  // Filter and sort by highest GMP percentage
  const sortedByGmp = [...ipos].sort((a, b) => (b.gmp?.percentage || 0) - (a.gmp?.percentage || 0));

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb items={[{ name: "IPO GMP Today", url: "/ipo-gmp" }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 mb-2">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Updated Hourly from Live Market Data</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
            IPO GMP Today (Grey Market Premium Live)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Real-time Grey Market Premium rates, estimated listing gains, and status for all Mainboard & SME IPOs in India.
          </p>
        </div>

        <LeaderboardAd />

        {/* Disclaimer Banner */}
        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-[11px] leading-relaxed">
            <span className="font-bold block">Grey Market Disclaimer:</span>
            <p>
              GMP prices are purely indicative rates circulating in over-the-counter markets. They do not constitute official financial advisory or guaranteed listing prices.
            </p>
          </div>
        </div>

        {/* Comprehensive GMP Table */}
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3.5 px-4">IPO Name & Type</th>
                  <th className="py-3.5 px-4">Issue Price</th>
                  <th className="py-3.5 px-4">GMP Today</th>
                  <th className="py-3.5 px-4">Expected Listing</th>
                  <th className="py-3.5 px-4">Est. Gain %</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sortedByGmp.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                      No IPOs currently in the tracker.
                    </td>
                  </tr>
                ) : (
                  sortedByGmp.map((ipo) => {
                    const gmpVal = ipo.gmp?.value ?? 0;
                    const gmpPct = ipo.gmp?.percentage ?? 0;
                    const isPositive = gmpVal > 0;

                    return (
                      <tr
                        key={ipo.id}
                        className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors group"
                      >
                        <td className="py-4 px-4">
                          <Link
                            href={`/ipo/${ipo.slug}`}
                            className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors block"
                          >
                            {ipo.name}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {ipo.type} {ipo.issueDetails?.listingExchange ? `• ${ipo.issueDetails.listingExchange}` : ""}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          {ipo.priceBand?.raw || formatINR(ipo.priceBand?.max || 0)}
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded font-extrabold text-xs ${
                              isPositive
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {isPositive ? `+₹${gmpVal}` : "₹0"}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                          {ipo.gmp?.estListingText || (ipo.gmp?.expectedListingPrice ? formatINR(ipo.gmp.expectedListingPrice) : "—")}
                        </td>

                        <td className="py-4 px-4 font-extrabold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                          {gmpPct > 0 ? `+${gmpPct}%` : "0%"}
                        </td>

                        <td className="py-4 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                          {ipo.dates?.rawRange || (ipo.dates?.open ? `${ipo.dates.open} – ${ipo.dates.close || ""}` : "TBA")}
                        </td>

                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <Link
                            href={`/ipo/${ipo.slug}`}
                            className="inline-flex items-center gap-1 bg-slate-900 hover:bg-blue-600 text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <span>Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <BrokerCtaCard variant="horizontal" broker="angelone" />
      </div>
    </div>
  );
}
