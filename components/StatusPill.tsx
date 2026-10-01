import React from "react";
import { ApplicationStatus } from "@/lib/types";

interface StatusPillProps {
  status: ApplicationStatus;
  size?: "sm" | "md";
}

export function StatusPill({ status, size = "md" }: StatusPillProps) {
  const getColors = () => {
    switch (status) {
      case "Applied":
        return "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30";
      case "Shortlisted":
        return "bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/30";
      case "Interview":
        return "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/30";
      case "Selected":
        return "bg-[#10B981]/10 text-[#059669] border-[#10B981]/30";
      case "Rejected":
        return "bg-[#EF4444]/10 text-[#DC2626] border-[#EF4444]/30";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs font-semibold";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium transition-all ${getColors()} ${sizeClasses}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
}
