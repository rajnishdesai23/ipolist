"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, ExternalLink } from "lucide-react";
import { IPO, IPOStatus } from "@/types/ipo";

import { ImageUploader } from "@/components/ui/ImageUploader";
import { IpoLogo } from "@/components/ui/IpoLogo";
import { PageLoader } from "@/components/ui/PageLoader";

export default function AdminEditIpoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [ipo, setIpo] = useState<IPO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchIpo();
  }, [params.id]);

  const fetchIpo = async () => {
    try {
      const res = await fetch("/api/admin/ipos");
      const data = await res.json();
      const found = data.ipos?.find((i: IPO) => i.id === params.id || i.slug === params.id);
      if (found) setIpo(found);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipo) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/ipos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ipo),
      });
      const data = await res.json();
      if (data.success) {
        alert("IPO updated successfully!");
        router.push("/portal-console-x9182-admin-secure/ipos");
      } else {
        alert("Failed to save: " + data.error);
      }
    } catch (e: any) {
      alert("Error saving IPO: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoader message="Loading IPO Editor..." />;
  }
  if (!ipo) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-xl font-bold text-white">IPO Not Found</h2>
        <Link href="/portal-console-x9182-admin-secure/ipos" className="text-blue-400 hover:underline text-xs">
          ← Back to IPOs List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <Link
          href="/portal-console-x9182-admin-secure/ipos"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to IPO List</span>
        </Link>
        <Link
          href={`/ipo/${ipo.slug}`}
          target="_blank"
          className="text-xs text-blue-400 hover:underline flex items-center gap-1"
        >
          <span>View Live Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <IpoLogo name={ipo.name} logoUrl={ipo.logoUrl} size="lg" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Edit {ipo.name}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Update company details, logo, live GMP, and dates.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
          <h3 className="font-bold text-base text-white">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Company Name</label>
              <input
                type="text"
                value={ipo.name}
                onChange={(e) => setIpo({ ...ipo, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Status</label>
              <select
                value={ipo.status}
                onChange={(e) => setIpo({ ...ipo, status: e.target.value as IPOStatus })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
              >
                <option value="LIVE">LIVE</option>
                <option value="UPCOMING">UPCOMING</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <ImageUploader
              label="Company Logo (Firebase Storage / Base64 Fallback)"
              value={ipo.logoUrl || ""}
              onChange={(url) => setIpo({ ...ipo, logoUrl: url })}
              folder="logos"
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
          <h3 className="font-bold text-base text-white">GMP & Pricing</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Price Min (₹)</label>
              <input
                type="number"
                value={ipo.priceBand?.min || 0}
                onChange={(e) =>
                  setIpo({ ...ipo, priceBand: { ...ipo.priceBand, min: Number(e.target.value) } })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Price Max (₹)</label>
              <input
                type="number"
                value={ipo.priceBand?.max || 0}
                onChange={(e) =>
                  setIpo({ ...ipo, priceBand: { ...ipo.priceBand, max: Number(e.target.value) } })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Current GMP (₹)</label>
              <input
                type="number"
                value={ipo.gmp?.value || 0}
                onChange={(e) => {
                  const maxP = ipo.priceBand?.max || 100;
                  const gVal = Number(e.target.value);
                  setIpo({
                    ...ipo,
                    gmp: {
                      ...ipo.gmp,
                      value: gVal,
                      percentage: Number(((gVal / maxP) * 100).toFixed(2)),
                      expectedListingPrice: maxP + gVal,
                    },
                  });
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-extrabold text-sm"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Lot Size</label>
              <input
                type="number"
                value={ipo.lotSize || 0}
                onChange={(e) => setIpo({ ...ipo, lotSize: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3 rounded-xl text-sm shadow-lg flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "SAVING..." : "UPDATE IPO CHANGES"}</span>
        </button>
      </form>
    </div>
  );
}
