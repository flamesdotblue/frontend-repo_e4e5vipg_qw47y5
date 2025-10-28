import React from 'react';
import { Bug, ShieldCheck, Rocket } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur">
            <Bug className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Debug Doctor</h1>
            <p className="text-white/90 text-sm md:text-base">Deep debugging and automated error removal — get your app deployment-ready</p>
          </div>
        </div>
        <div className="md:ml-auto flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-white/90">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm">Safe & local analysis</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-white/90">
            <Rocket className="w-5 h-5" />
            <span className="text-sm">Deploy with confidence</span>
          </div>
        </div>
      </div>
    </header>
  );
}
