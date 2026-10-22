import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { Wallet, AlertCircle, CheckCircle, TrendingUp, BedDouble, Utensils, Compass, Bus } from 'lucide-react';

export const BudgetSummary = ({ trip }) => {
  if (!trip) return null;

  const currency = trip.currency || 'USD';
  const totalBudget = Number(trip.total_budget || 0);

  // Compute breakdowns
  let activityCost = 0;
  let foodCost = 0;
  let lodgingCost = 0;
  let otherCost = 0;

  trip.days?.forEach((day) => {
    // Lodging
    if (day.accommodation?.estimated_cost) {
      lodgingCost += Number(day.accommodation.estimated_cost);
    }
    // Activities
    day.activities?.forEach((act) => {
      const cost = Number(act.estimated_cost || 0);
      if (act.category === 'food' || act.meal_type) {
        foodCost += cost;
      } else if (act.category === 'sightseeing' || act.category === 'culture' || act.category === 'adventure') {
        activityCost += cost;
      } else {
        otherCost += cost;
      }
    });
  });

  const estimatedTotal = activityCost + foodCost + lodgingCost + otherCost;
  const variance = totalBudget - estimatedTotal;
  const isOverBudget = variance < 0;
  const percentUsed = totalBudget > 0 ? Math.min(100, Math.round((estimatedTotal / totalBudget) * 100)) : 100;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-subtle mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">Itinerary Budget Summary</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time projection based on activities, accommodation, and dining estimates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isOverBudget ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              <AlertCircle className="w-3.5 h-3.5" />
              Exceeds Budget by {formatCurrency(Math.abs(variance), currency)}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" />
              {formatCurrency(variance, currency)} Remaining
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
          <span>Estimated Total: <strong className="text-slate-900">{formatCurrency(estimatedTotal, currency)}</strong></span>
          <span>Target Budget: <strong className="text-slate-900">{formatCurrency(totalBudget, currency)}</strong></span>
        </div>
        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isOverBudget ? 'bg-rose-500' : 'bg-teal-600'
            }`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>
      </div>

      {/* Breakdown Pills */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <BedDouble className="w-3.5 h-3.5 text-indigo-500" />
            <span>Lodging</span>
          </div>
          <p className="font-bold text-slate-900 text-sm">{formatCurrency(lodgingCost, currency)}</p>
        </div>

        <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <Utensils className="w-3.5 h-3.5 text-amber-500" />
            <span>Food & Dining</span>
          </div>
          <p className="font-bold text-slate-900 text-sm">{formatCurrency(foodCost, currency)}</p>
        </div>

        <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <Compass className="w-3.5 h-3.5 text-teal-500" />
            <span>Experiences</span>
          </div>
          <p className="font-bold text-slate-900 text-sm">{formatCurrency(activityCost, currency)}</p>
        </div>

        <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <Bus className="w-3.5 h-3.5 text-sky-500" />
            <span>Transit & Misc</span>
          </div>
          <p className="font-bold text-slate-900 text-sm">{formatCurrency(otherCost, currency)}</p>
        </div>
      </div>
    </div>
  );
};
