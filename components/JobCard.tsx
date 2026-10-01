"use client";

import React from "react";
import { Job } from "@/lib/types";
import { usePlyace } from "@/lib/store";
import { checkEligibility } from "@/lib/eligibility";
import { calculateSkillMatch } from "@/lib/match";
import {
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
  onViewDetails: (job: Job) => void;
  isApplied: boolean;
}

export function JobCard({ job, onApply, onViewDetails, isApplied }: JobCardProps) {
  const { currentUser, simulatedDate, currentStatus } = usePlyace();

  // Real-time eligibility evaluation
  const eligibility = checkEligibility(job, currentUser, new Date(simulatedDate));
  const isEligible = eligibility.eligible;

  // Match % evaluation
  const match = calculateSkillMatch(currentUser.skills, job.requiredSkills);

  // Closing soon logic (<7 days)
  const deadlineDate = new Date(job.deadline);
  const simDate = new Date(simulatedDate);
  const diffDays = Math.ceil((deadlineDate.getTime() - simDate.getTime()) / (1000 * 60 * 60 * 24));
  const isClosingSoon = diffDays > 0 && diffDays <= 7;
  const isExpiredDeadline = diffDays < 0;

  // Type badge styling
  const getTypeBadge = () => {
    switch (job.oppType) {
      case "internship":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">Internship</span>;
      case "ppo":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">PPO Opportunity</span>;
      case "off-campus":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Off-Campus Drive</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">Full-Time</span>;
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
        isEligible
          ? "bg-white border-[#E2E8F0] shadow-card hover:shadow-card-hover hover:border-[#2563EB]/40"
          : "bg-slate-50/70 border-slate-200 opacity-80"
      }`}
    >
      <div className="p-5 sm:p-6">
        {/* Top Header: Company + Type + Eligibility status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] font-black text-lg">
              {job.company.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A] text-base leading-snug group-hover:text-[#2563EB]">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-[#64748B] mt-0.5">
                <span className="font-semibold text-[#0F172A]">{job.company}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {getTypeBadge()}
            {isEligible ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#10B981]/15 text-[#059669] border border-[#10B981]/30">
                <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                Eligible
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EF4444]/15 text-[#DC2626] border border-[#EF4444]/30">
                <XCircle className="w-3 h-3 text-[#EF4444]" />
                Ineligible
              </span>
            )}
          </div>
        </div>

        {/* Salary and deadline badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
          <span className="font-bold text-[#1E3A8A] bg-[#1E3A8A]/5 px-2.5 py-1 rounded-lg border border-[#1E3A8A]/15">
            {job.packageStipend}
          </span>

          {isClosingSoon && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[#D97706] bg-[#F59E0B]/15 border border-[#F59E0B]/30 animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              Closing in {diffDays} {diffDays === 1 ? "day" : "days"}!
            </span>
          )}

          {job.campusOnly && (
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              On-Campus Only
            </span>
          )}
        </div>

        {/* Match Percentage Progress Bar */}
        <div className="mb-4 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-[#0F172A] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              Skill Match
            </span>
            <span className="font-bold" style={{ color: match.progressColorHex }}>
              {match.matchPercentage}%
            </span>
          </div>

          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${match.matchPercentage}%`,
                backgroundColor: match.progressColorHex,
              }}
            />
          </div>

          {match.missingSkills.length > 0 && (
            <div className="mt-2 text-[11px] text-[#64748B]">
              <span className="font-medium text-[#0F172A]">Missing: </span>
              {match.missingSkills.slice(0, 3).join(", ")}
              {match.missingSkills.length > 3 && ` +${match.missingSkills.length - 3} more`}
            </div>
          )}
        </div>

        {/* Ineligible Explanation Banner (Section 6.2 & 9.5) */}
        {!isEligible && (
          <div className="mb-4 p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/25 text-xs text-[#991B1B] space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-[#DC2626]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              Ineligibility Constraint:
            </div>
            {eligibility.reasons.map((reason, idx) => (
              <div key={idx} className="pl-5 text-[11px] leading-snug">
                &bull; {reason}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 sm:px-6 bg-[#F8FAFC] border-t border-[#E2E8F0] rounded-b-2xl flex items-center justify-between gap-3">
        <button
          onClick={() => onViewDetails(job)}
          className="text-xs font-semibold text-[#2563EB] hover:text-[#1E3A8A] transition-colors"
        >
          View Full JD &rarr;
        </button>

        {isApplied ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] bg-[#1E3A8A]/10 px-3 py-1.5 rounded-xl border border-[#1E3A8A]/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            Applied
          </span>
        ) : (
          <button
            onClick={() => onApply(job)}
            disabled={!isEligible}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
              isEligible
                ? "bg-[#2563EB] hover:bg-[#1E3A8A] text-white active:scale-95"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <span>Register for Drive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
