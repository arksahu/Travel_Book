import json
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import httpx
from app.core.config import settings
from app.models.schemas import GenerateItineraryRequest, DayPlanBase, ActivityResponse, AccommodationInfo


class AIService:
    @staticmethod
    def _build_prompt(request: GenerateItineraryRequest, total_days: int) -> str:
        return f"""You are WanderWise AI, an expert travel architect.
Create a detailed, realistic, {total_days}-day travel itinerary for {request.destination}.

Trip Parameters:
- Start Date: {request.start_date}
- End Date: {request.end_date}
- Total Days: {total_days}
- Travelers: {request.travelers_count} ({request.travel_type})
- Target Budget: {request.total_budget} {request.currency}
- Style: {request.travel_style}
- Daily Pace: {request.daily_pace}
- Preferred Interests: {', '.join(request.interests)}
- Accommodation Preference: {request.accommodation_pref}
- Dietary Restrictions: {request.dietary_pref}
- Accessibility Needs: {request.accessibility_pref}
- Special Notes: {request.notes or 'None'}

Return strictly valid JSON with no markdown formatting or extra text. Format must match:
{{
  "title": "{request.destination.split(',')[0]} {total_days}-Day {request.travel_style.capitalize()} Journey",
  "summary": "High-level summary of the trip narrative...",
  "destination": "{request.destination}",
  "days": [
    {{
      "day_number": 1,
      "date": "{request.start_date}",
      "summary": "Brief theme of day 1",
      "estimated_daily_cost": 200,
      "accommodation": {{
        "name": "Suggested hotel or stay",
        "estimated_cost": 150,
        "booking_tip": "Booking advice"
      }},
      "transit_tip": "Metro/walking advice",
      "activities": [
        {{
          "time_slot": "morning",
          "title": "Activity name",
          "description": "What to do and see",
          "start_time": "09:00",
          "duration_minutes": 120,
          "estimated_cost": 25,
          "location_name": "Location or neighborhood",
          "category": "sightseeing",
          "meal_type": null,
          "booking_tip": "Advance booking note"
        }},
        {{
          "time_slot": "afternoon",
          "title": "Lunch spot / Culinary highlight",
          "description": "Artisan dishes and regional specialties",
          "start_time": "12:30",
          "duration_minutes": 60,
          "estimated_cost": 30,
          "location_name": "Neighborhood",
          "category": "food",
          "meal_type": "lunch",
          "booking_tip": "Reservation recommendation"
        }},
        {{
          "time_slot": "afternoon",
          "title": "Afternoon landmark or exploration",
          "description": "Cultural site or activity",
          "start_time": "14:30",
          "duration_minutes": 150,
          "estimated_cost": 40,
          "location_name": "Location",
          "category": "culture",
          "meal_type": null,
          "booking_tip": "Skip-the-line note"
        }},
        {{
          "time_slot": "evening",
          "title": "Evening dining or sunset experience",
          "description": "Atmospheric dinner or night walk",
          "start_time": "19:00",
          "duration_minutes": 120,
          "estimated_cost": 55,
          "location_name": "Location",
          "category": "food",
          "meal_type": "dinner",
          "booking_tip": "Window table reservation tip"
        }}
      ]
    }}
  ]
}}
"""

    @classmethod
    async def generate_itinerary(cls, request: GenerateItineraryRequest) -> Dict[str, Any]:
        """
        Orchestrates AI generation via Gemini/OpenAI if configured,
        or uses our intelligent mock generator for demo mode.
        """
        # Calculate day duration
        s_date = datetime.strptime(request.start_date, "%Y-%m-%d").date()
        e_date = datetime.strptime(request.end_date, "%Y-%m-%d").date()
        total_days = max(1, (e_date - s_date).days + 1)

        # If live API key is configured, call provider
        if settings.is_ai_configured:
            try:
                if settings.AI_PROVIDER == "gemini":
                    return await cls._call_gemini(request, total_days)
                elif settings.AI_PROVIDER == "openai":
                    return await cls._call_openai(request, total_days)
            except Exception as e:
                print(f"Warning: AI provider call failed ({e}). Falling back to intelligent mock generator.")

        # Default fallback to intelligent mock generator
        return cls._generate_mock_plan(request, total_days)

    @classmethod
    async def _call_gemini(cls, request: GenerateItineraryRequest, total_days: int) -> Dict[str, Any]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.AI_MODEL_NAME}:generateContent?key={settings.GEMINI_API_KEY}"
        prompt = cls._build_prompt(request, total_days)

        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.4,
                "response_mime_type": "application/json"
            }
        }

        async with httpx.AsyncClient(timeout=settings.AI_REQUEST_TIMEOUT_SECONDS) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            data = resp.json()
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
            parsed = json.loads(raw_text)
            return cls._hydrate_and_validate(parsed, request, total_days)

    @classmethod
    async def _call_openai(cls, request: GenerateItineraryRequest, total_days: int) -> Dict[str, Any]:
        url = "https://api.openai.com/v1/chat/completions"
        prompt = cls._build_prompt(request, total_days)

        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are WanderWise AI. Respond in strictly valid JSON format."},
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.4
        }

        headers = {
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }

        async with httpx.AsyncClient(timeout=settings.AI_REQUEST_TIMEOUT_SECONDS) as client:
            resp = await client.post(url, json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            raw_text = data["choices"][0]["message"]["content"]
            parsed = json.loads(raw_text)
            return cls._hydrate_and_validate(parsed, request, total_days)

    @classmethod
    def _hydrate_and_validate(cls, data: Dict[str, Any], request: GenerateItineraryRequest, total_days: int) -> Dict[str, Any]:
        """
        Assigns UUIDs, validates fields, and constructs the final trip payload.
        """
        trip_id = str(uuid.uuid4())
        days_list = data.get("days", [])

        hydrated_days = []
        for i, day in enumerate(days_list):
            day_id = str(uuid.uuid4())
            activities = []
            for j, act in enumerate(day.get("activities", [])):
                activities.append({
                    "id": str(uuid.uuid4()),
                    "day_id": day_id,
                    "trip_id": trip_id,
                    "time_slot": act.get("time_slot", "morning"),
                    "title": act.get("title", f"Experience {j+1}"),
                    "description": act.get("description", ""),
                    "start_time": act.get("start_time", "10:00"),
                    "duration_minutes": act.get("duration_minutes", 90),
                    "estimated_cost": float(act.get("estimated_cost", 20)),
                    "location_name": act.get("location_name", request.destination),
                    "category": act.get("category", "sightseeing"),
                    "meal_type": act.get("meal_type"),
                    "booking_tip": act.get("booking_tip", "Reserve ahead for best availability."),
                    "is_alternative": False,
                    "sort_order": j
                })

            hydrated_days.append({
                "id": day_id,
                "trip_id": trip_id,
                "day_number": day.get("day_number", i + 1),
                "date": day.get("date"),
                "summary": day.get("summary", f"Day {i+1} in {request.destination}"),
                "estimated_daily_cost": float(day.get("estimated_daily_cost", 100)),
                "accommodation": day.get("accommodation", {
                    "name": f"Recommended {request.travel_style.capitalize()} Stay",
                    "estimated_cost": round(request.total_budget / (total_days * 3), 2),
                    "booking_tip": "Centrally located near public transport."
                }),
                "transit_tip": day.get("transit_tip", "Metro passes or rideshares recommended."),
                "activities": activities
            })

        return {
            "id": trip_id,
            "title": data.get("title", f"{request.destination.split(',')[0]} Discovery"),
            "destination": request.destination,
            "start_date": request.start_date,
            "end_date": request.end_date,
            "total_days": total_days,
            "travelers_count": request.travelers_count,
            "travel_type": request.travel_type,
            "travel_style": request.travel_style,
            "daily_pace": request.daily_pace,
            "total_budget": request.total_budget,
            "currency": request.currency,
            "accommodation_pref": request.accommodation_pref,
            "dietary_pref": request.dietary_pref,
            "accessibility_pref": request.accessibility_pref,
            "notes": request.notes,
            "status": "confirmed",
            "cover_image": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
            "created_at": datetime.utcnow().isoformat() + "Z",
            "days": hydrated_days
        }

    @classmethod
    def _generate_mock_plan(cls, request: GenerateItineraryRequest, total_days: int) -> Dict[str, Any]:
        """
        Intelligent heuristic generator for local demo mode.
        """
        trip_id = str(uuid.uuid4())
        city = request.destination.split(",")[0].strip()
        daily_budget = round(request.total_budget / total_days, 2)
        start = datetime.strptime(request.start_date, "%Y-%m-%d").date()

        templates = [
            ("morning", f"Historic Center & Architectural Wonders of {city}", "Discover signature landmarks, ancient plazas, and peaceful early morning sights.", "09:00", 120, round(daily_budget * 0.15), "sightseeing", None, "Early arrival avoids waiting lines."),
            ("afternoon", f"Regional Gastronomy & Market Tasting", f"Savor specialty delicacies and local {request.dietary_pref or 'chef'} favorites.", "12:30", 60, round(daily_budget * 0.20), "food", "lunch", "Cash or local contactless payments preferred."),
            ("afternoon", f"{city} Cultural Masterpieces & Scenic Overlooks", "Immerse in renowned museums, botanical gardens, or hilltop vantage points.", "14:30", 120, round(daily_budget * 0.15), "culture", None, "Book skip-the-line timed entry."),
            ("evening", f"Sunset Atmosphere & Twilight Dining in {city}", "Relax with twilight cocktails and an authentic evening dinner celebrating local warmth.", "19:00", 120, round(daily_budget * 0.25), "food", "dinner", "Reserve window table 1 week prior.")
        ]

        days = []
        for i in range(1, total_days + 1):
            cur_date = start + timedelta(days=i - 1)
            day_id = str(uuid.uuid4())

            acts = []
            for idx, (slot, title, desc, start_time, dur, cost, cat, meal, tip) in enumerate(templates):
                acts.append({
                    "id": str(uuid.uuid4()),
                    "day_id": day_id,
                    "trip_id": trip_id,
                    "time_slot": slot,
                    "title": title,
                    "description": desc,
                    "start_time": start_time,
                    "duration_minutes": dur,
                    "estimated_cost": cost,
                    "location_name": f"{city} Historic District",
                    "category": cat,
                    "meal_type": meal,
                    "booking_tip": tip,
                    "is_alternative": False,
                    "sort_order": idx
                })

            days.append({
                "id": day_id,
                "trip_id": trip_id,
                "day_number": i,
                "date": cur_date.strftime("%Y-%m-%d"),
                "summary": f"Day {i}: Immersive exploration of {city}'s top highlights, culinary gems, and cultural heritage.",
                "estimated_daily_cost": round(daily_budget * 0.75, 2),
                "accommodation": {
                    "name": f"Curated {request.travel_style.capitalize()} Hotel in {city}",
                    "estimated_cost": round(daily_budget * 0.25, 2),
                    "booking_tip": "Close proximity to city center transit stations."
                },
                "transit_tip": "Local metro and walking provide the most seamless mobility.",
                "activities": acts
            })

        return {
            "id": trip_id,
            "title": f"{city} {total_days}-Day {request.travel_style.capitalize()} Escape",
            "destination": request.destination,
            "start_date": request.start_date,
            "end_date": request.end_date,
            "total_days": total_days,
            "travelers_count": request.travelers_count,
            "travel_type": request.travel_type,
            "travel_style": request.travel_style,
            "daily_pace": request.daily_pace,
            "total_budget": request.total_budget,
            "currency": request.currency,
            "accommodation_pref": request.accommodation_pref,
            "dietary_pref": request.dietary_pref,
            "accessibility_pref": request.accessibility_pref,
            "notes": request.notes,
            "status": "confirmed",
            "cover_image": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
            "created_at": datetime.utcnow().isoformat() + "Z",
            "days": days
        }

    @classmethod
    async def regenerate_single_day(cls, destination: str, day_number: int, current_day: Dict[str, Any]) -> Dict[str, Any]:
        """
        Regenerates an individual day's activities with refreshed alternatives.
        """
        refreshed_acts = []
        for act in current_day.get("activities", []):
            refreshed_acts.append({
                **act,
                "id": str(uuid.uuid4()),
                "title": f"Alternative Experience: {act.get('title', '').replace('Alternative Experience: ', '')}",
                "description": f"Refreshed alternative recommendation curated specifically for Day {day_number} in {destination}.",
                "booking_tip": "Alternative discovery with relaxed crowd levels."
            })

        return {
            **current_day,
            "summary": f"Refreshed Day {day_number}: Distinctive hidden gems and local encounters in {destination}.",
            "activities": refreshed_acts
        }
