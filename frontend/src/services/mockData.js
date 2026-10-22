/**
 * Realistic Mock Data & Intelligent Generator for Demo Mode
 * Used when running locally without Supabase or AI provider keys.
 */

export const SAMPLE_TRIPS = [
  {
    id: "trip-tokyo-demo",
    title: "Tokyo Neon & Heritage Explorer",
    destination: "Tokyo, Japan",
    start_date: "2026-11-10",
    end_date: "2026-11-14",
    total_days: 5,
    travelers_count: 2,
    travel_type: "couple",
    travel_style: "balanced",
    daily_pace: "moderate",
    total_budget: 3200,
    currency: "USD",
    accommodation_pref: "Boutique hotel in Shinjuku or Ginza",
    dietary_pref: "Pescatarian, loves ramen and matcha",
    accessibility_pref: "Standard walking, prefers subway elevators",
    notes: "Prioritize hidden alleys, traditional tea houses, and teamLab digital art.",
    status: "confirmed",
    cover_image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    created_at: "2026-10-20T10:00:00Z",
    days: [
      {
        id: "day-1-tokyo",
        day_number: 1,
        date: "2026-11-10",
        summary: "Historic Asakusa & Sumida River Cruise to Modern Odaiba",
        estimated_daily_cost: 210,
        accommodation: {
          name: "Hotel Gracery Shinjuku",
          estimated_cost: 160,
          booking_tip: "Request an upper floor for panoramic skyline views."
        },
        transit_tip: "Purchase a Suica / Pasmo IC card or use Apple Wallet IC for frictionless metro transitions.",
        activities: [
          {
            id: "act-1-1",
            time_slot: "morning",
            title: "Senso-ji Temple & Nakamise Dori Street Food",
            description: "Tokyo's oldest Buddhist temple. Wander through Kaminarimon gate and sample freshly made ningyo-yaki and matcha treats along Nakamise.",
            start_time: "09:00",
            duration_minutes: 150,
            estimated_cost: 20,
            location_name: "Asakusa, Taito City",
            category: "culture",
            meal_type: null,
            booking_tip: "Arrive before 9 AM to experience the serene inner courtyard before crowds gather.",
            is_alternative: false
          },
          {
            id: "act-1-2",
            time_slot: "afternoon",
            title: "Traditional Soba Lunch at Namiki Yabusoba",
            description: "Historic soba shop established in 1913 serving handmade buckwheat noodles in rich dipping dashi broth.",
            start_time: "12:30",
            duration_minutes: 60,
            estimated_cost: 35,
            location_name: "2-11-9 Kaminarimon",
            category: "food",
            meal_type: "lunch",
            booking_tip: "Cash only; short queue during peak lunch hours.",
            is_alternative: false
          },
          {
            id: "act-1-3",
            time_slot: "afternoon",
            title: "Futuristic Water Bus to Odaiba & teamLab Planets",
            description: "Board the Himiko futuristic river boat to Odaiba island, followed by immersive barefoot digital art installations.",
            start_time: "14:30",
            duration_minutes: 180,
            estimated_cost: 85,
            location_name: "Toyosu / Odaiba Bay",
            category: "sightseeing",
            meal_type: null,
            booking_tip: "Book teamLab Planets tickets online at least 3 weeks ahead.",
            is_alternative: false
          },
          {
            id: "act-1-4",
            time_slot: "evening",
            title: "Izakaya Dinner in Omoide Yokocho (Memory Lane)",
            description: "Atmospheric lantern-lit alley beside Shinjuku station offering yakitori, grilled skewers, and local highballs.",
            start_time: "19:00",
            duration_minutes: 120,
            estimated_cost: 70,
            location_name: "Shinjuku West Gate",
            category: "food",
            meal_type: "dinner",
            booking_tip: "Tiny counter-only stalls; seats 6 to 8 people each.",
            is_alternative: false
          }
        ]
      },
      {
        id: "day-2-tokyo",
        day_number: 2,
        date: "2026-11-11",
        summary: "Meiji Shrine Peace, Harajuku Contrasts & Shibuya Crossing",
        estimated_daily_cost: 195,
        accommodation: {
          name: "Hotel Gracery Shinjuku",
          estimated_cost: 160,
          booking_tip: "Standard night 2 stay."
        },
        transit_tip: "Yamanote Line loops directly through Harajuku, Shibuya, and Shinjuku.",
        activities: [
          {
            id: "act-2-1",
            time_slot: "morning",
            title: "Tranquil Forest Walk at Meiji Jingu Shrine",
            description: "Stroll beneath towering 100-year-old cedar trees leading to Tokyo's most venerated Shinto shrine.",
            start_time: "08:30",
            duration_minutes: 120,
            estimated_cost: 0,
            location_name: "Yoyogi Kamizonocho, Shibuya",
            category: "relaxation",
            meal_type: null,
            booking_tip: "Admission to grounds is free. Stop by the wooden Ema prayer plaques.",
            is_alternative: false
          },
          {
            id: "act-2-2",
            time_slot: "morning",
            title: "Takeshita Street & Cat Street Fashion Discovery",
            description: "Vibrant teen pop culture contrasting with indie minimalist boutiques and artisanal coffee shops along Cat Street.",
            start_time: "11:00",
            duration_minutes: 90,
            estimated_cost: 25,
            location_name: "Jingumae, Shibuya",
            category: "shopping",
            meal_type: null,
            booking_tip: "Sample Marion Crêpes or artisanal roasted pour-overs.",
            is_alternative: false
          },
          {
            id: "act-2-3",
            time_slot: "afternoon",
            title: "Tonkatsu Lunch at Maisen Aoyama",
            description: "Renowned kurobuta pork cutlets served inside a beautifully preserved 1930s public bathhouse hall.",
            start_time: "13:00",
            duration_minutes: 75,
            estimated_cost: 50,
            location_name: "4-8-5 Jingumae, Shibuya",
            category: "food",
            meal_type: "lunch",
            booking_tip: "Vegetarian tempura alternative available upon request.",
            is_alternative: false
          },
          {
            id: "act-2-4",
            time_slot: "evening",
            title: "Shibuya Sky Sunset & Crossing Walk",
            description: "360-degree open-air observation deck on the 47th floor overlooking the world's busiest pedestrian intersection.",
            start_time: "17:00",
            duration_minutes: 120,
            estimated_cost: 40,
            location_name: "Shibuya Scramble Square",
            category: "sightseeing",
            meal_type: null,
            booking_tip: "Secure timed sunset slot 4 weeks in advance.",
            is_alternative: false
          },
          {
            id: "act-2-5",
            time_slot: "evening",
            title: "Ramen Dinner at Afuri Shibuya",
            description: "Light, refreshing yuzu-infused chicken and dashi broth ramen with char-grilled chashu.",
            start_time: "19:30",
            duration_minutes: 60,
            estimated_cost: 30,
            location_name: "1-33-1 Ebisu / Shibuya",
            category: "food",
            meal_type: "dinner",
            booking_tip: "Order ticket at digital vending machine (English interface).",
            is_alternative: false
          }
        ]
      },
      {
        id: "day-3-tokyo",
        day_number: 3,
        date: "2026-11-12",
        summary: "Tsukiji Outer Market Flavors & Luxury Ginza Architecture",
        estimated_daily_cost: 230,
        accommodation: {
          name: "Hotel Gracery Shinjuku",
          estimated_cost: 160,
          booking_tip: "Standard night 3 stay."
        },
        transit_tip: "Toei Oedo Line to Tsukijishijo Station.",
        activities: [
          {
            id: "act-3-1",
            time_slot: "morning",
            title: "Tsukiji Outer Market Culinary Exploration",
            description: "Lively market stalls with fresh sea urchin, tamagoyaki egg omelets, wagyu skewers, and fresh strawberries.",
            start_time: "08:30",
            duration_minutes: 150,
            estimated_cost: 65,
            location_name: "4 Chome Tsukiji, Chuo City",
            category: "food",
            meal_type: "breakfast",
            booking_tip: "Most stalls open early and pack up by 1:30 PM.",
            is_alternative: false
          },
          {
            id: "act-3-2",
            time_slot: "afternoon",
            title: "Ginza Flagship Architecture & Itoya Stationery",
            description: "Discover 12 floors of premier Japanese paper, design goods, and architectural storefronts along Chuo Dori.",
            start_time: "12:00",
            duration_minutes: 150,
            estimated_cost: 45,
            location_name: "Ginza, Chuo City",
            category: "shopping",
            meal_type: null,
            booking_tip: "On weekend afternoons, the main boulevard is closed to cars for pedestrians.",
            is_alternative: false
          },
          {
            id: "act-3-3",
            time_slot: "evening",
            title: "Sunset Cocktails & Skyline Dinner in Roppongi Hills",
            description: "Elevated evening dining with views extending all the way to Mount Fuji on clear evenings.",
            start_time: "18:30",
            duration_minutes: 120,
            estimated_cost: 120,
            location_name: "Mori Tower 52F, Roppongi",
            category: "nightlife",
            meal_type: "dinner",
            booking_tip: "Dress code smart casual; reserve window table 1 week prior.",
            is_alternative: false
          }
        ]
      }
    ]
  },
  {
    id: "trip-paris-demo",
    title: "Romantic Paris: Art, Wine & Seine Strolls",
    destination: "Paris, France",
    start_date: "2026-12-05",
    end_date: "2026-12-08",
    total_days: 4,
    travelers_count: 2,
    travel_type: "couple",
    travel_style: "luxury",
    daily_pace: "relaxed",
    total_budget: 4500,
    currency: "EUR",
    accommodation_pref: "Boutique hotel in Le Marais or Saint-Germain-des-Prés",
    dietary_pref: "Loves pastry, French wine, fine cheeses",
    accessibility_pref: "Comfortable with walking along cobblestone streets",
    notes: "Romantic, not rushed, cozy bistros, private Louvre experience.",
    status: "confirmed",
    cover_image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    created_at: "2026-10-18T14:30:00Z",
    days: [
      {
        id: "day-1-paris",
        day_number: 1,
        date: "2026-12-05",
        summary: "Le Marais Charm, Place des Vosges & Seine Sunset Cruise",
        estimated_daily_cost: 380,
        accommodation: {
          name: "Pavillon de la Reine & Spa",
          estimated_cost: 320,
          booking_tip: "Hidden historic hotel directly on Place des Vosges."
        },
        transit_tip: "Paris is most magnificent on foot or via the clean Metro Line 1.",
        activities: [
          {
            id: "act-p1-1",
            time_slot: "morning",
            title: "Morning Croissant & Café at Carette Place des Vosges",
            description: "Paris's historic square featuring aristocratic brick arcades and world-famous whipped cream hot chocolate.",
            start_time: "09:30",
            duration_minutes: 75,
            estimated_cost: 40,
            location_name: "25 Place des Vosges",
            category: "food",
            meal_type: "breakfast",
            booking_tip: "Arrive before 10 AM for terrace seats.",
            is_alternative: false
          },
          {
            id: "act-p1-2",
            time_slot: "afternoon",
            title: "Musée Picasso & Marais Courtyards",
            description: "Over 400 masterpieces by Pablo Picasso housed in the magnificent 17th-century Hôtel Salé mansion.",
            start_time: "11:30",
            duration_minutes: 120,
            estimated_cost: 36,
            location_name: "5 Rue de Thorigny",
            category: "culture",
            meal_type: null,
            booking_tip: "Skip-the-line time slot voucher included.",
            is_alternative: false
          },
          {
            id: "act-p1-3",
            time_slot: "evening",
            title: "Private Sunset Electric Boat Cruise along the Seine",
            description: "Glide beneath Pont Neuf and past Notre-Dame as the city of lights illuminates.",
            start_time: "17:30",
            duration_minutes: 90,
            estimated_cost: 150,
            location_name: "Port de Solférino",
            category: "relaxation",
            meal_type: null,
            booking_tip: "Chilled champagne and artisanal macarons included onboard.",
            is_alternative: false
          }
        ]
      }
    ]
  }
];

export const MOCK_USER_PROFILE = {
  id: "demo-user-001",
  email: "traveler@wanderwise.demo",
  full_name: "Alex Rivera",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  home_currency: "USD",
  preferences: {
    travel_style: "balanced",
    dietary: "Vegetarian options preferred",
    favorite_interests: ["culture", "food", "sightseeing", "nature"],
    pace: "moderate"
  }
};

/**
 * Intelligent client-side mock generator for instant demo generation
 * Handles arbitrary destinations, dates, budgets, and styles!
 */
export const generateClientMockItinerary = (params) => {
  const {
    destination = "Rome, Italy",
    start_date = "2026-11-01",
    end_date = "2026-11-03",
    total_budget = 2000,
    currency = "USD",
    travel_type = "couple",
    travel_style = "balanced",
    daily_pace = "moderate",
    interests = ["culture", "food", "sightseeing"],
    dietary_pref = "None",
    accessibility_pref = "Standard",
    notes = ""
  } = params;

  // Calculate days
  const start = new Date(start_date);
  const end = new Date(end_date);
  let total_days = Math.max(1, Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1);
  if (isNaN(total_days) || total_days < 1) total_days = 3;
  if (total_days > 14) total_days = 14; // Cap for demo generation

  const dailyBudget = Math.round(total_budget / total_days);
  const days = [];

  const activityTemplates = [
    {
      slot: "morning",
      title: (city) => `Iconic Landmarks & Historical Walk of ${city}`,
      desc: (city) => `Explore the signature historic center and renowned architectural wonders of ${city} with morning light.`,
      cat: "sightseeing",
      costPct: 0.15,
      dur: 150
    },
    {
      slot: "afternoon",
      title: (city) => `Local Artisan Cuisine & Market Tasting in ${city}`,
      desc: (city) => `Immerse in the culinary heart of ${city}, sampling specialty regional dishes curated by local food artisans.`,
      cat: "food",
      meal: "lunch",
      costPct: 0.18,
      dur: 75
    },
    {
      slot: "afternoon",
      title: (city) => `Cultural Treasures & Hidden Neighborhoods`,
      desc: (city) => `Venture off the main tourist trail to encounter boutique galleries, hidden courtyards, and scenic lookouts.`,
      cat: "culture",
      costPct: 0.12,
      dur: 120
    },
    {
      slot: "evening",
      title: (city) => `Golden Hour Panorama & Twilight Dinner in ${city}`,
      desc: (city) => `Unwind with stunning twilight views followed by an authentic dinner celebrating traditional local hospitality.`,
      cat: "relaxation",
      meal: "dinner",
      costPct: 0.25,
      dur: 120
    }
  ];

  for (let i = 1; i <= total_days; i++) {
    const curDate = new Date(start);
    curDate.setDate(curDate.getDate() + (i - 1));
    const dateStr = curDate.toISOString().split('T')[0];

    const dayActivities = activityTemplates.map((tmpl, idx) => ({
      id: `act-gen-${i}-${idx + 1}`,
      time_slot: tmpl.slot,
      title: tmpl.title(destination.split(',')[0]),
      description: tmpl.desc(destination.split(',')[0]),
      start_time: idx === 0 ? "09:00" : idx === 1 ? "12:30" : idx === 2 ? "14:30" : "19:00",
      duration_minutes: tmpl.dur,
      estimated_cost: Math.round(dailyBudget * tmpl.costPct),
      location_name: `${destination.split(',')[0]} City Center`,
      category: tmpl.cat,
      meal_type: tmpl.meal || null,
      booking_tip: idx === 0 ? "Reserve tickets online in advance to bypass long queues." : "Ask your host for the day's fresh chef special.",
      is_alternative: false
    }));

    days.push({
      id: `day-gen-${i}`,
      day_number: i,
      date: dateStr,
      summary: `Day ${i}: Immersive exploration of ${destination.split(',')[0]}'s culture, food, and signature atmosphere.`,
      estimated_daily_cost: Math.round(dailyBudget * 0.7),
      accommodation: {
        name: `Recommended ${travel_style.charAt(0).toUpperCase() + travel_style.slice(1)} Stay in ${destination.split(',')[0]}`,
        estimated_cost: Math.round(dailyBudget * 0.3),
        booking_tip: "Central location with walkability to prime metro hubs."
      },
      transit_tip: "Public transit and walking are the most efficient choices for this neighborhood route.",
      activities: dayActivities
    });
  }

  const generatedTrip = {
    id: `trip-gen-${Date.now()}`,
    title: `${destination.split(',')[0]} ${total_days}-Day ${travel_style.charAt(0).toUpperCase() + travel_style.slice(1)} Escape`,
    destination,
    start_date,
    end_date,
    total_days,
    travelers_count: params.travelers_count || 1,
    travel_type,
    travel_style,
    daily_pace,
    total_budget: Number(total_budget),
    currency,
    accommodation_pref: params.accommodation_pref || "Central & comfortable",
    dietary_pref,
    accessibility_pref,
    notes,
    status: "generated",
    cover_image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
    created_at: new Date().toISOString(),
    days
  };

  return generatedTrip;
};
