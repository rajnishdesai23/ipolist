import React from "react";
import { Metadata } from "next";
import { getSmeIpos } from "@/lib/data/ipoRepository";
import { IpoTable } from "@/components/ipo/IpoTable";
import { IpoCard } from "@/components/ipo/IpoCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LeaderboardAd } from "@/components/ads/LeaderboardAd";
import { BrokerCtaCard } from "@/components/ads/BrokerCtaCard";

export const metadata: Metadata = {
  title: "SME IPO List India: NSE & BSE SME",
  description:
    "Complete list of SME IPOs on NSE Emerge and BSE SME platforms. Check SME Grey Market Premium (GMP), minimum lot investment values, subscription multiples, and allotment dates.",
  alternates: {
    canonical: "/ipo/sme",
  },
};

export const revalidate = 60;

export default async function SmeIposPage() {
  const ipos = await getSmeIpos();

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb
        items={[
          { name: "IPOs", url: "/ipo" },
          { name: "SME IPOs", url: "/ipo/sme" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 mb-2">
            <span>NSE Emerge & BSE SME Platforms</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light sm:font-normal tracking-tight text-slate-900 dark:text-white leading-tight">
            SME IPO List (Small & Medium Enterprises)
          </h1>
        </div>

        <LeaderboardAd />

        <IpoTable ipos={ipos} initialSegment="SME" title="SME Platform Issues" showAllColumns={true} />

        <BrokerCtaCard variant="horizontal" broker="zerodha" />
      </div>
    </div>
  );
}
