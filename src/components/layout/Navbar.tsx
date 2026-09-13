"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  Search,
  Menu,
  X,
  Layers,
  Sparkles,
  Calendar,
  CheckCircle,
  BookOpen,
  Calculator,
} from "lucide-react";
import { IPO } from "@/types/ipo";
import { BlogPost } from "@/types/blog";
import { SearchModal } from "@/components/ui/SearchModal";

interface NavbarProps {
  ipos?: IPO[];
  blogs?: BlogPost[];
}

export function Navbar({ ipos = [], blogs = [] }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "All IPOs", href: "/ipo", icon: Layers },
    { name: "Live GMP", href: "/ipo-gmp", icon: TrendingUp, highlight: true },
    { name: "Allotment Status", href: "/ipo-allotment", icon: CheckCircle },
    { name: "SME IPOs", href: "/ipo/sme", icon: Sparkles },
    { name: "Calculators", href: "/tools", icon: Calculator },
    { name: "Blog & Guides", href: "/blog", icon: BookOpen },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18 gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0 group">
              <img
                src="/ipolistlogo.png"
                alt="IPO List"
                className="h-9 sm:h-11 md:h-12 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 shadow-sm"
                        : "text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${link.highlight ? "text-emerald-500" : ""}`} />
                    <span>{link.name}</span>
                    {link.highlight && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Search & Mobile Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Search Button (⌘K) */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                aria-label="Search IPOs"
              >
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden sm:inline-block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono px-1.5 py-0.5 rounded text-slate-400">
                  ⌘K
                </kbd>
              </button>

              {/* Mobile menu toggle button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle Navigation"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-1 shadow-xl animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold ${
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        ipos={ipos}
        blogs={blogs}
      />
    </>
  );
}
