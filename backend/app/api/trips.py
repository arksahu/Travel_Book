import uuid
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user, AuthenticatedUser, supabase_client
from app.core.config import settings
from app.models.schemas import (
    TripResponse,
    TripCreate,
    TripUpdate,
    ActivityCreate,
    ActivityUpdate,
    ActivityResponse,
    GenerateItineraryRequest,
    DayPlanResponse
)
from app.services.ai_service import AIService
from app.services.budget_service import BudgetService

router = APIRouter(prefix="/api/trips", tags=["Trips"])

# In-memory store for demo mode
DEMO_TRIPS_STORE: Dict[str, Dict[str, Any]] = {
    "trip-tokyo-demo": {
        "id": "trip-tokyo-demo",
        "user_id": "00000000-0000-0000-0000-000000000001",
        "title": "Tokyo Neon & Heritage Explorer",
        "destination": "Tokyo, Japan",
        "start_date": "2026-11-10",
        "end_date": "2026-11-14",
        "total_days": 5,
        "travelers_count": 2,
        "travel_type": "couple",
        "travel_style": "balanced",
        "daily_pace": "moderate",
        "total_budget": 3200.0,
        "currency": "USD",
        "accommodation_pref": "Boutique hotel in Shinjuku or Ginza",
        "dietary_pref": "Pescatarian, loves ramen and matcha",
        "accessibility_pref": "Standard walking, prefers subway elevators",
        "notes": "Prioritize hidden alleys, traditional tea houses, and teamLab digital art.",
        "status": "confirmed",
        "cover_image": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
        "days": [
            {
                "id": "day-1-tokyo",
                "trip_id": "trip-tokyo-demo",
                "day_number": 1,
                "date": "2026-11-10",
                "summary": "Historic Asakusa & Sumida River Cruise to Modern Odaiba",
                "estimated_daily_cost": 210.0,
                "accommodation": {
                    "name": "Hotel Gracery Shinjuku",
                    "estimated_cost": 160.0,
                    "booking_tip": "Upper floor panoramic views."
                },
                "transit_tip": "Suica IC card for subway transitions.",
                "activities": [
                    {
                        "id": "act-1-1",
                        "day_id": "day-1-tokyo",
                        "trip_id": "trip-tokyo-demo",
                        "time_slot": "morning",
                        "title": "Senso-ji Temple & Nakamise Dori",
                        "description": "Tokyo's oldest Buddhist temple and fresh dango snacks.",
                        "start_time": "09:00",
                        "duration_minutes": 150,
                        "estimated_cost": 20.0,
                        "location_name": "Asakusa",
                        "category": "culture",
                        "meal_type": None,
                        "booking_tip": "Early arrival recommended.",
                        "is_alternative": False,
                        "sort_order": 0
                    },
                    {
                        "id": "act-1-2",
                        "day_id": "day-1-tokyo",
                        "trip_id": "trip-tokyo-demo",
                        "time_slot": "afternoon",
                        "title": "Traditional Soba Lunch at Namiki Yabusoba",
                        "description": "Handmade buckwheat noodles in rich dipping dashi broth.",
                        "start_time": "12:30",
                        "duration_minutes": 60,
                        "estimated_cost": 35.0,
                        "location_name": "Kaminarimon",
                        "category": "food",
                        "meal_type": "lunch",
                        "booking_tip": "Cash only.",
                        "is_alternative": False,
                        "sort_order": 1
                    }
                ]
            }
        ]
    }
}


@router.get("", response_model=List[TripResponse])
async def list_trips(user: AuthenticatedUser = Depends(get_current_user)):
    """
    Retrieves all trips belonging to the authenticated user.
    """
    if settings.is_supabase_configured and supabase_client and not user.is_demo:
        try:
            res = supabase_client.table("trips").select("*, itinerary_days(*, itinerary_activities(*))").eq("user_id", user.id).execute()
            trips_data = res.data or []
            return [
                TripResponse(
                    **t,
                    budget_breakdown=BudgetService.compute_breakdown(t)
                )
                for t in trips_data
            ]
        except Exception as e:
            print(f"Supabase query error: {e}")

    # Fallback to demo store
    user_trips = [t for t in DEMO_TRIPS_STORE.values() if t.get("user_id") == user.id or user.is_demo]
    result = []
    for t in user_trips:
        breakdown = BudgetService.compute_breakdown(t)
        result.append(TripResponse(**t, budget_breakdown=breakdown))
    return result


@router.post("", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
async def create_trip(
    trip_data: TripCreate,
    user: AuthenticatedUser = Depends(get_current_user)
):
    """
    Saves or persists a new trip for the authenticated user.
    """
    trip_id = str(uuid.uuid4())
    new_trip_dict = trip_data.model_dump()
    new_trip_dict["id"] = trip_id
    new_trip_dict["user_id"] = user.id

    # Format days and activities
    days_data = []
    for d in new_trip_dict.get("days", []):
        day_id = str(uuid.uuid4())
        acts_data = []
        for act in d.get("activities", []):
            acts_data.append({
                **act,
                "id": str(uuid.uuid4()),
                "day_id": day_id,
                "trip_id": trip_id
            })
        days_data.append({
            **d,
            "id": day_id,
            "trip_id": trip_id,
            "activities": acts_data
        })
    new_trip_dict["days"] = days_data

    if settings.is_supabase_configured and supabase_client and not user.is_demo:
        try:
            # Insert trip
            supabase_client.table("trips").insert({
                "id": trip_id,
                "user_id": user.id,
                "title": new_trip_dict["title"],
                "destination": new_trip_dict["destination"],
                "start_date": new_trip_dict["start_date"],
                "end_date": new_trip_dict["end_date"],
                "total_days": new_trip_dict["total_days"],
                "travelers_count": new_trip_dict["travelers_count"],
                "travel_type": new_trip_dict["travel_type"],
                "travel_style": new_trip_dict["travel_style"],
                "daily_pace": new_trip_dict["daily_pace"],
                "total_budget": new_trip_dict["total_budget"],
                "currency": new_trip_dict["currency"],
                "notes": new_trip_dict.get("notes")
            }).execute()
        except Exception as e:
            print(f"Supabase trip insert error: {e}")

    DEMO_TRIPS_STORE[trip_id] = new_trip_dict
    breakdown = BudgetService.compute_breakdown(new_trip_dict)
    return TripResponse(**new_trip_dict, budget_breakdown=breakdown)


@router.get("/{trip_id}", response_model=TripResponse)
async def get_trip(
    trip_id: str,
    user: AuthenticatedUser = Depends(get_current_user)
):
    """
    Retrieves full trip details, verifying ownership.
    """
    trip = DEMO_TRIPS_STORE.get(trip_id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found"
        )

    # Check ownership
    if not user.is_demo and trip.get("user_id") != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this trip"
        )

    breakdown = BudgetService.compute_breakdown(trip)
    return TripResponse(**trip, budget_breakdown=breakdown)


@router.patch("/{trip_id}", response_model=TripResponse)
async def update_trip(
    trip_id: str,
    updates: TripUpdate,
    user: AuthenticatedUser = Depends(get_current_user)
):
    """
    Updates trip metadata.
    """
    trip = DEMO_TRIPS_STORE.get(trip_id)
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    if not user.is_demo and trip.get("user_id") != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized")

    update_dict = updates.model_dump(exclude_unset=True)
    trip.update(update_dict)
    DEMO_TRIPS_STORE[trip_id] = trip

    breakdown = BudgetService.compute_breakdown(trip)
    return TripResponse(**trip, budget_breakdown=breakdown)


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trip(
    trip_id: str,
    user: AuthenticatedUser = Depends(get_current_user)
):
    """
    Deletes trip, enforcing ownership.
    """
    trip = DEMO_TRIPS_STORE.get(trip_id)
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    if not user.is_demo and trip.get("user_id") != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized")

    del DEMO_TRIPS_STORE[trip_id]
    return None


@router.post("/generate-ai", response_model=TripResponse)
async def generate_itinerary_endpoint(
    req: GenerateItineraryRequest,
    user: AuthenticatedUser = Depends(get_current_user)
):
    """
    Synthesizes a personalized AI itinerary from wizard preferences.
    """
    try:
        generated = await AIService.generate_itinerary(req)
        generated["user_id"] = user.id
        # Store in demo store for immediate retrieval
        DEMO_TRIPS_STORE[generated["id"]] = generated
        breakdown = BudgetService.compute_breakdown(generated)
        return TripResponse(**generated, budget_breakdown=breakdown)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate itinerary: {str(e)}"
        )


@router.post("/{trip_id}/days/{day_number}/regenerate", response_model=DayPlanResponse)
async def regenerate_day_endpoint(
    trip_id: str,
    day_number: int,
    payload: Dict[str, Any],
    user: AuthenticatedUser = Depends(get_current_user)
):
    """
    Regenerates an individual day's activities.
    """
    trip = DEMO_TRIPS_STORE.get(trip_id)
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    current_day = payload.get("day", {})
    refreshed_day = await AIService.regenerate_single_day(trip["destination"], day_number, current_day)

    # Update in trip
    days = trip.get("days", [])
    for idx, d in enumerate(days):
        if d.get("day_number") == day_number:
            days[idx] = refreshed_day
            break

    DEMO_TRIPS_STORE[trip_id]["days"] = days
    return DayPlanResponse(**refreshed_day)
