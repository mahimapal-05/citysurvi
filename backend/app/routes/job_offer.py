from fastapi import APIRouter
from app.models.schemas import JobOfferRequest, JobOfferResponse
from app.services.job_offer_engine import evaluate_job_offer

router = APIRouter(prefix="/api/job-offer-evaluate", tags=["Job Offer & Relocation"])

@router.post("", response_model=JobOfferResponse)
def evaluate_relocation_offer(req: JobOfferRequest):
    """
    Evaluates relocation viability for a new job offer across Indian cities.
    Computes Purchasing Power Parity (PPP), net real savings difference, and strategic advice.
    """
    return evaluate_job_offer(req)
