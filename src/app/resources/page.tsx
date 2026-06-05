'use client';
import { useState } from 'react';

type ResourceType = 'official' | 'video' | 'blog' | 'free' | 'practice';
type Domain = 0 | 1 | 2 | 3 | 4;

const TYPE_LABEL: Record<ResourceType, string> = {
  official: 'AWS Official',
  video: 'Video Course',
  blog: 'Blog / Guide',
  free: 'Free Resource',
  practice: 'Practice Exams',
};

const TYPE_COLOR: Record<ResourceType, string> = {
  official: 'bg-amber-900/30 text-amber-300 border-amber-800/40',
  video: 'bg-violet-900/30 text-violet-300 border-violet-800/40',
  blog: 'bg-sky-900/30 text-sky-300 border-sky-800/40',
  free: 'bg-emerald-900/30 text-emerald-300 border-emerald-800/40',
  practice: 'bg-rose-900/30 text-rose-300 border-rose-800/40',
};

type Resource = {
  title: string;
  url: string;
  desc: string;
  type: ResourceType;
  domain: Domain;
};

const resources: Resource[] = [
  // Cross-domain
  { title: 'AWS SAA-C03 Exam Guide (Official)', url: 'https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf', desc: 'Official AWS exam guide with domain weights, task statements, and in-scope services list.', type: 'official', domain: 0 },
  { title: 'AWS Documentation Home', url: 'https://docs.aws.amazon.com/', desc: 'Official AWS service documentation — authoritative reference for all SAA-C03 services.', type: 'official', domain: 0 },
  { title: 'AWS Well-Architected Framework', url: 'https://aws.amazon.com/architecture/well-architected/', desc: 'Five pillars: operational excellence, security, reliability, performance, cost. Exam scenarios align to these pillars.', type: 'official', domain: 0 },
  { title: 'Stephane Maarek — Ultimate AWS SAA-C03 (Udemy)', url: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/', desc: '55+ hours, 220k+ students. The most popular SAA-C03 course. Covers every in-scope service with hands-on labs.', type: 'video', domain: 0 },
  { title: 'Adrian Cantrill — SAA-C03 Course', url: 'https://learn.cantrill.io/p/aws-certified-solutions-architect-associate', desc: 'Deep-dive visual learning. Excellent for understanding architecture patterns, not just memorising facts.', type: 'video', domain: 0 },
  { title: 'Tutorials Dojo Practice Exams (Neal Davis)', url: 'https://tutorialsdojo.com/courses/aws-certified-solutions-architect-associate-practice-exams/', desc: '500+ SAA-C03 practice questions with detailed explanations. The best practice exam resource available.', type: 'practice', domain: 0 },
  { title: 'freeCodeCamp — 10-Hour SAA-C03 Course (YouTube)', url: 'https://www.youtube.com/watch?v=c3Cn4xYfxJY', desc: 'Free full-length course on YouTube covering all four exam domains. Great for a first pass.', type: 'free', domain: 0 },
  { title: 'kananinirav AWS SAA Study Notes (GitHub)', url: 'https://github.com/kananinirav/AWS-Certified-Solutions-Architect-Associate-Notes', desc: 'Community markdown notes covering all SAA-C03 topics. Quick review reference.', type: 'free', domain: 0 },

  // Domain 1 — Secure Architectures
  { title: 'AWS IAM User Guide', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/', desc: 'Official IAM documentation: users, groups, roles, policies, permission boundaries, and SCP.', type: 'official', domain: 1 },
  { title: 'AWS Security Best Practices', url: 'https://aws.amazon.com/architecture/security-identity-compliance/', desc: 'Reference architectures for secure workloads including VPC design and identity controls.', type: 'official', domain: 1 },
  { title: 'AWS KMS Developer Guide', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/', desc: 'Customer-managed keys, key policies, data key caching — all tested in Domain 1.', type: 'official', domain: 1 },

  // Domain 2 — Resilient Architectures
  { title: 'AWS SQS Developer Guide', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/', desc: 'Standard vs FIFO queues, visibility timeout, dead-letter queues — core to loosely coupled architectures.', type: 'official', domain: 2 },
  { title: 'Route 53 Developer Guide', url: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/', desc: 'Routing policies (simple, weighted, failover, latency, geolocation, multi-value) — highly tested.', type: 'official', domain: 2 },
  { title: 'AWS Disaster Recovery Whitepaper', url: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html', desc: 'Backup/restore, pilot light, warm standby, multi-site — with RTO/RPO trade-offs.', type: 'official', domain: 2 },

  // Domain 3 — High-Performing Architectures
  { title: 'Amazon EC2 User Guide', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/', desc: 'Instance types, placement groups, Auto Scaling, and launch templates for compute optimization.', type: 'official', domain: 3 },
  { title: 'Amazon S3 User Guide', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/', desc: 'Storage classes, lifecycle policies, transfer acceleration, S3 Select — storage performance.', type: 'official', domain: 3 },
  { title: 'Amazon DynamoDB Developer Guide', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/', desc: 'Partition keys, GSI/LSI, DAX caching, on-demand vs provisioned throughput — frequently tested.', type: 'official', domain: 3 },
  { title: 'CloudFront Developer Guide', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/', desc: 'CDN edge caching, origin policies, Lambda@Edge, signed URLs — network performance topics.', type: 'official', domain: 3 },

  // Domain 4 — Cost-Optimized Architectures
  { title: 'AWS Cost Optimization Pillar', url: 'https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/', desc: 'Well-Architected cost pillar: right-sizing, reserved capacity, data transfer, and cost-aware architecture.', type: 'official', domain: 4 },
  { title: 'EC2 Pricing (Spot, Reserved, Savings Plans)', url: 'https://aws.amazon.com/ec2/pricing/', desc: 'Official EC2 pricing. On-demand vs reserved vs spot vs savings plans is directly tested.', type: 'official', domain: 4 },
  { title: 'AWS Cost Explorer User Guide', url: 'https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html', desc: 'Cost visibility and optimization recommendations — included in cost-optimized architecture questions.', type: 'official', domain: 4 },
];

const DOMAIN_LABELS: Record<Domain, string> = {
  0: 'All Domains',
  1: 'Domain 1 — Secure Architectures',
  2: 'Domain 2 — Resilient Architectures',
  3: 'Domain 3 — High-Performing Architectures',
  4: 'Domain 4 — Cost-Optimized Architectures',
};

export default function ResourcesPage() {
  const [activeDomain, setActiveDomain] = useState<Domain>(0);
  const [activeType, setActiveType] = useState<ResourceType | 'all'>('all');

  const filtered = resources.filter(
    (r) =>
      (activeDomain === 0 || r.domain === activeDomain) &&
      (activeType === 'all' || r.type === activeType)
  );

  return (
    <div className="space-y-8 pb-16">
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-3xl font-bold tracking-tight">Study Resources</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Curated AWS and community resources for SAA-C03 — official docs, top courses, and free guides.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {([0, 1, 2, 3, 4] as Domain[]).map((d) => (
          <button
            key={d}
            onClick={() => setActiveDomain(d)}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition ${
              activeDomain === d
                ? 'border-amber-500 bg-amber-900/30 text-amber-200'
                : 'border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            {DOMAIN_LABELS[d]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveType('all')}
          className={`rounded-full px-3 py-1 text-xs font-medium border transition ${
            activeType === 'all'
              ? 'border-sky-500 bg-sky-900/30 text-sky-200'
              : 'border-slate-700 text-slate-400 hover:border-slate-500'
          }`}
        >
          All Types
        </button>
        {(Object.keys(TYPE_LABEL) as ResourceType[]).map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition ${
              activeType === t
                ? 'border-sky-500 bg-sky-900/30 text-sky-200'
                : 'border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            {TYPE_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((r) => (
          <a
            key={r.url}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-slate-700 bg-slate-900/40 p-5 hover:border-slate-500 transition space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold text-slate-100 leading-snug">{r.title}</p>
              <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${TYPE_COLOR[r.type]}`}>
                {TYPE_LABEL[r.type]}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{r.desc}</p>
            <p className="text-xs text-slate-600 truncate">{r.url}</p>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-slate-500 py-12">No resources match the selected filters.</p>
      )}
    </div>
  );
}
