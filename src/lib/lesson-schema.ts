import { z } from 'zod';

const VendorRefSchema = z.object({
  type: z.enum(['ms-learn', 'mvp', 'video', 'github', 'blog']),
  title: z.string().min(1),
  url: z.string().url(),
});

export const LessonFrontmatterSchema = z.object({
  title: z.string().min(1),
  domain: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  objective: z.string().regex(/^\d+\.\d+$/, 'objective must be like "1.3"'),
  weight: z.enum(['low', 'medium', 'high']),
  estMinutes: z.number().int().positive(),
  prerequisites: z.array(z.string()).default([]),
  vendorRefs: z.array(VendorRefSchema).min(1, 'at least one vendor reference required'),
  lastReviewed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'lastReviewed must be YYYY-MM-DD'),
  tags: z.array(z.string()).default([]),
  summary: z.string().optional(),
});

export type LessonFrontmatter = z.infer<typeof LessonFrontmatterSchema>;
export type VendorRef = z.infer<typeof VendorRefSchema>;
