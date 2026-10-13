"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button, Card, Notice, PageHeader } from "@/components/product-ui";
import { analyticsApi, authErrorMessage, subscriptionApi, uploadApi } from "@/lib/api";
import { fileToBase64, percent } from "@/lib/format";
import { isAllowedDocumentUpload, UNSUPPORTED_DOCUMENT_MESSAGE } from "@/lib/mime";
import type { AnalyticsSummary, SubscriptionStatus } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const [stats, plan] = await Promise.all([
      analyticsApi.summary().catch(() => null),
      subscriptionApi.me().catch(() => null),
    ]);
    setSummary(stats);
    setSubscription(plan);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const canAdd = subscription?.canAddMaterials !== false;
  const isPro = Boolean(subscription?.isPro);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setMessage("");
    if (!canAdd) {
      setError("Subscribe to Pro on your profile to upload more materials.");
      return;
    }
    if (!isAllowedDocumentUpload(file.name, file.type)) {
      setError(UNSUPPORTED_DOCUMENT_MESSAGE);
      return;
    }
    setUploading(true);
    try {
      const data = await fileToBase64(file);
      const response = await uploadApi.uploadDocument({
        name: file.name,
        mimeType: file.type,
        data,
      });
      setMessage(`${response.questionCount} questions extracted from "${response.material.title}".`);
      await load();
      router.push(`/materials/${encodeURIComponent(response.material.title)}`);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  const uploadCopy =
    canAdd && !isPro
      ? "Free trial includes 2 document uploads. Upload a PDF or DOCX to extract questions."
      : canAdd
        ? "Upload a PDF or DOCX to extract questions automatically."
        : "You've reached the free upload limit. Subscribe to Pro for more materials.";

  return (
    <div>
      <PageHeader
        title="Question Bank"
        subtitle="Upload study materials and practice with AI-generated questions"
      />
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card title="Quick upload" subtitle={uploadCopy}>
          <label className="inline-flex cursor-pointer">
            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              disabled={uploading}
              onChange={(event) => onFile(event.target.files?.[0])}
            />
            <span className="rounded-xl bg-mint px-4 py-2.5 text-sm font-semibold text-ink">
              {uploading ? "Generating your questions..." : "Upload document"}
            </span>
          </label>
          {error ? (
            <div className="mt-3">
              <Notice>{error}</Notice>
            </div>
          ) : null}
          {message ? (
            <div className="mt-3">
              <Notice tone="ok">{message}</Notice>
            </div>
          ) : null}
        </Card>
        <Card title="Keep going">
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/materials" className="font-medium text-mint">
              Browse materials
            </Link>
            <Link href="/history" className="font-medium text-mint">
              Review past tests
            </Link>
            <Link href="/profile" className="font-medium text-mint">
              {isPro ? "Manage Pro" : "See Pro plans"}
            </Link>
          </div>
        </Card>
      </div>
      <h2 className="mb-3 mt-8 text-lg font-semibold">Your stats</h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Attempts" value={String(summary?.totalAttempts ?? 0)} />
        <Stat label="Best score" value={String(summary?.bestScore ?? 0)} />
        <Stat label="Avg accuracy" value={percent(summary?.averageAccuracy)} />
        <Stat label="Avg time" value={`${summary?.averageTimeSeconds ?? 0}s`} />
      </div>
      <div className="mt-6 lg:hidden">
        <Button variant="secondary" onClick={() => router.push("/profile")}>
          Profile
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}
