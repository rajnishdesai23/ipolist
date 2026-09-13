import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getAllIpos } from "@/lib/data/ipoRepository";
import { IpoTable } from "@/components/ipo/IpoTable";
import { IpoCard } from "@/components/ipo/IpoCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LeaderboardAd } from "@/components/ads/LeaderboardAd";
import { BrokerCtaCard } from "@/components/ads/BrokerCtaCard";

export const metadata: Metadata = {
  title: "All IPOs in India (2026) — Mainboard & SME IPO List",
  description:
    "Complete list of all Mainboard and SME IPOs in India. Check live GMP, price band, lot size, subscription status, issue dates, and allotment links.",
};

export const revalidate = 60; // Cache IPO listing for 60 seconds

export default async function AllIposPage() {
  const ipos = await getAllIpos();

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb items={[{ name: "All IPOs", url: "/ipo" }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              IPO List India (2026) — Mainboard & SME
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/ipo/mainboard"
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200"
            >
              Mainboard Only
            </Link>
            <Link
              href="/ipo/sme"
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200"
            >
              SME Only
            </Link>
          </div>
        </div>

        <LeaderboardAd />

        {/* Desktop Table */}
        <div className="hidden md:block">
          <IpoTable ipos={ipos} title="All Initial Public Offerings" showAllColumns={true} />
        </div>

        {/* Mobile Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {ipos.map((ipo) => (
            <IpoCard key={ipo.id} ipo={ipo} />
          ))}
        </div>

        <BrokerCtaCard variant="horizontal" broker="angelone" />
      </div>
    </div>
  );
}
