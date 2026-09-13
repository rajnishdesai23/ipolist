"use client";

import React from "react";

export function IpoCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-7 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    </div>
  );
}

export function IpoTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="h-5 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="space-y-1.5 flex-1 max-w-sm">
                <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            </div>
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full hidden sm:block" />
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded hidden md:block" />
            <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
