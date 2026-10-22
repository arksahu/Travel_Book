import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

const TripContext = createContext(null);

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Toast Notification Manager
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch all trips on mount
  const refreshTrips = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getTrips();
      setTrips(data || []);
    } catch (err) {
      console.error('Error fetching trips:', err);
      showToast('Could not load trips', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    refreshTrips();
  }, [refreshTrips]);

  // Recalculate trip costs across days & activities
  const computeTripTotalCost = (trip) => {
    if (!trip || !trip.days) return 0;
    let total = 0;
    trip.days.forEach((day) => {
      if (day.activities) {
        day.activities.forEach((act) => {
          total += Number(act.estimated_cost || 0);
        });
      }
      if (day.accommodation?.estimated_cost) {
        total += Number(day.accommodation.estimated_cost);
      }
    });
    return total;
  };

  // Update activity details inside activeTrip
  const updateActivityInActiveTrip = (dayId, activityId, updatedFields) => {
    if (!activeTrip) return;
    const newDays = activeTrip.days.map((day) => {
      if (day.id !== dayId) return day;
      const newActs = day.activities.map((act) => {
        if (act.id !== activityId) return act;
        return { ...act, ...updatedFields };
      });
      // update daily cost
      const newDailyCost = newActs.reduce((sum, a) => sum + Number(a.estimated_cost || 0), 0);
      return { ...day, activities: newActs, estimated_daily_cost: newDailyCost };
    });

    const updatedTrip = { ...activeTrip, days: newDays };
    setActiveTrip(updatedTrip);
    return updatedTrip;
  };

  // Add a new activity to a day
  const addActivityToActiveTrip = (dayId, newActivity) => {
    if (!activeTrip) return;
    const newDays = activeTrip.days.map((day) => {
      if (day.id !== dayId) return day;
      const acts = [...day.activities, { ...newActivity, id: `act-new-${Date.now()}` }];
      const newDailyCost = acts.reduce((sum, a) => sum + Number(a.estimated_cost || 0), 0);
      return { ...day, activities: acts, estimated_daily_cost: newDailyCost };
    });

    const updatedTrip = { ...activeTrip, days: newDays };
    setActiveTrip(updatedTrip);
    showToast('Activity added to itinerary', 'success');
    return updatedTrip;
  };

  // Delete an activity from a day
  const deleteActivityFromActiveTrip = (dayId, activityId) => {
    if (!activeTrip) return;
    const newDays = activeTrip.days.map((day) => {
      if (day.id !== dayId) return day;
      const acts = day.activities.filter((a) => a.id !== activityId);
      const newDailyCost = acts.reduce((sum, a) => sum + Number(a.estimated_cost || 0), 0);
      return { ...day, activities: acts, estimated_daily_cost: newDailyCost };
    });

    const updatedTrip = { ...activeTrip, days: newDays };
    setActiveTrip(updatedTrip);
    showToast('Activity removed', 'info');
    return updatedTrip;
  };

  // Persist active trip changes
  const persistActiveTrip = async () => {
    if (!activeTrip) return;
    try {
      const saved = await apiService.saveTrip(activeTrip);
      setActiveTrip(saved);
      await refreshTrips();
      showToast('Trip itinerary saved successfully!', 'success');
      return saved;
    } catch (err) {
      console.error(err);
      showToast('Failed to save trip', 'error');
    }
  };

  // Delete a trip
  const removeTrip = async (tripId) => {
    try {
      await apiService.deleteTrip(tripId);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
      if (activeTrip?.id === tripId) {
        setActiveTrip(null);
      }
      showToast('Trip deleted', 'info');
      return true;
    } catch (err) {
      showToast('Error deleting trip', 'error');
      return false;
    }
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTrip,
        setActiveTrip,
        loading,
        toasts,
        showToast,
        removeToast,
        refreshTrips,
        computeTripTotalCost,
        updateActivityInActiveTrip,
        addActivityToActiveTrip,
        deleteActivityFromActiveTrip,
        persistActiveTrip,
        removeTrip
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) throw new Error('useTrips must be used within a TripProvider');
  return context;
};
