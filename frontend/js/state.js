/**
 * Global Reactive State Store
 */

class AppState {
  constructor() {
    this.state = {
      theme: localStorage.getItem("city_planner_theme") || "light",
      activeTab: "dashboard",
      userProfile: {
        monthly_income: 50000,
        city: "bengaluru",
        age: 23,
        living_type: "alone",
        lifestyle: "moderate",
        rent_type: "1bhk",
        savings_target: 10000,
        spending_habits: {
          eating_outside: 70,
          shopping: 40,
          entertainment: 60,
          travel: 50,
          subscriptions: 30
        },
        custom_rent: null
      },
      currentCalculation: null,
      comparisonData: null,
      neighborhoodsData: [],
      simulationData: null,
      jobOfferData: null,
      isLoading: false
    };
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  updateProfile(field, value) {
    if (field.startsWith("habits.")) {
      const habitKey = field.split(".")[1];
      this.state.userProfile.spending_habits[habitKey] = Number(value);
    } else {
      this.state.userProfile[field] = value;
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }
}

window.appState = new AppState();
