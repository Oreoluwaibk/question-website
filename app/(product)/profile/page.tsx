"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button, Chip, Field, Notice, PageHeader, TextInput } from "@/components/product-ui";
import { FramedImage } from "@/components/FramedImage";
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
  const [photoBusy, setPhotoBusy] = useState(false);
  const [viewingPhoto, setViewingPhoto] = useState(false);

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

  useEffect(() => {
    if (!viewingPhoto) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setViewingPhoto(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewingPhoto]);

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
    setPhotoBusy(true);
    try {
      const result = await authApi.uploadAvatar(await fileToBase64(file), file.type);
      setProfile((current) =>
        result.profile ?? (current ? { ...current, avatar_url: result.avatar_url } : current)
      );
      setMessage("Profile picture saved");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setPhotoBusy(false);
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
            <button
              type="button"
              className="shrink-0 cursor-pointer rounded-2xl border-0 bg-transparent p-0"
              aria-label="View profile photo"
              onClick={() => setViewingPhoto(true)}
            >
              <FramedImage
                src={profile.avatar_url}
                alt=""
                loading={photoBusy}
                className="h-16 w-16 min-h-16 min-w-16 max-h-16 max-w-16 rounded-2xl"
              />
            </button>
          ) : (
            <span className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-mint text-lg font-semibold text-ink">
              {photoBusy ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink border-t-transparent" role="status" aria-label="Loading picture" />
              ) : (
                initials(profile, user?.email)
              )}
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
        {profile?.avatar_url ? (
          <p className="mt-3 text-xs text-muted">Click the photo to view it</p>
        ) : null}
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

      <section className="mt-4 rounded-2xl border border-line bg-card p-4 sm:p-5">
        <h2 className="font-semibold">Leaderboard</h2>
        <p className="mt-1 text-sm text-muted">
          Other signed-in users can see your name and scores while this is on.
        </p>
        <Button
          className="mt-4"
          variant="secondary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError("");
            try {
              const updated = await authApi.updateProfile({
                show_on_leaderboard: profile?.show_on_leaderboard === false,
              });
              setProfile(updated);
              setMessage(
                updated.show_on_leaderboard === false
                  ? "You are hidden on the leaderboard"
                  : "You are visible on the leaderboard"
              );
            } catch (err) {
              setError(authErrorMessage(err));
            } finally {
              setBusy(false);
            }
          }}
        >
          {profile?.show_on_leaderboard === false ? "Show me on the leaderboard" : "Hide me on the leaderboard"}
        </Button>
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
            <p className="text-xs text-muted">
              Paystack checkout lets you choose card, bank, transfer, or USSD.
            </p>
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
      {viewingPhoto && profile?.avatar_url ? (
        <ProfilePhotoViewer src={profile.avatar_url} onClose={() => setViewingPhoto(false)} />
      ) : null}
    </div>
  );
}

function ProfilePhotoViewer({ src, onClose }: { src: string; onClose: () => void }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Profile photo"
        className="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute -top-10 right-0 text-sm font-medium text-white"
          onClick={onClose}
        >
          Close
        </button>
        {loaded ? null : (
          <span className="absolute inset-0 flex items-center justify-center" role="status" aria-label="Loading picture">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Profile photo"
          onLoad={() => setLoaded(true)}
          className={`max-h-[85vh] max-w-[90vw] rounded-2xl object-contain ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>
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
