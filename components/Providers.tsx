"use client";

import { AuthProvider } from "@/components/AuthProvider";
import { OpenInAppBanner } from "@/components/OpenInAppBanner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <OpenInAppBanner />
      {children}
    </AuthProvider>
  );
}
