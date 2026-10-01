"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePlyace } from "@/lib/store";
import { formatDate } from "@/lib/status";
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileCheck,
  Users,
  Building2,
  ArrowRight,
  Sparkles,
  Calendar,
  Award,
} from "lucide-react";

export function LandingPageView() {
  const { jobs, announcements } = usePlyace();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      {/* 1. Official College Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/plyace-logo.png"
                alt="Plyace"
                width={145}
                height={40}
                priority
                className="object-contain"
              />
            </Link>
            <span className="hidden sm:inline-block h-5 w-px bg-[#E2E8F0]" />
            <span className="hidden md:inline-block text-xs font-semibold text-[#1E3A8A] bg-[#1E3A8A]/5 px-3 py-1 rounded-full border border-[#1E3A8A]/15">
              Career Guidance & Placement Unit (CGPU)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/jobs"
              className="hidden sm:inline-flex text-xs font-semibold text-[#64748B] hover:text-[#2563EB] transition-colors"
            >
              Placement Drives
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-bold text-[#1E3A8A] hover:bg-slate-100 rounded-xl transition-colors border border-[#E2E8F0]"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-xs font-bold bg-[#2563EB] hover:bg-[#1E3A8A] text-white rounded-xl shadow-xs transition-all"
            >
              Student Registration
            </Link>
          </div>
        </div>
      </header>

      {/* 2. College Hero Section */}
      <section className="pt-16 pb-16 sm:pt-20 sm:pb-20 bg-gradient-to-b from-white to-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-xs font-bold mb-6">
            <GraduationCap className="w-4 h-4 text-[#2563EB]" />
            <span>Official College Placement & Training Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-tight mb-4">
            Institutional Placement & <span className="text-[#2563EB]">Career Guidance Unit</span>
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto mb-8 leading-relaxed">
            The single source of truth for campus recruitment drives, real-time academic eligibility checking, and proctored technical evaluations with <strong>18 months extended alumni career support</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-bold text-xs shadow-md shadow-[#2563EB]/25 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <span>Access Student Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#0F172A] font-bold text-xs border border-[#E2E8F0] shadow-card transition-all"
            >
              Student Academic Registration
            </Link>
          </div>

          {/* Quick Statistics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="text-2xl font-black text-[#2563EB]">94.2%</div>
              <div className="text-[11px] font-semibold text-[#64748B] mt-0.5">Placement Conversion</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="text-2xl font-black text-[#10B981]">₹32.5 LPA</div>
              <div className="text-[11px] font-semibold text-[#64748B] mt-0.5">Highest Package</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="text-2xl font-black text-[#1E3A8A]">120+</div>
              <div className="text-[11px] font-semibold text-[#64748B] mt-0.5">Recruiting Partners</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="text-2xl font-black text-[#F59E0B]">18 Mo.</div>
              <div className="text-[11px] font-semibold text-[#64748B] mt-0.5">Alumni Career Window</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Active Placement Drives Section */}
      <section className="py-14 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
            <div>
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
                Current Campus Recruitment Drives
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Official drives scheduled through the College Placement Office
              </p>
            </div>
            <Link
              href="/jobs"
              className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
            >
              <span>View All Active Drives ({jobs.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.slice(0, 4).map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-sm text-[#0F172A]">{job.company}</h3>
                      <div className="text-xs font-semibold text-[#2563EB]">{job.title}</div>
                    </div>
                    <span className="text-xs font-black text-[#0F172A] bg-white px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                      {job.packageStipend}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mb-3">
                    {job.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
                  <span>Min. CGPA: <strong className="text-[#0F172A]">{job.minCgpa}</strong></span>
                  <span>Deadline: <strong className="text-[#0F172A]" suppressHydrationWarning>{formatDate(job.deadline)}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Core Pillars of the Institutional Portal */}
      <section className="py-16 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
              Institutional Placement Architecture
            </h2>
            <p className="text-xs text-[#64748B] mt-1">Replacing informal notices with an auditable institutional system</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] space-y-2.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">Real-Time Eligibility Checking</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Criteria matching against CGPA, backlogs, branch, and passout status eliminates disqualified submissions and saves recruiting hours.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] space-y-2.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 text-[#059669] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">18-Month Alumni Window</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Graduates retain access for 18 months post-graduation for off-campus opportunities, alumni referrals, and mock technical sessions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] space-y-2.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A8A]/10 text-[#1E3A8A] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">ExamGuard Secure Assessments</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Fullscreen lockdown proctoring with tab-switch logging and 3-strike auto-submit guarantees integrity for online recruitment screenings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Authoritative Institutional Footer */}
      <footer className="bg-white py-10 mt-auto border-t border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs text-[#64748B]">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Image
                  src="/plyace-logo.png"
                  alt="Plyace"
                  width={130}
                  height={36}
                  className="object-contain"
                />
              </div>
              <p className="text-[11px] leading-relaxed">
                Office of Career Guidance & Placement Unit (CGPU). Connecting students and recruiters with academic integrity.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px] mb-3">
                Placement Portals
              </h4>
              <ul className="space-y-2">
                <li><Link href="/login" className="hover:text-[#2563EB]">Student Portal Login</Link></li>
                <li><Link href="/register" className="hover:text-[#2563EB]">Student Registration</Link></li>
                <li><Link href="/jobs" className="hover:text-[#2563EB]">Campus Recruitment Drives</Link></li>
                <li><Link href="/login" className="hover:text-[#2563EB]">Placement Officer Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px] mb-3">
                Training & Assessment
              </h4>
              <ul className="space-y-2">
                <li><Link href="/tests" className="hover:text-[#2563EB]">ExamGuard Proctoring</Link></li>
                <li><Link href="/resume" className="hover:text-[#2563EB]">ATS Resume Scorer</Link></li>
                <li><Link href="/mentorship" className="hover:text-[#2563EB]">Alumni Mock Interviews</Link></li>
                <li><Link href="/leaderboard" className="hover:text-[#2563EB]">Department Rank Board</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px] mb-3">
                CGPU Administration
              </h4>
              <p className="text-[11px] leading-relaxed">
                Main Academic Block, Level 2<br />
                Placement Helpline: +91 (0) 484 257 7290<br />
                Official Email: placement@college.edu
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#64748B]">
            <span suppressHydrationWarning>&copy; {new Date().getFullYear()} Career Guidance & Placement Unit (CGPU). All rights reserved.</span>
            <div className="flex gap-4">
              <span className="hover:text-[#2563EB] cursor-pointer">Placement Policy</span>
              <span className="hover:text-[#2563EB] cursor-pointer">Student Code of Conduct</span>
              <span className="hover:text-[#2563EB] cursor-pointer">Grievance Redressal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
