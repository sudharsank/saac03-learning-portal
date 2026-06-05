'use client';

import Link from 'next/link';
import { useProgress } from './ProgressProvider';
import {
  domainCoverage,
  overallCompletion,
  streak,
  dailyTimeSpent,
  weakObjectives,
} from '@/lib/analytics';
import { DOMAIN_LABELS, DOMAINS, type Lesson, type Domain } from '@/lib/content-types';
import { ObjectiveHeatmap } from './ObjectiveHeatmap';

const DOMAIN_COLOR_PALETTE: Array<{ bar: string; text: string; badge: string }> = [
  { bar: 'bg-sky-500', text: 'text-sky-300', badge: 'bg-sky-900/40 text-sky-300' },
  { bar: 'bg-violet-500', text: 'text-violet-300', badge: 'bg-violet-900/40 text-violet-300' },
  { bar: 'bg-emerald-500', text: 'text-emerald-300', badge: 'bg-emerald-900/40 text-emerald-300' },
  { bar: 'bg-amber-500', text: 'text-amber-300', badge: 'bg-amber-900/40 text-amber-300' },
  { bar: 'bg-rose-500', text: 'text-rose-300', badge: 'bg-rose-900/40 text-rose-300' },
  { bar: 'bg-pink-500', text: 'text-pink-300', badge: 'bg-pink-900/40 text-pink-300' },
  { bar: 'bg-teal-500', text: 'text-teal-300', badge: 'bg-teal-900/40 text-teal-300' },
];

function getDomainColors(domain: number) {
  return DOMAIN_COLOR_PALETTE[(domain - 1) % DOMAIN_COLOR_PALETTE.length];
}

type Props = {
  allLessons: Lesson[];
  lessonsByDomain: Record<Domain, Lesson[]>;
};

export function ProgressDashboard({ allLessons, lessonsByDomain }: Props) {
  const { progress } = useProgress();

  const coverage = domainCoverage(progress, allLessons);
  const completion = overallCompletion(progress, allLessons);
  const currentStreak = streak(progress);
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayMinutes = dailyTimeSpent(progress, todayStr);
  const goalMinutes = progress.settings.dailyGoalMinutes;
  const weakObjs = weakObjectives(progress, allLessons);
  const recentQuizzes = [...progress.quizzes].reverse().slice(0, 5);

  const completionPct = Math.round(completion * 100);
  const goalPct = Math.min(100, Math.round((todayMinutes / goalMinutes) * 100));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Progress &amp; Analytics</h1>
        <p className="mt-1 text-slate-400">Domain coverage, streak, weak objectives, and quiz history.</p>
      </div>

      {/* Summary row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Overall completion */}
        <div className="card p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Overall Completion</p>
          <div className="mt-3 flex items-end gap-3">
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#1e293b" strokeWidth="4" />
              <circle
                cx="18" cy="18" r="14"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4"
                strokeDasharray={`${completionPct * 0.88} 88`}
                strokeLinecap="round"
              />
            </svg>
            <div>
              <p className="text-3xl font-bold text-sky-300">{completionPct}%</p>
              <p className="text-xs text-slate-500">
                {allLessons.filter((l) => progress.lessons[l.slug]?.status === 'completed').length}/{allLessons.length} lessons
              </p>
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="card p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Study Streak</p>
          <p className="mt-3 text-4xl font-bold text-amber-300">{currentStreak}</p>
          <p className="mt-1 text-sm text-slate-400">consecutive day{currentStreak !== 1 ? 's' : ''}</p>
          <p className="mt-2 text-xs text-slate-500">
            {currentStreak > 0 ? 'Keep going!' : 'Open a lesson to start your streak'}
          </p>
        </div>

        {/* Daily goal */}
        <div className="card p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Today&apos;s Goal</p>
          <p className="mt-3 text-4xl font-bold text-violet-300">{todayMinutes}</p>
          <p className="mt-1 text-sm text-slate-400">of {goalMinutes} min goal</p>
          <div className="mt-3 h-2 rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-violet-500 transition-all"
              style={{ width: `${goalPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Domain coverage */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Domain Coverage</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((domain) => {
            const lessons = lessonsByDomain[domain];
            const completed = lessons.filter(
              (l) => progress.lessons[l.slug]?.status === 'completed',
            ).length;
            const pct = Math.round(coverage[domain] * 100);
            const colors = getDomainColors(domain);

            return (
              <div key={domain} className="card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${colors.badge}`}>
                      Domain {domain}
                    </span>
                    <p className="mt-2 text-sm font-medium text-slate-200">{DOMAIN_LABELS[domain]}</p>
                  </div>
                  <p className={`text-2xl font-bold ${colors.text}`}>{pct}%</p>
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-800">
                  <div
                    className={`h-2 rounded-full ${colors.bar} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {completed} / {lessons.length} lessons completed
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Weakest objectives */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Weakest Objectives</h2>
        {weakObjs.length === 0 ? (
          <div className="card p-6 text-center text-slate-500 text-sm">
            No quiz data yet. Complete some practice questions to see your weak spots.
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Objective</th>
                  <th className="px-4 py-3">Accuracy</th>
                  <th className="px-4 py-3">Attempts</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {weakObjs.map((obj) => {
                  const pct = Math.round(obj.accuracy * 100);
                  const color =
                    pct < 50 ? 'text-rose-400' : pct < 70 ? 'text-amber-400' : 'text-emerald-400';
                  return (
                    <tr key={obj.objective} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-mono text-slate-300">{obj.objective}</td>
                      <td className={`px-4 py-3 font-semibold ${color}`}>{pct}%</td>
                      <td className="px-4 py-3 text-slate-400">{obj.attempts}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                          pct < 50
                            ? 'bg-rose-900/40 text-rose-300'
                            : pct < 70
                            ? 'bg-amber-900/40 text-amber-300'
                            : 'bg-emerald-900/40 text-emerald-300'
                        }`}>
                          {pct < 50 ? 'Needs work' : pct < 70 ? 'Fair' : 'Good'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent quiz attempts */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Recent Quiz Attempts</h2>
        {recentQuizzes.length === 0 ? (
          <div className="card p-6 text-center text-slate-500 text-sm">
            No quiz attempts yet.{' '}
            <Link href="/practice" className="text-sky-400 hover:underline">
              Head to Practice
            </Link>{' '}
            to start.
          </div>
        ) : (
          <div className="space-y-3">
            {recentQuizzes.map((attempt, i) => {
              const scorePct = Math.round(attempt.score * 100);
              const date = new Date(attempt.finishedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
              const scoreColor =
                scorePct >= 70 ? 'text-emerald-300' : scorePct >= 50 ? 'text-amber-300' : 'text-rose-300';

              return (
                <div key={i} className="card flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm font-medium capitalize text-slate-200">
                      {attempt.mode} quiz
                      {attempt.lessonSlug
                        ? ` · ${attempt.lessonSlug}`
                        : attempt.domain
                        ? ` · Domain ${attempt.domain}`
                        : ''}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {date} · {Math.round(attempt.durationSec / 60)} min
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${scoreColor}`}>{scorePct}%</p>
                    <p className="text-xs text-slate-500">
                      {attempt.items.filter((it) => it.correct).length}/{attempt.items.length} correct
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Objective coverage heatmap */}
      <ObjectiveHeatmap />

      {/* CTA */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/learn"
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 transition"
        >
          Continue Studying
        </Link>
        <Link
          href="/practice"
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-sky-500 hover:text-sky-300 transition"
        >
          Practice Questions
        </Link>
      </div>
    </div>
  );
}
