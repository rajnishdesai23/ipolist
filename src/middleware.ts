import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidAdminToken } from "@/lib/adminAuth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Block legacy /admin route completely (return 404 response)
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return new NextResponse("404 Page Not Found", { status: 404 });
  }

  // 2. Protect /api/admin endpoints (excluding login endpoint)
  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/login")
  ) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const authHeader = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!isValidAdminToken(token) && !isValidAdminToken(authHeader)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access to Admin API" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/api/admin/:path*"],
};
