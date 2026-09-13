import { format, parseISO } from "date-fns";

export function formatINR(value: number | undefined | null, showSymbol = true): string {
  if (value === undefined || value === null || isNaN(value)) return "₹0";
  const isNegative = value < 0;
  const absVal = Math.abs(value);
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(absVal);
  if (!showSymbol) return isNegative ? `-${formatted}` : formatted;
  return isNegative ? `-₹${formatted}` : `₹${formatted}`;
}

export function formatCrores(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return "₹0 Cr";
  if (value >= 1) {
    return `₹${value.toLocaleString("en-IN")} Cr`;
  }
  return `₹${(value * 100).toFixed(0)} Lakh`;
}

export function formatPercentage(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return "0.0%";
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}%`;
}

export function formatDate(dateString: string | undefined | null, formatStr = "dd MMM yyyy"): string {
  if (!dateString) return "TBA";
  try {
    const parsed = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString);
    if (isNaN(parsed.getTime())) {
      // If simple date string like "2026-09-16"
      const d = new Date(dateString);
      return isNaN(d.getTime()) ? dateString : format(d, formatStr);
    }
    return format(parsed, formatStr);
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string | undefined | null): string {
  return formatDate(dateString, "dd MMM");
}

export function calculateEstimatedProfit(lotSize: number, gmp: number, lotsCount = 1): number {
  return lotSize * gmp * lotsCount;
}

export function calculateEstimatedListingPrice(cutOffPrice: number, gmp: number): number {
  return cutOffPrice + gmp;
}

export function getCleanIpoDisplayName(name?: string, slug?: string): string {
  if (slug === "nse-ipo") return "NSE Exchange";
  return name || "IPO";
}

export function formatIssueSize(rawSize?: string): string {
  if (!rawSize || rawSize.trim() === "" || rawSize.toLowerCase().includes("tba")) {
    return "TBA";
  }

  let cleaned = rawSize
    .replace(/^approx\s*/i, "")
    .replace(/\s*crores?/i, " Cr")
    .replace(/\s*cr$/i, " Cr")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned;
}
