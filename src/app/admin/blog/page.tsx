"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, PlusCircle, Edit3, Trash2, ExternalLink } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { formatDate } from "@/lib/utils/formatters";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch("/api/admin/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (data.blogs) setBlogs(data.blogs);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
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
          onClick={() => alert("Article creation editor is ready.")}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="font-bold text-sm text-white">Published Articles & Guides</span>
          <span className="text-xs text-slate-500">Live on /blog</span>
        </div>

        <div className="divide-y divide-slate-800">
          <div className="p-4 flex items-center justify-between hover:bg-slate-800/40 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-white text-sm block">
                Hero Motors IPO Review: Should You Apply for Listing Gains or Long Term?
              </span>
              <span className="text-slate-400 text-[11px]">
                Category: IPO Review • Author: Rohan Verma • 6 min read
              </span>
            </div>
            <Link
              href="/blog/hero-motors-ipo-review-apply-or-avoid"
              target="_blank"
              className="text-blue-400 hover:underline flex items-center gap-1 font-bold text-xs"
            >
              <span>View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-slate-800/40 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-white text-sm block">
                What is IPO GMP? Grey Market Premium, Kostak & Subject to Sauda Explained
              </span>
              <span className="text-slate-400 text-[11px]">
                Category: Beginner Guide • Author: Priya Sundaram • 5 min read
              </span>
            </div>
            <Link
              href="/blog/what-is-ipo-gmp-grey-market-premium-explained"
              target="_blank"
              className="text-blue-400 hover:underline flex items-center gap-1 font-bold text-xs"
            >
              <span>View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-slate-800/40 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-white text-sm block">
                How to Check IPO Allotment Status Online: Step-by-Step Guide
              </span>
              <span className="text-slate-400 text-[11px]">
                Category: Allotment Update • Author: Amit Sharma • 4 min read
              </span>
            </div>
            <Link
              href="/blog/how-to-check-ipo-allotment-status-online-link-intime-kfintech"
              target="_blank"
              className="text-blue-400 hover:underline flex items-center gap-1 font-bold text-xs"
            >
              <span>View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
