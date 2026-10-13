"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button, Field, Notice, TextInput } from "@/components/product-ui";
import { authErrorMessage } from "@/lib/api";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await forgotPassword(email.trim());
      setMessage("Check your email for a reset code.");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4">
      <h1 className="text-3xl font-semibold">Reset password</h1>
      <p className="mt-2 text-sm text-muted">We will email you a one-time code.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field label="Email">
          <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        {error ? <Notice>{error}</Notice> : null}
        {message ? <Notice tone="ok">{message}</Notice> : null}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sending..." : "Send code"}
        </Button>
      </form>
      {message ? (
        <Link
          href={`/reset-password?email=${encodeURIComponent(email.trim())}`}
          className="mt-4 text-center text-sm font-medium text-mint"
        >
          Enter the code
        </Link>
      ) : null}
      <Link href="/login" className="mt-4 text-center text-sm text-muted">
        Back to sign in
      </Link>
    </main>
  );
}
