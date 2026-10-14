import { trackBackendRequest } from "@/lib/backendActivity";
import { getUploadPreferences } from "@/lib/preferences";
import { supabase } from "@/lib/supabase";
import type {
  AnalyticsHistoryItem,
  AnalyticsSummary,
  Attempt,
  AttemptDetail,
  CreateQuestionInput,
  LeaderboardPage,
  Material,
  PaystackCheckoutSession,
  Profile,
  Question,
  QuestionExportPayload,
  QuestionType,
  SubscriptionStatus,
  TestStartResponse,
  TypeAccuracy,
} from "@/lib/types";
import {
  ensureUploadFileName,
  resolveUploadMimeType,
  UNSUPPORTED_DOCUMENT_MESSAGE,
} from "@/lib/mime";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function getAccessToken() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  auth = true
): Promise<T> {
  return trackBackendRequest(() => apiFetchInner<T>(path, options, auth));
}

async function apiFetchInner<T>(
  path: string,
  options: RequestInit = {},
  auth = true
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  const method = (options.method ?? "GET").toUpperCase();
  let body = options.body;

  if (!(body instanceof FormData) && ["POST", "PUT", "PATCH"].includes(method)) {
    headers["Content-Type"] = "application/json";
    if (body == null) body = JSON.stringify({});
  } else if (body != null && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = await getAccessToken();
    if (!token) throw new ApiError("Not authenticated", 401);
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    method,
    body,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail =
      typeof data.details === "string" && data.details.trim()
        ? `: ${data.details}`
        : "";
    throw new ApiError(
      `${data.error ?? "Request failed"}${detail}`,
      response.status,
      typeof data.code === "string" ? data.code : undefined,
      data
    );
  }

  return data as T;
}

export async function setSupabaseSession(accessToken: string, refreshToken: string) {
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (error) throw error;
}

export function needsTermsAcceptance(
  profile: {
    terms_accepted_at?: string | null;
    terms_accepted_version?: string | null;
  },
  currentTermsVersion: string
) {
  if (!profile.terms_accepted_at) return true;
  return profile.terms_accepted_version !== currentTermsVersion;
}

export function authErrorMessage(err: unknown) {
  if (err instanceof ApiError && err.code === "DEVICE_LIMIT_REACHED") {
    return "You cannot login on more than 2 devices at a time. Sign out on another device first.";
  }
  if (err instanceof ApiError && err.message) return err.message;
  if (err instanceof Error && err.message) return err.message;
  return "Something went wrong";
}

let pendingDeviceRegister: {
  deviceId: string;
  promise: Promise<{
    message: string;
    needsTermsAcceptance: boolean;
    currentTermsVersion: string;
  }>;
} | null = null;

export const authApi = {
  register: (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    acceptedTerms: boolean;
    confirmedMinimumAge: boolean;
  }) =>
    apiFetch<{
      message: string;
      userId?: string;
      autoConfirmed?: boolean;
      accessToken?: string;
      refreshToken?: string;
    }>("/auth/register", { method: "POST", body: JSON.stringify(payload) }, false),

  resendOtp: (email: string) =>
    apiFetch<{ message: string }>(
      "/auth/resend-otp",
      { method: "POST", body: JSON.stringify({ email }) },
      false
    ),

  verifyOtp: (
    email: string,
    otp: string,
    device: { deviceId: string; deviceName?: string }
  ) =>
    apiFetch<{ accessToken: string; refreshToken: string }>(
      "/auth/verify-otp",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          otp,
          deviceId: device.deviceId,
          deviceName: device.deviceName,
        }),
      },
      false
    ),

  login: (
    email: string,
    password: string,
    device: { deviceId: string; deviceName?: string }
  ) =>
    apiFetch<{
      user: unknown;
      session: { access_token: string; refresh_token: string };
    }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          deviceId: device.deviceId,
          deviceName: device.deviceName,
        }),
      },
      false
    ),

  logout: (deviceId: string) =>
    apiFetch<{ message: string }>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ deviceId }),
    }),

  registerSession: (payload: {
    deviceId: string;
    deviceName?: string;
    refreshToken?: string;
  }) => {
    if (pendingDeviceRegister?.deviceId === payload.deviceId) {
      return pendingDeviceRegister.promise;
    }

    const promise = apiFetch<{
      message: string;
      needsTermsAcceptance: boolean;
      currentTermsVersion: string;
    }>("/auth/session/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }).finally(() => {
      if (pendingDeviceRegister?.promise === promise) pendingDeviceRegister = null;
    });

    pendingDeviceRegister = { deviceId: payload.deviceId, promise };
    return promise;
  },

  acceptTerms: () =>
    apiFetch<{ message: string }>("/auth/accept-terms", {
      method: "POST",
      body: JSON.stringify({ confirmedMinimumAge: true }),
    }),

  forgotPassword: (email: string) =>
    apiFetch<{ message: string }>(
      "/auth/forgot-password",
      { method: "POST", body: JSON.stringify({ email }) },
      false
    ),

  resetPassword: (email: string, otp: string, newPassword: string) =>
    apiFetch<{ accessToken: string; refreshToken: string }>(
      "/auth/reset-password",
      {
        method: "POST",
        body: JSON.stringify({ email, otp, newPassword }),
      },
      false
    ),

  me: () => apiFetch<Profile>("/auth/me"),

  updateProfile: (updates: Partial<Profile>) =>
    apiFetch<Profile>("/auth/me", {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  uploadAvatar: (data: string, mimeType: string) =>
    apiFetch<{ avatar_url: string; profile?: Profile }>("/auth/me/avatar/document", {
      method: "POST",
      body: JSON.stringify({
        data,
        mimeType: mimeType.startsWith("image/") ? mimeType : "image/jpeg",
      }),
    }),

  deactivateAccount: () =>
    apiFetch<{ message: string }>("/auth/deactivate", { method: "POST" }),

  requestDeletion: (reason?: string) =>
    apiFetch<{ message: string; alreadyPending?: boolean }>("/auth/request-deletion", {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
};

export const questionsApi = {
  list: () => apiFetch<Question[]>("/questions"),
  listMaterials: () => apiFetch<Material[]>("/questions/materials"),
  create: (questions: CreateQuestionInput[]) =>
    apiFetch<Question[]>("/questions", {
      method: "POST",
      body: JSON.stringify(questions),
    }),
  byMaterial: (title: string) =>
    apiFetch<Question[]>(`/questions/material/${encodeURIComponent(title)}`),
  exportMaterial: (title: string, includeAnswers = true) =>
    apiFetch<QuestionExportPayload>(
      `/questions/material/${encodeURIComponent(title)}/export?includeAnswers=${includeAnswers ? "true" : "false"}`
    ),
};

export const uploadApi = {
  uploadDocument: async (
    file: { name: string; mimeType: string; data: string },
    options?: {
      appendToMaterialTitle?: string;
      questionCount?: number;
      questionTypes?: QuestionType[];
    }
  ) => {
    const resolvedMime = resolveUploadMimeType(file.name, file.mimeType);
    if (!resolvedMime) {
      throw new ApiError(UNSUPPORTED_DOCUMENT_MESSAGE, 415, "UNSUPPORTED_FILE_TYPE");
    }
    const safeName = ensureUploadFileName(file.name, resolvedMime);
    const prefs = getUploadPreferences();
    return apiFetch<{
      message: string;
      material: { id: string; title: string };
      questionCount: number;
      appended?: boolean;
    }>("/upload/document", {
      method: "POST",
      body: JSON.stringify({
        fileName: safeName,
        data: file.data,
        appendToMaterialTitle: options?.appendToMaterialTitle,
        questionCount: options?.questionCount ?? prefs.questionCount,
        questionTypes: options?.questionTypes ?? prefs.questionTypes,
      }),
    });
  },
};

export const attemptsApi = {
  list: () => apiFetch<Attempt[]>("/attempts"),
  get: (id: string) => apiFetch<AttemptDetail>(`/attempts/${id}`),
  startTest: (payload: {
    materialTitle: string;
    materialId?: string;
    questionCount: number;
    durationMinutes?: 30 | 45 | 60 | null;
    timed?: boolean;
    questionType?: QuestionType;
  }) =>
    apiFetch<TestStartResponse>("/attempts/test/start", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  bulkSubmit: (attemptId: string, answers: Record<string, unknown>) =>
    apiFetch<{
      submitted: boolean;
      score: number;
      maxScore: number;
      accuracy: number;
    }>(`/attempts/${attemptId}/bulk-submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),
};

export const analyticsApi = {
  summary: () => apiFetch<AnalyticsSummary>("/analytics/summary"),
  history: () => apiFetch<AnalyticsHistoryItem[]>("/analytics/history"),
  byType: () => apiFetch<TypeAccuracy[]>("/analytics/type"),
  weakTopics: () => apiFetch<unknown[]>("/analytics/weak-topics"),
  leaderboard: (params?: { limit?: number; offset?: number }) => {
    const query = new URLSearchParams();
    if (params?.limit != null) query.set("limit", String(params.limit));
    if (params?.offset != null) query.set("offset", String(params.offset));
    const qs = query.toString();
    return apiFetch<LeaderboardPage>(`/analytics/leaderboard${qs ? `?${qs}` : ""}`);
  },
};

export const subscriptionApi = {
  me: () => apiFetch<SubscriptionStatus>("/subscription/me"),
  checkout: (interval: "monthly" | "yearly", callbackUrl: string) =>
    apiFetch<PaystackCheckoutSession>("/subscription/checkout", {
      method: "POST",
      body: JSON.stringify({ interval, callbackUrl }),
    }),
  verify: (reference: string) =>
    apiFetch<SubscriptionStatus & { message: string }>("/subscription/verify", {
      method: "POST",
      body: JSON.stringify({ reference }),
    }),
  cancel: () =>
    apiFetch<SubscriptionStatus & { message: string }>("/subscription/cancel", {
      method: "POST",
      body: JSON.stringify({}),
    }),
};

type LegalDocumentResponse = {
  slug: "terms" | "privacy";
  version: string;
  title: string;
  lastUpdated: string;
  intro: string;
  sections: Array<{ title: string; body: string[] }>;
};

async function publicFetch<T>(path: string): Promise<T> {
  return trackBackendRequest(() => publicFetchInner<T>(path));
}

async function publicFetchInner<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data.error ?? "Request failed", response.status);
  }
  return data as T;
}

export const legalApi = {
  getDocument: (slug: "terms" | "privacy") =>
    publicFetch<LegalDocumentResponse>(`/legal/${slug}`),
  getTermsVersion: () =>
    publicFetch<{ slug: "terms"; version: string }>("/legal/terms/version"),
};
