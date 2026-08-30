/**
 * API Client with automatic fallback to client-side deterministic calculation engine
 */

class ApiService {
  constructor() {
    // When served from FastAPI, use relative path, otherwise default to localhost:8000
    this.baseUrl = window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")
      ? window.location.origin
      : "http://127.0.0.1:8000";
    this.isOnline = true;
  }

  async calculate(userProfile) {
    try {
      const response = await fetch(`${this.baseUrl}/api/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userProfile)
      });
      if (!response.ok) throw new Error("API calculate error");
      return await response.json();
    } catch (err) {
      console.warn("Backend unavailable, using local calculation engine:", err);
      return this.localCalculate(userProfile);
    }
  }

  async compare(userProfile) {
    try {
      const response = await fetch(`${this.baseUrl}/api/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userProfile)
      });
      if (!response.ok) throw new Error("API compare error");
      return await response.json();
    } catch (err) {
      console.warn("Backend unavailable, using local compare engine:", err);
      return this.localCompare(userProfile);
    }
  }

  async simulate(simulationPayload) {
    try {
      const response = await fetch(`${this.baseUrl}/api/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(simulationPayload)
      });
      if (!response.ok) throw new Error("API simulate error");
      return await response.json();
    } catch (err) {
      return this.localSimulate(simulationPayload);
    }
  }

  async getNeighborhoods(cityId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/neighborhoods/${cityId}`);
      if (!response.ok) throw new Error("API neighborhoods error");
      return await response.json();
    } catch (err) {
      const city = window.CITIES_DATA[cityId] || window.CITIES_DATA["bengaluru"];
      return city.neighborhoods || [];
    }
  }

  async evaluateJobOffer(offerPayload) {
    try {
      const response = await fetch(`${this.baseUrl}/api/job-offer-evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offerPayload)
      });
      if (!response.ok) throw new Error("API job offer error");
      return await response.json();
    } catch (err) {
      return this.localJobOfferEvaluate(offerPayload);
    }
  }

  // --- Local Engine Fallbacks ---
  localCalculate(profile) {
    const city = window.CITIES_DATA[profile.city] || window.CITIES_DATA["bengaluru"];
    const rentVal = profile.custom_rent || city.rent[profile.rent_type] || city.rent["1bhk"];
    const rent = profile.living_type === "with_family" ? rentVal * 0.25 : (profile.living_type === "with_roommate" && profile.rent_type === "1bhk" ? rentVal * 0.55 : rentVal);

    const eatingSlider = (profile.spending_habits?.eating_outside ?? 50) / 50;
    const food = (city.food[profile.lifestyle] || city.food.moderate) * (0.8 + 0.35 * eatingSlider);
    
    const travelSlider = (profile.spending_habits?.travel ?? 50) / 50;
    const transport = (city.transport[profile.lifestyle] || city.transport.moderate) * (0.85 + 0.3 * travelSlider);
    
    const utilities = city.utilities;
    const internet = city.internet_phone;
    const subSlider = (profile.spending_habits?.subscriptions ?? 50) / 50;
    const subscriptions = city.subscriptions * (0.5 + 0.7 * subSlider);

    const shopSlider = (profile.spending_habits?.shopping ?? 40) / 50;
    const entSlider = (profile.spending_habits?.entertainment ?? 50) / 50;
    const mult = profile.lifestyle === "basic" ? 0.7 : (profile.lifestyle === "moderate" ? 1.0 : 1.6);
    
    const shopping_entertainment = city.discretionary_base * mult * (0.4 * shopSlider + 0.6 * entSlider);
    const travel_leisure = city.discretionary_base * 0.6 * travelSlider * mult;
    const misc = city.discretionary_base * 0.5 * mult;

    const total_fixed = rent + utilities + internet + subscriptions;
    const total_variable = food + transport + shopping_entertainment + travel_leisure + misc;
    const total_expense = total_fixed + total_variable;

    const income = profile.monthly_income;
    const savings = income - total_expense;
    const savings_rate = Math.round((savings / income) * 1000) / 10;
    const expense_ratio = Math.round((total_expense / income) * 1000) / 10;
    const target = profile.savings_target || 10000;

    // Stress calculation
    let rentScore = Math.min(30, (rent / income) * 60);
    let savScore = savings >= target ? Math.max(0, 5 - ((savings / target) - 1) * 5) : 5 + ((target - savings) / target) * 15;
    let essScore = Math.min(20, ((rent + food + transport + utilities) / income) * 22);
    let lifeScore = Math.min(15, ((shopping_entertainment + misc + subscriptions) / income) * 25);
    let bufScore = savings >= (0.25 * income) ? 1 : (savings >= (0.1 * income) ? 4 : (savings >= 0 ? 7 : 10));
    
    let stressScore = Math.round(Math.max(0, Math.min(100, rentScore + savScore + essScore + lifeScore + bufScore)));
    
    let status = "Comfortable", badge = "🟢 Comfortable", color = "#10b981";
    if (stressScore > 85) { status = "Unsustainable"; badge = "🔴 Unsustainable"; color = "#ef4444"; }
    else if (stressScore > 70) { status = "Difficult"; badge = "🟠 Difficult"; color = "#f97316"; }
    else if (stressScore > 50) { status = "Tight"; badge = "🟡 Tight"; color = "#eab308"; }
    else if (stressScore > 25) { status = "Manageable"; badge = "🟢 Manageable"; color = "#22c55e"; }

    return {
      city_id: city.id,
      city_name: city.name,
      user_input: profile,
      expenses: {
        rent, food, transport, utilities, internet_phone: internet, subscriptions,
        lifestyle_discretionary: shopping_entertainment + travel_leisure,
        shopping_entertainment, travel: travel_leisure, miscellaneous: misc,
        total_fixed, total_variable, total_monthly_expense: total_expense
      },
      financial_health: {
        monthly_income: income,
        total_expense,
        net_savings: savings,
        savings_rate_pct: savings_rate,
        expense_ratio_pct: expense_ratio,
        required_minimum_income: total_expense + target,
        target_met: savings >= target,
        savings_deficit_surplus: savings - target,
        annual_projected_savings: Math.max(0, savings) * 12
      },
      stress_score: {
        score: stressScore,
        status, status_badge: badge, color,
        description: `Stress score of ${stressScore}/100 based on housing, essential ratios, and savings gap.`,
        breakdown: {
          rent_burden_score: Math.round(rentScore * 10) / 10,
          savings_gap_score: Math.round(savScore * 10) / 10,
          essential_ratio_score: Math.round(essScore * 10) / 10,
          lifestyle_ratio_score: Math.round(lifeScore * 10) / 10,
          buffer_score: bufScore
        }
      },
      ai_recommendation: {
        summary: `${city.name} is ${status.toLowerCase()} on ₹${income.toLocaleString()}/mo. You save ₹${Math.round(savings).toLocaleString()}/mo (${savings_rate}% savings rate).`,
        rent_analysis: `Rent consumes ${Math.round((rent/income)*100)}% of your income (₹${Math.round(rent).toLocaleString()}/mo).`,
        lifestyle_analysis: `Food and discretionary expenses account for ₹${Math.round(food + shopping_entertainment).toLocaleString()}/month.`,
        savings_opportunity: `Switching to a shared apartment can unlock ₹${Math.round(rent * 0.4).toLocaleString()} in extra monthly cashflow.`,
        relocation_verdict: stressScore <= 50 ? `Green signal for ${city.name}. Great financial viability.` : `Caution: Look for shared flats or negotiate higher base salary.`,
        action_items: [
          `Cap housing spend below ₹${Math.round(income * 0.3).toLocaleString()}/month.`,
          `Automate ₹${Math.round(Math.min(savings, target)).toLocaleString()} monthly savings transfer on payday.`
        ]
      }
    };
  }

  localCompare(profile) {
    const list = [];
    for (const [cid, cinfo] of Object.entries(window.CITIES_DATA)) {
      const res = this.localCalculate({ ...profile, city: cid, custom_rent: null });
      list.push({
        city_id: cid,
        city_name: cinfo.name,
        state: cinfo.state,
        tier: cinfo.tier,
        monthly_cost: res.expenses.total_monthly_expense,
        net_savings: res.financial_health.net_savings,
        savings_rate_pct: res.financial_health.savings_rate_pct,
        stress_score: res.stress_score.score,
        status: res.stress_score.status,
        status_badge: res.stress_score.status_badge,
        color: res.stress_score.color,
        is_best_city: false,
        rank: 0,
        rationale: `Retain ₹${Math.round(res.financial_health.net_savings).toLocaleString()}/mo with ${res.financial_health.savings_rate_pct}% savings rate.`
      });
    }
    list.sort((a, b) => a.stress_score - b.stress_score || b.net_savings - a.net_savings);
    list.forEach((item, idx) => item.rank = idx + 1);
    list[0].is_best_city = true;

    return {
      base_income: profile.monthly_income,
      lifestyle: profile.lifestyle,
      rent_type: profile.rent_type,
      best_city: list[0].city_name,
      best_city_savings: list[0].net_savings,
      rankings: list,
      insights: [
        `Top Recommended City: ${list[0].city_name} allows maximum savings of ₹${Math.round(list[0].net_savings).toLocaleString()}/month.`,
        `Lowest vs Highest Cost spread across India's top 10 job cities is ₹${Math.round(list[list.length-1].monthly_cost - list[0].monthly_cost).toLocaleString()}/month.`
      ]
    };
  }

  localSimulate(req) {
    const baseRes = this.localCalculate(req.base_profile);
    const simProf = {
      ...req.base_profile,
      monthly_income: req.simulated_income ?? req.base_profile.monthly_income,
      rent_type: req.simulated_rent_type ?? req.base_profile.rent_type,
      lifestyle: req.simulated_lifestyle ?? req.base_profile.lifestyle,
      city: req.simulated_city ?? req.base_profile.city,
      savings_target: req.simulated_savings_target ?? req.base_profile.savings_target,
      spending_habits: {
        ...req.base_profile.spending_habits,
        eating_outside: req.simulated_eating_out ?? req.base_profile.spending_habits?.eating_outside ?? 50
      }
    };
    const simRes = this.localCalculate(simProf);
    const deltaSav = simRes.financial_health.net_savings - baseRes.financial_health.net_savings;
    const deltaStress = simRes.stress_score.score - baseRes.stress_score.score;

    return {
      baseline_expenses: baseRes.expenses.total_monthly_expense,
      baseline_savings: baseRes.financial_health.net_savings,
      baseline_stress_score: baseRes.stress_score.score,
      simulated_expenses: simRes.expenses.total_monthly_expense,
      simulated_savings: simRes.financial_health.net_savings,
      simulated_stress_score: simRes.stress_score.score,
      delta_savings: deltaSav,
      delta_savings_pct: Math.round((deltaSav / Math.max(1, Math.abs(baseRes.financial_health.net_savings))) * 100),
      delta_stress_score: deltaStress,
      key_takeaway: deltaSav >= 0 
        ? `This scenario unlocks +₹${Math.round(deltaSav).toLocaleString()}/mo in extra savings, dropping stress score by ${Math.abs(deltaStress)} pts.`
        : `This scenario increases monthly spending by ₹${Math.round(Math.abs(deltaSav)).toLocaleString()}/month.`,
      comparison_details: {
        rent_diff: simRes.expenses.rent - baseRes.expenses.rent,
        food_diff: simRes.expenses.food - baseRes.expenses.food,
        savings_rate_base: baseRes.financial_health.savings_rate_pct,
        savings_rate_sim: simRes.financial_health.savings_rate_pct
      }
    };
  }

  localJobOfferEvaluate(req) {
    const currRes = this.localCalculate({
      monthly_income: req.current_income,
      city: req.current_city,
      rent_type: req.current_rent_type,
      lifestyle: req.lifestyle,
      savings_target: req.savings_target
    });
    const offerRes = this.localCalculate({
      monthly_income: req.offer_income,
      city: req.offer_city,
      rent_type: req.offer_rent_type || req.current_rent_type,
      lifestyle: req.lifestyle,
      savings_target: req.savings_target
    });

    const deltaIncome = req.offer_income - req.current_income;
    const deltaSav = offerRes.financial_health.net_savings - currRes.financial_health.net_savings;
    const pppParity = offerRes.expenses.total_monthly_expense + currRes.financial_health.net_savings;
    const isViable = deltaSav > 0 && offerRes.stress_score.score <= 65;

    return {
      current_city: currRes.city_name,
      current_income: req.current_income,
      current_expense: currRes.expenses.total_monthly_expense,
      current_savings: currRes.financial_health.net_savings,
      current_stress: currRes.stress_score.score,
      offer_city: offerRes.city_name,
      offer_income: req.offer_income,
      offer_expense: offerRes.expenses.total_monthly_expense,
      offer_savings: offerRes.financial_health.net_savings,
      offer_stress: offerRes.stress_score.score,
      delta_income: deltaIncome,
      delta_savings: deltaSav,
      cost_of_living_diff_pct: Math.round(((offerRes.expenses.total_monthly_expense - currRes.expenses.total_monthly_expense)/currRes.expenses.total_monthly_expense)*100),
      ppp_parity_salary: pppParity,
      is_financially_viable: isViable,
      verdict_badge: isViable ? "🚀 Financially Viable & Lucrative" : "⚠️ High Cost Trap (Check Parity)",
      verdict_summary: isViable 
        ? `Moving to ${offerRes.city_name} increases your net savings by +₹${Math.round(deltaSav).toLocaleString()}/month (₹${Math.round(deltaSav*12).toLocaleString()}/year).`
        : `Moving to ${offerRes.city_name} reduces real savings by ₹${Math.round(Math.abs(deltaSav)).toLocaleString()}/mo due to higher local living costs. Target at least ₹${Math.round(pppParity).toLocaleString()}/mo.`,
      detailed_points: [
        `Monthly living expenses in ${offerRes.city_name}: ₹${Math.round(offerRes.expenses.total_monthly_expense).toLocaleString()} (vs ₹${Math.round(currRes.expenses.total_monthly_expense).toLocaleString()} in ${currRes.city_name}).`,
        `Housing shift: Rent changes to ₹${Math.round(offerRes.expenses.rent).toLocaleString()}/mo.`,
        `Breakeven CTC: You need ₹${Math.round(pppParity).toLocaleString()}/mo in ${offerRes.city_name} to maintain your current lifestyle surplus.`
      ]
    };
  }
}

window.apiService = new ApiService();
