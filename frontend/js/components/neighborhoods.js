/**
 * Neighborhood Deep-Dive & Tech Hub Proximity Component
 */

class NeighborhoodComponent {
  constructor() {
    this.container = document.getElementById("neighborhoodsContainer");
    this.citySelect = document.getElementById("neighborhoodCitySelect");
    this.initEvents();
  }

  initEvents() {
    if (this.citySelect) {
      this.citySelect.addEventListener("change", (e) => {
        this.loadCityNeighborhoods(e.target.value);
      });
    }
  }

  async loadCityNeighborhoods(cityId) {
    if (!cityId) cityId = window.appState.getState().userProfile.city;
    if (this.citySelect) this.citySelect.value = cityId;

    try {
      const neighborhoods = await window.apiService.getNeighborhoods(cityId);
      const cityData = window.CITIES_DATA[cityId] || window.CITIES_DATA["bengaluru"];
      this.render(cityData, neighborhoods);
    } catch (err) {
      console.error("Neighborhood fetch error:", err);
    }
  }

  render(cityData, neighborhoods) {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="city-locality-header">
        <div>
          <h2 class="cl-title">🏙️ ${cityData.name} Locality & Tech Hub Guide</h2>
          <p class="cl-subtitle">Explore top residential areas, commute distance to key IT hubs, and rental brackets.</p>
        </div>
        <div class="tech-hubs-tags">
          <span class="hub-label">Key Employment Corridors:</span>
          ${cityData.tech_hubs.map(th => `<span class="hub-tag">${th}</span>`).join("")}
        </div>
      </div>

      <div class="neighborhoods-grid">
        ${neighborhoods.map(n => `
          <div class="neighborhood-card">
            <div class="nc-header">
              <div>
                <h3 class="nc-title">${n.name}</h3>
                <span class="nc-distance">📍 ~${n.distance_to_it_hub_km} km to primary tech parks</span>
              </div>
              <div class="nc-safety-badge">🛡️ ${n.safety_score}/100 Safety</div>
            </div>

            <p class="nc-vibe">"${n.vibe}"</p>

            <div class="nc-rents-row">
              <div class="ncr-item">
                <span class="ncr-label">PG / Room</span>
                <span class="ncr-val">₹${n.avg_pg_rent.toLocaleString()}</span>
              </div>
              <div class="ncr-item">
                <span class="ncr-label">Shared 2BHK</span>
                <span class="ncr-val">₹${n.avg_2bhk_shared_rent.toLocaleString()}</span>
              </div>
              <div class="ncr-item">
                <span class="ncr-label">Private 1BHK</span>
                <span class="ncr-val">₹${n.avg_1bhk_rent.toLocaleString()}</span>
              </div>
            </div>

            <div class="nc-scores-grid">
              <div class="score-chip">
                <span>Connectivity</span>
                <div class="sc-bar"><div style="width: ${n.connectivity_score}%; background: #8c532b;"></div></div>
                <span>${n.connectivity_score}</span>
              </div>
              <div class="score-chip">
                <span>Lifestyle / Cafes</span>
                <div class="sc-bar"><div style="width: ${n.lifestyle_score}%; background: #c07d32;"></div></div>
                <span>${n.lifestyle_score}</span>
              </div>
            </div>

            <div class="nc-suited-for">
              <span class="sf-label">🎯 Best Suited For:</span>
              <span class="sf-text">${n.best_suited_for}</span>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }
}

window.NeighborhoodComponent = NeighborhoodComponent;
