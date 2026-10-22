import { describe, it, expect } from 'vitest';
import { generateClientMockItinerary, SAMPLE_TRIPS } from './mockData';

describe('mockData service', () => {
  it('contains valid pre-populated sample trips', () => {
    expect(SAMPLE_TRIPS.length).toBeGreaterThanOrEqual(2);
    const tokyoTrip = SAMPLE_TRIPS.find(t => t.id === 'trip-tokyo-demo');
    expect(tokyoTrip).toBeDefined();
    expect(tokyoTrip.days.length).toBeGreaterThanOrEqual(1);
  });

  it('generates customized dynamic client itineraries', () => {
    const itinerary = generateClientMockItinerary({
      destination: 'Florence, Italy',
      start_date: '2026-11-01',
      end_date: '2026-11-04',
      total_budget: 2500,
      currency: 'EUR',
      travel_type: 'couple',
      travel_style: 'balanced',
      daily_pace: 'moderate'
    });

    expect(itinerary).toBeDefined();
    expect(itinerary.destination).toBe('Florence, Italy');
    expect(itinerary.total_days).toBe(4);
    expect(itinerary.days.length).toBe(4);

    // Validate day structure
    const day1 = itinerary.days[0];
    expect(day1.day_number).toBe(1);
    expect(day1.activities.length).toBe(4);
    expect(day1.accommodation).toBeDefined();
    expect(day1.transit_tip).toBeDefined();
  });
});
