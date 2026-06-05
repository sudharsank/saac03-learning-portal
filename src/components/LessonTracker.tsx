'use client';

import { useEffect, useRef } from 'react';
import { useProgress } from './ProgressProvider';
import { addMinutesToLesson } from '@/lib/progress';

export function LessonTracker({ lessonSlug }: { lessonSlug: string }) {
  const { markOpened } = useProgress();
  const pendingSecsRef = useRef(0);

  useEffect(() => {
    markOpened(lessonSlug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonSlug]);

  useEffect(() => {
    const TICK_MS = 10_000;

    const tick = setInterval(() => {
      if (document.visibilityState === 'visible') {
        pendingSecsRef.current += TICK_MS / 1000;
      }
      const mins = Math.floor(pendingSecsRef.current / 60);
      if (mins >= 1) {
        addMinutesToLesson(lessonSlug, mins);
        pendingSecsRef.current -= mins * 60;
      }
    }, TICK_MS);

    const flush = () => {
      // Credit a partial minute if >= 30 seconds accumulated
      if (pendingSecsRef.current >= 30) {
        addMinutesToLesson(lessonSlug, 1);
        pendingSecsRef.current = 0;
      }
    };

    window.addEventListener('beforeunload', flush);
    return () => {
      clearInterval(tick);
      flush();
      window.removeEventListener('beforeunload', flush);
    };
  }, [lessonSlug]);

  return null;
}
