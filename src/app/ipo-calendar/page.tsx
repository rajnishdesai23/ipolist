import React from "react";
import { Metadata } from "next";
import { Calendar } from "lucide-react";
import { getAllIpos } from "@/lib/data/ipoRepository";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LeaderboardAd } from "@/components/ads/LeaderboardAd";
import { BrokerCtaCard } from "@/components/ads/BrokerCtaCard";
import { IpoCalendarView } from "@/components/ipo/IpoCalendarView";

export const metadata: Metadata = {
  title: "IPO Calendar 2026 — Schedule of Open, Close, Allotment & Listing Dates",
  description:
    "Interactive IPO calendar timeline in India. Track open dates, close dates, basis of allotment, and listing schedules for all upcoming Mainboard & SME IPOs.",
};

export const revalidate = 60;

export default async function IpoCalendarPage() {
  const ipos = await getAllIpos();

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb items={[{ name: "IPO Calendar", url: "/ipo-calendar" }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>2026 Interactive IPO Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
            IPO Calendar &amp; Timeline Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Track opening, closing, allotment, and listing dates on a monthly calendar grid or timeline agenda.
          </p>
        </div>

        <LeaderboardAd />

        {/* Interactive Month Grid & Agenda Calendar View */}
        <IpoCalendarView ipos={ipos} />

        <BrokerCtaCard variant="horizontal" broker="upstox" />
      </div>
    </div>
  );
}

