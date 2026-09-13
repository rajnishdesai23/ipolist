"use client";

import React, { useState } from "react";
import { Calculator, TrendingUp, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { formatINR, formatPercentage } from "@/lib/utils/formatters";

export function ProfitCalculator() {
  const [issuePrice, setIssuePrice] = useState<number>(100);
  const [gmp, setGmp] = useState<number>(25);
  const [lotSize, setLotSize] = useState<number>(150);
  const [lotsApplied, setLotsApplied] = useState<number>(1);

  const totalShares = lotSize * lotsApplied;
  const totalInvestment = issuePrice * totalShares;
  const estimatedGmpGain = gmp * totalShares;
  const expectedListingPrice = issuePrice + gmp;
  const expectedGainPercent = issuePrice > 0 ? (gmp / issuePrice) * 100 : 0;
  const totalEstimatedValue = totalInvestment + estimatedGmpGain;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            IPO Profit & Listing Gain Calculator
          </h3>
          <p className="text-xs text-slate-500">
            Calculate your estimated returns based on GMP and lots applied
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Sliders & Fields */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Issue Price (Cut-off Price)</span>
              <span className="text-blue-600 dark:text-blue-400 font-extrabold">{formatINR(issuePrice)}</span>
            </div>
            <input
              type="range"
              min="10"
              max="2000"
              step="5"
              value={issuePrice}
              onChange={(e) => setIssuePrice(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Grey Market Premium (GMP)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{formatINR(gmp)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1500"
              step="2"
              value={gmp}
              onChange={(e) => setGmp(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Lot Size (Shares)
              </label>
              <input
                type="number"
                value={lotSize}
                onChange={(e) => setLotSize(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Lots Applied
              </label>
              <input
                type="number"
                value={lotsApplied}
                onChange={(e) => setLotsApplied(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Expected Listing Gain
              </span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                {formatPercentage(expectedGainPercent)}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">Estimated Net Profit</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-7 h-7" />
                <span>{formatINR(estimatedGmpGain)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-slate-800/60 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Total Investment</span>
                <span className="font-bold text-white text-sm">{formatINR(totalInvestment)}</span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Exp. Listing Price</span>
                <span className="font-bold text-white text-sm">{formatINR(expectedListingPrice)}</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mt-4 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            Formula: Estimated Profit = GMP × Lot Size × Number of Lots
          </p>
        </div>
      </div>
    </div>
  );
}
