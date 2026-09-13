import { saveAllIpos } from "@/lib/data/ipoRepository";
import { scrapeAllIpos } from "./ipowatch";
import { ScrapeLog } from "./types";

let inMemoryScrapeLogs: ScrapeLog[] = [];

export async function getScrapeLogs(): Promise<ScrapeLog[]> {
  return inMemoryScrapeLogs;
}

export async function runScraperSync(): Promise<ScrapeLog> {
  const startTime = Date.now();
  let totalProcessed = 0;
  let totalErrors = 0;
  let status: "SUCCESS" | "PARTIAL" | "FAILED" = "SUCCESS";
  let errorMessage = "";

  try {
    const scrapedIpos = await scrapeAllIpos();
    totalProcessed = scrapedIpos.length;

    if (scrapedIpos.length > 0) {
      await saveAllIpos(scrapedIpos);
    }
  } catch (error: any) {
    totalErrors++;
    status = "FAILED";
    errorMessage = error?.message || "Scraper execution failed";
    console.error("Scraper sync error:", error);
  }

  const durationMs = Date.now() - startTime;
  const log: ScrapeLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    durationMs,
    status,
    sourcesChecked: [
      {
        name: "IPOWatch (Mainboard & SME Tables + Detail Pages)",
        status: totalErrors === 0 ? "OK" : "ERROR",
        itemsCount: totalProcessed,
        error: errorMessage || undefined,
      },
    ],
    totalProcessed,
    totalUpdated: totalProcessed,
    totalCreated: 0,
    totalErrors,
  };

  inMemoryScrapeLogs.unshift(log);
  return log;
}
