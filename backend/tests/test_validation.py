import pytest
from pydantic import ValidationError
from app.models.schemas import GenerateItineraryRequest, ActivityBase, TripCreate


def test_valid_itinerary_request():
    req = GenerateItineraryRequest(
        destination="Kyoto, Japan",
        start_date="2026-11-01",
        end_date="2026-11-05",
        travelers_count=2,
        total_budget=3000.0,
        currency="USD",
        travel_type="couple",
        travel_style="balanced",
        daily_pace="moderate",
        interests=["culture", "food"]
    )
    assert req.destination == "Kyoto, Japan"
    assert req.travelers_count == 2
    assert req.total_budget == 3000.0


def test_invalid_dates_end_before_start():
    with pytest.raises(ValidationError):
        GenerateItineraryRequest(
            destination="Paris, France",
            start_date="2026-12-10",
            end_date="2026-12-05",  # Invalid: ends before starts
            total_budget=2000.0
        )


def test_invalid_budget_too_low():
    with pytest.raises(ValidationError):
        GenerateItineraryRequest(
            destination="Rome, Italy",
            start_date="2026-11-01",
            end_date="2026-11-03",
            total_budget=10.0  # Invalid: less than min threshold 50.0
        )


def test_invalid_traveler_count_zero():
    with pytest.raises(ValidationError):
        GenerateItineraryRequest(
            destination="Rome, Italy",
            start_date="2026-11-01",
            end_date="2026-11-03",
            travelers_count=0  # Invalid: ge=1
        )


def test_activity_slot_validation():
    # Valid slot
    act = ActivityBase(
        time_slot="morning",
        title="Walk around Central Park",
        duration_minutes=90,
        estimated_cost=0.0
    )
    assert act.time_slot == "morning"

    # Invalid slot
    with pytest.raises(ValidationError):
        ActivityBase(
            time_slot="midnight",  # Invalid literal
            title="Night walk"
        )
