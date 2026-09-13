"use client";

import React, { useState } from "react";
import { Calculator, Percent, Coins, Sparkles, TrendingUp } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LeaderboardAd } from "@/components/ads/LeaderboardAd";
import { ProfitCalculator } from "@/components/tools/ProfitCalculator";
import { AllotmentProbabilityCalc } from "@/components/tools/AllotmentProbabilityCalc";
import { HniInterestCostCalc } from "@/components/tools/HniInterestCostCalc";
import { BrokerCtaCard } from "@/components/ads/BrokerCtaCard";

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState<"profit" | "odds" | "hni">("profit");

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb items={[{ name: "Calculators & Tools", url: "/tools" }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Precision Financial Toolset</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-light sm:font-normal tracking-tight text-slate-900 dark:text-white font-heading">
            IPO Financial Calculators
          </h1>
        </div>

        <LeaderboardAd />

        {/* Calculator Navigation Switcher Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl overflow-x-auto scrollbar-none border border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("profit")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === "profit"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-md ring-1 ring-blue-500/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Profit &amp; Listing Gain</span>
          </button>

          <button
            onClick={() => setActiveTab("odds")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === "odds"
                ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-md ring-1 ring-purple-500/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Allotment Odds Probability</span>
          </button>

          <button
            onClick={() => setActiveTab("hni")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === "hni"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-md ring-1 ring-emerald-500/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>HNI Funding &amp; Interest Cost</span>
          </button>
        </div>

        {/* Active Calculator Component */}
        <div className="animate-fadeIn">
          {activeTab === "profit" && <ProfitCalculator />}
          {activeTab === "odds" && <AllotmentProbabilityCalc />}
          {activeTab === "hni" && <HniInterestCostCalc />}
        </div>

        <BrokerCtaCard variant="horizontal" broker="angelone" />
      </div>
    </div>
  );
}
