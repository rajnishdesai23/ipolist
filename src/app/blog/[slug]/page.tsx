import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Clock, Calendar, ArrowLeft, ArrowRight, User, Share2, Sparkles } from "lucide-react";
import { getBlogBySlug, getAllBlogs } from "@/lib/data/blogRepository";
import { constructBlogMetadata } from "@/lib/seo/metadata";
import { generateArticleJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo/schema";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LeaderboardAd } from "@/components/ads/LeaderboardAd";
import { InArticleAd } from "@/components/ads/InArticleAd";
import { BrokerCtaCard } from "@/components/ads/BrokerCtaCard";
import { formatDate } from "@/lib/utils/formatters";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogBySlug(params.slug);
  if (!post) return {};
  return constructBlogMetadata(post);
}

export async function generateStaticParams() {
  const blogs = await getAllBlogs();
  return blogs.map((b) => ({ slug: b.slug }));
}

export const revalidate = 60;

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await getBlogBySlug(params.slug);
  if (!post) notFound();

  const articleSchema = generateArticleJsonLd(post);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  return (
    <div className="space-y-6 pb-16">
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumb
        items={[
          { name: "Blog & News", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <LeaderboardAd />

        {/* Article Header */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            {post.category}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-heading leading-tight">
            {post.title}
          </h1>

          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-500 border-t border-b border-slate-100 dark:border-slate-800 py-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                {post.author.name.charAt(0)}
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {post.author.name}
              </span>
              <span className="text-slate-400">({post.author.role})</span>
            </div>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.publishedAt, "dd MMMM yyyy")}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTimeMinutes} min read
            </span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-card">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Related IPO Quick CTA banner if applicable */}
        {post.relatedIpoSlug && (
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200">
              <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Looking for live GMP & allotment details for this IPO?</span>
            </div>
            <Link
              href={`/ipo/${post.relatedIpoSlug}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0"
            >
              View Live IPO
            </Link>
          </div>
        )}

        {/* Article Body — renders HTML directly if authored as HTML, or converts markdown */}
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed prose-headings:font-heading prose-h2:text-2xl prose-h2:font-extrabold prose-h3:text-xl prose-h3:font-bold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 dark:prose-strong:text-white prose-li:marker:text-blue-500 prose-blockquote:border-l-blue-500">
          <div
            dangerouslySetInnerHTML={{
              __html: (() => {
                const c = post.content || "";
                // If content already contains HTML tags, render directly
                if (/<[a-z][\s\S]*>/i.test(c)) return c;
                // Otherwise treat as Markdown and do basic conversion
                return c
                  .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
                  .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
                  .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\*(.*?)\*/g, "<em>$1</em>")
                  .replace(/`(.*?)`/g, "<code>$1</code>")
                  .replace(/^\- (.*?)$/gm, "<li>$1</li>")
                  .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
                  .replace(/\n\n/g, "</p><p>")
                  .replace(/^(?!<)(.+)$/gm, "<p>$1</p>");
              })(),
            }}
          />
        </div>

        {/* In-Article Contextual Ad Banner */}
        <InArticleAd />

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400">Tags:</span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Broker Demat CTA */}
        <BrokerCtaCard variant="horizontal" broker="zerodha" />
      </article>
    </div>
  );
}
