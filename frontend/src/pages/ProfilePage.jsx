import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { User, Mail, DollarSign, Heart, Compass, ShieldCheck, Check } from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { showToast } = useTrips();

  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || 'Traveler',
    email: user?.email || 'traveler@wanderwise.demo',
    home_currency: user?.home_currency || 'USD',
    travel_style: user?.preferences?.travel_style || 'balanced',
    daily_pace: user?.preferences?.pace || 'moderate',
    dietary: user?.preferences?.dietary || 'Vegetarian options preferred',
    accessibility: 'Standard walkability, prefers elevator access'
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    showToast('Traveler profile and preferences updated!', 'success');
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="pb-4 border-b border-stone-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Traveler Profile & Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Customize your default travel presets so new itineraries match your rhythm automatically.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-card flex flex-col sm:flex-row items-center gap-6">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt="Profile Avatar"
            className="w-20 h-20 rounded-full object-cover ring-4 ring-teal-500/20"
          />
          <div className="flex-1 space-y-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900">{profileData.full_name}</h2>
            <p className="text-xs text-slate-400">{profileData.email}</p>
            <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold border border-teal-200">
                Verified Explorer
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-slate-600 text-[11px] font-medium">
                Default Currency: {profileData.home_currency}
              </span>
            </div>
          </div>
        </div>

        {/* Preferences Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-card space-y-6">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-stone-100">
            Travel Defaults
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={profileData.full_name}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Primary Currency</label>
              <select
                value={profileData.home_currency}
                onChange={(e) => setProfileData({ ...profileData, home_currency: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Preferred Travel Style</label>
              <select
                value={profileData.travel_style}
                onChange={(e) => setProfileData({ ...profileData, travel_style: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 capitalize"
              >
                <option value="budget">Budget (Hostels, public transit)</option>
                <option value="balanced">Balanced (Boutique, mix of dining)</option>
                <option value="luxury">Luxury (High-end resorts, private tours)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Default Daily Pace</label>
              <select
                value={profileData.daily_pace}
                onChange={(e) => setProfileData({ ...profileData, daily_pace: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 capitalize"
              >
                <option value="relaxed">Relaxed (1-2 main highlights, slow pace)</option>
                <option value="moderate">Moderate (2-3 highlights, balanced)</option>
                <option value="packed">Packed (Early morning to late evening)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Dietary Notes</label>
              <input
                type="text"
                value={profileData.dietary}
                onChange={(e) => setProfileData({ ...profileData, dietary: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Accessibility Preferences</label>
              <input
                type="text"
                value={profileData.accessibility}
                onChange={(e) => setProfileData({ ...profileData, accessibility: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{isSaved ? 'Saved!' : 'Save Preferences'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
