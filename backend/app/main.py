import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.routes.cities import router as cities_router
from app.routes.calculation import router as calculation_router
from app.routes.simulation import router as simulation_router
from app.routes.neighborhoods import router as neighborhoods_router
from app.routes.job_offer import router as job_offer_router
from app.routes.commute import router as commute_router

app = FastAPI(
    title="City Affordability Planner & Relocation Decision Engine API",
    description="Data-driven cost prediction, 5-factor financial stress scoring, and AI relocation advisor for Top 10 Indian cities.",
    version="1.0.0"
)

# Enable CORS for open frontend consumption
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(cities_router)
app.include_router(calculation_router)
app.include_router(simulation_router)
app.include_router(neighborhoods_router)
app.include_router(job_offer_router)
app.include_router(commute_router)

@app.get("/health", tags=["System"])
@app.get("/api/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": "City Affordability Planner & Relocation Decision System",
        "version": "1.0.0",
        "supported_cities": 10
    }

# Mount static frontend directory
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend"))

if os.path.exists(frontend_dir):
    # Mount subdirectories if present
    css_dir = os.path.join(frontend_dir, "css")
    js_dir = os.path.join(frontend_dir, "js")
    if os.path.exists(css_dir):
        app.mount("/css", StaticFiles(directory=css_dir), name="css")
    if os.path.exists(js_dir):
        app.mount("/js", StaticFiles(directory=js_dir), name="js")
    
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

    @app.get("/", include_in_schema=False)
    def serve_frontend_root():
        index_file = os.path.join(frontend_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "Frontend index.html not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
