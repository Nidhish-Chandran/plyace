import { NextRequest, NextResponse } from "next/server";
import { getAllJobs, createJob, getSession } from "@/lib/db";

export async function GET() {
  try {
    const jobs = getAllJobs();
    return NextResponse.json({ success: true, jobs });
  } catch (error: any) {
    console.error("Fetch jobs error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch placement drives" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check if session is admin
    const sessionId = req.cookies.get("plyace_session")?.value;
    const user = sessionId ? getSession(sessionId) : null;

    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized. Placement Officer privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const newJob = createJob(body);
    return NextResponse.json({ success: true, job: newJob }, { status: 201 });
  } catch (error: any) {
    console.error("Create job error:", error);
    return NextResponse.json({ success: false, error: "Failed to create placement drive" }, { status: 500 });
  }
}
