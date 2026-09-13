import React from "react";
import { Users } from "lucide-react";
import { SubscriptionData } from "@/types/ipo";

interface SubscriptionTableProps {
  subscription?: SubscriptionData;
  ipoName: string;
}

export function SubscriptionTable({ subscription, ipoName }: SubscriptionTableProps) {
  if (!subscription) return null;

  const categories = [
    { name: "Qualified Institutional Buyers (QIB)", multiple: subscription.qib || 0, quota: "50%" },
    { name: "Non-Institutional Investors (NII / HNI)", multiple: subscription.nii || 0, quota: "15%" },
    { name: "Retail Individual Investors (RII)", multiple: subscription.retail || 0, quota: "35%" },
  ];

  const total = subscription.total || 0;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            {ipoName} Live Subscription Status
          </h4>
          <p className="text-[11px] text-slate-500">
            Category-wise demand & subscription multiples
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-xl border border-blue-200 dark:border-blue-800 self-start sm:self-auto">
          <span className="text-xs font-bold text-blue-800 dark:text-blue-300">Total Bidding:</span>
          <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
            {total > 0 ? `${total}x` : "Awaited"}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <th className="py-2.5 px-3">Investor Category</th>
              <th className="py-2.5 px-3">Quota %</th>
              <th className="py-2.5 px-3 text-right">Subscription (Times)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {categories.map((cat, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                  {cat.name}
                </td>
                <td className="py-3 px-3 text-slate-500">{cat.quota}</td>
                <td className="py-3 px-3 text-right font-extrabold text-slate-900 dark:text-white">
                  {cat.multiple > 0 ? (
                    <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
                      {cat.multiple}x
                    </span>
                  ) : (
                    "TBA"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Day wise breakdown if present */}
      {subscription.dayWise && subscription.dayWise.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h5 className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
            Day-Wise Bidding Progression
          </h5>
          <div className="grid grid-cols-3 gap-2">
            {subscription.dayWise.map((d: { day: number; date: string; total: number }) => (
              <div
                key={d.day}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center"
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Day {d.day} ({d.date})
                </span>
                <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                  {d.total}x
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
