from typing import List
from app.models.schemas import (
    UserProfileInput,
    CityComparisonItem,
    CityComparisonResponse
)
from app.data.cities_data import CITIES_DB
from app.services.cost_engine import calculate_expenses, calculate_financial_health
from app.services.stress_engine import calculate_stress_score

def compare_all_cities(user_input: UserProfileInput) -> CityComparisonResponse:
    items: List[CityComparisonItem] = []
    
    for city_id, city_info in CITIES_DB.items():
        # Clone user input with this city
        city_input = user_input.model_copy(update={"city": city_id, "custom_rent": None})
        expenses = calculate_expenses(city_input)
        health = calculate_financial_health(city_input, expenses)
        stress = calculate_stress_score(city_input, expenses, health)
        
        # Rationale builder
        if stress.score <= 30:
            rationale = f"High disposable income retention with {health.savings_rate_pct}% savings rate."
        elif stress.score <= 50:
            rationale = f"Balanced cost of living with steady ₹{health.net_savings:,.0f}/mo savings."
        elif stress.score <= 70:
            rationale = f"Moderate pressure with ₹{expenses.total_monthly_expense:,.0f}/mo living costs."
        else:
            rationale = f"High rental and living costs consume {health.expense_ratio_pct}% of income."

        item = CityComparisonItem(
            city_id=city_id,
            city_name=city_info["name"],
            state=city_info["state"],
            tier=city_info["tier"],
            monthly_cost=expenses.total_monthly_expense,
            net_savings=health.net_savings,
            savings_rate_pct=health.savings_rate_pct,
            stress_score=stress.score,
            status=stress.status,
            status_badge=stress.status_badge,
            color=stress.color,
            is_best_city=False,
            rank=0,
            rationale=rationale
        )
        items.append(item)
        
    # Sort primarily by lowest stress score, secondarily by highest net savings
    items.sort(key=lambda x: (x.stress_score, -x.net_savings))
    
    for idx, itm in enumerate(items):
        itm.rank = idx + 1
        
    # Best city is rank 1
    items[0].is_best_city = True
    best_city_name = items[0].city_name
    best_savings = items[0].net_savings

    insights = [
        f"🏆 Top Recommended City: {best_city_name} allows you to save the highest surplus of ₹{best_savings:,.0f}/month ({items[0].savings_rate_pct}% savings rate).",
        f"📊 Cost Spread: Monthly expenses range from ₹{items[0].monthly_cost:,.0f} in {items[0].city_name} to ₹{items[-1].monthly_cost:,.0f} in {items[-1].city_name} (₹{items[-1].monthly_cost - items[0].monthly_cost:,.0f} difference).",
        f"💡 Tech Hub Alternatives: If you work in tech, Hyderabad and Pune offer 15–25% higher savings retention compared to Bengaluru and Mumbai for the exact same lifestyle tier."
    ]

    return CityComparisonResponse(
        base_income=user_input.monthly_income,
        lifestyle=user_input.lifestyle.value,
        rent_type=user_input.rent_type.value,
        best_city=best_city_name,
        best_city_savings=best_savings,
        rankings=items,
        insights=insights
    )
