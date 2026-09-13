"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { LayoutGrid, TableProperties, ArrowRight, Download, Search, TrendingUp, X } from "lucide-react";
import { IPO } from "@/types/ipo";
import { formatINR } from "@/lib/utils/formatters";
import { IpoLogo } from "@/components/ui/IpoLogo";
import { GmpTrendBadge } from "@/components/ipo/GmpTrendBadge";

interface IpoGmpViewProps {
  ipos: IPO[];
}

export function IpoGmpView({ ipos }: IpoGmpViewProps) {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "MAINBOARD" | "SME">("ALL");

  // Sort by highest GMP percentage
  const sortedIpos = useMemo(() => {
    return [...ipos].sort((a, b) => (b.gmp?.percentage || 0) - (a.gmp?.percentage || 0));
  }, [ipos]);

  // Filtered by search and type
  const filteredIpos = useMemo(() => {
    return sortedIpos.filter((ipo) => {
      const matchesQuery =
        ipo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ipo.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ipo.symbol ? ipo.symbol.toLowerCase().includes(searchQuery.toLowerCase()) : false);
      const matchesType =
        filterType === "ALL" ||
        (filterType === "MAINBOARD" && ipo.type === "MAINBOARD") ||
        (filterType === "SME" && ipo.type === "SME");
      return matchesQuery && matchesType;
    });
  }, [sortedIpos, searchQuery, filterType]);

  // CSV Downloader
  const downloadCsv = () => {
    const headers = ["IPO Name", "Type", "Issue Price", "GMP Today", "Expected Listing", "Est Gain %", "Dates"];
    const rows = filteredIpos.map((i) => [
      `"${i.name}"`,
      i.type,
      `"${i.priceBand?.raw || formatINR(i.priceBand?.max || 0)}"`,
      `"₹${i.gmp?.value ?? 0}"`,
      `"${i.gmp?.estListingText || (i.gmp?.expectedListingPrice ? formatINR(i.gmp.expectedListingPrice) : "TBA")}"`,
      `"${i.gmp?.percentage ?? 0}%"`,
      `"${(i.dates?.rawRange || (i.dates?.open ? `${i.dates.open} to ${i.dates.close || ""}` : "TBA")).replace(/[–—]/g, " to ")}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ipo_gmp_live_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md -mx-4 px-4 py-3 border-y border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left: Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search IPO name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Type Filters & View Mode */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {/* Segment Filter (Mainboard / SME) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setFilterType("ALL")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filterType === "ALL"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
            >
              All ({ipos.length})
            </button>
            <button
              onClick={() => setFilterType("MAINBOARD")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filterType === "MAINBOARD"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
            >
              Mainboard
            </button>
            <button
              onClick={() => setFilterType("SME")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filterType === "SME"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
            >
              SME
            </button>
          </div>

          {/* View Switcher (Cards vs Table) */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "cards"
                  ? "bg-white dark:bg-slate-900 text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-900 text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Table View"
            >
              <TableProperties className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Download CSV Button */}
          <button
            onClick={downloadCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all shrink-0"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: TABLE VIEW */}
      {viewMode === "table" && (
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3.5 px-4">IPO Name</th>
                  <th className="py-3.5 px-4">Issue Price</th>
                  <th className="py-3.5 px-4">GMP Today</th>
                  <th className="py-3.5 px-4">Est. Listing</th>
                  <th className="py-3.5 px-4">Est. Gain %</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredIpos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                      No IPOs match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredIpos.map((ipo) => {
                    const gmpVal = ipo.gmp?.value ?? 0;
                    const gmpPct = ipo.gmp?.percentage ?? 0;
                    const isPositive = gmpVal > 0;
                    const isNegative = gmpVal < 0;

                    return (
                      <tr
                        key={ipo.id}
                        className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors group"
                      >
                        <td className="py-4 px-4">
                          <Link
                            href={`/ipo/${ipo.slug}`}
                            className="font-normal sm:font-medium text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors block"
                          >
                            {ipo.name}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {ipo.type} {ipo.issueDetails?.listingExchange ? `• ${ipo.issueDetails.listingExchange}` : ""}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-normal text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          {ipo.priceBand?.raw || formatINR(ipo.priceBand?.max || 0)}
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded font-medium text-xs ${
                              isPositive
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : isNegative
                                ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {isPositive ? `+₹${gmpVal}` : isNegative ? `-₹${Math.abs(gmpVal)}` : "₹0"}
                          </span>
                        </td>

                        <td className={`py-4 px-4 font-medium sm:font-semibold ${isNegative ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"} whitespace-nowrap`}>
                          {ipo.gmp?.estListingText || (ipo.gmp?.expectedListingPrice ? formatINR(ipo.gmp.expectedListingPrice) : "TBA")}
                        </td>

                        <td className="py-4 px-4 font-medium sm:font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                          {gmpPct > 0 ? `+${gmpPct}%` : "0%"}
                        </td>

                        <td className="py-4 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                          {(ipo.dates?.rawRange || (ipo.dates?.open ? `${ipo.dates.open} to ${ipo.dates.close || ""}` : "TBA")).replace(/[–—]/g, " to ")}
                        </td>

                        <td className="py-4 px-4 text-right">
                          <GmpTrendBadge value={gmpVal} percentage={gmpPct} movement={(ipo.gmp?.trend as any) || "STABLE"} size="sm" />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: CARDS VIEW (Visual, Detailed, Informative - 2 per row for premium look) */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredIpos.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              No IPOs match your search or filter.
            </div>
          ) : (
            filteredIpos.map((ipo) => {
              const gmpVal = ipo.gmp?.value ?? 0;
              const gmpPct = ipo.gmp?.percentage ?? 0;
              const isPositive = gmpVal > 0;
              const isNegative = gmpVal < 0;
              const rawPrice = ipo.priceBand?.raw || formatINR(ipo.priceBand?.max || 0);
              const estListing = ipo.gmp?.estListingText || (ipo.gmp?.expectedListingPrice ? formatINR(ipo.gmp.expectedListingPrice) : "TBA");
              const dateRange = (ipo.dates?.rawRange || (ipo.dates?.open ? `${ipo.dates.open} to ${ipo.dates.close || ""}` : "Dates TBA")).replace(/[–—]/g, " to ");
              const lot = ipo.lotSize || 0;
              const estProfit = lot > 0 ? lot * gmpVal : null;

              return (
                <div
                  key={ipo.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-card hover:shadow-card-hover hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Top Row: Logo, Company Name, Category & Trend */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <IpoLogo name={ipo.name} logoUrl={ipo.logoUrl} size="md" />
                        <div className="min-w-0">
                          <Link href={`/ipo/${ipo.slug}`} className="block hover:text-blue-600 transition-colors">
                            <h3 className="font-normal sm:font-medium text-base sm:text-lg text-slate-900 dark:text-white tracking-tight line-clamp-1">
                              {ipo.name}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                ipo.type === "SME"
                                  ? "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200"
                                  : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200"
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
                        </div>
                      </div>

                      {/* Trend Badge */}
                      <GmpTrendBadge value={gmpVal} percentage={gmpPct} movement={(ipo.gmp?.trend as any) || "STABLE"} size="sm" />
                    </div>

                    {/* GMP Hero Strip */}
                    <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                      isNegative
                        ? "bg-gradient-to-r from-rose-50/70 to-red-50/70 dark:from-rose-950/40 dark:to-red-950/40 border-rose-200/80 dark:border-rose-800/80"
                        : "bg-gradient-to-r from-emerald-50/70 to-teal-50/70 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-200/80 dark:border-emerald-800/80"
                    }`}>
                      <div>
                        <span className={`text-[10px] block font-bold uppercase tracking-wider ${
                          isNegative ? "text-rose-800 dark:text-rose-300" : "text-emerald-800 dark:text-emerald-300"
                        }`}>
                          GMP Today (Live)
                        </span>
                        <div className={`text-2xl font-light sm:font-normal tracking-tight flex items-baseline gap-1 mt-0.5 ${
                          isNegative ? "text-rose-700 dark:text-rose-300" : "text-emerald-700 dark:text-emerald-300"
                        }`}>
                          <span>{isPositive ? `+₹${gmpVal}` : isNegative ? `-₹${Math.abs(gmpVal)}` : "₹0"}</span>
                          <span className={`text-xs font-normal ${
                            isNegative ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                          }`}>/share</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] block font-bold uppercase tracking-wider ${
                          isNegative ? "text-rose-800 dark:text-rose-300" : "text-emerald-800 dark:text-emerald-300"
                        }`}>
                          {isNegative ? "Listing Discount" : "Listing Gain"}
                        </span>
                        <span className={`text-lg font-normal sm:font-medium block mt-0.5 ${
                          isNegative ? "text-rose-700 dark:text-rose-300" : "text-emerald-700 dark:text-emerald-300"
                        }`}>
                          {gmpPct !== 0 ? (gmpPct > 0 ? `+${gmpPct}%` : `${gmpPct}%`) : "0%"}
                        </span>
                      </div>
                    </div>

                    {/* High-Impact Financial Metrics Box */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider mb-0.5">
                          Issue Price
                        </span>
                        <span className="font-medium sm:font-semibold text-sm sm:text-base text-slate-900 dark:text-white block">
                          {rawPrice}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider mb-0.5">
                          Est. Listing
                        </span>
                        <span className="font-medium sm:font-semibold text-sm sm:text-base text-emerald-600 dark:text-emerald-400 block">
                          {estListing}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider mb-0.5">
                          Est. Gain
                        </span>
                        <span className="font-medium sm:font-semibold text-sm sm:text-base text-emerald-600 dark:text-emerald-400 block">
                          {gmpPct > 0 ? `+${gmpPct}%` : "0%"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider mb-0.5">
                          {estProfit ? "Est. Profit/Lot" : "Lot Size"}
                        </span>
                        <span className="font-medium sm:font-semibold text-sm sm:text-base text-emerald-600 dark:text-emerald-400 block">
                          {estProfit ? `+${formatINR(estProfit)}` : (lot > 0 ? `${lot} Shares` : "1 Lot")}
                        </span>
                      </div>
                    </div>

                    {/* Schedule & Lot Size row */}
                    <div className="flex items-center justify-between text-xs px-1 text-slate-500 dark:text-slate-400 font-medium">
                      <span>Dates: <strong className="text-slate-800 dark:text-slate-200 font-medium">{dateRange}</strong></span>
                      {lot > 0 && <span>Lot: <strong className="text-slate-800 dark:text-slate-200 font-medium">{lot} Shares</strong></span>}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live GMP Tracker</span>
                    </div>
                    <Link
                      href={`/ipo/${ipo.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Full Details & Analysis</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
