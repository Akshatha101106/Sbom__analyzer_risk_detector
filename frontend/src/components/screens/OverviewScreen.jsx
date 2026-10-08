import React, { useState } from 'react';
import { SeverityBadge, RiskScoreBadge, AuditStatusBadge } from '../common/Badge';
import { CheckCircleIcon, AlertTriangleIcon } from '../common/Icons';


export function OverviewScreen({ 
  scanData, 
  vulnerabilities, 
  onSelectVulnerability, 
  onNavigateTab 
}) {
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('priority');

  // Filter & sort top priority list
  const filteredVulns = vulnerabilities
    .filter(v => severityFilter === 'ALL' || v.severity === severityFilter)
    .sort((a, b) => {
      if (sortBy === 'risk') return b.riskScore - a.riskScore;
      return a.priority - b.priority;
    });

  const severityCounts = scanData.severityCounts;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Subtitle */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Security Overview</h2>
        <p className="text-xs text-slate-400 mt-1">
          Risk posture and SBOM confidence for the current application.
        </p>
      </div>

      {/* Top Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#101726] border border-[#1b253b] rounded-xl p-4 flex flex-col justify-between">
          <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400 font-mono-tech">
            Total Components
          </div>
          <div className="text-2xl font-bold font-mono-tech text-slate-100 mt-2">
            {scanData.totalComponents}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">CycloneDX inventory</div>
        </div>

        <div className="bg-[#101726] border border-[#1b253b] rounded-xl p-4 flex flex-col justify-between">
          <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400 font-mono-tech">
            Vulnerabilities
          </div>
          <div className="text-2xl font-bold font-mono-tech text-red-400 mt-2">
            {scanData.vulnerabilitiesCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">OSV & NVD matched</div>
        </div>

        <div className="bg-[#101726] border border-red-500/20 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-[11px] font-medium uppercase tracking-wider text-red-400 font-mono-tech flex items-center justify-between">
            <span>Critical</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold font-mono-tech text-red-400 mt-2">
            {severityCounts.critical}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Immediate action</div>
        </div>

        <div className="bg-[#101726] border border-orange-500/20 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-[11px] font-medium uppercase tracking-wider text-orange-400 font-mono-tech">
            High
          </div>
          <div className="text-2xl font-bold font-mono-tech text-orange-400 mt-2">
            {severityCounts.high}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Elevated exploitability</div>
        </div>

        <div className="bg-[#101726] border border-amber-500/20 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-[11px] font-medium uppercase tracking-wider text-amber-400 font-mono-tech">
            Medium
          </div>
          <div className="text-2xl font-bold font-mono-tech text-amber-400 mt-2">
            {severityCounts.medium}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Requires scheduling</div>
        </div>

        <div className="bg-[#101726] border border-purple-500/20 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-[11px] font-medium uppercase tracking-wider text-purple-400 font-mono-tech flex items-center justify-between">
            <span>Unknown</span>
            <AlertTriangleIcon className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono-tech text-purple-300 mt-2">
            {severityCounts.unknown}
          </div>
          <div className="text-[11px] text-purple-400/80 mt-1">Context incomplete</div>
        </div>
      </div>

      {/* Primary Cards: Overall Risk & SBOM Trust */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OVERALL RISK CARD */}
        <div className="bg-[#101726] border border-[#1b253b] rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 font-mono-tech">
                Overall Risk Posture
              </div>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-4xl font-extrabold font-mono-tech text-red-400">
                  {scanData.overallRisk.score}
                </span>
                <span className="text-sm font-semibold text-slate-400 font-mono-tech">/ 100</span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold font-mono-tech uppercase bg-red-500/15 text-red-400 border border-red-500/30">
                  {scanData.overallRisk.level}
                </span>
              </div>
            </div>

            {/* Visual Risk Gauge Widget */}
            <div className="w-20 h-20 rounded-full border-4 border-[#1b253b] border-t-red-500 border-r-red-500 flex items-center justify-center bg-[#0d1320] rotate-45">
              <span className="-rotate-45 font-mono-tech font-bold text-sm text-red-400">
                82%
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-[#0d1320] border border-[#182338]">
            <p className="text-xs text-slate-300 leading-relaxed">
              "{scanData.overallRisk.rationale}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#182338]">
            <div>
              <div className="text-[11px] text-slate-400">Direct Production Vulns</div>
              <div className="text-sm font-bold font-mono-tech text-slate-200 mt-0.5">
                {scanData.overallRisk.directProductionVulns} Direct Packages
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Transitive Vulns</div>
              <div className="text-sm font-bold font-mono-tech text-slate-200 mt-0.5">
                {scanData.overallRisk.transitiveVulns} Sub-dependencies
              </div>
            </div>
          </div>
        </div>

        {/* SBOM TRUST CARD */}
        <div className="bg-[#101726] border border-[#1b253b] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 font-mono-tech">
                  SBOM Trust & Quality Score
                </div>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-4xl font-extrabold font-mono-tech text-amber-400">
                    {scanData.sbomTrust.score}
                  </span>
                  <span className="text-sm font-semibold text-slate-400 font-mono-tech">/ 100</span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold font-mono-tech uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {scanData.sbomTrust.rating}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('quality')}
                className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-400 px-3 py-1.5 rounded-lg transition-colors font-medium"
              >
                Audit Breakdown &rarr;
              </button>
            </div>

            {/* Checklist items */}
            <div className="mt-4 space-y-2">
              {scanData.sbomTrust.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs">
                  {h.status === 'pass' ? (
                    <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangleIcon className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span className={h.status === 'pass' ? 'text-slate-300' : 'text-amber-300/90 font-medium'}>
                    {h.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#182338] flex items-center justify-between text-xs text-slate-400">
            <span>NTIA Minimum Elements:</span>
            <span className="text-amber-400 font-mono-tech font-semibold">6 of 8 Verified</span>
          </div>
        </div>
      </div>

      {/* TOP PRIORITY VULNERABILITIES TABLE */}
      <div className="bg-[#101726] border border-[#1b253b] rounded-xl overflow-hidden">
        {/* Table Header & Controls */}
        <div className="p-5 border-b border-[#182338] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 tracking-tight">
              Top Priority Vulnerabilities
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by contextual exposure, direct reachability, and severity score.
            </p>
          </div>

          {/* Filters & Sorting */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#0d1320] border border-[#1e2a42] rounded-lg p-1 text-xs font-mono-tech">
              <span className="text-slate-400 px-2 text-[11px]">Filter:</span>
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    severityFilter === sev
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSortBy(sortBy === 'priority' ? 'risk' : 'priority')}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#141b2e] hover:bg-[#1c2742] border border-[#233355] text-slate-300 font-mono-tech transition-colors"
            >
              Sort: {sortBy === 'priority' ? 'Priority # ' : 'Risk Score ↓'}
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b0f1a] text-slate-400 uppercase font-mono-tech text-[11px] border-b border-[#182338]">
              <tr>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Vulnerability</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4">Dependency</th>
                <th className="py-3 px-4">Fix</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162035]">
              {filteredVulns.slice(0, 6).map((vuln) => (
                <tr 
                  key={vuln.id}
                  onClick={() => onSelectVulnerability(vuln)}
                  className="hover:bg-[#151e33] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono-tech font-bold text-slate-300">
                    #{vuln.priority}
                  </td>
                  <td className="py-3.5 px-4 font-mono-tech font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                    {vuln.package}
                  </td>
                  <td className="py-3.5 px-4 font-mono-tech text-slate-400">
                    {vuln.installedVersion}
                  </td>
                  <td className="py-3.5 px-4 font-mono-tech text-slate-200">
                    <div>{vuln.id}</div>
                    {vuln.cve && <div className="text-[10px] text-slate-400">{vuln.cve}</div>}
                  </td>
                  <td className="py-3.5 px-4">
                    <SeverityBadge severity={vuln.severity} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <RiskScoreBadge score={vuln.riskScore} />
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-300 font-medium">
                      {vuln.dependencyType}
                    </span>
                    <span className="text-slate-400 text-[10px] ml-1">
                      / {vuln.environment}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono-tech">
                    {vuln.fixedVersion ? (
                      <span className="text-emerald-400 font-medium">{vuln.fixedVersion}</span>
                    ) : (
                      <span className="text-slate-400">No patch</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[11px] font-mono-tech ${
                      vuln.confidence === 'High' ? 'text-emerald-400' :
                      vuln.confidence === 'Medium' ? 'text-amber-400' : 'text-purple-400'
                    }`}>
                      {vuln.confidence}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectVulnerability(vuln);
                      }}
                      className="px-2.5 py-1 rounded bg-[#1c2742] group-hover:bg-blue-600 group-hover:text-white text-blue-300 border border-[#2b3d63] group-hover:border-blue-400 font-medium text-xs transition-colors"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View All Vulnerabilities Link */}
        <div className="p-3 bg-[#0d1320] border-t border-[#182338] text-center">
          <button
            onClick={() => onNavigateTab('vulnerabilities')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            View all {vulnerabilities.length} vulnerabilities in inventory &rarr;
          </button>
        </div>
      </div>

      {/* Grid: Risk Distribution & SBOM Quality Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RISK DISTRIBUTION CHART (Compact) */}
        <div className="bg-[#101726] border border-[#1b253b] rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-100 tracking-tight mb-1">
            Vulnerability Risk Distribution
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Categorized by contextual risk classification.
          </p>

          <div className="space-y-3">
            {[
              { label: 'Critical', count: severityCounts.critical, color: 'bg-red-500', pct: '14%' },
              { label: 'High', count: severityCounts.high, color: 'bg-orange-500', pct: '36%' },
              { label: 'Medium', count: severityCounts.medium, color: 'bg-amber-500', pct: '28%' },
              { label: 'Low', count: severityCounts.low, color: 'bg-cyan-500', pct: '14%' },
              { label: 'Unknown', count: severityCounts.unknown, color: 'bg-purple-500', pct: '8%' },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs font-mono-tech">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-slate-400">{item.count} ({item.pct})</span>
                </div>
                <div className="w-full h-2 bg-[#0d1320] rounded-full overflow-hidden border border-[#1c2742]">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${(item.count / scanData.vulnerabilitiesCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SBOM QUALITY HORIZONTAL INDICATORS */}
        <div className="bg-[#101726] border border-[#1b253b] rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-100 tracking-tight">
              SBOM Quality Indicators
            </h3>
            <button
              onClick={() => onNavigateTab('quality')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              Full Audit &rarr;
            </button>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Evaluation of data completeness across standards.
          </p>

          <div className="space-y-2.5">
            {scanData.qualityBreakdown.slice(0, 5).map((q) => (
              <div key={q.label} className="flex items-center justify-between text-xs">
                <div className="w-48 text-slate-300 truncate">{q.label}</div>
                <div className="flex-1 mx-4">
                  <div className="w-full h-2 bg-[#0d1320] rounded-full overflow-hidden border border-[#1c2742]">
                    <div
                      className={`h-full rounded-full ${
                        q.score >= 90 ? 'bg-emerald-400' :
                        q.score >= 70 ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${q.score}%` }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right">
                  <AuditStatusBadge status={q.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* UNCERTAIN FINDINGS WARNING SECTION */}
      <div className="bg-[#161226] border border-purple-500/30 rounded-xl p-6 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
            <AlertTriangleIcon className="w-5 h-5 text-purple-400" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 font-mono-tech">
                Uncertain Findings
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-tech bg-purple-500/20 text-purple-200 border border-purple-500/30">
                {scanData.uncertainFindings.length} Items Require Review
              </span>
            </div>

            <p className="text-xs text-slate-200 mt-2 font-medium">
              3 findings cannot be confidently contextualized because dependency relationship information is incomplete in the uploaded SBOM.
            </p>

            {/* Core Security Principle Box */}
            <div className="mt-3 p-3 rounded-lg bg-[#0d091a] border border-purple-500/25">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wide font-mono-tech flex items-center gap-1.5">
                <span>⚠ CORE SECURITY PRINCIPLE: UNKNOWN DOES NOT MEAN SAFE.</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                "Insufficient SBOM context prevents confident risk classification. When package dependency links, hashes, or build boundaries are missing, potential vulnerabilities cannot be safely ruled out."
              </p>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => onNavigateTab('vulnerabilities')}
                className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold tracking-wide shadow-md transition-colors"
              >
                Review Uncertain Findings
              </button>
              <button
                onClick={() => onNavigateTab('quality')}
                className="px-3 py-1.5 rounded-lg bg-transparent hover:bg-purple-500/10 text-purple-300 text-xs font-medium border border-purple-500/30 transition-colors"
              >
                Inspect SBOM Gaps
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
