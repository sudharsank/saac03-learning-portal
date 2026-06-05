import Link from 'next/link';

export default function RoadmapPage() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">AWS Certification Landscape</p>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
          SAA-C03 Certification Roadmap
        </h1>
        <p className="max-w-2xl mx-auto text-slate-400 text-sm leading-relaxed">
          See how SAA-C03 (AWS Solutions Architect – Associate) fits into the AWS certification landscape and where to go next.
        </p>
      </div>

      {/* Foundational */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4 text-center">Foundational (No prerequisites)</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { code: 'CLF-C02', name: 'AWS Cloud Practitioner', desc: 'Cloud concepts, core AWS services, billing, pricing model.' },
            { code: 'AIF-C01', name: 'AWS AI Practitioner', desc: 'AI and ML concepts, AWS AI/ML services overview.' },
          ].map((c) => (
            <div key={c.code} className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <p className="text-xs font-bold text-slate-500">{c.code}</p>
              <p className="font-semibold text-slate-200">{c.name}</p>
              <p className="mt-1 text-xs text-slate-400">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Associate */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4 text-center">Associate</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { code: 'SAA-C03', name: 'Solutions Architect – Associate', desc: 'Design secure, resilient, high-performing, cost-optimised architectures. The most popular AWS cert.', current: true },
            { code: 'SOA-C02', name: 'SysOps Administrator – Associate', desc: 'Deploy, manage, and operate scalable systems on AWS. Heavy on monitoring and troubleshooting.', current: false },
            { code: 'DVA-C02', name: 'Developer – Associate', desc: 'Develop, deploy, and debug cloud-based applications using AWS services.', current: false },
            { code: 'MLA-C01', name: 'Machine Learning Engineer – Associate', desc: 'Build, train, tune, and deploy ML models using AWS ML services.', current: false },
            { code: 'DAS-C01', name: 'Data Engineer – Associate', desc: 'Design and build data pipelines, storage, and analytics on AWS.', current: false },
          ].map((c) => (
            <div key={c.code} className={`relative rounded-lg border p-4 ${c.current ? 'border-amber-500 bg-amber-950/30' : 'border-slate-700 bg-slate-900/50'}`}>
              {c.current && (
                <span className="absolute -top-2.5 left-4 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">
                  You Are Here
                </span>
              )}
              <p className={`text-xs font-bold ${c.current ? 'text-amber-400' : 'text-slate-500'}`}>{c.code}</p>
              <p className={`font-semibold ${c.current ? 'text-white' : 'text-slate-200'}`}>{c.name}</p>
              <p className="mt-1 text-xs text-slate-400">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Professional */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4 text-center">Professional (Requires Associate)</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { code: 'SAP-C02', name: 'Solutions Architect – Professional', desc: 'Complex, large-scale AWS architectures. Natural progression from SAA-C03. Hardest AWS cert.' },
            { code: 'DOP-C02', name: 'DevOps Engineer – Professional', desc: 'CI/CD, automation, IaC, monitoring at scale. Requires SOA or DVA Associate.' },
          ].map((c) => (
            <div key={c.code} className="rounded-lg border border-orange-800/50 bg-orange-950/20 p-4">
              <p className="text-xs font-bold text-orange-400">{c.code}</p>
              <p className="font-semibold text-slate-200">{c.name}</p>
              <p className="mt-1 text-xs text-slate-400">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Specialty */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4 text-center">Specialty</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { code: 'ANS-C01', name: 'Advanced Networking', desc: 'Complex hybrid networking, Direct Connect, Transit Gateway.' },
            { code: 'SCS-C02', name: 'Security Specialty', desc: 'Deep IAM, encryption, incident response, compliance.' },
            { code: 'MLS-C01', name: 'ML Specialty', desc: 'Build, train, and deploy ML models with SageMaker.' },
          ].map((c) => (
            <div key={c.code} className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <p className="text-xs font-bold text-slate-500">{c.code}</p>
              <p className="font-semibold text-slate-200">{c.name}</p>
              <p className="mt-1 text-xs text-slate-400">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended next */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4 text-center">Recommended After SAA-C03</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              code: 'SAP-C02',
              name: 'Solutions Architect – Professional',
              why: 'The natural next step. SAA-C03 gives you the breadth; SAP-C02 tests depth across complex multi-account, multi-region enterprise architectures.',
              color: 'border-amber-700/60 bg-amber-950/20',
            },
            {
              code: 'DVA-C02',
              name: 'Developer – Associate',
              why: 'Extends your architecture knowledge into app development — CloudFormation, CodePipeline, Lambda, DynamoDB deep-dive. Complements SAA well.',
              color: 'border-sky-700/60 bg-sky-950/20',
            },
            {
              code: 'SCS-C02',
              name: 'Security Specialty',
              why: 'If Domain 1 (Secure Architectures) was your strongest area, go deep on security. IAM, KMS, GuardDuty, Security Hub — highly valued in enterprise roles.',
              color: 'border-rose-700/60 bg-rose-950/20',
            },
          ].map(({ code, name, why, color }) => (
            <div key={code} className={`rounded-xl border p-5 space-y-2 ${color}`}>
              <p className="text-xs font-bold text-slate-400">Next Cert →</p>
              <p className="text-lg font-bold text-white">{code}</p>
              <p className="text-sm font-semibold text-slate-200">{name}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{why}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center space-y-3 py-4">
        <p className="text-slate-400 text-sm">Ready to start your SAA-C03 preparation?</p>
        <div className="flex justify-center gap-4">
          <Link href="/learn" className="rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-500">
            Start Learning →
          </Link>
          <Link href="/practice/mock" className="rounded-lg border border-slate-700 px-6 py-2.5 text-sm font-semibold text-slate-300 hover:border-slate-500">
            Take a Mock Exam
          </Link>
        </div>
      </div>
    </div>
  );
}
