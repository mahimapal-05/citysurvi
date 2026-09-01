/**
 * Viral Social Receipt Card & Story Generator
 * Generates high-res downloadable Canvas graphics for Instagram (9:16) & Twitter/LinkedIn (1:1)
 * with 1-click Download and native Web Share API support.
 */

class SocialCardGenerator {
  constructor() {
    this.modal = null;
    this.currentFormat = "story"; // "story" (9:16) or "square" (1:1)
    this.createModal();
  }

  createModal() {
    const modalHtml = `
      <div id="socialCardModal" class="social-modal-overlay" style="display: none;">
        <div class="social-modal-container">
          <div class="social-modal-header">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.25rem;">📸</span>
              <h3 style="font-size: 1.1rem; color: var(--text-primary);">Share Survival Card</h3>
            </div>
            <button id="closeSocialModalBtn" class="social-modal-close">&times;</button>
          </div>

          <div class="social-modal-body">
            <!-- Format Switcher -->
            <div class="format-switcher-row">
              <button type="button" class="format-btn active" data-format="story">
                <span>📱</span> Instagram Story (9:16)
              </button>
              <button type="button" class="format-btn" data-format="square">
                <span>🖼️</span> Square Card (1:1)
              </button>
            </div>

            <!-- Canvas Preview Container -->
            <div class="canvas-preview-wrapper">
              <canvas id="socialCardCanvas"></canvas>
            </div>

            <!-- Action Buttons -->
            <div class="social-actions-row">
              <button id="downloadSocialCardBtn" class="btn-primary" style="flex: 1;">
                <span>💾</span> Download High-Res PNG
              </button>
              <button id="webShareCardBtn" class="btn-share-tactile" style="flex: 1;">
                <span>🚀</span> Share Direct
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);
    this.modal = document.getElementById("socialCardModal");

    // Close events
    document.getElementById("closeSocialModalBtn")?.addEventListener("click", () => this.close());
    this.modal?.addEventListener("click", (e) => {
      if (e.target === this.modal) this.close();
    });

    // Format buttons
    const formatBtns = document.querySelectorAll(".format-btn");
    formatBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        formatBtns.forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        this.currentFormat = e.currentTarget.dataset.format;
        this.renderCanvas();
      });
    });

    // Download & Share
    document.getElementById("downloadSocialCardBtn")?.addEventListener("click", () => this.downloadImage());
    document.getElementById("webShareCardBtn")?.addEventListener("click", () => this.shareDirect());
  }

  open() {
    if (!this.modal) return;
    this.modal.style.display = "flex";
    this.renderCanvas();
  }

  close() {
    if (this.modal) this.modal.style.display = "none";
  }

  renderCanvas() {
    const calc = window.appState.getState().currentCalculation;
    if (!calc) return;

    const canvas = document.getElementById("socialCardCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const isStory = this.currentFormat === "story";
    const width = isStory ? 1080 : 1080;
    const height = isStory ? 1920 : 1080;

    canvas.width = width;
    canvas.height = height;

    const exp = calc.expenses;
    const health = calc.financial_health;
    const stress = calc.stress_score;
    const income = health.monthly_income;
    const city = calc.city_name.toUpperCase();

    // 1. Background (Warm Kraft Paper / Roasted Coffee aesthetic)
    ctx.fillStyle = "#f4f0e8";
    ctx.fillRect(0, 0, width, height);

    // Subtle border & paper card
    const margin = isStory ? 70 : 60;
    const cardW = width - margin * 2;
    const cardH = height - margin * 2;

    ctx.fillStyle = "#fdfbf7";
    ctx.shadowColor = "rgba(41, 35, 31, 0.15)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    ctx.fillRect(margin, margin, cardW, cardH);
    ctx.shadowColor = "transparent";

    ctx.strokeStyle = "#e4ddcf";
    ctx.lineWidth = 4;
    ctx.strokeRect(margin, margin, cardW, cardH);

    // 2. Header
    let y = margin + (isStory ? 100 : 70);
    ctx.fillStyle = "#29231f";
    ctx.font = "800 46px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CITY SURVIVAL RECEIPT", width / 2, y);

    y += 45;
    ctx.font = "600 24px 'IBM Plex Mono', monospace";
    ctx.fillStyle = "#7d7064";
    ctx.fillText("OFFICIAL COST & AFFORDABILITY AUDIT", width / 2, y);

    y += 35;
    ctx.fillText("==========================================", width / 2, y);

    // 3. City & Salary Highlight
    y += 65;
    ctx.fillStyle = "#8c532b";
    ctx.font = "800 58px Outfit, sans-serif";
    ctx.fillText(city, width / 2, y);

    y += 45;
    ctx.font = "700 32px 'IBM Plex Mono', monospace";
    ctx.fillStyle = "#29231f";
    ctx.fillText(`MONTHLY IN-HAND: ₹${Math.round(income).toLocaleString()}`, width / 2, y);

    y += 40;
    ctx.fillStyle = "#7d7064";
    ctx.font = "600 22px 'IBM Plex Mono', monospace";
    ctx.fillText("------------------------------------------", width / 2, y);

    // 4. Itemized Table
    y += 45;
    const tableLeft = margin + 80;
    const tableRight = width - margin - 80;
    const rowGap = isStory ? 60 : 45;

    const items = [
      { name: `01. RENT (${calc.user_input.rent_type.toUpperCase()})`, cost: exp.rent, pct: Math.round((exp.rent / income) * 100) },
      { name: "02. FOOD & GROCERIES", cost: exp.food, pct: Math.round((exp.food / income) * 100) },
      { name: "03. COMMUTE & TRANSIT", cost: exp.transport, pct: Math.round((exp.transport / income) * 100) },
      { name: "04. BILLS & UTILITIES", cost: exp.utilities + exp.internet_phone, pct: Math.round(((exp.utilities + exp.internet_phone) / income) * 100) },
      { name: "05. LIFESTYLE & SOCIAL", cost: exp.lifestyle_discretionary + exp.subscriptions, pct: Math.round(((exp.lifestyle_discretionary + exp.subscriptions) / income) * 100) }
    ];

    items.forEach(item => {
      ctx.font = "600 26px 'IBM Plex Mono', monospace";
      ctx.fillStyle = "#29231f";
      ctx.textAlign = "left";
      ctx.fillText(item.name, tableLeft, y);

      ctx.textAlign = "right";
      ctx.fillStyle = "#7d7064";
      ctx.fillText(`${item.pct}%`, tableRight - 180, y);

      ctx.fillStyle = "#29231f";
      ctx.fillText(`₹${Math.round(item.cost).toLocaleString()}`, tableRight, y);

      y += rowGap;
    });

    // 5. Total & Net Savings
    ctx.fillStyle = "#7d7064";
    ctx.textAlign = "center";
    ctx.fillText("------------------------------------------", width / 2, y);

    y += 50;
    ctx.font = "800 30px 'IBM Plex Mono', monospace";
    ctx.fillStyle = "#29231f";
    ctx.textAlign = "left";
    ctx.fillText("TOTAL OUTFLOW", tableLeft, y);
    ctx.textAlign = "right";
    ctx.fillText(`₹${Math.round(health.total_expense).toLocaleString()} (${health.expense_ratio_pct}%)`, tableRight, y);

    y += 50;
    ctx.fillStyle = health.net_savings >= 0 ? "#2d6a4f" : "#a83220";
    ctx.textAlign = "left";
    ctx.fillText("REMAINING CASHFLOW", tableLeft, y);
    ctx.textAlign = "right";
    ctx.fillText(`₹${Math.round(health.net_savings).toLocaleString()} (${health.savings_rate_pct}%)`, tableRight, y);

    // 6. Rubber Stamp
    y += isStory ? 130 : 90;
    ctx.save();
    ctx.translate(width / 2, y);
    ctx.rotate(-0.1);

    let stampText = "SURVIVES";
    let stampColor = "#2d6a4f";
    if (stress.score > 70) {
      stampText = "💀 BROKE & UNSUSTAINABLE";
      stampColor = "#a83220";
    } else if (stress.score > 50) {
      stampText = "⚠️ TIGHT SQUEEZE";
      stampColor = "#b46533";
    } else if (stress.score > 25) {
      stampText = "🟢 MANAGEABLE";
      stampColor = "#2d6a4f";
    } else {
      stampText = "🏆 COMFORTABLE";
      stampColor = "#2d6a4f";
    }

    ctx.strokeStyle = stampColor;
    ctx.lineWidth = 6;
    ctx.setLineDash([12, 6]);
    ctx.strokeRect(-260, -45, 520, 90);

    ctx.font = "900 38px Outfit, sans-serif";
    ctx.fillStyle = stampColor;
    ctx.textAlign = "center";
    ctx.fillText(stampText, 0, 8);

    ctx.font = "700 18px 'IBM Plex Mono', monospace";
    ctx.fillText(`STRESS SCORE: ${stress.score}/100`, 0, 32);
    ctx.restore();

    // 7. Footer & Branding
    if (isStory) {
      y += 190;
      ctx.fillStyle = "#7d7064";
      ctx.font = "600 22px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("CAN YOU SURVIVE YOUR CITY?", width / 2, y);

      y += 40;
      ctx.font = "700 24px Outfit, sans-serif";
      ctx.fillStyle = "#8c532b";
      ctx.fillText("Calculate yours at: CitySurvi.app", width / 2, y);
    }
  }

  downloadImage() {
    const canvas = document.getElementById("socialCardCanvas");
    if (!canvas) return;

    const calc = window.appState.getState().currentCalculation;
    const city = calc ? calc.city_name : "city";
    const link = document.createElement("a");
    link.download = `survival-receipt-${city}-${this.currentFormat}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async shareDirect() {
    const canvas = document.getElementById("socialCardCanvas");
    if (!canvas) return;

    const calc = window.appState.getState().currentCalculation;
    const city = calc ? calc.city_name.toUpperCase() : "MY CITY";

    if (navigator.share && canvas.toBlob) {
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `survival-receipt-${city}.png`, { type: "image/png" });
        try {
          await navigator.share({
            title: `Can you survive in ${city}?`,
            text: `Check out my cost-of-living receipt and financial stress score for ${city}!`,
            files: [file]
          });
        } catch (err) {
          this.downloadImage();
        }
      });
    } else {
      this.downloadImage();
    }
  }
}

window.SocialCardGenerator = SocialCardGenerator;
