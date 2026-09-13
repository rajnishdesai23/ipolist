import React from "react";
import { Metadata } from "next";
import { Flame } from "lucide-react";
import { getAllIpos } from "@/lib/data/ipoRepository";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LeaderboardAd } from "@/components/ads/LeaderboardAd";
import { BrokerCtaCard } from "@/components/ads/BrokerCtaCard";
import { IpoGmpView } from "@/components/ipo/IpoGmpView";

export const metadata: Metadata = {
  title: "IPO GMP Today — Live Grey Market Premium for Mainboard & SME IPOs",
  description:
    "Check live IPO GMP (Grey Market Premium) today in India. Daily updated expected listing gains and historical GMP trends.",
};

export const revalidate = 60;

export default async function IpoGmpPage() {
  const ipos = await getAllIpos();

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
        </div>

        <LeaderboardAd />

        {/* Interactive GMP View Switcher (List & Grid Options) */}
        <IpoGmpView ipos={ipos} />

        <BrokerCtaCard variant="horizontal" broker="angelone" />
      </div>
    </div>
  );
}

