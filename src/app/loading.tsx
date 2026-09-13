import React from "react";
import { PageLoader } from "@/components/ui/PageLoader";

export default function GlobalLoading() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center">
      <PageLoader
        message="Loading Live IPO Intelligence..."
        subMessage="Preparing latest Mainboard & SME IPO data, live GMPs, and allotment checkers"
      />
    </div>
  );
}
