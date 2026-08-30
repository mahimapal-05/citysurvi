from app.models.schemas import (
    UserProfileInput,
    ExpenseBreakdown,
    FinancialHealth,
    StressScore,
    StressFactors
)

def calculate_stress_score(
    user_input: UserProfileInput,
    expenses: ExpenseBreakdown,
    health: FinancialHealth
) -> StressScore:
    """
    Computes a scientific 0-100 Financial Stress Index using 5 weighted pillars:
    1. Rent Burden (30% weight): Rent / Income. >30% starts stress; >50% severe.
    2. Savings Ability / Gap (25% weight): Savings vs User's Savings Target.
    3. Essential Expenses Ratio (20% weight): (Rent + Food + Transport + Utilities) / Income.
    4. Lifestyle / Discretionary Pressure (15% weight): Discretionary / Income.
    5. Emergency Buffer / Net Cashflow Vulnerability (10% weight): Negative cashflow or thin margin.
    """
    income = float(user_input.monthly_income)
    if income <= 0:
        return StressScore(
            score=100,
            status="Unsustainable",
            status_badge="🔴 Severe",
            color="#ef4444",
            description="Zero or negative monthly income.",
            breakdown=StressFactors(
                rent_burden_score=30.0,
                savings_gap_score=25.0,
                essential_ratio_score=20.0,
                lifestyle_ratio_score=15.0,
                buffer_score=10.0
            )
        )

    # 1. Rent Burden Score (0 to 30)
    rent_ratio = expenses.rent / income
    if rent_ratio <= 0.20:
        rent_score = rent_ratio * 30.0  # 0 to 6
    elif rent_ratio <= 0.35:
        rent_score = 6.0 + ((rent_ratio - 0.20) / 0.15) * 12.0  # 6 to 18
    elif rent_ratio <= 0.50:
        rent_score = 18.0 + ((rent_ratio - 0.35) / 0.15) * 8.0  # 18 to 26
    else:
        rent_score = min(30.0, 26.0 + ((rent_ratio - 0.50) / 0.20) * 4.0)

    # 2. Savings Ability / Target Achievement Score (0 to 25)
    target = max(1.0, float(user_input.savings_target))
    savings = health.net_savings
    if savings >= target:
        # Target fully met
        excess_ratio = min(2.0, savings / target)
        savings_gap_score = max(0.0, 5.0 - (excess_ratio - 1.0) * 5.0)  # 0 to 5
    elif savings > 0:
        # Partial savings
        gap_ratio = (target - savings) / target
        savings_gap_score = 5.0 + (gap_ratio * 15.0)  # 5 to 20
    else:
        # Negative savings / deficit
        deficit_ratio = min(1.0, abs(savings) / income)
        savings_gap_score = 20.0 + (deficit_ratio * 5.0)  # 20 to 25

    # 3. Essential Expenses Ratio (0 to 20)
    essentials = expenses.rent + expenses.food + expenses.transport + expenses.utilities + expenses.internet_phone
    essential_ratio = essentials / income
    if essential_ratio <= 0.50:
        essential_score = (essential_ratio / 0.50) * 8.0  # 0 to 8
    elif essential_ratio <= 0.70:
        essential_score = 8.0 + ((essential_ratio - 0.50) / 0.20) * 6.0  # 8 to 14
    elif essential_ratio <= 0.85:
        essential_score = 14.0 + ((essential_ratio - 0.70) / 0.15) * 4.0  # 14 to 18
    else:
        essential_score = min(20.0, 18.0 + ((essential_ratio - 0.85) / 0.15) * 2.0)

    # 4. Lifestyle / Discretionary Pressure (0 to 15)
    discretionary = expenses.lifestyle_discretionary + expenses.miscellaneous + expenses.subscriptions
    discretionary_ratio = discretionary / income
    if discretionary_ratio <= 0.15:
        lifestyle_score = (discretionary_ratio / 0.15) * 4.0  # 0 to 4
    elif discretionary_ratio <= 0.30:
        lifestyle_score = 4.0 + ((discretionary_ratio - 0.15) / 0.15) * 6.0  # 4 to 10
    else:
        lifestyle_score = min(15.0, 10.0 + ((discretionary_ratio - 0.30) / 0.20) * 5.0)

    # 5. Emergency Buffer / Net Cashflow Vulnerability (0 to 10)
    if health.net_savings >= (0.25 * income):
        buffer_score = 1.0
    elif health.net_savings >= (0.10 * income):
        buffer_score = 4.0
    elif health.net_savings >= 0:
        buffer_score = 7.0
    else:
        buffer_score = 10.0

    raw_total = rent_score + savings_gap_score + essential_score + lifestyle_score + buffer_score
    final_score = int(round(max(0.0, min(100.0, raw_total))))

    # Categorization based on specification
    if final_score <= 25:
        status = "Comfortable"
        status_badge = "🟢 Comfortable"
        color = "#10b981"  # Emerald
        description = "Your income comfortably covers living costs and exceeds your savings goal with ample financial safety."
    elif final_score <= 50:
        status = "Manageable"
        status_badge = "🟢 Manageable"
        color = "#22c55e"  # Green
        description = "Healthy budget balance. You are saving consistently, though big discretionary splurges should be planned."
    elif final_score <= 70:
        status = "Tight"
        status_badge = "🟡 Tight"
        color = "#eab308"  # Amber
        description = "Expenses absorb most of your income. Little room for unexpected emergencies; consider trimming rent or dining out."
    elif final_score <= 85:
        status = "Difficult"
        status_badge = "🟠 Difficult"
        color = "#f97316"  # Orange
        description = "High financial strain. Rent and essential living costs leave negligible savings. Relocation or roommate sharing recommended."
    else:
        status = "Unsustainable"
        status_badge = "🔴 Unsustainable"
        color = "#ef4444"  # Red
        description = "Outflows exceed or nearly exhaust your total salary. Immediate lifestyle downscaling or shared accommodation required."

    return StressScore(
        score=final_score,
        status=status,
        status_badge=status_badge,
        color=color,
        description=description,
        breakdown=StressFactors(
            rent_burden_score=round(rent_score, 1),
            savings_gap_score=round(savings_gap_score, 1),
            essential_ratio_score=round(essential_score, 1),
            lifestyle_ratio_score=round(lifestyle_score, 1),
            buffer_score=round(buffer_score, 1)
        )
    )
