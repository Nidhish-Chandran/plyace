"use client";

import React from "react";
import { usePlyace } from "@/lib/store";
import { formatDate } from "@/lib/status";
import { StatusPill } from "./StatusPill";
import {
  FileCheck2,
  Building2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Clock,
} from "lucide-react";

export function ApplicationsView({ onSelectJob }: { onSelectJob?: (jobId: string) => void }) {
  const { applications, currentUser, jobs } = usePlyace();

  // Filter applications for current user (or show all if admin)
  const myApplications = applications.filter((a) => a.studentId === currentUser.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-[#2563EB]" />
            Application Tracker & Shortlists
          </h2>
          <p className="text-xs text-[#64748B]">
            Real-time pipeline monitoring &bull; Live updates from college placement cell
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] shadow-card text-xs font-semibold text-[#0F172A]">
          <span>Total Applications:</span>
          <span className="font-bold text-[#2563EB]">{myApplications.length}</span>
        </div>
      </div>

      {myApplications.length > 0 ? (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">Company & Position</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4">Skill Match</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-6">CGPU Notes & Updates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {myApplications.map((app) => {
                  const job = jobs.find((j) => j.id === app.jobId);
                  return (
                    <tr key={app.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-[#0F172A] text-sm">{app.company}</div>
                        <div className="text-[#64748B] text-xs flex items-center gap-1 mt-0.5">
                          <span>{app.jobTitle}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#64748B]" suppressHydrationWarning>
                        {formatDate(app.appliedAt)}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-[#2563EB] bg-[#2563EB]/10 px-2 py-0.5 rounded-md">
                          {app.matchScore}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <StatusPill status={app.status} />
                      </td>
                      <td className="py-4 px-6 text-[#0F172A] font-medium">
                        {app.notes || "Application received."}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 border border-[#E2E8F0] shadow-card text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] mx-auto flex items-center justify-center mb-3">
            <FileCheck2 className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-[#0F172A] text-base mb-1">No Applications Submitted Yet</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto mb-4">
            Browse verified opportunities on the Jobs Feed to submit your 1-click eligible applications.
          </p>
        </div>
      )}
    </div>
  );
}
