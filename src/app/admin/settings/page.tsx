"use client";

import React, { useState } from "react";
import { Settings, Save, Globe, Shield } from "lucide-react";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("IPO List");
  const [siteTitle, setSiteTitle] = useState(
    "IPO List — Live IPO GMP, Allotment Status, Dates & Subscription India"
  );
  const [siteDesc, setSiteDesc] = useState(
    "Track latest Mainboard & SME IPOs in India. Real-time Grey Market Premium (GMP), live subscription status, allotment link checker, expected listing gains and IPO reviews."
  );
  const [cronSecret, setCronSecret] = useState("ipolist-default-cron-secret-2026");

  const handleSave = () => {
    alert("Site Settings saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Configuration & Metadata</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
          Site Settings & Global SEO
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage brand details, default meta tags, and scraper secrets.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-400" />
          Global SEO & Brand Defaults
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Site Brand Name</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Default Meta Title</label>
            <input
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Default Meta Description</label>
            <textarea
              rows={3}
              value={siteDesc}
              onChange={(e) => setSiteDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Cron Authentication Secret</label>
            <input
              type="password"
              value={cronSecret}
              onChange={(e) => setCronSecret(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Used to authenticate /api/cron/sync-ipos
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3 rounded-xl text-sm shadow-lg flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" />
        <span>SAVE GLOBAL CONFIGURATION</span>
      </button>
    </div>
  );
}
