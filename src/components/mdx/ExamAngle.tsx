import { Target } from 'lucide-react';

export function ExamAngle({ children }: { children: React.ReactNode }) {
  return (
    <section className="my-6 rounded-xl border border-amber-800/60 bg-amber-950/20 p-6">
      <div className="mb-3 flex items-center gap-2 text-amber-300">
        <Target className="h-5 w-5" />
        <span className="text-sm font-semibold uppercase tracking-wider">Exam Angle — What SAA-C03 Tests</span>
      </div>
      <div className="prose prose-invert max-w-none">{children}</div>
    </section>
  );
}
