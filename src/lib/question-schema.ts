import { z } from 'zod';

export const QuestionSchema = z.object({
  id: z.string().min(1),
  objective: z.string().regex(/^\d+\.\d+$/, 'objective must be like "1.3"'),
  domain: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  type: z.enum(['single', 'multi', 'scenario-step']),
  stem: z.string().min(10),
  options: z.array(z.object({ id: z.string(), text: z.string().min(1) })).min(3).max(5),
  correct: z.array(z.string()).min(1),
  rationale: z.string().min(20),
  sourceUrl: z.string().url(),
  tags: z.array(z.string()).default([]),
});

export const QuestionBankSchema = z.array(QuestionSchema);

export type Question = z.infer<typeof QuestionSchema>;
