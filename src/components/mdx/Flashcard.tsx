'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export function Flashcard({ front, back }: { front: string; back: string }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped((f) => !f)}
      className="my-4 cursor-pointer rounded-xl border border-slate-700 bg-slate-900/60 p-6 transition hover:border-sky-600"
      role="button"
      aria-label="Flashcard — click to flip"
    >
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {flipped ? 'Answer' : 'Question'} — click to flip
      </p>
      <p className="text-sm text-slate-100">{flipped ? back : front}</p>
      <RotateCcw className="mt-3 h-4 w-4 text-slate-500" />
    </div>
  );
}
