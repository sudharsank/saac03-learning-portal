import { Lightbulb } from 'lucide-react';

export function Concept({ children }: { children: React.ReactNode }) {
  return (
    <section className="my-6 rounded-xl border border-sky-800/60 bg-sky-950/20 p-6">
      <div className="mb-3 flex items-center gap-2 text-sky-300">
        <Lightbulb className="h-5 w-5" />
        <span className="text-sm font-semibold uppercase tracking-wider">Concept — What & Why</span>
      </div>
      <div className="prose prose-invert max-w-none">{children}</div>
    </section>
  );
}
