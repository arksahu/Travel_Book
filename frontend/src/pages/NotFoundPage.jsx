import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, MapPin } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-stone-50 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-card space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        <span className="text-4xl font-black text-slate-900 block">404</span>
        <h1 className="text-xl font-bold text-slate-900">Destination Off the Map</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          The travel coordinates you followed don't lead to an active itinerary. Let's redirect you back to known ground.
        </p>
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
