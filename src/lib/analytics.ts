import type { ProgressStore } from './progress';
import type { Lesson, Domain } from './content-types';
import { DOMAINS } from './content-types';

// ── Types ─────────────────────────────────────────────────────────────────────

export type DomainCoverage = Record<Domain, number>;

export type WeakObjective = {
  objective: string;
  accuracy: number; // 0..1
  attempts: number;
};

// ── Selectors ─────────────────────────────────────────────────────────────────

/**
 * Returns top-5 weakest objectives ranked by quiz accuracy (ascending).
 * Only includes objectives that have at least one quiz attempt.
 */
export function weakObjectives(
  progress: ProgressStore,
  _allLessons: Lesson[],
): WeakObjective[] {
  const map: Record<string, { correct: number; total: number }> = {};

  for (const attempt of progress.quizzes) {
    for (const item of attempt.items) {
      if (!map[item.objective]) map[item.objective] = { correct: 0, total: 0 };
      map[item.objective].total += 1;
      if (item.correct) map[item.objective].correct += 1;
    }
  }

  return Object.entries(map)
    .map(([objective, { correct, total }]) => ({
      objective,
      accuracy: total > 0 ? correct / total : 0,
      attempts: total,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);
}

/**
 * Fraction of lessons completed per domain.
 * Returns { 1: 0.4, 2: 0.0, 3: 0.8 }
 */
export function domainCoverage(
  progress: ProgressStore,
  allLessons: Lesson[],
): DomainCoverage {
  const result = Object.fromEntries(DOMAINS.map((d) => [d, 0])) as DomainCoverage;

  for (const domain of DOMAINS) {
    const domainLessons = allLessons.filter((l) => l.domain === domain);
    if (domainLessons.length === 0) continue;
    const completed = domainLessons.filter(
      (l) => progress.lessons[l.slug]?.status === 'completed',
    ).length;
    result[domain] = completed / domainLessons.length;
  }

  return result;
}

/**
 * First lesson that is not started, respecting prerequisites.
 * A lesson is ready if all its prerequisites are completed.
 */
export function nextRecommendedLesson(
  progress: ProgressStore,
  allLessons: Lesson[],
): Lesson | null {
  const completedSlugs = new Set(
    Object.entries(progress.lessons)
      .filter(([, v]) => v.status === 'completed')
      .map(([k]) => k),
  );

  for (const lesson of allLessons) {
    if (progress.lessons[lesson.slug]?.status === 'completed') continue;
    const prereqs = lesson.prerequisites ?? [];
    const prereqsMet = prereqs.every((p) => completedSlugs.has(p));
    if (prereqsMet) return lesson;
  }

  return null;
}

/**
 * Number of consecutive days (ending today) with at least one activity.
 * Activity = a lesson was opened, completed, or a quiz was taken.
 */
export function streak(progress: ProgressStore): number {
  const activityDays = new Set<string>();

  for (const lesson of Object.values(progress.lessons)) {
    if (lesson.lastOpenedAt) {
      activityDays.add(lesson.lastOpenedAt.slice(0, 10));
    }
    if (lesson.completedAt) {
      activityDays.add(lesson.completedAt.slice(0, 10));
    }
  }

  for (const attempt of progress.quizzes) {
    activityDays.add(attempt.finishedAt.slice(0, 10));
  }

  let count = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  while (true) {
    const dateStr = today.toISOString().slice(0, 10);
    if (!activityDays.has(dateStr)) break;
    count += 1;
    today.setDate(today.getDate() - 1);
  }

  return count;
}

/**
 * Total minutes spent on a specific date (YYYY-MM-DD).
 * Approximated from quiz durationSec on that date.
 */
export function dailyTimeSpent(
  progress: ProgressStore,
  dateStr: string,
): number {
  let secs = 0;
  for (const attempt of progress.quizzes) {
    if (attempt.finishedAt.startsWith(dateStr)) {
      secs += attempt.durationSec;
    }
  }
  // Also count minutesSpent from lessons opened on that date
  for (const lesson of Object.values(progress.lessons)) {
    if (lesson.lastOpenedAt?.startsWith(dateStr)) {
      secs += (lesson.minutesSpent ?? 0) * 60;
    }
  }
  return Math.round(secs / 60);
}

/**
 * Overall fraction of lessons completed across all domains.
 */
export function overallCompletion(
  progress: ProgressStore,
  allLessons: Lesson[],
): number {
  if (allLessons.length === 0) return 0;
  const completed = allLessons.filter(
    (l) => progress.lessons[l.slug]?.status === 'completed',
  ).length;
  return completed / allLessons.length;
}
