import React from "react";
import { Metadata } from "next";
import { getLiveIpos } from "@/lib/data/ipoRepository";
import { IpoTable } from "@/components/ipo/IpoTable";
import { IpoCard } from "@/components/ipo/IpoCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LeaderboardAd } from "@/components/ads/LeaderboardAd";
import { BrokerCtaCard } from "@/components/ads/BrokerCtaCard";

export const metadata: Metadata = {
  title: "Open IPOs Today: Live Bidding Issues",
  description:
    "Check all IPOs currently open for subscription today. Live bidding multiple, Grey Market Premium (GMP), minimum lot investment, and closing dates.",
  alternates: {
    canonical: "/ipo/current",
  },
};

export const revalidate = 60;

export default async function CurrentIposPage() {
  const liveIpos = await getLiveIpos();

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb
        items={[
          { name: "IPOs", url: "/ipo" },
          { name: "Current Open IPOs", url: "/ipo/current" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Active Bidding Period</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Open IPOs Today in India
          </h1>
        </div>

        <LeaderboardAd />

        {liveIpos.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-card">
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
              No IPOs currently open today
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Check the upcoming IPO calendar pipeline for issues opening later this week.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <IpoTable ipos={liveIpos} title="Active IPOs Open for Subscription" showAllColumns={true} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
              {liveIpos.map((ipo) => (
                <IpoCard key={ipo.id} ipo={ipo} />
              ))}
            </div>
          </>
        )}

        <BrokerCtaCard variant="horizontal" broker="zerodha" />
      </div>
    </div>
  );
}
