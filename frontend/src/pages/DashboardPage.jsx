import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Compass,
  PlusCircle,
  Bookmark,
  Calendar,
  Wallet,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';

export const DashboardPage = () => {
  const { trips, setActiveTrip } = useTrips();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Metrics computation
  const totalTrips = trips.length;
  const totalDays = trips.reduce((acc, t) => acc + (t.total_days || 1), 0);
  const totalBudgetManaged = trips.reduce((acc, t) => acc + Number(t.total_budget || 0), 0);

  const curatedDestinations = [
    {
      city: 'Kyoto, Japan',
      tag: 'Culture & Zen Gardens',
      days: 5,
      budget: '$2,400',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80'
    },
    {
      city: 'Amalfi Coast, Italy',
      tag: 'Scenic Romance & Coastal Food',
      days: 4,
      budget: '€3,100',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80'
    },
    {
      city: 'Banff, Canada',
      tag: 'Alpine Glaciers & Nature',
      days: 6,
      budget: '$2,800',
      image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const handleOpenTrip = (trip) => {
    setActiveTrip(trip);
    navigate(`/itinerary/${trip.id}`);
  };

  const handleQuickInspiration = (destination) => {
    navigate('/plan', { state: { prefillDestination: destination } });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-elevated">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Traveler Headquarters</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Traveler'}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            Where to next? Craft your next bespoke travel itinerary in minutes or pick up where you left off.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/plan"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md shadow-teal-600/30 transition-all transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" />
            Plan New Trip
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold flex-shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Saved Trips</p>
            <p className="text-2xl font-black text-slate-900">{totalTrips}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Days Planned</p>
            <p className="text-2xl font-black text-slate-900">{totalDays} Days</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Managed Budget</p>
            <p className="text-2xl font-black text-slate-900">{formatCurrency(totalBudgetManaged, 'USD')}</p>
          </div>
        </div>
      </div>

      {/* Recent Trips Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Active Itineraries</h2>
            <p className="text-xs text-slate-500">Access and edit your personalized travel schedules</p>
          </div>
          <Link
            to="/trips"
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.slice(0, 3).map((trip) => (
              <div
                key={trip.id}
                onClick={() => handleOpenTrip(trip)}
                className="group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-subtle hover:shadow-card hover:border-teal-300 transition-all duration-200 cursor-pointer flex flex-col"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={trip.cover_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold">
                    {trip.total_days} Days
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-teal-700 font-semibold mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{trip.destination}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition-colors line-clamp-1">
                      {trip.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      {formatDate(trip.start_date)}
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {formatCurrency(trip.total_budget, trip.currency)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
            <Compass className="w-10 h-10 text-teal-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Trips Created Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Launch our 5-step AI wizard to generate your first custom travel itinerary.
            </p>
            <Link
              to="/plan"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Plan Your First Trip
            </Link>
          </div>
        )}
      </section>

      {/* Curated AI Inspiration Destinations */}
      <section className="space-y-4 pt-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <h2 className="text-xl font-bold text-slate-900">Curated Inspiration</h2>
          </div>
          <p className="text-xs text-slate-500">Pre-tuned AI prompts for trending world destinations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {curatedDestinations.map((dest) => (
            <div
              key={dest.city}
              className="group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-subtle hover:shadow-card transition-all flex flex-col"
            >
              <div className="h-40 relative overflow-hidden bg-slate-100">
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-semibold">
                  {dest.tag}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{dest.city}</h3>
                  <p className="text-xs text-slate-500 mt-1">Suggested {dest.days} days • Typical {dest.budget}</p>
                </div>
                <button
                  onClick={() => handleQuickInspiration(dest.city)}
                  className="mt-4 w-full py-2 rounded-xl bg-stone-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Build {dest.city.split(',')[0]} Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
