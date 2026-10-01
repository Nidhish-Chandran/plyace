"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PortalLayout } from "@/components/PortalLayout";
import { StudentDashboard } from "@/components/StudentDashboard";
import { JobDetailModal } from "@/components/JobDetailModal";
import { Job } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleNavigate = (tab: string) => {
    if (tab === "jobs") router.push("/jobs");
    else if (tab === "applications") router.push("/applications");
    else if (tab === "resume") router.push("/resume");
    else if (tab === "tests") router.push("/tests");
    else if (tab === "leaderboard") router.push("/leaderboard");
    else if (tab === "mentorship") router.push("/mentorship");
    else router.push(`/${tab}`);
  };

  return (
    <PortalLayout>
      <StudentDashboard
        onNavigate={handleNavigate}
        onSelectJob={(job) => setSelectedJob(job)}
      />

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </PortalLayout>
  );
}
