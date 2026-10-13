"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button, Field, Notice, TextInput } from "@/components/product-ui";
import { authErrorMessage } from "@/lib/api";

function VerifyForm() {
  const params = useSearchParams();
  const router = useRouter();
  const { verifyOtp, resendOtp } = useAuth();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await verifyOtp(email.trim(), otp.trim());
      router.replace("/app");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4">
      <h1 className="text-3xl font-semibold">Verify email</h1>
      <p className="mt-2 text-sm text-muted">Enter the code we sent to your inbox.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field label="Email">
          <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Code">
          <TextInput value={otp} onChange={(e) => setOtp(e.target.value)} inputMode="numeric" required />
        </Field>
        {error ? <Notice>{error}</Notice> : null}
        {info ? <Notice tone="ok">{info}</Notice> : null}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </form>
      <button
        type="button"
        className="mt-4 text-sm font-medium text-mint"
        onClick={async () => {
          setError("");
          try {
            await resendOtp(email.trim());
            setInfo("A new code is on the way.");
          } catch (err) {
            setError(authErrorMessage(err));
          }
        }}
      >
        Resend code
      </button>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}
