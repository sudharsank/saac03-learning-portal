import fs from 'node:fs';
import path from 'node:path';
import { QuestionBankSchema } from './question-schema';
import type { Question } from './question-schema';

const practiceRoot = path.join(process.cwd(), 'content/practice');

function loadJsonBank(filePath: string): Question[] {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  const result = QuestionBankSchema.safeParse(parsed);
  if (!result.success) {
    console.warn(`Question bank validation failed for ${filePath}:`, result.error.issues);
    return [];
  }
  return result.data;
}

export function getDrillQuestions(domainSlug: string): Question[] {
  const slug = domainSlug.replace('domain-', '');
  const filePath = path.join(practiceRoot, 'drills', `${slug}.json`);
  return loadJsonBank(filePath);
}

export function getMockQuestions(mockId: string): Question[] {
  const filePath = path.join(practiceRoot, 'mocks', `${mockId}.json`);
  return loadJsonBank(filePath);
}

export function getLessonQuizQuestions(lessonSlug: string): Question[] {
  const filePath = path.join(practiceRoot, 'quizzes', `${lessonSlug}.json`);
  return loadJsonBank(filePath);
}

export function getAllQuestions(): Question[] {
  const all: Question[] = [];
  const seen = new Set<string>();

  const addQuestions = (questions: Question[]) => {
    for (const q of questions) {
      if (!seen.has(q.id)) {
        seen.add(q.id);
        all.push(q);
      }
    }
  };

  // Load all quiz banks
  const quizDir = path.join(practiceRoot, 'quizzes');
  if (fs.existsSync(quizDir)) {
    const quizFiles = fs.readdirSync(quizDir).filter((f) => f.endsWith('.json'));
    for (const file of quizFiles) {
      addQuestions(loadJsonBank(path.join(quizDir, file)));
    }
  }

  // Load all drill banks
  const drillDir = path.join(practiceRoot, 'drills');
  if (fs.existsSync(drillDir)) {
    const drillFiles = fs.readdirSync(drillDir).filter((f) => f.endsWith('.json'));
    for (const file of drillFiles) {
      addQuestions(loadJsonBank(path.join(drillDir, file)));
    }
  }

  // Load all mock banks
  for (const mockId of ['mock-1', 'mock-2', 'mock-3', 'mock-4', 'mock-5', 'mock-6']) {
    addQuestions(loadJsonBank(path.join(practiceRoot, 'mocks', `${mockId}.json`)));
  }

  return all;
}

export type { Question };
