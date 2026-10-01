"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
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
  Play,
  RotateCcw,
  Building2,
  GraduationCap,
  Sliders,
  HelpCircle,
} from "lucide-react";

interface LandingPageViewProps {
  onEnterApp: () => void;
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export function LandingPageView({ onEnterApp, onOpenRegister, onOpenLogin }: LandingPageViewProps) {
  // Interactive Hero Preview Widget state
  const [demoCgpa, setDemoCgpa] = useState<number>(8.2);
  const [demoBacklogs, setDemoBacklogs] = useState<number>(0);
  const [demoBranch, setDemoBranch] = useState<string>("Computer Science & Engineering");
  const [demoIsPassout, setDemoIsPassout] = useState<boolean>(false);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Compute eligibility for 3 preview companies live in the hero
  const isGoogleEligible = !demoIsPassout && demoCgpa >= 8.5 && demoBacklogs === 0 && (demoBranch.includes("Computer") || demoBranch.includes("Electronics"));
  const isGoldmanEligible = demoCgpa >= 8.0 && demoBacklogs === 0;
  const isZohoEligible = demoCgpa >= 6.5 && demoBacklogs <= 2;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB]/20 selection:text-[#1E3A8A]">
      {/* 1. Header / Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/plyace-logo.png"
              alt="Plyace"
              width={160}
              height={44}
              priority
              className="object-contain"
            />
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-[#64748B]">
            <a href="#demo-widget" className="hover:text-[#2563EB] transition-colors">Live Eligibility Test</a>
            <a href="#features" className="hover:text-[#2563EB] transition-colors">Platform Features</a>
            <a href="#lifecycle" className="hover:text-[#2563EB] transition-colors">18-Month Passout Model</a>
            <a href="#examguard" className="hover:text-[#2563EB] transition-colors">ExamGuard Security</a>
            <a href="#faq" className="hover:text-[#2563EB] transition-colors">FAQ</a>
          </nav>

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
              Register Student
            </button>
            <button
              onClick={onEnterApp}
              className="px-4 py-2 text-xs font-bold bg-[#2563EB] hover:bg-[#1E3A8A] text-white rounded-xl shadow-md shadow-[#2563EB]/25 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/25 text-[#2563EB] text-xs font-bold mb-6 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            <span>Modern Career-Tech SaaS &bull; College CGPU Placement OS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0F172A] tracking-tight max-w-5xl mx-auto leading-tight sm:leading-tight mb-6">
            The Single Source of Truth for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#10B981]">College Placements</span>.
          </h1>

          <p className="text-base sm:text-xl text-[#64748B] max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Eliminate missed deadlines, WhatsApp relay chaos, and opaque recruitment cutoffs. 
            Plyace gives every student real-time eligibility evaluation, ATS resume shortlisting tools, anti-cheat assessments, and <strong>18 months of continued support</strong> post-graduation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-black text-sm shadow-xl shadow-[#2563EB]/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Explore Interactive Live App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-[#0F172A] font-bold text-sm border border-[#E2E8F0] shadow-card transition-all"
            >
              Register Season Account (+25 Pts)
            </button>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card">
              <div className="text-3xl font-black text-[#2563EB]">100%</div>
              <div className="text-xs font-bold text-[#0F172A] mt-1">Rule Transparency</div>
              <div className="text-[11px] text-[#64748B] mt-0.5">Real-time reasons for every job cutoff</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card">
              <div className="text-3xl font-black text-[#10B981]">18 Months</div>
              <div className="text-xs font-bold text-[#0F172A] mt-1">Passout Alumni Bridge</div>
              <div className="text-[11px] text-[#64748B] mt-0.5">Continued access after graduation</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card">
              <div className="text-3xl font-black text-[#1E3A8A]">&lt; 30s</div>
              <div className="text-xs font-bold text-[#0F172A] mt-1">ATS Resume Scoring</div>
              <div className="text-[11px] text-[#64748B] mt-0.5">Instant missing keywords analysis</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card">
              <div className="text-3xl font-black text-[#F59E0B]">ExamGuard</div>
              <div className="text-xs font-bold text-[#0F172A] mt-1">Proctored Tests</div>
              <div className="text-[11px] text-[#64748B] mt-0.5">3-strike auto-submit deterrence</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Hero Widget: Real-Time Eligibility Simulator */}
      <section id="demo-widget" className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-2 block">
              Try It Right Here
            </span>
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">
              Interactive Placement Eligibility Simulator
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2">
              Adjust the sliders below to see how Plyace dynamically evaluates company cutoffs in real time.
            </p>
          </div>

          <div className="bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Interactive Controls */}
            <div className="lg:col-span-5 space-y-5 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] border-b pb-2">
                Simulated Candidate Profile
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Current CGPA:</span>
                  <span className="text-[#2563EB] font-black text-sm">{demoCgpa.toFixed(1)} / 10.0</span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="10.0"
                  step="0.1"
                  value={demoCgpa}
                  onChange={(e) => setDemoCgpa(parseFloat(e.target.value))}
                  className="w-full accent-[#2563EB] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Active Backlogs:</span>
                  <span className={demoBacklogs > 0 ? "text-[#EF4444] font-black" : "text-[#10B981] font-black"}>
                    {demoBacklogs}
                  </span>
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2].map((num) => (
                    <button
                      key={num}
                      onClick={() => setDemoBacklogs(num)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        demoBacklogs === num
                          ? "bg-[#2563EB] text-white border-[#2563EB]"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {num} {num === 0 ? "Backlogs" : "Backlog"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Department / Branch:</label>
                <select
                  value={demoBranch}
                  onChange={(e) => setDemoBranch(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] font-medium"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-[#0F172A]">Simulate Passout Alumni Status:</span>
                <input
                  type="checkbox"
                  checked={demoIsPassout}
                  onChange={(e) => setDemoIsPassout(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2563EB]"
                />
              </div>
            </div>

            {/* Right: Real-time Opportunity Cards Reaction */}
            <div className="lg:col-span-7 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2 flex items-center justify-between">
                <span>Live Feed Verdicts</span>
                <span className="text-[11px] text-emerald-600 font-bold">Auto-Calculated</span>
              </div>

              {/* Company 1: Google */}
              <div className={`p-4 rounded-2xl border transition-all ${isGoogleEligible ? "bg-white border-emerald-300 shadow-sm" : "bg-slate-100/70 border-slate-300 opacity-75"}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-sm text-[#0F172A]">Google &bull; Associate Software Engineer (32.5 LPA)</div>
                  {isGoogleEligible ? (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#059669]">Eligible &check;</span>
                  ) : (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EF4444]/15 text-[#DC2626]">Ineligible &times;</span>
                  )}
                </div>
                <div className="text-xs text-[#64748B]">
                  {isGoogleEligible
                    ? "Your CGPA meets the 8.5 cutoff and branch criteria."
                    : demoIsPassout
                    ? "Ineligible: Exclusive on-campus drive strictly for current students."
                    : demoCgpa < 8.5
                    ? `Ineligible: Requires 8.5 CGPA (You simulated ${demoCgpa.toFixed(1)}).`
                    : "Ineligible: Open to CSE / ECE branches only."}
                </div>
              </div>

              {/* Company 2: Goldman Sachs */}
              <div className={`p-4 rounded-2xl border transition-all ${isGoldmanEligible ? "bg-white border-emerald-300 shadow-sm" : "bg-slate-100/70 border-slate-300 opacity-75"}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-sm text-[#0F172A]">Goldman Sachs &bull; Engineering Analyst (24.0 LPA)</div>
                  {isGoldmanEligible ? (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#059669]">Eligible &check;</span>
                  ) : (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EF4444]/15 text-[#DC2626]">Ineligible &times;</span>
                  )}
                </div>
                <div className="text-xs text-[#64748B]">
                  {isGoldmanEligible
                    ? "Meets 8.0 CGPA & zero backlogs. Open to current students and passouts."
                    : `Ineligible: Requires minimum 8.0 CGPA & 0 backlogs.`}
                </div>
              </div>

              {/* Company 3: Zoho */}
              <div className={`p-4 rounded-2xl border transition-all ${isZohoEligible ? "bg-white border-emerald-300 shadow-sm" : "bg-slate-100/70 border-slate-300 opacity-75"}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-sm text-[#0F172A]">Zoho Corporation &bull; Member Technical Staff (8.5 LPA)</div>
                  {isZohoEligible ? (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#059669]">Eligible &check;</span>
                  ) : (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EF4444]/15 text-[#DC2626]">Ineligible &times;</span>
                  )}
                </div>
                <div className="text-xs text-[#64748B]">
                  {isZohoEligible
                    ? "Broad eligibility: Open to all branches, up to 2 backlogs, active off-campus alumni drive."
                    : "Ineligible: Requires minimum 6.5 CGPA."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Complete Platform Features Grid */}
      <section id="features" className="py-20 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-2 block">
              Architected for Modern Campus Placements
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Every Tool Students & Placement Officers Need
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-card hover:shadow-card-hover transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#0F172A]">Single Source Opportunities Feed</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Direct corporate drive postings from CGPU. Real-time eligibility calculations, skill gap progress bars, and zero communication relays.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-card hover:shadow-card-hover transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 text-[#059669] flex items-center justify-center font-bold">
                <FileSearch className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#0F172A]">ATS Resume Analyzer & Suggestions</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Score your resume against target company job descriptions. Highlights matched skills, missing critical keywords, and awards +10 placement points.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-card hover:shadow-card-hover transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/10 text-[#DC2626] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#0F172A]">ExamGuard Proctored Testing</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Assessment window with fullscreen lock, tab-switch monitoring, copy/paste prevention, and a 3-strike violation auto-submit audit log.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-card hover:shadow-card-hover transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/10 text-[#D97706] flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#0F172A]">Alumni Referrals & Mock Sessions</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Connect with alumni at Amazon, Uber, and Microsoft. Book 1:1 technical interview practice and Group Discussion slots with live capacity limits.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-card hover:shadow-card-hover transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#0F172A]">Gamification & Leaderboard</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Motivates students to prepare early. Earn points for uploaded resumes, verified applications, and assessment scores.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-card hover:shadow-card-hover transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#0F172A]">CGPU Admin & 1-Click CSV</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Comprehensive officer dashboard to post drives, broadcast emergency notices, review candidates, and export verified CSV lists for corporate HR teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 18-Month Passout Model Section */}
      <section id="lifecycle" className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#10B981]/15 text-[#059669]">
                <Clock className="w-3.5 h-3.5" />
                <span>The 18-Month Career Bridge</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight leading-tight">
                Continued College Placement Support After Graduation
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Graduation shouldn&apos;t mean losing your college network. In accordance with the PRD specification, Plyace keeps alumni accounts active for <strong>18 months post-graduation</strong>.
              </p>
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F172A]">Off-Campus Drive Access:</strong> Passout alumni can view and apply to verified off-campus hiring opportunities.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F172A]">60-Day Expiry Warning Banner:</strong> Persistent notice alerting students before their 18-month cutoff concludes.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F172A]">Admin Extension Override:</strong> CGPU administrators can grant individual extensions for special recruitment cycles.
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#0F172A] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
                <span>Account Lifecycle Architecture</span>
                <span className="text-[#10B981] font-mono">getStatus() Engine</span>
              </div>
              <div className="font-mono text-xs leading-loose space-y-3">
                <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                  <span className="text-blue-400 font-bold">1. Enrolled Student</span> &rarr; Grad Date in future &bull; Full on-campus drive access
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                  <span className="text-emerald-400 font-bold">2. Passout Alumni</span> &rarr; Grad Date past &lt; 18 months &bull; Off-campus & referrals
                </div>
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30">
                  <span className="text-red-400 font-bold">3. Access Expired</span> &rarr; Grad Date past &gt; 18 months &bull; Blocked screen (admin extensible)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section id="faq" className="py-20 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[#64748B] mt-1.5">Everything you need to know about the Plyace MVP</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "How does Plyace determine student eligibility for drives?",
                a: "The eligibility engine evaluates student CGPA, backlogs count, department branch, and graduation date against company cutoff requirements in real time. Ineligible drives are greyed out with an exact explanation (e.g. 'Needs 8.5 CGPA, you have 8.4').",
              },
              {
                q: "What is ExamGuard and how does it prevent cheating during assessments?",
                a: "ExamGuard puts the browser into mandatory full-screen mode and tracks window blur, tab switches, copy/paste, and right-click events. If a candidate records 3 violation strikes, the exam is automatically submitted with an audit log saved to the placement cell.",
              },
              {
                q: "Can graduated students still apply to campus drives?",
                a: "Passout alumni retain platform access for 18 months following their graduation date. While exclusive on-campus drives are restricted to currently enrolled students, passouts have full access to off-campus drives, alumni referrals, and mock sessions.",
              },
              {
                q: "How can placement officers export shortlisted candidates?",
                a: "Inside the CGPU Admin Portal under 'Candidate Pipeline', administrators can filter applicants by company and status, and click 'Export CSV for Corporate HR' to generate a verified spreadsheet in seconds.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between text-xs sm:text-sm font-bold text-[#0F172A]"
                >
                  <span>{faq.q}</span>
                  <span className="text-[#2563EB] text-lg font-bold">{openFaq === idx ? "−" : "+"}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-[#64748B] leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA */}
      <section className="py-20 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Ready for Hackathon Demo Day</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Experience the Future of College Placements Today
          </h2>

          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
            Test the live platform as a student, recent passout alumni, or placement officer with one click.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-[#1E3A8A] font-black text-sm shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              <span>Launch Demo Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/25 transition-all"
            >
              Student Registration Form
            </button>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-white py-8 border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/plyace-logo.png"
              alt="Plyace"
              width={130}
              height={36}
              className="object-contain"
            />
            <span className="text-xs text-[#64748B]">&bull; Team H03 &bull; Hackathon MVP 1.0</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-[#64748B]">
            <button onClick={onOpenLogin} className="hover:text-[#2563EB]">Sign In</button>
            <button onClick={onOpenRegister} className="hover:text-[#2563EB]">Register</button>
            <button onClick={onEnterApp} className="text-[#2563EB] hover:underline">Demo App</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
