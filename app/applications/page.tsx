"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/PortalLayout";
import { ApplicationsView } from "@/components/ApplicationsView";
import { JobDetailModal } from "@/components/JobDetailModal";
import { usePlyace } from "@/lib/store";
import { Job } from "@/lib/types";

export default function ApplicationsPage() {
  const { jobs } = usePlyace();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleSelectJob = (jobId: string) => {
    const found = jobs.find((j) => j.id === jobId);
    if (found) setSelectedJob(found);
  };

  return (
    <PortalLayout>
      <ApplicationsView onSelectJob={handleSelectJob} />

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </PortalLayout>
  );
}
