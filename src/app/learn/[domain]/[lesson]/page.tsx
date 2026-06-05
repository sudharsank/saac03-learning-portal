import { notFound } from 'next/navigation';
import Link from 'next/link';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import {
  getLessonBySlug,
  getLessonsByDomain,
  domainSlugToNumber,
  getDomainFolders,
  DOMAIN_LABELS,
} from '@/lib/content';
import type { Domain } from '@/lib/content-types';
import { Sources } from '@/components/mdx/Sources';
import { Concept } from '@/components/mdx/Concept';
import { DeepDive } from '@/components/mdx/DeepDive';
import { Lab } from '@/components/mdx/Lab';
import { ExamAngle } from '@/components/mdx/ExamAngle';
import { ExamCallout } from '@/components/mdx/ExamCallout';
import { KeyTerm } from '@/components/mdx/KeyTerm';
import { Flashcard } from '@/components/mdx/Flashcard';
import { Mermaid } from '@/components/mdx/Mermaid';
import { Clock, BookOpen } from 'lucide-react';
import { LessonCompleteButton } from '@/components/LessonCompleteButton';
import { LessonTracker } from '@/components/LessonTracker';
import { QuizBlock } from '@/components/mdx/QuizBlock';
import { getLessonQuizQuestions } from '@/lib/exam';
import { LessonToc } from '@/components/LessonToc';
import { extractToc } from '@/lib/toc';

export async function generateStaticParams() {
  const domainFolders = getDomainFolders();
  const params: { domain: string; lesson: string }[] = [];
  for (const [domainNum, domainSlug] of Object.entries(domainFolders)) {
    const lessons = getLessonsByDomain(parseInt(domainNum) as Domain);
    for (const lesson of lessons) {
      params.push({ domain: domainSlug, lesson: lesson.slug });
    }
  }
  return params;
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ domain: string; lesson: string }>;
}) {
  const { domain: domainSlug, lesson: lessonSlug } = await params;
  const domainNumber = domainSlugToNumber(domainSlug);
  if (!domainNumber) return notFound();

  const lesson = getLessonBySlug(domainSlug, lessonSlug);
  if (!lesson) return notFound();

  const mdx = await compileMDX({
    source: lesson.body,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
    components: {
      Concept,
      DeepDive,
      Lab,
      ExamAngle,
      ExamCallout,
      KeyTerm,
      Flashcard,
      Mermaid,
    },
  });

  // Get prev/next for navigation
  const quizQuestions = getLessonQuizQuestions(lessonSlug);
  const tocItems = extractToc(lesson.body);
  const allLessons = getLessonsByDomain(domainNumber);
  const idx = allLessons.findIndex((l) => l.slug === lessonSlug);
  const prev = idx > 0 ? allLessons[idx - 1] : null;
  const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/learn" className="hover:text-sky-300">Learn</Link>
        <span>/</span>
        <Link href={`/learn/${domainSlug}`} className="hover:text-sky-300">{DOMAIN_LABELS[domainNumber]}</Link>
        <span>/</span>
        <span className="text-slate-300">{lesson.title}</span>
      </nav>

      {/* Header */}
      <div className="card p-6">
        <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span className="font-mono">Objective {lesson.objective}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {lesson.estMinutes} min
          </span>
          <span className={`rounded-full px-2 py-0.5 font-medium ${lesson.weight === 'high' ? 'bg-rose-900/60 text-rose-300' : lesson.weight === 'medium' ? 'bg-amber-900/60 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
            {lesson.weight} priority
          </span>
          {lesson.tags?.map((tag: string) => (
            <span key={tag} className="rounded-full bg-slate-800 px-2 py-0.5 text-slate-400">{tag}</span>
          ))}
        </div>
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        {lesson.summary && <p className="mt-2 text-slate-300">{lesson.summary}</p>}
        {lesson.prerequisites && lesson.prerequisites.length > 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <BookOpen className="h-3 w-3" />
            <span>Prerequisites: {lesson.prerequisites.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Lesson Body with TOC sidebar */}
      <div className="flex items-start gap-8">
        <LessonToc items={tocItems} />
        <article className="prose prose-invert max-w-none min-w-0 flex-1">
          {mdx.content}
        </article>
      </div>

      {/* Sources */}
      {lesson.vendorRefs && lesson.vendorRefs.length > 0 && (
        <Sources refs={lesson.vendorRefs} />
      )}

      {/* Lesson quiz */}
      {quizQuestions.length > 0 && <QuizBlock questions={quizQuestions} />}

      {/* Lesson Tracker (client-side, tracks open) */}
      <LessonTracker lessonSlug={lessonSlug} />

      {/* Mark complete */}
      <div className="border-t border-slate-800 pt-6">
        <LessonCompleteButton lessonSlug={lessonSlug} />
      </div>

      {/* Prev / Next */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-6">
        {prev ? (
          <Link href={`/learn/${domainSlug}/${prev.slug}`} className="group flex items-center gap-2 text-sm text-slate-400 hover:text-sky-300">
            ← <span className="group-hover:underline">{prev.title}</span>
          </Link>
        ) : (
          <Link href={`/learn/${domainSlug}`} className="text-sm text-slate-400 hover:text-sky-300">
            ← Domain Overview
          </Link>
        )}
        {next ? (
          <Link href={`/learn/${domainSlug}/${next.slug}`} className="group flex items-center gap-2 text-sm text-slate-400 hover:text-sky-300">
            <span className="group-hover:underline">{next.title}</span> →
          </Link>
        ) : (
          <Link href="/practice" className="text-sm text-sky-400 hover:underline">
            Practice This Domain →
          </Link>
        )}
      </div>
    </div>
  );
}
