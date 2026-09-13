import { IPO } from "@/types/ipo";
import { BlogPost } from "@/types/blog";
import { SITE_CONFIG } from "./metadata";
import { formatINR } from "../utils/formatters";

/**
 * WebSite & Sitelinks Searchbox Schema
 */
export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    alternateName: ["IPO List India", "IPOList", "Live IPO Tracker"],
    url: SITE_CONFIG.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_CONFIG.url}/ipo?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * BreadcrumbList Schema for clean SERP navigation trail
 */
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

/**
 * FinancialProduct & AggregateOffer Schema for Google IPO Rich Cards
 */
export function generateIpoJsonLd(ipo: IPO) {
  const gmpVal = ipo.gmp?.value ?? 0;
  const gmpPct = ipo.gmp?.percentage ?? 0;
  const minPrice = ipo.priceBand?.min || 0;
  const maxPrice = ipo.priceBand?.max || minPrice;
  const priceBandText = ipo.priceBand?.raw || (ipo.priceBand?.max ? formatINR(ipo.priceBand.max) : "TBA");
  const estListingPrice = ipo.gmp?.expectedListingPrice || (minPrice > 0 ? minPrice + gmpVal : 0);

  return {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: `${ipo.name} IPO`,
    description: `Official ${ipo.name} IPO data: Live GMP today is ₹${gmpVal} (${gmpPct}%), price band ${priceBandText}, lot size ${ipo.lotSize || "TBA"} shares, issue size ${ipo.issueDetails?.issueSize || "TBA"}.`,
    url: `${SITE_CONFIG.url}/ipo/${ipo.slug}`,
    category: ipo.type === "SME" ? "SME Initial Public Offering" : "Mainboard Initial Public Offering",
    provider: {
      "@type": "Organization",
      name: ipo.name,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: minPrice,
      highPrice: maxPrice,
      offerCount: ipo.lotSize || 1,
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Grey Market Premium (GMP Today)",
        value: `₹${gmpVal}`,
      },
      {
        "@type": "PropertyValue",
        name: "Expected Listing Price",
        value: estListingPrice > 0 ? `₹${estListingPrice}` : "TBA",
      },
      {
        "@type": "PropertyValue",
        name: "IPO Status",
        value: ipo.status,
      },
      {
        "@type": "PropertyValue",
        name: "Issue Type",
        value: ipo.issueDetails?.issueType || "Book Building Issue",
      },
      {
        "@type": "PropertyValue",
        name: "Listing Exchange",
        value: ipo.issueDetails?.listingExchange || "BSE, NSE",
      },
      {
        "@type": "PropertyValue",
        name: "Registrar",
        value: ipo.registrar?.name || "Official Registrar",
      },
    ],
  };
}

/**
 * FAQPage Schema for Google Accordion Snippets
 */
export function generateFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Standard FAQs for IPO GMP Page
 */
export const GMP_PAGE_FAQS = [
  {
    question: "What is IPO Grey Market Premium (GMP)?",
    answer:
      "IPO Grey Market Premium (GMP) is the unofficial price premium at which IPO shares are traded before they are officially listed on stock exchanges like NSE and BSE. It indicates investor sentiment and expected listing gains.",
  },
  {
    question: "How is the estimated listing price calculated from GMP?",
    answer:
      "Estimated Listing Price = Upper Price Band + Current GMP. For example, if an IPO's issue price is ₹100 and GMP is ₹40, the expected listing price is ₹140 (a 40% listing gain).",
  },
  {
    question: "Is IPO GMP 100% accurate for predicting listing day prices?",
    answer:
      "No. While GMP is a reliable indicator of initial market demand, the actual listing price depends on market conditions, institutional bidding, subscription numbers, and overall sentiment on listing day.",
  },
  {
    question: "What is Kostak rate and Subject to Sauda in IPO grey market?",
    answer:
      "Kostak rate is the fixed profit an investor gets by selling their entire IPO application in the grey market before allotment, regardless of whether shares are allotted. Subject to Sauda is the agreed profit if the investor receives an allotment.",
  },
];

/**
 * Standard FAQs for IPO Allotment Page
 */
export const ALLOTMENT_PAGE_FAQS = [
  {
    question: "How do I check my IPO allotment status online?",
    answer:
      "You can check your IPO allotment status online on the official registrar portal (such as Link Intime, KFintech, or Bigshare Services) or the BSE/NSE website by entering your PAN number, Application Number, or DP ID.",
  },
  {
    question: "When is the basis of allotment finalized under SEBI T+3 norms?",
    answer:
      "Under SEBI T+3 regulations for Indian IPOs, the basis of allotment is finalized on T+1 (one business day after the bidding closes). Refunds and Demat credit occur on T+2, followed by listing on T+3.",
  },
  {
    question: "What should I do if my IPO application is rejected or not allotted?",
    answer:
      "If shares are not allotted, your blocked funds are automatically unblocked via UPI mandate or ASBA banking on T+2 day. If funds remain blocked, contact your bank or registrar with your application number.",
  },
  {
    question: "Can I check allotment status using my PAN number?",
    answer:
      "Yes. Official registrars like Link Intime, KFintech, and Bigshare allow you to select the IPO and simply input your 10-digit PAN card number to view your allotment result instantly.",
  },
];

/**
 * BlogPosting Schema
 */
export function generateBlogJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || SITE_CONFIG.ogImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/blog/${post.slug}`,
    },
  };
}

export const generateArticleJsonLd = generateBlogJsonLd;
