"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { OpenAppButton } from "@/components/OpenInAppBanner";
import { Button, Field, Logo, Notice, PasswordInput, TextInput } from "@/components/product-ui";
import { authErrorMessage } from "@/lib/api";

export default function LoginPage() {
  const { signIn, signInWithGoogle, configured } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace("/app");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-md flex-col justify-center px-4 py-10">
      <Logo size={56} />
      <h1 className="mt-5 text-3xl font-semibold">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">Sign in to your question bank</p>
      {!configured ? (
        <div className="mt-4">
          <Notice>Add Supabase keys to .env.local before signing in.</Notice>
        </div>
      ) : null}
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field label="Email">
          <TextInput
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </Field>
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {error ? <Notice>{error}</Notice> : null}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <Button
        variant="secondary"
        className="mt-3 w-full"
        disabled={loading}
        onClick={async () => {
          setError("");
          setLoading(true);
          try {
            await signInWithGoogle();
          } catch (err) {
            setError(authErrorMessage(err));
            setLoading(false);
          }
        }}
      >
        Continue with Google
      </Button>
      <div className="mt-6 flex flex-col items-center gap-2 text-sm">
        <Link href="/forgot-password" className="font-medium text-mint">
          Forgot password?
        </Link>
        <Link href="/signup" className="font-medium text-mint">
          Create account
        </Link>
        <OpenAppButton className="font-medium text-muted" />
        <Link href="/" className="text-muted">
          About Question Bank
        </Link>
      </div>
    </main>
  );
}
