import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createSession } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ success: false, error: "No account found with this institutional email" }, { status: 401 });
    }

    if (user.password !== password) {
      return NextResponse.json({ success: false, error: "Invalid password credentials" }, { status: 401 });
    }

    // Create session in database
    const sessionId = createSession(user.id);

    // Clean user response
    const { password: _, ...safeUser } = user;

    const response = NextResponse.json({ success: true, user: safeUser }, { status: 200 });

    // Set HTTP-only cookie
    response.cookies.set({
      name: "plyace_session",
      value: sessionId,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
