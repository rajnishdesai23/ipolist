import React from "react";
import { Check, Calendar } from "lucide-react";
import { IPODates, IPOStatus } from "@/types/ipo";

export function TimelineStepper({
  dates,
  status,
}: {
  dates?: IPODates;
  status: IPOStatus;
}) {
  if (!dates) return null;

  const steps = [
    { label: "IPO Open", date: dates.open, key: "open" },
    { label: "IPO Close", date: dates.close, key: "close" },
    { label: "Allotment", date: dates.allotment, key: "allotment" },
    { label: "Refunds", date: dates.refunds, key: "refunds" },
    { label: "Demat Credit", date: dates.creditToDemat, key: "demat" },
    { label: "Listing", date: dates.listing, key: "listing" },
  ];

  let activeIndex = 0;
  if (status === "CLOSED") {
    activeIndex = 5;
  } else if (status === "LIVE") {
    activeIndex = 1;
  } else {
    activeIndex = 0;
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          IPO Tentative Timeline & Key Dates
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((step, idx) => {
          const isPassed = idx <= activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div
              key={step.key}
              className={`p-3 rounded-xl border text-xs transition-all ${
                isCurrent
                  ? "bg-blue-50 border-blue-300 dark:bg-blue-950/60 dark:border-blue-700 font-bold"
                  : isPassed
                  ? "bg-slate-50 border-slate-200 dark:bg-slate-800/40 dark:border-slate-700"
                  : "bg-slate-50/50 border-slate-100 dark:bg-slate-900 dark:border-slate-800 text-slate-400 opacity-80"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Step {idx + 1}
                </span>
                {isPassed && <Check className="w-3 h-3 text-blue-600" />}
              </div>
              <span className="font-bold text-slate-900 dark:text-white block text-xs">
                {step.label}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                {step.date || "TBA"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
