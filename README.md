# 🏙️ City Affordability Planner & Relocation Decision System

> **An intelligent, data-driven cost prediction, financial stress analysis, and career relocation advisor for India's Top 10 Tech & Job Cities.**

Instead of simply asking *"How expensive is Bangalore?"*, this platform answers:
> **"Given MY salary, MY lifestyle, and MY savings goals, where can I actually build a financially comfortable life — and is that new job offer worth relocating for?"**

---

## 🌟 Key Features

1. **Top 10 Indian Job Cities Database**:
   - Verified, structured cost benchmarks for **Bengaluru, Mumbai, Delhi (NCR), Hyderabad, Pune, Chennai, Gurugram, Noida, Kolkata, and Ahmedabad / GIFT City**.
   - Granular breakdown of housing (PG, 1BHK, 2BHK shared, 2BHK private, 3BHK shared), food tiers, transit passes vs cabs, utilities, fiber broadband, and lifestyle indices.

2. **Deterministic Financial & Stress Calculation Engine**:
   - Computes exact arithmetic for Fixed vs. Variable vs. Discretionary expenses.
   - **5-Factor Scientific Financial Stress Score (0–100)**:
     - 🏠 *Rent Burden* (30% weight)
     - 🎯 *Savings Target Gap* (25% weight)
     - ⚡ *Essential Expense Ratio* (20% weight)
     - 🛍️ *Lifestyle & Discretionary Outflow* (15% weight)
     - 🛡️ *Emergency Runway Buffer* (10% weight)
   - Status classifications: `🟢 Comfortable (0-25)`, `🟢 Manageable (26-50)`, `🟡 Tight (51-70)`, `🟠 Difficult (71-85)`, `🔴 Unsustainable (86-100)`.

3. **Safe AI Recommendation & Explanation Layer (Zero Hallucination)**:
   - Evaluates structured calculation output without hallucinating figures.
   - Generates actionable financial optimizations, rent-saving opportunities, and relocation verdicts.

4. **10-City Instant Comparison & Best City Recommender**:
   - Simulates all 10 cities simultaneously for your take-home pay.
   - Sort by lowest stress, highest monthly savings, or lowest living costs.
   - Automatically highlights the **#1 Best City** for your financial setup with clear rationale.

5. **Interactive "What-If?" Real-Time Sandbox**:
   - Live sliders for salary hikes (e.g., *What if salary becomes ₹70K?*), flatmate sharing, dining reduction, and relocation.
   - Instant delta cards showing `+₹X/month` savings and 1-year cumulative wealth multiplier.

6. **Locality & Tech Hub Proximity Guide**:
   - Explores top neighborhoods (e.g., HSR Layout, Koramangala, Powai, Baner, Gachibowli, DLF Cyber City, Salt Lake).
   - Shows distance to major IT corridors, safety ratings (0–100), connectivity, and rent brackets.

7. **Job Offer & Relocation Decision Engine**:
   - Compares Current City salary vs. New Offer City salary.
   - Computes **Purchasing Power Parity (PPP)** equivalent break-even CTC and net real savings differential.

---

## 🏗️ System Architecture

```text
                           USER / WEB DASHBOARD
               (Modern Glassmorphic HTML5 + CSS3 + Vanilla JS)
                                     │
                                     ▼
                          FASTAPI BACKEND SERVER
                              (Python 3.13)
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        ▼                            ▼                            ▼
  /api/calculate               /api/compare                 /api/simulate
  /api/neighborhoods           /api/cities                  /api/job-offer-evaluate
        │                            │                            │
        └────────────────────────────┼────────────────────────────┘
                                     │
               ┌─────────────────────┴─────────────────────┐
               ▼                                           ▼
       COST & STRESS ENGINES                     ZERO-HALLUCINATION AI
  (Deterministic Arithmetic,                 (Structured Prompting & Rule
   5-Factor Weighted Stress Scoring)          Reasoning Interpretation)
               │                                           │
               └─────────────────────┬─────────────────────┘
                                     ▼
                          TOP 10 CITIES DATABASE
                        (Verified Living Benchmarks)
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Python 3.10+
- `pip`

### 2. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 3. Run FastAPI Backend & Frontend Server
```bash
python -m uvicorn app.main:app --app-dir backend --reload --port 8000
```
Open your browser and navigate to:
👉 **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

*Interactive Swagger API documentation is available at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)*

---

## 🧪 Running Automated Tests

Run the comprehensive test suite verifying the cost arithmetic, stress score boundaries, and all API endpoints:

```bash
python -m pytest backend/tests
```

---

## 📊 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck and supported city count |
| `GET` | `/api/cities` | Returns metadata and rent previews for all 10 cities |
| `POST` | `/api/calculate` | Computes expenses, savings, stress score (0-100), and AI recommendations |
| `POST` | `/api/compare` | Compares and ranks all 10 cities simultaneously for a user profile |
| `POST` | `/api/simulate` | Evaluates real-time "What-If" scenario changes and returns deltas |
| `GET` | `/api/neighborhoods/{city_id}` | Returns localities, tech hub distances, and safety scores for a city |
| `POST` | `/api/job-offer-evaluate` | Evaluates job offer relocation viability and Purchasing Power Parity |

---

## 📁 Repository Structure

```text
mahi project/
├── backend/
│   ├── app/
│   │   ├── data/
│   │   │   └── cities_data.py          # Verified 10-city & neighborhood dataset
│   │   ├── models/
│   │   │   └── schemas.py              # Pydantic request/response data contracts
│   │   ├── routes/
│   │   │   ├── calculation.py          # /api/calculate, /api/compare
│   │   │   ├── cities.py               # /api/cities
│   │   │   ├── job_offer.py            # /api/job-offer-evaluate
│   │   │   ├── neighborhoods.py        # /api/neighborhoods
│   │   │   └── simulation.py           # /api/simulate
│   │   ├── services/
│   │   │   ├── ai_recommender.py       # Safe AI advice generation
│   │   │   ├── comparison_engine.py    # 10-City matrix & ranking
│   │   │   ├── cost_engine.py          # Deterministic expense calculation
│   │   │   ├── job_offer_engine.py     # Relocation & PPP parity analyzer
│   │   │   ├── simulation_engine.py    # What-If scenario sandbox
│   │   │   └── stress_engine.py        # 5-Factor stress score algorithm (0-100)
│   │   └── main.py                     # FastAPI entrypoint, CORS & static frontend mount
│   ├── tests/
│   │   ├── test_api.py                 # Endpoint integration tests
│   │   └── test_engine.py              # Unit tests for calculations & stress bounds
│   └── requirements.txt
├── frontend/
│   ├── css/
│   │   └── styles.css                  # Dark/light glassmorphic styling system
│   ├── js/
│   │   ├── components/
│   │   │   ├── calculator.js           # Form controller & quick presets
│   │   │   ├── comparison.js           # 10-City Matrix UI & ranking
│   │   │   ├── gauge.js                # Animated SVG Speedometer Stress Gauge
│   │   │   ├── jobOffer.js             # Job Offer & PPP evaluator UI
│   │   │   ├── neighborhoods.js        # Locality & IT hub explorer
│   │   │   └── simulator.js            # Live What-If sandbox UI
│   │   ├── data/
│   │   │   └── client_cities.js        # Client data for instant rendering & fallback
│   │   ├── api.js                      # API client service with offline fallback
│   │   ├── app.js                      # Application bootstrap & tab navigation
│   │   ├── charts.js                   # Canvas Donut chart & expense legend
│   │   └── state.js                    # Reactive global state store
│   └── index.html                      # Single Page Application
└── README.md
```
