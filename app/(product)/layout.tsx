"use client";

import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted">Loading...</div>}>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
