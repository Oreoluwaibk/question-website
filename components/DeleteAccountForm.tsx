"use client";

import { FormEvent, useState } from "react";
import { Button, Input } from "@/components/ui";
import { submitDeletionRequest } from "@/lib/publicApi";

export function DeleteAccountForm() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await submitDeletionRequest({
        email: email.trim(),
        reason: reason.trim() || undefined,
      });
      setMessage(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-2 text-sm">
        <span className="font-medium text-foreground">Account email</span>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-medium text-foreground">Reason (optional)</span>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-mint"
          placeholder="Tell us why you are leaving (optional)"
        />
      </label>

      {message ? (
        <p className="rounded-xl border border-mint/30 bg-[rgba(72,184,154,0.08)] px-4 py-3 text-sm text-foreground">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl border border-danger bg-[rgba(229,72,77,0.08)] px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Submitting..." : "Request account deletion"}
      </Button>
    </form>
  );
}
