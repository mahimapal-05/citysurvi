from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional
from app.services.commute_engine import calculate_commute_tradeoff

router = APIRouter(prefix="/api/commute", tags=["Commute & Traffic Tax"])

class CommuteTradeoffRequest(BaseModel):
    city: str = Field(default="bengaluru")
    monthly_income: float = Field(default=75000.0)
    suburb_rent: float = Field(default=16000.0)
    core_rent: float = Field(default=24000.0)
    suburb_distance_km: float = Field(default=18.0)
    core_distance_km: float = Field(default=4.0)
    suburb_traffic_mins_per_trip: float = Field(default=65.0)
    core_traffic_mins_per_trip: float = Field(default=18.0)
    commute_mode: str = Field(default="cab") # cab, car, two_wheeler, metro
    working_days_per_month: int = Field(default=22)

@router.post("/tradeoff")
def evaluate_commute_tradeoff(req: CommuteTradeoffRequest):
    return calculate_commute_tradeoff(
        city=req.city,
        monthly_income=req.monthly_income,
        suburb_rent=req.suburb_rent,
        core_rent=req.core_rent,
        suburb_distance_km=req.suburb_distance_km,
        core_distance_km=req.core_distance_km,
        suburb_traffic_mins_per_trip=req.suburb_traffic_mins_per_trip,
        core_traffic_mins_per_trip=req.core_traffic_mins_per_trip,
        commute_mode=req.commute_mode,
        working_days_per_month=req.working_days_per_month
    )
