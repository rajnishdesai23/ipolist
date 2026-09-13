import { IPO } from "@/types/ipo";
import { ScrapedIPO } from "./types";
import { normalizeCompanyName } from "./normalizer";

export function generateFingerprint(name: string, openDate?: string, maxPrice?: number, type = "MAINBOARD"): string {
  const normName = normalizeCompanyName(name);
  const dateStr = openDate || "nodate";
  const priceStr = maxPrice ? maxPrice.toString() : "noprice";
  return `${normName}|${dateStr}|${priceStr}|${type.toLowerCase()}`;
}

export function findMatchingIpo(scraped: ScrapedIPO, existingIpos: IPO[]): IPO | null {
  const normScraped = normalizeCompanyName(scraped.name);
  if (!normScraped) return null;

  // 1. Exact match on normalized name
  const exactNameMatch = existingIpos.find((item) => {
    const normExisting = normalizeCompanyName(item.name);
    return normExisting === normScraped && item.type === scraped.type;
  });

  if (exactNameMatch) return exactNameMatch;

  // 2. Substring match if name is long enough
  if (normScraped.length >= 5) {
    const fuzzyMatch = existingIpos.find((item) => {
      const normExisting = normalizeCompanyName(item.name);
      return (
        (normExisting.includes(normScraped) || normScraped.includes(normExisting)) &&
        item.type === scraped.type
      );
    });
    if (fuzzyMatch) return fuzzyMatch;
  }

  return null;
}
