"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePlyace } from "@/lib/store";
import {
  Calendar,
  Sparkles,
  UserCheck,
  ChevronDown,
  RotateCcw,
  Clock,
  AlertTriangle,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

interface NavbarProps {
  onOpenSimulate?: () => void;
  onOpenLanding?: () => void;
  onOpenRegister?: () => void;
}

export function Navbar({ onOpenSimulate, onOpenLanding, onOpenRegister }: NavbarProps) {
  const {
    currentUser,
    switchUserById,
    allUsers,
    simulatedDate,
    currentStatus,
    isPassoutExpiringSoon,
    resetToDefaults,
  } = usePlyace();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getStatusBadge = () => {
    if (currentUser.role === "admin") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1E3A8A]/10 text-[#1E3A8A] border border-[#1E3A8A]/20">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1E3A8A]" />
          CGPU Placement Cell
        </span>
      );
    }

    if (currentStatus === "expired") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EF4444]/10 text-[#DC2626] border border-[#EF4444]/30 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
          Access Expired (&gt;18m)
        </span>
      );
    }

    if (currentStatus === "passout") {
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            isPassoutExpiringSoon.warning
              ? "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/30"
              : "bg-[#10B981]/10 text-[#059669] border-[#10B981]/30"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Passout Student ({isPassoutExpiringSoon.daysLeft}d left)
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/30">
        <GraduationCap className="w-3.5 h-3.5 text-[#2563EB]" />
        Current Student
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-36 sm:w-44 flex items-center">
            <Image
              src="/plyace-logo.png"
              alt="Plyace Logo"
              width={160}
              height={44}
              priority
              className="object-contain"
            />
          </div>
          <span className="hidden md:inline-block h-5 w-px bg-[#E2E8F0]" />
          <div className="hidden md:flex items-center">{getStatusBadge()}</div>
        </div>

        {/* Right Actions: Landing link + Register link + Simulated Date + Points + Demo Switcher */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {onOpenLanding && (
            <button
              onClick={onOpenLanding}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#64748B] hover:text-[#2563EB] hover:bg-slate-50 rounded-xl transition-colors"
            >
              Public Landing
            </button>
          )}

          {onOpenRegister && (
            <button
              onClick={onOpenRegister}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#10B981]/30 bg-[#10B981]/10 text-[#059669] hover:bg-[#10B981]/20 font-bold text-xs transition-colors"
            >
              + Register
            </button>
          )}

          {/* Simulated Date Quick Pill */}
          <button
            onClick={onOpenSimulate}
            title="Simulate System Date for Lifecycle Testing"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#F8FAFC] hover:bg-slate-100 text-[#0F172A] border border-[#E2E8F0] rounded-xl transition-all shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="hidden sm:inline text-slate-500">Simulated Date:</span>
            <span className="font-semibold text-[#1E3A8A]">
              {new Date(simulatedDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </button>

          {/* Points Chip (for students) */}
          {currentUser.role === "student" && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl text-xs font-bold text-[#059669]">
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{currentUser.points} pts</span>
            </div>
          )}

          {/* Demo User Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 transition-all text-xs font-medium text-[#0F172A]"
            >
              <div className="w-7 h-7 rounded-full bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] font-bold text-xs border border-[#2563EB]/20 overflow-hidden">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-semibold leading-tight text-[#0F172A]">{currentUser.name}</div>
                <div className="text-[10px] text-[#64748B] capitalize">{currentUser.role === "admin" ? "Placement Admin" : currentStatus}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-2 border-b border-[#E2E8F0]">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    Switch Demo Persona
                  </div>
                  <div className="text-xs text-slate-500">
                    Instantly demo student, passout, and admin roles
                  </div>
                </div>

                <div className="py-1">
                  {allUsers.map((user) => {
                    const isSelected = user.id === currentUser.id;
                    let tag = "Current Student";
                    if (user.role === "admin") tag = "CGPU Admin";
                    else if (user.id.includes("passout")) tag = "Passout (<18m)";
                    else if (user.id.includes("expired")) tag = "Expired (>18m)";

                    return (
                      <button
                        key={user.id}
                        onClick={() => {
                          switchUserById(user.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between text-xs hover:bg-[#F8FAFC] transition-colors ${
                          isSelected ? "bg-[#2563EB]/5 font-semibold text-[#2563EB]" : "text-[#0F172A]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                              isSelected ? "bg-[#2563EB] text-white" : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-[10px] text-[#64748B]">{user.branch}</div>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700 font-medium"
                              : isSelected
                              ? "bg-[#2563EB]/15 text-[#2563EB]"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {tag}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="px-3.5 pt-2 pb-1 border-t border-[#E2E8F0] flex items-center justify-between">
                  <button
                    onClick={() => {
                      resetToDefaults();
                      setDropdownOpen(false);
                    }}
                    className="flex items-center gap-1.5 text-[11px] text-[#EF4444] hover:text-red-700 font-medium transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Demo State
                  </button>
                  <span className="text-[10px] text-slate-400">Team H03</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
