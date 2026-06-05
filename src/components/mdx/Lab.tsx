import { FlaskConical } from 'lucide-react';

export function Lab({ children }: { children: React.ReactNode }) {
  return (
    <section className="my-6 rounded-xl border border-emerald-800/60 bg-emerald-950/20 p-6">
      <div className="mb-3 flex items-center gap-2 text-emerald-300">
        <FlaskConical className="h-5 w-5" />
        <span className="text-sm font-semibold uppercase tracking-wider">Hands-On Lab</span>
      </div>
      <div className="prose prose-invert max-w-none">{children}</div>
    </section>
  );
}
