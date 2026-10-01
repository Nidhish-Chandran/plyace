"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/PortalLayout";
import { JobsFeedView } from "@/components/JobsFeedView";
import { JobDetailModal } from "@/components/JobDetailModal";
import { Job } from "@/lib/types";

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <PortalLayout>
      <JobsFeedView
        onApply={(job) => setSelectedJob(job)}
        onViewDetails={(job) => setSelectedJob(job)}
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
