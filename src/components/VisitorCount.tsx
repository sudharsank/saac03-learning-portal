'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users } from 'lucide-react';

export function VisitorCount({ portalId }: { portalId: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .rpc('increment_visit', { portal_id: portalId })
      .then(({ data }) => {
        if (data != null) setCount(data as number);
      });
  }, [portalId]);

  if (count == null) return null;

  return (
    <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-400">
      <Users size={14} />
      <span>{count.toLocaleString()} portal visits</span>
    </p>
  );
}
