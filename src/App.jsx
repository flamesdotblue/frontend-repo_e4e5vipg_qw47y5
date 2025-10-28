import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import AnalysisPanel from './components/AnalysisPanel';
import FixSuggestions from './components/FixSuggestions';
import ReadinessChecklist from './components/ReadinessChecklist';

function analyzeText(text, opts) {
  const lower = text.toLowerCase();
  const lines = text.split(/\r?\n/);
  const mkFinding = (tag, message) => ({ tag, message });

  const errors = [];
  const warnings = [];
  const infos = [];

  lines.forEach((line) => {
    const l = line.toLowerCase();
    if (/\berror\b|\bexception\b|\bfail(ed)?\b|\bfatal\b/.test(l)) {
      errors.push(mkFinding('runtime', line.trim()));
    } else if (/\bwarn(ing)?\b|\bdeprecated\b|\bmissing\b/.test(l)) {
      warnings.push(mkFinding('lint', line.trim()));
    } else if (l.includes('not found') || l.includes('undefined')) {
      errors.push(mkFinding('reference', line.trim()));
    } else if (l.includes('timeout') || l.includes('retry')) {
      warnings.push(mkFinding('network', line.trim()));
    } else if (l.includes('version') || l.includes('build')) {
      infos.push(mkFinding('build', line.trim()));
    }
  });

  if (opts.deps && /npm|yarn|pnpm|pip/.test(lower)) {
    warnings.push(mkFinding('deps', 'Potential dependency issues detected in logs. Ensure lockfile is up to date and reinstall dependencies.'));
  }
  if (opts.security && /(eval\(|crypto|md5|sha1)/.test(lower)) {
    warnings.push(mkFinding('security', 'Potential insecure usage detected. Review cryptography and eval usage.'));
  }

  return { errors, warnings, infos };
}

function makeSuggestions(findings) {
  const out = [];
  if (findings.errors.some(f => f.tag === 'reference')) {
    out.push({ title: 'Fix undefined or not-found references', detail: 'Verify imports/exports and file paths. For React, ensure named vs default imports are correct and paths are case-accurate.' });
  }
  if (findings.errors.some(f => f.tag === 'runtime')) {
    out.push({ title: 'Stabilize runtime with guards', detail: 'Add null/undefined checks before property access, and wrap async calls in try/catch with meaningful error messages.' });
  }
  if (findings.warnings.some(f => f.tag === 'lint')) {
    out.push({ title: 'Address deprecations', detail: 'Replace deprecated APIs and update library usage per latest docs. Enable eslint rules to catch them early.' });
  }
  if (findings.warnings.some(f => f.tag === 'network')) {
    out.push({ title: 'Harden network retries', detail: 'Implement exponential backoff, timeouts, and user-facing toasts for transient errors.' });
  }
  if (findings.warnings.some(f => f.tag === 'deps')) {
    out.push({ title: 'Repair dependencies', detail: 'Clear caches and reinstall: rm -rf node_modules && rm -f package-lock.json && npm install. For Python: pip install --upgrade --force-reinstall -r requirements.txt.' });
  }
  if (findings.errors.length === 0 && findings.warnings.length === 0) {
    out.push({ title: 'No critical issues found', detail: 'Run the readiness checks to validate build, routing, environment variables, and performance budget.' });
  }
  return out;
}

function simulateChecks(text) {
  const base = [
    { title: 'Build compiles without errors', description: 'Ensures no type or bundling errors block deployment.', status: 'running' },
    { title: 'Routes resolve and return 200', description: 'Verifies main pages render without client errors.', status: 'running' },
    { title: 'Environment variables present', description: 'Checks required runtime keys are defined.', status: 'running' },
    { title: 'Performance budget met', description: 'Quick lighthouse-like check for core vitals.', status: 'running' },
  ];
  // Simple heuristics: if text contains error words, fail one check
  const hasErrors = /error|exception|failed|not found|undefined/i.test(text);
  return base.map((c, i) => ({ ...c, status: hasErrors && i === 0 ? 'fail' : 'pass' }));
}

export default function App() {
  const [text, setText] = useState('');
  const [options, setOptions] = useState({ heuristics: true, runtimeHints: true, deps: true, security: true });
  const findings = useMemo(() => (text ? analyzeText(text, options) : { errors: [], warnings: [], infos: [] }), [text, options]);
  const suggestions = useMemo(() => makeSuggestions(findings), [findings]);
  const [checks, setChecks] = useState([
    { title: 'Build compiles without errors', description: 'Ensures no type or bundling errors block deployment.', status: 'pass' },
    { title: 'Routes resolve and return 200', description: 'Verifies main pages render without client errors.', status: 'pass' },
    { title: 'Environment variables present', description: 'Checks required runtime keys are defined.', status: 'pass' },
    { title: 'Performance budget met', description: 'Quick lighthouse-like check for core vitals.', status: 'pass' },
  ]);
  const [copied, setCopied] = useState(false);

  const onAnalyze = () => {
    // Analysis is computed via useMemo; just a UX hook for now
    // Could add spinners if needed
  };

  const onClear = () => {
    setText('');
  };

  const onToggleOption = (key) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onRunChecks = () => {
    // Set running state quickly, then finalize
    setChecks((prev) => prev.map((c) => ({ ...c, status: 'running' })));
    setTimeout(() => {
      setChecks(simulateChecks(text));
    }, 700);
  };

  const onCopyAll = async () => {
    const asText = suggestions.map((s, i) => `${i + 1}. ${s.title}: ${s.detail}`).join('\n');
    try {
      await navigator.clipboard.writeText(asText || 'No suggestions.');
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      setCopied(false);
      // Non-fatal
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <InputPanel
        value={text}
        onChange={setText}
        onAnalyze={onAnalyze}
        onClear={onClear}
        options={options}
        onToggleOption={onToggleOption}
      />
      <AnalysisPanel findings={findings} />
      <FixSuggestions suggestions={suggestions} onCopyAll={onCopyAll} copied={copied} />
      <ReadinessChecklist checks={checks} onRun={onRunChecks} />
      <footer className="max-w-6xl mx-auto px-6 py-10 text-center text-xs text-gray-500">
        Built with React & Tailwind. Paste logs, analyze, and ship with confidence.
      </footer>
    </div>
  );
}
