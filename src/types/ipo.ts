export type IPOType = "MAINBOARD" | "SME";

export type IPOStatus = "LIVE" | "UPCOMING" | "CLOSED";

export interface MarketLotItem {
  application?: string;
  lots?: string;
  shares?: string;
  amount?: string;
}

export interface ReservationItem {
  category?: string;
  sharesOffered?: string;
  percentage?: string;
}

export interface FinancialRecord {
  period?: string;
  revenue?: string;
  expense?: string;
  pat?: string;
  assets?: string;
  [key: string]: string | undefined;
}

export interface ValuationKPIs {
  roe?: string;
  roce?: string;
  ebitdaMargin?: string;
  patMargin?: string;
  debtToEquity?: string;
  eps?: string;
  peRatio?: string;
  ronw?: string;
  nav?: string;
  [key: string]: string | undefined;
}

export interface PromoterHoldingItem {
  preShares?: string;
  prePercent?: string;
  postShares?: string;
  postPercent?: string;
}

export interface ObjectOfIssue {
  purpose?: string;
  amount?: string;
}

export interface RegistrarInfo {
  name?: string;
  phone?: string;
  email?: string;
  website?: string;
  raw?: string;
}

export interface IPOFaq {
  question: string;
  answer: string;
}

export interface GMPHistoryItem {
  id: string;
  date: string;
  displayDate?: string;
  gmp: number;
  percentage: number;
  expectedListingPrice?: number;
}

export interface GMPData {
  value?: number;
  percentage?: number;
  expectedListingPrice?: number;
  trend?: string;
  movement?: "UP" | "DOWN" | "STABLE";
  fireRating?: number;
  kostak?: number;
  sauda?: number;
  estListingText?: string;
  lastUpdated?: string;
  history?: GMPHistoryItem[];
}

export interface PriceBand {
  min?: number;
  max?: number;
  raw?: string;
}

export interface IPODates {
  open?: string;
  close?: string;
  allotment?: string;
  refunds?: string;
  creditToDemat?: string;
  listing?: string;
  rawRange?: string;
}

export interface IssueDetails {
  issueSize?: string;
  freshIssue?: string;
  ofs?: string;
  faceValue?: string;
  issueType?: string;
  listingExchange?: string;
  drhpUrl?: string;
  rhpUrl?: string;
}

export interface SubscriptionData {
  qib?: number;
  nii?: number;
  retail?: number;
  total?: number;
  dayWise?: {
    day: number;
    date: string;
    qib: number;
    nii: number;
    retail: number;
    total: number;
  }[];
}

export interface AllotmentData {
  status?: "AWAITED" | "OUT";
  registrarName?: string;
  registrarWebsite?: string;
  links?: {
    id: string;
    name: string;
    url: string;
    type?: string;
  }[];
}

export interface ListingPerformance {
  listingDate?: string;
  listingPrice?: number;
  gainPercentage?: number;
  currentMarketPrice?: number;
}

export interface IPO {
  id: string;
  name: string;
  slug: string;
  symbol?: string;
  type: IPOType; // MAINBOARD or SME
  status: IPOStatus; // LIVE | UPCOMING | CLOSED
  rawStatus?: string;
  detailUrl?: string;
  logoUrl?: string;

  // Price & Lot
  priceBand?: PriceBand;
  lotSize?: number;
  minimumInvestment?: number;

  // GMP
  gmp?: GMPData;

  // Extracted details
  dates?: IPODates;
  issueDetails?: IssueDetails;
  marketLot?: MarketLotItem[];
  reservation?: ReservationItem[];
  datesTimeline?: Record<string, string>;
  financials?: FinancialRecord[];
  valuationKPIs?: ValuationKPIs;
  promoterHolding?: Record<string, PromoterHoldingItem>;
  objectsOfIssue?: ObjectOfIssue[];
  registrar?: RegistrarInfo;
  aboutCompany?: string;
  faqs?: IPOFaq[];

  // Optional extensions
  subscription?: SubscriptionData;
  allotment?: AllotmentData;
  listing?: ListingPerformance;

  // Metadata
  scrapedAt?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface IPOFilterOptions {
  type?: "ALL" | "MAINBOARD" | "SME";
  status?: "ALL" | "LIVE" | "UPCOMING" | "CLOSED";
  searchQuery?: string;
  sortBy?: "gmp" | "date" | "size" | "status";
  sortDirection?: "asc" | "desc";
}
