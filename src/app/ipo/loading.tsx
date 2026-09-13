import React from "react";
import { PageLoader } from "@/components/ui/PageLoader";

export default function IpoLoading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <PageLoader message="Loading..." />
    </div>
  );
}
