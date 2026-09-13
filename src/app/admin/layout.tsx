"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  PlusCircle,
  TrendingUp,
  RefreshCw,
  BookOpen,
  DollarSign,
  Settings,
  ArrowLeft,
  Shield,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "IPOs List", href: "/admin/ipos", icon: Layers },
    { name: "Add New IPO", href: "/admin/ipos/new", icon: PlusCircle },
    { name: "GMP Quick Edit", href: "/admin/gmp", icon: TrendingUp, highlight: true },
    { name: "Scraper Console", href: "/admin/scraper", icon: RefreshCw },
    { name: "Blog Articles", href: "/admin/blog", icon: BookOpen },
    { name: "Ads & Partners", href: "/admin/ads", icon: DollarSign },
    { name: "Settings & SEO", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between px-2">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-white block">IPO List</span>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                  Admin Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {item.highlight && (
                    <span className="ml-auto text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-bold uppercase">
                      Fast
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between text-xs text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Website</span>
            </span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <div className="text-[10px] text-slate-600 px-2">
            Firestore Hybrid Engine v1.0
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
