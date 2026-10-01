"use client";

import React from "react";
import { PortalLayout } from "@/components/PortalLayout";
import { LeaderboardView } from "@/components/LeaderboardView";

export default function LeaderboardPage() {
  return (
    <PortalLayout>
      <LeaderboardView />
    </PortalLayout>
  );
}
