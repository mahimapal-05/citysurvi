from app.models.schemas import (
    SimulationRequest,
    SimulationResponse
)
from app.services.cost_engine import calculate_expenses, calculate_financial_health
from app.services.stress_engine import calculate_stress_score

def run_simulation(req: SimulationRequest) -> SimulationResponse:
    # 1. Baseline
    base_expenses = calculate_expenses(req.base_profile)
    base_health = calculate_financial_health(req.base_profile, base_expenses)
    base_stress = calculate_stress_score(req.base_profile, base_expenses, base_health)
    
    # 2. Simulated profile
    sim_profile = req.base_profile.model_copy(deep=True)
    if req.simulated_income is not None:
        sim_profile.monthly_income = req.simulated_income
    if req.simulated_rent_type is not None:
        sim_profile.rent_type = req.simulated_rent_type
    if req.simulated_lifestyle is not None:
        sim_profile.lifestyle = req.simulated_lifestyle
    if req.simulated_city is not None:
        sim_profile.city = req.simulated_city
    if req.simulated_eating_out is not None:
        sim_profile.spending_habits.eating_outside = req.simulated_eating_out
    if req.simulated_savings_target is not None:
        sim_profile.savings_target = req.simulated_savings_target

    sim_expenses = calculate_expenses(sim_profile)
    sim_health = calculate_financial_health(sim_profile, sim_expenses)
    sim_stress = calculate_stress_score(sim_profile, sim_expenses, sim_health)

    delta_savings = round(sim_health.net_savings - base_health.net_savings, 2)
    delta_savings_pct = round(
        ((sim_health.net_savings - base_health.net_savings) / max(1.0, abs(base_health.net_savings))) * 100.0, 1
    )
    delta_stress = sim_stress.score - base_stress.score

    # Construct actionable takeaway
    if delta_savings > 0:
        if req.simulated_rent_type and req.simulated_rent_type != req.base_profile.rent_type:
            takeaway = (
                f"Switching accommodation increases your projected monthly savings by ₹{delta_savings:,.0f}/month "
                f"(+{delta_savings_pct}%), lowering financial stress score by {abs(delta_stress)} points."
            )
        elif req.simulated_income and req.simulated_income > req.base_profile.monthly_income:
            takeaway = (
                f"A salary bump to ₹{req.simulated_income:,.0f}/mo elevates your savings by ₹{delta_savings:,.0f}/month "
                f"and drops stress index from {base_stress.score} to {sim_stress.score}."
            )
        else:
            takeaway = (
                f"This lifestyle adjustment unlocks ₹{delta_savings:,.0f}/month in extra savings, improving your savings rate to {sim_health.savings_rate_pct}%."
            )
    else:
        takeaway = (
            f"This scenario increases monthly spending by ₹{abs(delta_savings):,.0f}/month, reducing your net monthly savings."
        )

    return SimulationResponse(
        baseline_expenses=base_expenses.total_monthly_expense,
        baseline_savings=base_health.net_savings,
        baseline_stress_score=base_stress.score,
        simulated_expenses=sim_expenses.total_monthly_expense,
        simulated_savings=sim_health.net_savings,
        simulated_stress_score=sim_stress.score,
        delta_savings=delta_savings,
        delta_savings_pct=delta_savings_pct,
        delta_stress_score=delta_stress,
        key_takeaway=takeaway,
        comparison_details={
            "rent_diff": round(sim_expenses.rent - base_expenses.rent, 2),
            "food_diff": round(sim_expenses.food - base_expenses.food, 2),
            "transport_diff": round(sim_expenses.transport - base_expenses.transport, 2),
            "savings_rate_base": base_health.savings_rate_pct,
            "savings_rate_sim": sim_health.savings_rate_pct
        }
    )
