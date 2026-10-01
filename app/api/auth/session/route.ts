import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("plyace_session")?.value;

    if (!sessionId) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const user = getSession(sessionId);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    return NextResponse.json({ authenticated: true, user }, { status: 200 });
  } catch (error: any) {
    console.error("Session verification error:", error);
    return NextResponse.json({ authenticated: false, error: "Internal error" }, { status: 500 });
  }
}
