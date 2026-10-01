"use client";

import React from "react";
import { PortalLayout } from "@/components/PortalLayout";
import { ResumeAnalyzerView } from "@/components/ResumeAnalyzerModal";

export default function ResumePage() {
  return (
    <PortalLayout>
      <ResumeAnalyzerView />
    </PortalLayout>
  );
}
