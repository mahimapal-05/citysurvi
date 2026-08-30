/**
 * Job Offer Relocation Decision Engine Component
 */

class JobOfferComponent {
  constructor() {
    this.form = document.getElementById("jobOfferForm");
    this.resultsContainer = document.getElementById("jobOfferResultsContainer");
    this.initEvents();
  }

  initEvents() {
    if (!this.form) return;

    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.evaluate();
    });

    // Preset quick offer buttons
    document.querySelectorAll(".offer-preset-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const scenario = e.currentTarget.dataset.offerScenario;
        this.applyOfferPreset(scenario);
      });
    });
  }

  applyOfferPreset(scenario) {
    if (scenario === "pune_to_blr") {
      document.getElementById("currCity").value = "pune";
      document.getElementById("currIncome").value = 45000;
      document.getElementById("offerCity").value = "bengaluru";
      document.getElementById("offerIncome").value = 65000;
      document.getElementById("offerRentType").value = "1bhk";
    } else if (scenario === "kolkata_to_mumbai") {
      document.getElementById("currCity").value = "kolkata";
      document.getElementById("currIncome").value = 50000;
      document.getElementById("offerCity").value = "mumbai";
      document.getElementById("offerIncome").value = 85000;
      document.getElementById("offerRentType").value = "1bhk";
    } else if (scenario === "delhi_to_hyd") {
      document.getElementById("currCity").value = "delhi";
      document.getElementById("currIncome").value = 60000;
      document.getElementById("offerCity").value = "hyderabad";
      document.getElementById("offerIncome").value = 75000;
      document.getElementById("offerRentType").value = "2bhk_shared";
    }
    this.evaluate();
  }

  async evaluate() {
    const payload = {
      current_city: document.getElementById("currCity")?.value || "pune",
      current_income: parseFloat(document.getElementById("currIncome")?.value) || 45000,
      current_rent_type: document.getElementById("currRentType")?.value || "1bhk",
      offer_city: document.getElementById("offerCity")?.value || "bengaluru",
      offer_income: parseFloat(document.getElementById("offerIncome")?.value) || 65000,
      offer_rent_type: document.getElementById("offerRentType")?.value || "1bhk",
      lifestyle: document.getElementById("offerLifestyle")?.value || "moderate",
      savings_target: 15000
    };

    try {
      const res = await window.apiService.evaluateJobOffer(payload);
      this.renderResults(res);
    } catch (err) {
      console.error("Job offer evaluate error:", err);
    }
  }

  renderResults(res) {
    if (!this.resultsContainer) return;

    const isViable = res.is_financially_viable;
    const deltaColor = res.delta_savings >= 0 ? "#10b981" : "#ef4444";
    const deltaSign = res.delta_savings >= 0 ? "+" : "";

    this.resultsContainer.innerHTML = `
      <!-- Verdict Banner -->
      <div class="offer-verdict-banner ${isViable ? 'verdict-viable' : 'verdict-caution'}">
        <div class="ov-badge">${res.verdict_badge}</div>
        <h3 class="ov-title">${res.verdict_summary}</h3>
      </div>

      <!-- Relocation Comparison Grid -->
      <div class="offer-comparison-grid">
        <!-- Current City Snapshot -->
        <div class="offer-city-box">
          <div class="ocb-header">
            <span class="ocb-tag">CURRENT LOCATION</span>
            <h4>${res.current_city}</h4>
            <span class="ocb-salary">₹${Math.round(res.current_income).toLocaleString()}/mo</span>
          </div>
          <div class="ocb-metrics">
            <div class="ocb-m-row">
              <span>Monthly Expenses:</span>
              <strong>₹${Math.round(res.current_expense).toLocaleString()}</strong>
            </div>
            <div class="ocb-m-row">
              <span>Net Savings:</span>
              <strong class="text-green">₹${Math.round(res.current_savings).toLocaleString()}</strong>
            </div>
            <div class="ocb-m-row">
              <span>Stress Index:</span>
              <strong>${res.current_stress}/100</strong>
            </div>
          </div>
        </div>

        <div class="offer-vs-badge">VS</div>

        <!-- Offer City Snapshot -->
        <div class="offer-city-box is-offer">
          <div class="ocb-header">
            <span class="ocb-tag" style="background: var(--brand-primary); color: white;">NEW JOB OFFER</span>
            <h4>${res.offer_city}</h4>
            <span class="ocb-salary" style="color: var(--brand-primary);">₹${Math.round(res.offer_income).toLocaleString()}/mo</span>
          </div>
          <div class="ocb-metrics">
            <div class="ocb-m-row">
              <span>Monthly Expenses:</span>
              <strong>₹${Math.round(res.offer_expense).toLocaleString()}</strong>
            </div>
            <div class="ocb-m-row">
              <span>Net Savings:</span>
              <strong style="color: ${deltaColor};">₹${Math.round(res.offer_savings).toLocaleString()}</strong>
            </div>
            <div class="ocb-m-row">
              <span>Stress Index:</span>
              <strong>${res.offer_stress}/100</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- PPP Parity & Strategic Analysis -->
      <div class="ppp-analysis-card">
        <div class="ppp-header">
          <div class="ppp-icon">⚖️</div>
          <div>
            <h4>Purchasing Power Parity (PPP) & Real Wealth Differential</h4>
            <p>Accounting for local rental, transit and lifestyle differences.</p>
          </div>
        </div>

        <div class="ppp-stats-row">
          <div class="ppp-stat">
            <span class="ps-label">Net Monthly Savings Delta</span>
            <span class="ps-val" style="color: ${deltaColor};">${deltaSign}₹${Math.round(res.delta_savings).toLocaleString()}/mo</span>
          </div>
          <div class="ppp-stat">
            <span class="ps-label">Annual Wealth Delta</span>
            <span class="ps-val" style="color: ${deltaColor};">${deltaSign}₹${Math.round(res.delta_savings * 12).toLocaleString()}/yr</span>
          </div>
          <div class="ppp-stat">
            <span class="ps-label">Break-Even Parity Salary</span>
            <span class="ps-val" style="color: var(--brand-primary);">₹${Math.round(res.ppp_parity_salary).toLocaleString()}/mo</span>
          </div>
        </div>

        <ul class="ppp-points-list">
          ${res.detailed_points.map(pt => `<li>${pt}</li>`).join("")}
        </ul>
      </div>
    `;
  }
}

window.JobOfferComponent = JobOfferComponent;
