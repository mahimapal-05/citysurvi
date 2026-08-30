import pytest
from app.models.schemas import (
    UserProfileInput,
    LifestyleTier,
    RentType,
    LivingType,
    SpendingHabits
)
from app.services.cost_engine import calculate_expenses, calculate_financial_health
from app.services.stress_engine import calculate_stress_score
from app.services.comparison_engine import compare_all_cities
from app.services.ai_recommender import generate_ai_recommendation

def test_cost_calculation_bengaluru():
    user = UserProfileInput(
        monthly_income=50000.0,
        city="bengaluru",
        age=22,
        living_type=LivingType.ALONE,
        lifestyle=LifestyleTier.MODERATE,
        rent_type=RentType.ONE_BHK,
        savings_target=10000.0,
        spending_habits=SpendingHabits(
            eating_outside=70,
            shopping=40,
            entertainment=60,
            travel=50,
            subscriptions=30
        )
    )
    expenses = calculate_expenses(user)
    health = calculate_financial_health(user, expenses)
    stress = calculate_stress_score(user, expenses, health)
    ai_rec = generate_ai_recommendation(user, expenses, health, stress)

    assert expenses.rent == 18500.0
    assert expenses.total_monthly_expense > 30000.0
    assert health.net_savings == 50000.0 - expenses.total_monthly_expense
    assert 0 <= stress.score <= 100
    assert len(ai_rec.action_items) > 0

def test_roommate_sharing_savings_delta():
    alone_profile = UserProfileInput(
        monthly_income=50000.0,
        city="bengaluru",
        rent_type=RentType.ONE_BHK
    )
    shared_profile = UserProfileInput(
        monthly_income=50000.0,
        city="bengaluru",
        rent_type=RentType.TWO_BHK_SHARED
    )
    exp_alone = calculate_expenses(alone_profile)
    exp_shared = calculate_expenses(shared_profile)
    
    # 2BHK shared should be significantly cheaper than private 1BHK
    assert exp_shared.rent < exp_alone.rent
    assert exp_shared.total_monthly_expense < exp_alone.total_monthly_expense

def test_all_10_cities_comparison():
    user = UserProfileInput(
        monthly_income=60000.0,
        city="bengaluru",
        lifestyle=LifestyleTier.MODERATE,
        rent_type=RentType.ONE_BHK,
        savings_target=15000.0
    )
    comp = compare_all_cities(user)
    assert len(comp.rankings) == 10
    assert comp.best_city is not None
    assert comp.rankings[0].rank == 1
    assert comp.rankings[0].is_best_city is True

def test_stress_score_boundaries():
    # Very high income -> low stress
    rich_user = UserProfileInput(
        monthly_income=300000.0,
        city="ahmedabad",
        lifestyle=LifestyleTier.BASIC,
        rent_type=RentType.PG,
        savings_target=50000.0
    )
    exp = calculate_expenses(rich_user)
    health = calculate_financial_health(rich_user, exp)
    stress = calculate_stress_score(rich_user, exp, health)
    assert stress.score <= 25
    assert stress.status == "Comfortable"

    # Very low income in Mumbai -> high stress
    strained_user = UserProfileInput(
        monthly_income=25000.0,
        city="mumbai",
        lifestyle=LifestyleTier.PREMIUM,
        rent_type=RentType.ONE_BHK,
        savings_target=10000.0
    )
    exp2 = calculate_expenses(strained_user)
    health2 = calculate_financial_health(strained_user, exp2)
    stress2 = calculate_stress_score(strained_user, exp2, health2)
    assert stress2.score >= 70
