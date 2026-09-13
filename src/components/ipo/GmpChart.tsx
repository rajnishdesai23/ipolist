"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { GMPHistoryItem } from "@/types/ipo";
import { formatINR } from "@/lib/utils/formatters";

interface GmpChartProps {
  history: GMPHistoryItem[];
  ipoName: string;
}

export function GmpChart({ history, ipoName }: GmpChartProps) {
  // Sort chronological for left-to-right chart
  const chartData = [...history]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((item) => ({
      date: item.displayDate || item.date,
      gmp: item.gmp,
      expectedPrice: item.expectedListingPrice,
      percentage: item.percentage,
    }));

  if (chartData.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
        GMP history will populate as updates are recorded.
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            {ipoName} GMP Trend Movement
          </h4>
          <p className="text-[11px] text-slate-500">
            Historical day-wise Grey Market Premium progression
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            GMP (₹)
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gmpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-800 space-y-1">
                      <p className="font-bold text-slate-300">{data.date}</p>
                      <p className="text-emerald-400 font-extrabold text-sm">
                        GMP: {formatINR(data.gmp)} (+{data.percentage}%)
                      </p>
                      <p className="text-slate-400 text-[11px]">
                        Exp. Listing Price: {formatINR(data.expectedPrice)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="gmp"
              stroke="#2563EB"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#gmpGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
