import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { apiService } from '../services/api';
import { DayTimeline } from '../components/DayTimeline';
import { BudgetSummary } from '../components/BudgetSummary';
import { ItineraryDaySkeleton } from '../components/SkeletonLoader';
import { triggerPrintItinerary } from '../utils/exportPdf';
import { formatDate } from '../utils/formatters';
import {
  Compass,
  Calendar,
  Printer,
  Edit3,
  BookmarkCheck,
  MapPin,
  Users,
  AlertTriangle,
  Sparkles,
  Share2,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';

export const ItineraryViewPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const {
    activeTrip,
    setActiveTrip,
    persistActiveTrip,
    updateActivityInActiveTrip,
    addActivityToActiveTrip,
    deleteActivityFromActiveTrip,
    showToast
  } = useTrips();

  const [loading, setLoading] = useState(!activeTrip || activeTrip.id !== tripId);
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      if (activeTrip && activeTrip.id === tripId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const found = await apiService.getTrip(tripId);
        setActiveTrip(found);
      } catch (err) {
        console.error('Failed to load trip', err);
        showToast('Trip not found', 'error');
        navigate('/trips');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId, activeTrip, setActiveTrip, navigate, showToast]);

  const handleSaveTrip = async () => {
    setIsSaving(true);
    try {
      await persistActiveTrip();
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerateDay = async (dayId, dayNumber, currentDay) => {
    try {
      const refreshedDay = await apiService.regenerateDay(activeTrip.id, dayNumber, currentDay);
      const newDays = activeTrip.days.map((d) => (d.id === dayId ? refreshedDay : d));
      const updatedTrip = { ...activeTrip, days: newDays };
      setActiveTrip(updatedTrip);
      showToast(`Day ${dayNumber} successfully refreshed!`, 'success');
    } catch (err) {
      showToast('Could not regenerate day', 'error');
    }
  };

  if (loading || !activeTrip) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
        <ItineraryDaySkeleton />
        <ItineraryDaySkeleton />
      </div>
    );
  }

  const selectedDay = activeTrip.days?.find((d) => d.day_number === selectedDayNumber) || activeTrip.days?.[0];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 no-print">
        <button
          onClick={() => navigate('/trips')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Saved Trips
        </button>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => triggerPrintItinerary(activeTrip.title)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-slate-700 text-xs font-semibold shadow-subtle transition-all"
            title="Export clean PDF or print"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print / PDF</span>
          </button>

          <Link
            to={`/trips/${activeTrip.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-slate-700 text-xs font-semibold shadow-subtle transition-all"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Schedule</span>
          </Link>

          <button
            onClick={handleSaveTrip}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Itinerary'}</span>
          </button>
        </div>
      </div>

      {/* Trip Hero Header */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-card">
        <div className="relative h-48 sm:h-64 bg-slate-900">
          <img
            src={activeTrip.cover_image || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80'}
            alt={activeTrip.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider">
                {activeTrip.total_days} Days Plan
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[11px] font-semibold capitalize">
                {activeTrip.travel_type} • {activeTrip.travel_style}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[11px] font-semibold capitalize">
                {activeTrip.daily_pace} Pace
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              {activeTrip.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                {activeTrip.destination}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                {formatDate(activeTrip.start_date)} - {formatDate(activeTrip.end_date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-400" />
                {activeTrip.travelers_count} Traveler{activeTrip.travelers_count > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Tracker Component */}
      <BudgetSummary trip={activeTrip} />

      {/* Assumptions / Travel Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>AI Planning Note:</strong> Activity costs, travel durations, and dining estimates are tailored AI approximations based on seasonal averages. Live ticket availability, exact operating hours, and exchange rates should be verified with official venues before booking.
        </div>
      </div>

      {/* Day Selector Tabs (interactive on screen, prints all days on print) */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-print border-b border-stone-200">
          {activeTrip.days?.map((day) => (
            <button
              key={day.id}
              onClick={() => setSelectedDayNumber(day.day_number)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                selectedDayNumber === day.day_number
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-stone-200 text-slate-600 hover:bg-stone-50'
              }`}
            >
              <span>Day {day.day_number}</span>
              <span className="text-[10px] opacity-70">({formatDate(day.date, { month: 'numeric', day: 'numeric' })})</span>
            </button>
          ))}
          <button
            onClick={() => setSelectedDayNumber('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedDayNumber === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-stone-200 text-slate-600 hover:bg-stone-50'
            }`}
          >
            View All Days
          </button>
        </div>

        {/* Timeline View */}
        {selectedDayNumber === 'all' ? (
          <div className="space-y-8">
            {activeTrip.days?.map((d) => (
              <DayTimeline
                key={d.id}
                day={d}
                currency={activeTrip.currency}
                editable={false}
                onRegenerateDay={handleRegenerateDay}
              />
            ))}
          </div>
        ) : (
          selectedDay && (
            <DayTimeline
              day={selectedDay}
              currency={activeTrip.currency}
              editable={true}
              onUpdateActivity={updateActivityInActiveTrip}
              onAddActivity={addActivityToActiveTrip}
              onDeleteActivity={deleteActivityFromActiveTrip}
              onRegenerateDay={handleRegenerateDay}
            />
          )
        )}
      </div>
    </div>
  );
};
