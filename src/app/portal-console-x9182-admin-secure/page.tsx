import React from "react";
import Link from "next/link";
import {
  Layers,
  TrendingUp,
  Clock,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { getAllIpos, getLiveIpos, getUpcomingIpos } from "@/lib/data/ipoRepository";
import { getAllBlogs } from "@/lib/data/blogRepository";
import { getScrapeLogs } from "@/lib/scrapers/orchestrator";
import { formatDate } from "@/lib/utils/formatters";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const allIpos = await getAllIpos();
  const liveIpos = await getLiveIpos();
  const upcomingIpos = await getUpcomingIpos();
  const blogs = await getAllBlogs();
  const scrapeLogs = await getScrapeLogs();
  const lastLog = scrapeLogs[0];

  const cards = [
    {
      title: "Total IPOs in DB",
      value: allIpos.length,
      sub: "Mainboard & SME combined",
      icon: Layers,
      color: "text-blue-400 bg-blue-500/10",
    },
    {
      title: "Live Open IPOs",
      value: liveIpos.length,
      sub: "Active bidding on exchanges",
      icon: TrendingUp,
      color: "text-emerald-400 bg-emerald-500/10",
    },
    {
      title: "Upcoming Pipeline",
      value: upcomingIpos.length,
      sub: "Opening in next 30 days",
      icon: Clock,
      color: "text-amber-400 bg-amber-500/10",
    },
    {
      title: "Blog & News Articles",
      value: blogs.length,
      sub: "Published editorial posts",
      icon: BookOpen,
      color: "text-purple-400 bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Admin Overview & Control Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time management for IPO listings, GMP overrides, scraper health, and editorial blog articles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/portal-console-x9182-admin-secure/gmp"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition-transform hover:scale-105"
          >
            <TrendingUp className="w-4 h-4" />
            <span>GMP Quick Update</span>
          </Link>
          <Link
            href="/portal-console-x9182-admin-secure/ipos/new"
            className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition-transform hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add IPO</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white">{card.value}</div>
              <p className="text-[11px] text-slate-500">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Scraper Status Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Automated Scraper Health</h3>
              <p className="text-xs text-slate-400">
                Hourly multi-source synchronization (IPOWatch Mainboard & SME tables)
              </p>
            </div>
          </div>

          <Link
            href="/portal-console-x9182-admin-secure/scraper"
            className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Open Scraper Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Last Scrape Run</span>
            <span className="font-bold text-white text-sm">
              {lastLog ? formatDate(lastLog.timestamp, "dd MMM, hh:mm a") : "Ready to run"}
            </span>
          </div>
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Scraper Status</span>
            <span className="font-bold text-emerald-400 text-sm flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              IPOWatch Active
            </span>
          </div>
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Protected Cron Route</span>
            <span className="font-mono text-[11px] text-blue-300">/api/cron/sync-ipos</span>
          </div>
        </div>
      </div>

      {/* Quick Action Tables */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white">Recently Updated IPOs</h3>
          <Link href="/portal-console-x9182-admin-secure/ipos" className="text-xs font-bold text-blue-400 hover:underline">
            View All IPOs →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-500 font-bold uppercase border-b border-slate-800">
                <th className="py-2.5 px-3">IPO Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Current GMP</th>
                <th className="py-2.5 px-3 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {allIpos.slice(0, 5).map((ipo) => {
                const gmpVal = ipo.gmp?.value ?? 0;
                const gmpPct = ipo.gmp?.percentage ?? 0;
                return (
                  <tr key={ipo.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-semibold text-white">{ipo.name}</td>
                    <td className="py-3 px-3">{ipo.type}</td>
                    <td className="py-3 px-3">{ipo.status}</td>
                    <td className="py-3 px-3 font-bold text-emerald-400">
                      ₹{gmpVal} ({gmpPct > 0 ? `+${gmpPct}%` : "0%"})
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/portal-console-x9182-admin-secure/ipos/${ipo.id}`}
                        className="text-blue-400 hover:underline font-bold text-xs"
                      >
                        Edit IPO
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
