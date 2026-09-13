import { NextRequest, NextResponse } from "next/server";
import { updateIpoGmp } from "@/lib/data/ipoRepository";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, gmp, isManualOverride } = body;

    if (!id || typeof gmp !== "number") {
      return NextResponse.json({ error: "Invalid IPO ID or GMP value" }, { status: 400 });
    }

    const updated = await updateIpoGmp(id, gmp, isManualOverride !== false);
    if (!updated) {
      return NextResponse.json({ error: "IPO not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, ipo: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
