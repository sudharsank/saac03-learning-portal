import { getAllLessons, getLessonsByDomain, DOMAINS } from '@/lib/content';
import type { Domain } from '@/lib/content-types';
import { ProgressDashboard } from '@/components/ProgressDashboard';

export default function ProgressPage() {
  const allLessons = getAllLessons();
  const lessonsByDomain = Object.fromEntries(
    DOMAINS.map((d) => [d, getLessonsByDomain(d)])
  ) as Record<Domain, ReturnType<typeof getLessonsByDomain>>;

  return <ProgressDashboard allLessons={allLessons} lessonsByDomain={lessonsByDomain} />;
}
