/**
 * 10-City Instant Comparison & Ranking Matrix
 */

class ComparisonComponent {
  constructor() {
    this.container = document.getElementById("comparisonContainer");
    this.sortKey = "stress_score";
    this.sortAsc = true;
    this.currentData = null;
    this.initEvents();
  }

  initEvents() {
    const sortSelect = document.getElementById("comparisonSortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortKey = e.target.value;
        this.render();
      });
    }
  }

  async refreshComparison(userProfile) {
    if (!userProfile) userProfile = window.appState.getState().userProfile;
    try {
      const compResult = await window.apiService.compare(userProfile);
      this.currentData = compResult;
      window.appState.setState({ comparisonData: compResult });
      this.render();
    } catch (err) {
      console.error("Comparison load error:", err);
    }
  }

  render() {
    if (!this.container || !this.currentData) return;

    const data = this.currentData;
    let items = [...data.rankings];

    // Sorting
    if (this.sortKey === "stress_score") {
      items.sort((a, b) => a.stress_score - b.stress_score);
    } else if (this.sortKey === "net_savings") {
      items.sort((a, b) => b.net_savings - a.net_savings);
    } else if (this.sortKey === "monthly_cost") {
      items.sort((a, b) => a.monthly_cost - b.monthly_cost);
    } else if (this.sortKey === "savings_rate") {
      items.sort((a, b) => b.savings_rate_pct - a.savings_rate_pct);
    }

    const bestCity = data.rankings.find(c => c.is_best_city) || data.rankings[0];

    this.container.innerHTML = `
      <!-- Best City Highlight Card -->
      <div class="best-city-banner">
        <div class="best-city-badge">👑 TOP RECOMMENDED CITY FOR YOUR FINANCIAL GOAL</div>
        <div class="best-city-content">
          <div class="best-city-header">
            <h2 class="best-city-name">${bestCity.city_name} <span class="best-city-state">(${bestCity.state})</span></h2>
            <div class="best-city-status" style="background: ${bestCity.color}20; color: ${bestCity.color}; border: 1px solid ${bestCity.color}60;">
              ${bestCity.status_badge}
            </div>
          </div>
          <div class="best-city-metrics">
            <div class="best-metric">
              <span class="bm-label">Monthly Savings</span>
              <span class="bm-value" style="color: #10b981;">₹${Math.round(bestCity.net_savings).toLocaleString()}</span>
            </div>
            <div class="best-metric">
              <span class="bm-label">Savings Rate</span>
              <span class="bm-value">${bestCity.savings_rate_pct}%</span>
            </div>
            <div class="best-metric">
              <span class="bm-label">Total Monthly Cost</span>
              <span class="bm-value">₹${Math.round(bestCity.monthly_cost).toLocaleString()}</span>
            </div>
            <div class="best-metric">
              <span class="bm-label">Financial Stress</span>
              <span class="bm-value" style="color: ${bestCity.color};">${bestCity.stress_score}/100</span>
            </div>
          </div>
          <p class="best-city-rationale">💡 <strong>Why it ranks #1:</strong> ${bestCity.rationale}</p>
        </div>
      </div>

      <!-- Quick Strategic Insights -->
      <div class="comparison-insights-box">
        <div class="ci-title">📊 Key Comparative Takeaways for ₹${Math.round(data.base_income).toLocaleString()}/month Income:</div>
        <ul class="ci-list">
          ${data.insights.map(ins => `<li>${ins}</li>`).join("")}
        </ul>
      </div>

      <!-- 10 Cities Comparison Grid -->
      <div class="cities-grid">
        ${items.map(c => `
          <div class="city-card ${c.is_best_city ? 'is-best' : ''}">
            <div class="city-card-header">
              <div>
                <div class="city-rank">#${c.rank} in India</div>
                <h3 class="city-title">${c.city_name}</h3>
                <span class="city-tier-sub">${c.tier}</span>
              </div>
              <div class="city-status-pill" style="background: ${c.color}20; color: ${c.color}; border: 1px solid ${c.color}50;">
                ${c.status_badge}
              </div>
            </div>

            <div class="city-stats-row">
              <div class="cs-item">
                <span class="cs-label">Monthly Cost</span>
                <span class="cs-val">₹${Math.round(c.monthly_cost).toLocaleString()}</span>
              </div>
              <div class="cs-item">
                <span class="cs-label">Net Savings</span>
                <span class="cs-val ${c.net_savings >= 0 ? 'text-green' : 'text-red'}">
                  ₹${Math.round(c.net_savings).toLocaleString()}
                </span>
              </div>
              <div class="cs-item">
                <span class="cs-label">Savings Rate</span>
                <span class="cs-val">${c.savings_rate_pct}%</span>
              </div>
              <div class="cs-item">
                <span class="cs-label">Stress Score</span>
                <span class="cs-val" style="color: ${c.color}; font-weight: 700;">${c.stress_score}/100</span>
              </div>
            </div>

            <!-- Savings Bar Representation -->
            <div class="savings-progress-bar-bg">
              <div class="savings-progress-bar-fill" style="width: ${Math.max(5, Math.min(100, (c.net_savings / Math.max(1, data.base_income)) * 100))}%; background: ${c.color};"></div>
            </div>

            <p class="city-card-desc">${c.rationale}</p>

            <button class="select-city-btn" onclick="window.appState.updateProfile('city', '${c.city_id}'); window.calculatorComponent.runCalculation();">
              Analyze ${c.city_name} in Detail →
            </button>
          </div>
        `).join("")}
      </div>
    `;
  }
}

window.ComparisonComponent = ComparisonComponent;
