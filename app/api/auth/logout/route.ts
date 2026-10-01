import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("plyace_session")?.value;

    if (sessionId) {
      deleteSession(sessionId);
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully" }, { status: 200 });

    // Clear cookie
    response.cookies.set({
      name: "plyace_session",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error: any) {
    console.error("Logout API error:", error);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}
