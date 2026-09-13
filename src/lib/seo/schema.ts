import { IPO } from "@/types/ipo";
import { BlogPost } from "@/types/blog";
import { SITE_CONFIG } from "./metadata";

export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_CONFIG.url}/ipo?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateIpoJsonLd(ipo: IPO) {
  const gmpVal = ipo.gmp?.value ?? 0;
  const minPrice = ipo.priceBand?.min || 0;
  const maxPrice = ipo.priceBand?.max || minPrice;

  return {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: `${ipo.name} IPO`,
    description: ipo.aboutCompany || `${ipo.name} IPO details, live GMP, price band and allotment.`,
    url: `${SITE_CONFIG.url}/ipo/${ipo.slug}`,
    category: ipo.type === "SME" ? "SME Initial Public Offering" : "Mainboard Initial Public Offering",
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
        name: "Grey Market Premium (GMP)",
        value: `₹${gmpVal}`,
      },
      {
        "@type": "PropertyValue",
        name: "IPO Status",
        value: ipo.status,
      },
      {
        "@type": "PropertyValue",
        name: "Issue Size",
        value: ipo.issueDetails?.issueSize || "TBA",
      },
    ],
  };
}

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

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}
