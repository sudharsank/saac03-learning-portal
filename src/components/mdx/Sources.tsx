import type { VendorRef } from '@/lib/lesson-schema';
import { ExternalLink } from 'lucide-react';

const typeLabel: Record<VendorRef['type'], string> = {
  'ms-learn': 'MS Learn',
  mvp: 'MVP',
  video: 'Video',
  github: 'GitHub',
  blog: 'Blog',
};

const typeCls: Record<VendorRef['type'], string> = {
  'ms-learn': 'bg-blue-900/50 text-blue-300 border-blue-700/50',
  mvp: 'bg-purple-900/50 text-purple-300 border-purple-700/50',
  video: 'bg-red-900/50 text-red-300 border-red-700/50',
  github: 'bg-slate-800 text-slate-300 border-slate-700',
  blog: 'bg-emerald-900/50 text-emerald-300 border-emerald-700/50',
};

export function Sources({ refs }: { refs: VendorRef[] }) {
  return (
    <section className="my-6 rounded-xl border border-slate-700 bg-slate-900/40 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Sources & Further Reading</p>
      <ul className="space-y-2">
        {refs.map((ref) => (
          <li key={ref.url} className="flex items-center gap-3">
            <span className={`shrink-0 rounded border px-2 py-0.5 text-xs font-medium ${typeCls[ref.type]}`}>
              {typeLabel[ref.type]}
            </span>
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-sky-300 hover:text-sky-200 hover:underline"
            >
              {ref.title}
              <ExternalLink className="h-3 w-3" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
