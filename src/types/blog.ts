export type BlogCategory =
  | "IPO Review"
  | "GMP Today"
  | "Market News"
  | "Beginner Guide"
  | "Allotment Update"
  | "SME IPO";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown or HTML
  category: BlogCategory;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  coverImage: string;
  readingTimeMinutes: number;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  isFeatured?: boolean;
  isPublished: boolean;
  relatedIpoSlug?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
}
