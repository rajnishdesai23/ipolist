import React from "react";
import { TrendingUp, TrendingDown, Minus, Flame } from "lucide-react";
import { formatINR, formatPercentage } from "@/lib/utils/formatters";

interface GmpTrendBadgeProps {
  value: number;
  percentage: number;
  movement?: "UP" | "DOWN" | "STABLE";
  fireRating?: number;
  size?: "sm" | "md" | "lg";
}

export function GmpTrendBadge({
  value,
  percentage,
  movement = "UP",
  fireRating,
  size = "md",
}: GmpTrendBadgeProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3.5 py-1.5 font-extrabold",
  }[size];

  const colorClasses = isPositive
    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
    : isNegative
    ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
    : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      <div
        className={`inline-flex items-center gap-1 font-bold rounded-lg border shadow-sm ${sizeClasses} ${colorClasses}`}
      >
        {movement === "UP" ? (
          <TrendingUp className="w-3.5 h-3.5" />
        ) : movement === "DOWN" ? (
          <TrendingDown className="w-3.5 h-3.5" />
        ) : (
          <Minus className="w-3.5 h-3.5" />
        )}
        <span>{formatINR(value)}</span>
        <span className="opacity-80">({formatPercentage(percentage)})</span>
      </div>

      {fireRating && fireRating >= 4 && (
        <span
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[10px] font-bold"
          title={`High Demand Rating: ${fireRating}/5`}
        >
          <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
          Hot
        </span>
      )}
    </div>
  );
}
