"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Button, Logo, Notice } from "@/components/product-ui";
import { authApi, authErrorMessage } from "@/lib/api";

export default function AcceptTermsPage() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [confirmedAge, setConfirmedAge] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main className="mx-auto max-w-lg py-10">
      <Logo size={56} />
      <h1 className="mt-5 text-3xl font-semibold">Accept terms</h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        To use Question Bank, confirm that you have read and agree to the Terms and Privacy Policy.
      </p>
      <label className="mt-6 flex items-start gap-2 text-sm">
        <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-1" />
        <span>
          I agree to the{" "}
          <Link className="text-mint" href="/terms">Terms</Link> and{" "}
          <Link className="text-mint" href="/privacy">Privacy Policy</Link>
        </span>
      </label>
      <label className="mt-3 flex items-start gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={confirmedAge}
          onChange={(event) => setConfirmedAge(event.target.checked)}
          className="mt-1"
        />
        <span>I am 13 or older.</span>
      </label>
      {error ? (
        <div className="mt-4">
          <Notice>{error}</Notice>
        </div>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-2">
        <Button
          disabled={loading}
          onClick={async () => {
            if (!agreed || !confirmedAge) {
              setError(
                !confirmedAge
                  ? "You must confirm that you are at least 13 years old"
                  : "You must agree to the Terms and Privacy Policy"
              );
              return;
            }
            setLoading(true);
            try {
              await authApi.acceptTerms();
              router.replace("/app");
            } catch (err) {
              setError(authErrorMessage(err));
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "Saving..." : "Accept and continue"}
        </Button>
        <Button variant="ghost" onClick={() => signOut().then(() => router.replace("/login"))}>
          Sign out
        </Button>
      </div>
    </main>
  );
}
