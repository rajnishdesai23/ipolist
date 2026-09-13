import { BlogPost, BlogCategory } from "@/types/blog";

// Pure clean storage: only populated via admin articles or live news scraper
let inMemoryBlogs: BlogPost[] = [];

export async function getAllBlogs(category?: BlogCategory): Promise<BlogPost[]> {
  if (category) {
    return inMemoryBlogs.filter((b) => b.category === category && b.isPublished);
  }
  return inMemoryBlogs.filter((b) => b.isPublished);
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const found = inMemoryBlogs.find((b) => b.slug === slug || b.id === slug);
  return found || null;
}

export async function getRecentBlogs(limitCount = 3): Promise<BlogPost[]> {
  return [...inMemoryBlogs]
    .filter((b) => b.isPublished)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limitCount);
}

export async function saveBlog(post: BlogPost): Promise<BlogPost> {
  const index = inMemoryBlogs.findIndex((b) => b.id === post.id || b.slug === post.slug);
  if (index >= 0) {
    inMemoryBlogs[index] = { ...post, updatedAt: new Date().toISOString() };
    return inMemoryBlogs[index];
  } else {
    const newPost = { ...post, publishedAt: new Date().toISOString() };
    inMemoryBlogs.unshift(newPost);
    return newPost;
  }
}
