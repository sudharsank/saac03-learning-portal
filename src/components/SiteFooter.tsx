import Link from 'next/link';
import { ThiranLogo } from '@/components/ThiranLogo';

interface SiteFooterProps {
  portalName?: string;
}

export function SiteFooter({ portalName = 'Learning Portal' }: SiteFooterProps) {
  return (
    <footer className="mt-12 border-t border-slate-800/80 bg-slate-950/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} {portalName}</p>
        <Link
          href="https://thiran.cloud"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 opacity-60 transition hover:opacity-100"
        >
          <span className="text-xs text-slate-500">Built by</span>
          <ThiranLogo variant="wordmark" className="h-4 w-auto" />
        </Link>
      </div>
    </footer>
  );
}
