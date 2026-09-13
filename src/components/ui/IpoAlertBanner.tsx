"use client";

import React, { useState } from "react";
import { Bell, Check, Send, Sparkles } from "lucide-react";

interface IpoAlertBannerProps {
  ipoName?: string;
  className?: string;
}

export default function IpoAlertBanner({ ipoName, className = "" }: IpoAlertBannerProps) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;
    setSubscribed(true);
    // In production, save to newsletter collection / broadcast API
    try {
      const stored = JSON.parse(localStorage.getItem("ipo_alert_subscribers") || "[]");
      stored.push({ contact: emailOrPhone, ipo: ipoName || "ALL", date: new Date().toISOString() });
      localStorage.setItem("ipo_alert_subscribers", JSON.stringify(stored));
    } catch {
      // ignore
    }
  };

  return (
    <section
      aria-label="IPO Alerts & Community Feed"
      className={`relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent p-5 sm:p-6 shadow-sm ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Alerts • Free Forever</span>
          </div>
          <h3 className="text-base sm:text-lg font-normal text-foreground tracking-tight">
            Get instant {ipoName ? `${ipoName} GMP & Allotment` : "IPO GMP, Subscription & Allotment"} alerts
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
            Never miss an allotment announcement or sudden grey market swing. Real-time updates delivered straight to your inbox.
          </p>
        </div>

        <div className="w-full md:w-auto min-w-[280px] sm:min-w-[320px]">
          {subscribed ? (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">You&apos;re subscribed! We&apos;ll ping you the instant updates drop.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="Enter Email or WhatsApp No."
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-border bg-background/80 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-light"
                required
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Notify Me</span>
              </button>
            </form>
          )}
          <p className="text-[10px] text-muted-foreground/70 mt-2 font-light">
            Zero spam. Unsubscribe anytime with 1 click.
          </p>
        </div>
      </div>
    </section>
  );
}
