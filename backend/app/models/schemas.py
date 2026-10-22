from datetime import date, datetime
from typing import List, Optional, Literal
from pydantic import BaseModel, Field, field_validator, model_validator


class AccommodationInfo(BaseModel):
    name: str = Field(..., description="Suggested hotel, ryokan, or boutique stay")
    estimated_cost: float = Field(default=0.0, ge=0, description="Estimated cost per night")
    booking_tip: Optional[str] = Field(default=None, description="Neighborhood recommendation or reservation tip")


class ActivityBase(BaseModel):
    time_slot: Literal["morning", "afternoon", "evening"] = Field(...)
    title: str = Field(..., min_length=2, max_length=150)
    description: Optional[str] = Field(default="")
    start_time: Optional[str] = Field(default="10:00", description="Time string like 09:30")
    duration_minutes: int = Field(default=60, ge=10, le=480)
    estimated_cost: float = Field(default=0.0, ge=0)
    location_name: Optional[str] = Field(default="")
    category: Optional[str] = Field(default="sightseeing")
    meal_type: Optional[str] = Field(default=None)
    booking_tip: Optional[str] = Field(default=None)
    is_alternative: bool = Field(default=False)
    sort_order: int = Field(default=0)


class ActivityCreate(ActivityBase):
    pass


class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    time_slot: Optional[Literal["morning", "afternoon", "evening"]] = None
    start_time: Optional[str] = None
    duration_minutes: Optional[int] = None
    estimated_cost: Optional[float] = None
    location_name: Optional[str] = None
    category: Optional[str] = None
    meal_type: Optional[str] = None
    booking_tip: Optional[str] = None


class ActivityResponse(ActivityBase):
    id: str
    day_id: Optional[str] = None
    trip_id: Optional[str] = None


class DayPlanBase(BaseModel):
    day_number: int = Field(..., ge=1)
    date: Optional[str] = None
    summary: str = Field(...)
    estimated_daily_cost: float = Field(default=0.0, ge=0)
    accommodation: Optional[AccommodationInfo] = None
    transit_tip: Optional[str] = None
    activities: List[ActivityResponse] = Field(default_factory=list)


class DayPlanResponse(DayPlanBase):
    id: str
    trip_id: Optional[str] = None


class BudgetBreakdown(BaseModel):
    target_budget: float
    total_estimated: float
    activities_cost: float
    food_cost: float
    lodging_cost: float
    transit_cost: float
    currency: str
    variance: float
    is_over_budget: bool
    warnings: List[str] = Field(default_factory=list)


class GenerateItineraryRequest(BaseModel):
    destination: str = Field(..., min_length=2, description="Target city or region")
    start_date: str = Field(..., description="YYYY-MM-DD")
    end_date: str = Field(..., description="YYYY-MM-DD")
    travelers_count: int = Field(default=1, ge=1, le=50)
    total_budget: float = Field(default=2000.0, ge=50.0)
    currency: str = Field(default="USD", min_length=3, max_length=5)
    travel_type: Literal["solo", "couple", "family", "friends", "business"] = "couple"
    travel_style: Literal["budget", "balanced", "luxury"] = "balanced"
    daily_pace: Literal["relaxed", "moderate", "packed"] = "moderate"
    interests: List[str] = Field(default_factory=lambda: ["culture", "food", "sightseeing"])
    accommodation_pref: Optional[str] = "Boutique hotel near transit"
    dietary_pref: Optional[str] = "None"
    accessibility_pref: Optional[str] = "Standard walkability"
    notes: Optional[str] = ""

    @model_validator(mode="after")
    def validate_dates(self):
        try:
            s_date = datetime.strptime(self.start_date, "%Y-%m-%d").date()
            e_date = datetime.strptime(self.end_date, "%Y-%m-%d").date()
            if e_date < s_date:
                raise ValueError("end_date cannot be earlier than start_date")
        except ValueError as err:
            raise ValueError(f"Invalid date format or range: {err}")
        return self


class TripCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    destination: str = Field(..., min_length=2)
    start_date: str
    end_date: str
    total_days: int = Field(..., ge=1)
    travelers_count: int = Field(default=1, ge=1)
    travel_type: str = "couple"
    travel_style: str = "balanced"
    daily_pace: str = "moderate"
    total_budget: float = Field(..., ge=0)
    currency: str = "USD"
    accommodation_pref: Optional[str] = None
    dietary_pref: Optional[str] = None
    accessibility_pref: Optional[str] = None
    notes: Optional[str] = None
    cover_image: Optional[str] = None
    days: List[DayPlanBase] = Field(default_factory=list)


class TripUpdate(BaseModel):
    title: Optional[str] = None
    destination: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    total_budget: Optional[float] = None
    currency: Optional[str] = None
    travel_type: Optional[str] = None
    travel_style: Optional[str] = None
    daily_pace: Optional[str] = None
    accommodation_pref: Optional[str] = None
    dietary_pref: Optional[str] = None
    accessibility_pref: Optional[str] = None
    notes: Optional[str] = None


class TripResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    title: str
    destination: str
    start_date: str
    end_date: str
    total_days: int
    travelers_count: int
    travel_type: str
    travel_style: str
    daily_pace: str
    total_budget: float
    currency: str
    accommodation_pref: Optional[str] = None
    dietary_pref: Optional[str] = None
    accessibility_pref: Optional[str] = None
    notes: Optional[str] = None
    status: str = "confirmed"
    cover_image: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    days: List[DayPlanResponse] = Field(default_factory=list)
    budget_breakdown: Optional[BudgetBreakdown] = None


class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str
    supabase_configured: bool
    ai_configured: bool
    ai_provider: str
