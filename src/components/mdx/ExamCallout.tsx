import { AlertTriangle, Star, Brain } from 'lucide-react';

type CalloutType = 'trap' | 'tip' | 'memorize';

const config: Record<CalloutType, { Icon: React.ElementType; label: string; cls: string }> = {
  trap: { Icon: AlertTriangle, label: 'Exam Trap', cls: 'border-rose-700/60 bg-rose-950/30 text-rose-300' },
  tip: { Icon: Star, label: 'Exam Tip', cls: 'border-sky-700/60 bg-sky-950/30 text-sky-300' },
  memorize: { Icon: Brain, label: 'Must Memorize', cls: 'border-amber-700/60 bg-amber-950/30 text-amber-300' },
};

export function ExamCallout({ type, children }: { type: CalloutType; children: React.ReactNode }) {
  const { Icon, label, cls } = config[type];
  return (
    <div className={`my-4 flex gap-3 rounded-lg border p-4 ${cls}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-wider">{label}</p>
        <div className="text-sm text-slate-200">{children}</div>
      </div>
    </div>
  );
}
