import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { formatDate, formatCurrency } from '../utils/formatters';
import {
  Compass,
  PlusCircle,
  Search,
  MapPin,
  Calendar,
  Wallet,
  Trash2,
  Edit3,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

export const SavedTripsPage = () => {
  const { trips, setActiveTrip, removeTrip } = useTrips();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStyle, setFilterStyle] = useState('all');
  const [tripToDelete, setTripToDelete] = useState(null);

  const filteredTrips = trips.filter((t) => {
    const matchesSearch =
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destination?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStyle = filterStyle === 'all' || t.travel_style === filterStyle;
    return matchesSearch && matchesStyle;
  });

  const handleOpenTrip = (trip) => {
    setActiveTrip(trip);
    navigate(`/itinerary/${trip.id}`);
  };

  const handleEditTrip = (trip, e) => {
    e.stopPropagation();
    setActiveTrip(trip);
    navigate(`/trips/${trip.id}/edit`);
  };

  const handleDeleteClick = (trip, e) => {
    e.stopPropagation();
    setTripToDelete(trip);
  };

  const handleConfirmDelete = async () => {
    if (tripToDelete) {
      await removeTrip(tripToDelete.id);
      setTripToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Saved Itineraries
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse, manage, and edit all your personalized AI travel plans.
          </p>
        </div>

        <Link
          to="/plan"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          Plan New Trip
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-subtle">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by city, title, country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={filterStyle}
            onChange={(e) => setFilterStyle(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Styles</option>
            <option value="budget">Budget</option>
            <option value="balanced">Balanced</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => handleOpenTrip(trip)}
              className="group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-subtle hover:shadow-card hover:border-teal-300 transition-all duration-200 cursor-pointer flex flex-col"
            >
              <div className="relative h-44 overflow-hidden bg-slate-900">
                <img
                  src={trip.cover_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'}
                  alt={trip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold">
                  {trip.total_days} Days
                </span>
                <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-teal-600/90 backdrop-blur-sm text-white text-[11px] font-bold capitalize">
                  {trip.travel_style}
                </span>
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
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Target Budget</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {formatCurrency(trip.total_budget, trip.currency)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleEditTrip(trip, e)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors"
                      title="Edit Itinerary"
                      aria-label="Edit Itinerary"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(trip, e)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Trip"
                      aria-label="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
          <Compass className="w-10 h-10 text-teal-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No matching itineraries found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No itineraries matched "${searchQuery}". Try a different keyword.`
              : 'You haven’t saved any trips yet. Generate your first one with our AI builder!'}
          </p>
          <Link
            to="/plan"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Plan a Trip Now
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(tripToDelete)}
        title="Delete Itinerary?"
        message={`Are you sure you want to permanently delete "${tripToDelete?.title}"? All scheduled days and activities will be removed.`}
        confirmText="Delete Itinerary"
        onConfirm={handleConfirmDelete}
        onCancel={() => setTripToDelete(null)}
      />
    </div>
  );
};
