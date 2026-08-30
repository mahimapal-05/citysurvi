/**
 * Profile Calculator & Quick Scenario Presets Controller
 */

class CalculatorComponent {
  constructor() {
    this.gauge = new window.StressGauge("stressGaugeContainer");
    this.charts = new window.ExpenseCharts("expenseDonutCanvas", "expenseLegendContainer");
    this.initFormEvents();
  }

  initFormEvents() {
    const form = document.getElementById("profileForm");
    if (!form) return;

    // Presets
    const presetButtons = document.querySelectorAll(".preset-btn");
    presetButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const scenario = e.currentTarget.dataset.scenario;
        this.applyPreset(scenario);
      });
    });

    // Slider value displays
    const sliders = form.querySelectorAll("input[type='range']");
    sliders.forEach(slider => {
      const dispId = slider.id + "Val";
      const display = document.getElementById(dispId);
      slider.addEventListener("input", (e) => {
        if (display) display.textContent = `${e.target.value}%`;
      });
    });

    // Form submit triggers calculation + Thermal Receipt Print animation
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.runCalculation();
    });

    // Quick reactive change for select & main radio inputs
    const reactiveInputs = form.querySelectorAll("select, input[name='rent_type'], input[name='lifestyle'], input[name='living_type']");
    reactiveInputs.forEach(input => {
      input.addEventListener("change", () => {
        this.runCalculation(true);
      });
    });
  }

  applyPreset(scenario) {
    const presets = {
      bengaluru_fresher: {
        income: 45000,
        city: "bengaluru",
        age: 22,
        living_type: "alone",
        lifestyle: "moderate",
        rent_type: "1bhk",
        target: 10000,
        eating: 65, shop: 35, ent: 55, travel: 40, subs: 30
      },
      mumbai_fintech: {
        income: 110000,
        city: "mumbai",
        age: 27,
        living_type: "alone",
        lifestyle: "moderate",
        rent_type: "1bhk",
        target: 30000,
        eating: 60, shop: 50, ent: 70, travel: 50, subs: 40
      },
      hyderabad_dev: {
        income: 65000,
        city: "hyderabad",
        age: 24,
        living_type: "with_roommate",
        lifestyle: "moderate",
        rent_type: "2bhk_shared",
        target: 20000,
        eating: 50, shop: 40, ent: 45, travel: 35, subs: 25
      },
      pune_shared: {
        income: 40000,
        city: "pune",
        age: 23,
        living_type: "with_roommate",
        lifestyle: "basic",
        rent_type: "2bhk_shared",
        target: 12000,
        eating: 40, shop: 30, ent: 40, travel: 30, subs: 20
      },
      ahmedabad_gift: {
        income: 70000,
        city: "ahmedabad",
        age: 26,
        living_type: "alone",
        lifestyle: "moderate",
        rent_type: "1bhk",
        target: 25000,
        eating: 45, shop: 35, ent: 40, travel: 35, subs: 25
      }
    };

    const data = presets[scenario];
    if (!data) return;

    document.getElementById("monthlyIncome").value = data.income;
    document.getElementById("citySelect").value = data.city;
    document.getElementById("savingsTarget").value = data.target;

    const livingRadio = document.querySelector(`input[name="living_type"][value="${data.living_type}"]`);
    if (livingRadio) livingRadio.checked = true;

    const lifestyleRadio = document.querySelector(`input[name="lifestyle"][value="${data.lifestyle}"]`);
    if (lifestyleRadio) lifestyleRadio.checked = true;

    const rentRadio = document.querySelector(`input[name="rent_type"][value="${data.rent_type}"]`);
    if (rentRadio) rentRadio.checked = true;

    this.setSlider("eatingOutside", data.eating);
    this.setSlider("shopping", data.shop);
    this.setSlider("entertainment", data.ent);
    this.setSlider("travel", data.travel);
    this.setSlider("subscriptions", data.subs);

    this.runCalculation();
  }

  setSlider(id, val) {
    const elem = document.getElementById(id);
    const disp = document.getElementById(id + "Val");
    if (elem) elem.value = val;
    if (disp) disp.textContent = `${val}%`;
  }

  getFormData() {
    const income = parseFloat(document.getElementById("monthlyIncome").value) || 50000;
    const city = document.getElementById("citySelect").value || "bengaluru";
    const savingsTarget = parseFloat(document.getElementById("savingsTarget").value) || 10000;
    
    const livingType = document.querySelector("input[name='living_type']:checked")?.value || "alone";
    const lifestyle = document.querySelector("input[name='lifestyle']:checked")?.value || "moderate";
    const rentType = document.querySelector("input[name='rent_type']:checked")?.value || "1bhk";

    const customRentInput = document.getElementById("customRent");
    const customRent = customRentInput && customRentInput.value ? parseFloat(customRentInput.value) : null;

    return {
      monthly_income: income,
      city: city,
      age: 24,
      living_type: livingType,
      lifestyle: lifestyle,
      rent_type: rentType,
      savings_target: savingsTarget,
      spending_habits: {
        eating_outside: parseInt(document.getElementById("eatingOutside")?.value || "50"),
        shopping: parseInt(document.getElementById("shopping")?.value || "40"),
        entertainment: parseInt(document.getElementById("entertainment")?.value || "50"),
        travel: parseInt(document.getElementById("travel")?.value || "40"),
        subscriptions: parseInt(document.getElementById("subscriptions")?.value || "30")
      },
      custom_rent: customRent
    };
  }

  async runCalculation(isQuiet = false) {
    const profile = this.getFormData();
    window.appState.setState({ userProfile: profile, isLoading: true });

    try {
      const calcResult = await window.apiService.calculate(profile);
      window.appState.setState({ currentCalculation: calcResult, isLoading: false });
      this.renderResults(calcResult);

      // Trigger Thermal Receipt Printing animation!
      if (window.receiptPrinterComponent) {
        window.receiptPrinterComponent.printReceipt(calcResult);
      }
      
      // Auto-trigger comparison refresh in background
      window.comparisonComponent?.refreshComparison(profile);
    } catch (err) {
      console.error("Calculation failed:", err);
      window.appState.setState({ isLoading: false });
    }
  }

  renderResults(res) {
    // 1. Stress Gauge
    this.gauge.render(
      res.stress_score.score,
      res.stress_score.status_badge,
      res.stress_score.color,
      res.stress_score.breakdown
    );

    // 2. High-level metric summary cards
    const health = res.financial_health;
    document.getElementById("statSavingsVal").textContent = `₹${Math.round(health.net_savings).toLocaleString()}`;
    document.getElementById("statSavingsRate").textContent = `${health.savings_rate_pct}%`;
    document.getElementById("statExpenseVal").textContent = `₹${Math.round(health.total_expense).toLocaleString()}`;
    document.getElementById("statExpenseRatio").textContent = `${health.expense_ratio_pct}%`;
    document.getElementById("statMinIncomeVal").textContent = `₹${Math.round(health.required_minimum_income).toLocaleString()}`;
    document.getElementById("statAnnualSavings").textContent = `₹${Math.round(health.annual_projected_savings).toLocaleString()}`;

    // Target Met Banner
    const targetBadge = document.getElementById("savingsTargetBadge");
    if (targetBadge) {
      if (health.target_met) {
        targetBadge.className = "target-badge target-met";
        targetBadge.innerHTML = `✓ Goal Met (+₹${Math.round(health.savings_deficit_surplus).toLocaleString()} surplus)`;
      } else {
        targetBadge.className = "target-badge target-missed";
        targetBadge.innerHTML = `✕ Short by ₹${Math.round(Math.abs(health.savings_deficit_surplus)).toLocaleString()}`;
      }
    }

    // 3. Expense Donut & Legend
    this.charts.renderDonut(res.expenses);

    // 4. AI Recommendation Box
    const ai = res.ai_recommendation;
    const aiContainer = document.getElementById("aiRecommendationContainer");
    if (aiContainer) {
      aiContainer.innerHTML = `
        <div class="ai-header">
          <div class="ai-icon">✨</div>
          <div>
            <h3 class="ai-title">AI Financial Analysis & Strategy</h3>
            <p class="ai-subtitle">Interpreted from structured figures for ${res.city_name}</p>
          </div>
        </div>

        <div class="ai-summary-callout">
          <p class="ai-summary-text">${ai.summary}</p>
        </div>

        <div class="ai-cards-grid">
          <div class="ai-card">
            <div class="ai-card-title">🏠 Rent & Housing Dynamic</div>
            <p class="ai-card-body">${ai.rent_analysis}</p>
          </div>
          <div class="ai-card">
            <div class="ai-card-title">🍱 Food & Discretionary Outflow</div>
            <p class="ai-card-body">${ai.lifestyle_analysis}</p>
          </div>
          <div class="ai-card">
            <div class="ai-card-title">📈 Wealth Opportunity</div>
            <p class="ai-card-body">${ai.savings_opportunity}</p>
          </div>
          <div class="ai-card">
            <div class="ai-card-title">🧭 Relocation Verdict</div>
            <p class="ai-card-body">${ai.relocation_verdict}</p>
          </div>
        </div>

        <div class="ai-actions-section">
          <h4 class="ai-actions-heading">Actionable Financial Optimizations</h4>
          <ul class="ai-action-list">
            ${ai.action_items.map(act => `<li><span class="bullet">⚡</span> ${act}</li>`).join("")}
          </ul>
        </div>
      `;
    }
  }
}

window.CalculatorComponent = CalculatorComponent;
