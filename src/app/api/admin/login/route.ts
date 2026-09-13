import { NextResponse } from "next/server";
import { ADMIN_MASTER_PASSWORD, ADMIN_SESSION_COOKIE, generateAdminToken } from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body || {};

    if (!password || password !== ADMIN_MASTER_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Invalid Master Admin Password" },
        { status: 401 }
      );
    }

    const token = generateAdminToken();
    const response = NextResponse.json({ success: true, message: "Admin authenticated successfully" });

    // Set HTTP-only cookie for session persistence (30 days)
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to authenticate" },
      { status: 500 }
    );
  }
}
