import { NextRequest, NextResponse } from "next/server";
import { getAllBlogsAdmin, saveBlog, deleteBlog } from "@/lib/data/blogRepository";
import { BlogPost } from "@/types/blog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const blogs = await getAllBlogsAdmin();
    return NextResponse.json({ success: true, blogs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: BlogPost = await request.json();
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { success: false, error: "Title and slug are required" },
        { status: 400 }
      );
    }

    const saved = await saveBlog(body);
    return NextResponse.json({ success: true, blog: saved });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing blog ID or slug" }, { status: 400 });
    }
    const deleted = await deleteBlog(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
