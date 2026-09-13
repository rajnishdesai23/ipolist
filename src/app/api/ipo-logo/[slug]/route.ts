import { NextRequest, NextResponse } from "next/server";
import { getIpoBySlug } from "@/lib/data/ipoRepository";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params?.slug;
    if (!slug) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const ipo = await getIpoBySlug(slug);
    if (!ipo || !ipo.logoUrl) {
      return new NextResponse("Logo Not Found", { status: 404 });
    }

    const logoUrl = ipo.logoUrl.trim();

    // Case 1: Base64 Data URL (e.g. data:image/png;base64,...)
    if (logoUrl.startsWith("data:")) {
      const commaIdx = logoUrl.indexOf(",");
      if (commaIdx !== -1) {
        const header = logoUrl.slice(0, commaIdx);
        const base64Data = logoUrl.slice(commaIdx + 1);
        const mimeMatch = header.match(/data:([^;]+)/);
        const contentType = mimeMatch ? mimeMatch[1] : "image/png";
        const buffer = Buffer.from(base64Data, "base64");

        return new NextResponse(buffer, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    }

    // Case 2: External HTTP/HTTPS URL
    if (logoUrl.startsWith("http://") || logoUrl.startsWith("https://")) {
      return NextResponse.redirect(logoUrl, 307);
    }

    // Case 3: Local public asset path (e.g. /ipolistlogo.png)
    if (logoUrl.startsWith("/")) {
      return NextResponse.redirect(new URL(logoUrl, request.url), 307);
    }

    return new NextResponse("Invalid Logo Format", { status: 404 });
  } catch (error) {
    console.error("Error serving IPO logo:", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}
