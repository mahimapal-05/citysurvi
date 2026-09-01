import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["supported_cities"] == 10

def test_get_cities():
    response = client.get("/api/cities")
    assert response.status_code == 200
    cities = response.json()
    assert len(cities) == 10
    city_names = [c["name"] for c in cities]
    assert "Bengaluru" in city_names
    assert "Mumbai" in city_names
    assert "Hyderabad" in city_names

def test_calculate_api():
    payload = {
        "monthly_income": 50000.0,
        "city": "bengaluru",
        "age": 23,
        "living_type": "alone",
        "lifestyle": "moderate",
        "rent_type": "1bhk",
        "savings_target": 10000.0,
        "spending_habits": {
            "eating_outside": 70,
            "shopping": 40,
            "entertainment": 60,
            "travel": 50,
            "subscriptions": 30
        }
    }
    response = client.post("/api/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["city_name"] == "Bengaluru"
    assert "expenses" in data
    assert "financial_health" in data
    assert "stress_score" in data
    assert "ai_recommendation" in data

def test_compare_api():
    payload = {
        "monthly_income": 55000.0,
        "city": "pune",
        "lifestyle": "moderate",
        "rent_type": "1bhk",
        "savings_target": 12000.0
    }
    response = client.post("/api/compare", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "rankings" in data
    assert len(data["rankings"]) == 10
    assert "best_city" in data

def test_simulate_api():
    payload = {
        "base_profile": {
            "monthly_income": 50000.0,
            "city": "bengaluru",
            "rent_type": "1bhk",
            "lifestyle": "moderate",
            "savings_target": 10000.0
        },
        "simulated_income": 70000.0,
        "simulated_rent_type": "2bhk_shared"
    }
    response = client.post("/api/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["delta_savings"] > 0
    assert "key_takeaway" in data

def test_neighborhoods_api():
    response = client.get("/api/neighborhoods/bengaluru")
    assert response.status_code == 200
    neighborhoods = response.json()
    assert len(neighborhoods) >= 4
    names = [n["name"] for n in neighborhoods]
    assert any("HSR" in n for n in names)

def test_job_offer_evaluate_api():
    payload = {
        "current_city": "pune",
        "current_income": 45000.0,
        "current_rent_type": "1bhk",
        "offer_city": "bengaluru",
        "offer_income": 65000.0,
        "offer_rent_type": "1bhk",
        "lifestyle": "moderate",
        "savings_target": 15000.0
    }
    response = client.post("/api/job-offer-evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "verdict_badge" in data
    assert "ppp_parity_salary" in data

def test_commute_tradeoff_endpoint():
    payload = {
        "city": "bengaluru",
        "monthly_income": 80000,
        "suburb_rent": 18000,
        "core_rent": 26000,
        "suburb_distance_km": 18,
        "core_distance_km": 4,
        "suburb_traffic_mins_per_trip": 75,
        "core_traffic_mins_per_trip": 20,
        "commute_mode": "cab"
    }
    response = client.post("/api/commute/tradeoff", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "deltas" in data
    assert "verdict" in data
    assert data["deltas"]["hours_saved_monthly"] > 0
