from fastapi import APIRouter
from app.models.schemas import SimulationRequest, SimulationResponse
from app.services.simulation_engine import run_simulation

router = APIRouter(prefix="/api/simulate", tags=["Simulation"])

@router.post("", response_model=SimulationResponse)
def simulate_scenario(req: SimulationRequest):
    """
    Evaluates real-time What-If scenario shifts (e.g. salary hikes, roommate sharing, lifestyle changes)
    and computes instant deltas in monthly savings and financial stress.
    """
    return run_simulation(req)
