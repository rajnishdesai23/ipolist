"use client";

import React, { useState } from "react";
import { DollarSign, CheckCircle2, Save, Sparkles, ShieldCheck } from "lucide-react";

export default function AdminAdsPage() {
  const [zerodhaUrl, setZerodhaUrl] = useState("https://zerodha.com/open-account");
  const [angelOneUrl, setAngelOneUrl] = useState("https://angelone.in");
  const [growwUrl, setGrowwUrl] = useState("https://groww.in");
  const [upstoxUrl, setUpstoxUrl] = useState("https://upstox.com");
  const [leaderboardEnabled, setLeaderboardEnabled] = useState(true);
  const [mobileStickyEnabled, setMobileStickyEnabled] = useState(true);
  const [inFeedEnabled, setInFeedEnabled] = useState(true);

  const handleSave = () => {
    alert("Monetization & Ad settings saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
          <DollarSign className="w-3.5 h-3.5" />
          <span>Monetization & Affiliate Network</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
          Ad Slots & Broker Affiliate Links
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure Google AdSense slots, custom banners, and high-converting Demat account affiliate tracking URLs.
        </p>
      </div>

      {/* Broker Links */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Affiliate Broker Partner Links (High EPC)
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Zerodha Affiliate Link
            </label>
            <input
              type="url"
              value={zerodhaUrl}
              onChange={(e) => setZerodhaUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Angel One Affiliate Link
            </label>
            <input
              type="url"
              value={angelOneUrl}
              onChange={(e) => setAngelOneUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Groww Affiliate Link
            </label>
            <input
              type="url"
              value={growwUrl}
              onChange={(e) => setGrowwUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Upstox Affiliate Link
            </label>
            <input
              type="url"
              value={upstoxUrl}
              onChange={(e) => setUpstoxUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* Ad Slots Toggle */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-base text-white">Active Ad Units</h3>
        <div className="space-y-3 text-xs">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={leaderboardEnabled}
              onChange={(e) => setLeaderboardEnabled(e.target.checked)}
              className="w-4 h-4 rounded accent-blue-600"
            />
            <span className="font-bold text-slate-200">
              Top Header Leaderboard (728x90 Desktop / 320x50 Mobile)
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={inFeedEnabled}
              onChange={(e) => setInFeedEnabled(e.target.checked)}
              className="w-4 h-4 rounded accent-blue-600"
            />
            <span className="font-bold text-slate-200">
              In-Feed Native Ad Cards between IPO listings
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={mobileStickyEnabled}
              onChange={(e) => setMobileStickyEnabled(e.target.checked)}
              className="w-4 h-4 rounded accent-blue-600"
            />
            <span className="font-bold text-slate-200">
              Mobile Bottom Floating Sticky Ad Bar
            </span>
          </label>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3 rounded-xl text-sm shadow-lg flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" />
        <span>SAVE AD & AFFILIATE SETTINGS</span>
      </button>
    </div>
  );
}
