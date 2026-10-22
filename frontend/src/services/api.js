import axios from 'axios';
import { SAMPLE_TRIPS, generateClientMockItinerary } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Supabase bearer token if available
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('wanderwise_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Storage key for demo mode saved trips
const DEMO_STORAGE_KEY = 'wanderwise_demo_trips';

const getStoredDemoTrips = () => {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(SAMPLE_TRIPS));
      return SAMPLE_TRIPS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading demo trips from localStorage', err);
    return SAMPLE_TRIPS;
  }
};

const saveStoredDemoTrips = (trips) => {
  try {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(trips));
  } catch (err) {
    console.error('Failed saving demo trips to localStorage', err);
  }
};

export const apiService = {
  // Check backend health
  async checkHealth() {
    try {
      const res = await client.get('/health', { timeout: 3000 });
      return { online: true, data: res.data };
    } catch {
      return { online: false, data: { status: 'offline', mode: 'demo' } };
    }
  },

  // Get all trips
  async getTrips() {
    try {
      const res = await client.get('/api/trips');
      return res.data;
    } catch (err) {
      // Fallback to local demo storage
      return getStoredDemoTrips();
    }
  },

  // Get single trip by ID
  async getTrip(tripId) {
    try {
      const res = await client.get(`/api/trips/${tripId}`);
      return res.data;
    } catch (err) {
      const trips = getStoredDemoTrips();
      const found = trips.find((t) => t.id === tripId);
      if (found) return found;
      // Also check active generated session trip
      const sessionTrip = sessionStorage.getItem(`trip_${tripId}`);
      if (sessionTrip) return JSON.parse(sessionTrip);
      throw new Error('Trip not found');
    }
  },

  // Create or save trip
  async saveTrip(tripData) {
    try {
      const res = await client.post('/api/trips', tripData);
      return res.data;
    } catch (err) {
      const trips = getStoredDemoTrips();
      const newTrip = {
        ...tripData,
        id: tripData.id || `trip-${Date.now()}`,
        status: 'saved',
        created_at: new Date().toISOString()
      };
      const existingIdx = trips.findIndex(t => t.id === newTrip.id);
      if (existingIdx >= 0) {
        trips[existingIdx] = newTrip;
      } else {
        trips.unshift(newTrip);
      }
      saveStoredDemoTrips(trips);
      return newTrip;
    }
  },

  // Generate itinerary via AI
  async generateItinerary(wizardInput) {
    try {
      // First try sending to backend AI service
      const res = await client.post('/api/trips/generate-ai', wizardInput);
      return res.data;
    } catch (err) {
      // Graceful fallback to client intelligent mock generator
      console.warn('Backend AI route unavailable or error encountered, generating with local AI engine.', err.message);
      // Simulate brief thinking delay for realistic UX
      await new Promise(r => setTimeout(r, 1200));
      const generated = generateClientMockItinerary(wizardInput);
      // Cache in session storage
      sessionStorage.setItem(`trip_${generated.id}`, JSON.stringify(generated));
      return generated;
    }
  },

  // Regenerate an individual day
  async regenerateDay(tripId, dayNumber, currentDay) {
    try {
      const res = await client.post(`/api/trips/${tripId}/days/${dayNumber}/regenerate`, {
        day: currentDay
      });
      return res.data;
    } catch (err) {
      // Local demo regeneration
      await new Promise(r => setTimeout(r, 800));
      const updatedDay = {
        ...currentDay,
        summary: `Refreshed Day ${dayNumber}: Alternative discoveries, artisan cafés, and scenic vistas.`,
        activities: currentDay.activities.map((act, i) => ({
          ...act,
          title: `Alternative Experience: ${act.title.replace('Alternative Experience: ', '')}`,
          description: `A uniquely refreshed recommendation curated for Day ${dayNumber}. ${act.description}`
        }))
      };
      return updatedDay;
    }
  },

  // Update trip metadata or activities
  async updateTrip(tripId, updatedData) {
    try {
      const res = await client.patch(`/api/trips/${tripId}`, updatedData);
      return res.data;
    } catch (err) {
      const trips = getStoredDemoTrips();
      const idx = trips.findIndex(t => t.id === tripId);
      if (idx >= 0) {
        trips[idx] = { ...trips[idx], ...updatedData, updated_at: new Date().toISOString() };
        saveStoredDemoTrips(trips);
        return trips[idx];
      }
      return updatedData;
    }
  },

  // Delete trip
  async deleteTrip(tripId) {
    try {
      await client.delete(`/api/trips/${tripId}`);
      return true;
    } catch (err) {
      const trips = getStoredDemoTrips().filter(t => t.id !== tripId);
      saveStoredDemoTrips(trips);
      sessionStorage.removeItem(`trip_${tripId}`);
      return true;
    }
  }
};
