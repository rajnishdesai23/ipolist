import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, ArrowRight, Award } from "lucide-react";
import { getAllIpos } from "@/lib/data/ipoRepository";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LeaderboardAd } from "@/components/ads/LeaderboardAd";
import { BrokerCtaCard } from "@/components/ads/BrokerCtaCard";
import { formatINR } from "@/lib/utils/formatters";

export const metadata: Metadata = {
  title: "IPO Listing Performance Tracker — Gain & Listing Price Analysis",
  description:
    "Track historical IPO listing gains, opening prices, current market performance, and return on investment for Mainboard & SME issues.",
};

export const revalidate = 60;

export default async function IpoPerformancePage() {
  const ipos = await getAllIpos();
  const closedIpos = ipos.filter((i) => i.status === "CLOSED");

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb items={[{ name: "IPO Performance Tracker", url: "/ipo-performance" }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 mb-2">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Listing Gain & ROI Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
            IPO Listing Performance & Returns
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Track historical IPO listing gains, estimated returns, and performance metrics for all closed Mainboard & SME offerings.
          </p>
        </div>

        <LeaderboardAd />

        {/* Performance Table */}
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3.5 px-4">IPO Name</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Issue Price</th>
                  <th className="py-3.5 px-4">Expected Listing</th>
                  <th className="py-3.5 px-4">Listing Date</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {closedIpos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                      No closed IPOs recorded yet.
                    </td>
                  </tr>
                ) : (
                  closedIpos.map((ipo) => (
                    <tr key={ipo.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                        <Link href={`/ipo/${ipo.slug}`} className="hover:text-blue-600">
                          {ipo.name}
                        </Link>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-500">{ipo.type}</td>
                      <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {ipo.priceBand?.raw || formatINR(ipo.priceBand?.max || 0)}
                      </td>
                      <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        {ipo.gmp?.estListingText || (ipo.gmp?.expectedListingPrice ? formatINR(ipo.gmp.expectedListingPrice) : "—")}
                      </td>
                      <td className="py-4 px-4 text-slate-500">
                        {ipo.dates?.listing || ipo.dates?.rawRange || "TBA"}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/ipo/${ipo.slug}`}
                          className="inline-flex items-center gap-1 bg-slate-900 hover:bg-blue-600 text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <span>View</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <BrokerCtaCard variant="horizontal" broker="upstox" />
      </div>
    </div>
  );
}
