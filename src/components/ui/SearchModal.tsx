"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, X, TrendingUp, Calendar, ArrowRight, BookOpen, Layers } from "lucide-react";
import { IPO } from "@/types/ipo";
import { BlogPost } from "@/types/blog";
import { formatINR, formatPercentage } from "@/lib/utils/formatters";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  ipos: IPO[];
  blogs: BlogPost[];
}

export function SearchModal({ isOpen, onClose, ipos, blogs }: SearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredIpos = q
    ? ipos.filter(
        (ipo) =>
          ipo.name.toLowerCase().includes(q) ||
          ipo.slug.toLowerCase().includes(q)
      )
    : ipos.slice(0, 5);

  const filteredBlogs = q
    ? blogs.filter((b) => b.title.toLowerCase().includes(q) || b.tags.some((t) => t.toLowerCase().includes(q)))
    : blogs.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search IPOs (e.g. Hero Motors, SME), GMP, or Guides..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm md:text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-4">
          {/* IPO Results */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                IPOs & GMP
              </span>
              <span>{filteredIpos.length} Found</span>
            </div>

            {filteredIpos.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">No IPOs matching &quot;{query}&quot;</p>
            ) : (
              <div className="space-y-1.5">
                {filteredIpos.map((ipo) => {
                  const gmpVal = ipo.gmp?.value ?? 0;
                  const gmpPct = ipo.gmp?.percentage ?? 0;
                  return (
                    <Link
                      key={ipo.id}
                      href={`/ipo/${ipo.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{ipo.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            {ipo.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>Price: {ipo.priceBand?.raw || formatINR(ipo.priceBand?.max || 0)}</span>
                          <span>•</span>
                          <span>Lot: {ipo.lotSize || "TBA"}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {ipo.dates?.rawRange || (ipo.dates?.open ? `${ipo.dates.open} to ${ipo.dates.close || ""}` : "TBA")}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>{formatINR(gmpVal)}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          ({formatPercentage(gmpPct)})
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Blog & Guide Results */}
          {filteredBlogs.length > 0 && (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                Articles & Guides
              </div>
              <div className="space-y-1.5">
                {filteredBlogs.map((b) => (
                  <Link
                    key={b.id}
                    href={`/blog/${b.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
                  >
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {b.title}
                      </span>
                      <span className="text-[11px] text-slate-400">{b.category} • {b.readingTimeMinutes} min read</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <span>Search powered by IPO List</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
}
