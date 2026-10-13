export type QuestionType =
  | 'MCQ'
  | 'TRUE_FALSE'
  | 'SHORT_ANSWER'
  | 'LONG_ANSWER'
  | 'FILL_IN_THE_BLANK'
  | 'MATCHING';

export type QuestionDomain =
  | 'SCIENCE'
  | 'TECHNOLOGY'
  | 'ENGINEERING'
  | 'MATHEMATICS'
  | 'MEDICINE'
  | 'LAW'
  | 'BUSINESS'
  | 'ECONOMICS'
  | 'EDUCATION'
  | 'HISTORY'
  | 'GEOGRAPHY'
  | 'POLITICS'
  | 'RELIGION'
  | 'PHILOSOPHY'
  | 'PSYCHOLOGY'
  | 'SOCIOLOGY'
  | 'ETHICS'
  | 'ENVIRONMENT'
  | 'ART'
  | 'LANGUAGE'
  | 'DAILY_LIFE'
  | 'GENERAL';

export interface Question {
  id: string;
  creator_id: string;
  material_id?: string | null;
  material_title: string;
  type: QuestionType;
  question: string;
  options: string[] | null;
  answer: unknown;
  topic: string | null;
  domain: QuestionDomain;
  language: string;
  is_published: boolean;
  created_at?: string;
}

export interface Material {
  id: string;
  title: string;
  source_file?: string | null;
  question_count: number;
  created_at?: string;
}

export interface MaterialGroup {
  id: string | null;
  title: string;
  sourceFile?: string | null;
  questionCount: number;
  createdAt?: string;
}

export interface CreateQuestionInput {
  materialTitle: string;
  type: QuestionType;
  question: string;
  options?: string[] | null;
  answer?: unknown;
  topic?: string | null;
  domain: QuestionDomain;
  language?: string;
  isPublished?: boolean;
}

export interface Profile {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  field_of_study?: string | null;
  occupation?: string | null;
  phone_number?: string | null;
  avatar_url?: string | null;
  terms_accepted_at?: string | null;
  terms_accepted_version?: string | null;
  show_on_leaderboard?: boolean | null;
}

export type SubscriptionTier = 'FREE' | 'PRO';
export type BillingInterval = 'monthly' | 'yearly';

export interface SubscriptionPlanLimits {
  tier: SubscriptionTier;
  material_limit: number;
  attempt_limit: number;
  allow_reattempt: boolean;
  allow_timed: boolean;
}

export interface SubscriptionPricingOption {
  interval: BillingInterval;
  amount: number;
  currency: string;
  displayAmount: string;
}

export interface PaystackCheckoutSession {
  reference: string;
  authorizationUrl: string;
  accessCode?: string;
  publicKey: string;
  email: string;
  amount: number;
  currency: string;
  planCode: string;
  interval?: BillingInterval;
}

export interface QuestionExportPayload {
  materialTitle: string;
  questionCount: number;
  text: string;
  html: string;
  includeAnswers: boolean;
}

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  isPro: boolean;
  isTrialing?: boolean;
  canAddMaterials?: boolean;
  canAppendToMaterials?: boolean;
  canExportQuestions?: boolean;
  canStartTest?: boolean;
  materialLimit: number;
  attemptLimit: number;
  allowReattempt: boolean;
  allowTimed: boolean;
  billingStatus?: string | null;
  currentPeriodEnd?: string | null;
  publishableKey?: string;
  provider?: 'paystack';
  pricing?: SubscriptionPricingOption;
  pricingOptions?: {
    monthly: SubscriptionPricingOption;
    yearly: SubscriptionPricingOption;
  };
  usage: {
    materials: number;
    attempts: number;
  };
  limits: {
    materialsReached: boolean;
    attemptsReached: boolean;
  };
  plan: SubscriptionPlanLimits;
  plans?: {
    free: SubscriptionPlanLimits;
    pro: SubscriptionPlanLimits;
  };
}

export interface AnalyticsSummary {
  totalAttempts: number;
  averageAccuracy: number;
  bestScore: number;
  averageTimeSeconds: number;
}

export interface AnalyticsHistoryItem {
  date: string;
  score: number;
  accuracy: number;
  timeUsed: number;
}

export interface TypeAccuracy {
  questionType: string;
  averageAccuracy: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  bestScore: number;
  totalScore: number;
  attempts: number;
  averageAccuracy: number;
  isCurrentUser: boolean;
}

export interface LeaderboardPage {
  entries: LeaderboardEntry[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  currentUser: LeaderboardEntry | null;
}

export interface Attempt {
  id: string;
  user_id: string;
  material_id?: string | null;
  material_title: string;
  question_type?: string | null;
  max_score?: number | null;
  score?: number | null;
  accuracy?: number | null;
  time_used_seconds?: number | null;
  is_timed?: boolean;
  duration_seconds?: number | null;
  expires_at?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  created_at?: string;
}

export interface AttemptResultRow {
  question: Question;
  userAnswer: unknown;
  correctAnswer: unknown;
  isCorrect: boolean;
  score: number;
  maxScore: number;
}

export interface AttemptDetail {
  attempt: Attempt;
  questions: Question[];
  results: AttemptResultRow[];
  missed: AttemptResultRow[];
  summary: {
    score: number;
    maxScore: number;
    accuracy?: number | null;
    timeUsedSeconds?: number | null;
  };
}

export interface TestStartResponse {
  attempt: Attempt;
  questions: Question[];
  timing: {
    expiresAt: string | null;
    durationSeconds: number | null;
    durationMinutes: number | null;
    isTimed?: boolean;
  };
}

export const QUESTION_TYPES: QuestionType[] = [
  'MCQ',
  'TRUE_FALSE',
  'SHORT_ANSWER',
  'LONG_ANSWER',
  'FILL_IN_THE_BLANK',
  'MATCHING',
];

export const QUESTION_DOMAINS: QuestionDomain[] = [
  'SCIENCE',
  'TECHNOLOGY',
  'ENGINEERING',
  'MATHEMATICS',
  'MEDICINE',
  'LAW',
  'BUSINESS',
  'ECONOMICS',
  'EDUCATION',
  'HISTORY',
  'GEOGRAPHY',
  'POLITICS',
  'RELIGION',
  'PHILOSOPHY',
  'PSYCHOLOGY',
  'SOCIOLOGY',
  'ETHICS',
  'ENVIRONMENT',
  'ART',
  'LANGUAGE',
  'DAILY_LIFE',
  'GENERAL',
];
