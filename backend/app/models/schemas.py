from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class LifestyleTier(str, Enum):
    BASIC = "basic"
    MODERATE = "moderate"
    PREMIUM = "premium"

class LivingType(str, Enum):
    ALONE = "alone"
    WITH_ROOMMATE = "with_roommate"
    WITH_FAMILY = "with_family"

class RentType(str, Enum):
    PG = "pg"
    ONE_BHK = "1bhk"
    TWO_BHK_SHARED = "2bhk_shared"
    TWO_BHK_PRIVATE = "2bhk_private"
    THREE_BHK_SHARED = "3bhk_shared"

class SpendingHabits(BaseModel):
    eating_outside: int = Field(default=50, ge=0, le=100, description="Eating out intensity slider (0-100%)")
    shopping: int = Field(default=40, ge=0, le=100, description="Shopping spending slider (0-100%)")
    entertainment: int = Field(default=50, ge=0, le=100, description="Entertainment spending slider (0-100%)")
    travel: int = Field(default=40, ge=0, le=100, description="Travel spending slider (0-100%)")
    subscriptions: int = Field(default=30, ge=0, le=100, description="Subscriptions / OTT spending slider (0-100%)")

class UserProfileInput(BaseModel):
    monthly_income: float = Field(..., ge=5000, description="Monthly in-hand net salary (INR)")
    city: str = Field(..., description="Target Indian city name or ID")
    age: Optional[int] = Field(default=24, ge=18, le=100)
    living_type: LivingType = Field(default=LivingType.ALONE)
    lifestyle: LifestyleTier = Field(default=LifestyleTier.MODERATE)
    rent_type: RentType = Field(default=RentType.ONE_BHK)
    savings_target: float = Field(default=10000.0, ge=0, description="Desired monthly savings target (INR)")
    spending_habits: SpendingHabits = Field(default_factory=SpendingHabits)
    custom_rent: Optional[float] = Field(default=None, ge=0, description="Optional override for actual rent")
    target_neighborhood: Optional[str] = Field(default=None, description="Optional specific neighborhood/area")

class ExpenseBreakdown(BaseModel):
    rent: float
    food: float
    transport: float
    utilities: float
    internet_phone: float
    subscriptions: float
    lifestyle_discretionary: float
    shopping_entertainment: float
    travel: float
    miscellaneous: float
    total_fixed: float
    total_variable: float
    total_monthly_expense: float

class FinancialHealth(BaseModel):
    monthly_income: float
    total_expense: float
    net_savings: float
    savings_rate_pct: float
    expense_ratio_pct: float
    required_minimum_income: float
    target_met: bool
    savings_deficit_surplus: float
    annual_projected_savings: float

class StressFactors(BaseModel):
    rent_burden_score: float
    savings_gap_score: float
    essential_ratio_score: float
    lifestyle_ratio_score: float
    buffer_score: float

class StressScore(BaseModel):
    score: int
    status: str
    status_badge: str
    color: str
    description: str
    breakdown: StressFactors

class AIRecommendation(BaseModel):
    summary: str
    rent_analysis: str
    lifestyle_analysis: str
    savings_opportunity: str
    relocation_verdict: str
    action_items: List[str]

class CalculationResponse(BaseModel):
    city_id: str
    city_name: str
    user_input: UserProfileInput
    expenses: ExpenseBreakdown
    financial_health: FinancialHealth
    stress_score: StressScore
    ai_recommendation: AIRecommendation

class NeighborhoodInfo(BaseModel):
    id: str
    name: str
    vibe: str
    distance_to_it_hub_km: float
    avg_1bhk_rent: float
    avg_2bhk_shared_rent: float
    avg_pg_rent: float
    safety_score: int
    connectivity_score: int
    lifestyle_score: int
    best_suited_for: str

class CityMetadata(BaseModel):
    id: str
    name: str
    tier: str
    state: str
    short_desc: str
    tech_hubs: List[str]
    neighborhoods: List[NeighborhoodInfo]
    avg_cost_index: float

class CityComparisonItem(BaseModel):
    city_id: str
    city_name: str
    state: str
    tier: str
    monthly_cost: float
    net_savings: float
    savings_rate_pct: float
    stress_score: int
    status: str
    status_badge: str
    color: str
    is_best_city: bool = False
    rank: int
    rationale: str

class CityComparisonResponse(BaseModel):
    base_income: float
    lifestyle: str
    rent_type: str
    best_city: str
    best_city_savings: float
    rankings: List[CityComparisonItem]
    insights: List[str]

class SimulationRequest(BaseModel):
    base_profile: UserProfileInput
    simulated_income: Optional[float] = None
    simulated_rent_type: Optional[RentType] = None
    simulated_lifestyle: Optional[LifestyleTier] = None
    simulated_city: Optional[str] = None
    simulated_eating_out: Optional[int] = None
    simulated_savings_target: Optional[float] = None

class SimulationResponse(BaseModel):
    baseline_expenses: float
    baseline_savings: float
    baseline_stress_score: int
    simulated_expenses: float
    simulated_savings: float
    simulated_stress_score: int
    delta_savings: float
    delta_savings_pct: float
    delta_stress_score: int
    key_takeaway: str
    comparison_details: Dict[str, Any]

class JobOfferRequest(BaseModel):
    current_city: str
    current_income: float
    current_rent_type: RentType = RentType.ONE_BHK
    offer_city: str
    offer_income: float
    offer_rent_type: Optional[RentType] = None
    lifestyle: LifestyleTier = LifestyleTier.MODERATE
    savings_target: float = 15000.0

class JobOfferResponse(BaseModel):
    current_city: str
    current_income: float
    current_expense: float
    current_savings: float
    current_stress: int
    offer_city: str
    offer_income: float
    offer_expense: float
    offer_savings: float
    offer_stress: int
    delta_income: float
    delta_savings: float
    cost_of_living_diff_pct: float
    ppp_parity_salary: float
    is_financially_viable: bool
    verdict_badge: str
    verdict_summary: str
    detailed_points: List[str]
