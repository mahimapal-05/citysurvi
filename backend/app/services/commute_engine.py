"""
Commute & Traffic Tax Calculation Engine
Computes real living cost = Rent + Direct Commute Costs + Monetary Value of Lost Life Hours in Traffic.
"""

from typing import Dict, Any

COMMUTE_RATES_PER_KM = {
    "cab": 22.0,       # Uber/Ola average rate with surge
    "car": 12.0,       # Fuel + wear & tear
    "two_wheeler": 3.5, # Bike/Scooter fuel
    "metro": 2.5       # Metro/Local train
}

def calculate_commute_tradeoff(
    city: str,
    monthly_income: float,
    suburb_rent: float,
    core_rent: float,
    suburb_distance_km: float,
    core_distance_km: float,
    suburb_traffic_mins_per_trip: float,
    core_traffic_mins_per_trip: float,
    commute_mode: str = "cab",
    working_days_per_month: int = 22
) -> Dict[str, Any]:
    # Effective hourly rate based on 160 work hours/month
    hourly_rate = monthly_income / 160.0 if monthly_income > 0 else 300.0
    rate_per_km = COMMUTE_RATES_PER_KM.get(commute_mode, 15.0)

    # Suburb (Living far) metrics
    suburb_monthly_km = suburb_distance_km * 2 * working_days_per_month
    suburb_direct_commute_cost = suburb_monthly_km * rate_per_km
    suburb_monthly_traffic_hours = (suburb_traffic_mins_per_trip * 2 * working_days_per_month) / 60.0
    suburb_time_value_loss = suburb_monthly_traffic_hours * hourly_rate
    suburb_true_cost = suburb_rent + suburb_direct_commute_cost + suburb_time_value_loss

    # Core Area (Living near office) metrics
    core_monthly_km = core_distance_km * 2 * working_days_per_month
    core_direct_commute_cost = core_monthly_km * rate_per_km
    core_monthly_traffic_hours = (core_traffic_mins_per_trip * 2 * working_days_per_month) / 60.0
    core_time_value_loss = core_monthly_traffic_hours * hourly_rate
    core_true_cost = core_rent + core_direct_commute_cost + core_time_value_loss

    # Trade-off Deltas
    rent_delta = core_rent - suburb_rent
    commute_cost_saved = suburb_direct_commute_cost - core_direct_commute_cost
    hours_saved = suburb_monthly_traffic_hours - core_monthly_traffic_hours
    net_financial_saving_living_near = (suburb_direct_commute_cost - core_direct_commute_cost) - rent_delta
    total_economic_advantage_living_near = suburb_true_cost - core_true_cost

    # Formulate verdict
    if total_economic_advantage_living_near > 0:
        if net_financial_saving_living_near > 0:
            verdict = f"Living closer in the core area saves you ₹{round(net_financial_saving_living_near):,} in direct cash and gives you back {round(hours_saved, 1)} hours of your life every month!"
            recommendation = "RECOMMENDED: Live Closer"
        else:
            verdict = f"Paying ₹{round(rent_delta):,} extra rent is offset by saving ₹{round(commute_cost_saved):,} in travel + reclaiming {round(hours_saved, 1)} hours of time (Total value gain: ₹{round(total_economic_advantage_living_near):,}/mo)."
            recommendation = "HIGHLY VIABLE: Worth the Rent Premium"
    else:
        verdict = f"Living in the suburb saves you ₹{round(abs(total_economic_advantage_living_near)):,} overall, but costs you {round(hours_saved, 1)} extra hours in traffic every month."
        recommendation = "COST-SAVING: Suburb Viable if Commute Tolerable"

    return {
        "city": city,
        "commute_mode": commute_mode,
        "hourly_wage": round(hourly_rate, 1),
        "suburb": {
            "rent": suburb_rent,
            "direct_commute_cost": round(suburb_direct_commute_cost),
            "traffic_hours_monthly": round(suburb_monthly_traffic_hours, 1),
            "time_value_loss": round(suburb_time_value_loss),
            "true_total_cost": round(suburb_true_cost)
        },
        "core": {
            "rent": core_rent,
            "direct_commute_cost": round(core_direct_commute_cost),
            "traffic_hours_monthly": round(core_monthly_traffic_hours, 1),
            "time_value_loss": round(core_time_value_loss),
            "true_total_cost": round(core_true_cost)
        },
        "deltas": {
            "rent_premium": round(rent_delta),
            "commute_cost_saved": round(commute_cost_saved),
            "hours_saved_monthly": round(hours_saved, 1),
            "net_financial_diff": round(net_financial_saving_living_near),
            "total_economic_advantage": round(total_economic_advantage_living_near)
        },
        "verdict": verdict,
        "recommendation": recommendation
    }
