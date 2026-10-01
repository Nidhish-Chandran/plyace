"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePlyace } from "@/lib/store";
import { UserProfile } from "@/lib/types";
import { getStatus, getDaysRemaining, isExpiringSoon } from "@/lib/status";
import {
  UserPlus,
  LogIn,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  Lock,
  HelpCircle,
  Calendar,
} from "lucide-react";
import confetti from "canvas-confetti";

interface AuthViewProps {
  initialMode?: "login" | "register";
  onSuccess: () => void;
  onBackToLanding: () => void;
}

export function AuthView({ initialMode = "register", onSuccess, onBackToLanding }: AuthViewProps) {
  const { allUsers, setCurrentUser, switchUserById, simulatedDate } = usePlyace();
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  // Registration form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regBranch, setRegBranch] = useState("Computer Science & Engineering");
  const [regBatch, setRegBatch] = useState("2023-2027");
  const [regGradDate, setRegGradDate] = useState("2027-06-30");
  const [regCgpa, setRegCgpa] = useState("8.2");
  const [regBacklogs, setRegBacklogs] = useState("0");
  const [regSkills, setRegSkills] = useState("Python, React, SQL, Data Structures");

  // Sign In form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Simulated today date
  const simDateObj = new Date(simulatedDate);

  // Compute live preview status based on graduation date
  const computedStatus = getStatus(regGradDate, simDateObj);
  const daysLeft = getDaysRemaining(regGradDate, simDateObj);

  // Quick preset helper
  const applyPreset = (preset: "current" | "passout" | "expired") => {
    if (preset === "current") {
      setRegGradDate("2027-06-30");
      setRegBatch("2023-2027");
    } else if (preset === "passout") {
      setRegGradDate("2025-06-30");
      setRegBatch("2021-2025");
    } else {
      setRegGradDate("2024-05-15");
      setRegBatch("2020-2024");
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      role: "student",
      branch: regBranch,
      batch: regBatch,
      graduationDate: regGradDate,
      cgpa: parseFloat(regCgpa) || 8.0,
      backlogs: parseInt(regBacklogs) || 0,
      skills: regSkills.split(",").map((s) => s.trim()).filter(Boolean),
      points: 25, // Welcome bonus points!
    };

    setCurrentUser(newUser);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    onSuccess();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = allUsers.find(
      (u) => u.email.toLowerCase() === loginEmail.toLowerCase().trim()
    );

    if (found) {
      setCurrentUser(found);
      onSuccess();
    } else {
      setLoginError("Account not found. Please select a quick demo account below or register.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo & Back button */}
        <div className="flex justify-center mb-4">
          <Image
            src="/plyace-logo.png"
            alt="Plyace"
            width={180}
            height={50}
            priority
            className="object-contain"
          />
        </div>

        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#2563EB] mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </button>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-slate-200/70 p-1 mb-6 max-w-xs mx-auto">
          <button
            onClick={() => {
              setMode("register");
              setLoginError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === "register"
                ? "bg-white text-[#2563EB] shadow-xs"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Student Register
          </button>
          <button
            onClick={() => {
              setMode("login");
              setLoginError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === "login"
                ? "bg-white text-[#2563EB] shadow-xs"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Sign In
          </button>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#E2E8F0] shadow-card">
          {mode === "register" ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="text-center pb-2">
                <h3 className="text-base font-bold text-[#0F172A]">Student Season Registration</h3>
                <p className="text-[11px] text-[#64748B]">
                  Enrolls your profile with real-time CGPU placement eligibility
                </p>
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="E.g. Siddharth Verma"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] bg-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">College Email Address</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="student.id@college.edu"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] bg-[#F8FAFC]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Branch / Department</label>
                  <select
                    value={regBranch}
                    onChange={(e) => setRegBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] bg-white"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Enrolled Batch</label>
                  <input
                    type="text"
                    value={regBatch}
                    onChange={(e) => setRegBatch(e.target.value)}
                    placeholder="2023-2027"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]"
                  />
                </div>
              </div>

              {/* Graduation Date & Presets */}
              <div className="space-y-1.5 bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#0F172A] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Graduation Date</span>
                  </label>
                  <span className="text-[10px] text-[#64748B]">
                    Controls your placement lifecycle
                  </span>
                </div>

                <input
                  type="date"
                  required
                  value={regGradDate}
                  onChange={(e) => setRegGradDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A]"
                />

                {/* Quick Presets to test lifecycle calculation instantly */}
                <div className="pt-1.5">
                  <span className="text-[10px] text-[#64748B] block mb-1 font-semibold">
                    Quick Presets (Click to test lifecycle):
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => applyPreset("current")}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                        computedStatus === "current"
                          ? "bg-[#2563EB] text-white border-[#2563EB]"
                          : "bg-white hover:bg-slate-100 text-[#0F172A] border-[#E2E8F0]"
                      }`}
                    >
                      🎓 Final Year (2027)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset("passout")}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                        computedStatus === "passout"
                          ? "bg-[#10B981] text-white border-[#10B981]"
                          : "bg-white hover:bg-slate-100 text-[#0F172A] border-[#E2E8F0]"
                      }`}
                    >
                      💼 Passout (2025)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset("expired")}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                        computedStatus === "expired"
                          ? "bg-[#EF4444] text-white border-[#EF4444]"
                          : "bg-white hover:bg-slate-100 text-[#0F172A] border-[#E2E8F0]"
                      }`}
                    >
                      🔒 Expired (2024)
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Current CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={regCgpa}
                    onChange={(e) => setRegCgpa(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Active Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={regBacklogs}
                    onChange={(e) => setRegBacklogs(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Core Technical Skills (comma-separated)</label>
                <input
                  type="text"
                  value={regSkills}
                  onChange={(e) => setRegSkills(e.target.value)}
                  placeholder="Python, React, TypeScript, SQL, Docker"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]"
                />
              </div>

              {/* Dynamic Calculated Lifecycle Status Card */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  computedStatus === "current"
                    ? "bg-[#2563EB]/5 border-[#2563EB]/25"
                    : computedStatus === "passout"
                    ? "bg-[#10B981]/5 border-[#10B981]/25"
                    : "bg-[#EF4444]/5 border-[#EF4444]/25"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    Calculated Lifecycle Status
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      computedStatus === "current"
                        ? "bg-[#2563EB]/15 text-[#2563EB]"
                        : computedStatus === "passout"
                        ? "bg-[#10B981]/15 text-[#059669]"
                        : "bg-[#EF4444]/15 text-[#DC2626]"
                    }`}
                  >
                    {computedStatus === "current" ? (
                      <>
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Enrolled Student</span>
                      </>
                    ) : computedStatus === "passout" ? (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        <span>Passout Alumni ({daysLeft}d left)</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Access Expired (&gt;18m)</span>
                      </>
                    )}
                  </span>
                </div>

                <p className="text-[11px] text-[#0F172A] leading-snug">
                  {computedStatus === "current" && (
                    <span>
                      &bull; Graduation date ({regGradDate}) is in the future. You will have full access to <strong>on-campus placement drives, internships, and PPOs</strong>.
                    </span>
                  )}
                  {computedStatus === "passout" && (
                    <span>
                      &bull; Graduated within the college 18-month window. You have access to <strong>off-campus hiring drives, alumni referrals, and mock rounds</strong> ({daysLeft} days remaining).
                    </span>
                  )}
                  {computedStatus === "expired" && (
                    <span className="text-[#DC2626]">
                      &bull; Graduated over 18 months ago. In-app placement access is concluded under standard college policy unless an admin extends your access.
                    </span>
                  )}
                </p>

                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[10px] text-[#64748B]">
                  <HelpCircle className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>
                    Status is computed automatically from graduation date relative to the system date ({simulatedDate}). Students cannot manually tamper with their status.
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-98"
              >
                <UserPlus className="w-4 h-4" />
                <span>Complete Registration & Claim +25 Bonus Points</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="text-center pb-2">
                <h3 className="text-base font-bold text-[#0F172A]">Sign in to Plyace</h3>
                <p className="text-[11px] text-[#64748B]">
                  Access your opportunities feed, test environment, and shortlists
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#DC2626] font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Email Address</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="aditi.rao@college.edu"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Dashboard</span>
              </button>
            </form>
          )}

          {/* Quick 1-Click Demo Accounts Bar (PRD Section 6.1: FR-3) */}
          <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2.5 text-center">
              Or 1-Click Demo Logins:
            </div>
            <div className="grid grid-cols-2 gap-2 text-left">
              <button
                onClick={() => {
                  switchUserById("usr_student_1");
                  onSuccess();
                }}
                className="p-2.5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 transition-all"
              >
                <div className="font-bold text-xs text-[#2563EB]">Aditi Rao</div>
                <div className="text-[10px] text-[#64748B]">Current Student &bull; Final Year</div>
              </button>

              <button
                onClick={() => {
                  switchUserById("usr_passout_1");
                  onSuccess();
                }}
                className="p-2.5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 transition-all"
              >
                <div className="font-bold text-xs text-[#10B981]">Rahul Verma</div>
                <div className="text-[10px] text-[#64748B]">Passout (&lt;18m Window)</div>
              </button>

              <button
                onClick={() => {
                  switchUserById("usr_admin_1");
                  onSuccess();
                }}
                className="p-2.5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 transition-all"
              >
                <div className="font-bold text-xs text-[#1E3A8A]">Dr. K. S. Nair</div>
                <div className="text-[10px] text-[#64748B]">Placement Head &bull; Admin</div>
              </button>

              <button
                onClick={() => {
                  switchUserById("usr_expired_1");
                  onSuccess();
                }}
                className="p-2.5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 transition-all"
              >
                <div className="font-bold text-xs text-[#EF4444]">Siddharth M.</div>
                <div className="text-[10px] text-[#64748B]">Expired Passout (&gt;18m)</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
