import { QUESTION_TYPES, type QuestionType } from "@/lib/types";

const UPLOAD_PREFS_KEY = "upload_preferences";

export type UploadPreferences = {
  questionCount: number;
  questionTypes: QuestionType[];
};

export const MIN_QUESTION_COUNT = 5;
export const MAX_QUESTION_COUNT = 200;
export const QUESTION_COUNT_OPTIONS = [
  5, 10, 20, 30, 40, 50, 75, 100, 125, 150, 175, 200,
];

export const DEFAULT_UPLOAD_PREFERENCES: UploadPreferences = {
  questionCount: 20,
  questionTypes: ["MCQ"],
};

export function getUploadPreferences(): UploadPreferences {
  if (typeof window === "undefined") return DEFAULT_UPLOAD_PREFERENCES;
  try {
    const raw = window.localStorage.getItem(UPLOAD_PREFS_KEY);
    if (!raw) return DEFAULT_UPLOAD_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<UploadPreferences>;
    const questionCount = Number(parsed.questionCount);
    const questionTypes = Array.isArray(parsed.questionTypes)
      ? parsed.questionTypes.filter((type): type is QuestionType =>
          QUESTION_TYPES.includes(type as QuestionType)
        )
      : DEFAULT_UPLOAD_PREFERENCES.questionTypes;

    return {
      questionCount:
        Number.isFinite(questionCount) &&
        questionCount >= MIN_QUESTION_COUNT &&
        questionCount <= MAX_QUESTION_COUNT
          ? Math.floor(questionCount)
          : DEFAULT_UPLOAD_PREFERENCES.questionCount,
      questionTypes: questionTypes.length
        ? questionTypes
        : DEFAULT_UPLOAD_PREFERENCES.questionTypes,
    };
  } catch {
    return DEFAULT_UPLOAD_PREFERENCES;
  }
}

export function saveUploadPreferences(preferences: UploadPreferences) {
  window.localStorage.setItem(UPLOAD_PREFS_KEY, JSON.stringify(preferences));
}
