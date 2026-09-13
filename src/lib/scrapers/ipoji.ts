import { ScrapedIPO } from "./types";

export async function scrapeIpoJi(): Promise<ScrapedIPO[]> {
  try {
    const res = await fetch("https://www.ipoji.com/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; IPOListBot/1.0)",
      },
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return [];
  } catch (error) {
    return [];
  }
}
