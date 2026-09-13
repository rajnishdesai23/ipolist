"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Save, Check, RefreshCw } from "lucide-react";
import { IPO } from "@/types/ipo";
import { formatINR } from "@/lib/utils/formatters";

export default function AdminGmpPage() {
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [loading, setLoading] = useState(true);
  const [gmpEdits, setGmpEdits] = useState<Record<string, number>>({});
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchIpos();
  }, []);

  const fetchIpos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ipos");
      const data = await res.json();
      if (data.ipos) {
        setIpos(data.ipos);
        const initialEdits: Record<string, number> = {};
        data.ipos.forEach((i: IPO) => {
          initialEdits[i.id] = i.gmp?.value ?? 0;
        });
        setGmpEdits(initialEdits);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGmpChange = (id: string, value: number) => {
    setGmpEdits((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveGmp = async (id: string) => {
    const newValue = gmpEdits[id];
    try {
      const res = await fetch("/api/admin/gmp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, gmp: newValue, isManualOverride: true }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedStatus((prev) => ({ ...prev, [id]: true }));
        setTimeout(() => {
          setSavedStatus((prev) => ({ ...prev, [id]: false }));
        }, 2000);
      }
    } catch (error) {
      alert("Failed to update GMP");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Fast Spreadsheet Workflow</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            GMP Quick Update Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Update Grey Market Premium rates in seconds across all active IPOs.
          </p>
        </div>

        <button
          onClick={fetchIpos}
          className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Quick Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <th className="py-3.5 px-4">IPO Name</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Issue Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">New GMP (₹)</th>
                <th className="py-3.5 px-4">Calculated Listing Price</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {ipos.map((ipo) => {
                const currentVal = gmpEdits[ipo.id] ?? ipo.gmp?.value ?? 0;
                const priceMax = ipo.priceBand?.max || 100;
                const expListing = priceMax + currentVal;
                const isSaved = savedStatus[ipo.id];

                return (
                  <tr key={ipo.id} className="hover:bg-slate-800/40">
                    <td className="py-4 px-4 font-bold text-white">{ipo.name}</td>
                    <td className="py-4 px-4 text-slate-400">{ipo.type}</td>
                    <td className="py-4 px-4 font-semibold text-slate-300">
                      {ipo.priceBand?.raw || formatINR(ipo.priceBand?.max || 0)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {ipo.status}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">₹</span>
                        <input
                          type="number"
                          value={currentVal}
                          onChange={(e) => handleGmpChange(ipo.id, Number(e.target.value))}
                          className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-extrabold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </td>

                    <td className="py-4 px-4 font-bold text-emerald-400">
                      {formatINR(expListing)}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleSaveGmp(ipo.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isSaved
                            ? "bg-emerald-600 text-white"
                            : "bg-blue-600 hover:bg-blue-500 text-white"
                        }`}
                      >
                        {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                        <span>{isSaved ? "Saved!" : "Save"}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
