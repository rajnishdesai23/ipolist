"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  ArrowRight,
  Search,
  LayoutGrid,
  List,
  Calendar,
  TrendingUp,
  X,
  Filter,
  Radio,
  ListChecks,
  Flame,
} from "lucide-react";
import { IPO, IPOStatus } from "@/types/ipo";
import { formatINR, formatIssueSize } from "@/lib/utils/formatters";
import { getStatusBadgeConfig, sortIposByStatusPriority } from "@/lib/utils/status";
import { getRegistrarPortalUrl } from "@/lib/utils/registrar";
import { IpoLogo } from "@/components/ui/IpoLogo";
import { IpoCard } from "@/components/ipo/IpoCard";

interface IpoTableProps {
  ipos: IPO[];
  title?: string;
  showAllColumns?: boolean;
  initialSegment?: "ALL" | "MAINBOARD" | "SME";
  initialStatus?: "ALL" | IPOStatus;
}

export function IpoTable({
  ipos,
  title,
  showAllColumns = true,
  initialSegment = "MAINBOARD",
  initialStatus = "ALL",
}: IpoTableProps) {
  const [selectedSegment, setSelectedSegment] = useState<"ALL" | "MAINBOARD" | "SME">(initialSegment);
  const [selectedStatus, setSelectedStatus] = useState<"ALL" | IPOStatus>(initialStatus);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"priority" | "name" | "gmp">("priority");
  const [sortAsc, setSortAsc] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Status counts
  const counts = {
    all: ipos.length,
    live: ipos.filter((i) => i.status === "LIVE").length,
    upcoming: ipos.filter((i) => i.status === "UPCOMING").length,
    closed: ipos.filter((i) => i.status === "CLOSED").length,
  };

  // Filter pipeline
  let filtered = [...ipos];

  // 1. Segment filter
  if (selectedSegment !== "ALL") {
    filtered = filtered.filter((i) => i.type === selectedSegment);
  }

  // 2. Status filter
  if (selectedStatus !== "ALL") {
    filtered = filtered.filter((i) => i.status === selectedStatus);
  }

  // 3. Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.slug.toLowerCase().includes(q)
    );
  }

  // 4. Sorting
  if (sortField === "priority") {
    filtered = sortIposByStatusPriority(filtered);
    if (sortAsc) filtered.reverse();
  } else if (sortField === "name") {
    filtered.sort((a, b) => (sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
  } else if (sortField === "gmp") {
    filtered.sort((a, b) => (sortAsc ? (a.gmp?.percentage || 0) - (b.gmp?.percentage || 0) : (b.gmp?.percentage || 0) - (a.gmp?.percentage || 0)));
  }

  const handleSort = (field: "priority" | "name" | "gmp") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const statusTabs: { label: string; value: "ALL" | IPOStatus; count: number }[] = [
    { label: "All IPOs", value: "ALL", count: counts.all },
    { label: "🔥 Live", value: "LIVE", count: counts.live },
    { label: "📅 Upcoming", value: "UPCOMING", count: counts.upcoming },
    { label: "📁 Closed", value: "CLOSED", count: counts.closed },
  ];

  return (
    <div className="w-full flex flex-col lg:flex-row gap-5 lg:gap-6 items-start">
      {/* Left Sidebar Filter Column (Thinner & Sleek Horizontal Rows) */}
      <div className="w-full lg:w-44 xl:w-48 flex-shrink-0 space-y-2">
        {/* Filter Box Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl py-2 px-3 text-center font-bold text-xs text-slate-800 dark:text-slate-200 shadow-sm flex items-center justify-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Filter</span>
        </div>

        {/* Status Filter Buttons - Sleek horizontal row layout */}
        <div className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {/* Current IPOs (LIVE) */}
          <button
            onClick={() => setSelectedStatus("LIVE")}
            className={`flex-1 lg:w-full px-3 py-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 whitespace-nowrap ${
              selectedStatus === "LIVE"
                ? "bg-indigo-50/90 border-indigo-500 text-indigo-700 font-bold dark:bg-indigo-950/70 dark:border-indigo-500 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-500/20"
                : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Radio className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 animate-pulse" />
              <span className="text-xs truncate font-semibold">Current IPOs</span>
            </div>
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                selectedStatus === "LIVE"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {counts.live}
            </span>
          </button>

          {/* Upcoming IPOs */}
          <button
            onClick={() => setSelectedStatus("UPCOMING")}
            className={`flex-1 lg:w-full px-3 py-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 whitespace-nowrap ${
              selectedStatus === "UPCOMING"
                ? "bg-indigo-50/90 border-indigo-500 text-indigo-700 font-bold dark:bg-indigo-950/70 dark:border-indigo-500 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-500/20"
                : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="text-xs truncate font-semibold">Upcoming IPOs</span>
            </div>
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                selectedStatus === "UPCOMING"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {counts.upcoming}
            </span>
          </button>

          {/* Listed / Closed IPOs */}
          <button
            onClick={() => setSelectedStatus("CLOSED")}
            className={`flex-1 lg:w-full px-3 py-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 whitespace-nowrap ${
              selectedStatus === "CLOSED"
                ? "bg-indigo-50/90 border-indigo-500 text-indigo-700 font-bold dark:bg-indigo-950/70 dark:border-indigo-500 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-500/20"
                : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <ListChecks className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="text-xs truncate font-semibold">Listed IPOs</span>
            </div>
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                selectedStatus === "CLOSED"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {counts.closed}
            </span>
          </button>

          {/* Show All Option */}
          <button
            onClick={() => setSelectedStatus("ALL")}
            className={`flex-1 lg:w-full px-3 py-2 rounded-xl border text-left transition-all flex items-center justify-between gap-2 whitespace-nowrap ${
              selectedStatus === "ALL"
                ? "bg-slate-100 border-slate-300 text-slate-900 font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                : "bg-transparent border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <span className="text-xs font-semibold">All IPOs</span>
            <span className="text-[10px] text-slate-400 font-bold">({counts.all})</span>
          </button>
        </div>
      </div>

      {/* Right Column: Main Content Area */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Top Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-sm">
          {/* Mainboard, All Market & SME Segment Switcher */}
          {(() => {
            const mainboardCount = ipos.filter((i) => i.type === "MAINBOARD").length;
            const smeCount = ipos.filter((i) => i.type === "SME").length;
            const hasMultipleTypes = mainboardCount > 0 && smeCount > 0;

            if (!hasMultipleTypes && (mainboardCount === 0 || smeCount === 0)) {
              // Only one segment type exists in this dataset
              return (
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full sm:w-auto">
                  <span className="px-3.5 py-1.5 rounded-lg text-xs font-extrabold bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm">
                    {smeCount > 0 ? `SME (${smeCount})` : `Mainboard (${mainboardCount})`}
                  </span>
                </div>
              );
            }

            return (
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto scrollbar-none w-full sm:w-auto">
                {mainboardCount > 0 && (
                  <button
                    onClick={() => setSelectedSegment("MAINBOARD")}
                    className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ease-in-out ${
                      selectedSegment === "MAINBOARD"
                        ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    Mainboard ({mainboardCount})
                  </button>
                )}
                <button
                  onClick={() => setSelectedSegment("ALL")}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ease-in-out ${
                    selectedSegment === "ALL"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  All Market ({ipos.length})
                </button>
                {smeCount > 0 && (
                  <button
                    onClick={() => setSelectedSegment("SME")}
                    className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ease-in-out ${
                      selectedSegment === "SME"
                        ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    SME ({smeCount})
                  </button>
                )}
              </div>
            );
          })()}

          {/* Quick Action Buttons & Search */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  viewMode === "cards"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="py-12 text-center text-slate-400 text-xs bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 animate-fadeIn">
          No IPOs found for the selected filters. Try switching category or clearing your search.
        </div>
      )}

      {/* Card Grid View (Matching reference design format) */}
      {filtered.length > 0 && (
        <div
          key={`${selectedSegment}-${selectedStatus}-${searchQuery}-${viewMode}`}
          className={`animate-fadeIn ${viewMode === "cards" ? "block" : "block md:hidden"}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((ipo) => (
              <IpoCard key={ipo.id} ipo={ipo} />
            ))}
          </div>
        </div>
      )}

      {/* Desktop Table View (Hidden on mobile when viewMode is default) */}
      {filtered.length > 0 && (
        <div className={`${viewMode === "table" ? "hidden md:block" : "hidden"} overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800`}>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 select-none">
                <th
                  onClick={() => handleSort("name")}
                  className="py-3.5 px-4 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>IPO Name & Type</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("priority")}
                  className="py-3.5 px-4 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>

                <th className="py-3.5 px-4">Price Band</th>
                <th className="py-3.5 px-4">Lot Size</th>

                <th
                  onClick={() => handleSort("gmp")}
                  className="py-3.5 px-4 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>GMP Today</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>

                <th className="py-3.5 px-4">Est. Listing (% Gain)</th>
                <th className="py-3.5 px-4">Issue Size</th>
                <th className="py-3.5 px-4">Date Range</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filtered.map((ipo) => {
                const statusConfig = getStatusBadgeConfig(ipo.status);
                const isSme = ipo.type === "SME";
                const gmpVal = ipo.gmp?.value ?? 0;
                const isPositive = gmpVal > 0;

                return (
                  <tr
                    key={ipo.id}
                    className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors group"
                  >
                    {/* Company Column */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <IpoLogo name={ipo.name} logoUrl={ipo.logoUrl} size="sm" />
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Link
                              href={`/ipo/${ipo.slug}`}
                              className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                            >
                              {ipo.name}
                            </Link>
                            <span
                              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                                isSme
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                              }`}
                            >
                              {ipo.type}
                            </span>
                          </div>
                          {ipo.issueDetails?.listingExchange && (
                            <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                              {ipo.issueDetails.listingExchange}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border ${statusConfig.className}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                        <span>{statusConfig.label}</span>
                      </span>
                    </td>

                    {/* Price Band */}
                    <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {ipo.priceBand?.raw || (ipo.priceBand?.max ? formatINR(ipo.priceBand.max) : "TBA")}
                    </td>

                    {/* Lot Size */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {ipo.lotSize ? `${ipo.lotSize} shares` : "TBA"}
                      </div>
                    </td>

                    {/* GMP Today */}
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

                    {/* Expected Listing */}
                    <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {ipo.gmp?.estListingText || (ipo.gmp?.expectedListingPrice ? formatINR(ipo.gmp.expectedListingPrice) : "—")}
                    </td>

                    {/* Issue Size */}
                    <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatIssueSize(ipo.issueDetails?.issueSize)}
                    </td>

                    {/* Dates */}
                    <td className="py-4 px-4 whitespace-nowrap text-[11px] text-slate-500 dark:text-slate-400">
                      {ipo.dates?.rawRange || (ipo.dates?.open ? `${ipo.dates.open} – ${ipo.dates.close || ""}` : "Dates TBA")}
                    </td>

                    {/* Action Links */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {ipo.status === "LIVE" ? (
                          <a
                            href="https://zerodha.com/open-account"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm"
                          >
                            <span>Apply</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        ) : ipo.allotment?.status === "OUT" || ipo.status === "CLOSED" ? (
                          <a
                            href={getRegistrarPortalUrl(ipo.registrar?.name, ipo.registrar?.website)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm"
                          >
                            <span>Allotment</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <Link
                            href={`/ipo/${ipo.slug}`}
                            className="inline-flex items-center gap-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-blue-600 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
                          >
                            <span>View</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);
}
