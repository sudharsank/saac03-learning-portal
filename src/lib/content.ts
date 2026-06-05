import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { LessonFrontmatter } from './lesson-schema';
import type { Lesson, Domain } from './content-types';
import { DOMAIN_LABELS, DOMAIN_SLUGS, DOMAINS } from './content-types';
export type { Lesson, Domain } from './content-types';
export { DOMAIN_LABELS, DOMAIN_SLUGS, DOMAINS } from './content-types';

const contentRoot = path.join(process.cwd(), 'content');

const DOMAIN_FOLDERS: Record<Domain, string> = DOMAIN_SLUGS;

// Domain exam weight percentages — updated during portal generation via SKILL.md
// __DOMAIN_WEIGHTS_BLOCK__
export const DOMAIN_WEIGHTS: Record<Domain, string> = Object.fromEntries(
  DOMAINS.map((d) => [d, 'see exam guide'])
) as Record<Domain, string>;

function readLesson(domainSlug: string, file: string): Lesson | null {
  if (file.startsWith('_') || !file.endsWith('.mdx')) return null;
  const filePath = path.join(contentRoot, domainSlug, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  return {
    slug: file.replace(/\.mdx$/, ''),
    domainSlug,
    body: content,
    ...(data as LessonFrontmatter),
  };
}

export function getLessonsByDomain(domain: Domain): Lesson[] {
  const folder = DOMAIN_FOLDERS[domain];
  const dir = path.join(contentRoot, folder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => !f.startsWith('_') && f.endsWith('.mdx'))
    .sort()
    .map((f) => readLesson(folder, f))
    .filter((l): l is Lesson => l !== null);
}

export function getAllLessons(): Lesson[] {
  return DOMAINS.flatMap(getLessonsByDomain);
}

export function getLessonBySlug(domainSlug: string, slug: string): Lesson | null {
  const filePath = path.join(contentRoot, domainSlug, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return readLesson(domainSlug, `${slug}.mdx`);
}

export function getDomainIndex(domain: Domain): { title: string; body: string } | null {
  const folder = DOMAIN_FOLDERS[domain];
  const filePath = path.join(contentRoot, folder, '_index.mdx');
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  return { title: data.title ?? DOMAIN_LABELS[domain], body: content };
}

export function domainSlugToNumber(slug: string): Domain | null {
  const entry = Object.entries(DOMAIN_FOLDERS).find(([, v]) => v === slug);
  return entry ? (parseInt(entry[0]) as Domain) : null;
}

export function getDomainFolders() {
  return DOMAIN_FOLDERS;
}

// Legacy helpers kept for resources page
export type MdxDoc = {
  slug: string;
  title: string;
  summary: string;
  category?: string;
  tags?: string[];
  body: string;
};

export function getDocs(folder: string): MdxDoc[] {
  const dir = path.join(contentRoot, folder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.mdx$/, ''),
        title: data.title ?? file,
        summary: data.summary ?? '',
        category: data.category,
        tags: data.tags ?? [],
        body: content,
      };
    });
}
