export const metadata = {
  title: 'Cheat Sheet | SAA-C03',
  description: 'Quick-reference decision tables and CLI commands for the AWS SAA-C03 exam.',
};

export default function CheatsheetPage() {
  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-3xl font-bold tracking-tight">SAA-C03 Cheat Sheet</h1>
        <p className="text-slate-400 max-w-xl mx-auto">Decision tables and quick-reference guides for exam day.</p>
      </div>

      {/* Anchor nav */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          ['#compute', 'Compute'],
          ['#storage', 'Storage'],
          ['#s3-tiers', 'S3 Tiers'],
          ['#database', 'Database'],
          ['#iam', 'IAM / Security'],
          ['#messaging', 'Messaging'],
          ['#cli', 'CLI'],
          ['#traps', 'Exam Traps'],
        ].map(([href, label]) => (
          <a key={href} href={href} className="rounded-full border border-slate-700 px-3 py-1 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition">
            {label}
          </a>
        ))}
      </div>

      {/* Compute */}
      <div id="compute" className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-sky-300">Compute Decision Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 pr-4 text-slate-400 font-medium">Workload</th>
                <th className="text-left py-2 pr-4 text-slate-400 font-medium">Service</th>
                <th className="text-left py-2 text-slate-400 font-medium">Key Differentiator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[
                { w: 'Stateless, event-driven, <15 min', s: 'AWS Lambda', k: 'No servers, scales to zero, pay per invocation' },
                { w: 'Containerised microservices, managed', s: 'ECS Fargate', k: 'Serverless containers, no EC2 to manage' },
                { w: 'Kubernetes workloads', s: 'EKS', k: 'Managed Kubernetes control plane' },
                { w: 'Legacy app, full OS control', s: 'EC2', k: 'Choose instance family; you manage patching' },
                { w: 'Batch processing, fault-tolerant', s: 'EC2 Spot Instances', k: 'Up to 90% cheaper, can be interrupted' },
                { w: 'Predictable baseline + spikes', s: 'Reserved + On-Demand', k: 'Reserved for baseline, On-Demand for peaks' },
                { w: 'Virtual desktop / streaming', s: 'AppStream 2.0 / WorkSpaces', k: 'No local install, per-session or per-user billing' },
              ].map(({ w, s, k }) => (
                <tr key={s}>
                  <td className="py-2.5 pr-4 text-slate-300">{w}</td>
                  <td className="py-2.5 pr-4 text-amber-300 font-medium whitespace-nowrap">{s}</td>
                  <td className="py-2.5 text-slate-400 text-xs">{k}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Storage */}
      <div id="storage" className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-violet-300">Storage Decision Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 pr-4 text-slate-400 font-medium">Use Case</th>
                <th className="text-left py-2 pr-4 text-slate-400 font-medium">Service</th>
                <th className="text-left py-2 text-slate-400 font-medium">Key Constraint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[
                { u: 'Object storage, static assets, backups', s: 'Amazon S3', k: 'Max 5 TB/object; eventual consistency for overwrite/delete' },
                { u: 'Block storage for EC2 OS/data disk', s: 'Amazon EBS', k: 'AZ-scoped; attach to one EC2 (multi-attach gp3/io2 only)' },
                { u: 'Shared file system for Linux EC2', s: 'Amazon EFS', k: 'NFS, regional, auto-scales, POSIX permissions' },
                { u: 'Shared file system for Windows EC2', s: 'Amazon FSx for Windows', k: 'SMB, Active Directory integration' },
                { u: 'High-performance HPC file system', s: 'Amazon FSx for Lustre', k: 'Integrates with S3; sub-ms latency' },
                { u: 'Archive, infrequent access, compliance', s: 'S3 Glacier', k: 'Retrieval takes minutes to hours; cheapest' },
                { u: 'Hybrid storage, on-prem NFS/SMB to S3', s: 'Storage Gateway', k: 'File, Volume, or Tape gateway modes' },
              ].map(({ u, s, k }) => (
                <tr key={s}>
                  <td className="py-2.5 pr-4 text-slate-300">{u}</td>
                  <td className="py-2.5 pr-4 text-violet-300 font-medium whitespace-nowrap">{s}</td>
                  <td className="py-2.5 text-slate-400 text-xs">{k}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* S3 Storage Classes */}
      <div id="s3-tiers" className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-emerald-300">S3 Storage Classes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 pr-4 text-slate-400 font-medium">Class</th>
                <th className="text-left py-2 pr-4 text-slate-400 font-medium">Access Pattern</th>
                <th className="text-left py-2 pr-4 text-slate-400 font-medium">Min Duration</th>
                <th className="text-left py-2 text-slate-400 font-medium">Retrieval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[
                { c: 'S3 Standard', a: 'Frequent', d: 'None', r: 'Immediate' },
                { c: 'S3 Intelligent-Tiering', a: 'Unknown/changing', d: 'None', r: 'Immediate (monitoring fee)' },
                { c: 'S3 Standard-IA', a: 'Infrequent, rapid', d: '30 days', r: 'Immediate + retrieval fee' },
                { c: 'S3 One Zone-IA', a: 'Infrequent, one AZ OK', d: '30 days', r: 'Immediate + retrieval fee (single AZ)' },
                { c: 'S3 Glacier Instant', a: 'Archive, ms access', d: '90 days', r: 'Milliseconds' },
                { c: 'S3 Glacier Flexible', a: 'Archive, hours OK', d: '90 days', r: 'Minutes to 12 hours' },
                { c: 'S3 Glacier Deep Archive', a: 'Long-term archive', d: '180 days', r: '12–48 hours (cheapest)' },
              ].map(({ c, a, d, r }) => (
                <tr key={c}>
                  <td className="py-2.5 pr-4 text-emerald-300 font-medium whitespace-nowrap">{c}</td>
                  <td className="py-2.5 pr-4 text-slate-300 text-xs">{a}</td>
                  <td className="py-2.5 pr-4 text-slate-400 text-xs">{d}</td>
                  <td className="py-2.5 text-slate-400 text-xs">{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Database */}
      <div id="database" className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-amber-300">Database Decision Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 pr-4 text-slate-400 font-medium">Workload</th>
                <th className="text-left py-2 pr-4 text-slate-400 font-medium">Service</th>
                <th className="text-left py-2 text-slate-400 font-medium">Key Differentiator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[
                { w: 'Relational, OLTP, managed', s: 'Amazon RDS', k: 'Multi-AZ, Read Replicas, 6 engines (MySQL, Postgres, Oracle…)' },
                { w: 'MySQL/Postgres, high throughput', s: 'Amazon Aurora', k: '5× MySQL / 3× Postgres throughput; shared cluster storage' },
                { w: 'Variable or unknown workload', s: 'Aurora Serverless v2', k: 'Auto-scales ACUs; pay per second' },
                { w: 'NoSQL key-value / document, single-ms', s: 'Amazon DynamoDB', k: 'Serverless, DAX for caching, GSI for query flexibility' },
                { w: 'In-memory cache / session store', s: 'ElastiCache (Redis/Memcached)', k: 'Redis: persistence + pub/sub. Memcached: multi-thread.' },
                { w: 'OLAP / data warehouse', s: 'Amazon Redshift', k: 'Columnar storage, Redshift Spectrum for S3 queries' },
                { w: 'Graph data', s: 'Amazon Neptune', k: 'Property graph (Gremlin) + RDF (SPARQL)' },
              ].map(({ w, s, k }) => (
                <tr key={s}>
                  <td className="py-2.5 pr-4 text-slate-300">{w}</td>
                  <td className="py-2.5 pr-4 text-amber-300 font-medium whitespace-nowrap">{s}</td>
                  <td className="py-2.5 text-slate-400 text-xs">{k}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* IAM / Security */}
      <div id="iam" className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-rose-300">IAM &amp; Security</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 pr-4 text-slate-400 font-medium">Scenario</th>
                <th className="text-left py-2 pr-4 text-slate-400 font-medium">Mechanism</th>
                <th className="text-left py-2 text-slate-400 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[
                { s: 'EC2 needs to call S3/DynamoDB', m: 'IAM Role attached to EC2', n: 'Never hardcode keys; roles provide temporary credentials' },
                { s: 'Cross-account access', m: 'IAM Role + trust policy', n: 'Trust policy allows external account to assume role' },
                { s: 'Restrict what account can do', m: 'SCP (Service Control Policy)', n: 'Applied via AWS Organizations; affects all in OU' },
                { s: 'Fine-grained permission boundary', m: 'IAM Permission Boundary', n: 'Limits max permissions an identity can have' },
                { s: 'Temporary credentials for external users', m: 'STS AssumeRole / AssumeRoleWithWebIdentity', n: 'Used for federation (Cognito, SAML, OIDC)' },
                { s: 'Encrypt data at rest', m: 'SSE-S3, SSE-KMS, SSE-C', n: 'SSE-KMS = audit trail in CloudTrail; SSE-C = you manage key' },
                { s: 'Rotate credentials/secrets', m: 'AWS Secrets Manager', n: 'Automatic rotation for RDS, Redshift, DocumentDB' },
              ].map(({ s, m, n }) => (
                <tr key={m}>
                  <td className="py-2.5 pr-4 text-slate-300 text-xs">{s}</td>
                  <td className="py-2.5 pr-4 text-rose-300 font-medium whitespace-nowrap text-xs">{m}</td>
                  <td className="py-2.5 text-slate-400 text-xs">{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Messaging */}
      <div id="messaging" className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-indigo-300">Messaging &amp; Integration</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 pr-4 text-slate-400 font-medium">Pattern</th>
                <th className="text-left py-2 pr-4 text-slate-400 font-medium">Service</th>
                <th className="text-left py-2 text-slate-400 font-medium">Key Fact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[
                { p: 'Decouple producer/consumer, queue', s: 'Amazon SQS', k: 'Standard = at-least-once. FIFO = exactly-once, ordered.' },
                { p: 'Fan-out to multiple subscribers', s: 'Amazon SNS', k: 'Pub/sub; push to SQS, Lambda, HTTP, email, SMS' },
                { p: 'Event-driven routing, schedule', s: 'Amazon EventBridge', k: 'Default/custom/partner buses; 200+ AWS services as sources' },
                { p: 'Real-time streaming, ordered', s: 'Amazon Kinesis Data Streams', k: 'Shards; 1 MB/s in, 2 MB/s out per shard; 24h retention' },
                { p: 'Managed Apache Kafka', s: 'Amazon MSK', k: 'Fully managed Kafka — Kinesis alternative with Kafka API' },
                { p: 'Orchestrate multi-step workflows', s: 'AWS Step Functions', k: 'Standard (long-running, audit) vs Express (high-throughput)' },
              ].map(({ p, s, k }) => (
                <tr key={s}>
                  <td className="py-2.5 pr-4 text-slate-300 text-xs">{p}</td>
                  <td className="py-2.5 pr-4 text-indigo-300 font-medium whitespace-nowrap">{s}</td>
                  <td className="py-2.5 text-slate-400 text-xs">{k}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CLI cheat sheet */}
      <div id="cli" className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-teal-300">AWS CLI Cheat Sheet</h2>
        <div className="space-y-3">
          {[
            { group: 'S3', cmds: [
              'aws s3 ls s3://my-bucket/',
              'aws s3 cp local.txt s3://my-bucket/ --sse aws:kms',
              'aws s3 sync . s3://my-bucket/ --delete',
            ]},
            { group: 'EC2', cmds: [
              'aws ec2 describe-instances --filters Name=instance-state-name,Values=running',
              'aws ec2 create-snapshot --volume-id vol-xxx --description "backup"',
            ]},
            { group: 'IAM', cmds: [
              'aws iam create-role --role-name MyRole --assume-role-policy-document file://trust.json',
              'aws iam attach-role-policy --role-name MyRole --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess',
            ]},
            { group: 'RDS', cmds: [
              'aws rds create-db-snapshot --db-instance-identifier mydb --db-snapshot-identifier snap1',
              'aws rds restore-db-instance-from-db-snapshot --db-instance-identifier new-db --db-snapshot-identifier snap1',
            ]},
          ].map(({ group, cmds }) => (
            <div key={group}>
              <p className="text-xs font-semibold text-teal-300 uppercase tracking-wide mb-1">{group}</p>
              <div className="space-y-1">
                {cmds.map((cmd) => (
                  <p key={cmd} className="font-mono text-xs text-slate-300 bg-slate-900/60 rounded px-3 py-1.5 break-all">{cmd}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exam traps */}
      <div id="traps" className="card p-6 space-y-3">
        <h2 className="text-lg font-bold text-rose-300">Top 10 Exam Traps</h2>
        <div className="space-y-2">
          {[
            'EBS volumes are AZ-scoped — you cannot directly attach a volume from us-east-1a to an instance in us-east-1b. Snapshot then restore.',
            'S3 is not inside a VPC by default. Use VPC Endpoints (Gateway) for private S3 access without NAT Gateway.',
            'RDS Multi-AZ is for high availability (automatic failover), NOT for read scaling. Use Read Replicas for read scale.',
            'NAT Gateway is region-specific and AZ-scoped — if the AZ fails, instances in other AZs lose internet access. Deploy one per AZ.',
            'Security Groups are stateful (return traffic auto-allowed). NACLs are stateless (need explicit inbound AND outbound rules).',
            'CloudFront can only use ACM certificates from us-east-1 (N. Virginia) — not regional certificates.',
            'SQS Standard queues do NOT guarantee order and can deliver duplicates. Use FIFO queues for ordering guarantees.',
            'IAM policies: explicit Deny always wins. An SCP Deny cannot be overridden even by an admin in that account.',
            'EC2 Spot Instances can be interrupted with 2-minute warning — never use for databases or anything that cannot tolerate interruption.',
            'DynamoDB Global Tables require on-demand or auto-scaling capacity in all regions — provisioned capacity must match.',
          ].map((trap, i) => (
            <div key={i} className="flex gap-3 rounded-lg border border-rose-900/40 bg-rose-950/20 px-4 py-3">
              <span className="shrink-0 text-xs font-bold text-rose-400 mt-0.5">{i + 1}</span>
              <p className="text-sm text-slate-300">{trap}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
