import { notFound } from 'next/navigation';
import { getMockQuestions } from '@/lib/exam';
import { MockRunner } from '@/components/MockRunner';
import Link from 'next/link';

const MOCK_IDS = ['mock-1', 'mock-2', 'mock-3'];
const MOCK_TITLES: Record<string, string> = {
  'mock-1': 'Mock Exam 1',
  'mock-2': 'Mock Exam 2',
  'mock-3': 'Mock Exam 3',
};

export async function generateStaticParams() {
  return MOCK_IDS.map((mockId) => ({ mockId }));
}

export default async function MockExamPage({
  params,
}: {
  params: Promise<{ mockId: string }>;
}) {
  const { mockId } = await params;
  if (!MOCK_IDS.includes(mockId)) return notFound();

  const questions = getMockQuestions(mockId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">SAA-C03 Mock</p>
          <h1 className="mt-1 text-2xl font-bold">{MOCK_TITLES[mockId]}</h1>
        </div>
        <Link href="/practice/mock" className="text-sm text-sky-400 hover:underline">← All Mocks</Link>
      </div>

      {questions.length === 0 ? (
        <div className="card p-6 text-center text-slate-400">
          <p>Mock questions not found. Check that <code>content/practice/mocks/{mockId}.json</code> exists.</p>
        </div>
      ) : (
        <MockRunner questions={questions} mockId={mockId} />
      )}
    </div>
  );
}
