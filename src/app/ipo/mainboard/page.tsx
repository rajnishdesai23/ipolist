import React from "react";
import { Metadata } from "next";
import { getMainboardIpos } from "@/lib/data/ipoRepository";
import { IpoTable } from "@/components/ipo/IpoTable";
import { IpoCard } from "@/components/ipo/IpoCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LeaderboardAd } from "@/components/ads/LeaderboardAd";
import { BrokerCtaCard } from "@/components/ads/BrokerCtaCard";

export const metadata: Metadata = {
  title: "Mainboard IPO List India | Live GMP, Reviews & Dates",
  description:
    "Check all Mainboard IPOs listing on NSE & BSE. Compare price bands, issue sizes, GMP trends, retail quotas, and basis of allotment.",
};

export const revalidate = 60;

export default async function MainboardIposPage() {
  const ipos = await getMainboardIpos();

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb
        items={[
          { name: "IPOs", url: "/ipo" },
          { name: "Mainboard IPOs", url: "/ipo/mainboard" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light sm:font-normal tracking-tight text-slate-900 dark:text-white leading-tight">
            Mainboard IPOs (NSE & BSE)
          </h1>
        </div>

        <LeaderboardAd />

        <IpoTable ipos={ipos} initialSegment="MAINBOARD" title="Mainboard Issues" showAllColumns={true} />

        <BrokerCtaCard variant="horizontal" broker="upstox" />
      </div>
    </div>
  );
}
