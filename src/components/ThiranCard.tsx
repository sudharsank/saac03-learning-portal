import Link from 'next/link';
import { ThiranLogo } from '@/components/ThiranLogo';

export function ThiranCard() {
  return (
    <Link
      href="https://thiran.cloud"
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="flex items-center gap-4 rounded-xl border border-blue-800 bg-gradient-to-br from-[#0c1a2e] to-[#0d1b3e] px-5 py-4 transition hover:border-blue-600">
        <ThiranLogo variant="wordmark" className="h-8 w-auto flex-shrink-0" />
        <div>
          <p className="text-xs uppercase tracking-wide text-blue-300">This portal is part of</p>
          <p className="mt-0.5 text-sm text-slate-300">SharePoint &amp; M365 tools · SPFx webparts</p>
          <p className="mt-0.5 text-xs text-sky-400">thiran.cloud →</p>
        </div>
      </div>
    </Link>
  );
}
