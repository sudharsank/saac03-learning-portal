'use client';

import { useEffect, useRef } from 'react';

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, theme: 'dark' });
      mermaid.render('mermaid-' + Math.random().toString(36).slice(2), chart).then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg;
      });
    });
  }, [chart]);

  return <div ref={ref} className="my-6 overflow-auto rounded-lg bg-slate-900/60 p-4" />;
}
