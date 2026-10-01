import { NextRequest, NextResponse } from "next/server";
import { getApplications, createApplication, getSession } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("plyace_session")?.value;
    const user = sessionId ? getSession(sessionId) : null;

    if (!user) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    // Admins see all applications; students see only their own
    const studentId = user.role === "admin" ? undefined : user.id;
    const applications = getApplications(studentId);

    return NextResponse.json({ success: true, applications });
  } catch (error: any) {
    console.error("Fetch applications error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch applications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("plyace_session")?.value;
    const user = sessionId ? getSession(sessionId) : null;

    if (!user) {
      return NextResponse.json({ success: false, error: "Authentication required to apply" }, { status: 401 });
    }

    const body = await req.json();
    const { jobId, company, jobTitle, matchScore } = body;

    if (!jobId || !company || !jobTitle) {
      return NextResponse.json({ success: false, error: "Missing required application parameters" }, { status: 400 });
    }

    // Check if already applied
    const existing = getApplications(user.id);
    if (existing.some((a) => a.jobId === jobId)) {
      return NextResponse.json({ success: false, error: "You have already applied for this placement drive." }, { status: 400 });
    }

    const newApp = createApplication({
      jobId,
      studentId: user.id,
      studentName: user.name,
      studentBranch: user.branch,
      studentCgpa: user.cgpa,
      matchScore: matchScore || 70,
      company,
      jobTitle,
    });

    return NextResponse.json({ success: true, application: newApp }, { status: 201 });
  } catch (error: any) {
    console.error("Create application error:", error);
    return NextResponse.json({ success: false, error: "Failed to submit application" }, { status: 500 });
  }
}
