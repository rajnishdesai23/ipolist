import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Database, Clock, Scale, Mail, HelpCircle, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Data Sourcing & Verification Methodology | IPO Ji Research Desk",
  description: "Learn how IPO Ji sources, aggregates, and verifies real-time IPO GMP, subscription figures, and registrar allotment status in strict compliance with SEBI T+1 guidelines.",
  alternates: {
    canonical: "https://ipoji.com/methodology",
  },
  openGraph: {
    title: "Data Sourcing & Verification Methodology | IPO Ji",
    description: "Learn how IPO Ji sources, aggregates, and verifies real-time IPO GMP, subscription figures, and registrar allotment status.",
    url: "https://ipoji.com/methodology",
    type: "website",
  },
};

export default function MethodologyPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <header className="space-y-4 text-center sm:text-left border-b border-border/40 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-normal bg-primary/10 text-primary border border-primary/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Editorial Standards & Verification Protocol</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-light tracking-tight text-foreground">
          IPO Data Sourcing & Research Methodology
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-2xl">
          At IPO Ji, reliability, speed, and transparency are paramount. Every number displayed across our live trackers is vetted through a rigorous multi-source validation process.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
          <span>Author: <strong className="font-medium text-foreground">IPO Ji Research Desk</strong></span>
          <span>•</span>
          <span>Last Updated: <time dateTime={new Date().toISOString()}>{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</time></span>
          <span>•</span>
          <span>Review Frequency: <span className="text-emerald-500 font-medium">Hourly (Active IPOs)</span></span>
        </div>
      </header>

      {/* Grid of Core Pillars */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm space-y-2">
          <Database className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-normal text-foreground">Triangulated Sourcing</h3>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            We pull verified quotes from multiple active market makers across major dealer hubs (Mumbai, Rajkot, Jaipur) to eliminate spurious anomalies.
          </p>
        </div>
        <div className="p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm space-y-2">
          <Clock className="w-5 h-5 text-emerald-500" />
          <h3 className="text-sm font-normal text-foreground">T+1 Compliance</h3>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            All calendar schedules strictly map to SEBI&apos;s compressed T+1 listing cycle, tracking registrar upload timestamps down to the minute.
          </p>
        </div>
        <div className="p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm space-y-2">
          <Scale className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-normal text-foreground">Independent Neutrality</h3>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Zero sponsored bias. Financial metrics are extracted directly from official SEBI DRHP/RHP filings without speculative embellishments.
          </p>
        </div>
      </section>

      {/* Pillar 1: Grey Market Premium (GMP) */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-normal text-foreground flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">1</span>
          How Grey Market Premium (GMP) is Calculated & Reported
        </h2>
        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground font-light space-y-3 leading-relaxed">
          <p>
            The Grey Market is an unofficial, over-the-counter market where IPO shares or applications trade before official exchange listing. Because the market has no centralized order book, reporting accurate numbers requires verified desk surveillance.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
            <li>
              <strong className="text-foreground font-medium">Multi-Dealer Survey:</strong> Our desk aggregates quotes from at least 3 established off-market trading desks twice daily (morning 10:00 AM IST and evening 6:00 PM IST).
            </li>
            <li>
              <strong className="text-foreground font-medium">Median Filtering:</strong> Extreme bids or unconfirmed rumors are stripped. We report the reliable median transaction price.
            </li>
            <li>
              <strong className="text-foreground font-medium">Estimated Listing Price Formula:</strong>
              <div className="p-3 my-2 rounded-xl bg-muted/40 font-mono text-xs text-foreground">
                Estimated Listing Price = Cut-off / Upper Price Band + Current GMP (₹)
              </div>
            </li>
            <li>
              <strong className="text-foreground font-medium">Estimated Listing Gain %:</strong>
              <div className="p-3 my-2 rounded-xl bg-muted/40 font-mono text-xs text-foreground">
                Gain % = (Current GMP / Upper Price Band) × 100
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Pillar 2: Subscription Data */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-normal text-foreground flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">2</span>
          Exchange Subscription Telemetry
        </h2>
        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground font-light space-y-3 leading-relaxed">
          <p>
            Subscription numbers reflect the official cumulative demand from investors across institutional and retail categories.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
            <li>
              <strong className="text-foreground font-medium">Source:</strong> Direct official cumulative data feeds from <strong className="text-foreground">NSE (National Stock Exchange)</strong> and <strong className="text-foreground">BSE (Bombay Stock Exchange)</strong>.
            </li>
            <li>
              <strong className="text-foreground font-medium">Category Breakdown:</strong> We partition live subscription into QIB (Qualified Institutional Buyers), NII / HNI (Non-Institutional Investors), Retail (RII), and Employee quotas.
            </li>
            <li>
              <strong className="text-foreground font-medium">Consolidation:</strong> When an issue is dual-listed, BSE and NSE order books are deduplicated and consolidated into a unified subscription multiple.
            </li>
          </ul>
        </div>
      </section>

      {/* Pillar 3: Allotment Status */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-normal text-foreground flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">3</span>
          Registrar Allotment Gateways & Live Status Verification
        </h2>
        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground font-light space-y-3 leading-relaxed">
          <p>
            The allotment status of an IPO is finalized solely by the appointed Registrar to the Issue. We monitor official endpoints across India&apos;s leading SEBI-registered share transfer agents:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
            <span className="p-2.5 rounded-lg border border-border/50 bg-background text-center font-normal">Link Intime India</span>
            <span className="p-2.5 rounded-lg border border-border/50 bg-background text-center font-normal">KFin Technologies</span>
            <span className="p-2.5 rounded-lg border border-border/50 bg-background text-center font-normal">Bigshare Services</span>
            <span className="p-2.5 rounded-lg border border-border/50 bg-background text-center font-normal">Purva Sharegistry</span>
          </div>
          <p className="text-xs sm:text-sm pt-2">
            Status is only marked as <span className="text-emerald-500 font-medium">“Allotment Out”</span> when the registrar officially enables query resolution against PAN / Application No. / Demat DP ID.
          </p>
        </div>
      </section>

      {/* Correction & Editorial Policy */}
      <section className="p-6 rounded-2xl border border-border/50 bg-card/40 space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-primary" />
          <h2 className="text-base sm:text-lg font-normal text-foreground">Data Correction & Feedback Policy</h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
          Our team is dedicated to 100% accuracy. If you notice any discrepancy in dates, price bands, registrar links, or grey market levels, please notify our research desk immediately at <strong className="text-foreground font-medium">research@ipoji.com</strong>. All reports are investigated and corrected within 15 minutes of verification.
        </p>
      </section>

      {/* Regulatory Disclaimer */}
      <footer className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-xs text-muted-foreground font-light space-y-2">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-normal">
          <HelpCircle className="w-4 h-4" />
          <span>Statutory Disclaimer</span>
        </div>
        <p>
          IPO Ji is an educational and financial intelligence portal. We are not a SEBI registered investment advisor or broker. Grey Market Premium (GMP) is purely indicative and derived from market observations; off-market transactions carry risks and are not legally binding. Please consult a SEBI-registered financial advisor prior to making any investment decisions.
        </p>
      </footer>
    </div>
  );
}
