import React from "react";
import Link from "next/link";
import { TrendingUp, ShieldAlert, Heart, ExternalLink } from "lucide-react";

export function Footer() {
  const registrars = [
    { name: "Link Intime India", url: "https://linkintime.co.in/initial_offer/public-issues.html" },
    { name: "KFin Technologies", url: "https://ris.kfintech.com/ipostatus/" },
    { name: "Bigshare Services", url: "https://www.bigshareonline.com/ipo_Allotment.html" },
    { name: "Skyline Financial", url: "https://www.skylinerta.com/ipo.php" },
    { name: "BSE Allotment Portal", url: "https://www.bseindia.com/investors/appli_check.aspx" },
    { name: "NSE Equity Allotment", url: "https://www.nseindia.com/products/content/equities/ipos/ipo_login.htm" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                IPO<span className="text-blue-400">List</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              India&apos;s fastest, cleanest destination for real-time IPO Grey Market Premium (GMP),
              market lot sizes, allotment status links, and detailed IPO analysis.
            </p>
            <div className="flex items-center gap-3 text-slate-400 pt-1">
              <span>Mainboard IPOs</span>
              <span>•</span>
              <span>NSE Emerge & BSE SME</span>
              <span>•</span>
              <span>Daily GMP</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">IPO Hubs</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/ipo" className="hover:text-blue-400 transition-colors">
                  All IPOs
                </Link>
              </li>
              <li>
                <Link href="/ipo/current" className="hover:text-blue-400 transition-colors">
                  Open IPOs Today
                </Link>
              </li>
              <li>
                <Link href="/ipo/upcoming" className="hover:text-blue-400 transition-colors">
                  Upcoming IPOs 2026
                </Link>
              </li>
              <li>
                <Link href="/ipo/mainboard" className="hover:text-blue-400 transition-colors">
                  Mainboard IPOs
                </Link>
              </li>
              <li>
                <Link href="/ipo/sme" className="hover:text-blue-400 transition-colors">
                  SME IPOs (NSE/BSE)
                </Link>
              </li>
              <li>
                <Link href="/ipo-performance" className="hover:text-blue-400 transition-colors">
                  IPO Performance & Gains
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Calculators & Guides</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/ipo-gmp" className="hover:text-blue-400 transition-colors">
                  Live IPO GMP Tracker
                </Link>
              </li>
              <li>
                <Link href="/ipo-allotment" className="hover:text-blue-400 transition-colors">
                  IPO Allotment Status Hub
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-blue-400 transition-colors">
                  IPO Profit Calculator
                </Link>
              </li>
              <li>
                <Link href="/ipo-calendar" className="hover:text-blue-400 transition-colors">
                  IPO Calendar Timeline
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-blue-400 transition-colors">
                  IPO Reviews & Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Registrar Directory */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Allotment Registrars</h4>
            <ul className="space-y-1.5 text-slate-400">
              {registrars.map((r) => (
                <li key={r.name}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                  >
                    <span>{r.name}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SEBI & Legal Disclaimer Box */}
        <div className="my-8 p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-400 text-[11px] leading-relaxed space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>SEBI Regulatory & Grey Market Premium (GMP) Disclaimer</span>
          </div>
          <p>
            IPO List (ipolist.in) is purely an informational and educational portal. We are NOT a SEBI-registered research analyst, investment advisor, or broker. Grey Market Premium (GMP), Kostak, and Subject to Sauda rates are strictly unofficial, unregulated over-the-counter market indicators compiled from market sources for informational reference only.
          </p>
          <p>
            Grey market transactions carry no legal standing or official exchange backing. We strongly urge all investors to thoroughly read the Red Herring Prospectus (RHP) filed with SEBI and consult certified financial advisors before bidding on any IPO.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} IPO List India. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for Indian Retail & HNI Investors with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
