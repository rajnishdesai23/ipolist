import React from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, CheckCircle2, Home } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist or has moved. Explore live IPO GMP today, allotment status, and upcoming IPO schedules.",
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-2xl border border-blue-200 dark:border-blue-900 shadow-sm">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The page you requested could not be found or may have moved to a new address. Use the links below to navigate back to active IPO trackers.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>

          <Link
            href="/ipo-gmp"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all"
          >
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Live GMP Board</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
