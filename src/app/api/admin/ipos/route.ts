import { NextRequest, NextResponse } from "next/server";
import { getAllIpos, saveIpo, deleteIpo } from "@/lib/data/ipoRepository";
import { IPO } from "@/types/ipo";

export async function GET() {
  const ipos = await getAllIpos();
  return NextResponse.json({ success: true, ipos });
}

export async function POST(request: NextRequest) {
  try {
    const ipoData: IPO = await request.json();
    const saved = await saveIpo(ipoData);
    return NextResponse.json({ success: true, ipo: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }
    const deleted = await deleteIpo(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
