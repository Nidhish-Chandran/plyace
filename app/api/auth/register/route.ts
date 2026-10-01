import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createUser, createSession } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      rollNumber,
      email,
      password,
      branch,
      batch,
      graduationDate,
      cgpa,
      backlogs,
      skills,
    } = body;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json({ success: false, error: "Name, email, and password are required" }, { status: 400 });
    }

    if (!rollNumber?.trim()) {
      return NextResponse.json({ success: false, error: "University Roll Number / Registration Number is required" }, { status: 400 });
    }

    // Check duplicate email
    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email is already registered in the CGPU placement system" },
        { status: 409 }
      );
    }

    // Create user in database
    const newUser = createUser({
      name: name.trim(),
      rollNumber: rollNumber.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      password,
      role: "student",
      branch: branch || "Computer Science & Engineering",
      batch: batch || "2023-2027",
      graduationDate: graduationDate || "2027-06-30",
      cgpa: parseFloat(cgpa) || 7.5,
      backlogs: parseInt(backlogs) || 0,
      skills: Array.isArray(skills) ? skills : typeof skills === "string" ? skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
    });

    // Create session
    const sessionId = createSession(newUser.id);

    const response = NextResponse.json({ success: true, user: newUser }, { status: 201 });

    // Set session cookie
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
    console.error("Register API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
