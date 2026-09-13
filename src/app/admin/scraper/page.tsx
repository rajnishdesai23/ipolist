"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, CheckCircle2, AlertCircle, Play, Clock, Sparkles, Server } from "lucide-react";
import { ScrapeLog } from "@/lib/scrapers/types";
import { formatDate } from "@/lib/utils/formatters";

export default function AdminScraperPage() {
  const [logs, setLogs] = useState<ScrapeLog[]>([]);
  const [running, setRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/admin/scraper");
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunScraper = async () => {
    setRunning(true);
    setStatusMessage("Connecting to multi-source scraping adapters...");
    try {
      const res = await fetch("/api/admin/scraper", { method: "POST" });
      const data = await res.json();
      if (data.success && data.log) {
        setLogs((prev) => [data.log, ...prev]);
        setStatusMessage(
          `Sync completed! Processed: ${data.log.totalProcessed}, Updated: ${data.log.totalUpdated}, Created: ${data.log.totalCreated}`
        );
      } else {
        setStatusMessage("Scraper execution encountered an issue.");
      }
    } catch (e) {
      setStatusMessage("Failed to execute scraper.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
            <Server className="w-3.5 h-3.5" />
            <span>Ingestion Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Scraper Health & Automation Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Trigger on-demand multi-source synchronization or review automated cron logs.
          </p>
        </div>

        <button
          onClick={handleRunScraper}
          disabled={running}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-transform hover:scale-105"
        >
          <Play className={`w-4 h-4 fill-white ${running ? "animate-pulse" : ""}`} />
          <span>{running ? "SCRAPING SOURCES..." : "RUN SCRAPER NOW"}</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-800 text-xs text-blue-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Sources Health Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-white">IPOWatch Adapter</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              Primary
            </span>
          </div>
          <p className="text-xs text-slate-400">Scrapes Mainboard & SME GMP, Price, Dates</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Endpoint Resilient</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-white">IPOPremium Adapter</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
              Secondary
            </span>
          </div>
          <p className="text-xs text-slate-400">Cross-verifies Kostak & Sauda premiums</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Endpoint Resilient</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-white">IPOJi Adapter</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800">
              Fallback
            </span>
          </div>
          <p className="text-xs text-slate-400">Verification & SME backup coverage</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Endpoint Resilient</span>
          </div>
        </div>
      </div>

      {/* Scraper Execution Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          Scraper Execution History
        </h3>

        {logs.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            No scraper logs yet. Click &quot;RUN SCRAPER NOW&quot; above to trigger your first sync.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-bold uppercase border-b border-slate-800">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Processed</th>
                  <th className="py-2.5 px-3">Updated</th>
                  <th className="py-2.5 px-3">Created</th>
                  <th className="py-2.5 px-3">Errors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono text-[11px]">
                      {formatDate(l.timestamp, "dd MMM yyyy, hh:mm:ss a")}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          l.status === "SUCCESS"
                            ? "bg-emerald-950 text-emerald-400"
                            : "bg-amber-950 text-amber-400"
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">{l.durationMs}ms</td>
                    <td className="py-3 px-3 font-semibold">{l.totalProcessed}</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">{l.totalUpdated}</td>
                    <td className="py-3 px-3 text-blue-400 font-bold">{l.totalCreated}</td>
                    <td className="py-3 px-3 text-rose-400 font-bold">{l.totalErrors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
