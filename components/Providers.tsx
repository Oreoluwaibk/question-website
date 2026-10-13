"use client";

import { AuthProvider } from "@/components/AuthProvider";
import { NavigationProgress } from "@/components/NavigationProgress";
import { OpenInAppBanner } from "@/components/OpenInAppBanner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NavigationProgress />
      <OpenInAppBanner />
      {children}
    </AuthProvider>
  );
}
