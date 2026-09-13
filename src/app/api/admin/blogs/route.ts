import { NextRequest, NextResponse } from "next/server";
import { getAllBlogs, saveBlog } from "@/lib/data/blogRepository";
import { MOCK_BLOGS } from "@/lib/data/mockBlogs";
import { BlogPost } from "@/types/blog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let blogs = await getAllBlogs();
    if (blogs.length === 0) {
      // Seed mock blogs if empty
      for (const b of MOCK_BLOGS) {
        await saveBlog(b);
      }
      blogs = await getAllBlogs();
    }
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
