"use client";

import React, { useState } from "react";
import { Job } from "@/lib/types";
import { usePlyace } from "@/lib/store";
import { checkEligibility } from "@/lib/eligibility";
import { calculateSkillMatch } from "@/lib/match";
import { formatDate } from "@/lib/status";
import {
  X,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  AlertTriangle,
} from "lucide-react";
import confetti from "canvas-confetti";

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
  isApplied?: boolean;
}

export function JobDetailModal({ job, onClose, isApplied: externalIsApplied }: JobDetailModalProps) {
  const { currentUser, simulatedDate, applyToJob, applications } = usePlyace();
  const [notes, setNotes] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  if (!job) return null;

  const isApplied = externalIsApplied !== undefined
    ? externalIsApplied
    : applications.some((a) => a.jobId === job.id && a.studentId === currentUser.id);

  const eligibility = checkEligibility(job, currentUser, new Date(simulatedDate));
  const isEligible = eligibility.eligible;
  const match = calculateSkillMatch(currentUser.skills, job.requiredSkills);

  const handleApply = async () => {
    const res = await applyToJob(job.id, notes);
    if (res.success) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      setSubmittedMessage(res.message);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E2E8F0] relative">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] font-bold text-lg border border-[#2563EB]/20">
              {job.company.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A] text-lg">{job.title}</h3>
              <p className="text-xs text-[#64748B]">{job.company} &bull; {job.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {submittedMessage && (
            <div className="p-4 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-bold text-[#059669] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
              {submittedMessage}
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="text-[11px] text-[#64748B]">Compensation</div>
              <div className="font-bold text-sm text-[#1E3A8A] mt-0.5">{job.packageStipend}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="text-[11px] text-[#64748B]">Opportunity Type</div>
              <div className="font-bold text-sm text-[#0F172A] capitalize mt-0.5">{job.oppType}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="text-[11px] text-[#64748B]">Min CGPA Cutoff</div>
              <div className="font-bold text-sm text-[#0F172A] mt-0.5">{job.minCgpa.toFixed(1)}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="text-[11px] text-[#64748B]">Deadline</div>
              <div className="font-bold text-sm text-[#F59E0B] mt-0.5" suppressHydrationWarning>
                {formatDate(job.deadline)}
              </div>
            </div>
          </div>

          {/* Real-time Eligibility Verdict */}
          <div className="p-4 rounded-2xl border" style={{
            borderColor: isEligible ? "#10B98150" : "#EF444450",
            backgroundColor: isEligible ? "#10B98108" : "#EF444408",
          }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-sm" style={{ color: isEligible ? "#059669" : "#DC2626" }}>
                {isEligible ? <CheckCircle2 className="w-5 h-5 text-[#10B981]" /> : <XCircle className="w-5 h-5 text-[#EF4444]" />}
                {isEligible ? "You meet all placement criteria for this drive" : "Eligibility Criteria Not Met"}
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{
                backgroundColor: isEligible ? "#10B98120" : "#EF444420",
                color: isEligible ? "#059669" : "#DC2626",
              }}>
                {isEligible ? "Eligible" : "Ineligible"}
              </span>
            </div>

            {!isEligible && (
              <div className="space-y-1.5 mt-2 pl-7 text-xs text-[#991B1B]">
                {eligibility.reasons.map((r, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-red-500 font-bold">&times;</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
              Job Description & Role Summary
            </h4>
            <p className="text-sm text-[#0F172A] leading-relaxed whitespace-pre-line bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
              {job.description}
            </p>
          </div>

          {/* Skill Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Required Skills vs Your Profile ({match.matchPercentage}% Match)
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill) => {
                const isMatched = match.matchedSkills.includes(skill);
                return (
                  <span
                    key={skill}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium border ${
                      isMatched
                        ? "bg-[#10B981]/10 text-[#059669] border-[#10B981]/30 font-semibold"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {isMatched ? <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> : <XCircle className="w-3.5 h-3.5 text-slate-400" />}
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Official Registration Link Provided by Placement Officer */}
          {isEligible && (
            <div className="p-4 rounded-2xl bg-[#2563EB]/5 border border-[#2563EB]/20 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-[#1E3A8A] flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#2563EB]" />
                    <span>Official Drive Registration Link (CGPU Placement Cell)</span>
                  </h4>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    The placement officer has provided the official application link for this recruitment drive. You must complete your registration on this link before the deadline:
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={job.registrationLink || "https://forms.gle/cgpu-placement-drive"}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-[#E2E8F0] font-mono text-[#0F172A] select-all"
                />
                <a
                  href={job.registrationLink || "https://forms.gle/cgpu-placement-drive"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Open Official Link</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Application note for Admin review */}
          {isEligible && !isApplied && (
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Application Confirmation / Notes (Optional for CGPU Records):
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., Successfully submitted form on corporate portal, uploaded resume and marksheet..."
                rows={2}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] focus:outline-hidden bg-white text-[#0F172A]"
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors"
          >
            Close
          </button>

          {isApplied ? (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E3A8A]/10 text-[#1E3A8A] font-bold text-xs border border-[#1E3A8A]/20">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              Registered & Tracked in Plyace
            </div>
          ) : (
            <button
              onClick={handleApply}
              disabled={!isEligible || !!submittedMessage}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
                isEligible && !submittedMessage
                  ? "bg-[#10B981] hover:bg-emerald-700 text-white active:scale-95"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <span>Record Registration in Tracker</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
