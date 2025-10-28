import React from 'react';
import { Wrench, Copy, Check } from 'lucide-react';

export default function FixSuggestions({ suggestions, onCopyAll, copied }) {
  const has = suggestions && suggestions.length > 0;
  return (
    <section className="max-w-6xl mx-auto px-6 mt-8">
      <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-gray-700" />
            <h3 className="font-medium text-gray-800">Fix Suggestions</h3>
          </div>
          <button onClick={onCopyAll} className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md bg-white border border-gray-200 hover:bg-gray-100 text-gray-700">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied' : 'Copy all'}
          </button>
        </div>
        <div className="p-4">
          {!has && <div className="text-sm text-gray-600">No suggestions yet. Run an analysis to generate actionable fixes.</div>}
          {has && (
            <ol className="list-decimal pl-6 space-y-3 text-sm text-gray-800">
              {suggestions.map((s, idx) => (
                <li key={`sugg-${idx}`} className="leading-relaxed">
                  <span className="font-medium">{s.title}:</span> {s.detail}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
