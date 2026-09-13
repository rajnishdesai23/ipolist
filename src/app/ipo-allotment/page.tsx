import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ExternalLink, Search, ArrowRight } from "lucide-react";
import { getAllIpos } from "@/lib/data/ipoRepository";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LeaderboardAd } from "@/components/ads/LeaderboardAd";
import { BrokerCtaCard } from "@/components/ads/BrokerCtaCard";

export const metadata: Metadata = {
  title: "IPO Allotment Status Check Online — Link Intime, KFintech & BSE",
  description:
    "Check IPO allotment status online by PAN number. Official direct links for Link Intime, KFintech, Bigshare, Skyline, BSE, and NSE allotment servers.",
};

export const revalidate = 60;

export default async function IpoAllotmentPage() {
  const ipos = await getAllIpos();
  const registrars = [
    {
      name: "Link Intime India",
      tagline: "India's largest IPO registrar (Hero Motors, Western Carriers, Tata Tech)",
      url: "https://linkintime.co.in/initial_offer/public-issues.html",
      badge: "Link Intime Portal",
    },
    {
      name: "KFin Technologies",
      tagline: "Premier registrar (Bajaj Housing Finance, Premier Energies, Northern Arc)",
      url: "https://ris.kfintech.com/ipostatus/",
      badge: "KFintech Portal",
    },
    {
      name: "Bigshare Services",
      tagline: "Specialist in SME and Mainboard public offerings",
      url: "https://www.bigshareonline.com/ipo_Allotment.html",
      badge: "Bigshare Portal",
    },
    {
      name: "Skyline Financial",
      tagline: "Registrar for BSE SME and NSE Emerge issues",
      url: "https://www.skylinerta.com/ipo.php",
      badge: "Skyline Portal",
    },
    {
      name: "BSE India Allotment",
      tagline: "Check application status for any IPO directly on BSE",
      url: "https://www.bseindia.com/investors/appli_check.aspx",
      badge: "BSE Official",
    },
    {
      name: "NSE Allotment Verification",
      tagline: "Verify bids and allotment on National Stock Exchange portal",
      url: "https://www.nseindia.com/products/content/equities/ipos/ipo_login.htm",
      badge: "NSE Official",
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb items={[{ name: "IPO Allotment Hub", url: "/ipo-allotment" }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 mb-2">
            <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
            <span>Official Registrar Gateway</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
            Check IPO Allotment Status Online
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Direct access to official registrar verification servers. Check your allotment status instantly using your PAN Card number or Application number.
          </p>
        </div>

        <LeaderboardAd />

        {/* Step by step guide card */}
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
            <Search className="w-5 h-5 text-blue-400" />
            How to Check Your Allotment Status in 3 Steps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-blue-300">Step 1</span>
              <p className="font-bold text-sm text-white">Choose Your Registrar</p>
              <p className="text-slate-300 text-[11px]">
                Click on the assigned registrar for your IPO (e.g. Link Intime or KFintech below).
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-blue-300">Step 2</span>
              <p className="font-bold text-sm text-white">Select IPO & Enter PAN</p>
              <p className="text-slate-300 text-[11px]">
                Choose the company name from the dropdown list and input your 10-digit PAN number.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-blue-300">Step 3</span>
              <p className="font-bold text-sm text-white">View Allotted Shares</p>
              <p className="text-slate-300 text-[11px]">
                The server will show the exact shares allotted and UPI mandate unblock status.
              </p>
            </div>
          </div>
        </div>

        {/* Official Registrar Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Official Allotment Verification Portals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {reg.badge}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {reg.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{reg.tagline}</p>
                </div>
                <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>Open Verification Server</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Recent IPOs Allotment Status Table */}
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card p-5 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Recent IPOs Allotment Status Schedule
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2.5 px-3">IPO Name</th>
                  <th className="py-2.5 px-3">Registrar</th>
                  <th className="py-2.5 px-3">Allotment Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {ipos.map((ipo) => (
                  <tr key={ipo.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      <Link href={`/ipo/${ipo.slug}`} className="hover:text-blue-600">
                        {ipo.name}
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {ipo.registrar?.name || "Registrar Portal"}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {ipo.dates?.allotment || "TBA"}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          ipo.status === "CLOSED"
                            ? "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {ipo.status === "CLOSED" ? "ALLOTMENT OUT" : "AWAITED"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href={ipo.registrar?.website || "https://linkintime.co.in"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span>Check</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <BrokerCtaCard variant="horizontal" broker="groww" />
      </div>
    </div>
  );
}
