import React, { useState } from 'react';
import { DownloadIcon, CheckCircleIcon, ShieldIcon } from '../common/Icons';
import { exportReportJSON, exportReportCSV } from '../../data/demoData';
import { SeverityBadge } from '../common/Badge';


export function ReportsScreen({ scanData, vulnerabilities, components }) {
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  const handleDownloadJSON = () => {
    exportReportJSON(scanData, vulnerabilities, components);
    setDownloadSuccess('JSON report exported successfully!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleDownloadCSV = () => {
    exportReportCSV(vulnerabilities);
    setDownloadSuccess('CSV vulnerability inventory exported successfully!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const criticalVulns = vulnerabilities.filter(v => v.severity === 'CRITICAL' || v.severity === 'HIGH');

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Security & Trust Reports</h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate and export verifiable audit reports for DevSecOps pipelines and compliance reviews.
          </p>
        </div>

        {/* Real working JSON and CSV export triggers */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 rounded-lg bg-[#141d30] hover:bg-[#1a2640] border border-[#223354] text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <DownloadIcon className="w-4 h-4 text-blue-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-colors"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>Export Full JSON Report</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {downloadSuccess && (
        <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Executive Report Summary Card */}
      <div className="bg-[#101726] border border-[#1b253b] rounded-xl p-6 space-y-6">
        <div className="border-b border-[#182338] pb-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono-tech text-blue-400 uppercase tracking-wider font-semibold">
              Executive Audit Brief
            </div>
            <h3 className="text-lg font-bold text-slate-100 mt-1">
              {scanData.scanName}
            </h3>
            <div className="text-xs text-slate-400 font-mono-tech mt-1">
              File: {scanData.sbomFile} • Evaluated: {scanData.scanDate}
            </div>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 rounded text-xs font-bold font-mono-tech uppercase bg-red-500/15 text-red-400 border border-red-500/30">
              Risk: {scanData.overallRisk.level} ({scanData.overallRisk.score}/100)
            </span>
          </div>
        </div>

        {/* 4-Stat Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-lg bg-[#0d1320] border border-[#182338]">
            <div className="text-[11px] font-mono-tech text-slate-400 uppercase">Total Inventory</div>
            <div className="text-xl font-bold font-mono-tech text-slate-100 mt-1">
              {scanData.totalComponents} Packages
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-[#0d1320] border border-[#182338]">
            <div className="text-[11px] font-mono-tech text-slate-400 uppercase">Identified Vulns</div>
            <div className="text-xl font-bold font-mono-tech text-red-400 mt-1">
              {scanData.vulnerabilitiesCount} Advisories
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-[#0d1320] border border-[#182338]">
            <div className="text-[11px] font-mono-tech text-slate-400 uppercase">SBOM Trust Rating</div>
            <div className="text-xl font-bold font-mono-tech text-amber-400 mt-1">
              {scanData.sbomTrust.score}% Good (Warnings)
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-[#0d1320] border border-[#182338]">
            <div className="text-[11px] font-mono-tech text-slate-400 uppercase">Uncertain Findings</div>
            <div className="text-xl font-bold font-mono-tech text-purple-400 mt-1">
              {scanData.uncertainFindings.length} Items Flagged
            </div>
          </div>
        </div>

        {/* Executive Recommendation Paragraph */}
        <div className="p-4 rounded-lg bg-[#0d1320] border border-[#182338] space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono-tech flex items-center gap-2">
            <ShieldIcon className="w-4 h-4 text-blue-400" />
            <span>Auditor Assessment & Recommendation</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The application exhibits an elevated risk posture (Score: 82/100) primarily driven by direct production dependencies including <code className="text-red-400 font-mono-tech">babel-traverse</code> (GHSA-36p3-6rc9-j4vq, Critical) and <code className="text-orange-400 font-mono-tech">axios</code> (GHSA-72xf-g2v4-qvf3, High). Immediate patch versions are available upstream and can be upgraded without breaking breaking architectural changes. Furthermore, the SBOM file satisfies NTIA minimum fields but lacks complete dependency relationship hierarchy, requiring cautious manual triage on unlinked packages.
          </p>
        </div>

        {/* Top Critical Action Items Table */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono-tech mb-3">
            Priority Action Plan
          </h4>
          <div className="overflow-x-auto rounded-lg border border-[#182338]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0f1a] text-slate-400 font-mono-tech uppercase text-[11px] border-b border-[#182338]">
                <tr>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Component</th>
                  <th className="py-2.5 px-3">Vulnerability</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Recommended Remediation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#162035]">
                {criticalVulns.slice(0, 5).map((v) => (
                  <tr key={v.id} className="hover:bg-[#131b2e]">
                    <td className="py-2.5 px-3 font-mono-tech font-bold text-slate-300">#{v.priority}</td>
                    <td className="py-2.5 px-3 font-mono-tech font-bold text-slate-100">{v.package}</td>
                    <td className="py-2.5 px-3 font-mono-tech text-slate-300">{v.id}</td>
                    <td className="py-2.5 px-3"><SeverityBadge severity={v.severity} size="sm" /></td>
                    <td className="py-2.5 px-3 font-mono-tech text-emerald-400 font-medium">
                      {v.remediationCommand || `Upgrade to ${v.fixedVersion}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
