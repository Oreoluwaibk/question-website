"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button, Field, Logo, Notice, PasswordInput, TextInput } from "@/components/product-ui";
import { authErrorMessage } from "@/lib/api";
import { validateRegistration } from "@/lib/validation";

export default function SignupPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [accepted, setAccepted] = useState(false);
  const [confirmedAge, setConfirmedAge] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const issues = validateRegistration(form);
    const firstIssue = Object.values(issues).find(Boolean);
    if (firstIssue) {
      setError(firstIssue);
      return;
    }
    if (!accepted || !confirmedAge) {
      setError(
        !confirmedAge
          ? "You must confirm that you are at least 13 years old"
          : "You must agree to the Terms and Privacy Policy"
      );
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await signUp({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        password: form.password,
        acceptedTerms: true,
        confirmedMinimumAge: true,
      });
      if (result.needsOtp) {
        router.push(`/verify?email=${encodeURIComponent(form.email.trim())}`);
      } else {
        router.replace("/app");
      }
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-10">
      <Logo size={48} />
      <h1 className="mt-5 text-3xl font-semibold">Create account</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name">
            <TextInput value={form.firstName} onChange={(e) => set("firstName", e.target.value)} required />
          </Field>
          <Field label="Last name">
            <TextInput value={form.lastName} onChange={(e) => set("lastName", e.target.value)} required />
          </Field>
        </div>
        <Field label="Email">
          <TextInput type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
        </Field>
        <Field label="Phone number">
          <TextInput value={form.phoneNumber} onChange={(e) => set("phoneNumber", e.target.value)} required />
        </Field>
        <PasswordInput
          label="Password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          required
        />
        <PasswordInput
          label="Confirm password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => set("confirmPassword", e.target.value)}
          required
        />
        <label className="flex items-start gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            className="mt-1"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="text-mint">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-mint">
              Privacy Policy
            </Link>
          </span>
        </label>
        <label className="flex items-start gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={confirmedAge}
            onChange={(event) => setConfirmedAge(event.target.checked)}
            className="mt-1"
          />
          <span>
            I am 13 or older. My name can appear on the leaderboard until I turn that off in Profile.
          </span>
        </label>
        {error ? <Notice>{error}</Notice> : null}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link href="/login" className="font-medium text-mint">
          Already have an account?
        </Link>
      </p>
    </main>
  );
}
