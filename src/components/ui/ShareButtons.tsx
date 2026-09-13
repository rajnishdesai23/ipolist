"use client";

import React, { useState } from "react";
import { Check, Copy, Send } from "lucide-react";

interface ShareButtonsProps {
  ipoName: string;
  slug: string;
  gmpValue?: number;
  gmpPercentage?: number;
  priceBand?: string;
  estListingText?: string;
}

export function ShareButtons({
  ipoName,
  slug,
  gmpValue = 0,
  gmpPercentage = 0,
  priceBand = "TBA",
  estListingText,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const pageUrl = typeof window !== "undefined" ? window.location.href : `https://ipolist.in/ipo/${slug}`;

  const shareText = `⚡ *${ipoName} IPO GMP Today*\n` +
    `📈 Live GMP: ${gmpValue > 0 ? `+₹${gmpValue} (${gmpPercentage}%)` : "₹0"}\n` +
    `💰 Price Band: ${priceBand}\n` +
    (estListingText ? `🎯 Expected Listing: ${estListingText}\n` : "") +
    `\n👉 Check live allotment & subscription details here:\n${pageUrl}`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(
    `⚡ ${ipoName} IPO GMP Today: ${gmpValue > 0 ? `+₹${gmpValue} (${gmpPercentage}%)` : "₹0"}. Expected Listing: ${estListingText || "TBA"}`
  )}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* WhatsApp Share */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all shadow-xs"
        title="Share on WhatsApp"
      >
        <span>WhatsApp</span>
      </a>

      {/* Telegram Share */}
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium transition-all shadow-xs"
        title="Share on Telegram"
      >
        <Send className="w-3 h-3" />
        <span>Telegram</span>
      </a>

      {/* Copy Summary */}
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-all"
        title="Copy summary for social media or groups"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>Copy Summary</span>
          </>
        )}
      </button>
    </div>
  );
}
