interface ThiranLogoProps {
  variant?: 'mark' | 'wordmark';
  className?: string;
}

export function ThiranLogo({ variant = 'wordmark', className }: ThiranLogoProps) {
  if (variant === 'mark') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 72" fill="none" className={className} aria-label="Thiran">
        <defs>
          <linearGradient id="thiran-mark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <rect x="6" y="8" width="48" height="8" rx="4" fill="url(#thiran-mark-grad)" />
        <rect x="26" y="8" width="8" height="40" rx="4" fill="url(#thiran-mark-grad)" />
        <circle cx="30" cy="56" r="4" fill="#38bdf8" opacity="0.9" />
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 72" fill="none" className={className} aria-label="Thiran">
      <defs>
        <linearGradient id="thiran-word-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="thiran-dot-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>
      <rect x="6" y="8" width="48" height="8" rx="4" fill="url(#thiran-word-grad)" />
      <rect x="26" y="8" width="8" height="40" rx="4" fill="url(#thiran-word-grad)" />
      <circle cx="30" cy="56" r="4" fill="url(#thiran-dot-grad)" opacity="0.9" />
      <text x="70" y="36" fontFamily="Outfit, sans-serif" fontWeight="800" fontSize="30" fill="#f8fafc" letterSpacing="-0.5">Thiran</text>
      <text x="71" y="58" fontFamily="Noto Serif Tamil, serif" fontWeight="400" fontSize="15" fill="#38bdf8" opacity="0.8" letterSpacing="0.05em">திறன்</text>
    </svg>
  );
}
