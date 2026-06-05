export type TocItem = { id: string; text: string; level: 2 | 3 };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  for (const line of markdown.split('\n')) {
    const m2 = line.match(/^## (.+)$/);
    const m3 = line.match(/^### (.+)$/);
    if (m2) {
      const text = m2[1].replace(/\*\*/g, '').replace(/`/g, '').trim();
      items.push({ id: slugify(text), text, level: 2 });
    } else if (m3) {
      const text = m3[1].replace(/\*\*/g, '').replace(/`/g, '').trim();
      items.push({ id: slugify(text), text, level: 3 });
    }
  }
  return items;
}
