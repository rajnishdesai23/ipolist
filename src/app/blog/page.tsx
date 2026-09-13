import React from "react";
import { Metadata } from "next";
import { BookOpen, Sparkles } from "lucide-react";
import { getAllBlogs } from "@/lib/data/blogRepository";
import { BlogCard } from "@/components/blog/BlogCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LeaderboardAd } from "@/components/ads/LeaderboardAd";
import { BrokerCtaCard } from "@/components/ads/BrokerCtaCard";

export const metadata: Metadata = {
  title: "IPO Blog, Reviews & Market News — Fundamental Analysis India",
  description:
    "Expert IPO fundamental analysis, valuation reviews, daily Grey Market Premium (GMP) reports, beginner guides, and allotment news.",
};

export default async function BlogPage() {
  const blogs = await getAllBlogs();

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb items={[{ name: "Blog & News", url: "/blog" }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Editorial Research & Market Insights</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
            IPO Reviews, News & Educational Guides
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            In-depth fundamental analysis, grey market momentum tracking, and beginner-friendly tutorials.
          </p>
        </div>

        <LeaderboardAd />

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <BrokerCtaCard variant="horizontal" broker="zerodha" />
      </div>
    </div>
  );
}
