import React from "react";
import { Metadata } from "next";
import { getUpcomingIpos } from "@/lib/data/ipoRepository";
import { IpoTable } from "@/components/ipo/IpoTable";
import { IpoCard } from "@/components/ipo/IpoCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LeaderboardAd } from "@/components/ads/LeaderboardAd";
import { BrokerCtaCard } from "@/components/ads/BrokerCtaCard";

export const metadata: Metadata = {
  title: "Upcoming IPOs 2026 — Latest Upcoming IPO List with GMP & Dates",
  description:
    "Track all upcoming Mainboard and SME IPOs scheduled to open in India. Check price bands, issue sizes, tentative dates, and initial Grey Market Premium (GMP).",
};

export default async function UpcomingIposPage() {
  const upcomingIpos = await getUpcomingIpos();

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb
        items={[
          { name: "IPOs", url: "/ipo" },
          { name: "Upcoming IPOs", url: "/ipo/upcoming" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Upcoming IPOs in India (2026 Pipeline)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Stay ahead of the market with upcoming Mainboard and SME initial public offerings approved by SEBI.
          </p>
        </div>

        <LeaderboardAd />

        {/* Desktop Table */}
        <div className="hidden md:block">
          <IpoTable ipos={upcomingIpos} title="Upcoming IPO Pipeline" showAllColumns={false} />
        </div>

        {/* Mobile Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {upcomingIpos.map((ipo) => (
            <IpoCard key={ipo.id} ipo={ipo} />
          ))}
        </div>

        <BrokerCtaCard variant="horizontal" broker="groww" />
      </div>
    </div>
  );
}
