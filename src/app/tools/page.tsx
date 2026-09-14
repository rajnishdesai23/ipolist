import React from "react";
import { Metadata } from "next";
import { ToolsClient } from "./ToolsClient";

export const metadata: Metadata = {
  title: "IPO Profit & Listing Gain Calculators",
  description:
    "Free online IPO calculators for Indian stock market investors. Calculate expected listing profit, subscription allotment probability, and HNI interest costs.",
  alternates: {
    canonical: "/tools",
  },
};

export default function ToolsPage() {
  return <ToolsClient />;
}
