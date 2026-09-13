"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { IPO, IPOType, IPOStatus } from "@/types/ipo";
import { createSlug } from "@/lib/scrapers/normalizer";

import { ImageUploader } from "@/components/ui/ImageUploader";

export default function AdminNewIpoPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<IPOType>("MAINBOARD");
  const [status, setStatus] = useState<IPOStatus>("UPCOMING");
  const [logoUrl, setLogoUrl] = useState("");
  const [priceMin, setPriceMin] = useState(100);
  const [priceMax, setPriceMax] = useState(108);
  const [lotSize, setLotSize] = useState(130);
  const [gmp, setGmp] = useState(25);
  const [openDate, setOpenDate] = useState("2026-09-22");
  const [closeDate, setCloseDate] = useState("2026-09-24");
  const [allotmentDate, setAllotmentDate] = useState("2026-09-25");
  const [listingDate, setListingDate] = useState("2026-09-29");
  const [registrarName, setRegistrarName] = useState("Link Intime India Private Ltd");
  const [registrarUrl, setRegistrarUrl] = useState("https://linkintime.co.in");
  const [overview, setOverview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(createSlug(val, type === "SME"));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const minInvestment = lotSize * priceMax;
    const gmpPercentage = priceMax > 0 ? Number(((gmp / priceMax) * 100).toFixed(2)) : 0;

    const newIpo: IPO = {
      id: slug || `ipo-${Date.now()}`,
      name,
      slug: slug || `ipo-${Date.now()}`,
      type,
      status,
      logoUrl: logoUrl || undefined,
      priceBand: { min: priceMin, max: priceMax },
      lotSize,
      minimumInvestment: minInvestment,
      dates: {
        open: openDate,
        close: closeDate,
        allotment: allotmentDate,
        listing: listingDate,
      },
      gmp: {
        value: gmp,
        percentage: gmpPercentage,
        expectedListingPrice: priceMax + gmp,
        lastUpdated: new Date().toISOString(),
      },
      registrar: {
        name: registrarName,
        website: registrarUrl,
      },
      aboutCompany: overview || `${name} is an initial public offering in India.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/admin/ipos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIpo),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/portal-console-x9182-admin-secure/ipos");
      }
    } catch (error) {
      alert("Failed to save IPO");
    } finally {
      setLoading(false);
    }
  };

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
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
          Create New IPO Offering
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Add a new Mainboard or SME IPO to the live database.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-base text-white">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Company Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Swiggy Limited"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">URL Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">IPO Segment</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as IPOType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
              >
                <option value="MAINBOARD">Mainboard (NSE & BSE)</option>
                <option value="SME">SME (NSE Emerge / BSE SME)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as IPOStatus)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
              >
                <option value="LIVE">LIVE (Live Bidding)</option>
                <option value="UPCOMING">UPCOMING</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <ImageUploader
              label="Company Logo (Firebase Storage / Base64 Fallback)"
              value={logoUrl}
              onChange={(url) => setLogoUrl(url)}
              folder="logos"
            />
          </div>
        </div>

        {/* Pricing & Lots */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-base text-white">Pricing & Lot Size</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Price Min (₹)</label>
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Price Max (₹)</label>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Lot Size</label>
              <input
                type="number"
                value={lotSize}
                onChange={(e) => setLotSize(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-slate-300 font-bold mb-1 text-xs">
              Initial Grey Market Premium (GMP ₹)
            </label>
            <input
              type="number"
              value={gmp}
              onChange={(e) => setGmp(Number(e.target.value))}
              className="w-48 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-extrabold text-sm"
            />
          </div>
        </div>

        {/* Dates & Registrar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-base text-white">Dates & Registrar</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Open Date</label>
              <input
                type="text"
                value={openDate}
                onChange={(e) => setOpenDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Close Date</label>
              <input
                type="text"
                value={closeDate}
                onChange={(e) => setCloseDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Allotment Date</label>
              <input
                type="text"
                value={allotmentDate}
                onChange={(e) => setAllotmentDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Listing Date</label>
              <input
                type="text"
                value={listingDate}
                onChange={(e) => setListingDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Registrar Name</label>
              <input
                type="text"
                value={registrarName}
                onChange={(e) => setRegistrarName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Registrar Website URL</label>
              <input
                type="url"
                value={registrarUrl}
                onChange={(e) => setRegistrarUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
              />
            </div>
          </div>

          <div className="text-xs pt-2">
            <label className="block text-slate-300 font-bold mb-1">Company Overview</label>
            <textarea
              rows={3}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="Brief description of business model..."
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3 rounded-xl text-sm shadow-lg flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "SAVING IPO..." : "CREATE & PUBLISH IPO"}</span>
        </button>
      </form>
    </div>
  );
}
