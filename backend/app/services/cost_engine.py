from typing import Dict, Any
from app.models.schemas import (
    UserProfileInput,
    ExpenseBreakdown,
    FinancialHealth,
    LifestyleTier,
    RentType,
    LivingType
)
from app.data.cities_data import get_city_data

def calculate_expenses(user_input: UserProfileInput) -> ExpenseBreakdown:
    city_data = get_city_data(user_input.city)
    
    # 1. Base Rent Calculation
    if user_input.custom_rent is not None and user_input.custom_rent > 0:
        rent = float(user_input.custom_rent)
    else:
        rent_tier = user_input.rent_type.value
        rent = float(city_data["rent"].get(rent_tier, city_data["rent"]["1bhk"]))
        
        # Adjust for living preference if user specified living alone in shared
        if user_input.living_type == LivingType.WITH_FAMILY:
            # Living with family usually drastically cuts rent (e.g. contribution)
            rent = rent * 0.25
        elif user_input.living_type == LivingType.WITH_ROOMMATE and user_input.rent_type == RentType.ONE_BHK:
            # 1BHK shared with roommate
            rent = rent * 0.55

    # 2. Food Calculation
    lifestyle_key = user_input.lifestyle.value
    base_food = float(city_data["food"].get(lifestyle_key, city_data["food"]["moderate"]))
    
    # Eating outside slider modifier (0% -> 0.8x, 50% -> 1.0x, 100% -> 1.5x)
    eating_slider = user_input.spending_habits.eating_outside / 50.0  # 1.0 at 50%
    eating_multiplier = 0.8 + (0.35 * eating_slider)
    food = round(base_food * eating_multiplier, 2)

    # 3. Transport Calculation
    base_transport = float(city_data["transport"].get(lifestyle_key, city_data["transport"]["moderate"]))
    # Travel slider modifier
    travel_slider = user_input.spending_habits.travel / 50.0
    transport = round(base_transport * (0.85 + 0.3 * travel_slider), 2)

    # 4. Fixed Utilities & Digital Connectivity
    utilities = float(city_data["utilities"])
    internet_phone = float(city_data["internet_phone"])
    
    # Subscriptions slider (0% -> 0.5x, 50% -> 1.0x, 100% -> 2.2x)
    sub_slider = user_input.spending_habits.subscriptions / 50.0
    subscriptions = round(float(city_data["subscriptions"]) * (0.5 + 0.7 * sub_slider), 2)

    # 5. Lifestyle Discretionary, Shopping & Entertainment
    base_discretionary = float(city_data["discretionary_base"])
    lifestyle_mult = 0.7 if user_input.lifestyle == LifestyleTier.BASIC else (1.0 if user_input.lifestyle == LifestyleTier.MODERATE else 1.6)
    
    shop_slider = user_input.spending_habits.shopping / 50.0
    ent_slider = user_input.spending_habits.entertainment / 50.0
    
    shopping_entertainment = round(base_discretionary * lifestyle_mult * (0.4 * shop_slider + 0.6 * ent_slider), 2)
    travel_leisure = round(base_discretionary * 0.6 * travel_slider * lifestyle_mult, 2)
    miscellaneous = round(base_discretionary * 0.5 * lifestyle_mult, 2)
    
    lifestyle_discretionary = round(shopping_entertainment + travel_leisure, 2)

    # Aggregations
    total_fixed = round(rent + utilities + internet_phone + subscriptions, 2)
    total_variable = round(food + transport + shopping_entertainment + travel_leisure + miscellaneous, 2)
    total_monthly_expense = round(total_fixed + total_variable, 2)

    return ExpenseBreakdown(
        rent=rent,
        food=food,
        transport=transport,
        utilities=utilities,
        internet_phone=internet_phone,
        subscriptions=subscriptions,
        lifestyle_discretionary=lifestyle_discretionary,
        shopping_entertainment=shopping_entertainment,
        travel=travel_leisure,
        miscellaneous=miscellaneous,
        total_fixed=total_fixed,
        total_variable=total_variable,
        total_monthly_expense=total_monthly_expense
    )

def calculate_financial_health(user_input: UserProfileInput, expenses: ExpenseBreakdown) -> FinancialHealth:
    income = float(user_input.monthly_income)
    total_expense = expenses.total_monthly_expense
    net_savings = round(income - total_expense, 2)
    
    savings_rate_pct = round((net_savings / income) * 100.0, 1) if income > 0 else 0.0
    expense_ratio_pct = round((total_expense / income) * 100.0, 1) if income > 0 else 100.0
    
    required_minimum_income = round(total_expense + user_input.savings_target, 2)
    target_met = net_savings >= user_input.savings_target
    savings_deficit_surplus = round(net_savings - user_input.savings_target, 2)
    annual_projected_savings = round(max(0.0, net_savings) * 12.0, 2)

    return FinancialHealth(
        monthly_income=income,
        total_expense=total_expense,
        net_savings=net_savings,
        savings_rate_pct=savings_rate_pct,
        expense_ratio_pct=expense_ratio_pct,
        required_minimum_income=required_minimum_income,
        target_met=target_met,
        savings_deficit_surplus=savings_deficit_surplus,
        annual_projected_savings=annual_projected_savings
    )
