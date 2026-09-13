"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, PlusCircle, Edit3, Trash2, ExternalLink, X, Save, Image as ImageIcon } from "lucide-react";
import { BlogPost, BlogCategory } from "@/types/blog";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { PageLoader } from "@/components/ui/PageLoader";
import { formatDate } from "@/lib/utils/formatters";
import { formatBlogContent } from "@/lib/utils/blogFormatter";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

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

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const insertSnippet = (prefix: string, suffix: string = "", placeholder: string = "") => {
    if (!textareaRef.current) {
      setContent((prev) => prev + prefix + placeholder + suffix);
      return;
    }
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || placeholder;
    const newContent = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      const newCursor = start + prefix.length + selectedText.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 20);
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
          <div className="py-12 flex justify-center">
            <PageLoader message="Loading Articles..." />
          </div>
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
                    placeholder="e.g. How to Apply for an IPO in India"
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
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-bold">Article Content</label>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewMode(false)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${!previewMode ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}
                    >
                      ✏️ Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode(true)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${previewMode ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}
                    >
                      👁 Live Preview
                    </button>
                  </div>
                </div>

                {/* Quick Formatting Toolbar */}
                {!previewMode && (
                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-800/80 border border-slate-700 rounded-t-xl text-[11px]">
                    <span className="text-slate-400 font-bold px-1 text-[10px] uppercase">Format:</span>
                    <button
                      type="button"
                      onClick={() => insertSnippet("<h2>", "</h2>\n\n", "Section Heading")}
                      className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold"
                      title="Insert H2 Heading"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet("<h3>", "</h3>\n\n", "Subheading")}
                      className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold"
                      title="Insert H3 Heading"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet("<strong>", "</strong>", "bold text")}
                      className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold"
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet("<em>", "</em>", "italic text")}
                      className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded italic font-serif"
                      title="Italic"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet("<ul>\n  <li>", "</li>\n  <li>Point 2</li>\n</ul>\n\n", "Point 1")}
                      className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded"
                      title="Bullet List"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet("<ol>\n  <li>", "</li>\n  <li>Step 2</li>\n</ol>\n\n", "Step 1")}
                      className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded"
                      title="Numbered List"
                    >
                      1. Steps
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('<div class="callout-card">\n  <strong>💡 Key Takeaway:</strong> ', '\n</div>\n\n', 'Write important note or quick answer here...')}
                      className="px-2 py-1 bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700 rounded font-semibold"
                      title="Highlight Box"
                    >
                      💡 Tip Card
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('<div class="step-card">\n  <div class="flex items-center gap-2.5 mb-2">\n    <span class="step-badge">', '</span>\n    <h3 class="!m-0 text-base font-bold">Step Title</h3>\n  </div>\n  <p>Step instruction details here...</p>\n</div>\n\n', '01')}
                      className="px-2 py-1 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-700 rounded font-semibold"
                      title="Step Box with Badge"
                    >
                      📋 Step Box
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('<div class="my-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-semibold text-xs flex items-center gap-2"><span>✓</span><span>', '</span></div>\n\n', 'Shares Allotted')}
                      className="px-2 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 rounded font-semibold"
                      title="Checkmark Pill"
                    >
                      ✓ Status
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet("<p>", "</p>\n\n", "Paragraph content here...")}
                      className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded"
                      title="Paragraph"
                    >
                      ¶ P
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('<table class="w-full">\n  <thead>\n    <tr><th>Header 1</th><th>Header 2</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Value 1</td><td>Value 2</td></tr>\n  </tbody>\n</table>\n\n')}
                      className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded"
                      title="Table"
                    >
                      Table
                    </button>
                  </div>
                )}

                {previewMode ? (
                  <div
                    className="w-full min-h-[260px] max-h-[380px] overflow-y-auto px-5 py-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-700 blog-article-content shadow-inner"
                    dangerouslySetInnerHTML={{
                      __html: formatBlogContent(content),
                    }}
                  />
                ) : (
                  <textarea
                    ref={textareaRef}
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={"Write or paste content. You can write HTML tags (<p>, <h2>, <ul>) or standard text and use the toolbar above to style sections!"}
                    className="w-full px-3 py-2 rounded-b-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs leading-relaxed resize-y focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                )}
                <p className="text-[10px] text-slate-500 mt-1">
                  Use the toolbar buttons above to format headings, bullet points, step badges, and tip cards. Click &quot;Live Preview&quot; to see the exact styled layout before publishing.
                </p>
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
