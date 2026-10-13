import type { Question } from '@/lib/types';
import { getMatchingPairs } from '@/lib/matching';

function normalizeTrueFalse(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.trim().toLowerCase();
    if (['true', 't', 'yes', 'y', '1'].includes(lower)) return true;
    if (['false', 'f', 'no', 'n', '0'].includes(lower)) return false;
  }
  return null;
}

function getBlankCount(question: Question): number {
  if (Array.isArray(question.answer) && question.answer.length > 0) {
    return question.answer.length;
  }

  const markers = question.question.match(
    /_{2,}|\[\s*\.\.\.\s*\]|\(\s*\.\.\.\s*\)/gi
  );
  return Math.max(markers?.length ?? 1, 1);
}

export function isQuestionAnswered(question: Question, answer: unknown): boolean {
  if (answer === null || answer === undefined) return false;

  if (question.type === 'TRUE_FALSE') {
    return normalizeTrueFalse(answer) !== null;
  }

  if (question.type === 'FILL_IN_THE_BLANK') {
    const blankCount = getBlankCount(question);
    if (!Array.isArray(answer) || answer.length < blankCount) return false;
    return answer
      .slice(0, blankCount)
      .every((item) => typeof item === 'string' && item.trim().length > 0);
  }

  if (question.type === 'MATCHING') {
    const pairs = getMatchingPairs(question).filter((pair) => pair.right);
    if (!pairs.length) return false;
    if (!Array.isArray(answer) || answer.length < pairs.length) return false;

    return pairs.every((pair, index) => {
      const row = answer[index];
      if (typeof row !== 'object' || row === null) return false;
      return String((row as { right?: string }).right ?? '').trim().length > 0;
    });
  }

  if (typeof answer === 'string') return answer.trim().length > 0;
  if (Array.isArray(answer)) {
    return answer.some((item) => typeof item === 'string' && item.trim().length > 0);
  }

  return true;
}

export function countAnsweredQuestions(
  questions: Question[],
  answers: Record<string, unknown>
): number {
  return questions.filter((question) =>
    isQuestionAnswered(question, answers[question.id])
  ).length;
}
