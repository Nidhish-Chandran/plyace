"use client";

import React, { useState } from "react";
import { usePlyace } from "@/lib/store";
import { SkillTest } from "@/lib/types";
import { ExamGuard } from "./ExamGuard";
import {
  ShieldCheck,
  Clock,
  Award,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
} from "lucide-react";

export function TestsView() {
  const { tests, testAttempts, currentUser } = usePlyace();
  const [activeTest, setActiveTest] = useState<SkillTest | null>(null);

  // If student is currently taking an exam, render ExamGuard
  if (activeTest) {
    return <ExamGuard test={activeTest} onExit={() => setActiveTest(null)} />;
  }

  const myAttempts = testAttempts.filter((a) => a.studentId === currentUser.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#2563EB]" />
            ExamGuard Proctored Skill Assessments
          </h2>
          <p className="text-xs text-[#64748B]">
            Tamper-resistant screening tests &bull; Fullscreen enforcement &bull; 3-strike violation auto-submit
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] shadow-card text-xs font-semibold text-[#0F172A]">
          <span>Verified Attempts:</span>
          <span className="font-bold text-[#2563EB]">{myAttempts.length}</span>
        </div>
      </div>

      {/* Tests Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map((test) => {
          const pastAttempt = myAttempts.find((a) => a.testId === test.id);
          return (
            <div
              key={test.id}
              className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      test.category === "Aptitude"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {test.category} Assessment
                  </span>

                  <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-semibold">
                    <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>{test.durationMin} mins</span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-[#0F172A] mb-2">{test.title}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                  {test.description}
                </p>

                <div className="flex items-center gap-3 text-xs font-medium text-slate-500 bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0] mb-5">
                  <div>&bull; Questions: <strong className="text-[#0F172A]">{test.questions.length}</strong></div>
                  <div>&bull; Max Score: <strong className="text-[#10B981]">{test.totalMarks} pts</strong></div>
                  <div>&bull; Security: <strong className="text-[#2563EB]">ExamGuard Active</strong></div>
                </div>
              </div>

              {pastAttempt ? (
                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-[#64748B]">Score: </span>
                    <strong className="text-base text-[#2563EB] font-black">{pastAttempt.score}/{pastAttempt.totalPossible}</strong>
                    {pastAttempt.autoSubmitted && (
                      <span className="ml-2 text-[10px] text-red-500 font-bold">(Auto-submitted)</span>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveTest(test)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-[#0F172A] transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Assessment</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-[#E2E8F0]">
                  <button
                    onClick={() => setActiveTest(test)}
                    className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start ExamGuard Proctored Test</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
