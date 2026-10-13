"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button, Field, Notice, TextInput } from "@/components/product-ui";
import { authErrorMessage } from "@/lib/api";
import { validatePassword } from "@/lib/validation";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    setLoading(true);
    setError("");
    try {
      await resetPassword(email.trim(), otp.trim(), password);
      router.replace("/app");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4">
      <h1 className="text-3xl font-semibold">Choose a new password</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field label="Email">
          <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Reset code">
          <TextInput value={otp} onChange={(e) => setOtp(e.target.value)} required />
        </Field>
        <Field label="New password">
          <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        {error ? <Notice>{error}</Notice> : null}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Update password"}
        </Button>
      </form>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
