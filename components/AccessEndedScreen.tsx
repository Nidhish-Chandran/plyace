"use client";

import React from "react";
import Image from "next/image";
import { usePlyace } from "@/lib/store";
import { Lock, Mail, ShieldAlert, ArrowRight, RotateCcw } from "lucide-react";

export function AccessEndedScreen({ onOpenSimulate }: { onOpenSimulate?: () => void }) {
  const { currentUser, switchUserById, resetToDefaults } = usePlyace();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 shadow-card border border-[#E2E8F0] text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/plyace-logo.png"
            alt="Plyace"
            width={180}
            height={50}
            priority
            className="object-contain"
          />
        </div>

        {/* Lock Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#EF4444]/10 text-[#EF4444] mx-auto flex items-center justify-center mb-5 border border-[#EF4444]/20 shadow-xs">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight mb-2">
          Placement Access Period Concluded
        </h2>
        <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
          In accordance with college placement regulations, alumni retain platform access for up to <strong>18 months</strong> following graduation ({currentUser.graduationDate}). Your active access has concluded.
        </p>

        <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E8F0] text-left mb-6 text-xs text-[#0F172A] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Account:</span>
            <span className="font-semibold">{currentUser.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Batch & Branch:</span>
            <span>{currentUser.batch} &bull; {currentUser.branch}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Status:</span>
            <span className="text-[#EF4444] font-bold">Access Expired (&gt;18 Months)</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <a
            href="mailto:placement@college.edu?subject=Request%20for%20Plyace%20Placement%20Access%20Extension"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-medium text-xs transition-colors shadow-sm"
          >
            <Mail className="w-4 h-4" />
            Contact Placement Cell (CGPU)
          </a>

          {onOpenSimulate && (
            <button
              onClick={onOpenSimulate}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A] font-medium text-xs transition-colors"
            >
              Simulate Earlier Date
            </button>
          )}
        </div>

        <div className="pt-6 border-t border-[#E2E8F0]">
          <p className="text-xs text-[#64748B] mb-3">Hackathon Demo Switchers:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => switchUserById("usr_student_1")}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#0F172A] transition-colors"
            >
              Switch to Aditi (Student)
            </button>
            <button
              onClick={() => switchUserById("usr_admin_1")}
              className="px-3 py-1.5 rounded-lg bg-[#1E3A8A]/10 hover:bg-[#1E3A8A]/20 text-xs font-semibold text-[#1E3A8A] transition-colors"
            >
              Switch to Admin (Extend Access)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
