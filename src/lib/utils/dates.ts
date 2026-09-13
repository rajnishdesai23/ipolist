import { IPODates, IPOStatus, IPO } from "@/types/ipo";

/**
 * Checks if a string is considered "TBA", "N/A", or empty
 */
export function isTbaDate(str?: string | null): boolean {
  if (!str) return true;
  const s = str.trim().toLowerCase();
  return s === "" || s.includes("tba") || s.includes("n/a") || s === "-";
}

/**
 * Adds business days (excluding Saturday and Sunday)
 */
export function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      added++;
    }
  }
  return result;
}

/**
 * Formats date object to Indian readable format (e.g., "Sep 12, 2026")
 */
export function formatDateDisplay(d: Date): string {
  return d.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Robust date parser for various IPO date formats:
 * - "September 11, 2026"
 * - "11 Sept 2026", "11 Sep 2026"
 * - "11 Sept" (appends default current/relevant year)
 * - "9-11 Sept" (extracts the specified boundary)
 * - "2026-09-11"
 */
export function parseFlexibleDate(
  dateStr?: string | null,
  boundary: "start" | "end" = "end",
  defaultYear: number = new Date().getFullYear()
): Date | null {
  if (!dateStr || isTbaDate(dateStr)) return null;

  let cleaned = dateStr
    .replace(/[–—]/g, "-")
    .replace(/\s+to\s+/i, "-")
    .trim();

  // If date range like "9-11 Sept" or "9 - 11 Sep 2026"
  if (cleaned.includes("-")) {
    const parts = cleaned.split("-").map((p) => p.trim());
    if (boundary === "start") {
      // If start is just day number like "9", append month/year from part 2
      const first = parts[0];
      const second = parts[1];
      if (/^\d{1,2}$/.test(first)) {
        const monthYearMatch = second.match(/[a-zA-Z]+(?:\s+\d{4})?/);
        if (monthYearMatch) {
          cleaned = `${first} ${monthYearMatch[0]}`;
        }
      } else {
        cleaned = first;
      }
    } else {
      cleaned = parts[parts.length - 1];
    }
  }

  // Strip ordinal suffixes: 1st, 2nd, 3rd, 4th
  cleaned = cleaned.replace(/(\d+)(st|nd|rd|th)/gi, "$1");

  // If no year present (e.g. "11 Sept"), append current year
  if (!/\d{4}/.test(cleaned)) {
    cleaned = `${cleaned} ${defaultYear}`;
  }

  const parsed = new Date(cleaned);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Resolves allotment date: if TBA/missing and IPO has close date,
 * computes SEBI T+1 exact business day date!
 */
export function getSmartAllotmentDate(
  dates?: IPODates,
  status?: IPOStatus
): {
  displayText: string;
  isEstimated: boolean;
  dateObj: Date | null;
} {
  if (!dates) {
    return { displayText: "TBA", isEstimated: false, dateObj: null };
  }

  // 1. If explicit allotment date exists and is not TBA
  if (!isTbaDate(dates.allotment)) {
    const parsed = parseFlexibleDate(dates.allotment, "end");
    return {
      displayText: dates.allotment!.replace(/[–—]/g, " to "),
      isEstimated: false,
      dateObj: parsed,
    };
  }

  // 2. If allotment is TBA but close date is known (especially if closed or closing)
  if (!isTbaDate(dates.close)) {
    const closeParsed = parseFlexibleDate(dates.close, "end");
    if (closeParsed) {
      const estimated = addBusinessDays(closeParsed, 1);
      return {
        displayText: formatDateDisplay(estimated),
        isEstimated: true,
        dateObj: estimated,
      };
    }
  }

  return { displayText: "TBA", isEstimated: false, dateObj: null };
}

/**
 * Calculates event-wise proximity score for Allotment page sorting:
 * Keeps IPOs with allotment date nearby (today/upcoming) on TOP.
 */
export function getAllotmentProximityScore(ipo: IPO): number {
  const isOut = ipo.allotment?.status === "OUT" || ipo.rawStatus?.toLowerCase().includes("allotment out");
  const { dateObj, isEstimated } = getSmartAllotmentDate(ipo.dates, ipo.status);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // 1. Allotment is confirmed OUT right now
  if (isOut) {
    return 100000;
  }

  if (dateObj) {
    const target = new Date(dateObj);
    target.setHours(0, 0, 0, 0);
    const diffDays = Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Today's allotment
    if (diffDays === 0) {
      return 90000;
    }
    // Tomorrow's allotment
    if (diffDays === 1) {
      return 85000;
    }
    // Upcoming in next 2 to 7 days (Nearby allotment)
    if (diffDays > 1 && diffDays <= 7) {
      return 70000 - diffDays * 1000;
    }
    // Upcoming within 30 days
    if (diffDays > 7 && diffDays <= 30) {
      return 50000 - diffDays * 500;
    }
    // Allotment was yesterday or 2 days ago (recent)
    if (diffDays === -1 || diffDays === -2) {
      return 80000;
    }
    // Past within last 7 days
    if (diffDays < 0 && diffDays >= -7) {
      return 30000 + diffDays * 1000;
    }
    // Older past
    return 10000 + Math.max(-5000, diffDays * 100);
  }

  // Closed bidding awaiting date
  if (ipo.status === "CLOSED") {
    return 25000;
  }

  // Live bidding
  if (ipo.status === "LIVE") {
    return 15000;
  }

  // Upcoming bidding
  return 5000;
}
