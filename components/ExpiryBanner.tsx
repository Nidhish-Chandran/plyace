"use client";

import React from "react";
import { usePlyace } from "@/lib/store";
import { AlertTriangle, Clock, HelpCircle } from "lucide-react";

export function ExpiryBanner() {
  const { currentStatus, isPassoutExpiringSoon } = usePlyace();

  if (currentStatus !== "passout" || !isPassoutExpiringSoon.warning) {
    return null;
  }

  return (
    <div className="bg-[#F59E0B]/10 border-b border-[#F59E0B]/30 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-md bg-[#F59E0B]/20 text-[#D97706]">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#92400E]">
              Passout Alumni Access Window Notice:
            </span>
            <span className="text-xs text-[#B45309] ml-1.5">
              You have <strong className="underline">{isPassoutExpiringSoon.daysLeft} days remaining</strong> of college placement platform eligibility.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#D97706]">
          <Clock className="w-3.5 h-3.5" />
          <span>18-Month Post-Graduation Window</span>
        </div>
      </div>
    </div>
  );
}
