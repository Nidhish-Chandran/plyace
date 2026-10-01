"use client";

import React from "react";
import { PlyaceProvider } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return <PlyaceProvider>{children}</PlyaceProvider>;
}
