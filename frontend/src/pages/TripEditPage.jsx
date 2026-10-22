import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { apiService } from '../services/api';
import { DayTimeline } from '../components/DayTimeline';
import { BudgetSummary } from '../components/BudgetSummary';
import { ItineraryDaySkeleton } from '../components/SkeletonLoader';
import {
  Save,
  ArrowLeft,
  Calendar,
  Wallet,
  MapPin,
  Check,
  AlertCircle
} from 'lucide-react';

export const TripEditPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const {
    activeTrip,
    setActiveTrip,
    updateActivityInActiveTrip,
    addActivityToActiveTrip,
    deleteActivityFromActiveTrip,
    persistActiveTrip,
    showToast
  } = useTrips();

  const [loading, setLoading] = useState(!activeTrip || activeTrip.id !== tripId);
  const [isSaving, setIsSaving] = useState(false);
  const [metaForm, setMetaForm] = useState({
    title: '',
    destination: '',
    total_budget: 0,
    currency: 'USD'
  });

  useEffect(() => {
    const loadTrip = async () => {
      if (activeTrip && activeTrip.id === tripId) {
        setMetaForm({
          title: activeTrip.title,
          destination: activeTrip.destination,
          total_budget: activeTrip.total_budget,
          currency: activeTrip.currency || 'USD'
        });
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await apiService.getTrip(tripId);
        setActiveTrip(data);
        setMetaForm({
          title: data.title,
          destination: data.destination,
          total_budget: data.total_budget,
          currency: data.currency || 'USD'
        });
      } catch (err) {
        showToast('Trip not found', 'error');
        navigate('/trips');
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [tripId, activeTrip, setActiveTrip, navigate, showToast]);

  const handleMetaChange = (field, value) => {
    setMetaForm((prev) => ({ ...prev, [field]: value }));
    setActiveTrip((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await persistActiveTrip();
      navigate(`/itinerary/${activeTrip.id}`);
    } catch (err) {
      showToast('Error saving changes', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !activeTrip) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
        <ItineraryDaySkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <button
          onClick={() => navigate(`/itinerary/${activeTrip.id}`)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel & View Itinerary
        </button>

        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save & Publish Edits'}</span>
        </button>
      </div>

      {/* Meta Editor Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-subtle space-y-4">
        <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-stone-100">
          Trip Settings & Metadata
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Trip Title</label>
            <input
              type="text"
              value={metaForm.title}
              onChange={(e) => handleMetaChange('title', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Destination</label>
            <input
              type="text"
              value={metaForm.destination}
              onChange={(e) => handleMetaChange('destination', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Total Target Budget</label>
            <input
              type="number"
              value={metaForm.total_budget}
              onChange={(e) => handleMetaChange('total_budget', Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Real-time Budget Recalculator */}
      <BudgetSummary trip={activeTrip} />

      {/* Day by Day Editor */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900">
          Schedule & Activity Management
        </h3>
        <p className="text-xs text-slate-500 -mt-4">
          Click any activity to edit its details, duration, or cost. All budget totals recalculate instantly.
        </p>

        {activeTrip.days?.map((day) => (
          <DayTimeline
            key={day.id}
            day={day}
            currency={activeTrip.currency}
            editable={true}
            onUpdateActivity={updateActivityInActiveTrip}
            onAddActivity={addActivityToActiveTrip}
            onDeleteActivity={deleteActivityFromActiveTrip}
          />
        ))}
      </div>
    </div>
  );
};
