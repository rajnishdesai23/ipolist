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
} from "lucide-react";
import { IPO, IPOStatus } from "@/types/ipo";
import { formatINR } from "@/lib/utils/formatters";
import { getStatusBadgeConfig, sortIposByStatusPriority } from "@/lib/utils/status";
import { getRegistrarPortalUrl } from "@/lib/utils/registrar";
import { IpoLogo } from "@/components/ui/IpoLogo";

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
  initialSegment = "ALL",
  initialStatus = "ALL",
}: IpoTableProps) {
  const [selectedSegment, setSelectedSegment] = useState<"ALL" | "MAINBOARD" | "SME">(initialSegment);
  const [selectedStatus, setSelectedStatus] = useState<"ALL" | IPOStatus>(initialStatus);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"priority" | "name" | "gmp">("priority");
  const [sortAsc, setSortAsc] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

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
    { label: "🔥 Live Now", value: "LIVE", count: counts.live },
    { label: "📅 Upcoming", value: "UPCOMING", count: counts.upcoming },
    { label: "📁 Closed", value: "CLOSED", count: counts.closed },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-card overflow-hidden space-y-4 p-3.5 sm:p-6">
      {/* Top Controls: Segment Tabs & Search Box */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-1">
        {/* Mainboard vs SME Segment Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto scrollbar-none w-full sm:w-auto">
          <button
            onClick={() => setSelectedSegment("ALL")}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              selectedSegment === "ALL"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            All Market ({ipos.length})
          </button>
          <button
            onClick={() => setSelectedSegment("MAINBOARD")}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              selectedSegment === "MAINBOARD"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Mainboard ({ipos.filter((i) => i.type === "MAINBOARD").length})
          </button>
          <button
            onClick={() => setSelectedSegment("SME")}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              selectedSegment === "SME"
                ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            SME ({ipos.filter((i) => i.type === "SME").length})
          </button>
        </div>

        {/* Search Input Box & View Toggle */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 sm:py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* View Toggle on Mobile & Desktop */}
          <div className="hidden sm:flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-900 text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "cards"
                  ? "bg-white dark:bg-slate-900 text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Lifecycle Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none border-b border-slate-100 dark:border-slate-800">
        {statusTabs.map((tab) => {
          const isActive = selectedStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                isActive
                  ? "bg-slate-900 text-white dark:bg-blue-600 dark:text-white border-transparent shadow-sm"
                  : "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="py-12 text-center text-slate-400 text-xs bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          No IPOs found for the selected filters. Try switching category or clearing your search.
        </div>
      )}

      {/* Mobile Card List View (Visible on small screens or when Card View is active) */}
      {filtered.length > 0 && (
        <div className={`${viewMode === "cards" ? "block" : "block md:hidden"} space-y-3`}>
          {filtered.map((ipo) => {
            const statusConfig = getStatusBadgeConfig(ipo.status);
            const isSme = ipo.type === "SME";
            const gmpVal = ipo.gmp?.value ?? 0;
            const gmpPct = ipo.gmp?.percentage ?? 0;
            const isPositive = gmpVal > 0;

            return (
              <div
                key={ipo.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                {/* Header with Title and Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <IpoLogo name={ipo.name} logoUrl={ipo.logoUrl} size="sm" />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            isSme
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
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
                      <Link
                        href={`/ipo/${ipo.slug}`}
                        className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 block line-clamp-1 mt-0.5"
                      >
                        {ipo.name}
                      </Link>
                    </div>
                  </div>

                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 ${statusConfig.className}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                    <span>{statusConfig.label}</span>
                  </div>
                </div>

                {/* Key Stats Grid */}
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Price Band</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {ipo.priceBand?.raw || (ipo.priceBand?.max ? formatINR(ipo.priceBand.max) : "TBA")}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Lot Size</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {ipo.lotSize ? `${ipo.lotSize} shares` : "TBA"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Issue Size</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate block">
                      {ipo.issueDetails?.issueSize || "TBA"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Est. Gain</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {ipo.gmp?.estListingText || (ipo.gmp?.expectedListingPrice ? formatINR(ipo.gmp.expectedListingPrice) : "—")}
                    </span>
                  </div>
                </div>

                {/* GMP & Action Footer */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-bold text-slate-500">GMP:</span>
                    <span
                      className={`px-2 py-0.5 rounded-lg text-xs font-black ${
                        isPositive
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {isPositive ? `+₹${gmpVal}` : "₹0"}
                      {gmpPct > 0 && <span className="ml-1 text-[10px]">({gmpPct}%)</span>}
                    </span>
                  </div>

                  <Link
                    href={`/ipo/${ipo.slug}`}
                    className="inline-flex items-center gap-1 bg-slate-900 hover:bg-blue-600 text-white dark:bg-slate-800 dark:hover:bg-blue-600 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
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
                      {ipo.issueDetails?.issueSize || "TBA"}
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
  );
}
