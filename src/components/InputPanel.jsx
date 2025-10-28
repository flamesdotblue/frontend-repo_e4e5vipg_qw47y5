import React, { useState } from 'react';
import { Upload, Broom, Play } from 'lucide-react';

export default function InputPanel({ value, onChange, onAnalyze, onClear, options, onToggleOption }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange(String(reader.result || ''));
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  return (
    <section className="max-w-6xl mx-auto px-6 mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={[
              'border rounded-xl overflow-hidden bg-white shadow-sm transition-all',
              dragOver ? 'ring-2 ring-indigo-500 border-indigo-300' : 'border-gray-200',
            ].join(' ')}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-700">
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Paste logs or code here (or drop a file)</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={onClear} className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md bg-white border border-gray-200 hover:bg-gray-100 text-gray-700">
                  <Broom className="w-4 h-4" /> Clear
                </button>
                <button onClick={onAnalyze} className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Play className="w-4 h-4" /> Analyze
                </button>
              </div>
            </div>
            <textarea
              className="w-full h-64 p-4 font-mono text-sm outline-none resize-y"
              placeholder={"Paste stack traces, console output, failing tests, or code snippets..."}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div className="border border-gray-200 rounded-xl bg-white shadow-sm p-4">
            <h3 className="font-medium text-gray-800 mb-3">Analysis Options</h3>
            <div className="space-y-2">
              <Toggle label="Static heuristics" checked={options.heuristics} onChange={() => onToggleOption('heuristics')} />
              <Toggle label="Runtime hints" checked={options.runtimeHints} onChange={() => onToggleOption('runtimeHints')} />
              <Toggle label="Dependency health" checked={options.deps} onChange={() => onToggleOption('deps')} />
              <Toggle label="Security lint" checked={options.security} onChange={() => onToggleOption('security')} />
            </div>
            <p className="text-xs text-gray-500 mt-3">Files are processed locally in your browser. Nothing is uploaded.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
      <span className="text-sm text-gray-700">{label}</span>
      <span className={`w-10 h-6 rounded-full p-1 transition ${checked ? 'bg-indigo-600' : 'bg-gray-300'}`} onClick={onChange}>
        <span className={`block h-4 w-4 bg-white rounded-full transition ${checked ? 'translate-x-4' : ''}`}></span>
      </span>
    </label>
  );
}
