"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { IPO } from "@/types/ipo";
import { formatINR } from "@/lib/utils/formatters";
import { getStatusBadgeConfig } from "@/lib/utils/status";

import { IpoLogo } from "@/components/ui/IpoLogo";

export function IpoCard({ ipo }: { ipo: IPO }) {
  const statusConfig = getStatusBadgeConfig(ipo.status);
  const isSme = ipo.type === "SME";
  const gmpVal = ipo.gmp?.value ?? 0;
  const gmpPct = ipo.gmp?.percentage ?? 0;
  const isPositive = gmpVal > 0;

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between overflow-hidden">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isSme
                  ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
                  : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
              }`}
            >
              {ipo.type}
            </span>
            {ipo.issueDetails?.listingExchange && (
              <span className="text-[10px] text-slate-400 font-medium">
                {ipo.issueDetails.listingExchange}
              </span>
            )}
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusConfig.className}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
            <span>{statusConfig.label}</span>
          </div>
        </div>

        {/* Company Title & Logo */}
        <div className="flex items-start gap-3 my-1">
          <IpoLogo name={ipo.name} logoUrl={ipo.logoUrl} size="md" />
          <div className="min-w-0 flex-1">
            <Link href={`/ipo/${ipo.slug}`} className="block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight line-clamp-1">
                {ipo.name}
              </h3>
            </Link>
            {ipo.issueDetails?.issueType && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {ipo.issueDetails.issueType}
              </p>
            )}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Price Band
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {ipo.priceBand?.raw || (ipo.priceBand?.max ? formatINR(ipo.priceBand.max) : "TBA")}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Lot Size
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {ipo.lotSize ? `${ipo.lotSize} shares` : "TBA"}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Issue Size
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {ipo.issueDetails?.issueSize || "TBA"}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Est. Listing / Gain
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {ipo.gmp?.estListingText || (ipo.gmp?.expectedListingPrice ? formatINR(ipo.gmp.expectedListingPrice) : "—")}
            </span>
          </div>
        </div>

        {/* Live GMP Bar */}
        <div className="flex items-center justify-between gap-2 mb-3 px-1">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            Live GMP:
          </span>
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold border ${
              isPositive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
            }`}
          >
            <span>{isPositive ? `+₹${gmpVal}` : "₹0"}</span>
            {gmpPct > 0 && <span className="text-[10px] font-bold opacity-80">({gmpPct}%)</span>}
          </div>
        </div>
      </div>

      {/* Footer Action CTAs */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="truncate">
            {ipo.dates?.rawRange || (ipo.dates?.open ? `${ipo.dates.open} – ${ipo.dates.close || ""}` : "Dates TBA")}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {ipo.status === "LIVE" ? (
            <a
              href="https://zerodha.com/open-account"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-2.5 py-1.5 rounded-lg transition-colors shadow-sm"
            >
              <span>Apply</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          ) : (
            <Link
              href={`/ipo/${ipo.slug}`}
              className="inline-flex items-center gap-1 bg-slate-900 hover:bg-blue-600 text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
