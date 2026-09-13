"use client";

import React, { useState } from "react";
import { Calculator, TrendingUp, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { formatINR, formatPercentage } from "@/lib/utils/formatters";

interface ProfitCalculatorProps {
  initialIssuePrice?: number;
  initialGmp?: number;
  initialLotSize?: number;
  ipoName?: string;
}

export function ProfitCalculator({
  initialIssuePrice = 100,
  initialGmp = 25,
  initialLotSize = 150,
  ipoName,
}: ProfitCalculatorProps = {}) {
  const [issuePrice, setIssuePrice] = useState<number>(initialIssuePrice);
  const [gmp, setGmp] = useState<number>(initialGmp);
  const [lotSize, setLotSize] = useState<number>(initialLotSize);
  const [lotsApplied, setLotsApplied] = useState<number>(1);

  // Derived Calculations
  const totalShares = lotSize * lotsApplied;
  const totalInvestment = issuePrice * totalShares;
  const estimatedGmpGain = gmp * totalShares;
  const expectedListingPrice = issuePrice + gmp;
  const expectedGainPercent = issuePrice > 0 ? (gmp / issuePrice) * 100 : 0;

  // Preset Handlers for Instant Use
  const applyPreset = (type: "RETAIL" | "SME" | "HNI_SMALL" | "HNI_BIG") => {
    switch (type) {
      case "RETAIL":
        setIssuePrice(100);
        setGmp(25);
        setLotSize(150);
        setLotsApplied(1);
        break;
      case "SME":
        setIssuePrice(140);
        setGmp(35);
        setLotSize(1000);
        setLotsApplied(1);
        break;
      case "HNI_SMALL":
        setIssuePrice(100);
        setGmp(25);
        setLotSize(150);
        setLotsApplied(14);
        break;
      case "HNI_BIG":
        setIssuePrice(100);
        setGmp(25);
        setLotSize(150);
        setLotsApplied(67);
        break;
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-normal sm:font-medium text-slate-900 dark:text-white font-heading">
              {ipoName ? `${ipoName} Expected Profit & Gain Calculator` : "IPO Profit & Listing Gain Calculator"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {ipoName
                ? `Estimate your return on ${ipoName} based on Price Band, live GMP & lot applications`
                : "Estimate your expected profit based on Issue Price, GMP, Lot Size & Lots Applied"}
            </p>
          </div>
        </div>

        {/* Quick Preset Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => applyPreset("RETAIL")}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 transition-colors whitespace-nowrap"
          >
            Retail 1 Lot (₹15k)
          </button>
          <button
            onClick={() => applyPreset("SME")}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300 transition-colors whitespace-nowrap"
          >
            SME Issue (₹1.4L)
          </button>
          <button
            onClick={() => applyPreset("HNI_SMALL")}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 transition-colors whitespace-nowrap"
          >
            sHNI (₹2L+)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Inputs Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Issue Price Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-medium text-slate-700 dark:text-slate-300">
              <label>Issue Price (Cut-off Price)</label>
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{formatINR(issuePrice)}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="10"
                max="2000"
                step="5"
                value={issuePrice}
                onChange={(e) => setIssuePrice(Number(e.target.value))}
                className="flex-1 accent-blue-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <input
                type="number"
                value={issuePrice}
                onChange={(e) => setIssuePrice(Math.max(1, Number(e.target.value)))}
                className="w-24 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              />
            </div>
          </div>

          {/* Grey Market Premium (GMP) Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-medium text-slate-700 dark:text-slate-300">
              <label>Grey Market Premium (GMP)</label>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">{formatINR(gmp)}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1500"
                step="1"
                value={gmp}
                onChange={(e) => setGmp(Number(e.target.value))}
                className="flex-1 accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <input
                type="number"
                value={gmp}
                onChange={(e) => setGmp(Math.max(0, Number(e.target.value)))}
                className="w-24 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
              />
            </div>
          </div>

          {/* Lot Size & Lots Applied Inputs */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                Lot Size (Shares)
              </label>
              <input
                type="number"
                value={lotSize}
                onChange={(e) => setLotSize(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                Lots Applied
              </label>
              <input
                type="number"
                value={lotsApplied}
                onChange={(e) => setLotsApplied(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Right Output Results Card (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Gain Pill Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Expected Listing Return
              </span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold px-3 py-1 rounded-full">
                {formatPercentage(expectedGainPercent)}
              </span>
            </div>

            {/* Net Profit Metric */}
            <div>
              <span className="text-xs text-slate-400 font-medium block mb-1">Estimated Net Profit</span>
              <div className="text-3xl sm:text-4xl font-light sm:font-normal text-emerald-400 flex items-center gap-1.5">
                <TrendingUp className="w-8 h-8 flex-shrink-0" />
                <span>{formatINR(estimatedGmpGain)}</span>
              </div>
            </div>

            {/* Total Investment & Expected Listing Price Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-medium block mb-0.5">
                  Total Investment
                </span>
                <span className="font-semibold text-white text-sm sm:text-base">
                  {formatINR(totalInvestment)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                  {totalShares} total shares
                </span>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-medium block mb-0.5">
                  Exp. Listing Price
                </span>
                <span className="font-semibold text-white text-sm sm:text-base">
                  {formatINR(expectedListingPrice)}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5 font-semibold">
                  +₹{gmp} premium
                </span>
              </div>
            </div>
          </div>

          {/* Clean Formula Note */}
          <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>
              Formula: Net Profit = GMP × Lot Size × Number of Lots
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
