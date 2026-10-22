import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, X, KeyRound, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DemoBanner = () => {
  const { isDemoMode } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (!isDemoMode || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white px-4 py-2.5 text-xs sm:text-sm font-medium shadow-subtle no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" /> Demo Mode Active
          </span>
          <span className="text-slate-300 truncate hidden sm:inline">
            Exploring with simulated AI & local persistence. Add credentials in <code className="bg-slate-800 text-teal-200 px-1 py-0.5 rounded">frontend/.env</code> for live Supabase sync.
          </span>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            to="/settings"
            className="inline-flex items-center gap-1 text-teal-300 hover:text-white underline underline-offset-2 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Config Status</span>
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-1 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
