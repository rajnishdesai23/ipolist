"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid,
  List,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { IPO, IPOType } from "@/types/ipo";
import { IpoLogo } from "@/components/ui/IpoLogo";
import { formatINR } from "@/lib/utils/formatters";

interface IpoCalendarViewProps {
  ipos: IPO[];
}

type ViewMode = "calendar" | "agenda";
type EventTypeFilter = "ALL" | "OPEN" | "CLOSE" | "ALLOTMENT" | "LISTING";

interface CalendarEvent {
  id: string;
  ipoId: string;
  ipoName: string;
  slug: string;
  type: IPOType;
  eventType: "OPEN" | "CLOSE" | "ALLOTMENT" | "LISTING";
  dateStr: string; // e.g. "2026-09-11"
  formattedDate: string;
  dayNumber: number;
  month: number; // 0-11
  year: number;
  gmpVal?: number;
  gmpPct?: number;
  priceRaw?: string;
  status: string;
}

export function IpoCalendarView({ ipos }: IpoCalendarViewProps) {
  // Default to September 2026 (matching dataset dates: 10-18 Sept 2026)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 1)); // September 2026
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [selectedSegment, setSelectedSegment] = useState<"ALL" | "MAINBOARD" | "SME">("MAINBOARD");
  const [eventTypeFilter, setEventTypeFilter] = useState<EventTypeFilter>("ALL");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Helper parser to turn raw date string like "11 Sept 2026" or "September 11, 2026" into a Date object
  const parseIpoDate = (dateStr?: string): Date | null => {
    if (!dateStr || dateStr.toLowerCase().includes("tba")) return null;
    try {
      // Clean string
      const clean = dateStr.replace(/[^a-zA-Z0-9\s]/g, " ").trim();
      const parts = clean.split(/\s+/);
      if (parts.length >= 2) {
        let day = parseInt(parts[0]);
        let monthName = parts[1];
        let year = parts[2] ? parseInt(parts[2]) : 2026;

        if (isNaN(day)) {
          // Check if month comes first: "Sept 11 2026"
          monthName = parts[0];
          day = parseInt(parts[1]);
        }

        const monthsMap: Record<string, number> = {
          jan: 0, january: 0,
          feb: 1, february: 1,
          mar: 2, march: 2,
          apr: 3, april: 3,
          may: 4,
          jun: 5, june: 5,
          jul: 6, july: 6,
          aug: 7, august: 7,
          sep: 8, sept: 8, september: 8,
          oct: 9, october: 9,
          nov: 10, november: 10,
          dec: 11, december: 11,
        };

        const mKey = monthName.toLowerCase().slice(0, 3);
        if (monthsMap[mKey] !== undefined && !isNaN(day)) {
          return new Date(year, monthsMap[mKey], day);
        }
      }
    } catch (e) {
      // Fallback
    }
    return null;
  };

  // Convert all IPO dates into calendar events
  const allEvents = useMemo(() => {
    const events: CalendarEvent[] = [];

    ipos.forEach((ipo) => {
      // Filter by segment
      if (selectedSegment !== "ALL" && ipo.type !== selectedSegment) return;

      const gmpVal = ipo.gmp?.value ?? 0;
      const gmpPct = ipo.gmp?.percentage ?? 0;

      // 1. Opening Date Event
      if (ipo.dates?.open) {
        const d = parseIpoDate(ipo.dates.open);
        if (d) {
          events.push({
            id: `${ipo.id}-open`,
            ipoId: ipo.id,
            ipoName: ipo.name,
            slug: ipo.slug,
            type: ipo.type,
            eventType: "OPEN",
            dateStr: d.toISOString().split("T")[0],
            formattedDate: ipo.dates.open,
            dayNumber: d.getDate(),
            month: d.getMonth(),
            year: d.getFullYear(),
            gmpVal,
            gmpPct,
            priceRaw: ipo.priceBand?.raw,
            status: ipo.status,
          });
        }
      }

      // 2. Closing Date Event
      if (ipo.dates?.close) {
        const d = parseIpoDate(ipo.dates.close);
        if (d) {
          events.push({
            id: `${ipo.id}-close`,
            ipoId: ipo.id,
            ipoName: ipo.name,
            slug: ipo.slug,
            type: ipo.type,
            eventType: "CLOSE",
            dateStr: d.toISOString().split("T")[0],
            formattedDate: ipo.dates.close,
            dayNumber: d.getDate(),
            month: d.getMonth(),
            year: d.getFullYear(),
            gmpVal,
            gmpPct,
            priceRaw: ipo.priceBand?.raw,
            status: ipo.status,
          });
        }
      }

      // 3. Allotment Event
      if (ipo.dates?.allotment) {
        const d = parseIpoDate(ipo.dates.allotment);
        if (d) {
          events.push({
            id: `${ipo.id}-allotment`,
            ipoId: ipo.id,
            ipoName: ipo.name,
            slug: ipo.slug,
            type: ipo.type,
            eventType: "ALLOTMENT",
            dateStr: d.toISOString().split("T")[0],
            formattedDate: ipo.dates.allotment,
            dayNumber: d.getDate(),
            month: d.getMonth(),
            year: d.getFullYear(),
            gmpVal,
            gmpPct,
            priceRaw: ipo.priceBand?.raw,
            status: ipo.status,
          });
        }
      }

      // 4. Listing Event
      if (ipo.dates?.listing) {
        const d = parseIpoDate(ipo.dates.listing);
        if (d) {
          events.push({
            id: `${ipo.id}-listing`,
            ipoId: ipo.id,
            ipoName: ipo.name,
            slug: ipo.slug,
            type: ipo.type,
            eventType: "LISTING",
            dateStr: d.toISOString().split("T")[0],
            formattedDate: ipo.dates.listing,
            dayNumber: d.getDate(),
            month: d.getMonth(),
            year: d.getFullYear(),
            gmpVal,
            gmpPct,
            priceRaw: ipo.priceBand?.raw,
            status: ipo.status,
          });
        }
      }
    });

    return events;
  }, [ipos, selectedSegment]);

  // Filter events by eventType filter
  const filteredEvents = useMemo(() => {
    if (eventTypeFilter === "ALL") return allEvents;
    return allEvents.filter((e) => e.eventType === eventTypeFilter);
  }, [allEvents, eventTypeFilter]);

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Calendar Grid Days Calculation
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    // Monday as start of week (0 = Monday, 6 = Sunday)
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const days: { date: Date; isCurrentMonth: boolean; dayNum: number }[] = [];

    // Previous month padding days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        dayNum: prevMonthLastDay - i,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        date: new Date(year, month, d),
        isCurrentMonth: true,
        dayNum: d,
      });
    }

    // Next month padding days to complete grid 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        dayNum: i,
      });
    }

    return days;
  }, [year, month]);

  // Get events for a specific day cell
  const getEventsForDay = (d: Date) => {
    const dYear = d.getFullYear();
    const dMonth = d.getMonth();
    const dDay = d.getDate();

    return filteredEvents.filter(
      (e) => e.year === dYear && e.month === dMonth && e.dayNumber === dDay
    );
  };

  // Event styling helper
  const getEventBadgeStyle = (type: "OPEN" | "CLOSE" | "ALLOTMENT" | "LISTING") => {
    switch (type) {
      case "OPEN":
        return {
          label: "Opens",
          bgColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800",
          dotColor: "bg-blue-500",
        };
      case "CLOSE":
        return {
          label: "Closes",
          bgColor: "bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800",
          dotColor: "bg-amber-500",
        };
      case "ALLOTMENT":
        return {
          label: "Allotment",
          bgColor: "bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800",
          dotColor: "bg-purple-500",
        };
      case "LISTING":
        return {
          label: "Listing",
          bgColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
          dotColor: "bg-emerald-500",
        };
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Bar: Month Controls, Category Filters & View Toggle */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Month Switcher */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-1.5 font-extrabold text-sm sm:text-base text-slate-900 dark:text-white min-w-[140px] text-center">
                {monthNames[month]} {year}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Today Quick Jump */}
            <button
              onClick={() => setCurrentDate(new Date(2026, 8, 1))}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 transition-all"
            >
              Current Schedule
            </button>
          </div>

          {/* Segment Filter (Mainboard vs SME vs All) */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSelectedSegment("MAINBOARD")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedSegment === "MAINBOARD"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Mainboard ({ipos.filter((i) => i.type === "MAINBOARD").length})
            </button>
            <button
              onClick={() => setSelectedSegment("ALL")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedSegment === "ALL"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              All Market ({ipos.length})
            </button>
            <button
              onClick={() => setSelectedSegment("SME")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedSegment === "SME"
                  ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              SME ({ipos.filter((i) => i.type === "SME").length})
            </button>
          </div>

          {/* View Mode Toggle: Grid vs Agenda */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === "calendar"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Month Grid</span>
            </button>
            <button
              onClick={() => setViewMode("agenda")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === "agenda"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Timeline List</span>
            </button>
          </div>
        </div>

        {/* Legend / Event Type Filter Badges */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-none">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            Legend:
          </span>

          <button
            onClick={() => setEventTypeFilter("ALL")}
            className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all border ${
              eventTypeFilter === "ALL"
                ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900"
                : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            Show All Events
          </button>

          <button
            onClick={() => setEventTypeFilter("OPEN")}
            className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all border flex items-center gap-1.5 ${
              eventTypeFilter === "OPEN"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Bidding Opens</span>
          </button>

          <button
            onClick={() => setEventTypeFilter("CLOSE")}
            className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all border flex items-center gap-1.5 ${
              eventTypeFilter === "CLOSE"
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Bidding Closes</span>
          </button>

          <button
            onClick={() => setEventTypeFilter("ALLOTMENT")}
            className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all border flex items-center gap-1.5 ${
              eventTypeFilter === "ALLOTMENT"
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Allotment Status</span>
          </button>

          <button
            onClick={() => setEventTypeFilter("LISTING")}
            className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all border flex items-center gap-1.5 ${
              eventTypeFilter === "LISTING"
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Listing Day</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: PROPER MONTHLY CALENDAR GRID */}
      {viewMode === "calendar" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3 sm:p-6 shadow-sm overflow-x-auto">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center min-w-[700px]">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((dayName, idx) => (
              <div
                key={dayName}
                className={`py-2 text-xs font-extrabold tracking-wider uppercase ${
                  idx >= 5 ? "text-rose-500 dark:text-rose-400" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {dayName}
              </div>
            ))}
          </div>

          {/* Monthly Day Cells Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 min-w-[700px]">
            {calendarDays.map((dayItem, cellIdx) => {
              const dayEvents = getEventsForDay(dayItem.date);
              const hasEvents = dayEvents.length > 0;
              const isWeekend = dayItem.date.getDay() === 0 || dayItem.date.getDay() === 6;

              return (
                <div
                  key={cellIdx}
                  className={`min-h-[110px] sm:min-h-[130px] p-1.5 sm:p-2.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    !dayItem.isCurrentMonth
                      ? "bg-slate-50/50 dark:bg-slate-950/40 border-slate-100 dark:border-slate-900 text-slate-300 dark:text-slate-700"
                      : hasEvents
                      ? "bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/60 shadow-sm hover:border-indigo-400"
                      : isWeekend
                      ? "bg-slate-50/70 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/60 text-slate-400"
                      : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                  }`}
                >
                  {/* Top Day Number Row */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs sm:text-sm font-black w-6 h-6 rounded-full flex items-center justify-center ${
                        hasEvents
                          ? "bg-indigo-600 text-white shadow-sm"
                          : dayItem.isCurrentMonth
                          ? "text-slate-800 dark:text-slate-200"
                          : "text-slate-300 dark:text-slate-700"
                      }`}
                    >
                      {dayItem.dayNum}
                    </span>
                    {hasEvents && (
                      <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded-md">
                        {dayEvents.length} event{dayEvents.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {/* Day Events List */}
                  <div className="space-y-1 overflow-y-auto max-h-[85px] scrollbar-none flex-1">
                    {dayEvents.map((evt) => {
                      const style = getEventBadgeStyle(evt.eventType);
                      return (
                        <div
                          key={evt.id}
                          onClick={() => setSelectedEvent(evt)}
                          className={`cursor-pointer p-1.5 rounded-xl border text-[10px] sm:text-[11px] font-bold flex items-center justify-between gap-1 transition-all hover:scale-[1.02] shadow-2xs ${style.bgColor}`}
                          title={`${evt.ipoName} - ${style.label}`}
                        >
                          <div className="flex items-center gap-1 truncate min-w-0">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dotColor}`} />
                            <span className="truncate">{evt.ipoName}</span>
                          </div>
                          <span className="font-extrabold flex-shrink-0 uppercase text-[9px] opacity-90">
                            {style.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: CHRONOLOGICAL AGENDA TIMELINE LIST */}
      {viewMode === "agenda" && (
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              No calendar events found for the selected category or filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEvents.map((evt) => {
                const style = getEventBadgeStyle(evt.eventType);
                return (
                  <div
                    key={evt.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center min-w-[60px] text-center ${style.bgColor}`}>
                        <span className="text-[10px] font-extrabold uppercase block">{evt.eventType}</span>
                        <span className="text-lg font-black block leading-none mt-0.5">{evt.dayNumber}</span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {evt.type}
                          </span>
                          {evt.gmpPct && evt.gmpPct > 0 ? (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-md">
                              GMP +{evt.gmpPct}%
                            </span>
                          ) : null}
                        </div>

                        <Link href={`/ipo/${evt.slug}`} className="block hover:text-indigo-600 font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                          {evt.ipoName}
                        </Link>
                        <span className="text-xs text-slate-500 block truncate mt-0.5">
                          Date: {evt.formattedDate}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/ipo/${evt.slug}`}
                      className="px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* QUICK EVENT DETAIL MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${getEventBadgeStyle(selectedEvent.eventType).bgColor}`}>
                {getEventBadgeStyle(selectedEvent.eventType).label} Date
              </span>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {selectedEvent.ipoName}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Event Date: <strong className="text-slate-800 dark:text-slate-200">{selectedEvent.formattedDate}</strong>
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">IPO Category:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedEvent.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Live GMP Premium:</span>
                <span className="font-bold text-emerald-600">
                  {selectedEvent.gmpVal ? `+₹${selectedEvent.gmpVal} (${selectedEvent.gmpPct}%)` : "₹0"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Price Band:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedEvent.priceRaw || "TBA"}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setSelectedEvent(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <Link
                href={`/ipo/${selectedEvent.slug}`}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 text-center transition-colors shadow-sm"
              >
                Full IPO Details
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
