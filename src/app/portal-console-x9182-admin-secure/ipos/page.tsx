"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Edit3, Trash2, ExternalLink, RefreshCw } from "lucide-react";
import { IPO } from "@/types/ipo";
import { formatINR } from "@/lib/utils/formatters";

import { IpoLogo } from "@/components/ui/IpoLogo";
import { IpoTableSkeleton } from "@/components/ui/IpoSkeleton";

export default function AdminIposListPage() {
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIpos();
  }, []);

  const fetchIpos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ipos");
      const data = await res.json();
      if (data.ipos) setIpos(data.ipos);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/ipos?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setIpos((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (e) {
      alert("Failed to delete IPO");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            IPO Database Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage scraped & real-time IPO offerings across Mainboard & SME segments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchIpos}
            className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/portal-console-x9182-admin-secure/ipos/new"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New IPO</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <IpoTableSkeleton rows={8} />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <th className="py-3.5 px-4">IPO Name & Logo</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Price Band</th>
                <th className="py-3.5 px-4">GMP</th>
                <th className="py-3.5 px-4">Open/Close Dates</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {ipos.map((ipo) => {
                const gmpVal = ipo.gmp?.value ?? 0;
                const gmpPct = ipo.gmp?.percentage ?? 0;
                return (
                  <tr key={ipo.id} className="hover:bg-slate-800/40">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <IpoLogo name={ipo.name} logoUrl={ipo.logoUrl} size="sm" />
                        <div>
                          <Link href={`/portal-console-x9182-admin-secure/ipos/${ipo.slug || ipo.id}`} className="font-bold text-white hover:text-blue-400 block text-sm">
                            {ipo.name}
                          </Link>
                          <span className="font-mono text-[10px] text-slate-400">/ipo/{ipo.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-blue-400">
                        {ipo.type}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {ipo.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold">
                      {ipo.priceBand?.raw || formatINR(ipo.priceBand?.max || 0)}
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-400">
                      ₹{gmpVal} ({gmpPct > 0 ? `+${gmpPct}%` : "0%"})
                    </td>
                    <td className="py-4 px-4 text-slate-400 text-[11px]">
                      {ipo.dates?.rawRange || (ipo.dates?.open ? `${ipo.dates.open} – ${ipo.dates.close || ""}` : "TBA")}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/portal-console-x9182-admin-secure/ipos/${ipo.slug || ipo.id}`}
                          className="px-2.5 py-1.5 inline-flex items-center gap-1 text-blue-400 hover:text-white bg-blue-950/60 hover:bg-blue-600 rounded-lg font-bold text-xs transition-colors"
                          title="Edit IPO Details & Logo"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>
                        <Link
                          href={`/ipo/${ipo.slug}`}
                          target="_blank"
                          className="p-1.5 inline-block text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                          title="View Public Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(ipo.id, ipo.name)}
                          className="p-1.5 text-rose-400 hover:text-white bg-slate-800 rounded-lg"
                          title="Delete IPO"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
}
