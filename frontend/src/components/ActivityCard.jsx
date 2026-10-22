import React, { useState } from 'react';
import { formatCurrency, formatDurationMinutes } from '../utils/formatters';
import {
  Clock,
  MapPin,
  Tag,
  DollarSign,
  Info,
  Edit2,
  Trash2,
  Check,
  X,
  Utensils,
  Compass,
  Sparkles
} from 'lucide-react';

export const ActivityCard = ({
  activity,
  currency = 'USD',
  onUpdate,
  onDelete,
  editable = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: activity.title,
    description: activity.description,
    start_time: activity.start_time,
    duration_minutes: activity.duration_minutes,
    estimated_cost: activity.estimated_cost,
    location_name: activity.location_name,
    booking_tip: activity.booking_tip || '',
    category: activity.category || 'sightseeing'
  });

  const handleSave = () => {
    onUpdate({
      ...formData,
      duration_minutes: Number(formData.duration_minutes),
      estimated_cost: Number(formData.estimated_cost)
    });
    setIsEditing(false);
  };

  const getSlotColor = (slot) => {
    switch (slot) {
      case 'morning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'afternoon':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'evening':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-stone-50 text-slate-700 border-stone-200';
    }
  };

  const getCategoryBadge = (category) => {
    const map = {
      food: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      culture: 'bg-purple-50 text-purple-700 border-purple-200',
      sightseeing: 'bg-teal-50 text-teal-700 border-teal-200',
      shopping: 'bg-pink-50 text-pink-700 border-pink-200',
      relaxation: 'bg-blue-50 text-blue-700 border-blue-200',
      adventure: 'bg-orange-50 text-orange-700 border-orange-200'
    };
    return map[category] || 'bg-stone-100 text-slate-700 border-stone-200';
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl border-2 border-teal-500/50 p-5 shadow-elevated space-y-4 animate-in fade-in duration-150">
        <div className="flex justify-between items-center pb-2 border-b border-stone-100">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Editing Activity
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-stone-100"
              aria-label="Cancel editing"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm"
            >
              <Check className="w-3.5 h-3.5" /> Save
            </button>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Time</label>
              <input
                type="text"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs"
                placeholder="09:00"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Duration (min)</label>
              <input
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cost ({currency})</label>
              <input
                type="number"
                value={formData.estimated_cost}
                onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location_name}
                onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Booking Tip</label>
            <input
              type="text"
              value={formData.booking_tip}
              onChange={(e) => setFormData({ ...formData, booking_tip: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs"
              placeholder="e.g., Reserve 2 weeks ahead"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl border border-stone-200 p-5 shadow-subtle hover:shadow-card hover:border-stone-300 transition-all duration-200 relative">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getSlotColor(
              activity.time_slot
            )}`}
          >
            {activity.time_slot}
          </span>
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider border ${getCategoryBadge(
              activity.category
            )}`}
          >
            {activity.category}
          </span>
          {activity.meal_type && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
              <Utensils className="w-3 h-3" />
              {activity.meal_type}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="text-right">
            <span className="text-sm font-extrabold text-slate-900">
              {Number(activity.estimated_cost) === 0 ? 'Free' : formatCurrency(activity.estimated_cost, currency)}
            </span>
            <span className="block text-[10px] text-slate-400">estimated</span>
          </div>

          {editable && (
            <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity no-print">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors"
                title="Edit activity"
                aria-label="Edit activity"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Remove activity"
                aria-label="Remove activity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <h4 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
        {activity.title}
      </h4>

      <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
        {activity.description}
      </p>

      {/* Meta details footer */}
      <div className="mt-3.5 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
        {activity.start_time && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{activity.start_time} ({formatDurationMinutes(activity.duration_minutes)})</span>
          </div>
        )}

        {activity.location_name && (
          <div className="flex items-center gap-1.5 truncate max-w-xs">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{activity.location_name}</span>
          </div>
        )}
      </div>

      {activity.booking_tip && (
        <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-teal-800 bg-teal-50/80 border border-teal-100 rounded-lg p-2">
          <Info className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
          <span><strong>Local Tip:</strong> {activity.booking_tip}</span>
        </div>
      )}
    </div>
  );
};
