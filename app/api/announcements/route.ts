import { NextRequest, NextResponse } from "next/server";
import { getAllAnnouncements, createAnnouncement, getSession } from "@/lib/db";

export async function GET() {
  try {
    const announcements = getAllAnnouncements();
    return NextResponse.json({ success: true, announcements });
  } catch (error: any) {
    console.error("Fetch announcements error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("plyace_session")?.value;
    const user = sessionId ? getSession(sessionId) : null;

    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Placement Officer privileges required" }, { status: 403 });
    }

    const body = await req.json();
    const { title, body: textBody, tag } = body;

    if (!title || !textBody) {
      return NextResponse.json({ success: false, error: "Title and announcement body are required" }, { status: 400 });
    }

    const annc = createAnnouncement({
      title,
      body: textBody,
      tag: tag || "General",
      author: user.name || "CGPU Placement Cell",
    });

    return NextResponse.json({ success: true, announcement: annc }, { status: 201 });
  } catch (error: any) {
    console.error("Create announcement error:", error);
    return NextResponse.json({ success: false, error: "Failed to create announcement" }, { status: 500 });
  }
}
