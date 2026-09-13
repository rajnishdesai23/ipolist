import { IPO, IPOFilterOptions } from "@/types/ipo";
import { db } from "@/lib/firebase/client";
import { collection, doc, setDoc, getDocs, deleteDoc } from "firebase/firestore";
import { scrapeAllIpos } from "@/lib/scrapers/ipowatch";
import { sortIposByStatusPriority } from "@/lib/utils/status";

// In-memory cache for fast SSR / Edge delivery
let inMemoryIpos: IPO[] = [];
let isScrapingInProgress = false;

export async function getAllIpos(options?: IPOFilterOptions): Promise<IPO[]> {
  // If in-memory is empty, try loading from Firestore
  if (inMemoryIpos.length === 0 && db) {
    try {
      const snapshot = await getDocs(collection(db, "ipos"));
      if (!snapshot.empty) {
        inMemoryIpos = snapshot.docs.map((d: any) => d.data() as IPO);
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
    } else if (options.sortBy === "status") {
      list = sortIposByStatusPriority(list);
      if (options.sortDirection === "asc") list.reverse();
    }
  } else {
    // Default sorting: Live -> Allotment Out -> Allotment Awaited -> Upcoming -> Closed
    list = sortIposByStatusPriority(list);
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

function sanitizeForFirestore<T>(data: T): Record<string, any> {
  return JSON.parse(JSON.stringify(data, (_, value) => (value === undefined ? null : value)));
}

export async function saveIpo(ipoData: IPO): Promise<IPO> {
  const targetId = ipoData.slug || ipoData.id;
  const index = inMemoryIpos.findIndex((i) => i.id === ipoData.id || i.slug === ipoData.slug);
  const existing = index >= 0 ? inMemoryIpos[index] : null;

  const updatedItem: IPO = {
    ...existing,
    ...ipoData,
    createdAt: existing?.createdAt || ipoData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    inMemoryIpos[index] = updatedItem;
  } else {
    inMemoryIpos.unshift(updatedItem);
  }

  // Persist to Firestore
  if (db) {
    try {
      const docRef = doc(db, "ipos", targetId);
      await setDoc(docRef, sanitizeForFirestore(updatedItem), { merge: true });
    } catch (err: any) {
      if (err?.code === "permission-denied" || err?.message?.includes("PERMISSION_DENIED")) {
        console.error("Firestore Error [PERMISSION_DENIED]: Please update your Firestore Rules in Firebase Console to allow write access to the 'ipos' collection.");
      } else {
        console.warn("Firestore save notice:", err?.message || err);
      }
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
      await setDoc(docRef, sanitizeForFirestore(updated), { merge: true });
    } catch (err: any) {
      console.warn("Firestore GMP update notice:", err?.message || err);
    }
  }

  return updated;
}

export async function saveAllIpos(scrapedIpos: IPO[]): Promise<void> {
  if (!scrapedIpos || scrapedIpos.length === 0) return;

  const upsertedList: IPO[] = [...inMemoryIpos];
  let successCount = 0;
  let errorCount = 0;

  for (const newItem of scrapedIpos) {
    const docId = newItem.slug || newItem.id;
    const existingIndex = upsertedList.findIndex(
      (item) => item.id === newItem.id || item.slug === newItem.slug
    );

    let finalIpo: IPO;

    if (existingIndex >= 0) {
      // UPSERT: Merge existing record with updated scraped fields
      const existing = upsertedList[existingIndex];
      finalIpo = {
        ...existing,
        ...newItem,
        // Preserve manual GMP override if set
        gmp: existing.gmp?.percentage && !newItem.gmp?.percentage ? existing.gmp : (newItem.gmp || existing.gmp),
        createdAt: existing.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      upsertedList[existingIndex] = finalIpo;
    } else {
      // CREATE NEW record
      finalIpo = {
        ...newItem,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      upsertedList.push(finalIpo);
    }

    // Store in Firestore doc with { merge: true }
    if (db) {
      try {
        const docRef = doc(db, "ipos", docId);
        await setDoc(docRef, sanitizeForFirestore(finalIpo), { merge: true });
        successCount++;
      } catch (err: any) {
        errorCount++;
        if (err?.code === "permission-denied" || err?.message?.includes("PERMISSION_DENIED")) {
          console.error(`[Firestore Security Warning] Cannot write IPO '${docId}'. Firestore Security Rules in Firebase Console are set to read-only or permission denied.`);
        } else {
          console.warn(`Firestore write error for '${docId}':`, err?.message || err);
        }
      }
    }
  }

  inMemoryIpos = upsertedList;

  if (successCount > 0) {
    console.log(`Successfully upserted ${successCount} IPO records in Firestore database.`);
  } else if (errorCount > 0) {
    console.warn(`Attempted to save ${errorCount} IPOs, but Firestore writes were rejected due to Firestore Security Rules.`);
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
