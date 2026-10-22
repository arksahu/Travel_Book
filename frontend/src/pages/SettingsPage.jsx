import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { apiService } from '../services/api';
import { SAMPLE_TRIPS } from '../services/mockData';
import {
  Settings,
  Database,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const SettingsPage = () => {
  const { isDemoMode, isSupabaseConfigured, toggleDemoMode } = useAuth();
  const { showToast, refreshTrips } = useTrips();

  const [backendHealth, setBackendHealth] = useState({ online: false, checking: true });

  useEffect(() => {
    const check = async () => {
      const res = await apiService.checkHealth();
      setBackendHealth({ online: res.online, checking: false, data: res.data });
    };
    check();
  }, []);

  const handleResetDemoData = () => {
    localStorage.setItem('wanderwise_demo_trips', JSON.stringify(SAMPLE_TRIPS));
    refreshTrips();
    showToast('Demo trips reset to initial samples', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="pb-4 border-b border-stone-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          System Settings & Status
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Inspect backend connectivity, database configuration, and environment setup.
        </p>
      </div>

      {/* Connectivity Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Backend API status */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">FastAPI Backend</span>
            <Cpu className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${backendHealth.online ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
            <span className="font-extrabold text-sm text-slate-900">
              {backendHealth.online ? 'Online & Connected' : 'Simulated (Demo Mode)'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {backendHealth.online ? 'Serving on http://localhost:8000' : 'Offline. Running with client mock engine.'}
          </p>
        </div>

        {/* Supabase status */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Supabase DB</span>
            <Database className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <span className="font-extrabold text-sm text-slate-900">
              {isSupabaseConfigured ? 'Connected (RLS Active)' : 'Demo Storage Active'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {isSupabaseConfigured ? 'PostgreSQL with Row Level Security' : 'Persistent via browser localStorage.'}
          </p>
        </div>

        {/* AI Provider */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Service</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="font-extrabold text-sm text-slate-900">
              {backendHealth.online ? 'Gemini / OpenAI API' : 'Dynamic Local AI'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Structured JSON schemas validated with Pydantic.
          </p>
        </div>
      </div>

      {/* Demo Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-card space-y-4">
        <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-stone-100">
          Development & Demo Controls
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
          <div>
            <p className="font-bold text-slate-900 text-sm">Reset Sample Itineraries</p>
            <p className="text-xs text-slate-500">
              Restore the factory default demo itineraries (Tokyo & Paris) if any activities were deleted.
            </p>
          </div>
          <button
            onClick={handleResetDemoData}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-slate-700 text-xs font-semibold shadow-subtle transition-all w-fit"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Configuration Guide */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-card space-y-4">
        <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-stone-100">
          How to connect real Supabase and AI Keys
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed">
          WanderWise works out of the box in Demo Mode. To connect your live cloud databases and AI credentials, populate the following files:
        </p>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="font-bold text-slate-900 block mb-1">1. Frontend Environment (<code className="text-teal-700">frontend/.env</code>)</span>
            <pre className="text-slate-600 font-mono text-[11px] overflow-x-auto">
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_API_BASE_URL=http://localhost:8000
            </pre>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="font-bold text-slate-900 block mb-1">2. Backend Environment (<code className="text-teal-700">backend/.env</code>)</span>
            <pre className="text-slate-600 font-mono text-[11px] overflow-x-auto">
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-service-role-or-anon-key
GEMINI_API_KEY=your-gemini-api-key
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
