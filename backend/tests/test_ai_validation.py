import pytest
from app.services.ai_service import AIService
from app.models.schemas import GenerateItineraryRequest


@pytest.mark.asyncio
async def test_ai_service_generate_itinerary_structure():
    request = GenerateItineraryRequest(
        destination="Rome, Italy",
        start_date="2026-11-01",
        end_date="2026-11-03",
        travelers_count=2,
        total_budget=2000.0,
        currency="EUR",
        travel_type="couple",
        travel_style="balanced",
        daily_pace="moderate",
        interests=["culture", "food"]
    )

    generated = await AIService.generate_itinerary(request)
    assert generated is not None
    assert "Rome" in generated["destination"]
    assert generated["total_days"] == 3
    assert len(generated["days"]) == 3

    # Validate day 1
    day1 = generated["days"][0]
    assert day1["day_number"] == 1
    assert "accommodation" in day1
    assert "transit_tip" in day1
    assert len(day1["activities"]) >= 3

    # Check activity time slots
    slots = [act["time_slot"] for act in day1["activities"]]
    assert "morning" in slots
    assert "afternoon" in slots
    assert "evening" in slots


@pytest.mark.asyncio
async def test_ai_single_day_regeneration():
    sample_day = {
        "id": "day-1",
        "day_number": 1,
        "summary": "Original day summary",
        "activities": [
            {
                "id": "act-1",
                "time_slot": "morning",
                "title": "Visit Colosseum",
                "description": "Ancient amphitheater tour.",
                "estimated_cost": 25.0
            }
        ]
    }

    refreshed = await AIService.regenerate_single_day("Rome, Italy", 1, sample_day)
    assert refreshed["day_number"] == 1
    assert "Refreshed" in refreshed["summary"]
    assert len(refreshed["activities"]) == 1
    assert "Alternative" in refreshed["activities"][0]["title"]
