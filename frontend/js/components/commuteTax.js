/**
 * Commute & Traffic Tax Calculator Component
 * Calculates direct cab/fuel costs, hours lost in traffic, and true living cost trade-off.
 */

class CommuteTaxComponent {
  constructor() {
    this.container = document.getElementById("commuteTaxContainer");
    this.presets = {
      blr_orr: {
        city: "bengaluru",
        hubName: "Outer Ring Road (ORR / Bellandur / Ecospace)",
        salary: 80000,
        suburbName: "Whitefield / Sarjapur (Far)",
        coreName: "HSR Layout / Bellandur (Near)",
        suburbRent: 18000,
        coreRent: 26000,
        suburbDist: 18,
        coreDist: 4,
        suburbTrafficMins: 75,
        coreTrafficMins: 20,
        mode: "cab"
      },
      hyd_hitec: {
        city: "hyderabad",
        hubName: "HITEC City / Financial District",
        salary: 75000,
        suburbName: "Kukatpally / Miyapur (Far)",
        coreName: "Gachibowli / Madhapur (Near)",
        suburbRent: 15000,
        coreRent: 22000,
        suburbDist: 16,
        coreDist: 5,
        suburbTrafficMins: 55,
        coreTrafficMins: 15,
        mode: "cab"
      },
      mum_bkc: {
        city: "mumbai",
        hubName: "BKC / Lower Parel",
        salary: 110000,
        suburbName: "Thane / Navi Mumbai (Far)",
        coreName: "Bandra / Santacruz (Near)",
        suburbRent: 22000,
        coreRent: 38000,
        suburbDist: 26,
        coreDist: 6,
        suburbTrafficMins: 90,
        coreTrafficMins: 25,
        mode: "cab"
      },
      pune_hinj: {
        city: "pune",
        hubName: "Hinjawadi IT Park Phase 1-3",
        salary: 60000,
        suburbName: "Kothrud / Aundh (Far)",
        coreName: "Wakad / Baner (Near)",
        suburbRent: 14000,
        coreRent: 20000,
        suburbDist: 19,
        coreDist: 4,
        suburbTrafficMins: 60,
        coreTrafficMins: 15,
        mode: "two_wheeler"
      },
      ggn_cyber: {
        city: "gurugram",
        hubName: "DLF Cyber City / Golf Course Road",
        salary: 95000,
        suburbName: "Dwarka / West Delhi (Far)",
        coreName: "Cyber City / Sector 43 (Near)",
        suburbRent: 18000,
        coreRent: 29000,
        suburbDist: 22,
        coreDist: 5,
        suburbTrafficMins: 70,
        coreTrafficMins: 20,
        mode: "cab"
      }
    };

    this.initEvents();
  }

  initEvents() {
    const form = document.getElementById("commuteForm");
    if (!form) return;

    // Preset buttons
    const presetBtns = document.querySelectorAll(".commute-preset-btn");
    presetBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const key = e.currentTarget.dataset.hub;
        this.applyPreset(key);
      });
    });

    // Reactive input updates
    const inputs = form.querySelectorAll("input, select");
    inputs.forEach(input => {
      input.addEventListener("input", () => this.calculateTradeoff());
    });

    // Initial calculation
    this.calculateTradeoff();
  }

  applyPreset(key) {
    const p = this.presets[key];
    if (!p) return;

    document.getElementById("commuteIncome").value = p.salary;
    document.getElementById("commuteModeSelect").value = p.mode;
    document.getElementById("suburbRentInput").value = p.suburbRent;
    document.getElementById("coreRentInput").value = p.coreRent;
    document.getElementById("suburbDistInput").value = p.suburbDist;
    document.getElementById("coreDistInput").value = p.coreDist;
    document.getElementById("suburbMinsInput").value = p.suburbTrafficMins;
    document.getElementById("coreMinsInput").value = p.coreTrafficMins;

    this.calculateTradeoff();
  }

  getFormData() {
    return {
      city: "bengaluru",
      monthly_income: parseFloat(document.getElementById("commuteIncome")?.value) || 75000,
      suburb_rent: parseFloat(document.getElementById("suburbRentInput")?.value) || 16000,
      core_rent: parseFloat(document.getElementById("coreRentInput")?.value) || 24000,
      suburb_distance_km: parseFloat(document.getElementById("suburbDistInput")?.value) || 18,
      core_distance_km: parseFloat(document.getElementById("coreDistInput")?.value) || 4,
      suburb_traffic_mins_per_trip: parseFloat(document.getElementById("suburbMinsInput")?.value) || 65,
      core_traffic_mins_per_trip: parseFloat(document.getElementById("coreMinsInput")?.value) || 18,
      commute_mode: document.getElementById("commuteModeSelect")?.value || "cab",
      working_days_per_month: 22
    };
  }

  async calculateTradeoff() {
    const data = this.getFormData();
    let res = null;

    try {
      res = await window.apiService.post("/api/commute/tradeoff", data);
    } catch (e) {
      // Fallback client arithmetic
      const hourly = data.monthly_income / 160.0;
      const rate = data.commute_mode === "cab" ? 22.0 : (data.commute_mode === "car" ? 12.0 : (data.commute_mode === "two_wheeler" ? 3.5 : 2.5));
      const sKmCost = data.suburb_distance_km * 2 * 22 * rate;
      const cKmCost = data.core_distance_km * 2 * 22 * rate;
      const sHrs = (data.suburb_traffic_mins_per_trip * 2 * 22) / 60.0;
      const cHrs = (data.core_traffic_mins_per_trip * 2 * 22) / 60.0;
      const sLoss = sHrs * hourly;
      const cLoss = cHrs * hourly;

      const sTotal = data.suburb_rent + sKmCost + sLoss;
      const cTotal = data.core_rent + cKmCost + cLoss;
      const rentDelta = data.core_rent - data.suburb_rent;
      const cabSaved = sKmCost - cKmCost;
      const hrsSaved = sHrs - cHrs;
      const econAdv = sTotal - cTotal;

      res = {
        suburb: { rent: data.suburb_rent, direct_commute_cost: Math.round(sKmCost), traffic_hours_monthly: Math.round(sHrs * 10) / 10, time_value_loss: Math.round(sLoss), true_total_cost: Math.round(sTotal) },
        core: { rent: data.core_rent, direct_commute_cost: Math.round(cKmCost), traffic_hours_monthly: Math.round(cHrs * 10) / 10, time_value_loss: Math.round(cLoss), true_total_cost: Math.round(cTotal) },
        deltas: { rent_premium: rentDelta, commute_cost_saved: Math.round(cabSaved), hours_saved_monthly: Math.round(hrsSaved * 10) / 10, total_economic_advantage: Math.round(econAdv) },
        verdict: econAdv > 0 ? `Living closer saves you ₹${Math.round(econAdv).toLocaleString()}/mo in total economic value and gives you back ${Math.round(hrsSaved * 10) / 10} hours of your life!` : `Living in suburb saves cash, but costs ${Math.round(hrsSaved * 10) / 10} hours in traffic.`,
        recommendation: econAdv > 0 ? "RECOMMENDED: Live Closer to Work" : "COST OPTIMIZED: Suburb Flat Viable"
      };
    }

    this.render(res);
  }

  render(res) {
    if (!this.container) return;

    const d = res.deltas;
    const isAdvantage = d.total_economic_advantage > 0;

    this.container.innerHTML = `
      <!-- Verdict Banner -->
      <div class="commute-verdict-banner ${isAdvantage ? 'adv-positive' : 'adv-neutral'}">
        <div class="cv-badge">${res.recommendation}</div>
        <h3 class="cv-title">${res.verdict}</h3>
      </div>

      <!-- Trade-off Comparison Grid -->
      <div class="commute-cards-grid">
        <!-- Suburb Card (Distant Living) -->
        <div class="commute-card">
          <div class="cc-header">
            <span class="cc-tag">Distant Suburb</span>
            <h4>Far from Tech Hub</h4>
          </div>

          <div class="cc-metric-row">
            <span>Monthly Rent</span>
            <strong>₹${Math.round(res.suburb.rent).toLocaleString()}</strong>
          </div>
          <div class="cc-metric-row">
            <span>Direct Commute / Cabs</span>
            <strong class="text-amber">₹${Math.round(res.suburb.direct_commute_cost).toLocaleString()}</strong>
          </div>
          <div class="cc-metric-row">
            <span>Time Lost in Traffic</span>
            <strong class="text-red">${res.suburb.traffic_hours_monthly} hrs/mo</strong>
          </div>
          <div class="cc-metric-row">
            <span>Monetary Value of Lost Time</span>
            <strong class="text-red">₹${Math.round(res.suburb.time_value_loss).toLocaleString()}</strong>
          </div>

          <div class="cc-total-box">
            <span>TRUE MONTHLY COST</span>
            <span class="cc-total-val">₹${Math.round(res.suburb.true_total_cost).toLocaleString()}</span>
          </div>
        </div>

        <!-- Core Card (Near Office) -->
        <div class="commute-card core-highlight-card">
          <div class="cc-header">
            <span class="cc-tag" style="background: rgba(45, 106, 79, 0.15); color: #2d6a4f;">Core Tech Corridor</span>
            <h4>Living Near Office</h4>
          </div>

          <div class="cc-metric-row">
            <span>Monthly Rent</span>
            <strong>₹${Math.round(res.core.rent).toLocaleString()} (+₹${Math.round(d.rent_premium).toLocaleString()})</strong>
          </div>
          <div class="cc-metric-row">
            <span>Direct Commute / Cabs</span>
            <strong class="text-green">₹${Math.round(res.core.direct_commute_cost).toLocaleString()} (-₹${Math.round(d.commute_cost_saved).toLocaleString()})</strong>
          </div>
          <div class="cc-metric-row">
            <span>Time Lost in Traffic</span>
            <strong class="text-green">${res.core.traffic_hours_monthly} hrs/mo</strong>
          </div>
          <div class="cc-metric-row">
            <span>Monetary Value of Lost Time</span>
            <strong>₹${Math.round(res.core.time_value_loss).toLocaleString()}</strong>
          </div>

          <div class="cc-total-box">
            <span>TRUE MONTHLY COST</span>
            <span class="cc-total-val" style="color: #2d6a4f;">₹${Math.round(res.core.true_total_cost).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <!-- Life Hours & Financial Delta Banner -->
      <div class="traffic-tax-summary-banner">
        <div class="tts-item">
          <span class="tts-label">Life Hours Reclaimed</span>
          <span class="tts-val text-green">⚡ ${d.hours_saved_monthly} Hours / Month</span>
          <span class="tts-sub">Equivalent to ${(d.hours_saved_monthly / 8).toFixed(1)} full work days saved</span>
        </div>
        <div class="tts-item">
          <span class="tts-label">Net Economic Gain</span>
          <span class="tts-val ${isAdvantage ? 'text-green' : 'text-amber'}">
            ${isAdvantage ? '+₹' + Math.round(d.total_economic_advantage).toLocaleString() : '-₹' + Math.round(Math.abs(d.total_economic_advantage)).toLocaleString()}/mo
          </span>
          <span class="tts-sub">Factoring rent difference, cabs, and hourly wage</span>
        </div>
      </div>
    `;
  }
}

window.CommuteTaxComponent = CommuteTaxComponent;
