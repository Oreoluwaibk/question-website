"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button, Notice } from "@/components/product-ui";
import { authErrorMessage, subscriptionApi } from "@/lib/api";

function SuccessBody() {
  const params = useSearchParams();
  const reference = params.get("reference") ?? params.get("trxref") ?? "";
  const [message, setMessage] = useState("Confirming your payment...");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!reference) {
      setError("Missing payment reference");
      setMessage("");
      return;
    }
    subscriptionApi
      .verify(reference)
      .then(() => setMessage("Pro is active on this account."))
      .catch((err) => {
        setMessage("");
        setError(authErrorMessage(err));
      });
  }, [reference]);

  return (
    <main className="mx-auto max-w-lg py-16">
      <h1 className="text-3xl font-semibold">Subscription</h1>
      {message ? <p className="mt-3 text-sm text-muted">{message}</p> : null}
      {error ? (
        <div className="mt-4">
          <Notice>{error}</Notice>
        </div>
      ) : null}
      <Link href="/profile" className="mt-6 inline-block">
        <Button>Back to profile</Button>
      </Link>
    </main>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense>
      <SuccessBody />
    </Suspense>
  );
}
