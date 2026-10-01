"use client";

import React from "react";
import { usePlyace } from "@/lib/store";
import { Trophy, Medal, Sparkles, Award, Star } from "lucide-react";

export function LeaderboardView() {
  const { allUsers, currentUser } = usePlyace();

  // Filter students and sort by points descending
  const rankedStudents = allUsers
    .filter((u) => u.role === "student")
    .sort((a, b) => b.points - a.points);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-black text-sm border border-amber-300">
            🥇
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-black text-sm border border-slate-300">
            🥈
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-full bg-amber-700/10 text-amber-800 flex items-center justify-center font-black text-sm border border-amber-700/20">
            🥉
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center font-bold text-xs">
            #{rank}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#F59E0B]" />
            Placement Readiness Leaderboard
          </h2>
          <p className="text-xs text-[#64748B]">
            Earn points by uploading resumes (+10), applying for verified drives (+5), and taking skill assessments.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-card">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-[#64748B]">Your Score</div>
            <div className="text-sm font-black text-[#2563EB]">{currentUser.points} pts</div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Points Explainer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 text-[#059669] flex items-center justify-center font-bold text-sm">
            +10
          </div>
          <div>
            <div className="text-xs font-bold text-[#0F172A]">ATS Resume Upload</div>
            <div className="text-[11px] text-[#64748B]">Targeted keyword review</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold text-sm">
            +5
          </div>
          <div>
            <div className="text-xs font-bold text-[#0F172A]">Eligible Job Application</div>
            <div className="text-[11px] text-[#64748B]">Verified candidate submission</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 text-[#D97706] flex items-center justify-center font-bold text-sm">
            +Score
          </div>
          <div>
            <div className="text-xs font-bold text-[#0F172A]">Skill Exam Marks</div>
            <div className="text-[11px] text-[#64748B]">ExamGuard proctored tests</div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-card overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <span className="font-bold text-sm text-[#0F172A]">Top Students & Alumni</span>
          <span className="text-xs text-[#64748B]">{rankedStudents.length} Active Candidates</span>
        </div>

        <div className="divide-y divide-[#E2E8F0]">
          {rankedStudents.map((student, index) => {
            const isMe = student.id === currentUser.id;
            return (
              <div
                key={student.id}
                className={`p-4 sm:px-6 flex items-center justify-between transition-colors ${
                  isMe
                    ? "bg-[#2563EB]/5 border-l-4 border-l-[#2563EB]"
                    : "hover:bg-[#F8FAFC]"
                }`}
              >
                <div className="flex items-center gap-4">
                  {getRankBadge(index + 1)}

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#0F172A]">{student.name}</span>
                        {isMe && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2563EB] text-white">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        {student.branch} &bull; CGPA: {student.cgpa.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-black text-[#1E3A8A]">{student.points} pts</div>
                    <div className="text-[10px] text-slate-400 capitalize">{student.id.includes("passout") ? "Alumni" : "Student"}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
