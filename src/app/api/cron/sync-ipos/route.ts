import { NextRequest, NextResponse } from "next/server";
import { runScraperSync } from "@/lib/scrapers/orchestrator";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const urlSecret = request.nextUrl.searchParams.get("secret");
  const cronSecret = process.env.CRON_SECRET || "ipolist-default-cron-secret-2026";

  // Check Bearer token or URL parameter
  const isAuthorized =
    authHeader === `Bearer ${cronSecret}` ||
    urlSecret === cronSecret ||
    process.env.NODE_ENV === "development";

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized cron access" }, { status: 401 });
  }

  try {
    const log = await runScraperSync();
    return NextResponse.json({
      success: true,
      message: "Scraper sync completed successfully",
      log,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Scraper execution failed" },
      { status: 500 }
    );
  }
}
