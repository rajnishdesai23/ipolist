"use client";

import React, { useMemo } from "react";
import { Check, Calendar, Clock, Sparkles } from "lucide-react";
import { IPODates, IPOStatus } from "@/types/ipo";

interface TimelineStepperProps {
  dates?: IPODates;
  status: IPOStatus;
}

export function TimelineStepper({ dates, status }: TimelineStepperProps) {
  if (!dates) return null;

  const rawSteps = [
    { label: "IPO Open", date: dates.open, key: "open" },
    { label: "IPO Close", date: dates.close, key: "close" },
    { label: "Basis of Allotment", date: dates.allotment, key: "allotment" },
    { label: "Initiation of Refunds", date: dates.refunds, key: "refunds" },
    { label: "Credit to Demat", date: dates.creditToDemat, key: "demat" },
    { label: "Listing Date", date: dates.listing, key: "listing" },
  ];

  // Parse dates like "September 12, 2026", "12 Sep 2026", "2026-09-12"
  const parseDate = (dateStr?: string): Date | null => {
    if (!dateStr || dateStr.toLowerCase().includes("tba") || dateStr.toLowerCase().includes("n/a")) {
      return null;
    }
    const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)/i, "$1");
    const parsed = new Date(cleaned);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const stepsWithState = useMemo(() => {
    let lastPassedIndex = -1;
    let currentActiveIndex = -1;

    const evaluated = rawSteps.map((step, idx) => {
      const parsed = parseDate(step.date);
      let stepState: "COMPLETED" | "CURRENT" | "UPCOMING" = "UPCOMING";

      if (parsed) {
        parsed.setHours(0, 0, 0, 0);
        if (parsed < today) {
          stepState = "COMPLETED";
          lastPassedIndex = idx;
        } else if (parsed.getTime() === today.getTime()) {
          stepState = "CURRENT";
          currentActiveIndex = idx;
        }
      }

      return {
        ...step,
        parsedDate: parsed,
        state: stepState,
      };
    });

    // Fallbacks if dates couldn't be parsed or IPO status dictates state
    if (status === "CLOSED" && lastPassedIndex < 5) {
      evaluated.forEach((s) => (s.state = "COMPLETED"));
      lastPassedIndex = 5;
    } else if (status === "LIVE" && currentActiveIndex === -1) {
      if (evaluated[0]) evaluated[0].state = "COMPLETED";
      if (evaluated[1]) evaluated[1].state = "CURRENT";
      currentActiveIndex = 1;
      lastPassedIndex = 0;
    }

    const activeIndex = currentActiveIndex >= 0 ? currentActiveIndex : Math.max(0, lastPassedIndex);
    const fillPercent = Math.min(100, Math.max(0, (activeIndex / (rawSteps.length - 1)) * 100));

    return { steps: evaluated, activeIndex, fillPercent, currentActiveIndex };
  }, [dates, status, today]);

  const { steps, activeIndex, fillPercent } = stepsWithState;

  return (
    <section className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-heading">
              IPO Timeline & Progress Tracker
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live key event progress based on official schedule & dates
            </p>
          </div>
        </div>

        {/* Live status badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin" />
          <span>
            {status === "LIVE"
              ? "IPO Currently Open"
              : status === "CLOSED"
              ? "All Events Completed"
              : "Upcoming Schedule"}
          </span>
        </div>
      </div>

      {/* Desktop Progress Line & Stepper */}
      <div className="hidden lg:block relative pt-6 pb-4">
        {/* Background Track Line */}
        <div className="absolute top-10 left-8 right-8 h-2 bg-slate-100 dark:bg-slate-800 rounded-full z-0" />

        {/* Animated Progress Fill Line */}
        <div
          className="absolute top-10 left-8 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full z-0 transition-all duration-1000 ease-out shadow-sm"
          style={{ width: `calc(${fillPercent}% * 0.88)` }}
        />

        {/* Step Nodes Grid */}
        <div className="relative z-10 grid grid-cols-6 gap-2">
          {steps.map((step, idx) => {
            const isCompleted = step.state === "COMPLETED" || (status === "CLOSED" && idx <= activeIndex);
            const isCurrent = step.state === "CURRENT" || (idx === activeIndex && status !== "CLOSED");

            return (
              <div key={step.key} className="flex flex-col items-center text-center group">
                {/* Node Button Circle */}
                <div className="relative mb-3">
                  {isCurrent && (
                    <span className="absolute -inset-1.5 rounded-full bg-blue-500/30 dark:bg-blue-400/20 animate-ping" />
                  )}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-md ${
                      isCurrent
                        ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white ring-4 ring-blue-500/30 scale-110"
                        : isCompleted
                        ? "bg-emerald-500 text-white shadow-emerald-500/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isCurrent ? (
                      <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                </div>

                {/* Step Details Box */}
                <div
                  className={`p-3 rounded-2xl w-full border text-left transition-all ${
                    isCurrent
                      ? "bg-blue-50/90 border-blue-300 dark:bg-blue-950/80 dark:border-blue-700 shadow-md"
                      : isCompleted
                      ? "bg-emerald-50/40 dark:bg-slate-800/40 border-emerald-100 dark:border-slate-800"
                      : "bg-slate-50/40 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Step {idx + 1}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-blue-600 text-white animate-pulse">
                        Active
                      </span>
                    )}
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white block text-xs truncate">
                    {step.label}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-1 block truncate">
                    {step.date || "TBA"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile & Tablet Vertical Step Track */}
      <div className="block lg:hidden space-y-4">
        <div className="relative pl-6 space-y-4 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {steps.map((step, idx) => {
            const isCompleted = step.state === "COMPLETED" || (status === "CLOSED" && idx <= activeIndex);
            const isCurrent = step.state === "CURRENT" || (idx === activeIndex && status !== "CLOSED");

            return (
              <div key={step.key} className="relative flex items-start gap-4">
                {/* Node circle */}
                <div
                  className={`absolute -left-6 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-blue-600 text-white ring-4 ring-blue-500/30 animate-pulse"
                      : isCompleted
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                </div>

                {/* Card box */}
                <div
                  className={`flex-1 p-3.5 rounded-2xl border transition-all ${
                    isCurrent
                      ? "bg-blue-50/90 border-blue-300 dark:bg-blue-950/80 dark:border-blue-700 shadow-sm"
                      : isCompleted
                      ? "bg-emerald-50/40 dark:bg-slate-800/40 border-emerald-100 dark:border-slate-800"
                      : "bg-slate-50/40 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-600 text-white animate-pulse">
                        Active Today
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1 block">
                    {step.date || "TBA"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
