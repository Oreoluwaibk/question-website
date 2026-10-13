"use client";

import Link from "next/link";
import { Button } from "@/components/product-ui";

export default function SubscriptionCancelPage() {
  return (
    <main className="mx-auto max-w-lg py-16">
      <h1 className="text-3xl font-semibold">Checkout cancelled</h1>
      <p className="mt-3 text-sm text-muted">No payment was taken. You can subscribe whenever you are ready.</p>
      <Link href="/profile" className="mt-6 inline-block">
        <Button>Back to profile</Button>
      </Link>
    </main>
  );
}
