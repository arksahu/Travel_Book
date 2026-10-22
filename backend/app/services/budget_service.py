from typing import Dict, Any, List
from app.models.schemas import BudgetBreakdown


class BudgetService:
    @staticmethod
    def compute_breakdown(trip: Dict[str, Any]) -> BudgetBreakdown:
        target_budget = float(trip.get("total_budget", 0.0))
        currency = str(trip.get("currency", "USD")).upper()

        activity_cost = 0.0
        food_cost = 0.0
        lodging_cost = 0.0
        transit_cost = 0.0

        days: List[Dict[str, Any]] = trip.get("days", [])

        for day in days:
            # Accommodation cost
            acc = day.get("accommodation")
            if acc and isinstance(acc, dict):
                lodging_cost += float(acc.get("estimated_cost", 0.0))

            # Activities
            activities = day.get("activities", [])
            for act in activities:
                cost = float(act.get("estimated_cost", 0.0))
                cat = str(act.get("category", "")).lower()
                meal = act.get("meal_type")

                if cat == "food" or meal:
                    food_cost += cost
                elif cat in ["transit", "transport"]:
                    transit_cost += cost
                elif cat in ["sightseeing", "culture", "adventure", "shopping", "relaxation"]:
                    activity_cost += cost
                else:
                    activity_cost += cost

        total_estimated = round(activity_cost + food_cost + lodging_cost + transit_cost, 2)
        variance = round(target_budget - total_estimated, 2)
        is_over_budget = variance < 0

        warnings: List[str] = []
        if is_over_budget:
            warnings.append(
                f"Estimated schedule cost ({currency} {total_estimated:,.0f}) exceeds your target budget by {currency} {abs(variance):,.0f}."
            )
        elif variance > (target_budget * 0.4):
            warnings.append(
                f"You have substantial remaining budget allocation ({currency} {variance:,.0f}). Consider upgrading dining or experiences."
            )

        return BudgetBreakdown(
            target_budget=target_budget,
            total_estimated=total_estimated,
            activities_cost=round(activity_cost, 2),
            food_cost=round(food_cost, 2),
            lodging_cost=round(lodging_cost, 2),
            transit_cost=round(transit_cost, 2),
            currency=currency,
            variance=variance,
            is_over_budget=is_over_budget,
            warnings=warnings
        )
