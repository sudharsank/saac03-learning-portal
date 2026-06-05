'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  loadProgress,
  saveProgress,
  markLessonComplete as markLessonCompleteLib,
  markLessonOpened as markLessonOpenedLib,
  type ProgressStore,
} from '@/lib/progress';

// ── Context ───────────────────────────────────────────────────────────────────

type ProgressContextValue = {
  progress: ProgressStore;
  markComplete: (slug: string) => void;
  markOpened: (slug: string) => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressStore>(() => {
    // Safe default for SSR; real data loaded in useEffect
    return {
      version: 1,
      lessons: {},
      quizzes: [],
      flashcards: {},
      settings: { dailyGoalMinutes: 30, theme: 'system' },
    };
  });

  // Load from localStorage once on client mount
  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const markComplete = useCallback((slug: string) => {
    const updated = markLessonCompleteLib(slug);
    setProgress({ ...updated });
  }, []);

  const markOpened = useCallback((slug: string) => {
    const updated = markLessonOpenedLib(slug);
    setProgress({ ...updated });
  }, []);

  // Sync any external saves back (e.g. multiple tabs)
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'ab900-progress') {
        setProgress(loadProgress());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <ProgressContext.Provider value={{ progress, markComplete, markOpened }}>
      {children}
    </ProgressContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
