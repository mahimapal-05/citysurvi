/**
 * Career Runway & Emergency Layoff Survival Clock
 * Computes how many months of liquid survival runway a professional has
 * across all 10 cities under Standard vs Lean Survival mode.
 */

class RunwayClockComponent {
  constructor() {
    this.container = document.getElementById("runwayClockContainer");
    this.isLeanSurvival = true;
    this.initEvents();
  }

  initEvents() {
    const savingsInput = document.getElementById("runwaySavingsInput");
    const modeToggle = document.getElementById("runwayModeToggle");

    savingsInput?.addEventListener("input", () => this.calculateRunway());
    modeToggle?.addEventListener("change", (e) => {
      this.isLeanSurvival = e.target.checked;
      const label = document.getElementById("runwayModeLabel");
      if (label) {
        label.textContent = this.isLeanSurvival ? "🛡️ Lean Survival Mode (Rent + Basic Food + Power)" : "☕ Full Lifestyle Mode (Current Discretionary)";
      }
      this.calculateRunway();
    });

    this.calculateRunway();
  }

  calculateRunway() {
    const savings = parseFloat(document.getElementById("runwaySavingsInput")?.value) || 300000;
    const citiesData = window.CITIES_DATA || window.CLIENT_CITIES_DATA || {};

    const cityKeys = Object.keys(citiesData);
    if (!cityKeys.length) return;

    const results = cityKeys.map(cityKey => {
      const c = citiesData[cityKey];
      // Basic 1BHK rent
      const rent = (c.rent && c.rent["1bhk"]) || (c.rent_estimates && c.rent_estimates["1bhk"]) || 16000;
      const food = this.isLeanSurvival
        ? ((c.food && c.food["basic"]) || 5200)
        : ((c.food && c.food["moderate"]) || 8500);
      const bills = (typeof c.utilities === "number" ? c.utilities : 2600) + (c.internet_phone || 999);
      const transport = this.isLeanSurvival
        ? ((c.transport && c.transport["basic"]) || 1200)
        : ((c.transport && c.transport["moderate"]) || 3500);
      const lifestyle = this.isLeanSurvival ? 0 : (c.discretionary_base || 5000);

      const monthlyBurn = rent + food + bills + transport + lifestyle;
      const runwayMonths = monthlyBurn > 0 ? (savings / monthlyBurn) : 0;

      return {
        key: cityKey,
        name: c.name || cityKey.toUpperCase(),
        state: c.state || "India",
        monthlyBurn: Math.round(monthlyBurn),
        runwayMonths: Math.round(runwayMonths * 10) / 10,
        rent: Math.round(rent),
        food: Math.round(food)
      };
    });

    // Sort by longest runway first
    results.sort((a, b) => b.runwayMonths - a.runwayMonths);
    this.render(savings, results);
  }

  render(savings, results) {
    if (!this.container || !results.length) return;

    const longest = results[0];
    const shortest = results[results.length - 1];

    this.container.innerHTML = `
      <!-- Top Runway Summary Banner -->
      <div class="runway-hero-banner">
        <div class="rhb-stat">
          <span class="rhb-label">Total Liquid Emergency Fund</span>
          <span class="rhb-val">₹${Math.round(savings).toLocaleString()}</span>
        </div>
        <div class="rhb-stat">
          <span class="rhb-label">Maximum Runway (Safest City)</span>
          <span class="rhb-val text-green">${longest.runwayMonths} Months</span>
          <span class="rhb-sub">${longest.name} (Burn: ₹${longest.monthlyBurn.toLocaleString()}/mo)</span>
        </div>
        <div class="rhb-stat">
          <span class="rhb-label">Minimum Runway (Costliest City)</span>
          <span class="rhb-val text-amber">${shortest.runwayMonths} Months</span>
          <span class="rhb-sub">${shortest.name} (Burn: ₹${shortest.monthlyBurn.toLocaleString()}/mo)</span>
        </div>
      </div>

      <!-- City Runway Rankings Grid -->
      <div class="runway-cities-list">
        <h3 style="font-size: 1.05rem; margin: 1.5rem 0 1rem; color: var(--text-primary);">
          ⏳ Survival Runway Duration Across All 10 Tech Hubs
        </h3>

        <div class="runway-grid">
          ${results.map((r, idx) => {
            const pct = Math.min(100, (r.runwayMonths / 12) * 100);
            let statusColor = "#2d6a4f";
            if (r.runwayMonths < 3.5) statusColor = "#a83220";
            else if (r.runwayMonths < 6) statusColor = "#b46533";

            return `
              <div class="runway-city-card ${idx === 0 ? 'is-safest' : ''}">
                <div class="rcc-header">
                  <div>
                    <span class="rcc-rank">#${idx + 1}</span>
                    <strong class="rcc-name">${r.name}</strong>
                    <span class="rcc-state">(${r.state})</span>
                  </div>
                  <div class="rcc-months" style="color: ${statusColor};">
                    ${r.runwayMonths} <span style="font-size: 0.8rem; font-weight: 500;">months</span>
                  </div>
                </div>

                <div class="runway-bar-bg">
                  <div class="runway-bar-fill" style="width: ${pct}%; background: ${statusColor};"></div>
                </div>

                <div class="rcc-burn-row">
                  <span>Monthly Burn: <strong>₹${r.monthlyBurn.toLocaleString()}</strong></span>
                  <span>Rent: ₹${r.rent.toLocaleString()} | Food: ₹${r.food.toLocaleString()}</span>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }
}

window.RunwayClockComponent = RunwayClockComponent;
