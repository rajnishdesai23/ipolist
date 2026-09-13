import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { getAllIpos } from "@/lib/data/ipoRepository";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LeaderboardAd } from "@/components/ads/LeaderboardAd";
import { BrokerCtaCard } from "@/components/ads/BrokerCtaCard";

export const metadata: Metadata = {
  title: "IPO Calendar 2026 — Schedule of Open, Close, Allotment & Listing Dates",
  description:
    "Interactive IPO calendar timeline in India. Track open dates, close dates, basis of allotment, and listing schedules for all upcoming Mainboard & SME IPOs.",
};

export const revalidate = 60;

export default async function IpoCalendarPage() {
  const ipos = await getAllIpos();

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb items={[{ name: "IPO Calendar", url: "/ipo-calendar" }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>2026 IPO Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
            IPO Calendar & Timeline Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Never miss an IPO closing or listing date. Key chronological timeline for all Indian public offerings.
          </p>
        </div>

        <LeaderboardAd />

        {/* Timeline Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ipos.map((ipo) => {
            const gmpPct = ipo.gmp?.percentage ?? 0;
            return (
              <div
                key={ipo.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {ipo.type}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      GMP: {gmpPct > 0 ? `+${gmpPct}%` : "0%"}
                    </span>
                  </div>

                  <Link
                    href={`/ipo/${ipo.slug}`}
                    className="font-bold text-base text-slate-900 dark:text-white hover:text-blue-600 transition-colors line-clamp-1 block"
                  >
                    {ipo.name}
                  </Link>

                  {/* Dates Timeline */}
                  <div className="space-y-2 mt-4 text-xs">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-slate-500 font-medium">Bidding Opens:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {ipo.dates?.open || "TBA"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-slate-500 font-medium">Bidding Closes:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {ipo.dates?.close || "TBA"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-slate-500 font-medium">Allotment Date:</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {ipo.dates?.allotment || "TBA"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-slate-500 font-medium">Exchange Listing:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {ipo.dates?.listing || "TBA"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href={`/ipo/${ipo.slug}`}
                    className="w-full bg-slate-900 hover:bg-blue-600 text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View IPO Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <BrokerCtaCard variant="horizontal" broker="upstox" />
      </div>
    </div>
  );
}
