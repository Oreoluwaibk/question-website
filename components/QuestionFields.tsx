"use client";

import { useMemo } from "react";
import {
  assignMatchingSelection,
  getMatchingPairs,
  getMatchingRightOptions,
  selectionsFromMatchingAnswer,
  shuffleItems,
} from "@/lib/matching";
import type { Question } from "@/lib/types";

function normalizeTrueFalse(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lower = value.trim().toLowerCase();
    if (["true", "t", "yes", "y", "1"].includes(lower)) return true;
    if (["false", "f", "no", "n", "0"].includes(lower)) return false;
  }
  return null;
}

function optionMatches(option: string, selected: unknown) {
  if (selected === option) return true;
  const optionValue = normalizeTrueFalse(option);
  const selectedValue = normalizeTrueFalse(selected);
  return optionValue !== null && selectedValue !== null && optionValue === selectedValue;
}

function choiceOptions(question: Question) {
  if (question.type === "TRUE_FALSE") {
    return question.options?.length ? question.options : ["True", "False"];
  }
  return question.options ?? [];
}

function blankCount(question: Question) {
  if (Array.isArray(question.answer) && question.answer.length > 0) {
    return question.answer.length;
  }
  const markers = question.question.match(/_{2,}|\[\s*\.\.\.\s*\]|\(\s*\.\.\.\s*\)/gi);
  return Math.max(markers?.length ?? 1, 1);
}

export function QuestionFields({
  index,
  question,
  value,
  onChange,
}: {
  index: number;
  question: Question;
  value: unknown;
  onChange: (answer: unknown) => void;
}) {
  const pairs = useMemo(() => getMatchingPairs(question), [question]);
  const rights = useMemo(
    () => shuffleItems(getMatchingRightOptions(pairs)),
    [pairs]
  );
  const selections = selectionsFromMatchingAnswer(pairs, value);
  const blanks = blankCount(question);
  const blankValues = Array.isArray(value)
    ? value.map((item) => String(item ?? ""))
    : [];
  while (blankValues.length < blanks) blankValues.push("");

  return (
    <article className="rounded-2xl border border-line bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        Question {index + 1} · {question.type.replace(/_/g, " ")}
      </p>
      <h2 className="mt-2 break-words text-lg font-medium leading-7">{question.question}</h2>

      {question.type === "MCQ" || question.type === "TRUE_FALSE" ? (
        <div className="mt-4 grid gap-2">
          {choiceOptions(question).map((option) => {
            const selected = optionMatches(option, value);
            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  onChange(
                    question.type === "TRUE_FALSE"
                      ? (normalizeTrueFalse(option) ?? option)
                      : option
                  )
                }
                className={`rounded-xl border px-3 py-3 text-left text-sm ${
                  selected ? "border-mint bg-mint-soft" : "border-line"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : null}

      {question.type === "SHORT_ANSWER" || question.type === "LONG_ANSWER" ? (
        question.type === "LONG_ANSWER" ? (
          <textarea
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onChange(event.target.value)}
            className="mt-4 min-h-32 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
          />
        ) : (
          <input
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onChange(event.target.value)}
            className="mt-4 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
          />
        )
      ) : null}

      {question.type === "FILL_IN_THE_BLANK" ? (
        <div className="mt-4 grid gap-2">
          {blankValues.slice(0, blanks).map((blank, blankIndex) => (
            <input
              key={blankIndex}
              value={blank}
              placeholder={`Blank ${blankIndex + 1}`}
              onChange={(event) => {
                const next = [...blankValues];
                next[blankIndex] = event.target.value;
                onChange(next.slice(0, blanks));
              }}
              className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
            />
          ))}
        </div>
      ) : null}

      {question.type === "MATCHING" ? (
        <div className="mt-4 grid gap-3">
          {pairs.map((pair) => (
            <label key={pair.left} className="grid gap-1 text-sm sm:grid-cols-[1fr_1fr] sm:items-center">
              <span>{pair.left}</span>
              <select
                value={selections[pair.left] ?? ""}
                onChange={(event) =>
                  onChange(
                    assignMatchingSelection(pairs, selections, pair.left, event.target.value)
                  )
                }
                className="rounded-xl border border-line bg-paper px-3 py-2"
              >
                <option value="">Select a match</option>
                {rights.map((right) => (
                  <option key={right} value={right}>
                    {right}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      ) : null}
    </article>
  );
}
