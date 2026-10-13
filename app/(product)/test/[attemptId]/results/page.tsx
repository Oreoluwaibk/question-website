"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Notice } from "@/components/product-ui";
import { attemptsApi, authErrorMessage } from "@/lib/api";
import { formatAnswer, percent } from "@/lib/format";
import type { AttemptDetail } from "@/lib/types";

export default function ResultsPage() {
  const params = useParams<{ attemptId: string }>();
  const [detail, setDetail] = useState<AttemptDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    attemptsApi
      .get(params.attemptId)
      .then(setDetail)
      .catch((err) => setError(authErrorMessage(err)));
  }, [params.attemptId]);

  if (!detail) return <p className="text-sm text-muted">{error || "Loading results..."}</p>;

  return (
    <div>
      <p className="text-sm text-muted">{detail.attempt.material_title}</p>
      <h1 className="mt-1 text-3xl font-semibold">
        {detail.summary.score}/{detail.summary.maxScore}
      </h1>
      <p className="mt-1 text-muted">
        {percent(detail.summary.accuracy)} accuracy
        {detail.summary.timeUsedSeconds != null
          ? ` · ${detail.summary.timeUsedSeconds}s`
          : ""}
      </p>
      <div className="mt-4">
        <Link href="/history">
          <Button variant="secondary">All attempts</Button>
        </Link>
      </div>
      {error ? (
        <div className="mt-4">
          <Notice>{error}</Notice>
        </div>
      ) : null}
      <div className="mt-6 grid gap-3">
        {detail.results.map((row, index) => (
          <article key={row.question.id} className="rounded-2xl border border-line bg-card p-4">
            <p className={`text-xs font-semibold uppercase ${row.isCorrect ? "text-mint" : "text-danger"}`}>
              {index + 1}. {row.isCorrect ? "Correct" : "Review"}
            </p>
            <p className="mt-2">{row.question.question}</p>
            <p className="mt-2 text-sm text-muted">Your answer: {formatAnswer(row.userAnswer)}</p>
            {!row.isCorrect ? (
              <p className="mt-1 text-sm">Answer: {formatAnswer(row.correctAnswer)}</p>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
