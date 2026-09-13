import { NextRequest, NextResponse } from "next/server";
import { runScraperSync, getScrapeLogs } from "@/lib/scrapers/orchestrator";

export async function GET() {
  const logs = await getScrapeLogs();
  return NextResponse.json({ success: true, logs });
}

export async function POST() {
  try {
    const log = await runScraperSync();
    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
