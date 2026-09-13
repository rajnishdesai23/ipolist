"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { LayoutGrid, List, ArrowRight, Download, Search, TrendingUp } from "lucide-react";
import { IPO } from "@/types/ipo";
import { formatINR } from "@/lib/utils/formatters";
import { IpoLogo } from "@/components/ui/IpoLogo";

interface IpoGmpViewProps {
  ipos: IPO[];
}

export function IpoGmpView({ ipos }: IpoGmpViewProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
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
        ipo.symbol?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        filterType === "ALL" ||
        (filterType === "MAINBOARD" && ipo.type === "MAINBOARD") ||
        (filterType === "SME" && (ipo.type === "SME_BSE" || ipo.type === "SME_NSE" || ipo.type === "SME"));
      return matchesQuery && matchesType;
    });
  }, [sortedIpos, searchQuery, filterType]);

  // CSV Downloader
  const downloadCsv = () => {
    const headers = ["IPO Name", "Type", "Issue Price", "GMP Today", "Expected Listing", "Est Gain %", "Dates"];
    const rows = filteredIpos.map((ipo) => [
      `"${ipo.name.replace(/"/g, '""')}"`,
      `"${ipo.type || ""}"`,
      `"${ipo.priceBand?.raw || formatINR(ipo.priceBand?.max || 0)}"`,
      `"${ipo.gmp?.value ? `+₹${ipo.gmp.value}` : "₹0"}"`,
      `"${ipo.gmp?.estListingText || (ipo.gmp?.expectedListingPrice ? formatINR(ipo.gmp.expectedListingPrice) : "TBA")}"`,
      `"${ipo.gmp?.percentage ? `${ipo.gmp.percentage}%` : "0%"}"`,
      `"${ipo.dates?.rawRange || (ipo.dates?.open ? `${ipo.dates.open} – ${ipo.dates.close || ""}` : "TBA")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `live_ipo_gmp_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search, Category, Download & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search IPO name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-44 sm:w-56"
            />
          </div>

          {/* Type filters */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-bold">
            <button
              onClick={() => setFilterType("ALL")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterType === "ALL" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              All ({sortedIpos.length})
            </button>
            <button
              onClick={() => setFilterType("MAINBOARD")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterType === "MAINBOARD" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Mainboard
            </button>
            <button
              onClick={() => setFilterType("SME")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterType === "SME" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              SME
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Download CSV */}
          <button
            onClick={downloadCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold shadow-sm transition-colors"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download</span>
          </button>

          {/* View Toggle: Grid vs List */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5">
            <button
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "list"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: LIST / TABLE VIEW */}
      {viewMode === "list" && (
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3.5 px-4">IPO Name & Type</th>
                  <th className="py-3.5 px-4">Issue Price</th>
                  <th className="py-3.5 px-4">GMP Today</th>
                  <th className="py-3.5 px-4">Expected Listing</th>
                  <th className="py-3.5 px-4">Est. Gain %</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredIpos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                      No matching IPOs found.
                    </td>
                  </tr>
                ) : (
                  filteredIpos.map((ipo) => {
                    const gmpVal = ipo.gmp?.value ?? 0;
                    const gmpPct = ipo.gmp?.percentage ?? 0;
                    const isPositive = gmpVal > 0;

                    return (
                      <tr
                        key={ipo.id}
                        className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors group"
                      >
                        <td className="py-4 px-4">
                          <Link
                            href={`/ipo/${ipo.slug}`}
                            className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors block"
                          >
                            {ipo.name}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {ipo.type} {ipo.issueDetails?.listingExchange ? `• ${ipo.issueDetails.listingExchange}` : ""}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          {ipo.priceBand?.raw || formatINR(ipo.priceBand?.max || 0)}
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded font-extrabold text-xs ${
                              isPositive
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {isPositive ? `+₹${gmpVal}` : "₹0"}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                          {ipo.gmp?.estListingText || (ipo.gmp?.expectedListingPrice ? formatINR(ipo.gmp.expectedListingPrice) : "TBA")}
                        </td>

                        <td className="py-4 px-4 font-extrabold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                          {gmpPct > 0 ? `+${gmpPct}%` : "0%"}
                        </td>

                        <td className="py-4 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                          {(ipo.dates?.rawRange || (ipo.dates?.open ? `${ipo.dates.open} to ${ipo.dates.close || ""}` : "TBA")).replace(/[–—]/g, " to ")}
                        </td>

                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <Link
                            href={`/ipo/${ipo.slug}`}
                            className="inline-flex items-center gap-1 bg-slate-900 hover:bg-blue-600 text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <span>Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
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

      {/* VIEW 2: GRID VIEW (2 CARDS PER ROW) */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredIpos.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              No matching IPOs found.
            </div>
          ) : (
            filteredIpos.map((ipo) => {
              const gmpVal = ipo.gmp?.value ?? 0;
              const gmpPct = ipo.gmp?.percentage ?? 0;
              const isPositive = gmpVal > 0;
              const rawPrice = ipo.priceBand?.raw || (ipo.priceBand?.max ? formatINR(ipo.priceBand.max) : "TBA");
              const estListing = ipo.gmp?.estListingText || (ipo.gmp?.expectedListingPrice ? formatINR(ipo.gmp.expectedListingPrice) : "TBA");
              const lot = ipo.lotSize || Number(ipo.marketLot?.[0]?.shares) || 0;
              const estProfit = lot > 0 && gmpVal > 0 ? lot * gmpVal : null;
              const dateRange = (ipo.dates?.rawRange || (ipo.dates?.open ? `${ipo.dates.open} to ${ipo.dates.close || ""}` : "TBA")).replace(/[–—]/g, " to ");

              return (
                <div
                  key={ipo.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-card hover:shadow-card-hover hover:border-blue-500/50 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Header: Company Name, Badges & GMP */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/ipo/${ipo.slug}`}
                          className="font-black text-xl sm:text-2xl text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors block line-clamp-1 tracking-tight"
                        >
                          {ipo.name}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            {ipo.type}
                          </span>
                          {ipo.issueDetails?.listingExchange && (
                            <span className="text-xs font-semibold text-slate-400">
                              {ipo.issueDetails.listingExchange}
                            </span>
                          )}
                          {ipo.status && (
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                              ipo.status === "LIVE"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : ipo.status === "UPCOMING"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}>
                              ● {ipo.status}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Prominent GMP Badge */}
                      <div className="flex flex-col items-end shrink-0">
                        <span
                          className={`inline-flex items-center px-3.5 py-1.5 rounded-xl font-black text-base sm:text-lg shrink-0 shadow-sm ${
                            isPositive
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {isPositive ? `+₹${gmpVal}` : "₹0"}
                        </span>
                        <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 mt-1">
                          {gmpPct > 0 ? `+${gmpPct}% Est.` : "GMP"}
                        </span>
                      </div>
                    </div>

                    {/* High-Impact Financial Metrics Box */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">
                          Issue Price
                        </span>
                        <span className="font-black text-base sm:text-lg text-slate-900 dark:text-white block">
                          {rawPrice}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">
                          Est. Listing
                        </span>
                        <span className="font-black text-base sm:text-lg text-emerald-600 dark:text-emerald-400 block">
                          {estListing}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">
                          Est. Gain
                        </span>
                        <span className="font-black text-base sm:text-lg text-emerald-600 dark:text-emerald-400 block">
                          {gmpPct > 0 ? `+${gmpPct}%` : "0%"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">
                          {estProfit ? "Est. Profit/Lot" : "Lot Size"}
                        </span>
                        <span className="font-black text-base sm:text-lg text-emerald-600 dark:text-emerald-400 block">
                          {estProfit ? `+${formatINR(estProfit)}` : (lot > 0 ? `${lot} Shares` : "1 Lot")}
                        </span>
                      </div>
                    </div>

                    {/* Schedule & Lot Size row */}
                    <div className="flex items-center justify-between text-xs px-1 text-slate-500 dark:text-slate-400 font-medium">
                      <span>Dates: <strong className="text-slate-800 dark:text-slate-200 font-bold">{dateRange}</strong></span>
                      {lot > 0 && <span>Lot: <strong className="text-slate-800 dark:text-slate-200 font-bold">{lot} Shares</strong></span>}
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
                      className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 dark:text-blue-400 hover:text-blue-500 group-hover:translate-x-0.5 transition-transform"
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
