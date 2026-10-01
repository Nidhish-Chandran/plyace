"use client";

import React, { useState } from "react";
import { usePlyace } from "@/lib/store";
import { Calendar, FastForward, Clock, X, Check, AlertCircle } from "lucide-react";

interface AdminSimulateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSimulateModal({ isOpen, onClose }: AdminSimulateModalProps) {
  const { simulatedDate, setSimulatedDate, currentUser, currentStatus } = usePlyace();
  const [selectedDate, setSelectedDate] = useState(simulatedDate);

  if (!isOpen) return null;

  const handleApply = (date: string) => {
    setSimulatedDate(date);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">Simulate System Date</h3>
            <p className="text-xs text-[#64748B]">Fast-forward time to demo the student lifecycle</p>
          </div>
        </div>

        <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0] mb-5">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[#64748B]">Active Persona:</span>
            <span className="font-semibold text-[#0F172A]">{currentUser.name} ({currentUser.batch})</span>
          </div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[#64748B]">Graduation Date:</span>
            <span className="font-medium text-[#1E3A8A]">{currentUser.graduationDate}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#64748B]">Current Computed Status:</span>
            <span className="font-bold capitalize text-[#2563EB]">{currentStatus}</span>
          </div>
        </div>

        {/* Quick presets for demo script */}
        <div className="space-y-2 mb-5">
          <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
            Demo Script Presets
          </label>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleApply("2026-10-01")}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                simulatedDate === "2026-10-01"
                  ? "border-[#2563EB] bg-[#2563EB]/5 font-semibold text-[#2563EB]"
                  : "border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A]"
              }`}
            >
              <div>
                <div className="font-medium">1. Baseline Demo Day (Oct 1, 2026)</div>
                <div className="text-[11px] text-[#64748B]">Aditi is a final year student; Rahul is a passout</div>
              </div>
              <FastForward className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => handleApply("2027-07-15")}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                simulatedDate === "2027-07-15"
                  ? "border-[#2563EB] bg-[#2563EB]/5 font-semibold text-[#2563EB]"
                  : "border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A]"
              }`}
            >
              <div>
                <div className="font-medium">2. Post-Graduation (July 15, 2027)</div>
                <div className="text-[11px] text-[#64748B]">Aditi transitions to Passout (18m window starts)</div>
              </div>
              <FastForward className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => handleApply("2029-01-15")}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                simulatedDate === "2029-01-15"
                  ? "border-[#2563EB] bg-[#2563EB]/5 font-semibold text-[#2563EB]"
                  : "border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A]"
              }`}
            >
              <div>
                <div className="font-medium">3. 18-Month Expiry (Jan 15, 2029)</div>
                <div className="text-[11px] text-[#EF4444]">Passout access expires &rarr; Screen locked until admin extends</div>
              </div>
              <FastForward className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Custom date picker */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
            Or Choose Custom Date:
          </label>
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white text-[#0F172A]"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#64748B] hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleApply(selectedDate)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2563EB] hover:bg-[#1E3A8A] text-white transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Check className="w-4 h-4" />
            Apply Simulated Date
          </button>
        </div>
      </div>
    </div>
  );
}
