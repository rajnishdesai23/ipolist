import { ScrapedIPO } from "./types";

export function normalizeCompanyName(name: string): string {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/\b(limited|ltd|ipo|sme|private|pvt|india|the|corp|corporation)\b/gi, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

export function parseRupees(raw: string | number | undefined | null): number {
  if (typeof raw === "number") return raw;
  if (!raw) return 0;
  const clean = raw.toString().replace(/[₹,rs\s]/gi, "").trim();
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

export function parseDateString(rawDate: string | undefined | null): string {
  if (!rawDate) return "";
  try {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split("T")[0];
    }
  } catch {}
  return rawDate.trim();
}

export function createSlug(name: string, isSme = false): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  const suffix = isSme ? "-sme-ipo" : "-ipo";
  if (base.endsWith("-ipo") || base.endsWith("-sme-ipo")) {
    return base;
  }
  return `${base}${suffix}`;
}
