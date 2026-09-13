import { IPO, IPOFilterOptions } from "@/types/ipo";
import { db } from "@/lib/firebase/client";
import { collection, doc, setDoc, getDocs, deleteDoc } from "firebase/firestore";
import { scrapeAllIpos } from "@/lib/scrapers/ipowatch";

// In-memory cache for fast SSR / Edge delivery
let inMemoryIpos: IPO[] = [];
let isScrapingInProgress = false;

export async function getAllIpos(options?: IPOFilterOptions): Promise<IPO[]> {
  // If in-memory is empty, try loading from Firestore
  if (inMemoryIpos.length === 0 && db) {
    try {
      const snapshot = await getDocs(collection(db, "ipos"));
      if (!snapshot.empty) {
        inMemoryIpos = snapshot.docs.map((d) => d.data() as IPO);
      }
    } catch (e: any) {
      // Permission might be pending in Firebase Console rules
    }
  }

  // If still empty and not currently scraping, perform immediate live scrape
  if (inMemoryIpos.length === 0 && !isScrapingInProgress) {
    isScrapingInProgress = true;
    try {
      console.log("Empty database detected: Performing live bootstrap scrape from IPOWatch...");
      const scraped = await scrapeAllIpos();
      if (scraped.length > 0) {
        await saveAllIpos(scraped);
      }
    } catch (err) {
      console.error("Bootstrap scrape error:", err);
    } finally {
      isScrapingInProgress = false;
    }
  }

  let list = [...inMemoryIpos];

  if (options?.type && options.type !== "ALL") {
    list = list.filter((item) => item.type === options.type);
  }

  if (options?.status && options.status !== "ALL") {
    list = list.filter((item) => item.status === options.status);
  }

  if (options?.searchQuery) {
    const q = options.searchQuery.toLowerCase().trim();
    list = list.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q)
    );
  }

  if (options?.sortBy) {
    const dir = options.sortDirection === "asc" ? 1 : -1;
    if (options.sortBy === "gmp") {
      list.sort((a, b) => ((a.gmp?.percentage || 0) - (b.gmp?.percentage || 0)) * dir);
    } else if (options.sortBy === "date") {
      list.sort((a, b) => ((a.dates?.open || "") > (b.dates?.open || "") ? 1 : -1) * dir);
    }
  }

  return list;
}

export async function getIpoBySlug(slug: string): Promise<IPO | null> {
  const ipos = await getAllIpos();
  const normalizedSlug = slug.toLowerCase().replace(/-ipo$/, "").replace(/-details$/, "").trim();

  const found = ipos.find((item) => {
    const itemSlug = item.slug.toLowerCase();
    const itemId = item.id.toLowerCase();
    return (
      itemSlug === slug ||
      itemId === slug ||
      itemSlug === normalizedSlug ||
      itemSlug.replace(/-ipo$/, "") === normalizedSlug ||
      itemId.replace(/-ipo$/, "") === normalizedSlug
    );
  });

  return found || null;
}

export async function getLiveIpos(): Promise<IPO[]> {
  return getAllIpos({ status: "LIVE" });
}

export async function getUpcomingIpos(): Promise<IPO[]> {
  return getAllIpos({ status: "UPCOMING" });
}

export async function getClosedIpos(): Promise<IPO[]> {
  return getAllIpos({ status: "CLOSED" });
}

export async function getMainboardIpos(): Promise<IPO[]> {
  return getAllIpos({ type: "MAINBOARD" });
}

export async function getSmeIpos(): Promise<IPO[]> {
  return getAllIpos({ type: "SME" });
}

export async function getTopGmpIpos(limitCount = 6): Promise<IPO[]> {
  const all = await getAllIpos();
  return [...all]
    .sort((a, b) => (b.gmp?.percentage || 0) - (a.gmp?.percentage || 0))
    .slice(0, limitCount);
}

export async function saveIpo(ipoData: IPO): Promise<IPO> {
  const index = inMemoryIpos.findIndex((i) => i.id === ipoData.id || i.slug === ipoData.slug);
  const updatedItem: IPO = {
    ...ipoData,
    updatedAt: new Date().toISOString(),
    createdAt: ipoData.createdAt || new Date().toISOString(),
  };

  if (index >= 0) {
    inMemoryIpos[index] = updatedItem;
  } else {
    inMemoryIpos.unshift(updatedItem);
  }

  // Persist to Firestore
  if (db) {
    try {
      const docRef = doc(db, "ipos", updatedItem.slug || updatedItem.id);
      await setDoc(docRef, updatedItem, { merge: true });
    } catch (err: any) {
      console.warn("Firestore save notice:", err?.message || err);
    }
  }

  return updatedItem;
}

export async function updateIpoGmp(
  idOrSlug: string,
  newGmpValue: number,
  isManualOverride = true
): Promise<IPO | null> {
  const index = inMemoryIpos.findIndex((i) => i.id === idOrSlug || i.slug === idOrSlug);
  if (index < 0) return null;

  const current = inMemoryIpos[index];
  const maxPrice = current.priceBand?.max || 100;
  const percentage = Number(((newGmpValue / maxPrice) * 100).toFixed(2));
  const expectedListingPrice = maxPrice + newGmpValue;

  const updated: IPO = {
    ...current,
    gmp: {
      ...current.gmp,
      value: newGmpValue,
      percentage,
      expectedListingPrice,
      lastUpdated: new Date().toISOString(),
    },
    updatedAt: new Date().toISOString(),
  };

  inMemoryIpos[index] = updated;

  if (db) {
    try {
      const docRef = doc(db, "ipos", updated.slug || updated.id);
      await setDoc(docRef, updated, { merge: true });
    } catch (err: any) {
      console.warn("Firestore GMP update notice:", err?.message || err);
    }
  }

  return updated;
}

export async function saveAllIpos(ipos: IPO[]): Promise<void> {
  inMemoryIpos = ipos;

  if (db && ipos.length > 0) {
    try {
      for (const ipo of ipos) {
        const docRef = doc(db, "ipos", ipo.slug || ipo.id);
        await setDoc(docRef, ipo, { merge: true });
      }
      console.log(`Successfully stored ${ipos.length} IPOs in Firestore.`);
    } catch (err: any) {
      console.warn("Firestore batch write notice:", err?.message || err);
    }
  }
}

export async function deleteIpo(id: string): Promise<boolean> {
  const initialLength = inMemoryIpos.length;
  inMemoryIpos = inMemoryIpos.filter((i) => i.id !== id);

  if (db) {
    try {
      const docRef = doc(db, "ipos", id);
      await deleteDoc(docRef);
    } catch (err: any) {
      console.warn("Firestore delete notice:", err?.message || err);
    }
  }

  return inMemoryIpos.length < initialLength;
}
