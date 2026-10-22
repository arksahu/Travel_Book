import React, { useState } from 'react';
import { ActivityCard } from './ActivityCard';
import { formatDate, formatCurrency } from '../utils/formatters';
import {
  Calendar,
  Sparkles,
  BedDouble,
  Bus,
  Plus,
  RefreshCw,
  Clock,
  MapPin,
  X,
  Check
} from 'lucide-react';

export const DayTimeline = ({
  day,
  currency = 'USD',
  onUpdateActivity,
  onAddActivity,
  onDeleteActivity,
  onRegenerateDay,
  editable = false
}) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    time_slot: 'morning',
    start_time: '10:00',
    duration_minutes: 90,
    estimated_cost: 25,
    location_name: '',
    category: 'sightseeing',
    booking_tip: ''
  });

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerateDay(day.id, day.day_number, day);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newActivity.title.trim()) return;
    onAddActivity(day.id, {
      ...newActivity,
      duration_minutes: Number(newActivity.duration_minutes),
      estimated_cost: Number(newActivity.estimated_cost)
    });
    setNewActivity({
      title: '',
      description: '',
      time_slot: 'morning',
      start_time: '10:00',
      duration_minutes: 90,
      estimated_cost: 25,
      location_name: '',
      category: 'sightseeing',
      booking_tip: ''
    });
    setShowAddModal(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-card mb-8">
      {/* Day Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-extrabold uppercase tracking-widest">
              Day {day.day_number}
            </span>
            {day.date && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(day.date)}
              </span>
            )}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            {day.summary || `Day ${day.day_number} Itinerary`}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-xs text-slate-400 block font-medium">Day's Est. Cost</span>
            <span className="text-sm font-extrabold text-teal-700">
              {formatCurrency(day.estimated_daily_cost || 0, currency)}
            </span>
          </div>

          {editable && onRegenerateDay && (
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-slate-700 transition-colors disabled:opacity-50 no-print"
              title="Regenerate this specific day's activities"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-teal-600' : ''}`} />
              <span className="hidden sm:inline">Regenerate Day</span>
            </button>
          )}
        </div>
      </div>

      {/* Transit & Lodging Highlights */}
      {(day.accommodation || day.transit_tip) && (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {day.accommodation && (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 flex-shrink-0">
                <BedDouble className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-950 truncate">
                    {day.accommodation.name}
                  </span>
                  {day.accommodation.estimated_cost && (
                    <span className="font-extrabold text-indigo-900 ml-2">
                      {formatCurrency(day.accommodation.estimated_cost, currency)}/night
                    </span>
                  )}
                </div>
                {day.accommodation.booking_tip && (
                  <p className="text-indigo-800/80 mt-1 leading-relaxed">
                    {day.accommodation.booking_tip}
                  </p>
                )}
              </div>
            </div>
          )}

          {day.transit_tip && (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-sky-50/50 border border-sky-100">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700 flex-shrink-0">
                <Bus className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-sky-950 block">Transit Recommendation</span>
                <p className="text-sky-800/80 mt-1 leading-relaxed">{day.transit_tip}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Activities Timeline */}
      <div className="mt-6 space-y-4">
        {day.activities && day.activities.length > 0 ? (
          day.activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              currency={currency}
              editable={editable}
              onUpdate={(updated) => onUpdateActivity(day.id, activity.id, updated)}
              onDelete={() => onDeleteActivity(day.id, activity.id)}
            />
          ))
        ) : (
          <div className="p-8 text-center rounded-2xl border-2 border-dashed border-stone-200 text-slate-400 text-sm">
            No activities scheduled for this day yet.
          </div>
        )}
      </div>

      {/* Add Activity Trigger */}
      {editable && (
        <div className="mt-6 pt-4 border-t border-stone-100 flex justify-center no-print">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-stone-300 hover:border-teal-500 hover:bg-teal-50/50 text-slate-700 hover:text-teal-700 text-xs font-semibold transition-all"
          >
            <Plus className="w-4 h-4" /> Add Activity to Day {day.day_number}
          </button>
        </div>
      )}

      {/* Add Activity Modal Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-elevated border border-stone-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <h4 className="font-bold text-slate-900 text-base">
                Add Activity to Day {day.day_number}
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Activity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Imperial Palace Garden Walking Tour"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Details, what to see, key highlights..."
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Slot</label>
                  <select
                    value={newActivity.time_slot}
                    onChange={(e) => setNewActivity({ ...newActivity, time_slot: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={newActivity.start_time}
                    onChange={(e) => setNewActivity({ ...newActivity, start_time: e.target.value })}
                    placeholder="10:00"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Est. Cost ({currency})</label>
                  <input
                    type="number"
                    value={newActivity.estimated_cost}
                    onChange={(e) => setNewActivity({ ...newActivity, estimated_cost: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location Name</label>
                  <input
                    type="text"
                    placeholder="Location or neighborhood"
                    value={newActivity.location_name}
                    onChange={(e) => setNewActivity({ ...newActivity, location_name: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newActivity.category}
                    onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200"
                  >
                    <option value="sightseeing">Sightseeing</option>
                    <option value="food">Food & Dining</option>
                    <option value="culture">Culture & History</option>
                    <option value="relaxation">Relaxation</option>
                    <option value="adventure">Adventure & Outdoors</option>
                    <option value="shopping">Shopping</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-sm"
                >
                  Add Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
