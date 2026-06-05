import type { LessonFrontmatter } from './lesson-schema';

export type Lesson = LessonFrontmatter & {
  slug: string;
  domainSlug: string;
  body: string;
};

export type Domain = 1 | 2 | 3 | 4;
export const DOMAINS: readonly Domain[] = [1, 2, 3, 4] as const;

export const DOMAIN_LABELS: Record<Domain, string> = {
  1: 'Design Secure Architectures',
  2: 'Design Resilient Architectures',
  3: 'Design High-Performing Architectures',
  4: 'Design Cost-Optimized Architectures',
};

export const DOMAIN_SLUGS: Record<Domain, string> = {
  1: 'domain-1-design-secure-architectures',
  2: 'domain-2-design-resilient-architectures',
  3: 'domain-3-design-high-performing-architectures',
  4: 'domain-4-design-cost-optimized-architectures',
};

export const DOMAIN_WEIGHTS: Record<Domain, number> = {
  1: 30,
  2: 26,
  3: 24,
  4: 20,
};
