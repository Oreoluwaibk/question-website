"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BackLink, Button, Chip, Notice } from "@/components/product-ui";
import { attemptsApi, authErrorMessage, subscriptionApi } from "@/lib/api";
import { QUESTION_COUNT_OPTIONS } from "@/lib/preferences";
import type { SubscriptionStatus } from "@/lib/types";

const DURATIONS = [30, 45, 60] as const;

function SetupForm() {
  const params = useSearchParams();
  const router = useRouter();
  const title = params.get("title") ?? "";
  const materialId = params.get("materialId") ?? undefined;
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [timed, setTimed] = useState(false);
  const [duration, setDuration] = useState<(typeof DURATIONS)[number]>(30);
  const [count, setCount] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    subscriptionApi.me().then(setSubscription).catch(() => setSubscription(null));
  }, []);

  const canUseTimed = Boolean(subscription?.allowTimed ?? subscription?.isPro);
  const remaining =
    subscription && !subscription.isPro
      ? Math.max(0, subscription.attemptLimit - subscription.usage.attempts)
      : null;

  async function start() {
    if (!title) return;
    if (subscription && subscription.canStartTest === false) {
      setError("Subscribe to Pro to start more practice tests.");
      return;
    }
    if (timed && !canUseTimed) {
      setError("Timed tests are included with Pro.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await attemptsApi.startTest({
        materialTitle: title,
        materialId,
        questionCount: count,
        timed,
        durationMinutes: timed ? duration : null,
      });
      window.sessionStorage.setItem(
        `qb-test-${response.attempt.id}`,
        JSON.stringify(response.questions)
      );
      router.replace(`/test/${response.attempt.id}`);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href={title ? `/materials/${encodeURIComponent(title)}` : "/materials"}>
        Back
      </BackLink>
      <h1 className="text-2xl font-semibold">Test mode</h1>
      <p className="mt-1 text-sm text-muted">{title || "Choose a material first"}</p>
      {remaining != null ? (
        <p className="mt-2 text-sm text-muted">{remaining} free attempts remaining</p>
      ) : null}
      <section className="mt-6 rounded-2xl border border-line bg-card p-5">
        <p className="text-sm font-medium">Test type</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip selected={!timed} onClick={() => setTimed(false)}>
            Untimed
          </Chip>
          <Chip
            selected={timed}
            disabled={!canUseTimed}
            onClick={() => setTimed(true)}
          >
            Timed{canUseTimed ? "" : " (Pro)"}
          </Chip>
        </div>
      </section>
      {timed ? (
        <section className="mt-3 rounded-2xl border border-line bg-card p-5">
          <p className="text-sm font-medium">Time limit</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {DURATIONS.map((minutes) => (
              <Chip key={minutes} selected={duration === minutes} onClick={() => setDuration(minutes)}>
                {minutes} min
              </Chip>
            ))}
          </div>
        </section>
      ) : null}
      <section className="mt-3 rounded-2xl border border-line bg-card p-5">
        <p className="text-sm font-medium">Number of questions</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUESTION_COUNT_OPTIONS.map((option) => (
            <Chip key={option} selected={count === option} onClick={() => setCount(option)}>
              {option}
            </Chip>
          ))}
        </div>
      </section>
      {error ? (
        <div className="mt-4">
          <Notice>{error}</Notice>
        </div>
      ) : null}
      <Button className="mt-5" disabled={loading || !title} onClick={start}>
        {loading ? "Starting..." : "Start test"}
      </Button>
    </div>
  );
}

export default function TestSetupPage() {
  return (
    <Suspense>
      <SetupForm />
    </Suspense>
  );
}
