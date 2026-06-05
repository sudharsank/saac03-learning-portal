import { z } from 'zod';

// ── Schema ────────────────────────────────────────────────────────────────────

const LessonStatusSchema = z.object({
  status: z.enum(['not-started', 'reading', 'completed']),
  minutesSpent: z.number().default(0),
  lastOpenedAt: z.string(),
  completedAt: z.string().optional(),
});

const QuizItemSchema = z.object({
  qId: z.string(),
  correct: z.boolean(),
  objective: z.string(),
  chosen: z.string(),
});

const QuizAttemptSchema = z.object({
  quizId: z.string(),
  lessonSlug: z.string().optional(),
  domain: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
  mode: z.enum(['lesson', 'drill', 'mock', 'scenario']),
  startedAt: z.string(),
  finishedAt: z.string(),
  durationSec: z.number(),
  items: z.array(QuizItemSchema),
  score: z.number().min(0).max(1),
});

const FlashcardStateSchema = z.object({
  interval: z.number(),
  ease: z.number(),
  dueAt: z.string(),
  reps: z.number(),
});

const SettingsSchema = z.object({
  dailyGoalMinutes: z.number().default(30),
  theme: z.enum(['system', 'light', 'dark']).default('system'),
});

const ProgressStoreSchema = z.object({
  version: z.literal(1),
  lessons: z.record(z.string(), LessonStatusSchema),
  quizzes: z.array(QuizAttemptSchema),
  flashcards: z.record(z.string(), FlashcardStateSchema),
  settings: SettingsSchema,
});

export type LessonStatus = z.infer<typeof LessonStatusSchema>;
export type QuizAttempt = z.infer<typeof QuizAttemptSchema>;
export type FlashcardState = z.infer<typeof FlashcardStateSchema>;
export type ProgressSettings = z.infer<typeof SettingsSchema>;
export type ProgressStore = z.infer<typeof ProgressStoreSchema>;

// ── Defaults ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'ab900-progress';

const DEFAULT_STORE: ProgressStore = {
  version: 1,
  lessons: {},
  quizzes: [],
  flashcards: {},
  settings: {
    dailyGoalMinutes: 30,
    theme: 'system',
  },
};

// ── Public API ────────────────────────────────────────────────────────────────

export function loadProgress(): ProgressStore {
  if (typeof window === 'undefined') return DEFAULT_STORE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STORE };
    const parsed = JSON.parse(raw);
    const result = ProgressStoreSchema.safeParse(parsed);
    if (result.success) return result.data;
    // Schema mismatch — wipe and start fresh
    console.warn('[ab900] progress schema mismatch, resetting store');
    return { ...DEFAULT_STORE };
  } catch {
    return { ...DEFAULT_STORE };
  }
}

export function saveProgress(store: ProgressStore): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    console.warn('[ab900] failed to save progress to localStorage');
  }
}

export function markLessonOpened(slug: string): ProgressStore {
  const store = loadProgress();
  const existing = store.lessons[slug];
  store.lessons[slug] = {
    status: existing?.status === 'completed' ? 'completed' : 'reading',
    minutesSpent: existing?.minutesSpent ?? 0,
    lastOpenedAt: new Date().toISOString(),
    completedAt: existing?.completedAt,
  };
  saveProgress(store);
  return store;
}

export function markLessonComplete(slug: string): ProgressStore {
  const store = loadProgress();
  const existing = store.lessons[slug];
  store.lessons[slug] = {
    status: 'completed',
    minutesSpent: existing?.minutesSpent ?? 0,
    lastOpenedAt: existing?.lastOpenedAt ?? new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };
  saveProgress(store);
  return store;
}

export function addMinutesToLesson(slug: string, minutes: number): void {
  const store = loadProgress();
  const existing = store.lessons[slug];
  if (!existing) return;
  store.lessons[slug] = {
    ...existing,
    minutesSpent: (existing.minutesSpent ?? 0) + minutes,
  };
  saveProgress(store);
}

export function addQuizAttempt(attempt: QuizAttempt): ProgressStore {
  const store = loadProgress();
  store.quizzes.push(attempt);
  saveProgress(store);
  return store;
}
