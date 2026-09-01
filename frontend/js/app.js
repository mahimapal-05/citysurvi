/**
 * Main Application Coordinator
 */

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Initialize Theme
  try {
    initTheme();
  } catch (e) {
    console.error("Theme init error:", e);
  }

  // 2. Initialize Navigation Tabs
  try {
    initTabs();
  } catch (e) {
    console.error("Tabs init error:", e);
  }

  // 3. Initialize Components safely
  try { window.socialCardGenerator = new window.SocialCardGenerator(); } catch (e) { console.error("SocialCard init error:", e); }
  try { window.receiptPrinterComponent = new window.ReceiptPrinterComponent(); } catch (e) { console.error("ReceiptPrinter init error:", e); }
  try { window.commuteTaxComponent = new window.CommuteTaxComponent(); } catch (e) { console.error("CommuteTax init error:", e); }
  try { window.runwayClockComponent = new window.RunwayClockComponent(); } catch (e) { console.error("RunwayClock init error:", e); }
  try { window.calculatorComponent = new window.CalculatorComponent(); } catch (e) { console.error("Calculator init error:", e); }
  try { window.comparisonComponent = new window.ComparisonComponent(); } catch (e) { console.error("Comparison init error:", e); }
  try { window.simulatorComponent = new window.SimulatorComponent(); } catch (e) { console.error("Simulator init error:", e); }
  try { window.neighborhoodComponent = new window.NeighborhoodComponent(); } catch (e) { console.error("Neighborhood init error:", e); }
  try { window.jobOfferComponent = new window.JobOfferComponent(); } catch (e) { console.error("JobOffer init error:", e); }

  // 4. Initialize Export
  try {
    initExport();
  } catch (e) {
    console.error("Export init error:", e);
  }

  // 5. Initial Run with Bengaluru default
  try {
    if (window.calculatorComponent) {
      await window.calculatorComponent.runCalculation();
    }
  } catch (e) {
    console.error("Initial calculation error:", e);
  }

  try {
    if (window.neighborhoodComponent) {
      await window.neighborhoodComponent.loadCityNeighborhoods("bengaluru");
    }
  } catch (e) {
    console.error("Initial neighborhood load error:", e);
  }
});

function initTheme() {
  const currentTheme = localStorage.getItem("city_planner_theme") || "light";
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeIcon(currentTheme);

  const toggleBtn = document.getElementById("themeToggleBtn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const active = document.documentElement.getAttribute("data-theme");
      const next = active === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("city_planner_theme", next);
      updateThemeIcon(next);

      // Re-render canvas charts for theme adaptation
      const state = window.appState.getState();
      if (state.currentCalculation && window.calculatorComponent) {
        window.calculatorComponent.renderResults(state.currentCalculation);
      }
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.getElementById("themeIcon");
  if (icon) {
    icon.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

function initTabs() {
  const tabButtons = document.querySelectorAll(".nav-tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const targetTab = e.currentTarget.dataset.tab;
      
      tabButtons.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      e.currentTarget.classList.add("active");
      const activePane = document.getElementById(`tab-${targetTab}`);
      if (activePane) activePane.classList.add("active");

      // Safe lazy refresh on tab switch
      try {
        if (targetTab === "comparison" && window.comparisonComponent) {
          window.comparisonComponent.refreshComparison();
        } else if (targetTab === "simulator" && window.simulatorComponent) {
          window.simulatorComponent.runSimulation();
        } else if (targetTab === "neighborhoods" && window.neighborhoodComponent) {
          const currCity = window.appState.getState().userProfile.city;
          window.neighborhoodComponent.loadCityNeighborhoods(currCity);
        } else if (targetTab === "job-offer" && window.jobOfferComponent) {
          window.jobOfferComponent.evaluate();
        } else if (targetTab === "commute-tax" && window.commuteTaxComponent) {
          window.commuteTaxComponent.calculateTradeoff();
        } else if (targetTab === "runway-clock" && window.runwayClockComponent) {
          window.runwayClockComponent.calculateRunway();
        }
      } catch (err) {
        console.error("Tab switch execution error:", err);
      }
    });
  });
}

function initExport() {
  const exportBtn = document.getElementById("exportReportBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      window.print();
    });
  }
}
