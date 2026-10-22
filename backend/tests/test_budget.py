from app.services.budget_service import BudgetService


def test_budget_breakdown_within_budget():
    sample_trip = {
        "total_budget": 2000.0,
        "currency": "USD",
        "days": [
            {
                "day_number": 1,
                "accommodation": {
                    "estimated_cost": 150.0
                },
                "activities": [
                    {"time_slot": "morning", "title": "Museum", "estimated_cost": 30.0, "category": "culture"},
                    {"time_slot": "afternoon", "title": "Lunch", "estimated_cost": 40.0, "category": "food", "meal_type": "lunch"},
                    {"time_slot": "evening", "title": "Dinner", "estimated_cost": 80.0, "category": "food", "meal_type": "dinner"}
                ]
            }
        ]
    }

    breakdown = BudgetService.compute_breakdown(sample_trip)
    assert breakdown.target_budget == 2000.0
    assert breakdown.lodging_cost == 150.0
    assert breakdown.food_cost == 120.0
    assert breakdown.activities_cost == 30.0
    assert breakdown.total_estimated == 300.0
    assert breakdown.variance == 1700.0
    assert breakdown.is_over_budget is False


def test_budget_breakdown_over_budget_warning():
    sample_trip = {
        "total_budget": 500.0,
        "currency": "EUR",
        "days": [
            {
                "day_number": 1,
                "accommodation": {
                    "estimated_cost": 400.0
                },
                "activities": [
                    {"time_slot": "morning", "title": "Helicopter Tour", "estimated_cost": 300.0, "category": "adventure"}
                ]
            }
        ]
    }

    breakdown = BudgetService.compute_breakdown(sample_trip)
    assert breakdown.total_estimated == 700.0
    assert breakdown.variance == -200.0
    assert breakdown.is_over_budget is True
    assert len(breakdown.warnings) > 0
    assert "exceeds your target budget" in breakdown.warnings[0]
