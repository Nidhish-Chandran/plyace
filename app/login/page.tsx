"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePlyace } from "@/lib/store";
import {
  GraduationCap,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Building2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchUserById } = usePlyace();

  const [roleTab, setRoleTab] = useState<"student" | "admin">("student");
  const [email, setEmail] = useState("aditi.rao@college.edu");
  const [password, setPassword] = useState("student123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (role: "student" | "admin") => {
    setRoleTab(role);
    setError(null);
    if (role === "student") {
      setEmail("aditi.rao@college.edu");
      setPassword("student123");
    } else {
      setEmail("placement.head@college.edu");
      setPassword("admin123");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        if (roleTab === "admin" || email.includes("placement.head")) {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(res.error || "Authentication failed. Please verify credentials.");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans">
      {/* Official Top Bar */}
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

          <Link
            href="/"
            className="text-xs font-medium text-[#64748B] hover:text-[#2563EB] transition-colors"
          >
            &larr; Back to Portal Home
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#E2E8F0] shadow-card p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] mb-2">
              {roleTab === "student" ? (
                <GraduationCap className="w-6 h-6" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-[#1E3A8A]" />
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              Institutional Sign In
            </h1>
            <p className="text-xs text-[#64748B]">
              Access campus recruitment drives, test results & placement records
            </p>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => handleRoleChange("student")}
              className={`py-2 rounded-xl transition-all ${
                roleTab === "student"
                  ? "bg-white text-[#2563EB] shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Student Portal
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("admin")}
              className={`py-2 rounded-xl transition-all ${
                roleTab === "admin"
                  ? "bg-white text-[#1E3A8A] shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Placement Officer
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-[#EF4444] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#0F172A] mb-1.5">
                {roleTab === "student" ? "Institutional Email or Roll Number" : "Faculty / Officer Email"}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] focus:outline-hidden bg-[#F8FAFC] text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-[#0F172A]">Password</label>
                <span className="text-[11px] text-[#64748B] hover:text-[#2563EB] cursor-pointer">
                  Forgot credentials?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] focus:outline-hidden bg-[#F8FAFC] text-xs font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-bold text-xs shadow-md shadow-[#2563EB]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to {roleTab === "student" ? "Student Portal" : "CGPU Portal"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Institutional Credentials */}
          <div className="pt-2 border-t border-[#E2E8F0] text-[11px] text-[#64748B] space-y-2">
            <span className="font-semibold block text-[#0F172A]">Default Institutional Credentials:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  handleRoleChange("student");
                  setEmail("aditi.rao@college.edu");
                  setPassword("student123");
                }}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#2563EB] text-left transition-all"
              >
                <div className="font-bold text-[#2563EB]">Student Demo</div>
                <div className="text-[10px] truncate">aditi.rao@college.edu</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleRoleChange("admin");
                  setEmail("placement.head@college.edu");
                  setPassword("admin123");
                }}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#1E3A8A] text-left transition-all"
              >
                <div className="font-bold text-[#1E3A8A]">Officer Demo</div>
                <div className="text-[10px] truncate">placement.head@college.edu</div>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-[#64748B]">
              New student not yet registered?{" "}
              <Link href="/register" className="font-bold text-[#2563EB] hover:underline">
                Register Academic Profile
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-4 text-center text-xs text-[#64748B]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Career Guidance & Placement Unit (CGPU). All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-[#2563EB]">Placement Policy</Link>
            <Link href="/" className="hover:text-[#2563EB]">Student Code of Conduct</Link>
            <Link href="/" className="hover:text-[#2563EB]">Helpdesk</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
