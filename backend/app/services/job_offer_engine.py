from typing import List
from app.models.schemas import (
    JobOfferRequest,
    JobOfferResponse,
    UserProfileInput,
    RentType
)
from app.data.cities_data import get_city_data
from app.services.cost_engine import calculate_expenses, calculate_financial_health
from app.services.stress_engine import calculate_stress_score

def evaluate_job_offer(req: JobOfferRequest) -> JobOfferResponse:
    # 1. Current baseline
    curr_city_data = get_city_data(req.current_city)
    offer_city_data = get_city_data(req.offer_city)

    curr_profile = UserProfileInput(
        monthly_income=req.current_income,
        city=curr_city_data["id"],
        lifestyle=req.lifestyle,
        rent_type=req.current_rent_type,
        savings_target=req.savings_target
    )
    curr_expenses = calculate_expenses(curr_profile)
    curr_health = calculate_financial_health(curr_profile, curr_expenses)
    curr_stress = calculate_stress_score(curr_profile, curr_expenses, curr_health)

    # 2. Offer scenario
    offer_rent_type = req.offer_rent_type or req.current_rent_type
    offer_profile = UserProfileInput(
        monthly_income=req.offer_income,
        city=offer_city_data["id"],
        lifestyle=req.lifestyle,
        rent_type=offer_rent_type,
        savings_target=req.savings_target
    )
    offer_expenses = calculate_expenses(offer_profile)
    offer_health = calculate_financial_health(offer_profile, offer_expenses)
    offer_stress = calculate_stress_score(offer_profile, offer_expenses, offer_health)

    delta_income = round(req.offer_income - req.current_income, 2)
    delta_savings = round(offer_health.net_savings - curr_health.net_savings, 2)
    
    # Cost of living difference percentage
    cost_diff_pct = round(
        ((offer_expenses.total_monthly_expense - curr_expenses.total_monthly_expense) / max(1.0, curr_expenses.total_monthly_expense)) * 100.0, 1
    )

    # Parity salary: what salary in the offer city delivers the exact same net savings as current
    ppp_parity_salary = round(offer_expenses.total_monthly_expense + curr_health.net_savings, 2)

    is_financially_viable = delta_savings > 0 and offer_stress.score <= 65

    # Determine verdict badge & summary
    if delta_savings >= 15000 and offer_stress.score <= 45:
        verdict_badge = "🚀 Highly Lucrative Offer"
        verdict_summary = (
            f"Accept the offer! Moving from {curr_city_data['name']} to {offer_city_data['name']} gives you "
            f"+₹{delta_savings:,.0f}/month in extra real savings (₹{(delta_savings * 12):,.0f}/year) while keeping stress low ({offer_stress.score}/100)."
        )
    elif delta_savings > 0 and offer_stress.score <= 55:
        verdict_badge = "✅ Financially Viable"
        verdict_summary = (
            f"Viable move. The salary increase in {offer_city_data['name']} outpaces higher local living costs, "
            f"yielding +₹{delta_savings:,.0f}/month net surplus."
        )
    elif delta_savings >= -2000 and delta_income > 0:
        verdict_badge = "⚖️ Neutral / Lateral Shift"
        verdict_summary = (
            f"The higher living cost in {offer_city_data['name']} neutralizes your salary raise. Your real take-home savings "
            f"change by ₹{delta_savings:,.0f}/month. Accept only if there is significant career upside."
        )
    else:
        verdict_badge = "⚠️ Financially Detrimental (Cost Trap)"
        verdict_summary = (
            f"Caution! Although the nominal salary looks higher, {offer_city_data['name']}'s higher living expenses "
            f"reduce your real monthly savings by ₹{abs(delta_savings):,.0f}/month. You need at least ₹{ppp_parity_salary:,.0f}/month to match your current lifestyle."
        )

    # Detailed bullet points
    detailed_points: List[str] = [
        f"Living Cost Delta: Expenses in {offer_city_data['name']} are {abs(cost_diff_pct)}% {'higher' if cost_diff_pct > 0 else 'lower'} than {curr_city_data['name']} (₹{offer_expenses.total_monthly_expense:,.0f} vs ₹{curr_expenses.total_monthly_expense:,.0f}).",
        f"Housing Shift: Rent will change from ₹{curr_expenses.rent:,.0f}/mo to ₹{offer_expenses.rent:,.0f}/mo.",
        f"Break-even Parity CTC: To maintain the exact same financial comfort, the minimum required salary in {offer_city_data['name']} is ₹{ppp_parity_salary:,.0f}/month.",
        f"Annual Wealth Impact: 1-year cumulative net savings change is ₹{(delta_savings * 12):,.0f}."
    ]

    return JobOfferResponse(
        current_city=curr_city_data["name"],
        current_income=req.current_income,
        current_expense=curr_expenses.total_monthly_expense,
        current_savings=curr_health.net_savings,
        current_stress=curr_stress.score,
        offer_city=offer_city_data["name"],
        offer_income=req.offer_income,
        offer_expense=offer_expenses.total_monthly_expense,
        offer_savings=offer_health.net_savings,
        offer_stress=offer_stress.score,
        delta_income=delta_income,
        delta_savings=delta_savings,
        cost_of_living_diff_pct=cost_diff_pct,
        ppp_parity_salary=ppp_parity_salary,
        is_financially_viable=is_financially_viable,
        verdict_badge=verdict_badge,
        verdict_summary=verdict_summary,
        detailed_points=detailed_points
    )
