import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, BookOpen, Tag } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { formatDate } from "@/lib/utils/formatters";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between">
      {/* Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={post.coverImage || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80"}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full">
          {post.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>{formatDate(post.publishedAt, "dd MMM yyyy")}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTimeMinutes} min read
            </span>
          </div>

          <Link href={`/blog/${post.slug}`} className="block">
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
              {post.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Author and Link */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
              {post.author.name.charAt(0)}
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {post.author.name}
            </span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
          >
            <span>Read</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
