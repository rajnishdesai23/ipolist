import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Users, Clock, ArrowRight } from "lucide-react";
import { getAllIpos } from "@/lib/data/ipoRepository";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LeaderboardAd } from "@/components/ads/LeaderboardAd";
import { BrokerCtaCard } from "@/components/ads/BrokerCtaCard";
import { getStatusBadgeConfig } from "@/lib/utils/status";

export const metadata: Metadata = {
  title: "Live IPO Subscription Status Today | Category-wise Bidding Details",
  description:
    "Check live IPO subscription status today in India. Category-wise bidding details for Retail, NII/HNI, and QIB institutional investors.",
};

export const revalidate = 60;

export default async function IpoSubscriptionPage() {
  const ipos = await getAllIpos();
  const liveIpos = ipos.filter((i) => i.status === "LIVE");
  const otherIpos = ipos.filter((i) => i.status !== "LIVE");

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb items={[{ name: "IPO Subscription Status", url: "/ipo-subscription" }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 mb-2">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Category-wise Bidding Details</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
            Live IPO Subscription Status Today
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Real-time subscription figures updated throughout the bidding hours from NSE and BSE bidding engines.
          </p>
        </div>

        <LeaderboardAd />

        {/* Live IPO Subscription Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Live Active IPOs Bidding Today</span>
            </h2>
          </div>

          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3.5 px-4">IPO Name</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Price Band</th>
                    <th className="py-3.5 px-4">Dates</th>
                    <th className="py-3.5 px-4 text-right">View Bidding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {liveIpos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                        No IPOs currently in LIVE bidding stage today. Check upcoming IPOs below.
                      </td>
                    </tr>
                  ) : (
                    liveIpos.map((ipo) => (
                      <tr key={ipo.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                          <Link href={`/ipo/${ipo.slug}`} className="hover:text-blue-600">
                            {ipo.name}
                          </Link>
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-500">{ipo.type}</td>
                        <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          {ipo.priceBand?.raw || "TBA"}
                        </td>
                        <td className="py-4 px-4 text-slate-500">
                          {ipo.dates?.rawRange || (ipo.dates?.open ? `${ipo.dates.open} – ${ipo.dates.close || ""}` : "TBA")}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link
                            href={`/ipo/${ipo.slug}`}
                            className="inline-flex items-center gap-1 bg-slate-900 hover:bg-blue-600 text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <span>Details</span>
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
        </div>

        {/* All IPOs Directory */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Other IPOs Subscription & Reservation Portions
          </h2>
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3.5 px-4">IPO Name</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Issue Size</th>
                    <th className="py-3.5 px-4">Dates</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {otherIpos.map((ipo) => {
                    const statusConfig = getStatusBadgeConfig(ipo.status);
                    return (
                      <tr key={ipo.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                          <Link href={`/ipo/${ipo.slug}`} className="hover:text-blue-600">
                            {ipo.name}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.className}`}>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          {ipo.issueDetails?.issueSize || "TBA"}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {ipo.dates?.rawRange || (ipo.dates?.open ? `${ipo.dates.open} – ${ipo.dates.close || ""}` : "TBA")}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/ipo/${ipo.slug}`}
                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                          >
                            <span>View</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <BrokerCtaCard variant="horizontal" broker="zerodha" />
      </div>
    </div>
  );
}
