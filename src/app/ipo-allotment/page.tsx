import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ExternalLink, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { getAllIpos } from "@/lib/data/ipoRepository";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LeaderboardAd } from "@/components/ads/LeaderboardAd";
import { BrokerCtaCard } from "@/components/ads/BrokerCtaCard";
import { getRegistrarPortalUrl } from "@/lib/utils/registrar";
import { IpoLogo } from "@/components/ui/IpoLogo";

export const metadata: Metadata = {
  title: "IPO Allotment Status Check Online — Direct KFintech, Link Intime & Bigshare Links",
  description:
    "Instant direct online allotment verification. Official direct links for KFintech, MUFG / Link Intime, Bigshare, and BSE India.",
};

export const revalidate = 60;

export default async function IpoAllotmentPage() {
  const ipos = await getAllIpos();

  // Sort IPOs: Allotment OUT first, Allotment Awaited below
  const sortedAllotmentIpos = [...ipos].sort((a, b) => {
    const isAOut = a.allotment?.status === "OUT" || a.status === "CLOSED";
    const isBOut = b.allotment?.status === "OUT" || b.status === "CLOSED";
    if (isAOut && !isBOut) return -1;
    if (!isAOut && isBOut) return 1;
    return 0;
  });

  const registrars = [
    {
      name: "KFin Technologies (KFintech)",
      url: "https://ipostatus.kfintech.com/",
      badge: "KFintech Direct Portal",
      popularCompanies: "Bajaj Housing, Premier Energies, Northern Arc",
    },
    {
      name: "MUFG / Link Intime India",
      url: "https://in.mpms.mufg.com/Initial_Offer/public-issues.html",
      badge: "Link Intime / MUFG Portal",
      popularCompanies: "Hero Motors, Western Carriers, Tata Tech",
    },
    {
      name: "Bigshare Services",
      url: "https://www.bigshareonline.com/ipo_Allotment.html",
      badge: "Bigshare Direct Portal",
      popularCompanies: "Mainboard & SME Public Offerings",
    },
    {
      name: "Skyline Financial",
      url: "https://www.skylinerta.com/ipo.php",
      badge: "Skyline Portal",
      popularCompanies: "BSE & NSE SME Offerings",
    },
    {
      name: "BSE Official Allotment",
      url: "https://www.bseindia.com/investors/appli_check.aspx",
      badge: "BSE India Direct",
      popularCompanies: "Check any IPO using PAN card",
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb items={[{ name: "IPO Allotment Hub", url: "/ipo-allotment" }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200">
              <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
              <span>Official Direct Allotment Gateway</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
              IPO Allotment Status Check
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Direct official registrar portals. Click to verify your allotment status instantly using your PAN Card number.
            </p>
          </div>
        </div>

        <LeaderboardAd />

        {/* Official Registrar Direct Portals */}
        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-heading flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>Official Registrar Direct Portals</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {registrars.map((reg) => (
              <a
                key={reg.name}
                href={reg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:border-blue-500 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {reg.badge}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {reg.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{reg.popularCompanies}</p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold text-blue-600 dark:text-blue-400">
                  <span>Open Official Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Sorted Allotment Status Table: Allotment OUT First, Awaited Below */}
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-card p-5 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Allotment Status by IPO (OUT First)</span>
              </h2>
              <p className="text-xs text-slate-500">
                IPOs with allotment declared are listed at the top
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3.5 px-4">IPO Company</th>
                  <th className="py-3.5 px-4">Registrar</th>
                  <th className="py-3.5 px-4">Allotment Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Direct Portal Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sortedAllotmentIpos.map((ipo) => {
                  const isOut = ipo.allotment?.status === "OUT" || ipo.status === "CLOSED";
                  const portalUrl = getRegistrarPortalUrl(ipo.registrar?.name, ipo.allotment?.links?.[0]?.url || ipo.registrar?.website);

                  return (
                    <tr
                      key={ipo.id}
                      className={`transition-colors ${
                        isOut
                          ? "bg-purple-50/20 dark:bg-purple-950/10 hover:bg-purple-50/40"
                          : "hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2.5">
                          <IpoLogo name={ipo.name} logoUrl={ipo.logoUrl} size="sm" />
                          <Link href={`/ipo/${ipo.slug}`} className="hover:text-blue-600 line-clamp-1">
                            {ipo.name}
                          </Link>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {ipo.registrar?.name || "Registrar Server"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                        {ipo.dates?.allotment || "TBA"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            isOut
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200"
                          }`}
                        >
                          {isOut ? "ALLOTMENT OUT" : "AWAITED"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition-all shadow-sm"
                        >
                          <span>Check Allotment</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <BrokerCtaCard variant="horizontal" broker="groww" />
      </div>
    </div>
  );
}
