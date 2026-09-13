"use client";

import React, { useMemo } from "react";
import { Check, Calendar, Clock } from "lucide-react";
import { IPODates, IPOStatus } from "@/types/ipo";
import { parseFlexibleDate, addBusinessDays, formatDateDisplay } from "@/lib/utils/dates";

interface TimelineStepperProps {
  dates?: IPODates;
  status: IPOStatus;
}

export function TimelineStepper({ dates, status }: TimelineStepperProps) {
  if (!dates) return null;

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const stepsWithState = useMemo(() => {
    const openParsed = parseFlexibleDate(dates.open, "start");
    const closeParsed = parseFlexibleDate(dates.close, "end");

    // Compute SEBI T+3 tentative dates if dates are TBA but close date is known
    let computedAllotment = parseFlexibleDate(dates.allotment, "end");
    let computedListing = parseFlexibleDate(dates.listing, "end");

    let isAllotmentTentative = false;
    let isListingTentative = false;

    if (closeParsed) {
      if (!computedAllotment) {
        computedAllotment = addBusinessDays(closeParsed, 1);
        isAllotmentTentative = true;
      }
      if (!computedListing) {
        computedListing = addBusinessDays(closeParsed, 3);
        isListingTentative = true;
      }
    }

    const isTba = (s?: string | null) => !s || s.trim().toLowerCase().includes("tba") || s.trim().toLowerCase().includes("n/a");

    // STRICTLY 4 STEPS: Open, Close, Allotment, Listing
    const rawSteps = [
      {
        label: "IPO Open",
        dateText: !isTba(dates.open) ? dates.open!.replace(/[–—]/g, " to ") : (openParsed ? formatDateDisplay(openParsed) : "TBA"),
        parsed: openParsed,
        key: "open",
      },
      {
        label: "IPO Close",
        dateText: !isTba(dates.close) ? dates.close!.replace(/[–—]/g, " to ") : (closeParsed ? formatDateDisplay(closeParsed) : "TBA"),
        parsed: closeParsed,
        key: "close",
      },
      {
        label: "Basis of Allotment",
        dateText: !isTba(dates.allotment)
          ? dates.allotment!.replace(/[–—]/g, " to ")
          : (computedAllotment ? `${formatDateDisplay(computedAllotment)} (Tentative)` : "TBA"),
        parsed: computedAllotment,
        key: "allotment",
      },
      {
        label: "Listing Date",
        dateText: !isTba(dates.listing)
          ? dates.listing!.replace(/[–—]/g, " to ")
          : (computedListing ? `${formatDateDisplay(computedListing)} (Tentative)` : "TBA"),
        parsed: computedListing,
        key: "listing",
      },
    ];

    let lastPassedIndex = -1;
    let currentActiveIndex = -1;

    const evaluated = rawSteps.map((step, idx) => {
      let stepState: "COMPLETED" | "CURRENT" | "UPCOMING" = "UPCOMING";

      if (step.parsed) {
        step.parsed.setHours(0, 0, 0, 0);
        if (step.parsed < today) {
          stepState = "COMPLETED";
          lastPassedIndex = idx;
        } else if (step.parsed.getTime() === today.getTime()) {
          stepState = "CURRENT";
          currentActiveIndex = idx;
        }
      }

      return {
        ...step,
        state: stepState,
      };
    });

    // If IPO status is CLOSED, bidding is closed (Step 0 and Step 1 are completed)
    if (status === "CLOSED" || status === "ALLOTMENT") {
      evaluated[0].state = "COMPLETED";
      evaluated[1].state = "COMPLETED";
      if (lastPassedIndex < 1) lastPassedIndex = 1;
    } else if (status === "LIVE") {
      evaluated[0].state = "COMPLETED";
      if (evaluated[1].state === "UPCOMING") evaluated[1].state = "CURRENT";
      if (currentActiveIndex === -1) currentActiveIndex = 1;
      if (lastPassedIndex < 0) lastPassedIndex = 0;
    }

    const activeIndex = currentActiveIndex >= 0 ? currentActiveIndex : Math.max(0, lastPassedIndex);
    const isAllCompleted = evaluated.every((s) => s.state === "COMPLETED");

    return { steps: evaluated, activeIndex, isAllCompleted };
  }, [dates, status, today]);

  const { steps, activeIndex, isAllCompleted } = stepsWithState;

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

        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800 self-start sm:self-auto shadow-sm">
          <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>
            {isAllCompleted
              ? "All Events Completed"
              : status === "LIVE"
              ? "Bidding Live (Open)"
              : status === "CLOSED"
              ? "Bidding Closed (Allotment / Listing In Progress)"
              : "Upcoming Schedule"}
          </span>
        </div>
      </div>

      {/* Desktop Stepper (4 Steps with Flawless Segmented Connectors) */}
      <div className="hidden md:block">
        {/* Row of Nodes and Seamless Connector Lines */}
        <div className="flex items-center w-full px-6 py-2">
          {steps.map((step, idx) => {
            const isCompleted = step.state === "COMPLETED";
            const isCurrent = step.state === "CURRENT";
            const isNextCompleted = idx < steps.length - 1 && steps[idx + 1].state === "COMPLETED";
            const isNextActive = idx < steps.length - 1 && steps[idx + 1].state === "CURRENT";

            return (
              <React.Fragment key={step.key}>
                {/* Step Circle Node */}
                <div className="relative shrink-0 flex items-center justify-center">
                  {isCurrent && (
                    <span className="absolute -inset-1.5 rounded-full bg-blue-500/30 animate-ping" />
                  )}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md ${
                      isCompleted
                        ? "bg-emerald-500 text-white shadow-emerald-500/25 ring-4 ring-emerald-100 dark:ring-emerald-950/60"
                        : isCurrent
                        ? "bg-blue-600 text-white ring-4 ring-blue-500/20 scale-105"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                </div>

                {/* Connecting Track Line to next node — Fully connects whenever next step is completed */}
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-2 mx-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isNextCompleted
                          ? "bg-emerald-500 w-full"
                          : isNextActive || (isCompleted && idx + 1 === activeIndex)
                          ? "bg-gradient-to-r from-emerald-500 to-blue-500 w-full"
                          : "w-0"
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* 4 Detail Boxes Below Nodes */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 mt-4">
          {steps.map((step, idx) => {
            const isCompleted = step.state === "COMPLETED";
            const isCurrent = step.state === "CURRENT";

            return (
              <div
                key={step.key}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isCurrent
                    ? "bg-blue-50/90 border-blue-300 dark:bg-blue-950/80 dark:border-blue-700 shadow-sm"
                    : isCompleted
                    ? "bg-emerald-50/40 dark:bg-slate-800/40 border-emerald-200 dark:border-emerald-900/40"
                    : "bg-slate-50/40 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 opacity-80"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Step {idx + 1}
                  </span>
                  {isCompleted ? (
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      Completed
                    </span>
                  ) : isCurrent ? (
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-600 text-white">
                      Active Today
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400">
                      Upcoming
                    </span>
                  )}
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white block text-sm sm:text-base tracking-tight">
                  {step.label}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1 block">
                  {step.dateText}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile & Tablet Vertical Step Track (4 Steps) */}
      <div className="block md:hidden space-y-4">
        <div className="relative pl-8 space-y-4 before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {steps.map((step, idx) => {
            const isCompleted = step.state === "COMPLETED";
            const isCurrent = step.state === "CURRENT" || (idx === activeIndex && !isCompleted && !isAllCompleted);

            return (
              <div key={step.key} className="relative flex items-start">
                {/* Node circle */}
                <div
                  className={`absolute -left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-blue-600 text-white ring-4 ring-blue-500/20"
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
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      {step.label}
                    </span>
                    {isCompleted ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        Completed
                      </span>
                    ) : isCurrent ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                        Active Today
                      </span>
                    ) : null}
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 block">
                    {step.dateText}
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
