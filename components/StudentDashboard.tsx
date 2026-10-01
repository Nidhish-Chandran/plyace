"use client";

import React from "react";
import { usePlyace } from "@/lib/store";
import { Job } from "@/lib/types";
import {
  Briefcase,
  FileCheck2,
  FileSearch,
  ShieldCheck,
  Trophy,
  Sparkles,
  ArrowRight,
  Clock,
  Megaphone,
  CheckCircle2,
  Calendar,
  AlertCircle,
  GraduationCap,
} from "lucide-react";

interface StudentDashboardProps {
  onNavigate: (tab: any) => void;
  onSelectJob: (job: Job) => void;
}

export function StudentDashboard({ onNavigate, onSelectJob }: StudentDashboardProps) {
  const {
    currentUser,
    jobs,
    applications,
    announcements,
    simulatedDate,
    currentStatus,
    isPassoutExpiringSoon,
  } = usePlyace();

  // Find closing soon jobs (< 7 days)
  const simDate = new Date(simulatedDate);
  const closingSoonJobs = jobs
    .filter((j) => {
      const deadline = new Date(j.deadline);
      const diff = Math.ceil((deadline.getTime() - simDate.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 && diff <= 14;
    })
    .slice(0, 3);

  const myApps = applications.filter((a) => a.studentId === currentUser.id);

  // Profile completeness calculation
  let completeness = 60;
  if (currentUser.skills.length >= 5) completeness += 20;
  if (myApps.length > 0) completeness += 10;
  if (currentUser.points > 30) completeness += 10;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mb-3 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Placement Season 2026-2027</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug mb-2">
            Welcome back, {currentUser.name}!
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed mb-6">
            You are enrolled as <strong className="text-white">{currentUser.branch}</strong> ({currentUser.batch}).
            Plyace provides guaranteed single-source updates, real-time eligibility evaluation, and verified shortlists.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate("jobs")}
              className="px-5 py-2.5 rounded-xl bg-white text-[#1E3A8A] font-bold text-xs hover:bg-blue-50 transition-all flex items-center gap-2 shadow-sm"
            >
              <span>Explore Verified Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("resume")}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-all border border-white/20 backdrop-blur-xs"
            >
              Check Resume ATS Score
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
          <GraduationCap className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Profile Completeness & Quick Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
            <span>Profile Readiness</span>
            <span className="font-bold text-[#10B981]">{completeness}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${completeness}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-[#0F172A]">{jobs.length}</div>
            <div className="text-[11px] text-[#64748B]">Active Openings</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 text-[#059669] flex items-center justify-center">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-[#0F172A]">{myApps.length}</div>
            <div className="text-[11px] text-[#64748B]">Applications Sent</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 text-[#D97706] flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-[#0F172A]">{currentUser.points}</div>
            <div className="text-[11px] text-[#64748B]">Placement Points</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Closing Soon Drives + Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Closing Soon Opportunities */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F59E0B]" />
              Closing Soon Opportunities
            </h3>
            <button
              onClick={() => onNavigate("jobs")}
              className="text-xs font-semibold text-[#2563EB] hover:text-[#1E3A8A]"
            >
              View All ({jobs.length}) &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {closingSoonJobs.map((job) => {
              const deadlineDate = new Date(job.deadline);
              const daysLeft = Math.ceil((deadlineDate.getTime() - simDate.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-card hover:shadow-card-hover transition-all cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center font-bold text-[#2563EB] text-base shrink-0">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                        {job.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-[#64748B] mt-0.5">
                        <span className="font-semibold text-[#0F172A]">{job.company}</span>
                        <span>&bull;</span>
                        <span className="text-[#1E3A8A] font-medium">{job.packageStipend}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#F59E0B]/10 text-[#D97706] border border-[#F59E0B]/20">
                      {daysLeft}d left
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB] transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: CGPU Official Announcements */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#2563EB]" />
              Official CGPU Notice Board
            </h3>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-card space-y-4">
            {announcements.slice(0, 3).map((anc) => (
              <div key={anc.id} className="pb-4 border-b border-[#E2E8F0] last:border-0 last:pb-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      anc.tag === "Urgent"
                        ? "bg-[#EF4444]/15 text-[#DC2626]"
                        : anc.tag === "Drive"
                        ? "bg-[#2563EB]/15 text-[#2563EB]"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {anc.tag}
                  </span>
                  <span className="text-[10px] text-[#64748B]">
                    {new Date(anc.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-[#0F172A] mb-1">{anc.title}</h4>
                <p className="text-[11px] text-[#64748B] leading-relaxed">{anc.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
