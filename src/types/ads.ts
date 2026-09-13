export type AdSlotType =
  | "LEADERBOARD_TOP" // 728x90 desktop / 320x50 mobile
  | "SIDEBAR_STICKY" // 300x250 or 300x600
  | "INFEED_NATIVE" // Responsive card between list items
  | "IN_ARTICLE" // Banner inside blog content
  | "BROKER_CTA_HERO" // Broker Demat Card in Hero
  | "BROKER_CTA_FOOTER" // Broker Demat Card in Footer
  | "MOBILE_STICKY_BOTTOM"; // 320x50 floating bottom

export interface BrokerPartner {
  id: string;
  name: "Zerodha" | "Angel One" | "Groww" | "Upstox";
  logo: string;
  tagline: string;
  badge: string; // e.g. "Zero Account Opening Fee"
  features: string[];
  affiliateUrl: string;
  buttonText: string;
  rating: number; // e.g. 4.9
  bgColor: string;
  textColor: string;
}

export interface AdUnitConfig {
  slotId: string;
  type: AdSlotType;
  enabled: boolean;
  googleAdClient?: string;
  googleAdSlot?: string;
  fallbackBrokerId?: string;
  customBannerUrl?: string;
  customBannerLink?: string;
}
