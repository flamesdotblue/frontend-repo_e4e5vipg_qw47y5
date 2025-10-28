import React from 'react';
import { CheckCircle2, Play, XCircle, RefreshCw } from 'lucide-react';

export default function ReadinessChecklist({ checks, onRun }) {
  const allPass = checks.length > 0 && checks.every(c => c.status === 'pass');
  return (
    <section className="max-w-6xl mx-auto px-6 my-8">
      <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-medium text-gray-800">Deployment Readiness</h3>
          <button onClick={onRun} className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white">
            <Play className="w-4 h-4" /> Run checks
          </button>
        </div>
        <div className="p-4">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {checks.map((c, idx) => (
              <li key={`check-${idx}`} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                {c.status === 'pass' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                ) : c.status === 'running' ? (
                  <RefreshCw className="w-5 h-5 text-amber-600 animate-spin mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <div>
                  <div className="text-sm font-medium text-gray-800">{c.title}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{c.description}</div>
                </div>
              </li>
            ))}
          </ul>
          {allPass && (
            <div className="mt-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
              All checks passed. Your application appears ready for deployment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
