"use client";

import React, { useState } from "react";
import { Coins, AlertTriangle, ShieldCheck } from "lucide-react";
import { formatINR } from "@/lib/utils/formatters";

export function HniInterestCostCalc() {
  const [borrowedAmountLakhs, setBorrowedAmountLakhs] = useState<number>(10);
  const [interestRatePercent, setInterestRatePercent] = useState<number>(9.5);
  const [fundingDays, setFundingDays] = useState<number>(7);
  const [allottedShares, setAllottedShares] = useState<number>(200);

  const borrowedRupees = borrowedAmountLakhs * 100000;
  const totalInterestCost = (borrowedRupees * (interestRatePercent / 100) * fundingDays) / 365;
  const breakEvenGmpPerShare = allottedShares > 0 ? totalInterestCost / allottedShares : 0;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-600/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <Coins className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            HNI IPO Funding Interest & Break-Even Calculator
          </h3>
          <p className="text-xs text-slate-500">
            Compute the funding cost for leveraged NBFC applications and required break-even listing gain
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Funded / Borrowed Capital</span>
              <span className="text-amber-600 dark:text-amber-400 font-extrabold">₹{borrowedAmountLakhs} Lakhs</span>
            </div>
            <input
              type="range"
              min="2"
              max="100"
              step="1"
              value={borrowedAmountLakhs}
              onChange={(e) => setBorrowedAmountLakhs(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Annual Interest Rate (%)</span>
              <span className="text-blue-600 dark:text-blue-400 font-extrabold">{interestRatePercent}% p.a.</span>
            </div>
            <input
              type="range"
              min="6"
              max="16"
              step="0.25"
              value={interestRatePercent}
              onChange={(e) => setInterestRatePercent(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Funding Block Period (Days)
              </label>
              <input
                type="number"
                value={fundingDays}
                onChange={(e) => setFundingDays(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Expected Allotted Shares
              </label>
              <input
                type="number"
                value={allottedShares}
                onChange={(e) => setAllottedShares(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Break-Even GMP Required Per Share
            </span>

            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">
              {formatINR(breakEvenGmpPerShare)} / share
            </div>

            <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Total Interest Outgo:</span>
                <span className="font-bold text-rose-400">{formatINR(totalInterestCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Capital Bidded:</span>
                <span className="font-bold text-white">{formatINR(borrowedRupees)}</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mt-4 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Listing gain must exceed {formatINR(breakEvenGmpPerShare)} per share to cover funding interest costs.
          </p>
        </div>
      </div>
    </div>
  );
}
