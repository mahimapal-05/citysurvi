/**
 * Interactive Real-Time "What-If?" Scenario Simulator
 */

class SimulatorComponent {
  constructor() {
    this.container = document.getElementById("simulatorContainer");
    this.initEvents();
  }

  initEvents() {
    // Dynamic sliders & controls in simulator view
    const simForm = document.getElementById("simForm");
    if (!simForm) return;

    const simInputs = simForm.querySelectorAll("input, select");
    simInputs.forEach(input => {
      input.addEventListener("input", () => {
        this.runSimulation();
      });
      input.addEventListener("change", () => {
        this.runSimulation();
      });
    });

    // Preset quick simulator switches
    document.querySelectorAll(".sim-quick-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const action = e.currentTarget.dataset.simAction;
        this.applyQuickSim(action);
      });
    });
  }

  applyQuickSim(action) {
    const baseProf = window.appState.getState().userProfile;
    if (action === "hike_20k") {
      document.getElementById("simIncome").value = baseProf.monthly_income + 20000;
    } else if (action === "roommate_switch") {
      document.getElementById("simRentType").value = "2bhk_shared";
    } else if (action === "cut_dining") {
      document.getElementById("simEatingOut").value = 25;
      document.getElementById("simEatingOutVal").textContent = "25%";
    } else if (action === "move_hyderabad") {
      document.getElementById("simCity").value = "hyderabad";
    } else if (action === "move_kolkata") {
      document.getElementById("simCity").value = "kolkata";
    }
    this.runSimulation();
  }

  async runSimulation() {
    const baseProfile = window.appState.getState().userProfile;

    const simIncome = parseFloat(document.getElementById("simIncome")?.value) || baseProfile.monthly_income;
    const simRentType = document.getElementById("simRentType")?.value || baseProfile.rent_type;
    const simLifestyle = document.getElementById("simLifestyle")?.value || baseProfile.lifestyle;
    const simCity = document.getElementById("simCity")?.value || baseProfile.city;
    const simEatingOut = parseInt(document.getElementById("simEatingOut")?.value || "50");

    const payload = {
      base_profile: baseProfile,
      simulated_income: simIncome,
      simulated_rent_type: simRentType,
      simulated_lifestyle: simLifestyle,
      simulated_city: simCity,
      simulated_eating_out: simEatingOut
    };

    try {
      const res = await window.apiService.simulate(payload);
      this.renderResults(res, baseProfile, payload);
    } catch (err) {
      console.error("Simulation error:", err);
    }
  }

  renderResults(res, baseProf, simPayload) {
    const out = document.getElementById("simResultsContainer");
    if (!out) return;

    const isPositive = res.delta_savings >= 0;
    const deltaColor = isPositive ? "#10b981" : "#ef4444";
    const deltaSign = isPositive ? "+" : "";

    out.innerHTML = `
      <!-- Headline Takeaway Box -->
      <div class="sim-takeaway-card" style="border-left: 5px solid ${deltaColor};">
        <div class="sim-takeaway-header">
          <span class="sim-delta-badge" style="background: ${deltaColor}20; color: ${deltaColor}; border: 1px solid ${deltaColor}60;">
            ${deltaSign}₹${Math.round(res.delta_savings).toLocaleString()}/mo Savings (${deltaSign}${res.delta_savings_pct}%)
          </span>
          <span class="sim-stress-delta ${res.delta_stress_score <= 0 ? 'text-green' : 'text-red'}">
            Stress Index: ${res.baseline_stress_score} → ${res.simulated_stress_score} (${res.delta_stress_score > 0 ? '+' : ''}${res.delta_stress_score} pts)
          </span>
        </div>
        <p class="sim-takeaway-text">💡 ${res.key_takeaway}</p>
      </div>

      <!-- Before vs After Comparison Columns -->
      <div class="sim-comparison-grid">
        <div class="sim-col baseline-col">
          <div class="sim-col-header">
            <h4>Current Baseline</h4>
            <span class="col-sub">${baseProf.city.toUpperCase()} • ₹${Math.round(baseProf.monthly_income).toLocaleString()} • ${baseProf.rent_type}</span>
          </div>
          <div class="sim-metric-row">
            <span>Monthly Expenses</span>
            <strong>₹${Math.round(res.baseline_expenses).toLocaleString()}</strong>
          </div>
          <div class="sim-metric-row">
            <span>Net Monthly Savings</span>
            <strong class="text-green">₹${Math.round(res.baseline_savings).toLocaleString()}</strong>
          </div>
          <div class="sim-metric-row">
            <span>Financial Stress</span>
            <strong>${res.baseline_stress_score}/100</strong>
          </div>
        </div>

        <div class="sim-col-arrow">➔</div>

        <div class="sim-col simulated-col">
          <div class="sim-col-header">
            <h4>Simulated "What-If"</h4>
            <span class="col-sub">${simPayload.simulated_city.toUpperCase()} • ₹${Math.round(simPayload.simulated_income).toLocaleString()} • ${simPayload.simulated_rent_type}</span>
          </div>
          <div class="sim-metric-row">
            <span>Monthly Expenses</span>
            <strong>₹${Math.round(res.simulated_expenses).toLocaleString()}</strong>
          </div>
          <div class="sim-metric-row">
            <span>Net Monthly Savings</span>
            <strong style="color: ${deltaColor};">₹${Math.round(res.simulated_savings).toLocaleString()}</strong>
          </div>
          <div class="sim-metric-row">
            <span>Financial Stress</span>
            <strong style="color: ${deltaColor};">${res.simulated_stress_score}/100</strong>
          </div>
        </div>
      </div>

      <!-- Annual Impact Multiplier -->
      <div class="annual-wealth-banner">
        <span>🚀 1-Year Cumulative Wealth Difference:</span>
        <strong style="color: ${deltaColor}; font-size: 1.25rem;">
          ${deltaSign}₹${Math.round(res.delta_savings * 12).toLocaleString()}
        </strong>
      </div>
    `;
  }
}

window.SimulatorComponent = SimulatorComponent;
