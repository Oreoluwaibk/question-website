"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export function AccountActions({
  layout = "row",
}: {
  layout?: "row" | "stack";
}) {
  const { session, loading } = useAuth();
  const stack = layout === "stack";
  const className = stack
    ? "flex flex-col gap-2"
    : "flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center";

  if (loading) {
    return <span className="inline-block h-10 w-24" />;
  }

  if (session) {
    return (
      <div className={className}>
        <Link
          href="/app"
          className="inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-mint px-4 text-sm font-semibold text-primary-text sm:w-auto"
        >
          Open Question Bank
        </Link>
      </div>
    );
  }

  return (
    <div className={className}>
      <Link
        href="/login"
        className="inline-flex min-h-10 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold text-foreground sm:w-auto"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        className="inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-mint px-4 text-sm font-semibold text-primary-text sm:w-auto"
      >
        Sign up
      </Link>
    </div>
  );
}
