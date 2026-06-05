import { BookOpen } from 'lucide-react';

export function DeepDive({ children }: { children: React.ReactNode }) {
  return (
    <section className="my-6 rounded-xl border border-violet-800/60 bg-violet-950/20 p-6">
      <div className="mb-3 flex items-center gap-2 text-violet-300">
        <BookOpen className="h-5 w-5" />
        <span className="text-sm font-semibold uppercase tracking-wider">Deep Dive — How It Works</span>
      </div>
      <div className="prose prose-invert max-w-none">{children}</div>
    </section>
  );
}
