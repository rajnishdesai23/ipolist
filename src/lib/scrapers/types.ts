import { IPOType } from "@/types/ipo";

export interface ScrapedIPO {
  sourceName: string;
  sourceUrl?: string;
  name: string;
  rawName?: string;
  type: IPOType;
  priceMin?: number;
  priceMax?: number;
  lotSize?: number;
  issueSize?: number;
  gmp?: number;
  kostak?: number;
  sauda?: number;
  openDate?: string;
  closeDate?: string;
  allotmentDate?: string;
  listingDate?: string;
  subscriptionTotal?: number;
  registrarName?: string;
  statusText?: string;
  scrapedAt: string;
}

export interface ScrapeLog {
  id: string;
  timestamp: string;
  durationMs: number;
  status: "SUCCESS" | "PARTIAL" | "FAILED";
  sourcesChecked: {
    name: string;
    status: "OK" | "ERROR";
    itemsCount: number;
    error?: string;
  }[];
  totalProcessed: number;
  totalUpdated: number;
  totalCreated: number;
  totalErrors: number;
}
