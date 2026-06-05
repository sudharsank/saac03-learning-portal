'use client';

import Link from 'next/link';
import { useProgress } from './ProgressProvider';
import { overallCompletion, streak, dailyTimeSpent, nextRecommendedLesson } from '@/lib/analytics';
import type { Lesson } from '@/lib/content-types';

const DOMAIN_SLUGS: Record<number, string> = {
  1: 'domain-1-design-secure-architectures',
  2: 'domain-2-design-resilient-architectures',
  3: 'domain-3-design-high-performing-architectures',
  4: 'domain-4-design-cost-optimized-architectures',
};

type Props = {
  allLessons: Lesson[];
};

export function DashboardStats({ allLessons }: Props) {
  const { progress } = useProgress();

  const completion = overallCompletion(progress, allLessons);
  const currentStreak = streak(progress);
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayMinutes = dailyTimeSpent(progress, todayStr);
  const goalMinutes = progress.settings.dailyGoalMinutes;
  const nextLesson = nextRecommendedLesson(progress, allLessons);

  const completionPct = Math.round(completion * 100);
  const goalPct = Math.min(100, Math.round((todayMinutes / goalMinutes) * 100));

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* Overall completion */}
        <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Overall Progress</p>
          <p className="mt-1 text-2xl font-semibold text-sky-300">{completionPct}%</p>
          <div className="mt-2 h-1.5 rounded-full bg-slate-800">
            <div
              className="h-1.5 rounded-full bg-sky-500 transition-all"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        {/* Daily goal */}
        <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Today&apos;s Goal</p>
          <p className="mt-1 text-2xl font-semibold text-violet-300">
            {todayMinutes}<span className="text-sm font-normal text-slate-400">/{goalMinutes} min</span>
          </p>
          <div className="mt-2 h-1.5 rounded-full bg-slate-800">
            <div
              className="h-1.5 rounded-full bg-violet-500 transition-all"
              style={{ width: `${goalPct}%` }}
            />
          </div>
        </div>

        {/* Streak */}
        <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Study Streak</p>
          <p className="mt-1 text-2xl font-semibold text-amber-300">
            {currentStreak} <span className="text-sm font-normal text-slate-400">day{currentStreak !== 1 ? 's' : ''}</span>
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {currentStreak > 0 ? 'Keep it up!' : 'Start studying to build a streak'}
          </p>
        </div>
      </div>

      {/* Next lesson card */}
      {nextLesson && (
        <Link
          href={`/learn/${DOMAIN_SLUGS[nextLesson.domain]}/${nextLesson.slug}`}
          className="block rounded-xl border border-sky-800/60 bg-sky-950/30 px-5 py-4 hover:border-sky-500 transition"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-400">Continue Studying</p>
          <p className="mt-1 font-semibold text-slate-100">{nextLesson.title}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            Objective {nextLesson.objective} · ~{nextLesson.estMinutes} min
          </p>
        </Link>
      )}
    </div>
  );
}
