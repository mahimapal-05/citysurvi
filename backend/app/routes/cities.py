from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.data.cities_data import CITIES_DB, get_city_data

router = APIRouter(prefix="/api/cities", tags=["Cities"])

@router.get("", response_model=List[Dict[str, Any]])
def list_cities():
    """Returns list of supported Indian cities and summary information."""
    result = []
    for city_id, c in CITIES_DB.items():
        result.append({
            "id": c["id"],
            "name": c["name"],
            "state": c["state"],
            "tier": c["tier"],
            "short_desc": c["short_desc"],
            "avg_cost_index": c["avg_cost_index"],
            "tech_hubs": c["tech_hubs"],
            "rent_preview": c["rent"],
            "neighborhood_count": len(c.get("neighborhoods", []))
        })
    return result

@router.get("/{city_id}")
def get_city_details(city_id: str):
    """Returns comprehensive cost data and neighborhood breakdown for a specific city."""
    try:
        data = get_city_data(city_id)
        return data
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"City not found: {city_id}")
