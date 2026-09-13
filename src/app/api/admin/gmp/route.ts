import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateIpoGmp } from "@/lib/data/ipoRepository";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, gmp, isManualOverride } = body;

    if (!id || typeof gmp !== "number" || isNaN(gmp)) {
      return NextResponse.json({ error: "Invalid IPO ID or GMP value" }, { status: 400 });
    }

    const updated = await updateIpoGmp(id, gmp, isManualOverride !== false);
    if (!updated) {
      return NextResponse.json({ error: "IPO not found" }, { status: 404 });
    }

    // Instantly invalidate Next.js caches on Vercel and server
    try {
      revalidatePath("/");
      revalidatePath("/ipo-gmp");
      revalidatePath("/ipo");
      revalidatePath("/ipo-allotment");
      revalidatePath("/ipo/mainboard");
      revalidatePath("/ipo/sme");
      revalidatePath("/ipo/current");
      revalidatePath("/ipo/upcoming");
      if (updated.slug) {
        revalidatePath(`/ipo/${updated.slug}`);
      }
    } catch (e) {
      console.warn("revalidatePath error:", e);
    }

    return NextResponse.json({ success: true, ipo: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
