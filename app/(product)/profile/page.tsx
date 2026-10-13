"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button, Chip, Field, Notice, PageHeader, TextInput } from "@/components/product-ui";
import { useAuth } from "@/components/AuthProvider";
import {
  authApi,
  authErrorMessage,
  subscriptionApi,
} from "@/lib/api";
import { fileToBase64 } from "@/lib/format";
import {
  getUploadPreferences,
  QUESTION_COUNT_OPTIONS,
  saveUploadPreferences,
  type UploadPreferences,
} from "@/lib/preferences";
import { QUESTION_TYPES, type BillingInterval, type Profile, type QuestionType, type SubscriptionStatus } from "@/lib/types";

function initials(profile: Profile | null, email?: string | null) {
  const letters = `${profile?.first_name?.[0] ?? ""}${profile?.last_name?.[0] ?? ""}`.trim();
  return (letters || email?.[0] || "?").toUpperCase();
}

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [prefs, setPrefs] = useState<UploadPreferences>(getUploadPreferences());
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    field_of_study: "",
    occupation: "",
    phone_number: "",
  });
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const [me, plan] = await Promise.all([authApi.me(), subscriptionApi.me()]);
    setProfile(me);
    setSubscription(plan);
    setForm({
      first_name: me.first_name ?? "",
      last_name: me.last_name ?? "",
      field_of_study: me.field_of_study ?? "",
      occupation: me.occupation ?? "",
      phone_number: me.phone_number ?? "",
    });
  }

  useEffect(() => {
    load().catch((err) => setError(authErrorMessage(err)));
  }, []);

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const updated = await authApi.updateProfile(form);
      setProfile(updated);
      setEditing(false);
      setMessage("Profile updated");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function onAvatar(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const result = await authApi.uploadAvatar(await fileToBase64(file), file.type);
      setProfile((current) =>
        result.profile ?? (current ? { ...current, avatar_url: result.avatar_url } : current)
      );
      setMessage("Profile picture saved");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function subscribe() {
    setBusy(true);
    setError("");
    try {
      const session = await subscriptionApi.checkout(
        interval,
        `${window.location.origin}/subscription/success`
      );
      window.location.href = session.authorizationUrl;
    } catch (err) {
      setError(authErrorMessage(err));
      setBusy(false);
    }
  }

  const pricing = subscription?.pricingOptions?.[interval];

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Profile" subtitle={user?.email ?? ""} />
      {error ? (
        <div className="mb-4">
          <Notice>{error}</Notice>
        </div>
      ) : null}
      {message ? (
        <div className="mb-4">
          <Notice tone="ok">{message}</Notice>
        </div>
      ) : null}

      <section className="rounded-2xl border border-line bg-card p-5">
        <div className="flex items-center gap-4">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt="" className="h-16 w-16 rounded-2xl object-cover" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mint text-lg font-semibold text-ink">
              {initials(profile, user?.email)}
            </span>
          )}
          <label className="cursor-pointer text-sm font-medium text-mint">
            Change photo
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => onAvatar(event.target.files?.[0])}
            />
          </label>
        </div>
        {editing ? (
          <form onSubmit={saveProfile} className="mt-5 grid gap-3 sm:grid-cols-2">
            <Field label="First name">
              <TextInput value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
            </Field>
            <Field label="Last name">
              <TextInput value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
            </Field>
            <Field label="Field of study">
              <TextInput value={form.field_of_study} onChange={(e) => setForm({ ...form, field_of_study: e.target.value })} />
            </Field>
            <Field label="Occupation">
              <TextInput value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} />
            </Field>
            <Field label="Phone">
              <TextInput value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} />
            </Field>
            <div className="flex items-end gap-2">
              <Button type="submit" disabled={busy}>Save</Button>
              <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </form>
        ) : (
          <dl className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
            <Info label="Name" value={`${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() || "—"} />
            <Info label="Field of study" value={profile?.field_of_study || "—"} />
            <Info label="Occupation" value={profile?.occupation || "—"} />
            <Info label="Phone" value={profile?.phone_number || "—"} />
            <div className="sm:col-span-2">
              <Button variant="secondary" onClick={() => setEditing(true)}>Edit profile</Button>
            </div>
          </dl>
        )}
      </section>

      <section className="mt-4 rounded-2xl border border-line bg-card p-5">
        <h2 className="text-lg font-semibold">{subscription?.isPro ? "Pro" : "Free"}</h2>
        <p className="mt-1 text-sm text-muted">
          {subscription
            ? `${subscription.usage.materials}/${subscription.materialLimit || "∞"} materials · ${subscription.usage.attempts}/${subscription.attemptLimit || "∞"} attempts`
            : "Loading plan..."}
        </p>
        {subscription?.isPro ? (
          <Button
            className="mt-4"
            variant="secondary"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await subscriptionApi.cancel();
                await load();
                setMessage("Subscription cancelled");
              } catch (err) {
                setError(authErrorMessage(err));
              } finally {
                setBusy(false);
              }
            }}
          >
            Cancel Pro
          </Button>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              <Chip selected={interval === "monthly"} onClick={() => setInterval("monthly")}>
                Monthly {subscription?.pricingOptions?.monthly.displayAmount ?? ""}
              </Chip>
              <Chip selected={interval === "yearly"} onClick={() => setInterval("yearly")}>
                Yearly {subscription?.pricingOptions?.yearly.displayAmount ?? ""}
              </Chip>
            </div>
            <Button disabled={busy} onClick={subscribe}>
              {busy ? "Opening checkout..." : `Subscribe ${pricing?.displayAmount ?? ""}`}
            </Button>
            <p className="text-xs text-muted">Secure checkout via Paystack</p>
          </div>
        )}
      </section>

      <section className="mt-4 rounded-2xl border border-line bg-card p-5">
        <h2 className="font-semibold">Upload preferences</h2>
        <p className="mt-1 text-sm text-muted">Used the next time you upload a document.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUESTION_COUNT_OPTIONS.map((count) => (
            <Chip
              key={count}
              selected={prefs.questionCount === count}
              onClick={() => setPrefs({ ...prefs, questionCount: count })}
            >
              {count}
            </Chip>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUESTION_TYPES.map((type) => {
            const selected = prefs.questionTypes.includes(type);
            return (
              <Chip
                key={type}
                selected={selected}
                onClick={() => {
                  const next = selected
                    ? prefs.questionTypes.filter((item) => item !== type)
                    : [...prefs.questionTypes, type];
                  setPrefs({
                    ...prefs,
                    questionTypes: next.length ? next : prefs.questionTypes,
                  });
                }}
              >
                {type.replace(/_/g, " ")}
              </Chip>
            );
          })}
        </div>
        <Button
          className="mt-4"
          variant="secondary"
          onClick={() => {
            saveUploadPreferences(prefs);
            setMessage("Upload preferences saved");
          }}
        >
          Save preferences
        </Button>
      </section>

      <section className="mt-4 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => signOut()}>
          Sign out
        </Button>
        <a className="self-center text-sm text-mint" href="/delete-account">
          Delete account
        </a>
        <button
          type="button"
          className="text-sm text-danger"
          onClick={async () => {
            if (!window.confirm("Deactivate this account?")) return;
            try {
              await authApi.deactivateAccount();
              await signOut();
            } catch (err) {
              setError(authErrorMessage(err));
            }
          }}
        >
          Deactivate
        </button>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
