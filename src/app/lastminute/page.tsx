import Link from 'next/link';

export const metadata = {
  title: 'Last-Minute Review | SAA-C03',
  description: 'The most-tested facts across SAA-C03 — read this the morning of your exam.',
};

function FactRow({ index, term, body }: { index: number; term: string; body: string }) {
  return (
    <div className="flex gap-4 py-3 border-b border-slate-800/60 last:border-0">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-400">
        {index}
      </span>
      <p className="text-sm leading-relaxed text-slate-300">
        <strong className="font-semibold text-slate-100">{term}</strong>
        {' — '}
        {body}
      </p>
    </div>
  );
}

export default function LastMinutePage() {
  return (
    <div className="space-y-8 pb-16">
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-3xl font-bold tracking-tight">Last-Minute Review</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          10 must-know facts per domain — read this the morning of your SAA-C03 exam
        </p>
      </div>

      {/* D1 — Secure Architectures */}
      <div className="card p-6 space-y-1">
        <h2 className="text-lg font-bold text-rose-300 mb-3">Domain 1 — Design Secure Architectures (30%)</h2>
        <FactRow index={1} term="IAM Policy evaluation" body="Explicit Deny always wins. Default deny unless explicitly allowed. SCP cannot be overridden even by account admin — it caps the maximum permissions." />
        <FactRow index={2} term="Permission Boundary" body="Sets the maximum permissions an IAM identity can have — even if a broader policy is attached, the boundary limits what is actually allowed." />
        <FactRow index={3} term="SCP vs IAM Policy" body="SCPs apply to an entire AWS Organizations OU/account — they don't grant permissions, they only restrict. IAM policies grant permissions within that SCP ceiling." />
        <FactRow index={4} term="IAM Role vs IAM User" body="IAM Roles provide temporary credentials via STS. Use roles for EC2, Lambda, cross-account access. Never embed long-term IAM user access keys in application code." />
        <FactRow index={5} term="SSE-KMS vs SSE-S3 vs SSE-C" body="SSE-KMS: AWS-managed or customer-managed key, CloudTrail audit. SSE-S3: AWS manages key, no audit trail. SSE-C: you provide key per request, AWS does the encryption." />
        <FactRow index={6} term="Secrets Manager vs Parameter Store" body="Secrets Manager: automatic rotation for RDS/Redshift, costs per secret. Parameter Store: free tier (Standard), no auto-rotation. Use Secrets Manager for rotating DB credentials." />
        <FactRow index={7} term="VPC Security Groups vs NACLs" body="Security Groups are stateful (return traffic auto-allowed), attached to ENI. NACLs are stateless (explicit inbound AND outbound needed), subnet-level, numbered rules evaluated in order." />
        <FactRow index={8} term="WAF and Shield" body="WAF: layer 7 rules (IP block, geo-block, rate limit, SQL injection, XSS). Shield Standard: free, always on, DDoS protection. Shield Advanced: $3k/month, 24/7 DRT support." />
        <FactRow index={9} term="KMS Key types" body="AWS Managed Keys (aws/s3, aws/rds): AWS controls rotation. Customer Managed Keys (CMK): you control policy and rotation schedule. AWS Owned Keys: completely invisible to you." />
        <FactRow index={10} term="S3 Block Public Access" body="4 settings: BlockPublicAcls, IgnorePublicAcls, BlockPublicPolicy, RestrictPublicBuckets. Enable all four at account level to prevent any accidental public exposure." />
      </div>

      {/* D2 — Resilient Architectures */}
      <div className="card p-6 space-y-1">
        <h2 className="text-lg font-bold text-amber-300 mb-3">Domain 2 — Design Resilient Architectures (26%)</h2>
        <FactRow index={1} term="RDS Multi-AZ vs Read Replica" body="Multi-AZ: synchronous replication, automatic failover, NOT readable. Read Replica: asynchronous, readable, must be promoted manually. Multi-AZ = HA. Read Replica = read scaling." />
        <FactRow index={2} term="Route 53 routing policies" body="Simple (single), Weighted (A/B), Latency (lowest RTT), Failover (primary/secondary), Geolocation (by origin country), Geoproximity (bias), Multi-Value (random healthy records)." />
        <FactRow index={3} term="SQS Standard vs FIFO" body="Standard: at-least-once delivery, best-effort ordering, unlimited throughput. FIFO: exactly-once, ordered per MessageGroupId, 300 TPS (or 3000 with batching)." />
        <FactRow index={4} term="SQS Visibility Timeout" body="Time a message is invisible after being received. Default 30s, max 12 hours. If processing takes longer, extend with ChangeMessageVisibility. Expired = re-queued." />
        <FactRow index={5} term="Dead-Letter Queue (DLQ)" body="Messages moved to DLQ after maxReceiveCount failures. Inspect DLQ for poison messages. Works with both Standard and FIFO SQS, and SNS. Configure retention period separately." />
        <FactRow index={6} term="Disaster Recovery patterns" body="Backup/Restore: cheapest, highest RTO/RPO. Pilot Light: minimal running infra. Warm Standby: scaled-down live copy. Multi-Site: full active-active. RTO/RPO decrease but cost increases." />
        <FactRow index={7} term="Auto Scaling cooldown" body="Default 300s cooldown prevents additional scale-out actions during scaling event. Use step or target tracking policies to avoid thrashing. Lifecycle hooks for custom launch/termination logic." />
        <FactRow index={8} term="SNS fan-out pattern" body="One SNS topic → multiple SQS queues → multiple consumers process independently. This decouples producers from consumers and enables parallel processing." />
        <FactRow index={9} term="Elastic Load Balancer types" body="ALB: layer 7, HTTP/HTTPS, path/host routing, WebSockets, Lambda targets. NLB: layer 4, ultra-low latency, static IP, TCP/UDP. GLB: layer 3+, for network appliances (firewalls, IDS)." />
        <FactRow index={10} term="Aurora Global Database" body="Primary region (read/write) + up to 5 secondary regions (read). Replication lag < 1 second. Failover to secondary in under 1 minute. Cross-region DR pattern for Aurora." />
      </div>

      {/* D3 — High-Performing Architectures */}
      <div className="card p-6 space-y-1">
        <h2 className="text-lg font-bold text-sky-300 mb-3">Domain 3 — Design High-Performing Architectures (24%)</h2>
        <FactRow index={1} term="EC2 instance families" body="M (general), C (compute), R (memory), I (storage), G/P (GPU), T (burstable). Placement groups: Cluster (low latency, same AZ), Spread (different hardware), Partition (Hadoop, Cassandra)." />
        <FactRow index={2} term="EBS volume types" body="gp3 (general, default, cheaper than gp2). io2 Block Express (high IOPS, sub-ms, multi-attach). st1 (throughput, sequential, HDD). sc1 (cold HDD, infrequent access, cheapest)." />
        <FactRow index={3} term="S3 performance" body="S3 supports 3,500 PUT/COPY/DELETE and 5,500 GET/HEAD per prefix per second. Use multiple prefixes for parallelism. S3 Transfer Acceleration uses CloudFront edge for uploads." />
        <FactRow index={4} term="DynamoDB DAX" body="In-memory cache for DynamoDB. Reduces read latency from milliseconds to microseconds. Write-through cache. Does NOT support strongly consistent reads or Scan caching." />
        <FactRow index={5} term="DynamoDB GSI vs LSI" body="GSI: different partition + sort key, eventually consistent, separate throughput, up to 20 per table. LSI: same partition key, different sort key, must be defined at table creation, max 5." />
        <FactRow index={6} term="ElastiCache Redis vs Memcached" body="Redis: persistence, replication, pub/sub, Sorted Sets, multi-AZ. Memcached: multi-threaded, horizontal scaling, no persistence. Choose Redis for session store + pub/sub." />
        <FactRow index={7} term="CloudFront cache behaviour" body="TTL controls how long objects are cached at edge. Invalidation removes objects before TTL expires ($0.005/path). Use versioned URLs (file.v2.js) instead of invalidations for better performance." />
        <FactRow index={8} term="Global Accelerator vs CloudFront" body="Global Accelerator: static Anycast IPs, TCP/UDP layer 4, routes to nearest healthy endpoint. CloudFront: HTTP/HTTPS caching CDN. GA = non-HTTP apps. CF = web content caching." />
        <FactRow index={9} term="Lambda concurrency" body="Reserved concurrency: guarantees a set amount, caps function. Provisioned concurrency: pre-warmed instances, eliminates cold start. Account default: 1000 concurrent executions." />
        <FactRow index={10} term="Kinesis Data Streams shards" body="1 shard = 1 MB/s write, 2 MB/s read, up to 1000 records/s. Enhanced fan-out: 2 MB/s per consumer per shard (push model). Retention: 24h default, up to 7 days (365 days extended)." />
      </div>

      {/* D4 — Cost-Optimized Architectures */}
      <div className="card p-6 space-y-1">
        <h2 className="text-lg font-bold text-emerald-300 mb-3">Domain 4 — Design Cost-Optimized Architectures (20%)</h2>
        <FactRow index={1} term="EC2 purchasing options" body="On-Demand: no commitment, highest cost. Reserved (1 or 3 yr): up to 72% savings. Spot: up to 90% savings, interruptible. Savings Plans: flexible commitment covers EC2 + Lambda + Fargate." />
        <FactRow index={2} term="Spot Instance interruption" body="AWS gives 2-minute warning before reclaiming Spot Instance. Use Spot for stateless, fault-tolerant, flexible workloads (batch jobs, HPC). NEVER for databases or stateful apps." />
        <FactRow index={3} term="S3 Intelligent-Tiering" body="Automatically moves objects between Frequent and Infrequent access tiers. No retrieval fees. Small monthly monitoring fee. Best for unknown or changing access patterns." />
        <FactRow index={4} term="S3 Lifecycle Policies" body="Transition objects between storage classes after N days. Expire (delete) objects after N days. Cannot transition from Glacier back to Standard via lifecycle — must restore first." />
        <FactRow index={5} term="NAT Gateway cost" body="NAT Gateway charges per hour + per GB processed. For cost optimization: use VPC Endpoints (Gateway type for S3/DynamoDB = free) to avoid NAT Gateway data processing fees." />
        <FactRow index={6} term="Data transfer pricing" body="Ingress to AWS: free. EC2 to Internet: charged per GB. EC2 to EC2 in same AZ via private IP: free. Cross-AZ: $0.01/GB each way. Cross-region: varies. CloudFront egress is cheaper than EC2 direct." />
        <FactRow index={7} term="Aurora Serverless v2" body="Scales in fine-grained ACU increments (0.5 ACU minimum). Billed per ACU-hour. Ideal for variable workloads, dev/test, or new apps with unpredictable traffic — avoids over-provisioning." />
        <FactRow index={8} term="DynamoDB capacity modes" body="Provisioned: pay for reserved RCU/WCU. On-Demand: pay per request. Provisioned + Auto Scaling = cost-optimal for predictable traffic. On-Demand = cost-optimal for spiky/unknown traffic." />
        <FactRow index={9} term="AWS Compute Optimizer" body="Recommends right-sized EC2 instances, Auto Scaling groups, Lambda functions, and EBS volumes based on actual utilisation data. Free service — use it before Reserved Instance purchases." />
        <FactRow index={10} term="Reserved Instance types" body="Standard RI: highest discount (72%), limited flexibility. Convertible RI: lower discount (~54%), can change instance family. Scheduled RI: reserved for specific windows. Zonal vs Regional scope." />
      </div>

      <div className="card border border-emerald-800/50 bg-emerald-950/20 p-6 text-center space-y-2">
        <p className="text-lg font-semibold text-emerald-300">If you score ≥80% on the final mock, you&apos;re ready.</p>
        <p className="text-slate-400 text-sm">Go pass it. You&apos;ve got this.</p>
        <Link href="/practice/mock" className="mt-3 inline-block rounded-lg bg-emerald-700 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition">
          Go to Mock Exams →
        </Link>
      </div>
    </div>
  );
}
