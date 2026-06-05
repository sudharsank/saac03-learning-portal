import { notFound } from 'next/navigation';
import Link from 'next/link';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import {
  getDomainIndex,
  getLessonsByDomain,
  domainSlugToNumber,
  getDomainFolders,
  DOMAIN_LABELS,
  DOMAIN_WEIGHTS,
} from '@/lib/content';
import { Clock, ChevronRight } from 'lucide-react';

export async function generateStaticParams() {
  return Object.values(getDomainFolders()).map((slug) => ({ domain: slug }));
}

export default async function DomainPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain: domainSlug } = await params;
  const domainNumber = domainSlugToNumber(domainSlug);
  if (!domainNumber) return notFound();

  const index = getDomainIndex(domainNumber);
  const lessons = getLessonsByDomain(domainNumber);

  let mdxContent = null;
  if (index?.body) {
    const mdx = await compileMDX({
      source: index.body,
      options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
    });
    mdxContent = mdx.content;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Domain {domainNumber} · {DOMAIN_WEIGHTS[domainNumber]}
        </p>
        <h1 className="mt-1 text-3xl font-bold">{DOMAIN_LABELS[domainNumber]}</h1>
      </div>

      {mdxContent && (
        <article className="card prose prose-invert max-w-none p-6">{mdxContent}</article>
      )}

      <div>
        <h2 className="mb-3 text-lg font-semibold">Lessons</h2>
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <Link
              key={lesson.slug}
              href={`/learn/${domainSlug}/${lesson.slug}`}
              className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-3 hover:border-sky-500 transition"
            >
              <div>
                <span className="mr-2 font-mono text-xs text-slate-500">{lesson.objective}</span>
                <span className="text-sm font-medium">{lesson.title}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="h-3 w-3" />
                <span className="text-xs">{lesson.estMinutes}m</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/learn" className="text-sm text-sky-400 hover:underline">← All Domains</Link>
        <Link href="/practice" className="text-sm text-sky-400 hover:underline">Practice This Domain →</Link>
      </div>
    </div>
  );
}
