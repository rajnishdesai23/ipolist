import React from "react";
import { PageLoader } from "@/components/ui/PageLoader";

export default function AdminLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <PageLoader
        message="Loading Admin Dashboard..."
        subMessage="Fetching IPO database entries, editorial CMS articles, and scraper status"
      />
    </div>
  );
}
