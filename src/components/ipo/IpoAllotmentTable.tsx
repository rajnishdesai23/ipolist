"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Zap, ExternalLink, Download, Search, LayoutGrid, List, ShieldCheck } from "lucide-react";
import { IPO } from "@/types/ipo";
import { getRegistrarPortalUrl } from "@/lib/utils/registrar";
import { IpoLogo } from "@/components/ui/IpoLogo";
import { getAllotmentProximityScore, getSmartAllotmentDate } from "@/lib/utils/dates";
import { formatINR, getCleanIpoDisplayName } from "@/lib/utils/formatters";

interface IpoAllotmentTableProps {
  ipos: IPO[];
}

export function IpoAllotmentTable({ ipos }: IpoAllotmentTableProps) {
  // Default to GRID view with 2 cards per row as requested
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "OUT" | "AWAITED">("ALL");

  // Event-wise sorting: Nearby Allotment Dates & OUT on top!
  const sortedIpos = useMemo(() => {
    return [...ipos].sort((a, b) => {
      const scoreA = getAllotmentProximityScore(a);
      const scoreB = getAllotmentProximityScore(b);
      if (scoreA !== scoreB) return scoreB - scoreA;
      return (b.gmp?.percentage || 0) - (a.gmp?.percentage || 0);
    });
  }, [ipos]);

  // Filtered IPOs
  const filteredIpos = useMemo(() => {
    return sortedIpos.filter((ipo) => {
      const isOut = ipo.allotment?.status === "OUT" || ipo.rawStatus?.toLowerCase().includes("allotment out");
      const matchesSearch =
        ipo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ipo.registrar?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "OUT" && isOut) ||
        (statusFilter === "AWAITED" && !isOut);
      return matchesSearch && matchesStatus;
    });
  }, [sortedIpos, searchQuery, statusFilter]);

  // CSV Downloader
  const downloadAllotmentCsv = () => {
    const headers = ["IPO Company", "Registrar", "Allotment Date", "Status", "Portal Link"];
    const rows = filteredIpos.map((ipo) => {
      const isOut = ipo.allotment?.status === "OUT" || ipo.rawStatus?.toLowerCase().includes("allotment out");
      const smartDate = getSmartAllotmentDate(ipo.dates, ipo.status).displayText;
      const portalUrl = getRegistrarPortalUrl(
        ipo.registrar?.name,
        ipo.allotment?.links?.[0]?.url || ipo.registrar?.website
      );
      return [
        `"${ipo.name.replace(/"/g, '""')}"`,
        `"${(ipo.registrar?.name || "Registrar Server").replace(/"/g, '""')}"`,
        `"${smartDate}"`,
        `"${isOut ? "ALLOTMENT OUT" : "AWAITED"}"`,
        `"${portalUrl}"`,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ipo_allotment_status_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-4">
      {/* Sticky Controls Bar */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-3.5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 flex-1">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-56 sm:flex-none">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search company or registrar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter Toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-bold shrink-0">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === "ALL" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm" : "text-slate-500"
              }`}
            >
              All ({ipos.length})
            </button>
            <button
              onClick={() => setStatusFilter("OUT")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === "OUT" ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm" : "text-slate-500"
              }`}
            >
              Out
            </button>
            <button
              onClick={() => setStatusFilter("AWAITED")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === "AWAITED" ? "bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-sm" : "text-slate-500"
              }`}
            >
              Awaited
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-between sm:justify-end shrink-0">
          {/* Download CSV */}
          <button
            onClick={downloadAllotmentCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold shadow-sm transition-colors"
            title="Download Allotment Data (CSV)"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download</span>
          </button>

          {/* View Mode Toggle: Grid vs List */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Grid View (2 in row)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
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
          </div>
        </div>
      </div>

      {/* VIEW 1: GRID VIEW (DEFAULT — STRICTLY 2 CARDS PER ROW) */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredIpos.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              No matching IPO allotment records found.
            </div>
          ) : (
            filteredIpos.map((ipo) => {
              const displayName = getCleanIpoDisplayName(ipo.name, ipo.slug);
              const isOut = ipo.allotment?.status === "OUT" || ipo.rawStatus?.toLowerCase().includes("allotment out");
              const { displayText: allotmentDateText, isEstimated } = getSmartAllotmentDate(ipo.dates, ipo.status);
              const portalUrl = getRegistrarPortalUrl(
                ipo.registrar?.name,
                ipo.allotment?.links?.[0]?.url || ipo.registrar?.website
              );
              const gmpVal = ipo.gmp?.value ?? 0;
              const gmpPct = ipo.gmp?.percentage ?? 0;
              const issuePrice = ipo.priceBand?.raw || (ipo.priceBand?.max ? formatINR(ipo.priceBand.max) : "TBA");

              return (
                <div
                  key={ipo.id}
                  className={`bg-white dark:bg-slate-900 border rounded-3xl p-4 sm:p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group ${
                    isOut
                      ? "border-purple-300 dark:border-purple-800 hover:border-purple-500"
                      : "border-slate-200 dark:border-slate-800 hover:border-blue-500"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header: Company Name, Status Pill & Type */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/ipo/${ipo.slug}`}
                          className="font-normal sm:font-medium text-lg sm:text-xl text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors block line-clamp-1 tracking-tight"
                        >
                          <span>{displayName}</span>
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            {ipo.type}
                          </span>
                          {ipo.issueDetails?.listingExchange && (
                            <span className="text-xs font-normal text-slate-400">
                              {ipo.issueDetails.listingExchange}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Prominent Allotment Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold shrink-0 shadow-sm ${
                          isOut
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 dark:border-purple-700"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isOut ? "bg-purple-500" : "bg-amber-500"}`} />
                        {isOut ? "ALLOTMENT OUT" : "AWAITED"}
                      </span>
                    </div>

                    {/* Allotment & Financial Details Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-left">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                          Registrar
                        </span>
                        <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 block truncate mt-0.5">
                          {ipo.registrar?.name || "Official Portal"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                          Allotment Date
                        </span>
                        <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 block mt-0.5">
                          {allotmentDateText}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                          Issue Price
                        </span>
                        <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 block mt-0.5">
                          {issuePrice}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                          GMP (Est. Gain)
                        </span>
                        <span className="font-semibold text-sm sm:text-base text-emerald-600 dark:text-emerald-400 block">
                          {gmpVal > 0 ? `+₹${gmpVal} (${gmpPct}%)` : "₹0"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                    <Link
                      href={`/ipo/${ipo.slug}`}
                      aria-label={`View ${displayName} Full Analysis`}
                      className="text-xs font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-center sm:text-left"
                    >
                      <span className="sr-only">{displayName} </span>
                      <span>View Full Analysis</span>
                    </Link>

                    <a
                      href={portalUrl}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      aria-label={`Check ${displayName} Allotment Status`}
                      className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm group-hover:shadow-md w-full sm:w-auto"
                    >
                      <span className="sr-only">{displayName} </span>
                      <span>Check Allotment Status</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW 2: LIST VIEW (TABLE) */}
      {viewMode === "list" && (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                <th className="py-3.5 px-4">IPO Company</th>
                <th className="py-3.5 px-4">Registrar</th>
                <th className="py-3.5 px-4">Allotment Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Direct Portal Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredIpos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    No matching IPO allotment records found.
                  </td>
                </tr>
              ) : (
                filteredIpos.map((ipo) => {
                  const displayName = getCleanIpoDisplayName(ipo.name, ipo.slug);
                  const isOut = ipo.allotment?.status === "OUT" || ipo.rawStatus?.toLowerCase().includes("allotment out");
                  const { displayText: smartAllotmentDate } = getSmartAllotmentDate(ipo.dates, ipo.status);
                  const portalUrl = getRegistrarPortalUrl(
                    ipo.registrar?.name,
                    ipo.allotment?.links?.[0]?.url || ipo.registrar?.website
                  );

                  return (
                    <tr
                      key={ipo.id}
                      className={`transition-colors ${
                        isOut
                          ? "bg-purple-50/20 dark:bg-purple-950/10 hover:bg-purple-50/40"
                          : "hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2.5">
                          <IpoLogo name={ipo.name} logoUrl={ipo.logoUrl} slug={ipo.slug} size="sm" />
                          <Link href={`/ipo/${ipo.slug}`} className="hover:text-blue-600 line-clamp-1 font-bold">
                            <span>{displayName}</span>
                            <span className="sr-only"> Allotment Info</span>
                          </Link>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {ipo.registrar?.name || "Registrar Server"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-bold">
                        {smartAllotmentDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            isOut
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200"
                          }`}
                        >
                          {isOut ? "ALLOTMENT OUT" : "AWAITED"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={portalUrl}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          aria-label={`Direct Portal ${displayName} Allotment`}
                          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition-all shadow-sm"
                        >
                          <span className="sr-only">Direct {displayName} </span>
                          <span>Check Allotment</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
