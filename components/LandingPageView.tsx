"use client";

import React from "react";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Users,
  Briefcase,
  FileSearch,
  Lock,
  Clock,
  Award,
  ChevronRight,
  ExternalLink,
  Target,
  Zap,
} from "lucide-react";

interface LandingPageViewProps {
  onEnterApp: () => void;
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export function LandingPageView({ onEnterApp, onOpenRegister, onOpenLogin }: LandingPageViewProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* Landing Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/plyace-logo.png"
              alt="Plyace"
              width={150}
              height={42}
              priority
              className="object-contain"
            />
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#64748B]">
            <a href="#features" className="hover:text-[#2563EB] transition-colors">Features</a>
            <a href="#lifecycle" className="hover:text-[#2563EB] transition-colors">18-Month Passout Support</a>
            <a href="#examguard" className="hover:text-[#2563EB] transition-colors">ExamGuard Security</a>
            <a href="#comparison" className="hover:text-[#2563EB] transition-colors">Why Plyace</a>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-2 text-xs font-semibold text-[#1E3A8A] hover:bg-slate-100 rounded-xl transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onOpenRegister}
              className="px-4 py-2 text-xs font-bold bg-[#10B981] hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-all"
            >
              Register Student
            </button>
            <button
              onClick={onEnterApp}
              className="px-4 py-2 text-xs font-bold bg-[#2563EB] hover:bg-[#1E3A8A] text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Launch Demo App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden bg-gradient-to-b from-white to-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/25 text-[#2563EB] text-xs font-bold mb-6 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            <span>Modern Career-Tech SaaS &bull; Hackathon MVP</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#0F172A] tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight mb-6">
            Bridging Students & Career Opportunities with <span className="text-[#2563EB]">Zero Relay Friction</span>.
          </h1>

          <p className="text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto mb-8 leading-relaxed">
            Plyace is the gamified college placement platform that eliminates lost notifications, calculates real-time criteria eligibility, analyzes resumes with an ATS engine, and protects skill tests with tamper-proof audit trails.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-bold text-sm shadow-xl shadow-[#2563EB]/25 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Explore Interactive Live Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#0F172A] font-bold text-sm border border-[#E2E8F0] shadow-xs transition-all"
            >
              Create Student Account
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card">
              <div className="text-2xl font-black text-[#2563EB]">100%</div>
              <div className="text-xs text-[#64748B] mt-0.5">Eligibility Transparency</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card">
              <div className="text-2xl font-black text-[#10B981]">18 Months</div>
              <div className="text-xs text-[#64748B] mt-0.5">Passout Alumni Support</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card">
              <div className="text-2xl font-black text-[#1E3A8A]">&lt; 30s</div>
              <div className="text-xs text-[#64748B] mt-0.5">Instant ATS Resume Score</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card">
              <div className="text-2xl font-black text-[#F59E0B]">ExamGuard</div>
              <div className="text-xs text-[#64748B] mt-0.5">Proctored Anti-Cheat Testing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-2">
              Comprehensive Placement OS
            </h2>
            <p className="text-3xl font-black text-[#0F172A] tracking-tight">
              Designed Specifically to Solve College CGPU Bottlenecks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] hover:shadow-card-hover transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A]">Real-Time Eligibility Engine</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                No more asking Class Representatives. Every drive automatically matches your CGPA, backlogs, branch, and passout status. Ineligible drives are greyed out with explicit reasons.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] hover:shadow-card-hover transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 text-[#059669] flex items-center justify-center font-bold">
                <FileSearch className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A]">ATS Resume Scoring & Insights</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Upload your resume against any live drive. Get an instant 0–100 score gauge, missing keywords, and project tailoring suggestions in seconds. Earn +10 gamification points.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] hover:shadow-card-hover transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/10 text-[#DC2626] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A]">ExamGuard Proctored Tests</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Browser-enforced assessment mode detecting tab switches, window blur, copy/paste, and context menu actions. Auto-submits on 3 strikes with an audit log for the placement cell.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 18-Month Passout Lifecycle Highlight */}
      <section id="lifecycle" className="py-20 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#10B981]/15 text-[#059669]">
                <Clock className="w-3.5 h-3.5" />
                <span>Continued College Support</span>
              </div>
              <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">
                No Student Left Behind After Graduation
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Traditional placement cells cut access on graduation day. Plyace gives recent graduates an <strong>18-month access window</strong> to off-campus drives, alumni referrals, and mock interviews.
              </p>
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span><strong>Current Student:</strong> Full access to campus drives and mock rounds.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span><strong>Passout (&lt;18m):</strong> Access to off-campus drives and internal alumni referrals.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span><strong>Admin Override:</strong> Placement heads can grant custom deadline extensions.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-card">
              <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
                Lifecycle Flowchart
              </div>
              <div className="p-4 rounded-2xl bg-[#0F172A] text-white font-mono text-xs leading-loose space-y-2 overflow-x-auto">
                <div>Enrolled &rarr; [Graduation Date] &rarr; Passout</div>
                <div className="text-emerald-400 pl-4">&bull; 18 Months Active Window</div>
                <div className="text-amber-400 pl-4">&bull; 60-Day Expiry Warning Banner</div>
                <div>Passout &rarr; [+18 Months] &rarr; Expired</div>
                <div className="text-red-400 pl-4">&bull; Access Closed (Admin Extension Override Allowed)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparison" className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">
              Old WhatsApp & Spreadsheet Chaos vs. Plyace
            </h2>
          </div>

          <div className="bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-white border-b border-[#E2E8F0] font-bold text-[#64748B] uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-5">Scenario</th>
                  <th className="py-3 px-5 text-red-500">Current Manual Process</th>
                  <th className="py-3 px-5 text-[#2563EB]">With Plyace Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                <tr>
                  <td className="py-3 px-5 font-bold">Drive Announcements</td>
                  <td className="py-3 px-5 text-slate-600">Passed down via Class Reps; lost or missed</td>
                  <td className="py-3 px-5 font-bold text-[#10B981]">Single verified feed direct from CGPU</td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-bold">Eligibility Checking</td>
                  <td className="py-3 px-5 text-slate-600">Manual review; ineligible students apply blindly</td>
                  <td className="py-3 px-5 font-bold text-[#10B981]">Real-time rule calculation + explicit reasons</td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-bold">Resume Quality</td>
                  <td className="py-3 px-5 text-slate-600">No feedback before corporate submission</td>
                  <td className="py-3 px-5 font-bold text-[#10B981]">Instant ATS scoring + missing keywords</td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-bold">Graduated Students</td>
                  <td className="py-3 px-5 text-slate-600">Removed from groups immediately</td>
                  <td className="py-3 px-5 font-bold text-[#10B981]">18 months continued off-campus support</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-10 mt-auto border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/plyace-logo.png"
              alt="Plyace"
              width={120}
              height={34}
              className="object-contain"
            />
            <span className="text-xs text-[#64748B]">&bull; Team H03 Hackathon MVP</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-[#64748B]">
            <button onClick={onOpenLogin} className="hover:text-[#2563EB]">Sign In</button>
            <button onClick={onOpenRegister} className="hover:text-[#2563EB]">Register</button>
            <button onClick={onEnterApp} className="text-[#2563EB] hover:underline">Launch App</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
