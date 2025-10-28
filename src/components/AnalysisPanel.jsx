import React from 'react';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export default function AnalysisPanel({ findings }) {
  const hasFindings = findings && (findings.errors.length || findings.warnings.length || findings.infos.length);

  return (
    <section className="max-w-6xl mx-auto px-6 mt-8">
      <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-medium text-gray-800">Analysis Results</h3>
          <div className="text-sm text-gray-600">
            {findings && (
              <span>
                {findings.errors.length} errors • {findings.warnings.length} warnings • {findings.infos.length} notes
              </span>
            )}
          </div>
        </div>
        <div className="p-4">
          {!hasFindings && (
            <div className="text-sm text-gray-600">No findings yet. Paste logs or code above and click Analyze.</div>
          )}
          {hasFindings && (
            <div className="space-y-4">
              <SeverityList title="Errors" icon={AlertTriangle} color="text-red-600" items={findings.errors} badgeClass="bg-red-100 text-red-700" />
              <SeverityList title="Warnings" icon={AlertTriangle} color="text-amber-600" items={findings.warnings} badgeClass="bg-amber-100 text-amber-700" />
              <SeverityList title="Notes" icon={Info} color="text-blue-600" items={findings.infos} badgeClass="bg-blue-100 text-blue-700" />
            </div>
          )}
        </div>
      </div>
      {hasFindings && findings.errors.length === 0 && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mt-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm">No critical errors detected. You look ready for deployment. Run the readiness checks below to be sure.</span>
        </div>
      )}
    </section>
  );
}

function SeverityList({ title, icon: Icon, color, items, badgeClass }) {
  if (!items.length) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
      </div>
      <ul className="space-y-2">
        {items.map((it, idx) => (
          <li key={`${title}-${idx}`} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
            <span className={`text-xs px-2 py-0.5 rounded ${badgeClass}`}>{it.tag}</span>
            <div className="text-sm text-gray-800 leading-relaxed">{it.message}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
