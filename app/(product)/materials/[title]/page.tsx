"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BackLink, Button, Empty, Notice, PageHeader } from "@/components/product-ui";
import { authErrorMessage, questionsApi, subscriptionApi } from "@/lib/api";
import { formatAnswer } from "@/lib/format";
import type { Question } from "@/lib/types";

export default function MaterialPage() {
  const params = useParams<{ title: string }>();
  const title = decodeURIComponent(params.title ?? "");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [materialId, setMaterialId] = useState<string | undefined>();
  const [showAnswers, setShowAnswers] = useState(false);
  const [canExport, setCanExport] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!title) return;
    try {
      const [data, materials, subscription] = await Promise.all([
        questionsApi.byMaterial(title),
        questionsApi.listMaterials(),
        subscriptionApi.me().catch(() => null),
      ]);
      setQuestions(data);
      setMaterialId(materials.find((item) => item.title === title)?.id);
      setCanExport(Boolean(subscription?.canExportQuestions));
      setError("");
    } catch (err) {
      setError(authErrorMessage(err));
    }
  }, [title]);

  useEffect(() => {
    load();
  }, [load]);

  async function copy(includeAnswers: boolean) {
    if (!canExport) {
      setError("Subscribe to Pro to copy and export questions.");
      return;
    }
    setBusy(true);
    try {
      const payload = await questionsApi.exportMaterial(title, includeAnswers);
      await navigator.clipboard.writeText(payload.text);
      setError("");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function download(includeAnswers: boolean) {
    if (!canExport) {
      setError("Subscribe to Pro to copy and export questions.");
      return;
    }
    setBusy(true);
    try {
      const payload = await questionsApi.exportMaterial(title, includeAnswers);
      const blob = new Blob([payload.html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${title}.html`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  const setup = `/test/setup?title=${encodeURIComponent(title)}${materialId ? `&materialId=${materialId}` : ""}`;

  return (
    <div>
      <BackLink href="/materials">All materials</BackLink>
      <PageHeader
        title={title}
        subtitle={`${questions.length} questions`}
        action={
          <Link href={setup}>
            <Button>Start test</Button>
          </Link>
        }
      />
      <div className="mb-4 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:flex sm:flex-wrap [&_button]:w-full sm:[&_button]:w-auto">
        <Button variant="secondary" onClick={() => setShowAnswers((value) => !value)}>
          {showAnswers ? "Hide answers" : "Show answers"}
        </Button>
        <Button variant="secondary" disabled={busy} onClick={() => copy(false)}>
          Copy questions
        </Button>
        <Button variant="secondary" disabled={busy} onClick={() => copy(true)}>
          Copy with answers
        </Button>
        <Button variant="ghost" disabled={busy} onClick={() => download(true)}>
          Download HTML
        </Button>
        <Link href={`/materials/add?title=${encodeURIComponent(title)}`}>
          <Button variant="ghost">Add more</Button>
        </Link>
      </div>
      {error ? <Notice>{error}</Notice> : null}
      {questions.length === 0 ? (
        <Empty>No questions in this material yet.</Empty>
      ) : (
        <div className="grid gap-3">
          {questions.map((question, index) => (
            <article key={question.id} className="rounded-2xl border border-line bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {index + 1}. {question.type.replace(/_/g, " ")}
                {question.topic ? ` · ${question.topic}` : ""}
              </p>
              <p className="mt-2 break-words leading-7">{question.question}</p>
              {question.options?.length ? (
                <ul className="mt-2 list-disc pl-5 text-sm text-muted">
                  {question.options.map((option) => (
                    <li key={option}>{option}</li>
                  ))}
                </ul>
              ) : null}
              {showAnswers ? (
                <p className="mt-3 text-sm text-mint">Answer: {formatAnswer(question.answer)}</p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
