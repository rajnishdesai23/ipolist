import { IPOStatus, IPO } from "@/types/ipo";

export function getIpoStatusPriority(ipo: IPO): number {
  // 1. Live IPOs first
  if (ipo.status === "LIVE") return 1;

  // 2. Allotment Out IPOs second
  if (ipo.allotment?.status === "OUT" || ipo.rawStatus?.toLowerCase().includes("allotment out")) return 2;

  // 3. Allotment Awaited IPOs third
  if (ipo.allotment?.status === "AWAITED" || ipo.rawStatus?.toLowerCase().includes("awaited")) return 3;

  // 4. Upcoming IPOs fourth
  if (ipo.status === "UPCOMING" || ipo.rawStatus?.toLowerCase().includes("upcoming")) return 4;

  // 5. Closed / Historical fifth
  return 5;
}

export function sortIposByStatusPriority(ipos: IPO[]): IPO[] {
  return [...ipos].sort((a, b) => {
    const pA = getIpoStatusPriority(a);
    const pB = getIpoStatusPriority(b);
    if (pA !== pB) return pA - pB;
    // Secondary sort: highest GMP percentage first
    return (b.gmp?.percentage || 0) - (a.gmp?.percentage || 0);
  });
}

export function getStatusBadgeConfig(status: IPOStatus): {
  label: string;
  className: string;
  dotColor: string;
} {
  switch (status) {
    case "LIVE":
      return {
        label: "LIVE NOW",
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700 font-extrabold",
        dotColor: "bg-emerald-500 animate-ping",
      };
    case "UPCOMING":
      return {
        label: "UPCOMING",
        className:
          "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 font-bold",
        dotColor: "bg-blue-500",
      };
    case "CLOSED":
    default:
      return {
        label: "CLOSED",
        className:
          "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 font-semibold",
        dotColor: "bg-slate-400",
      };
  }
}
