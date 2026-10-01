"use client";

import React from "react";
import Image from "next/image";
import { usePlyace } from "@/lib/store";
import {
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileCheck,
  Users,
  LogIn,
  UserPlus,
  Building2,
} from "lucide-react";

interface LandingPageViewProps {
  onEnterApp: () => void;
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export function LandingPageView({ onEnterApp, onOpenRegister, onOpenLogin }: LandingPageViewProps) {
  const { switchUserById } = usePlyace();

  const handleQuickEnter = (userId: string) => {
    switchUserById(userId);
    onEnterApp();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      {/* 1. College Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/plyace-logo.png"
              alt="Plyace"
              width={140}
              height={40}
              priority
              className="object-contain"
            />
            <span className="hidden sm:inline-block h-5 w-px bg-[#E2E8F0]" />
            <span className="hidden sm:inline-block text-xs font-semibold text-[#1E3A8A] bg-[#1E3A8A]/5 px-2.5 py-1 rounded-full border border-[#1E3A8A]/15">
              Career Guidance & Placement Unit (CGPU)
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-2 text-xs font-bold text-[#1E3A8A] hover:bg-slate-100 rounded-xl transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onOpenRegister}
              className="px-4 py-2 text-xs font-bold bg-[#10B981] hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-all"
            >
              Register Season
            </button>
            <button
              onClick={onEnterApp}
              className="px-4 py-2 text-xs font-bold bg-[#2563EB] hover:bg-[#1E3A8A] text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Enter Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section - Clean, College Focused */}
      <section className="pt-16 pb-16 sm:pt-20 sm:pb-20 bg-gradient-to-b from-white to-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-xs font-bold mb-6">
            <GraduationCap className="w-4 h-4 text-[#2563EB]" />
            <span>Official College Placement & Training Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-tight mb-4">
            Direct Bridge Between Students & <span className="text-[#2563EB]">Campus Placements</span>.
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto mb-8 leading-relaxed">
            All company drives, announcements, and application statuses directly from the placement cell. 
            Real-time eligibility checking for current students, with <strong>18 months continued support</strong> for recent graduates.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-bold text-xs shadow-md shadow-[#2563EB]/25 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Enter Student Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#0F172A] font-bold text-xs border border-[#E2E8F0] shadow-card transition-all"
            >
              Student Season Registration
            </button>
          </div>

          {/* Quick Demo Selector for Judges/Reviewers */}
          <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-card max-w-xl mx-auto">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2.5">
              1-Click Instant Demo Access:
            </div>
            <div className="grid grid-cols-3 gap-2 text-left">
              <button
                onClick={() => handleQuickEnter("usr_student_1")}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-[#2563EB] hover:bg-blue-50/50 transition-all"
              >
                <div className="font-bold text-xs text-[#2563EB]">Aditi Rao</div>
                <div className="text-[10px] text-[#64748B]">Enrolled Student</div>
              </button>
              <button
                onClick={() => handleQuickEnter("usr_passout_1")}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-[#10B981] hover:bg-emerald-50/50 transition-all"
              >
                <div className="font-bold text-xs text-[#10B981]">Rahul Verma</div>
                <div className="text-[10px] text-[#64748B]">Passout Alumni</div>
              </button>
              <button
                onClick={() => handleQuickEnter("usr_admin_1")}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-[#1E3A8A] hover:bg-slate-50 transition-all"
              >
                <div className="font-bold text-xs text-[#1E3A8A]">Dr. K. S. Nair</div>
                <div className="text-[10px] text-[#64748B]">Placement Head</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 3 Core Pillars - Simple & Clear */}
      <section className="py-16 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
              Built for Our College Community
            </h2>
            <p className="text-xs text-[#64748B] mt-1">Replacing lost message relays with automated placement workflows</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">Real-Time Eligibility</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Every drive shows whether you are eligible based on your CGPA, branch, and backlogs. Ineligible jobs clearly explain why.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 text-[#059669] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">18-Month Alumni Window</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Graduates retain access for up to 18 months for off-campus opportunities, alumni referrals, and mock interviews.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A8A]/10 text-[#1E3A8A] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">ExamGuard & ATS Prep</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Proctored online aptitude and technical tests, plus instant ATS resume scoring to maximize your shortlist chances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. College CGPU Footer */}
      <footer className="bg-white py-8 mt-auto border-t border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0F172A]">Plyace</span>
            <span>&bull;</span>
            <span>Career Guidance & Placement Unit (CGPU)</span>
            <span>&bull;</span>
            <span>Team H03</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onOpenLogin} className="hover:text-[#2563EB] font-medium">Sign In</button>
            <button onClick={onOpenRegister} className="hover:text-[#2563EB] font-medium">Register</button>
            <button onClick={onEnterApp} className="text-[#2563EB] font-bold hover:underline">Enter App &rarr;</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
