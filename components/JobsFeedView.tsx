"use client";

import React, { useState } from "react";
import { usePlyace } from "@/lib/store";
import { Job, JobType } from "@/lib/types";
import { JobCard } from "./JobCard";
import { checkEligibility } from "@/lib/eligibility";
import { calculateSkillMatch } from "@/lib/match";
import {
  Search,
  Filter,
  CheckCircle2,
  Briefcase,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

interface JobsFeedViewProps {
  onApply: (job: Job) => void;
  onViewDetails: (job: Job) => void;
}

export function JobsFeedView({ onApply, onViewDetails }: JobsFeedViewProps) {
  const { jobs, currentUser, applications, simulatedDate, currentStatus } = usePlyace();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [eligibleOnly, setEligibleOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"match" | "deadline">("match");

  const simDate = new Date(simulatedDate);

  // Filter & Sort
  const processedJobs = jobs
    .filter((job) => {
      // Search
      const matchesSearch =
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requiredSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

      // Type filter
      const matchesType = typeFilter === "all" || job.oppType === typeFilter;

      // Eligibility filter
      const eligibility = checkEligibility(job, currentUser, simDate);
      const matchesEligibility = !eligibleOnly || eligibility.eligible;

      return matchesSearch && matchesType && matchesEligibility;
    })
    .sort((a, b) => {
      if (sortBy === "match") {
        const matchA = calculateSkillMatch(currentUser.skills, a.requiredSkills).matchPercentage;
        const matchB = calculateSkillMatch(currentUser.skills, b.requiredSkills).matchPercentage;
        return matchB - matchA;
      } else {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
    });

  const totalEligibleCount = jobs.filter(
    (j) => checkEligibility(j, currentUser, simDate).eligible
  ).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#2563EB]" />
            Verified Opportunities & Drives Feed
          </h2>
          <p className="text-xs text-[#64748B]">
            Real-time eligibility calculation &bull; Ineligible drives are greyed out with specific reasons
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-xs font-bold text-[#059669] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>{totalEligibleCount} of {jobs.length} Drives Eligible</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-card space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company, role title, or skill (e.g. Python, React)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] bg-[#F8FAFC] text-[#0F172A]"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="text-xs text-[#64748B] font-semibold">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A]"
            >
              <option value="match">Highest Skill Match %</option>
              <option value="deadline">Closing Deadline First</option>
            </select>
          </div>
        </div>

        {/* Opportunity Type Pills & Eligible Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E2E8F0]">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: "All Drives" },
              { id: "full-time", label: "Full-Time" },
              { id: "internship", label: "Internships" },
              { id: "ppo", label: "PPO" },
              { id: "off-campus", label: "Off-Campus (Alumni)" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTypeFilter(t.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  typeFilter === t.id
                    ? "bg-[#2563EB] text-white shadow-xs"
                    : "bg-[#F8FAFC] hover:bg-slate-100 text-[#64748B]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#0F172A]">
            <input
              type="checkbox"
              checked={eligibleOnly}
              onChange={(e) => setEligibleOnly(e.target.checked)}
              className="rounded text-[#2563EB] focus:ring-0"
            />
            <span>Show Only Eligible Jobs</span>
          </label>
        </div>
      </div>

      {/* Jobs Grid */}
      {processedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {processedJobs.map((job) => {
            const isApplied = applications.some(
              (a) => a.jobId === job.id && a.studentId === currentUser.id
            );
            return (
              <JobCard
                key={job.id}
                job={job}
                onApply={onApply}
                onViewDetails={onViewDetails}
                isApplied={isApplied}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 border border-[#E2E8F0] shadow-card text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] mx-auto flex items-center justify-center mb-3">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-[#0F172A] mb-1">No Drives Match Your Filter</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto mb-4">
            Try clearing the search query or deselecting &apos;Show Only Eligible Jobs&apos; to view all company postings.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("all");
              setEligibleOnly(false);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-[#0F172A]"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
