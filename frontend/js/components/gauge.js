/**
 * Animated SVG Speedometer Financial Stress Gauge
 * Cleaned layout with zero text/needle overlap and crisp warm styling.
 */

class StressGauge {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentScore = 0;
  }

  render(score, status, color, breakdown) {
    if (!this.container) return;

    // Clamped score 0 to 100
    const clampedScore = Math.max(0, Math.min(100, score));
    // Needle rotation: 0 score = -135 deg, 100 score = +135 deg around pivot (120, 130)
    const targetAngle = -135 + (clampedScore / 100) * 270;

    this.container.innerHTML = `
      <div class="gauge-wrapper">
        <svg class="gauge-svg" viewBox="0 0 240 145">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#2d6a4f" />
              <stop offset="25%" stop-color="#4ade80" />
              <stop offset="50%" stop-color="#c07d32" />
              <stop offset="75%" stop-color="#b46533" />
              <stop offset="100%" stop-color="#a83220" />
            </linearGradient>
            <filter id="needleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Background Track Arc (Center: 120, 130; Radius: 85) -->
          <path d="M 35 130 A 85 85 0 1 1 205 130" fill="none" stroke="var(--gauge-track-bg)" stroke-width="15" stroke-linecap="round" />
          
          <!-- Colored Value Arc -->
          <path d="M 35 130 A 85 85 0 1 1 205 130" fill="none" stroke="url(#gaugeGradient)" stroke-width="13" stroke-linecap="round" opacity="0.95" />

          <!-- Ticks at milestones -->
          <circle cx="35" cy="130" r="3" fill="#2d6a4f" />
          <circle cx="68" cy="50" r="3" fill="#4ade80" />
          <circle cx="120" cy="26" r="3.5" fill="#c07d32" />
          <circle cx="172" cy="50" r="3" fill="#b46533" />
          <circle cx="205" cy="130" r="3" fill="#a83220" />

          <!-- Needle Group (Pivot: 120, 130) -->
          <g class="gauge-needle-group" style="transform: rotate(${targetAngle}deg); transform-origin: 120px 130px; transition: transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);">
            <line x1="120" y1="130" x2="120" y2="52" stroke="var(--text-primary)" stroke-width="3" stroke-linecap="round" filter="url(#needleGlow)" />
            <polygon points="117,62 123,62 120,44" fill="var(--text-primary)" />
            <!-- Sleek compact needle pivot center -->
            <circle cx="120" cy="130" r="6" fill="var(--text-primary)" />
            <circle cx="120" cy="130" r="2.5" fill="var(--bg-card)" />
          </g>
        </svg>

        <!-- Clean details block below the gauge arc with zero overlap -->
        <div class="gauge-details">
          <div class="gauge-score-value" style="color: ${color};">
            <span id="gaugeNumber" class="counter-num">${clampedScore}</span>
            <span class="gauge-max">/100</span>
          </div>
          <div class="gauge-status-badge" style="background: ${color}18; border: 1px solid ${color}45; color: ${color};">
            ${status}
          </div>
        </div>
      </div>

      <!-- 5-Factor Mini Breakdown -->
      ${breakdown ? `
        <div class="stress-factors-grid">
          <div class="factor-chip">
            <span class="factor-label">Rent Burden</span>
            <div class="factor-bar-bg"><div class="factor-bar-fill" style="width: ${(breakdown.rent_burden_score / 30) * 100}%; background: #b46533;"></div></div>
            <span class="factor-val">${breakdown.rent_burden_score}/30</span>
          </div>
          <div class="factor-chip">
            <span class="factor-label">Savings Gap</span>
            <div class="factor-bar-bg"><div class="factor-bar-fill" style="width: ${(breakdown.savings_gap_score / 25) * 100}%; background: #c07d32;"></div></div>
            <span class="factor-val">${breakdown.savings_gap_score}/25</span>
          </div>
          <div class="factor-chip">
            <span class="factor-label">Essential Ratio</span>
            <div class="factor-bar-bg"><div class="factor-bar-fill" style="width: ${(breakdown.essential_ratio_score / 20) * 100}%; background: #8c532b;"></div></div>
            <span class="factor-val">${breakdown.essential_ratio_score}/20</span>
          </div>
          <div class="factor-chip">
            <span class="factor-label">Lifestyle Load</span>
            <div class="factor-bar-bg"><div class="factor-bar-fill" style="width: ${(breakdown.lifestyle_ratio_score / 15) * 100}%; background: #a83220;"></div></div>
            <span class="factor-val">${breakdown.lifestyle_ratio_score}/15</span>
          </div>
        </div>
      ` : ''}
    `;

    this.animateNumber("gaugeNumber", clampedScore);
  }

  animateNumber(id, endValue) {
    const elem = document.getElementById(id);
    if (!elem) return;
    let start = 0;
    const duration = 900;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (endValue - start) * easeProgress);
      elem.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }
}

window.StressGauge = StressGauge;
