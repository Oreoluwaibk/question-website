"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { BackLink, Button, Field, Notice, SelectInput, TextArea, TextInput } from "@/components/product-ui";
import { authErrorMessage, questionsApi, uploadApi } from "@/lib/api";
import { fileToBase64 } from "@/lib/format";
import { isAllowedDocumentUpload, UNSUPPORTED_DOCUMENT_MESSAGE } from "@/lib/mime";
import {
  QUESTION_DOMAINS,
  QUESTION_TYPES,
  type CreateQuestionInput,
  type QuestionDomain,
  type QuestionType,
} from "@/lib/types";

function parseAnswer(type: QuestionType, raw: string): unknown {
  if (type === "TRUE_FALSE") return raw.trim().toLowerCase() === "true";
  if (type === "FILL_IN_THE_BLANK" || type === "MATCHING") {
    try {
      return JSON.parse(raw);
    } catch {
      return raw.split(",").map((item) => item.trim());
    }
  }
  return raw.trim();
}

function AddForm() {
  const params = useSearchParams();
  const router = useRouter();
  const preset = params.get("title") ?? "";
  const [mode, setMode] = useState<"manual" | "upload">(preset ? "upload" : "manual");
  const [materialTitle, setMaterialTitle] = useState(preset);
  const [question, setQuestion] = useState("");
  const [type, setType] = useState<QuestionType>("MCQ");
  const [domain, setDomain] = useState<QuestionDomain>("GENERAL");
  const [topic, setTopic] = useState("");
  const [options, setOptions] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!materialTitle.trim() || !question.trim()) {
      setError("Material title and question are required");
      return;
    }
    const payload: CreateQuestionInput = {
      materialTitle: materialTitle.trim(),
      type,
      question: question.trim(),
      domain,
      topic: topic.trim() || null,
      options:
        type === "MCQ" || type === "TRUE_FALSE"
          ? options.split("\n").map((item) => item.trim()).filter(Boolean)
          : null,
      answer: parseAnswer(type, answer),
    };
    setLoading(true);
    try {
      await questionsApi.create([payload]);
      router.push(`/materials/${encodeURIComponent(materialTitle.trim())}`);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (!materialTitle.trim()) {
      setError("Material title is required");
      return;
    }
    if (!isAllowedDocumentUpload(file.name, file.type)) {
      setError(UNSUPPORTED_DOCUMENT_MESSAGE);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await uploadApi.uploadDocument(
        { name: file.name, mimeType: file.type, data: await fileToBase64(file) },
        { appendToMaterialTitle: materialTitle.trim() }
      );
      router.push(`/materials/${encodeURIComponent(response.material.title)}`);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href="/materials">Materials</BackLink>
      <h1 className="mb-4 text-2xl font-semibold">Add questions</h1>
      <div className="mb-4 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:flex sm:flex-wrap [&_button]:w-full sm:[&_button]:w-auto">
        <Button variant={mode === "manual" ? "primary" : "secondary"} onClick={() => setMode("manual")}>
          Write one
        </Button>
        <Button variant={mode === "upload" ? "primary" : "secondary"} onClick={() => setMode("upload")}>
          Upload document
        </Button>
      </div>
      {error ? (
        <div className="mb-4">
          <Notice>{error}</Notice>
        </div>
      ) : null}
      {mode === "upload" ? (
        <div className="space-y-4">
          <Field label="Material title">
            <TextInput value={materialTitle} onChange={(e) => setMaterialTitle(e.target.value)} />
          </Field>
          <label className="inline-flex cursor-pointer">
            <input
              type="file"
              accept=".pdf,.docx,application/pdf"
              className="sr-only"
              disabled={loading}
              onChange={(event) => onFile(event.target.files?.[0])}
            />
            <span className="rounded-xl bg-mint px-4 py-2.5 text-sm font-semibold text-ink">
              {loading ? "Generating questions..." : "Choose PDF or DOCX"}
            </span>
          </label>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Material title">
            <TextInput value={materialTitle} onChange={(e) => setMaterialTitle(e.target.value)} required />
          </Field>
          <Field label="Question">
            <TextArea value={question} onChange={(e) => setQuestion(e.target.value)} required />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type">
              <SelectInput value={type} onChange={(e) => setType(e.target.value as QuestionType)}>
                {QUESTION_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Domain">
              <SelectInput value={domain} onChange={(e) => setDomain(e.target.value as QuestionDomain)}>
                {QUESTION_DOMAINS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>
          <Field label="Topic">
            <TextInput value={topic} onChange={(e) => setTopic(e.target.value)} />
          </Field>
          {type === "MCQ" || type === "TRUE_FALSE" ? (
            <Field label="Options, one per line">
              <TextArea value={options} onChange={(e) => setOptions(e.target.value)} />
            </Field>
          ) : null}
          <Field label="Answer">
            <TextInput value={answer} onChange={(e) => setAnswer(e.target.value)} />
          </Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save question"}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function AddQuestionPage() {
  return (
    <Suspense>
      <AddForm />
    </Suspense>
  );
}
