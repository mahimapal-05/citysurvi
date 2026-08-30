from fastapi import APIRouter
from app.models.schemas import (
    UserProfileInput,
    CalculationResponse,
    CityComparisonResponse
)
from app.data.cities_data import get_city_data
from app.services.cost_engine import calculate_expenses, calculate_financial_health
from app.services.stress_engine import calculate_stress_score
from app.services.ai_recommender import generate_ai_recommendation
from app.services.comparison_engine import compare_all_cities

router = APIRouter(prefix="/api", tags=["Calculation"])

@router.post("/calculate", response_model=CalculationResponse)
def calculate_city_affordability(user_input: UserProfileInput):
    """
    Computes exact monthly expenses, financial health ratios, 5-factor stress score,
    and safe zero-hallucination AI recommendations for the given city and user profile.
    """
    city_data = get_city_data(user_input.city)
    expenses = calculate_expenses(user_input)
    health = calculate_financial_health(user_input, expenses)
    stress = calculate_stress_score(user_input, expenses, health)
    ai_rec = generate_ai_recommendation(user_input, expenses, health, stress)

    return CalculationResponse(
        city_id=city_data["id"],
        city_name=city_data["name"],
        user_input=user_input,
        expenses=expenses,
        financial_health=health,
        stress_score=stress,
        ai_recommendation=ai_rec
    )

@router.post("/compare", response_model=CityComparisonResponse)
def compare_cities(user_input: UserProfileInput):
    """
    Runs multi-city calculation across all 10 Indian cities for the given profile,
    ranks them by affordability/savings, and flags the #1 Best City for their financial goal.
    """
    return compare_all_cities(user_input)
