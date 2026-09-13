import { cache } from "react";
import { BlogPost, BlogCategory } from "@/types/blog";
import { db } from "@/lib/firebase/client";
import { collection, doc, setDoc, getDocs, deleteDoc } from "firebase/firestore";

// In-memory cache — populated from Firestore on first access
let inMemoryBlogs: BlogPost[] = [];

/** Load all blogs from Firestore into memory (on first call per server instance) */
async function loadFromFirestoreIfEmpty(): Promise<void> {
  if (inMemoryBlogs.length > 0 || !db) return;
  try {
    const snapshot = await getDocs(collection(db, "blogs"));
    if (!snapshot.empty) {
      inMemoryBlogs = snapshot.docs.map((d: any) => d.data() as BlogPost);
    }
  } catch (e: any) {
    console.warn("Blogs Firestore fetch notice:", e?.message || e);
  }
}

/** Sanitise undefined values for Firestore */
function sanitize<T>(data: T): Record<string, any> {
  return JSON.parse(JSON.stringify(data, (_, v) => (v === undefined ? null : v)));
}

export const getAllBlogs = cache(async (category?: BlogCategory): Promise<BlogPost[]> => {
  await loadFromFirestoreIfEmpty();
  const published = inMemoryBlogs.filter((b) => b.isPublished);
  if (category) return published.filter((b) => b.category === category);
  return published;
});

export async function getAllBlogsAdmin(): Promise<BlogPost[]> {
  await loadFromFirestoreIfEmpty();
  return [...inMemoryBlogs].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export const getBlogBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  await loadFromFirestoreIfEmpty();
  return inMemoryBlogs.find((b) => b.slug === slug || b.id === slug) || null;
});

export async function getRecentBlogs(limitCount = 3): Promise<BlogPost[]> {
  await loadFromFirestoreIfEmpty();
  return [...inMemoryBlogs]
    .filter((b) => b.isPublished)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limitCount);
}

export async function saveBlog(post: BlogPost): Promise<BlogPost> {
  await loadFromFirestoreIfEmpty();

  const now = new Date().toISOString();
  const index = inMemoryBlogs.findIndex((b) => b.id === post.id || b.slug === post.slug);

  const saved: BlogPost =
    index >= 0
      ? { ...inMemoryBlogs[index], ...post, updatedAt: now }
      : { ...post, publishedAt: post.publishedAt || now, updatedAt: now };

  if (index >= 0) {
    inMemoryBlogs[index] = saved;
  } else {
    inMemoryBlogs.unshift(saved);
  }

  // Persist to Firestore
  if (db) {
    try {
      const docId = saved.slug || saved.id;
      await setDoc(doc(db, "blogs", docId), sanitize(saved), { merge: true });
    } catch (err: any) {
      console.warn("Blog Firestore save notice:", err?.message || err);
    }
  }

  return saved;
}

export async function deleteBlog(idOrSlug: string): Promise<boolean> {
  await loadFromFirestoreIfEmpty();
  const before = inMemoryBlogs.length;
  const target = inMemoryBlogs.find((b) => b.id === idOrSlug || b.slug === idOrSlug);
  inMemoryBlogs = inMemoryBlogs.filter((b) => b.id !== idOrSlug && b.slug !== idOrSlug);

  if (target && db) {
    try {
      await deleteDoc(doc(db, "blogs", target.slug || target.id));
    } catch (err: any) {
      console.warn("Blog Firestore delete notice:", err?.message || err);
    }
  }

  return inMemoryBlogs.length < before;
}
