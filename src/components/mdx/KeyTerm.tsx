export function KeyTerm({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <span className="group relative inline-block">
      <span className="cursor-help border-b border-dashed border-sky-400 text-sky-200 font-medium">
        {term}
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-slate-200 opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
        {children}
      </span>
    </span>
  );
}
