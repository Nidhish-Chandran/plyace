"use client";

import React from "react";
import { PortalLayout } from "@/components/PortalLayout";
import { TestsView } from "@/components/TestsView";

export default function TestsPage() {
  return (
    <PortalLayout>
      <TestsView />
    </PortalLayout>
  );
}
