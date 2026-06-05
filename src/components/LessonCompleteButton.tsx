'use client';

import { useProgress } from './ProgressProvider';

type Props = {
  lessonSlug: string;
};

export function LessonCompleteButton({ lessonSlug }: Props) {
  const { progress, markComplete } = useProgress();
  const lessonState = progress.lessons[lessonSlug];
  const isCompleted = lessonState?.status === 'completed';

  if (isCompleted) {
    return (
      <div className="flex items-center justify-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-900/50 px-5 py-2.5 text-sm font-semibold text-emerald-300 border border-emerald-700">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Completed
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={() => markComplete(lessonSlug)}
        className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        Mark as Complete
      </button>
    </div>
  );
}
