import React from "react";
import { PageLoader } from "@/components/ui/PageLoader";

export default function AdminLoading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <PageLoader message="Loading Admin..." />
    </div>
  );
}
