"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Zap, ExternalLink, Download, Search, Filter } from "lucide-react";
import { IPO } from "@/types/ipo";
import { getRegistrarPortalUrl } from "@/lib/utils/registrar";
import { IpoLogo } from "@/components/ui/IpoLogo";

interface IpoAllotmentTableProps {
  ipos: IPO[];
}

export function IpoAllotmentTable({ ipos }: IpoAllotmentTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "OUT" | "AWAITED">("ALL");

  // Sort IPOs: Allotment OUT first, Allotment Awaited below
  const sortedIpos = useMemo(() => {
    return [...ipos].sort((a, b) => {
      const isAOut = a.allotment?.status === "OUT" || a.status === "CLOSED";
      const isBOut = b.allotment?.status === "OUT" || b.status === "CLOSED";
      if (isAOut && !isBOut) return -1;
      if (!isAOut && isBOut) return 1;
      return 0;
    });
  }, [ipos]);

  // Filtered IPOs
  const filteredIpos = useMemo(() => {
    return sortedIpos.filter((ipo) => {
      const isOut = ipo.allotment?.status === "OUT" || ipo.status === "CLOSED";
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
      const isOut = ipo.allotment?.status === "OUT" || ipo.status === "CLOSED";
      const portalUrl = getRegistrarPortalUrl(
        ipo.registrar?.name,
        ipo.allotment?.links?.[0]?.url || ipo.registrar?.website
      );
      return [
        `"${ipo.name.replace(/"/g, '""')}"`,
        `"${(ipo.registrar?.name || "Registrar Server").replace(/"/g, '""')}"`,
        `"${ipo.dates?.allotment || "TBA"}"`,
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
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-card p-5 sm:p-7 space-y-4">
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-heading flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Allotment Status by IPO (OUT First)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Official registrar basis of allotment verified in real-time
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search company or registrar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 sm:w-56"
            />
          </div>

          {/* Status Filter Toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-bold">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === "ALL" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm" : "text-slate-500"
              }`}
            >
              All
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

          {/* Download CSV button */}
          <button
            onClick={downloadAllotmentCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold shadow-sm transition-colors"
            title="Download Allotment Data (CSV)"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
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
                const isOut = ipo.allotment?.status === "OUT" || ipo.status === "CLOSED";
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
                        <IpoLogo name={ipo.name} logoUrl={ipo.logoUrl} size="sm" />
                        <Link href={`/ipo/${ipo.slug}`} className="hover:text-blue-600 line-clamp-1">
                          {ipo.name}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {ipo.registrar?.name || "Registrar Server"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                      {ipo.dates?.allotment || "TBA"}
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
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition-all shadow-sm"
                      >
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
    </div>
  );
}
