"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, PlusCircle, Edit3, Trash2, ExternalLink, X, Save, Image as ImageIcon } from "lucide-react";
import { BlogPost, BlogCategory } from "@/types/blog";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { formatDate } from "@/lib/utils/formatters";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<BlogCategory>("IPO Review");
  const [coverImage, setCoverImage] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("Rohan Verma");
  const [authorRole, setAuthorRole] = useState("Lead IPO Analyst");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/admin/blogs");
      const data = await res.json();
      if (data.blogs) setBlogs(data.blogs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setCategory("IPO Review");
    setCoverImage("");
    setExcerpt("");
    setContent("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setCategory(post.category);
    setCoverImage(post.coverImage || "");
    setExcerpt(post.excerpt);
    setContent(post.content);
    setAuthorName(post.author.name);
    setAuthorRole(post.author.role);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const postPayload: BlogPost = {
      id: editingId || `blog-${Date.now()}`,
      slug: slug || `article-${Date.now()}`,
      title,
      excerpt,
      content: content || `## ${title}\n\nArticle content coming soon.`,
      category,
      coverImage: coverImage || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
      author: {
        name: authorName,
        role: authorRole,
      },
      readingTimeMinutes: Math.max(3, Math.ceil(content.split(" ").length / 200)),
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [category, "IPO India"],
      isPublished: true,
    };

    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postPayload),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchBlogs();
      }
    } catch (error) {
      alert("Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Blog & Editorial CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish expert IPO fundamental reviews, daily GMP bulletins, and investor guides.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="font-bold text-sm text-white">Published Articles & Guides</span>
          <span className="text-xs font-semibold text-slate-400">Total: {blogs.length}</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading articles...</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {blogs.map((post) => (
              <div key={post.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700/60 overflow-hidden shrink-0">
                    <img
                      src={post.coverImage || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80"}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="font-bold text-white text-sm block truncate max-w-xl">
                      {post.title}
                    </span>
                    <span className="text-slate-400 text-[11px] block">
                      Category: <strong className="text-blue-400">{post.category}</strong> • Author: {post.author.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(post)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="text-blue-400 hover:underline flex items-center gap-1 font-bold text-xs"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white font-heading">
                {editingId ? "Edit Article" : "Write New Article"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Hero Motors IPO Review: Apply or Avoid?"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BlogCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
                  >
                    <option value="IPO Review">IPO Review</option>
                    <option value="GMP Today">GMP Today</option>
                    <option value="Market News">Market News</option>
                    <option value="Beginner Guide">Beginner Guide</option>
                    <option value="Allotment Update">Allotment Update</option>
                    <option value="SME IPO">SME IPO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-mono"
                />
              </div>

              {/* Cover Image Uploader */}
              <ImageUploader
                label="Cover Image (Firebase Cloud Storage / Base64 Fallback)"
                value={coverImage}
                onChange={(url) => setCoverImage(url)}
                folder="blogs"
                placeholder="Upload high-res article banner image (Max 5MB)"
              />

              <div>
                <label className="block text-slate-300 font-bold mb-1">Excerpt Summary</label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief 2-sentence summary of the article..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Article Content (Markdown / HTML)</label>
                <textarea
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write full article analysis here..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Publishing..." : "Save & Publish"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
