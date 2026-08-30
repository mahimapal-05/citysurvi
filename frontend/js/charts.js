/**
 * Interactive Donut & Progress Bar Expense Visualizer
 * Earthy warm tones: Saddle brown, Sage green, Caramel, Ochre, Terracotta, Roast umber
 */

class ExpenseCharts {
  constructor(canvasId, legendId) {
    this.canvas = document.getElementById(canvasId);
    this.legend = document.getElementById(legendId);
  }

  renderDonut(expenses) {
    if (!this.canvas) return;

    const ctx = this.canvas.getContext("2d");
    const width = this.canvas.width = 240;
    const height = this.canvas.height = 240;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 90;
    const innerRadius = 55;

    ctx.clearRect(0, 0, width, height);

    const categories = [
      { name: "Rent & Housing", value: expenses.rent, color: "#8c532b" },
      { name: "Food & Groceries", value: expenses.food, color: "#2d6a4f" },
      { name: "Transit & Commute", value: expenses.transport, color: "#a06d3b" },
      { name: "Utilities & Bills", value: expenses.utilities + expenses.internet_phone, color: "#c07d32" },
      { name: "Lifestyle & Social", value: expenses.shopping_entertainment + expenses.travel, color: "#b94a34" },
      { name: "Subscriptions & Misc", value: expenses.subscriptions + expenses.miscellaneous, color: "#6b5b52" }
    ];

    const total = categories.reduce((sum, c) => sum + c.value, 0);
    let startAngle = -Math.PI / 2;

    // Draw donut arcs
    categories.forEach(cat => {
      if (cat.value <= 0) return;
      const sliceAngle = (cat.value / total) * (Math.PI * 2);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = cat.color;
      ctx.fill();

      startAngle += sliceAngle;
    });

    // Center text
    ctx.fillStyle = "var(--text-primary)";
    ctx.font = "600 13px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Total Monthly", centerX, centerY - 10);

    ctx.font = "700 16px Outfit, sans-serif";
    ctx.fillStyle = "var(--brand-primary)";
    ctx.fillText(`₹${Math.round(expenses.total_monthly_expense).toLocaleString()}`, centerX, centerY + 12);

    // Render legend
    if (this.legend) {
      this.legend.innerHTML = categories.map(cat => {
        const pct = Math.round((cat.value / total) * 100);
        return `
          <div class="legend-row">
            <div class="legend-indicator" style="background: ${cat.color};"></div>
            <div class="legend-name">${cat.name}</div>
            <div class="legend-amount">₹${Math.round(cat.value).toLocaleString()} <span class="legend-pct">(${pct}%)</span></div>
          </div>
        `;
      }).join("");
    }
  }
}

window.ExpenseCharts = ExpenseCharts;
