"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/PortalLayout";
import { AdminPortal } from "@/components/AdminPortal";
import { AdminSimulateModal } from "@/components/AdminSimulateModal";

export default function AdminPage() {
  const [adminTab, setAdminTab] = useState<string>("admin_overview");
  const [showSimModal, setShowSimModal] = useState<boolean>(false);

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Admin Section Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 border-b border-[#E2E8F0] scrollbar-none">
          {[
            { id: "admin_overview", label: "CGPU Dashboard" },
            { id: "admin_jobs", label: "Campus Drives" },
            { id: "admin_applications", label: "Candidate Pipeline" },
            { id: "admin_announcements", label: "Broadcast Notices" },
            { id: "admin_violations", label: "ExamGuard Audit" },
            { id: "admin_students", label: "Student Roster" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                adminTab === tab.id
                  ? "bg-[#1E3A8A] text-white shadow-sm"
                  : "bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AdminPortal
          currentAdminTab={adminTab}
          onOpenSimulate={() => setShowSimModal(true)}
        />
      </div>

      {showSimModal && (
        <AdminSimulateModal onClose={() => setShowSimModal(false)} />
      )}
    </PortalLayout>
  );
}
