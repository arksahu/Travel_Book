import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { apiService } from '../services/api';
import { calculateDaysBetween, formatCurrency, formatDate } from '../utils/formatters';
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  Wallet,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Heart,
  Luggage,
  Coffee,
  HelpCircle
} from 'lucide-react';

export const TripWizardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setActiveTrip, showToast } = useTrips();

  // Prefill from dashboard inspiration if passed
  const prefillDestination = location.state?.prefillDestination || '';

  // Form State
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Default dates: 14 days from today for 4 days
  const today = new Date();
  const defaultStart = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultEnd = new Date(today.getTime() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    destination: prefillDestination || 'Tokyo, Japan',
    start_date: defaultStart,
    end_date: defaultEnd,
    travelers_count: 2,
    total_budget: 3000,
    currency: 'USD',
    travel_type: 'couple',
    travel_style: 'balanced',
    daily_pace: 'moderate',
    interests: ['culture', 'food', 'sightseeing'],
    accommodation_pref: 'Boutique hotel near transit',
    dietary_pref: 'None / Flexible',
    accessibility_pref: 'Standard walkability',
    notes: ''
  });

  const availableInterests = [
    { id: 'sightseeing', label: 'Sightseeing' },
    { id: 'food', label: 'Food & Culinary' },
    { id: 'culture', label: 'Culture & Heritage' },
    { id: 'nature', label: 'Nature & Parks' },
    { id: 'adventure', label: 'Adventure & Outdoors' },
    { id: 'shopping', label: 'Shopping & Markets' },
    { id: 'nightlife', label: 'Nightlife & Lounges' },
    { id: 'relaxation', label: 'Relaxation & Spas' },
    { id: 'history', label: 'Museums & History' },
  ];

  const toggleInterest = (id) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(id);
      if (exists) {
        return { ...prev, interests: prev.interests.filter((i) => i !== id) };
      } else {
        return { ...prev, interests: [...prev.interests, id] };
      }
    });
  };

  const calculatedDays = calculateDaysBetween(formData.start_date, formData.end_date);

  const validateStep = (currentStep) => {
    setErrorMsg('');
    if (currentStep === 1) {
      if (!formData.destination.trim()) {
        setErrorMsg('Please specify a travel destination');
        return false;
      }
      if (!formData.start_date || !formData.end_date) {
        setErrorMsg('Please provide both start and end travel dates');
        return false;
      }
      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        setErrorMsg('End date cannot precede the start date');
        return false;
      }
    }
    if (currentStep === 2) {
      if (Number(formData.travelers_count) < 1) {
        setErrorMsg('Traveler count must be at least 1');
        return false;
      }
      if (Number(formData.total_budget) < 100) {
        setErrorMsg('Please enter a realistic travel budget');
        return false;
      }
    }
    if (currentStep === 3) {
      if (formData.interests.length === 0) {
        setErrorMsg('Select at least one preferred interest');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setErrorMsg('');
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg('');

    try {
      const generatedTrip = await apiService.generateItinerary({
        ...formData,
        total_days: calculatedDays
      });

      setActiveTrip(generatedTrip);
      showToast('Itinerary synthesized successfully!', 'success');
      navigate(`/itinerary/${generatedTrip.id}`);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to generate itinerary. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Wizard Progress Stepper */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
            Trip Architect • Step {step} of 5
          </span>
          <span className="text-xs font-medium text-slate-500">
            {step === 1 && 'Destination & Dates'}
            {step === 2 && 'Travelers & Budget'}
            {step === 3 && 'Style & Interests'}
            {step === 4 && 'Dietary & Requirements'}
            {step === 5 && 'Final Review & Synthesize'}
          </span>
        </div>

        {/* Stepper bar */}
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-teal-600' : 'bg-stone-200'
              }`}
            />
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step Container Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-card">
        
        {/* Step 1: Destination & Dates */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Where & When are you traveling?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your desired city or region and your target travel schedule.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Destination (City, Region or Country) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Barcelona, Spain or Kyoto, Japan"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Start Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      required
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    End Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      required
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100 flex items-center justify-between text-xs">
                <span className="text-teal-900 font-medium">Calculated Trip Length:</span>
                <span className="font-extrabold text-teal-800 text-sm">
                  {calculatedDays} Days / {Math.max(1, calculatedDays - 1)} Nights
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Travelers & Budget */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Who is coming and what is your budget?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                We use this to calibrate per-person activity choices, dining scale, and lodging targets.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Traveler Group Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {['solo', 'couple', 'family', 'friends', 'business'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, travel_type: type })}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                        formData.travel_type === type
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-stone-50 border-stone-200 text-slate-700 hover:bg-stone-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Number of Travelers
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.travelers_count}
                      onChange={(e) => setFormData({ ...formData, travelers_count: Number(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Total Budget
                    </label>
                    <div className="relative">
                      <Wallet className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min="100"
                        step="50"
                        value={formData.total_budget}
                        onChange={(e) => setFormData({ ...formData, total_budget: Number(e.target.value) })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-2 py-2.5 rounded-xl border border-stone-200 text-xs font-bold"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="AUD">AUD ($)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Daily Target Allocation:</span>
                <span className="font-bold text-slate-900">
                  ~{formatCurrency(Math.round(formData.total_budget / calculatedDays), formData.currency)} / day
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Style, Interests & Pace */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Pace, Style & Interests
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Customize the rhythm and experiences that spark your joy.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Budget Style Tier
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'budget', label: 'Budget', desc: 'Hostels, public transit, street food' },
                    { id: 'balanced', label: 'Balanced', desc: 'Boutique hotels, mix of dining & cafes' },
                    { id: 'luxury', label: 'Luxury', desc: 'Premium resorts, fine dining, private tours' }
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, travel_style: tier.id })}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        formData.travel_style === tier.id
                          ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20'
                          : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <p className="font-bold text-xs text-slate-900 capitalize">{tier.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{tier.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Daily Pace
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'relaxed', label: 'Relaxed', desc: '1-2 major sights, generous café breaks' },
                    { id: 'moderate', label: 'Moderate', desc: 'Balanced rhythm, 2-3 activities per day' },
                    { id: 'packed', label: 'Packed', desc: 'Full days, maximizing every hour' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, daily_pace: p.id })}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        formData.daily_pace === p.id
                          ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20'
                          : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <p className="font-bold text-xs text-slate-900 capitalize">{p.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Preferred Interests (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableInterests.map((interest) => {
                    const selected = formData.interests.includes(interest.id);
                    return (
                      <button
                        key={interest.id}
                        type="button"
                        onClick={() => toggleInterest(interest.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          selected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                            : 'bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '}
                        {interest.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Dietary, Accessibility & Special Notes */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Dietary, Accessibility & Accommodations
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Refine the personal touches so every recommendation fits your lifestyle.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Accommodation Preference
                </label>
                <input
                  type="text"
                  placeholder="e.g. Boutique hotel in central walkable neighborhood with breakfast"
                  value={formData.accommodation_pref}
                  onChange={(e) => setFormData({ ...formData, accommodation_pref: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Dietary Restrictions / Preferences
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vegetarian, Gluten-free, Seafood lover"
                    value={formData.dietary_pref}
                    onChange={(e) => setFormData({ ...formData, dietary_pref: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Accessibility Needs
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Elevator access, low-stair walkability"
                    value={formData.accessibility_pref}
                    onChange={(e) => setFormData({ ...formData, accessibility_pref: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Additional Notes or Dream Spots
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Must include an authentic tea ceremony, sunset river cruise, or quiet local cafes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Generate */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Review Your Trip Brief
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Confirm all details before our AI synthesizes your personalized day-by-day plan.
              </p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-4 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-stone-200">
                <span className="font-bold text-slate-900 text-sm">Destination</span>
                <span className="font-extrabold text-teal-700 text-sm">{formData.destination}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-slate-400 block font-medium">Dates</span>
                  <span className="font-bold text-slate-800">
                    {formatDate(formData.start_date)} - {formatDate(formData.end_date)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Duration</span>
                  <span className="font-bold text-slate-800">{calculatedDays} Days</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Travelers</span>
                  <span className="font-bold text-slate-800 capitalize">
                    {formData.travelers_count} ({formData.travel_type})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Budget Target</span>
                  <span className="font-bold text-slate-800">
                    {formatCurrency(formData.total_budget, formData.currency)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex flex-wrap gap-1.5 items-center">
                <span className="text-slate-400 mr-2 font-medium">Interests:</span>
                {formData.interests.map((i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-semibold capitalize">
                    {i}
                  </span>
                ))}
              </div>

              <div className="pt-2 text-slate-600 flex justify-between">
                <span>Pace: <strong className="text-slate-900 capitalize">{formData.daily_pace}</strong></span>
                <span>Style: <strong className="text-slate-900 capitalize">{formData.travel_style}</strong></span>
              </div>
            </div>

            {/* AI Generation State or Trigger */}
            {isGenerating ? (
              <div className="p-8 text-center bg-teal-50/50 rounded-3xl border border-teal-200 space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-teal-600 border-t-transparent animate-spin mx-auto" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Synthesizing Your Itinerary...</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Optimizing morning, afternoon, and evening experiences, calculating activity budgets, and tailoring local recommendations.
                  </p>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="w-full py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-base shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Personalized Itinerary
                </button>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons (Prev / Next) */}
        {!isGenerating && (
          <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-slate-700 text-xs font-bold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 5 && (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
