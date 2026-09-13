"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, Flame } from "lucide-react";
import { IPO } from "@/types/ipo";
import { formatINR, formatPercentage } from "@/lib/utils/formatters";

export function MarketTicker({ ipos }: { ipos: IPO[] }) {
  if (!ipos || ipos.length === 0) return null;

  // Double list for continuous seamless infinite marquee
  const tickerItems = [...ipos, ...ipos];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-200 text-xs py-2 overflow-hidden select-none">
      <div className="flex items-center">
        <div className="flex items-center gap-1.5 px-4 bg-slate-900 z-10 font-bold text-blue-400 border-r border-slate-800 flex-shrink-0">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span className="hidden sm:inline uppercase tracking-wider text-[11px]">Live GMP</span>
        </div>

        <div className="flex items-center gap-8 animate-ticker hover:[animation-play-state:paused] whitespace-nowrap will-change-transform">
          {tickerItems.map((ipo, idx) => {
            const gmpVal = ipo.gmp?.value ?? 0;
            const gmpPct = ipo.gmp?.percentage ?? 0;
            const isPositive = gmpVal > 0;
            return (
              <Link
                key={`${ipo.id}-${idx}`}
                href={`/ipo/${ipo.slug}`}
                className="inline-flex items-center gap-2 hover:text-white transition-colors text-xs"
              >
                <span className="font-semibold text-slate-100">{ipo.name}</span>
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-bold ${
                    isPositive
                      ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/50"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  <TrendingUp className="w-3 h-3" />
                  {formatINR(gmpVal)} ({formatPercentage(gmpPct)})
                </span>
                <span className="text-slate-600">•</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
