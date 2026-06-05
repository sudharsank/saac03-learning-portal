'use client';

import { useEffect, useState, useRef } from 'react';
import type { TocItem } from '@/lib/toc';

export function LessonToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-72px 0px -60% 0px', threshold: 0 },
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="hidden lg:block shrink-0 w-52 self-start sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        On this page
      </p>
      <nav className="space-y-0.5 pr-1">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(item.id);
              if (el) {
                window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
              }
              setActiveId(item.id);
            }}
            className={`flex items-start gap-1.5 rounded-md px-2 py-1.5 text-sm leading-snug transition-colors ${
              item.level === 3 ? 'pl-5 text-xs' : ''
            } ${
              activeId === item.id
                ? 'bg-sky-900/40 text-sky-300 font-medium'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            {item.level === 2 && (
              <span className="mt-0.5 shrink-0 text-slate-600">›</span>
            )}
            {item.level === 3 && (
              <span className="mt-0.5 shrink-0 text-slate-700">–</span>
            )}
            <span className="truncate">{item.text}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
