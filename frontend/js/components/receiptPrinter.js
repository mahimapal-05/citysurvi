/**
 * Thermal Receipt Printer Component
 * Inspired by retro POS & survivebro thermal printer mechanics:
 * - Matte chassis slot machine
 * - Mechanical stepped paper feed animation (0ms -> 700ms -> 2500ms)
 * - LED status screen ("Reading the city..." -> "Printing survival..." -> "Verdict ready ✓")
 * - Itemized cost list with pass/tight/fail icons
 * - 40-teeth jagged serrated tear edge polygon
 * - Rotated rubber verdict stamp
 * - Realistic barcode & timestamp
 * - Optional Web Audio mechanical dot-matrix sound synthesis
 */

class ReceiptPrinterComponent {
  constructor() {
    this.printerSlot = document.getElementById("thermalPrinterPaper");
    this.statusScreen = document.getElementById("printerStatusText");
    this.statusIcon = document.getElementById("printerStatusIcon");
    this.printBtn = document.getElementById("triggerPrintBtn");
    this.tearBtn = document.getElementById("tearReceiptBtn");
    this.isPrinting = false;
    this.audioCtx = null;

    this.initEvents();
  }

  initEvents() {
    if (this.printBtn) {
      this.printBtn.addEventListener("click", () => {
        this.printReceipt();
      });
    }

    if (this.tearBtn) {
      this.tearBtn.addEventListener("click", () => {
        this.downloadOrPrintReceipt();
      });
    }

    const shareStoryBtn = document.getElementById("shareStoryBtn");
    if (shareStoryBtn) {
      shareStoryBtn.addEventListener("click", () => {
        if (!window.socialCardGenerator) {
          window.socialCardGenerator = new window.SocialCardGenerator();
        }
        window.socialCardGenerator.currentFormat = "story";
        window.socialCardGenerator.open();
      });
    }

    const shareSquareBtn = document.getElementById("shareSquareBtn");
    if (shareSquareBtn) {
      shareSquareBtn.addEventListener("click", () => {
        if (!window.socialCardGenerator) {
          window.socialCardGenerator = new window.SocialCardGenerator();
        }
        window.socialCardGenerator.currentFormat = "square";
        window.socialCardGenerator.open();
      });
    }
  }

  // Web Audio subtle mechanical ticking sound
  playMechanicalTick() {
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.audioCtx = new AudioContext();
      }
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140 + Math.random() * 60, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.04);
    } catch (e) {
      // Audio not supported or blocked, continue silently
    }
  }

  generateJaggedClipPath(teethCount = 40, toothDepthPx = 5) {
    const points = [];
    // Top edges
    points.push("0% 0%", "100% 0%", "100% 100%");
    
    // Bottom jagged edge from right to left
    for (let i = teethCount; i >= 0; i--) {
      const xPct = (i / teethCount) * 100;
      const isPeak = i % 2 === 1;
      const yVal = isPeak ? `calc(100% - ${toothDepthPx}px)` : "100%";
      points.push(`${xPct}% ${yVal}`);
    }
    points.push("0% 100%");
    return `polygon(${points.join(", ")})`;
  }

  async printReceipt(customData = null) {
    if (this.isPrinting) return;
    this.isPrinting = true;

    const calcData = customData || window.appState.getState().currentCalculation;
    if (!calcData) {
      this.isPrinting = false;
      return;
    }

    const paper = this.printerSlot;
    if (!paper) return;

    // Reset paper to retracted position inside machine
    paper.classList.remove("is-printed", "is-stepped-feed");
    paper.style.transform = "translateY(-100%)";
    paper.style.opacity = "0";

    // Update LED status screen: Phase 1 (0-600ms)
    this.setStatus("processing", "Reading the city...", "⏳");

    await new Promise(r => setTimeout(r, 600));

    // Populate Receipt Content before feeding out
    this.renderReceiptContent(calcData);

    // Apply jagged tear edge
    paper.style.clipPath = this.generateJaggedClipPath(40, 5);
    paper.style.opacity = "1";

    // Phase 2: Printing mechanical feed (600ms -> 2400ms)
    this.setStatus("printing", "Printing your survival...", "🖨️");
    paper.classList.add("is-stepped-feed");

    // Play periodic mechanical dot-matrix sound clicks
    const tickInterval = setInterval(() => {
      this.playMechanicalTick();
    }, 120);

    await new Promise(r => setTimeout(r, 1800));

    clearInterval(tickInterval);

    // Phase 3: Complete
    paper.classList.remove("is-stepped-feed");
    paper.classList.add("is-printed");
    paper.style.transform = "translateY(0%)";

    this.setStatus("complete", "Verdict ready", "✓");
    this.isPrinting = false;
  }

  setStatus(stage, text, icon) {
    if (this.statusScreen) {
      this.statusScreen.textContent = text;
    }
    if (this.statusIcon) {
      this.statusIcon.textContent = icon;
    }
    const machine = document.querySelector(".thermal-printer-machine");
    if (machine) {
      machine.setAttribute("data-stage", stage);
    }
  }

  renderReceiptContent(res) {
    const paper = this.printerSlot;
    if (!paper) return;

    const exp = res.expenses;
    const health = res.financial_health;
    const stress = res.stress_score;
    const income = health.monthly_income;
    const target = res.user_input.savings_target || 10000;

    // Percentage of salary per category
    const rentPct = Math.round((exp.rent / income) * 100);
    const foodPct = Math.round((exp.food / income) * 100);
    const transportPct = Math.round((exp.transport / income) * 100);
    const utilsPct = Math.round(((exp.utilities + exp.internet_phone) / income) * 100);
    const lifePct = Math.round(((exp.lifestyle_discretionary + exp.subscriptions + exp.miscellaneous) / income) * 100);
    const savingsPct = health.savings_rate_pct;

    // Itemized marks
    const getMark = (pct, thresholdTight, thresholdFail, isSavings = false) => {
      if (isSavings) {
        if (pct >= 20) return '<span class="mark-pass">✓ SURPLUS</span>';
        if (pct >= 10) return '<span class="mark-tight">⚠️ TIGHT</span>';
        if (pct >= 0) return '<span class="mark-fail">❌ ZERO</span>';
        return '<span class="mark-dead">💀 DEFICIT</span>';
      }
      if (pct > thresholdFail) return '<span class="mark-fail">❌ HEAVY</span>';
      if (pct > thresholdTight) return '<span class="mark-tight">⚠️ TIGHT</span>';
      return '<span class="mark-pass">✓ OK</span>';
    };

    // Stamp verdict
    let stampText = "SURVIVES";
    let stampClass = "stamp-survives";
    if (stress.score > 85) {
      stampText = "💀 BROKE / CRITICAL";
      stampClass = "stamp-broke";
    } else if (stress.score > 70) {
      stampText = "❌ UNSUSTAINABLE";
      stampClass = "stamp-broke";
    } else if (stress.score > 50) {
      stampText = "⚠️ TIGHT SQUEEZE";
      stampClass = "stamp-tight";
    } else if (stress.score > 25) {
      stampText = "🟢 MANAGEABLE";
      stampClass = "stamp-survives";
    } else {
      stampText = "🏆 COMFORTABLE";
      stampClass = "stamp-survives";
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const txnId = "TXN-" + Math.floor(100000 + Math.random() * 900000);

    paper.innerHTML = `
      <div class="receipt-inner">
        <!-- Receipt Top Header -->
        <div class="receipt-header">
          <div class="rc-title">SURVIVEBRO • CITY RECEIPT</div>
          <div class="rc-sub">MUNICIPAL COST & SURVIVAL REGISTER</div>
          <div class="rc-divider">================================</div>
          <div class="rc-meta-grid">
            <div>CITY: <strong>${res.city_name.toUpperCase()}</strong></div>
            <div>DATE: ${dateStr}</div>
            <div>TIME: ${timeStr}</div>
            <div>TXN ID: #${txnId}</div>
          </div>
          <div class="rc-divider">--------------------------------</div>
          <div class="rc-income-line">
            <span>MONTHLY IN-HAND SALARY</span>
            <span class="rc-salary-val">₹${Math.round(income).toLocaleString()}</span>
          </div>
          <div class="rc-divider">================================</div>
        </div>

        <!-- Receipt Table -->
        <div class="receipt-items-table">
          <div class="rc-table-head">
            <span>ITEM DESCRIPTION</span>
            <span>% SAL</span>
            <span>AMOUNT</span>
          </div>
          <div class="rc-divider">--------------------------------</div>

          <div class="rc-row">
            <div class="rc-item-name">
              <span>01. RENT (${res.user_input.rent_type.toUpperCase()})</span>
              ${getMark(rentPct, 30, 40)}
            </div>
            <div class="rc-pct">${rentPct}%</div>
            <div class="rc-cost">₹${Math.round(exp.rent).toLocaleString()}</div>
          </div>

          <div class="rc-row">
            <div class="rc-item-name">
              <span>02. FOOD & GROCERIES</span>
              ${getMark(foodPct, 22, 35)}
            </div>
            <div class="rc-pct">${foodPct}%</div>
            <div class="rc-cost">₹${Math.round(exp.food).toLocaleString()}</div>
          </div>

          <div class="rc-row">
            <div class="rc-item-name">
              <span>03. TRANSIT & COMMUTE</span>
              ${getMark(transportPct, 12, 20)}
            </div>
            <div class="rc-pct">${transportPct}%</div>
            <div class="rc-cost">₹${Math.round(exp.transport).toLocaleString()}</div>
          </div>

          <div class="rc-row">
            <div class="rc-item-name">
              <span>04. POWER + WIFI + BILLS</span>
              ${getMark(utilsPct, 10, 15)}
            </div>
            <div class="rc-pct">${utilsPct}%</div>
            <div class="rc-cost">₹${Math.round(exp.utilities + exp.internet_phone).toLocaleString()}</div>
          </div>

          <div class="rc-row">
            <div class="rc-item-name">
              <span>05. LIFESTYLE & OTT</span>
              ${getMark(lifePct, 15, 25)}
            </div>
            <div class="rc-pct">${lifePct}%</div>
            <div class="rc-cost">₹${Math.round(exp.lifestyle_discretionary + exp.subscriptions + exp.miscellaneous).toLocaleString()}</div>
          </div>

          <div class="rc-divider">--------------------------------</div>

          <div class="rc-row rc-total-row">
            <div class="rc-item-name"><strong>TOTAL OUTFLOW</strong></div>
            <div class="rc-pct"><strong>${health.expense_ratio_pct}%</strong></div>
            <div class="rc-cost"><strong>₹${Math.round(health.total_expense).toLocaleString()}</strong></div>
          </div>

          <div class="rc-divider">================================</div>

          <!-- Surplus / Savings Line -->
          <div class="rc-row rc-savings-row">
            <div class="rc-item-name">
              <strong>REMAINING CASHFLOW</strong>
              ${getMark(savingsPct, 10, 0, true)}
            </div>
            <div class="rc-pct"><strong>${savingsPct}%</strong></div>
            <div class="rc-cost ${health.net_savings >= 0 ? 'text-green' : 'text-red'}">
              <strong>₹${Math.round(health.net_savings).toLocaleString()}</strong>
            </div>
          </div>

          <div class="rc-target-note">
            <span>SAVINGS TARGET: ₹${Math.round(target).toLocaleString()} • ${health.target_met ? '✓ GOAL MET' : '✕ SHORTFALL ₹' + Math.round(Math.abs(health.savings_deficit_surplus)).toLocaleString()}</span>
          </div>
        </div>

        <!-- Rubber Stamp Verdict Overlay -->
        <div class="rc-stamp-container">
          <div class="rc-stamp ${stampClass}">
            ${stampText}
            <span class="rc-stamp-sub">STRESS SCORE: ${stress.score}/100</span>
          </div>
        </div>

        <!-- AI Telegram Interpretation -->
        <div class="rc-ai-telegram">
          <div class="rc-divider">--------------------------------</div>
          <div class="rc-telegram-title">[ AI ADVICE DISPATCH ]</div>
          <p class="rc-telegram-text">"${res.ai_recommendation.summary}"</p>
          <div class="rc-telegram-opt">TIP: ${res.ai_recommendation.action_items[0] || 'Keep rent under 30% of salary.'}</div>
          <div class="rc-divider">--------------------------------</div>
        </div>

        <!-- Barcode & Receipt Footer -->
        <div class="receipt-footer">
          <div class="rc-barcode">
            <div class="barcode-bars">
              ||| | |||| | || ||| || |||| | ||| || ||| | |||| ||| || |||
            </div>
            <div class="barcode-num">SURVIVE-${res.city_name.toUpperCase()}-${Math.round(income / 1000)}K</div>
          </div>
          <div class="rc-thank-you">THANK YOU FOR SURVIVING IN ${res.city_name.toUpperCase()}</div>
          <div class="rc-tear-line">- - - - - TEAR HERE - - - - -</div>
        </div>
      </div>
    `;
  }

  downloadOrPrintReceipt() {
    window.print();
  }
}

window.ReceiptPrinterComponent = ReceiptPrinterComponent;
