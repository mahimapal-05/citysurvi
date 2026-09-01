/**
 * Main Application Coordinator
 */

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Initialize Theme
  initTheme();

  // 2. Initialize Navigation Tabs
  initTabs();

  // 3. Initialize Components
  window.socialCardGenerator = new window.SocialCardGenerator();
  window.receiptPrinterComponent = new window.ReceiptPrinterComponent();
  window.commuteTaxComponent = new window.CommuteTaxComponent();
  window.runwayClockComponent = new window.RunwayClockComponent();
  window.calculatorComponent = new window.CalculatorComponent();
  window.comparisonComponent = new window.ComparisonComponent();
  window.simulatorComponent = new window.SimulatorComponent();
  window.neighborhoodComponent = new window.NeighborhoodComponent();
  window.jobOfferComponent = new window.JobOfferComponent();

  // 4. Initialize Export
  initExport();

  // 5. Initial Run with Bengaluru default
  await window.calculatorComponent.runCalculation();
  await window.neighborhoodComponent.loadCityNeighborhoods("bengaluru");
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
      if (state.currentCalculation) {
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

      // Lazy refresh on tab switch
      if (targetTab === "comparison") {
        window.comparisonComponent.refreshComparison();
      } else if (targetTab === "simulator") {
        window.simulatorComponent.runSimulation();
      } else if (targetTab === "neighborhoods") {
        const currCity = window.appState.getState().userProfile.city;
        window.neighborhoodComponent.loadCityNeighborhoods(currCity);
      } else if (targetTab === "job-offer") {
        window.jobOfferComponent.evaluate();
      } else if (targetTab === "commute-tax") {
        window.commuteTaxComponent.calculateTradeoff();
      } else if (targetTab === "runway-clock") {
        window.runwayClockComponent.calculateRunway();
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
