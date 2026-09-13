import { IPOStatus, IPO } from "@/types/ipo";

export const STATUS_PRIORITY_ORDER: Record<IPOStatus, number> = {
  LIVE: 1, // Live / Open Now
  UPCOMING: 2, // Upcoming
  CLOSED: 3, // Closed / Historical
};

export function sortIposByStatusPriority(ipos: IPO[]): IPO[] {
  return [...ipos].sort((a, b) => {
    const pA = STATUS_PRIORITY_ORDER[a.status] || 99;
    const pB = STATUS_PRIORITY_ORDER[b.status] || 99;
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
