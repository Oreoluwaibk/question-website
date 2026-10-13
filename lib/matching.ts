import type { Question } from '@/lib/types';

export type MatchingPair = { left: string; right: string };

export function parseMatchingPairs(answer: unknown): MatchingPair[] {
  if (!Array.isArray(answer)) return [];

  const pairs: MatchingPair[] = [];

  for (const item of answer) {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) continue;

    const obj = item as Record<string, unknown>;
    const left = String(obj.left ?? obj.term ?? obj.key ?? '').trim();
    const right = String(obj.right ?? obj.match ?? obj.value ?? '').trim();

    if (left && right) {
      pairs.push({ left, right });
    }
  }

  return pairs;
}

export function getMatchingPairs(question: Question): MatchingPair[] {
  const fromAnswer = parseMatchingPairs(question.answer);
  if (fromAnswer.length) return fromAnswer;

  const options = question.options ?? [];
  return options.map((left) => ({ left, right: '' }));
}

export function getMatchingRightOptions(pairs: MatchingPair[]): string[] {
  return [...new Set(pairs.map((pair) => pair.right).filter(Boolean))];
}

export function buildMatchingAnswer(
  pairs: MatchingPair[],
  selections: Record<string, string>
): MatchingPair[] {
  return pairs.map((pair) => ({
    left: pair.left,
    right: selections[pair.left]?.trim() ?? '',
  }));
}

export function selectionsFromMatchingAnswer(
  pairs: MatchingPair[],
  answer: unknown
): Record<string, string> {
  const selections: Record<string, string> = {};

  if (!Array.isArray(answer)) return selections;

  for (const pair of pairs) {
    const row = answer.find(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        String((item as MatchingPair).left).trim() === pair.left
    ) as MatchingPair | undefined;

    if (row?.right) {
      selections[pair.left] = row.right;
    }
  }

  return selections;
}

export function assignMatchingSelection(
  pairs: MatchingPair[],
  selections: Record<string, string>,
  left: string,
  right: string
): MatchingPair[] {
  // Tap the same option again to clear the match.
  if (selections[left] === right) {
    const next = { ...selections };
    delete next[left];
    return buildMatchingAnswer(pairs, next);
  }

  const next: Record<string, string> = { ...selections, [left]: right };

  for (const pair of pairs) {
    if (pair.left !== left && next[pair.left] === right) {
      delete next[pair.left];
    }
  }

  return buildMatchingAnswer(pairs, next);
}

export function shuffleItems<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
