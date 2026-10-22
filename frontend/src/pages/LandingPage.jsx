import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import {
  Compass,
  Sparkles,
  MapPin,
  Calendar,
  Wallet,
  Clock,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Star,
  Luggage,
  Coffee,
  Globe2
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { trips, setActiveTrip } = useTrips();

  const handleOpenSampleTrip = (tripId) => {
    const sample = trips.find(t => t.id === tripId) || trips[0];
    if (sample) {
      setActiveTrip(sample);
      navigate(`/itinerary/${sample.id}`);
    } else {
      navigate('/plan');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Soft background glow accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-teal-100/60 via-stone-100/30 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 shadow-sm text-teal-800 text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
              <span>Next-Gen AI Travel Planning Engineered for Real Travelers</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Effortless Itineraries <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600">
                Tailored to Your Pace & Budget
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Skip weeks of scattered tab research. WanderWise synthesizes your exact travel style, dietary choices, and spending goals into day-by-day itineraries you can edit, recalculate, and export.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/plan"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-base shadow-lg shadow-teal-600/25 transition-all transform hover:-translate-y-0.5"
              >
                <Compass className="w-5 h-5" />
                Plan Your Trip with AI
              </Link>
              <button
                onClick={() => handleOpenSampleTrip('trip-tokyo-demo')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-slate-800 font-semibold text-base border border-stone-200 shadow-subtle transition-all"
              >
                <span>Explore Tokyo Sample</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Quick Proof Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" /> Free Demo Mode (No card required)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" /> Instant PDF & Print Export
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" /> Dynamic Budget Recalculator
              </span>
            </div>
          </div>

          {/* Interactive Feature Showcase Card */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 shadow-elevated border border-stone-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-700 font-bold text-xs uppercase tracking-wider">
                      Live Sample Preview
                    </span>
                    <span className="text-xs text-slate-400 font-medium">5-Day Cultural Journey</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    Tokyo Neon & Heritage Explorer
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-stone-100 text-slate-700 text-xs font-semibold">
                    Moderate Pace
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    Est. $3,200 USD
                  </span>
                </div>
              </div>

              {/* Sample Day Preview */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800">Morning 09:00</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">Senso-ji & Nakamise Alley</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Explore ancient temple incense halls, followed by artisanal warm dango and matcha cakes.
                  </p>
                  <span className="mt-3 block text-xs font-bold text-amber-900">$20 est.</span>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-sky-800">Afternoon 14:30</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">teamLab Planets Digital Art</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Wade through reflective water rooms and infinite crystal installations in Toyosu.
                  </p>
                  <span className="mt-3 block text-xs font-bold text-sky-900">$85 est.</span>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-800">Evening 19:00</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">Omoide Yokocho Izakaya</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Lantern-lit Shinjuku alley skewers, grilled yakitori, and friendly neighborhood counters.
                  </p>
                  <span className="mt-3 block text-xs font-bold text-indigo-900">$70 est.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-teal-600 mb-2">
              Simple 3-Step Workflow
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How WanderWise Plans Your Perfect Journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-100 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-teal-600/20">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">Share Your Travel Style</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Choose dates, destinations, budget tier, daily pace, dietary preferences, and traveler count in our 5-step wizard.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-100 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-teal-600/20">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI Synthesizes Itinerary</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our AI engine balances morning, afternoon, and evening experiences, factoring in transit tips and dining spots.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-100 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-teal-600/20">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">Tweak, Recalculate & Export</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Add activities, modify times, regenerate individual days, and export a clean PDF for offline travel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Value Props */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-subtle space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Real Budget Transparency</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Clear cost breakdowns across lodging, dining, transit, and excursions with instant warnings if you exceed your target.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-subtle space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Paced to Prevent Burnout</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Whether you prefer relaxed café mornings or packed adventure days, activities are spaced realistically.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-subtle space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Database Security & RLS</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Row Level Security in Supabase ensures your saved trips are encrypted and accessible strictly by your verified user ID.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">WanderWise</span>
            <span className="text-xs text-slate-400">© 2026 WanderWise. Production Ready.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link to="/plan" className="hover:text-white transition-colors">Plan Trip</Link>
            <Link to="/trips" className="hover:text-white transition-colors">Saved Itineraries</Link>
            <Link to="/settings" className="hover:text-white transition-colors">System Diagnostics</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
