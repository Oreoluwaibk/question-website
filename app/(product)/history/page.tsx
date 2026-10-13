"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, Empty, Notice, PageHeader } from "@/components/product-ui";
import { attemptsApi, authErrorMessage } from "@/lib/api";
import { formatWhen, percent } from "@/lib/format";
import type { Attempt } from "@/lib/types";

export default function HistoryPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    attemptsApi
      .list()
      .then(setAttempts)
      .catch((err) => setError(authErrorMessage(err)));
  }, []);

  return (
    <div>
      <PageHeader title="History" subtitle="Your practice tests" />
      {error ? <Notice>{error}</Notice> : null}
      {attempts.length === 0 ? (
        <Empty>No attempts yet. Start a test from one of your materials.</Empty>
      ) : (
        <div className="grid gap-3">
          {attempts.map((attempt) => {
            const href = attempt.completed_at
              ? `/test/${attempt.id}/results`
              : `/test/${attempt.id}`;
            return (
              <Link key={attempt.id} href={href}>
                <Card
                  title={attempt.material_title}
                  subtitle={`${attempt.completed_at ? "Completed" : "In progress"} · ${
                    attempt.score ?? 0
                  }/${attempt.max_score ?? 0} · ${percent(attempt.accuracy)} · ${formatWhen(
                    attempt.completed_at ?? attempt.created_at
                  )}`}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
