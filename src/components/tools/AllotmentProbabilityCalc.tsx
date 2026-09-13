"use client";

import React, { useState } from "react";
import { Percent, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export function AllotmentProbabilityCalc() {
  const [subscriptionMultiple, setSubscriptionMultiple] = useState<number>(8.5);
  const [dematAccounts, setDematAccounts] = useState<number>(2);

  // Probability per application = 1 / subscriptionMultiple
  const singleProb = subscriptionMultiple > 0 ? Math.min(1, 1 / subscriptionMultiple) : 1;
  // Probability of at least 1 allotment with N independent family accounts = 1 - (1 - p)^N
  const combinedProb = (1 - Math.pow(1 - singleProb, dematAccounts)) * 100;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-600/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
          <Percent className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Retail Allotment Probability Estimator
          </h3>
          <p className="text-xs text-slate-500">
            Estimate your lottery odds based on subscription demand and family Demat accounts
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Retail Subscription Multiple (Times)</span>
              <span className="text-purple-600 dark:text-purple-400 font-extrabold">{subscriptionMultiple}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="0.5"
              value={subscriptionMultiple}
              onChange={(e) => setSubscriptionMultiple(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Number of Unique Family Demat Accounts</span>
              <span className="text-blue-600 dark:text-blue-400 font-extrabold">{dematAccounts} Account(s)</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={dematAccounts}
              onChange={(e) => setDematAccounts(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Pro Tip to Boost Chances:
            </div>
            <p className="text-[11px]">
              In oversubscribed retail quotas, allotment is determined via pure lottery. Applying 1 lot across 3 separate PAN accounts yields ~3x higher probability than applying 3 lots from a single PAN!
            </p>
          </div>
        </div>

        {/* Output */}
        <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Estimated Allotment Chance
            </span>

            <div className="text-4xl sm:text-5xl font-extrabold text-purple-300">
              {combinedProb.toFixed(1)}%
            </div>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span>Single Demat Account Odds:</span>
                <span className="font-bold text-white">{(singleProb * 100).toFixed(1)}% (1 in {Math.round(subscriptionMultiple)})</span>
              </div>
              <div className="flex justify-between">
                <span>Combined Probability ({dematAccounts} Accounts):</span>
                <span className="font-bold text-emerald-400">{combinedProb.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mt-4 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
            Based on SEBI proportionate lottery rules for retail individual category
          </p>
        </div>
      </div>
    </div>
  );
}
