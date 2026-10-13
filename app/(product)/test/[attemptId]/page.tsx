"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { QuestionFields } from "@/components/QuestionFields";
import { Button, Notice } from "@/components/product-ui";
import { attemptsApi, authErrorMessage } from "@/lib/api";
import { countAnsweredQuestions } from "@/lib/testAnswers";
import type { Question } from "@/lib/types";

export default function TestPage() {
  const params = useParams<{ attemptId: string }>();
  const attemptId = params.attemptId;
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [index, setIndex] = useState(0);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const cached = window.sessionStorage.getItem(`qb-test-${attemptId}`);
    attemptsApi
      .get(attemptId)
      .then((detail) => {
        if (cancelled) return;
        if (detail.attempt.completed_at) {
          router.replace(`/test/${attemptId}/results`);
          return;
        }
        const fromCache = cached ? (JSON.parse(cached) as Question[]) : [];
        setQuestions(detail.questions?.length ? detail.questions : fromCache);
        setExpiresAt(detail.attempt.expires_at ?? null);
        setReady(true);
      })
      .catch((err) => {
        if (!cancelled) setError(authErrorMessage(err));
      });
    return () => {
      cancelled = true;
    };
  }, [attemptId, router]);

  useEffect(() => {
    if (!expiresAt) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt]);

  const remaining = useMemo(() => {
    if (!expiresAt) return null;
    return Math.max(0, Math.floor((new Date(expiresAt).getTime() - now) / 1000));
  }, [expiresAt, now]);

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      await attemptsApi.bulkSubmit(attemptId, answers);
      window.sessionStorage.removeItem(`qb-test-${attemptId}`);
      router.replace(`/test/${attemptId}/results`);
    } catch (err) {
      setError(authErrorMessage(err));
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (remaining === 0 && ready && !submitting) {
      submit();
    }
    // submit is recreated each render; the zero-remaining guard is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, ready]);

  const question = questions[index];
  const answered = countAnsweredQuestions(questions, answers);
  const clock =
    remaining == null
      ? null
      : `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;

  if (!question) {
    return <p className="text-sm text-muted">{error || "Loading test..."}</p>;
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[180px_1fr] lg:gap-6">
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm text-muted">
            {answered}/{questions.length} answered
          </p>
          {clock ? <p className="text-lg font-semibold">{clock}</p> : null}
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:flex-wrap">
          {questions.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(itemIndex)}
              className={`h-10 w-10 shrink-0 rounded-lg text-xs font-semibold ${
                itemIndex === index
                  ? "bg-mint text-ink"
                  : answers[item.id] != null
                    ? "bg-mint-soft"
                    : "border border-line"
              }`}
            >
              {itemIndex + 1}
            </button>
          ))}
        </div>
      </aside>
      <div>
        <QuestionFields
          index={index}
          question={question}
          value={answers[question.id]}
          onChange={(answer) =>
            setAnswers((current) => ({ ...current, [question.id]: answer }))
          }
        />
        {error ? (
          <div className="mt-4">
            <Notice>{error}</Notice>
          </div>
        ) : null}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <Button variant="secondary" disabled={index === 0} onClick={() => setIndex((value) => value - 1)}>
            Previous
          </Button>
          <Button
            variant="secondary"
            disabled={index >= questions.length - 1}
            onClick={() => setIndex((value) => value + 1)}
          >
            Next
          </Button>
          <Button className="col-span-2 sm:col-span-1" disabled={submitting} onClick={submit}>
            {submitting ? "Submitting..." : "Submit test"}
          </Button>
        </div>
      </div>
    </div>
  );
}
