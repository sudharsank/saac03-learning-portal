export const metadata = {
  title: 'Exam Strategy | SAA-C03',
  description: 'How to approach the AWS SAA-C03 exam — format, time management, keyword decoder, and domain weights.',
};

export default function ExamStrategyPage() {
  return (
    <div className="space-y-10 pb-16">
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-3xl font-bold tracking-tight">SAA-C03 Exam Strategy</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Know the format, decode the keywords, and invest time where the marks are.
        </p>
      </div>

      {/* Exam format */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-amber-300">Exam Format</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Questions', value: '65 total', sub: '50 scored + 15 unscored' },
            { label: 'Time Limit', value: '130 minutes', sub: '~2 min per question' },
            { label: 'Passing Score', value: '720 / 1000', sub: 'Scaled scoring' },
            { label: 'Exam Cost', value: '~$300 USD', sub: 'Varies by region' },
            { label: 'Delivery', value: 'Pearson VUE or PSI', sub: 'Testing centre or online proctored' },
            { label: 'Validity', value: '3 years', sub: 'Recertification required' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="rounded-lg border border-slate-700 bg-slate-900/40 p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
              <p className="mt-1 text-xl font-semibold text-slate-100">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Time management */}
      <div className="card p-6 space-y-3">
        <h2 className="text-lg font-bold text-sky-300">Time Management</h2>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex gap-3"><span className="text-sky-400 font-bold shrink-0">→</span>Target 90 seconds per question, leaving 20 minutes for review.</li>
          <li className="flex gap-3"><span className="text-sky-400 font-bold shrink-0">→</span>Flag complex scenario questions immediately — don&apos;t get stuck. Come back with fresh eyes.</li>
          <li className="flex gap-3"><span className="text-sky-400 font-bold shrink-0">→</span>Scenario questions are long. Read the last sentence first — it tells you what to solve.</li>
          <li className="flex gap-3"><span className="text-sky-400 font-bold shrink-0">→</span>Eliminate obviously wrong answers before evaluating remaining options.</li>
          <li className="flex gap-3"><span className="text-sky-400 font-bold shrink-0">→</span>Never leave a question blank — there is no penalty for guessing.</li>
        </ul>
      </div>

      {/* Keyword decoder */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-emerald-300">Keyword Decoder</h2>
        <p className="text-sm text-slate-400">These phrases in exam questions map to specific services or patterns:</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { phrase: '"most cost-effective"', action: 'Spot Instances, Reserved Instances, S3 Intelligent-Tiering, or Savings Plans' },
            { phrase: '"minimal operational overhead"', action: 'Managed services: Aurora Serverless, DynamoDB, Lambda, ECS Fargate — avoid self-managed EC2' },
            { phrase: '"highly available" or "fault-tolerant"', action: 'Multi-AZ RDS, ALB, Auto Scaling, Route 53 failover, S3 (already multi-AZ by default)' },
            { phrase: '"decouple" or "loosely coupled"', action: 'SQS between tiers, SNS for fan-out, EventBridge for event-driven, Step Functions for workflows' },
            { phrase: '"global" or "lowest latency worldwide"', action: 'CloudFront CDN, Global Accelerator, Route 53 latency routing, S3 Transfer Acceleration' },
            { phrase: '"on-premises to AWS"', action: 'Site-to-Site VPN (quick), Direct Connect (dedicated, consistent), Storage Gateway, DataSync' },
            { phrase: '"encrypt existing unencrypted"', action: 'Take snapshot → copy with encryption → restore. Cannot encrypt in-place on existing EBS.' },
            { phrase: '"cross-account access"', action: 'IAM role with trust policy, Resource-based policy (S3 bucket policy), or AWS Organizations SCP' },
          ].map(({ phrase, action }) => (
            <div key={phrase} className="rounded-lg border border-slate-800 bg-slate-900/30 p-4 space-y-1">
              <p className="text-sm font-semibold text-amber-300">{phrase}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Domain weight strategy */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-violet-300">Domain Weight Strategy</h2>
        <p className="text-sm text-slate-400">Invest study time proportional to domain weight. Domain 1 + 2 = 56% of the exam.</p>
        <div className="space-y-3">
          {[
            { num: 1, name: 'Design Secure Architectures', pct: 30, color: 'bg-rose-500' },
            { num: 2, name: 'Design Resilient Architectures', pct: 26, color: 'bg-amber-500' },
            { num: 3, name: 'Design High-Performing Architectures', pct: 24, color: 'bg-sky-500' },
            { num: 4, name: 'Design Cost-Optimized Architectures', pct: 20, color: 'bg-emerald-500' },
          ].map(({ num, name, pct, color }) => (
            <div key={num} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">D{num} — {name}</span>
                <span className="font-semibold text-slate-200">{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800">
                <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AWS CLI tips */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-rose-300">AWS CLI Quick Reference</h2>
        <p className="text-sm text-slate-400">Key CLI patterns tested in scenario questions (you won&apos;t type them, but you must recognise correct syntax).</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 pr-4 text-slate-400 font-medium">Service</th>
                <th className="text-left py-2 text-slate-400 font-medium">Key Command / Pattern</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[
                { svc: 'EC2', cmd: 'aws ec2 run-instances --image-id ami-xxx --instance-type t3.micro --key-name mykey' },
                { svc: 'S3', cmd: 'aws s3 cp file.txt s3://my-bucket/ --sse aws:kms --sse-kms-key-id arn:aws:kms:...' },
                { svc: 'IAM Role', cmd: 'aws iam create-role --role-name MyRole --assume-role-policy-document file://trust.json' },
                { svc: 'Auto Scaling', cmd: 'aws autoscaling create-auto-scaling-group --min-size 2 --max-size 10 --desired-capacity 4' },
                { svc: 'RDS', cmd: 'aws rds create-db-instance --db-instance-identifier mydb --multi-az --db-instance-class db.r5.large' },
                { svc: 'CloudFormation', cmd: 'aws cloudformation create-stack --stack-name MyStack --template-body file://template.yaml' },
              ].map(({ svc, cmd }) => (
                <tr key={svc}>
                  <td className="py-2.5 pr-4 text-amber-300 font-medium whitespace-nowrap">{svc}</td>
                  <td className="py-2.5 font-mono text-xs text-slate-300 break-all">{cmd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
