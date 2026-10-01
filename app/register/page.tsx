"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePlyace } from "@/lib/store";
import { getStatus, getDaysRemaining } from "@/lib/status";
import {
  GraduationCap,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Award,
  Lock,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function RegisterPage() {
  const router = useRouter();
  const { register, simulatedDate } = usePlyace();

  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [branch, setBranch] = useState("Computer Science & Engineering");
  const [batch, setBatch] = useState("2023-2027");
  const [graduationDate, setGraduationDate] = useState("2027-06-30");
  const [cgpa, setCgpa] = useState("8.2");
  const [backlogs, setBacklogs] = useState("0");
  const [skills, setSkills] = useState("React, Python, SQL, Data Structures");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Compute live placement eligibility lifecycle
  const simDateObj = new Date(simulatedDate);
  const computedStatus = getStatus(graduationDate, simDateObj);
  const daysLeft = getDaysRemaining(graduationDate, simDateObj);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (!rollNumber.trim()) {
      setError("University Roll Number / Registration Number is required.");
      return;
    }

    const cgpaNum = parseFloat(cgpa);
    if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
      setError("Please enter a valid CGPA between 0.0 and 10.0.");
      return;
    }

    setLoading(true);

    try {
      const res = await register({
        name: name.trim(),
        rollNumber: rollNumber.trim().toUpperCase(),
        email: email.trim().toLowerCase(),
        password,
        branch,
        batch,
        graduationDate,
        cgpa: cgpaNum,
        backlogs: parseInt(backlogs) || 0,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      });

      if (res.success) {
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
        router.push("/dashboard");
      } else {
        setError(res.error || "Registration failed. Please check form values.");
      }
    } catch (err) {
      setError("An unexpected error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans">
      {/* Institutional Header */}
      <header className="bg-white border-b border-[#E2E8F0] py-3.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/plyace-logo.png"
              alt="Plyace"
              width={140}
              height={38}
              priority
              className="object-contain"
            />
            <span className="hidden sm:inline-block h-4 w-px bg-slate-200" />
            <span className="hidden sm:inline-block text-xs font-semibold text-[#1E3A8A]">
              Career Guidance & Placement Unit (CGPU)
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#64748B] hidden sm:inline">Already registered?</span>
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-xl border border-[#2563EB]/30 text-[#2563EB] hover:bg-[#2563EB]/10 font-bold text-xs transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Registration Form Container */}
      <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-card p-6 sm:p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2 border-b border-[#E2E8F0] pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 text-[#059669] text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Academic Year 2024–2025</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Student Placement Registration
            </h1>
            <p className="text-xs text-[#64748B] max-w-lg mx-auto">
              Enroll your academic and technical profile into the official college placement registry for real-time eligibility matching.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-[#EF4444] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Section 1: Basic Identity */}
            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#1E3A8A] flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#2563EB]" />
                <span>1. Personal & University Identification</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Siddharth Verma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] bg-[#F8FAFC] font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">
                    University Roll Number / Reg. No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. 23CS014 or KTU-2023-CS-041"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] bg-[#F8FAFC] font-medium uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">
                  Institutional College Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student.id@college.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] bg-[#F8FAFC] font-medium"
                />
                <span className="text-[10px] text-[#64748B] mt-1 block">
                  Must be your verified institutional email provided by the college administration.
                </span>
              </div>
            </div>

            {/* Section 2: Academic Profile */}
            <div className="space-y-4 pt-2 border-t border-[#E2E8F0]">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#1E3A8A] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#2563EB]" />
                <span>2. Academic Department & Performance</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Branch / Department *</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white font-medium"
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
                  <label className="block font-bold text-[#0F172A] mb-1">Enrolled Batch *</label>
                  <input
                    type="text"
                    required
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    placeholder="2023-2027"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] font-medium"
                  />
                </div>
              </div>

              {/* Graduation Date & Live Lifecycle Notice */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="font-bold text-[#0F172A] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#2563EB]" />
                    <span>Degree Completion / Graduation Date *</span>
                  </label>
                  <span className="text-[11px] text-[#64748B]">
                    Determines your active 18-month career lifecycle
                  </span>
                </div>

                <input
                  type="date"
                  required
                  value={graduationDate}
                  onChange={(e) => setGraduationDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-white font-semibold text-[#0F172A]"
                />

                {/* Status Indicator Card */}
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#64748B]">Calculated Status:</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        computedStatus === "current"
                          ? "bg-[#2563EB]/10 text-[#2563EB]"
                          : computedStatus === "passout"
                          ? "bg-[#10B981]/10 text-[#059669]"
                          : "bg-[#EF4444]/10 text-[#EF4444]"
                      }`}
                    >
                      {computedStatus === "current"
                        ? "Active Enrolled Student"
                        : computedStatus === "passout"
                        ? `Passout Alumni (${daysLeft}d of 18m window remaining)`
                        : "Lifecycle Expired (>18 months)"}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">Automatic CGPU verification</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">
                    Cumulative CGPA (out of 10.0) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    placeholder="8.2"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] font-bold"
                  />
                  <span className="text-[10px] text-[#64748B] mt-1 block">
                    Subject to physical grade card verification during interview rounds.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Active Backlogs Count *</label>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    required
                    value={backlogs}
                    onChange={(e) => setBacklogs(e.target.value)}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] font-bold"
                  />
                  <span className="text-[10px] text-[#64748B] mt-1 block">
                    Zero backlogs required for Tier-1 corporate drives.
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">
                  Technical Skills & Domains (comma separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Python, React, SQL, Java, AWS, Data Structures"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] font-medium"
                />
                <span className="text-[10px] text-[#64748B] mt-1 block">
                  Used by our ATS algorithm to compute job matching percentages.
                </span>
              </div>
            </div>

            {/* Section 3: Security & Credentials */}
            <div className="space-y-4 pt-2 border-t border-[#E2E8F0]">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#1E3A8A] flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#2563EB]" />
                <span>3. Portal Password & Security</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Create Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Code of Conduct Checkbox */}
            <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-start gap-2.5 text-[11px] text-[#1E3A8A]">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2563EB] mt-0.5" />
              <span>
                By submitting this registration, I certify that all academic credentials, CGPA, and backlog details entered are accurate and verifiable by the CGPU placement cell.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-bold text-xs shadow-md shadow-[#2563EB]/25 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <span>Registering Profile in Placement Database...</span>
              ) : (
                <>
                  <span>Complete Registration & Access Student Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Official Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-4 text-center text-xs text-[#64748B]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Career Guidance & Placement Unit (CGPU). All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-[#2563EB]">Placement Policy</Link>
            <Link href="/" className="hover:text-[#2563EB]">Student Code of Conduct</Link>
            <Link href="/" className="hover:text-[#2563EB]">Contact Placement Cell</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
