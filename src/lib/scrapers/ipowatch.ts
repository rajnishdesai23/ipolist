import { IPO, IPOStatus, IPOType, MarketLotItem, ReservationItem, FinancialRecord, ValuationKPIs, PromoterHoldingItem, ObjectOfIssue, RegistrarInfo, IPOFaq } from "@/types/ipo";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function cleanText(text: string): string {
  if (!text) return "";
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8377;/g, "₹")
    .replace(/&amp;/g, "&")
    .replace(/&#8211;/g, "-")
    .replace(/&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function parseRupees(str?: string): number {
  if (!str) return 0;
  const cleaned = str.replace(/[^0-9.]/g, "");
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url} (HTTP ${res.status})`);
  }
  return res.text();
}

function parseDetailsPage(html: string) {
  const details: Record<string, string> = {};
  const marketLot: MarketLotItem[] = [];
  const reservation: ReservationItem[] = [];
  const datesTimeline: Record<string, string> = {};
  const financials: FinancialRecord[] = [];
  const valuationKPIs: ValuationKPIs = {};
  const promoterHolding: Record<string, PromoterHoldingItem> = {};
  const objectsOfIssue: ObjectOfIssue[] = [];
  let registrar: RegistrarInfo | undefined;
  let aboutCompany: string | undefined;
  const faqs: IPOFaq[] = [];

  const tables = html.match(/<table[\s\S]*?<\/table>/gi) || [];

  tables.forEach((tableHtml) => {
    const idx = html.indexOf(tableHtml);
    const preceding = cleanText(html.substring(Math.max(0, idx - 250), idx)).toLowerCase();
    const rows = tableHtml.match(/<tr[\s\S]*?<\/tr>/gi) || [];
    if (!rows.length) return;

    // 1. Overview Details
    if (preceding.includes("ipo details") || preceding.includes("issue details") || preceding.includes("ipo detail")) {
      rows.forEach((r) => {
        const cells = (r.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || []).map(cleanText);
        if (cells.length >= 2) {
          const key = cells[0].toLowerCase().replace(/[:\s]+/g, "_").trim();
          details[key] = cells[1];
        }
      });
    }
    // 2. Market Lot
    else if (preceding.includes("market lot") || preceding.includes("lot size") || preceding.includes("application")) {
      rows.forEach((r, rowIdx) => {
        if (rowIdx === 0 && r.includes("<th")) return;
        const cells = (r.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || []).map(cleanText);
        if (cells.length >= 3) {
          marketLot.push({
            application: cells[0],
            lots: cells[1],
            shares: cells[2],
            amount: cells[3] || "",
          });
        }
      });
    }
    // 3. Reservation
    else if (preceding.includes("reservation") || preceding.includes("investor category") || preceding.includes("share offered")) {
      rows.forEach((r, rowIdx) => {
        if (rowIdx === 0 && r.includes("<th")) return;
        const cells = (r.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || []).map(cleanText);
        if (cells.length >= 2) {
          reservation.push({
            category: cells[0],
            sharesOffered: cells[1] || "",
            percentage: cells[2] || "",
          });
        }
      });
    }
    // 4. Dates / Timetable
    else if (preceding.includes("dates") || preceding.includes("timetable") || preceding.includes("tentative")) {
      rows.forEach((r) => {
        const cells = (r.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || []).map(cleanText);
        if (cells.length >= 2) {
          const key = cells[0].toLowerCase().replace(/[:\s]+/g, "_").trim();
          datesTimeline[key] = cells[1];
        }
      });
    }
    // 5. Financials
    else if (preceding.includes("financial") || preceding.includes("period ended")) {
      const headers = rows[0] ? (rows[0].match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || []).map(cleanText) : [];
      for (let i = 1; i < rows.length; i++) {
        const cells = (rows[i].match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || []).map(cleanText);
        if (cells.length >= 2) {
          const rowObj: FinancialRecord = {};
          cells.forEach((c, cIdx) => {
            const h = headers[cIdx] || `col_${cIdx}`;
            rowObj[h] = c;
          });
          financials.push(rowObj);
        }
      }
    }
    // 6. Valuation / KPIs
    else if (preceding.includes("valuation") || preceding.includes("kpi")) {
      rows.forEach((r) => {
        const cells = (r.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || []).map(cleanText);
        if (cells.length >= 2) {
          const key = cells[0].toLowerCase().replace(/[:\s]+/g, "_").trim();
          (valuationKPIs as Record<string, string>)[key] = cells[1];
        }
      });
    }
    // 7. Promoters Holding
    else if (preceding.includes("promoter") || preceding.includes("holding pattern")) {
      rows.forEach((r, rowIdx) => {
        if (rowIdx === 0 && r.includes("<th")) return;
        const cells = (r.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || []).map(cleanText);
        if (cells.length >= 3) {
          promoterHolding[cells[0]] = {
            preShares: cells[1],
            prePercent: cells[2],
            postShares: cells[3] || "",
            postPercent: cells[4] || "",
          };
        }
      });
    }
    // 8. Objects of the Issue
    else if (preceding.includes("objects") || preceding.includes("utilisation")) {
      rows.forEach((r, rowIdx) => {
        if (rowIdx === 0) return;
        const cells = (r.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || []).map(cleanText);
        if (cells.length >= 1) {
          objectsOfIssue.push({
            purpose: cells[0],
            amount: cells[1] || "",
          });
        }
      });
    }
  });

  // Extract Registrar
  const registrarMatch =
    html.match(/IPO Registrar[\s\S]*?(<p[\s\S]*?<\/p>)/i) ||
    html.match(/Registrar:?([\s\S]*?)(?:<\/p>|<h[1-6])/i);
  if (registrarMatch) {
    const regText = cleanText(registrarMatch[1]);
    const phoneMatch = regText.match(/Phone:?\s*([\d\s,-]+)/i);
    const emailMatch = regText.match(/Email:?\s*([^\s,]+)/i);
    const webMatch = regText.match(/Website:?\s*(https?:\/\/[^\s]+)/i);

    registrar = {
      raw: regText,
      name: regText.split("Phone")[0]?.split("Website")[0]?.split("Email")[0]?.trim() || regText,
      phone: phoneMatch ? phoneMatch[1].trim() : undefined,
      email: emailMatch ? emailMatch[1].trim() : undefined,
      website: webMatch ? webMatch[1].trim() : undefined,
    };
  }

  // Extract About Company
  const aboutMatch = html.match(/About [^<]+<\/h[2-4]>([\s\S]*?)(?:<h[2-4]|<table)/i);
  if (aboutMatch) {
    aboutCompany = cleanText(aboutMatch[1]).slice(0, 1500);
  }

  // Extract FAQs
  const faqQuestions = html.match(/<h[34][^>]*>(What is[^<]+|When[^<]+|How to[^<]+)<\/h[34]>/gi) || [];
  faqQuestions.forEach((q) => {
    const qClean = cleanText(q);
    const qIdx = html.indexOf(q);
    if (qIdx !== -1) {
      const rest = html.substring(qIdx + q.length, qIdx + q.length + 500);
      const ansMatch = rest.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
      if (ansMatch) {
        faqs.push({
          question: qClean,
          answer: cleanText(ansMatch[1]),
        });
      }
    }
  });

  return {
    details,
    marketLot,
    reservation,
    datesTimeline,
    financials,
    valuationKPIs,
    promoterHolding,
    objectsOfIssue,
    registrar,
    aboutCompany,
    faqs,
  };
}

export async function scrapeAllIpos(): Promise<IPO[]> {
  const mainUrl = "https://ipowatch.in/ipo-grey-market-premium-latest-ipo-gmp/";
  const mainHtml = await fetchHtml(mainUrl);
  const tables = mainHtml.match(/<table[\s\S]*?<\/table>/gi) || [];

  if (tables.length < 2) {
    console.warn("Could not find Mainboard and SME tables on IPOWatch");
  }

  const tableConfigs: { type: IPOType; table?: string }[] = [
    { type: "MAINBOARD", table: tables[0] },
    { type: "SME", table: tables[1] },
  ];

  interface RawRow {
    name: string;
    detailUrl?: string;
    type: IPOType;
    gmpVal: number;
    priceRaw: string;
    estListingRaw: string;
    dateRaw: string;
    rawStatus: string;
    status: IPOStatus;
    lastUpdatedRaw: string;
  }

  const rowsToScrape: RawRow[] = [];

  for (const config of tableConfigs) {
    if (!config.table) continue;
    const trs = config.table.match(/<tr[\s\S]*?<\/tr>/gi) || [];

    for (let i = 1; i < trs.length; i++) {
      const r = trs[i];
      const linkMatch = r.match(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);
      const cells = (r.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || []).map(cleanText);

      if (cells.length >= 6 && cells[0] && !cells[0].toLowerCase().includes("ipo name")) {
        const name = cleanText(linkMatch ? linkMatch[2] : cells[0]);
        const detailUrl = linkMatch ? linkMatch[1] : undefined;
        const gmpVal = parseRupees(cells[1]);
        const priceRaw = cells[3] || "";
        const estListingRaw = cells[4] || "";
        const dateRaw = cells[5] || "";
        const rawStatus = cells[6] || "";
        const lastUpdatedRaw = cells[7] || "";

        // Strictly 3 statuses: LIVE, UPCOMING, CLOSED
        let status: IPOStatus = "UPCOMING";
        const stLower = rawStatus.toLowerCase();
        if (stLower.includes("open") || stLower.includes("live")) {
          status = "LIVE";
        } else if (
          stLower.includes("closed") ||
          stLower.includes("allot") ||
          stLower.includes("listed")
        ) {
          status = "CLOSED";
        } else {
          status = "UPCOMING";
        }

        rowsToScrape.push({
          name,
          detailUrl,
          type: config.type,
          gmpVal,
          priceRaw,
          estListingRaw,
          dateRaw,
          rawStatus,
          status,
          lastUpdatedRaw,
        });
      }
    }
  }

  // Fetch details concurrently in batches of 4
  const batchSize = 4;
  const ipos: IPO[] = [];

  for (let i = 0; i < rowsToScrape.length; i += batchSize) {
    const batch = rowsToScrape.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (row) => {
        let deepDetails: ReturnType<typeof parseDetailsPage> | null = null;
        if (row.detailUrl) {
          try {
            const detailHtml = await fetchHtml(row.detailUrl);
            deepDetails = parseDetailsPage(detailHtml);
          } catch (err) {
            console.warn(`Failed to scrape detail page for ${row.name}:`, err);
          }
        }

        const slug = slugify(row.name);
        const priceMax = parseRupees(row.priceRaw) || (deepDetails?.details["ipo_price_band"] ? parseRupees(deepDetails.details["ipo_price_band"]) : 0);
        const priceMin = priceMax;

        const gmpPercentage = priceMax > 0 && row.gmpVal > 0 ? (row.gmpVal / priceMax) * 100 : 0;
        const expectedListingPrice = priceMax > 0 ? priceMax + row.gmpVal : undefined;

        // Parse lot size
        let lotSize = 0;
        if (deepDetails?.marketLot && deepDetails.marketLot.length > 0) {
          const retail = deepDetails.marketLot.find((m) => m.application?.toLowerCase().includes("retail min") || m.application?.toLowerCase().includes("retail"));
          lotSize = retail?.shares ? parseRupees(retail.shares) : 0;
        }
        if (!lotSize) {
          lotSize = row.type === "SME" ? 1200 : Math.max(10, Math.floor(15000 / (priceMax || 100)));
        }

        const minInvestment = lotSize * (priceMax || 100);

        const ipo: IPO = {
          id: slug,
          name: row.name,
          slug: slug,
          type: row.type,
          status: row.status,
          rawStatus: row.rawStatus,
          detailUrl: row.detailUrl,

          gmp: {
            value: row.gmpVal,
            percentage: parseFloat(gmpPercentage.toFixed(2)),
            expectedListingPrice,
            estListingText: row.estListingRaw,
            lastUpdated: row.lastUpdatedRaw || new Date().toISOString(),
          },

          priceBand: {
            min: priceMin,
            max: priceMax,
            raw: row.priceRaw || deepDetails?.details["ipo_price_band"],
          },

          lotSize,
          minimumInvestment: minInvestment,

          dates: {
            open: deepDetails?.details["ipo_open_date"] || deepDetails?.datesTimeline["ipo_open_date:"] || deepDetails?.datesTimeline["ipo_open_date"],
            close: deepDetails?.details["ipo_close_date"] || deepDetails?.datesTimeline["ipo_close_date:"] || deepDetails?.datesTimeline["ipo_close_date"],
            allotment: deepDetails?.datesTimeline["basis_of_allotment:"] || deepDetails?.datesTimeline["basis_of_allotment"],
            refunds: deepDetails?.datesTimeline["refunds:"] || deepDetails?.datesTimeline["refunds"],
            creditToDemat: deepDetails?.datesTimeline["credit_to_demat_account:"] || deepDetails?.datesTimeline["credit_to_demat_account"],
            listing: deepDetails?.datesTimeline["ipo_listing_date:"] || deepDetails?.datesTimeline["ipo_listing_date"],
            rawRange: row.dateRaw,
          },

          issueDetails: {
            issueSize: deepDetails?.details["issue_size"],
            freshIssue: deepDetails?.details["fresh_issue"],
            ofs: deepDetails?.details["offer_for_sale"] || deepDetails?.details["ofs"],
            faceValue: deepDetails?.details["face_value"],
            issueType: deepDetails?.details["issue_type"],
            listingExchange: deepDetails?.details["ipo_listing"] || deepDetails?.details["listing_at"],
            drhpUrl: deepDetails?.details["drhp_draft_prospectus"],
            rhpUrl: deepDetails?.details["rhp_draft_prospectus"],
          },

          marketLot: deepDetails?.marketLot,
          reservation: deepDetails?.reservation,
          datesTimeline: deepDetails?.datesTimeline,
          financials: deepDetails?.financials,
          valuationKPIs: deepDetails?.valuationKPIs,
          promoterHolding: deepDetails?.promoterHolding,
          objectsOfIssue: deepDetails?.objectsOfIssue,
          registrar: deepDetails?.registrar,
          aboutCompany: deepDetails?.aboutCompany,
          faqs: deepDetails?.faqs,

          scrapedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };

        return ipo;
      })
    );

    ipos.push(...batchResults);
  }

  return ipos;
}
