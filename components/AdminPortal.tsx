"use client";

import React, { useState } from "react";
import { usePlyace } from "@/lib/store";
import { Job, ApplicationStatus, JobType } from "@/lib/types";
import { StatusPill } from "./StatusPill";
import {
  PlusCircle,
  FileSpreadsheet,
  Megaphone,
  AlertOctagon,
  UserCog,
  Download,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  Users,
  ShieldCheck,
  Check,
  Search,
  Filter,
} from "lucide-react";
import confetti from "canvas-confetti";

interface AdminPortalProps {
  currentAdminTab: string;
  onOpenSimulate: () => void;
}

export function AdminPortal({ currentAdminTab, onOpenSimulate }: AdminPortalProps) {
  const {
    jobs,
    addJob,
    applications,
    updateApplicationStatus,
    announcements,
    addAnnouncement,
    violationLogs,
    allUsers,
    extendStudentAccess,
    updateStudentGraduation,
  } = usePlyace();

  // Create Job Modal state
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newJob, setNewJob] = useState({
    company: "",
    title: "",
    description: "",
    requiredSkills: "Python, SQL, Data Structures",
    minCgpa: 7.5,
    allowedBranches: "Computer Science & Engineering, Information Technology",
    maxBacklogs: 0,
    deadline: "2026-10-31",
    oppType: "full-time" as JobType,
    packageStipend: "₹12.0 LPA",
    location: "Bangalore, India",
    campusOnly: false,
  });

  // Announcement state
  const [ancTitle, setAncTitle] = useState("");
  const [ancBody, setAncBody] = useState("");
  const [ancTag, setAncTag] = useState<"Urgent" | "Drive" | "Preparation" | "General">("Drive");
  const [ancSuccess, setAncSuccess] = useState(false);

  // Status Filter for applications
  const [appFilter, setAppFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Handler for adding job
  const handleAddJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addJob({
      company: newJob.company,
      title: newJob.title,
      description: newJob.description,
      requiredSkills: newJob.requiredSkills.split(",").map((s) => s.trim()),
      minCgpa: Number(newJob.minCgpa),
      allowedBranches: newJob.allowedBranches.split(",").map((s) => s.trim()),
      maxBacklogs: Number(newJob.maxBacklogs),
      deadline: new Date(newJob.deadline).toISOString(),
      oppType: newJob.oppType,
      packageStipend: newJob.packageStipend,
      location: newJob.location,
      campusOnly: newJob.campusOnly,
    });
    setShowAddJobModal(false);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  // Handler for publishing announcement
  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ancTitle.trim() || !ancBody.trim()) return;
    addAnnouncement(ancTitle, ancBody, ancTag);
    setAncTitle("");
    setAncBody("");
    setAncSuccess(true);
    setTimeout(() => setAncSuccess(false), 3000);
  };

  // CSV Export feature (Section 6.3 - FR-13)
  const handleExportCSV = () => {
    const headers = ["Application ID", "Student Name", "Branch", "CGPA", "Company", "Job Title", "Match Score", "Status", "Applied At"];
    const rows = applications.map((app) => [
      app.id,
      `"${app.studentName || "N/A"}"`,
      `"${app.studentBranch || "N/A"}"`,
      app.studentCgpa || "N/A",
      `"${app.company}"`,
      `"${app.jobTitle}"`,
      `${app.matchScore}%`,
      app.status,
      app.appliedAt,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Plyace_Placement_Shortlist_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const matchStatus = appFilter === "All" || app.status === appFilter;
    const matchSearch =
      searchTerm === "" ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.studentName && app.studentName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Admin Overview Tab */}
      {currentAdminTab === "admin_overview" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#1E3A8A]" />
                CGPU Placement Control Dashboard
              </h2>
              <p className="text-xs text-[#64748B]">
                Real-time placement drive metrics, student lifecycle supervision, and integrity logs
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSimulate}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#2563EB]/10 text-[#2563EB] hover:bg-[#2563EB]/20 transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Simulate System Date</span>
              </button>
              <button
                onClick={() => setShowAddJobModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2563EB] hover:bg-[#1E3A8A] text-white transition-all flex items-center gap-1.5 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post New Drive</span>
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card">
              <div className="text-[11px] font-bold text-[#64748B] uppercase">Active Drives</div>
              <div className="text-2xl font-black text-[#0F172A] mt-1">{jobs.length}</div>
              <div className="text-[11px] text-[#10B981] font-semibold mt-0.5">Top Recruiters</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card">
              <div className="text-[11px] font-bold text-[#64748B] uppercase">Applications</div>
              <div className="text-2xl font-black text-[#2563EB] mt-1">{applications.length}</div>
              <div className="text-[11px] text-[#64748B] mt-0.5">Across all batches</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card">
              <div className="text-[11px] font-bold text-[#64748B] uppercase">Shortlisted</div>
              <div className="text-2xl font-black text-[#10B981] mt-1">
                {applications.filter((a) => a.status === "Shortlisted" || a.status === "Selected").length}
              </div>
              <div className="text-[11px] text-[#10B981] font-semibold mt-0.5">Clearing cutoffs</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card">
              <div className="text-[11px] font-bold text-[#64748B] uppercase">Exam Violations</div>
              <div className="text-2xl font-black text-[#EF4444] mt-1">{violationLogs.length}</div>
              <div className="text-[11px] text-[#DC2626] font-semibold mt-0.5">ExamGuard audits</div>
            </div>
          </div>

          {/* Quick Action Tables Preview */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-[#0F172A]">Recent Candidate Applications</h3>
              <button onClick={handleExportCSV} className="text-xs font-semibold text-[#2563EB] flex items-center gap-1 hover:underline">
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Company</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {applications.slice(0, 5).map((app) => (
                    <tr key={app.id}>
                      <td className="py-3 px-3 font-semibold text-[#0F172A]">{app.studentName}</td>
                      <td className="py-3 px-3 text-[#64748B]">{app.company} ({app.jobTitle})</td>
                      <td className="py-3 px-3"><StatusPill status={app.status} size="sm" /></td>
                      <td className="py-3 px-3">
                        <select
                          value={app.status}
                          onChange={(e) => updateApplicationStatus(app.id, e.target.value as ApplicationStatus)}
                          className="px-2 py-1 rounded-lg border border-[#E2E8F0] bg-white text-xs font-medium text-[#0F172A]"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview">Interview</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Admin Jobs Tab */}
      {currentAdminTab === "admin_jobs" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">Post & Manage Placement Drives</h2>
              <p className="text-xs text-[#64748B]">Set strict eligibility constraints (CGPA, backlogs, branch, campus-only)</p>
            </div>
            <button
              onClick={() => setShowAddJobModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2563EB] hover:bg-[#1E3A8A] text-white flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Drive</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((j) => (
              <div key={j.id} className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-sm text-[#0F172A]">{j.company}</span>
                    <span className="text-xs font-bold text-[#1E3A8A] bg-[#1E3A8A]/10 px-2.5 py-0.5 rounded-full">{j.packageStipend}</span>
                  </div>
                  <h4 className="font-bold text-xs text-[#2563EB] mb-1">{j.title}</h4>
                  <p className="text-xs text-[#64748B] line-clamp-2 mb-3">{j.description}</p>

                  <div className="text-[11px] text-slate-500 space-y-1 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                    <div>&bull; Min CGPA: <strong className="text-[#0F172A]">{j.minCgpa}</strong> | Max Backlogs: <strong className="text-[#0F172A]">{j.maxBacklogs}</strong></div>
                    <div>&bull; Branches: <span className="text-[#0F172A]">{j.allowedBranches.join(", ")}</span></div>
                    <div>&bull; Deadline: <span className="text-[#F59E0B] font-semibold">{new Date(j.deadline).toLocaleDateString()}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Candidate Pipeline & CSV Export */}
      {currentAdminTab === "admin_applications" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">Candidate Pipeline Management</h2>
              <p className="text-xs text-[#64748B]">Review applicants, update statuses, and export shortlists for corporate drives</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#10B981] hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV for Corporate HR</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-card">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidate or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] bg-[#F8FAFC] text-[#0F172A]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#64748B] font-semibold">Filter:</span>
              {["All", "Applied", "Shortlisted", "Interview", "Selected", "Rejected"].map((st) => (
                <button
                  key={st}
                  onClick={() => setAppFilter(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    appFilter === st
                      ? "bg-[#2563EB] text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-[#0F172A]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Academic Specs</th>
                    <th className="py-3 px-4">Company & Role</th>
                    <th className="py-3 px-4">Match %</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Change Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3 px-4 font-bold text-[#0F172A]">{app.studentName}</td>
                      <td className="py-3 px-4 text-[#64748B]">{app.studentBranch} &bull; CGPA {app.studentCgpa?.toFixed(1) || "N/A"}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#0F172A]">{app.company}</div>
                        <div className="text-[11px] text-[#64748B]">{app.jobTitle}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2563EB]">{app.matchScore}%</td>
                      <td className="py-3 px-4"><StatusPill status={app.status} size="sm" /></td>
                      <td className="py-3 px-4">
                        <select
                          value={app.status}
                          onChange={(e) => updateApplicationStatus(app.id, e.target.value as ApplicationStatus)}
                          className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] focus:ring-1 focus:ring-[#2563EB]"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview">Interview</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. Broadcast Announcements */}
      {currentAdminTab === "admin_announcements" && (
        <div className="space-y-6 max-w-4xl">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">Broadcast Placement Announcement</h2>
            <p className="text-xs text-[#64748B]">Instantly posts to all enrolled students and recent alumni</p>
          </div>

          {ancSuccess && (
            <div className="p-3.5 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-bold text-[#059669] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              Announcement broadcast successfully!
            </div>
          )}

          <form onSubmit={handleAddAnnouncement} className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-card space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Headline / Subject:</label>
              <input
                type="text"
                value={ancTitle}
                onChange={(e) => setAncTitle(e.target.value)}
                placeholder="E.g. Goldman Sachs Technical Screening Tomorrow at 9 AM"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] bg-[#F8FAFC] text-[#0F172A]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Announcement Body:</label>
              <textarea
                value={ancBody}
                onChange={(e) => setAncBody(e.target.value)}
                placeholder="Details, venue, links, or instructions..."
                rows={4}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] bg-[#F8FAFC] text-[#0F172A]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Tag Priority:</label>
              <select
                value={ancTag}
                onChange={(e) => setAncTag(e.target.value as any)}
                className="px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A]"
              >
                <option value="Urgent">Urgent</option>
                <option value="Drive">Drive Notice</option>
                <option value="Preparation">Preparation</option>
                <option value="General">General</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-bold shadow-sm transition-all"
            >
              Post Announcement
            </button>
          </form>
        </div>
      )}

      {/* 5. ExamGuard Test Audit */}
      {currentAdminTab === "admin_violations" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                <AlertOctagon className="w-6 h-6 text-[#EF4444]" />
                ExamGuard Proctored Violation Logs
              </h2>
              <p className="text-xs text-[#64748B]">Audited browser infractions (tab switches, window blur, copy/paste attempts)</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EF4444]/10 text-[#DC2626] border border-[#EF4444]/30">
              {violationLogs.length} Audited Infractions
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Test Title</th>
                    <th className="py-3 px-4">Violation Type</th>
                    <th className="py-3 px-4">Infraction Details</th>
                    <th className="py-3 px-4">Time Recorded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {violationLogs.length > 0 ? (
                    violationLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-red-50/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-[#0F172A]">{log.studentName}</td>
                        <td className="py-3 px-4 text-[#64748B]">{log.testTitle}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EF4444]/15 text-[#DC2626]">
                            {log.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#0F172A] font-medium">{log.description}</td>
                        <td className="py-3 px-4 text-[#64748B] font-mono">{log.timestamp}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400">
                        No security violations logged yet. Assessments remain 100% clean.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. Alumni & Lifecycle Access Extender */}
      {currentAdminTab === "admin_students" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">Student & Passout Lifecycle Directory</h2>
              <p className="text-xs text-[#64748B]">Audit graduation cutoffs and extend access override for passouts</p>
            </div>
            <button
              onClick={onOpenSimulate}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2563EB] text-white flex items-center gap-1.5 shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Simulate System Date</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Batch & Branch</th>
                    <th className="py-3 px-4">Graduation Date</th>
                    <th className="py-3 px-4">Access Override</th>
                    <th className="py-3 px-4">Extend Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {allUsers.filter((u) => u.role === "student").map((user) => (
                    <tr key={user.id} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#0F172A]">{user.name}</div>
                        <div className="text-[11px] text-[#64748B]">{user.email}</div>
                      </td>
                      <td className="py-3 px-4 text-[#64748B]">{user.batch} &bull; {user.branch}</td>
                      <td className="py-3 px-4 font-mono font-medium text-[#1E3A8A]">
                        {user.graduationDate}
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-600">
                        {user.accessOverrideUntil || "Standard 18m"}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            const newDate = "2029-12-31";
                            extendStudentAccess(user.id, newDate);
                            alert(`Extended placement access override for ${user.name} until Dec 31, 2029!`);
                          }}
                          className="px-3 py-1 rounded-xl text-[11px] font-bold bg-[#10B981]/15 text-[#059669] hover:bg-[#10B981]/25 transition-colors"
                        >
                          + Extend to 2029
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Post New Drive */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[#E2E8F0]">
            <h3 className="text-base font-bold text-[#0F172A] mb-4">Post Verified Placement Opening</h3>
            <form onSubmit={handleAddJobSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Company Name:</label>
                <input
                  type="text"
                  required
                  value={newJob.company}
                  onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  placeholder="E.g. Oracle, Infosys, Amazon"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Job Title:</label>
                <input
                  type="text"
                  required
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  placeholder="E.g. Associate Cloud Engineer"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Min CGPA:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newJob.minCgpa}
                    onChange={(e) => setNewJob({ ...newJob, minCgpa: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Max Backlogs:</label>
                  <input
                    type="number"
                    value={newJob.maxBacklogs}
                    onChange={(e) => setNewJob({ ...newJob, maxBacklogs: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Required Skills (comma separated):</label>
                <input
                  type="text"
                  value={newJob.requiredSkills}
                  onChange={(e) => setNewJob({ ...newJob, requiredSkills: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Package / Stipend:</label>
                  <input
                    type="text"
                    value={newJob.packageStipend}
                    onChange={(e) => setNewJob({ ...newJob, packageStipend: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Drive Type:</label>
                  <select
                    value={newJob.oppType}
                    onChange={(e) => setNewJob({ ...newJob, oppType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                  >
                    <option value="full-time">Full-Time</option>
                    <option value="internship">Internship</option>
                    <option value="ppo">PPO</option>
                    <option value="off-campus">Off-Campus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Deadline:</label>
                <input
                  type="date"
                  value={newJob.deadline}
                  onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="campusOnly"
                  checked={newJob.campusOnly}
                  onChange={(e) => setNewJob({ ...newJob, campusOnly: e.target.checked })}
                  className="rounded text-[#2563EB]"
                />
                <label htmlFor="campusOnly" className="font-semibold text-slate-700">
                  Campus-only drive (Exclude passout alumni)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2563EB] text-white font-bold"
                >
                  Publish Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
