import React from 'react';
import { AuditStatusBadge } from '../common/Badge';
import { AwardIcon, ShieldAlertIcon } from '../common/Icons';


export function SbomQualityScreen({ scanData, onReviewUncertainFindings }) {
  const trust = scanData.sbomTrust;
  const breakdown = scanData.qualityBreakdown;
  const ntia = scanData.ntiaMinimumElements;

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">
          SBOM Quality & Trust Audit
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Evaluate whether the available SBOM information is sufficient for reliable security analysis.
        </p>
      </div>

      {/* Large Trust Score Card & Visual Posture */}
      <div className="bg-[#101726] border border-[#1b253b] rounded-xl p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl text-center lg:text-left">
          <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 font-mono-tech flex items-center justify-center lg:justify-start gap-2">
            <AwardIcon className="w-4 h-4 text-amber-400" />
            <span>Executive SBOM Trust Rating</span>
          </div>
          <div className="flex items-baseline justify-center lg:justify-start gap-3">
            <span className="text-5xl font-black font-mono-tech text-amber-400">
              {trust.score}
            </span>
            <span className="text-lg font-bold font-mono-tech text-slate-400">/ 100</span>
            <span className="px-3 py-1 rounded text-xs font-bold font-mono-tech uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {trust.rating}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {trust.summary}
          </p>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-[#151f33]"
              strokeWidth="9"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className="text-amber-400"
              strokeWidth="9"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - trust.score / 100)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-2xl font-bold font-mono-tech text-slate-100">{trust.score}%</span>
            <div className="text-[10px] text-slate-400 font-mono-tech uppercase">Confidence</div>
          </div>
        </div>
      </div>

      {/* CORE SECURITY PRINCIPLE BANNER (Crucial Requirement) */}
      <div className="bg-[#161226] border-2 border-purple-500/40 rounded-xl p-6 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 mt-1">
            <ShieldAlertIcon className="w-6 h-6 text-purple-400" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-amber-300 font-mono-tech">
                SECURITY PRINCIPLE
              </span>
              <span className="text-xs font-bold font-mono-tech text-purple-300 px-2 py-0.5 rounded bg-purple-500/20">
                CRITICAL SAFEGUARD
              </span>
            </div>

            <h3 className="text-base font-extrabold text-white tracking-wide">
              "UNKNOWN DOES NOT MEAN SAFE."
            </h3>

            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              "Risk could not be confidently determined because required SBOM context is incomplete. Vulnerability assessment confidence is systematically downgraded when dependency relationships, component hashes, or build target scopes are omitted."
            </p>

            <div className="pt-2">
              <button
                onClick={onReviewUncertainFindings}
                className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-mono-tech transition-colors shadow-md"
              >
                Review 3 Insufficiently Contextualized Findings &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: NTIA Minimum Elements & Quality Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NTIA MINIMUM ELEMENTS TABLE */}
        <div className="bg-[#101726] border border-[#1b253b] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono-tech">
              NTIA Minimum Elements Compliance
            </h3>
            <span className="text-xs font-mono-tech text-amber-400 font-bold">6 / 8 Met</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            U.S. Executive Order 14028 / NTIA SBOM baseline criteria.
          </p>

          <div className="divide-y divide-[#182338]">
            {ntia.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-medium text-slate-200">{item.element}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.detail}</div>
                </div>
                <AuditStatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>

        {/* SBOM METRICS BREAKDOWN BARS */}
        <div className="bg-[#101726] border border-[#1b253b] rounded-xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono-tech mb-2">
            Detailed Quality Factor Breakdown
          </h3>
          <p className="text-xs text-slate-400 mb-5">
            Quantitative scoring across standards and schema completeness.
          </p>

          <div className="space-y-4">
            {breakdown.map((q) => (
              <div key={q.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium">{q.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tech text-slate-400">{q.score}%</span>
                    <AuditStatusBadge status={q.status} />
                  </div>
                </div>
                <div className="w-full h-2 bg-[#0d1320] rounded-full overflow-hidden border border-[#1c2742]">
                  <div
                    className={`h-full rounded-full transition-all ${
                      q.score >= 90 ? 'bg-emerald-400' :
                      q.score >= 75 ? 'bg-amber-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${q.score}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400">{q.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AUDIT WARNINGS & FINDINGS SUMMARY */}
      <div className="bg-[#101726] border border-[#1b253b] rounded-xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono-tech mb-4">
          Actionable Audit Warnings & Context Deficits
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-[#0d1320] border border-amber-500/20 space-y-1">
            <div className="text-xs font-bold text-amber-400 font-mono-tech">
              12 Unlinked Dependencies
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              12 packages lack parent dependency relationships, preventing complete reachability analysis.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#0d1320] border border-amber-500/20 space-y-1">
            <div className="text-xs font-bold text-amber-400 font-mono-tech">
              23 Missing Cryptographic Hashes
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              SHA-256 digests missing for 18% of packages, meaning binary integrity cannot be cryptographically matched.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#0d1320] border border-purple-500/25 space-y-1">
            <div className="text-xs font-bold text-purple-300 font-mono-tech">
              3 Uncertain Vulnerability Findings
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              Triaged as UNKNOWN to prevent false negatives. Manual security engineer inspection required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
