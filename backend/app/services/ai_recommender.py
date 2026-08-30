from typing import List
from app.models.schemas import (
    UserProfileInput,
    ExpenseBreakdown,
    FinancialHealth,
    StressScore,
    AIRecommendation,
    RentType
)
from app.data.cities_data import get_city_data

def generate_ai_recommendation(
    user_input: UserProfileInput,
    expenses: ExpenseBreakdown,
    health: FinancialHealth,
    stress: StressScore
) -> AIRecommendation:
    """
    Zero-hallucination AI reasoning engine that synthesizes exact mathematical figures
    into actionable relocation, budgeting, and lifestyle recommendations.
    """
    city_data = get_city_data(user_input.city)
    city_name = city_data["name"]
    income = user_input.monthly_income
    rent = expenses.rent
    rent_pct = round((rent / income) * 100.0, 1)
    food_pct = round((expenses.food / income) * 100.0, 1)
    savings = health.net_savings
    target = user_input.savings_target
    
    # 1. Summary statement
    if stress.score <= 25:
        summary = (
            f"{city_name} is highly affordable and financially comfortable for your ₹{income:,.0f}/month income profile. "
            f"You retain ₹{savings:,.0f}/month ({health.savings_rate_pct}% savings rate), safely beating your goal of ₹{target:,.0f}."
        )
    elif stress.score <= 50:
        summary = (
            f"{city_name} is financially manageable for your profile. Your net monthly savings of ₹{savings:,.0f} "
            f"({health.savings_rate_pct}% of salary) allows steady wealth accumulation while maintaining a {user_input.lifestyle.value} lifestyle."
        )
    elif stress.score <= 70:
        summary = (
            f"Living in {city_name} on ₹{income:,.0f}/month is financially tight. Your monthly expenses consume ₹{expenses.total_monthly_expense:,.0f} "
            f"({health.expense_ratio_pct}% of income), leaving ₹{savings:,.0f}/month for savings."
        )
    elif stress.score <= 85:
        summary = (
            f"{city_name} poses high financial stress for this income and housing setup. Rent and essentials consume "
            f"{health.expense_ratio_pct}% of your salary, falling ₹{abs(health.savings_deficit_surplus):,.0f}/month short of your savings target."
        )
    else:
        summary = (
            f"Your current setup in {city_name} is financially unsustainable. Total monthly outflow (₹{expenses.total_monthly_expense:,.0f}) "
            f"{'exceeds' if savings < 0 else 'nearly depletes'} your take-home pay of ₹{income:,.0f}."
        )

    # 2. Rent Analysis & Tradeoffs
    if rent_pct > 40:
        rent_analysis = (
            f"Rent is your biggest financial bottleneck, eating up {rent_pct}% of your total earnings (₹{rent:,.0f}/month). "
            f"Financial experts advise keeping housing below 30%. Switching from a private {user_input.rent_type.value} to a shared 2BHK/PG "
            f"could unlock ₹{max(3000.0, rent * 0.4):,.0f} to ₹{max(5000.0, rent * 0.55):,.0f} in monthly cashflow."
        )
    elif rent_pct > 28:
        rent_analysis = (
            f"Rent is moderately high at {rent_pct}% of income (₹{rent:,.0f}/month). It is manageable, but choosing a well-connected suburban "
            f"locality (e.g. {city_data['neighborhoods'][-1]['name']}) could save an extra ₹3,000–₹5,000 monthly."
        )
    else:
        rent_analysis = (
            f"Housing costs are very healthy at {rent_pct}% of income (₹{rent:,.0f}/month), well within the optimal 25–30% safety threshold."
        )

    # 3. Food & Lifestyle Analysis
    lifestyle_pct = round(((expenses.food + expenses.lifestyle_discretionary + expenses.shopping_entertainment) / income) * 100.0, 1)
    if user_input.spending_habits.eating_outside > 65:
        lifestyle_analysis = (
            f"Dining out and food delivery account for {food_pct}% of your budget (₹{expenses.food:,.0f}/month). Cooking at home 2 more days "
            f"per week can easily redirect ₹2,000–₹3,500/month directly into your emergency fund."
        )
    else:
        lifestyle_analysis = (
            f"Your food & lifestyle allocation (₹{expenses.food + expenses.lifestyle_discretionary:,.0f}/month, {lifestyle_pct}% of income) "
            f"is well-proportioned for a {user_input.lifestyle.value} lifestyle in {city_name}."
        )

    # 4. Savings Opportunity Calculation
    potential_rent_save = 0.0
    if user_input.rent_type == RentType.ONE_BHK:
        potential_rent_save = rent - city_data["rent"]["2bhk_shared"]
    elif user_input.rent_type == RentType.TWO_BHK_PRIVATE:
        potential_rent_save = rent - city_data["rent"]["1bhk"]
    
    if potential_rent_save > 2000:
        savings_opportunity = (
            f"By optimizing accommodation (e.g. flat-sharing or PG) and trimming high-frequency dining, your projected annual savings "
            f"could increase from ₹{health.annual_projected_savings:,.0f} to ₹{(health.annual_projected_savings + (potential_rent_save + 2500) * 12):,.0f}."
        )
    else:
        savings_opportunity = (
            f"You are currently on track to accumulate ₹{health.annual_projected_savings:,.0f} in annual savings. Investing ₹{min(savings, target):,.0f}/month "
            f"in balanced index funds (at 11% CAGR) can compound to approximately ₹{(min(savings, target) * 12 * 3.3):,.0f} in 3 years."
        )

    # 5. Relocation / City Verdict
    if stress.score <= 45:
        relocation_verdict = f"Strong Green Signal: {city_name} offers great career opportunities and solid purchasing power parity for your salary."
    elif stress.score <= 65:
        relocation_verdict = f"Conditional Approval: Move to {city_name} only if the job offers fast career growth or if you opt for shared housing."
    else:
        relocation_verdict = f"Reconsider Setup: Negotiate a higher CTC (minimum required: ₹{health.required_minimum_income:,.0f}/month) or consider more affordable cities like Hyderabad, Pune, or Ahmedabad."

    # 6. Concrete Action Items
    action_items: List[str] = []
    if rent_pct > 32:
        action_items.append(f"Explore shared 2BHK or 3BHK flats to cap housing spend under ₹{income * 0.28:,.0f}/month.")
    if user_input.spending_habits.eating_outside > 60:
        action_items.append("Subscribe to a healthy tiffin/meal plan or cook breakfast at home to save ₹2,500/month.")
    if expenses.subscriptions > 900:
        action_items.append("Audit recurring OTT and gym subscriptions; combine family plans to save ~₹500/month.")
    action_items.append(f"Automate ₹{min(savings, target):,.0f} systematic savings transfer to a separate high-yield account on payday.")
    if stress.score > 50:
        action_items.append(f"Target minimum take-home salary bump to ₹{health.required_minimum_income:,.0f}/month for comfortable surplus.")

    return AIRecommendation(
        summary=summary,
        rent_analysis=rent_analysis,
        lifestyle_analysis=lifestyle_analysis,
        savings_opportunity=savings_opportunity,
        relocation_verdict=relocation_verdict,
        action_items=action_items
    )
