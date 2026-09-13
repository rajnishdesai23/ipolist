import React from "react";
import { PageLoader } from "@/components/ui/PageLoader";

export default function IpoLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <PageLoader
        message="Fetching IPO Intelligence..."
        subMessage="Loading market offer details, valuation KPIs, timeline milestones & lot sizes"
      />
    </div>
  );
}
