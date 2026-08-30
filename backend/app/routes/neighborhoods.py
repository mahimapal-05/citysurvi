from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.data.cities_data import get_city_data
from app.models.schemas import NeighborhoodInfo

router = APIRouter(prefix="/api/neighborhoods", tags=["Neighborhoods"])

@router.get("/{city_id}", response_model=List[NeighborhoodInfo])
def get_neighborhoods_for_city(city_id: str):
    """
    Returns verified neighborhoods, IT hub distances, rental averages,
    and lifestyle/safety ratings for a chosen city.
    """
    city_data = get_city_data(city_id)
    raw_neighborhoods = city_data.get("neighborhoods", [])
    if not raw_neighborhoods:
        raise HTTPException(status_code=404, detail=f"No neighborhoods found for city: {city_id}")
    
    return [NeighborhoodInfo(**n) for n in raw_neighborhoods]
