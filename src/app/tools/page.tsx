import React from "react";
import { Metadata } from "next";
import { Calculator, Percent, Coins, Sparkles } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LeaderboardAd } from "@/components/ads/LeaderboardAd";
import { ProfitCalculator } from "@/components/tools/ProfitCalculator";
import { AllotmentProbabilityCalc } from "@/components/tools/AllotmentProbabilityCalc";
import { HniInterestCostCalc } from "@/components/tools/HniInterestCostCalc";
import { BrokerCtaCard } from "@/components/ads/BrokerCtaCard";

export const metadata: Metadata = {
  title: "IPO Financial Calculators — Profit Estimator, Allotment Odds & HNI Cost",
  description:
    "Interactive financial calculators for IPO investors in India. Calculate estimated listing gain profit, lottery allotment probability, and leveraged HNI funding interest costs.",
};

export default function ToolsPage() {
  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb items={[{ name: "Calculators & Tools", url: "/tools" }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Financial Toolset</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
            IPO Financial Calculators
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Precision mathematical tools to compute your expected listing profits, allotment odds, and leveraged borrowing costs before placing your bids.
          </p>
        </div>

        <LeaderboardAd />

        {/* Calculator 1: Profit Estimator */}
        <section id="profit-calc">
          <ProfitCalculator />
        </section>

        {/* Calculator 2: Allotment Odds Probability */}
        <section id="odds-calc">
          <AllotmentProbabilityCalc />
        </section>

        {/* Calculator 3: HNI Interest Cost */}
        <section id="hni-calc">
          <HniInterestCostCalc />
        </section>

        <BrokerCtaCard variant="horizontal" broker="angelone" />
      </div>
    </div>
  );
}
