"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { IPO } from "@/types/ipo";
import { formatINR, formatIssueSize, getCleanIpoDisplayName } from "@/lib/utils/formatters";
import { getRegistrarPortalUrl } from "@/lib/utils/registrar";
import { IpoLogo } from "@/components/ui/IpoLogo";

export function IpoCard({ ipo }: { ipo: IPO }) {
  const displayName = getCleanIpoDisplayName(ipo.name, ipo.slug);
  const isSme = ipo.type === "SME";
  const gmpVal = ipo.gmp?.value ?? 0;
  const gmpPct = ipo.gmp?.percentage ?? 0;
  const isPositive = gmpVal > 0;
  const isNegative = gmpVal < 0;

  // Determine status pill badge configuration matching reference image
  const getPillBadge = () => {
    if (ipo.allotment?.status === "OUT" || ipo.rawStatus?.toLowerCase().includes("out")) {
      return {
        label: "● Allotment Out",
        className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200",
      };
    }
    if (ipo.allotment?.status === "AWAITED" || ipo.rawStatus?.toLowerCase().includes("awaited")) {
      return {
        label: "● Allotment Awaited",
        className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200",
      };
    }
    if (ipo.status === "LIVE") {
      return {
        label: "● Live",
        className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 font-bold animate-pulse",
      };
    }
    if (ipo.status === "UPCOMING") {
      return {
        label: "● Pre-Apply",
        className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 font-bold",
      };
    }
    return {
      label: "● Closed",
      className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 font-semibold",
    };
  };

  const statusPill = getPillBadge();
  const dateRange = (ipo.dates?.rawRange || (ipo.dates?.open ? `${ipo.dates.open} to ${ipo.dates.close || ""}` : "Dates TBA")).replace(/[–—]/g, " to ");
  const portalUrl = getRegistrarPortalUrl(ipo.registrar?.name, ipo.registrar?.website);
  const subscriptionText = ipo.subscription?.total ? `${ipo.subscription.total}x` : undefined;

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
      <div>
        {/* Top Header Row: Logo, Title, Dates & Badges */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <IpoLogo name={ipo.name} logoUrl={ipo.logoUrl} slug={ipo.slug} size="lg" />
            <div className="min-w-0 flex-1">
              <Link href={`/ipo/${ipo.slug}`} className="block hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <span className="text-base sm:text-lg font-normal sm:font-medium text-slate-900 dark:text-white tracking-tight line-clamp-1 block">
                  {displayName}
                </span>
              </Link>
              <span className="text-xs font-normal text-slate-400 dark:text-slate-500 block truncate mt-0.5">
                {dateRange}
              </span>
            </div>
          </div>

          {/* Badges on Right */}
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  isSme
                    ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300"
                    : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
                }`}
              >
                {ipo.type}
              </span>
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${statusPill.className}`}>
                {statusPill.label}
              </span>
            </div>
          </div>
        </div>

        {/* Middle Metrics Row: Offer Price, Lot Size, Subscription, Issue Size */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 py-3 border-y border-slate-100 dark:border-slate-800/80 my-3">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block mb-0.5">
              Offer Price
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
              {ipo.priceBand?.raw || (ipo.priceBand?.max ? formatINR(ipo.priceBand.max) : "TBA")}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block mb-0.5">
              Lot Size
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
              {ipo.lotSize || "TBA"}
            </span>
          </div>

          {subscriptionText && (
            <div className="hidden sm:block">
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block mb-0.5">
                Subscription
              </span>
              <span className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {subscriptionText}
              </span>
            </div>
          )}

          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block mb-0.5">
              Issue Size
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white block whitespace-nowrap">
              {formatIssueSize(ipo.issueDetails?.issueSize)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Row: Expected Premium & Dual Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Expected Premium / GMP */}
        <div>
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
            Exp. Premium
          </span>
          <span
            className={`text-sm font-semibold ${
              isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : isNegative
                ? "text-rose-600 dark:text-rose-400"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            {isPositive ? `+₹${gmpVal}` : isNegative ? `-₹${Math.abs(gmpVal)}` : "₹0"}{" "}
            {gmpPct !== 0 && (
              <span className="text-xs font-normal">
                ({gmpPct > 0 ? `+${gmpPct}` : gmpPct}%)
              </span>
            )}
          </span>
        </div>

        {/* Dual Buttons matching reference image layout */}
        <div className="flex items-center gap-2">
          <Link
            href={`/ipo/${ipo.slug}`}
            aria-label={`View ${displayName} Details`}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors text-center"
          >
            <span className="sr-only">{displayName} IPO </span>Details
          </Link>

          {ipo.allotment?.status === "OUT" || ipo.status === "CLOSED" ? (
            <Link
              href={`/ipo/${ipo.slug}#allotment`}
              aria-label={`Check ${displayName} Allotment Status`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md text-center"
            >
              <span className="sr-only">Check {displayName} </span><span>Allotment</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          ) : ipo.status === "LIVE" ? (
            <Link
              href={`/ipo/${ipo.slug}#overview`}
              aria-label={`Apply for ${displayName} IPO`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md text-center"
            >
              <span className="sr-only">Apply for {displayName} </span><span>Apply Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href={`/ipo/${ipo.slug}#overview`}
              aria-label={`Pre-Apply for ${displayName} IPO`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md text-center"
            >
              <span className="sr-only">Pre-Apply for {displayName} </span><span>Pre-Apply</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
