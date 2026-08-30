/**
 * Verified Top 10 Indian City Cost & Neighborhood Dataset (Client Copy)
 * Enables instant responsive UI rendering and standalone fallback.
 */

window.CITIES_DATA = {
  "bengaluru": {
    "id": "bengaluru",
    "name": "Bengaluru",
    "state": "Karnataka",
    "tier": "Tier 1 (Tech Capital)",
    "tagline": "India's Silicon Valley",
    "short_desc": "India's Silicon Valley with bustling tech parks, craft breweries, and high rental demand.",
    "tech_hubs": ["Outer Ring Road", "Whitefield", "Electronic City", "Manyata Tech Park", "Bagmane"],
    "rent": { "pg": 10500, "1bhk": 18500, "2bhk_shared": 13500, "2bhk_private": 30000, "3bhk_shared": 11000 },
    "food": { "basic": 5200, "moderate": 8500, "premium": 13500 },
    "transport": { "basic": 1800, "moderate": 3800, "premium": 7200 },
    "utilities": 2600,
    "internet_phone": 999,
    "subscriptions": 650,
    "discretionary_base": 3000,
    "neighborhoods": [
      { "id": "hsr_layout", "name": "HSR Layout", "vibe": "Startup hub, lush parks, trendy cafes, walkable avenues", "distance_to_it_hub_km": 4.5, "avg_1bhk_rent": 22000, "avg_2bhk_shared_rent": 15000, "avg_pg_rent": 12000, "safety_score": 92, "connectivity_score": 88, "lifestyle_score": 95, "best_suited_for": "Startup founders & software engineers in Koramangala / ORR" },
      { "id": "koramangala", "name": "Koramangala", "vibe": "Epicenter of nightlife, food scenes, VC offices", "distance_to_it_hub_km": 6.0, "avg_1bhk_rent": 24000, "avg_2bhk_shared_rent": 16500, "avg_pg_rent": 13500, "safety_score": 89, "connectivity_score": 85, "lifestyle_score": 98, "best_suited_for": "Young professionals who love vibrant social life & culinary variety" },
      { "id": "indiranagar", "name": "Indiranagar", "vibe": "Upscale boutiques, 100ft Road pubs, mature residential streets", "distance_to_it_hub_km": 7.5, "avg_1bhk_rent": 26000, "avg_2bhk_shared_rent": 18000, "avg_pg_rent": 14000, "safety_score": 93, "connectivity_score": 94, "lifestyle_score": 96, "best_suited_for": "Senior engineers and consultants prioritizing metro access & elite lifestyle" },
      { "id": "whitefield", "name": "Whitefield", "vibe": "Gated high-rises, ITPL campus, international schools, Purple Line metro", "distance_to_it_hub_km": 1.5, "avg_1bhk_rent": 16500, "avg_2bhk_shared_rent": 12000, "avg_pg_rent": 9500, "safety_score": 88, "connectivity_score": 86, "lifestyle_score": 84, "best_suited_for": "IT professionals at ITPL / Brigade Tech Gardens wanting short commutes" },
      { "id": "electronic_city", "name": "Electronic City", "vibe": "Infosys/Wipro mega-campuses, affordable modern societies", "distance_to_it_hub_km": 2.0, "avg_1bhk_rent": 13000, "avg_2bhk_shared_rent": 9500, "avg_pg_rent": 8500, "safety_score": 86, "connectivity_score": 80, "lifestyle_score": 78, "best_suited_for": "Entry-level devs & budget-conscious folks seeking maximum savings" }
    ]
  },
  "mumbai": {
    "id": "mumbai",
    "name": "Mumbai",
    "state": "Maharashtra",
    "tier": "Tier 1 (Financial Capital)",
    "tagline": "Financial Capital of India",
    "short_desc": "Maximum City with high rental premiums, top-notch local trains, and electric coastal lifestyle.",
    "tech_hubs": ["BKC", "NESCO Goregaon", "Mindspace Malad", "Powai Hiranandani", "Airoli"],
    "rent": { "pg": 13000, "1bhk": 26000, "2bhk_shared": 18000, "2bhk_private": 46000, "3bhk_shared": 15000 },
    "food": { "basic": 5500, "moderate": 9200, "premium": 15000 },
    "transport": { "basic": 1200, "moderate": 3200, "premium": 8000 },
    "utilities": 3000,
    "internet_phone": 999,
    "subscriptions": 650,
    "discretionary_base": 3800,
    "neighborhoods": [
      { "id": "powai", "name": "Powai (Hiranandani)", "vibe": "Neo-classical architecture, serene lake views, IT startups", "distance_to_it_hub_km": 1.5, "avg_1bhk_rent": 30000, "avg_2bhk_shared_rent": 21000, "avg_pg_rent": 15000, "safety_score": 95, "connectivity_score": 87, "lifestyle_score": 94, "best_suited_for": "Fintech & Product folks near Powai / Vikhroli" },
      { "id": "andheri_west", "name": "Andheri West (Lokhandwala)", "vibe": "Media capital, buzzing cafes, beach access, Metro line 1 & 2A", "distance_to_it_hub_km": 5.0, "avg_1bhk_rent": 34000, "avg_2bhk_shared_rent": 23000, "avg_pg_rent": 16000, "safety_score": 91, "connectivity_score": 96, "lifestyle_score": 97, "best_suited_for": "Creative & tech professionals who value entertainment & connectivity" },
      { "id": "goregaon_malad", "name": "Goregaon East / Malad", "vibe": "Corporate tech parks, large gated communities (Oberoi Woods)", "distance_to_it_hub_km": 2.0, "avg_1bhk_rent": 24000, "avg_2bhk_shared_rent": 16500, "avg_pg_rent": 12000, "safety_score": 90, "connectivity_score": 91, "lifestyle_score": 88, "best_suited_for": "IT professionals at NESCO / Mindspace" },
      { "id": "navi_mumbai_vashi", "name": "Navi Mumbai (Vashi / Seawoods)", "vibe": "Planned wide roads, sprawling gardens, cost-effective rentals", "distance_to_it_hub_km": 8.0, "avg_1bhk_rent": 15000, "avg_2bhk_shared_rent": 10500, "avg_pg_rent": 8500, "safety_score": 92, "connectivity_score": 85, "lifestyle_score": 82, "best_suited_for": "Professionals working in Airoli / Ghansoli IT parks wanting high savings" }
    ]
  },
  "delhi": {
    "id": "delhi",
    "name": "Delhi (NCR)",
    "state": "Delhi NCT",
    "tier": "Tier 1 (National Capital)",
    "tagline": "The Power Centre & Metro Hub",
    "short_desc": "Heritage meets massive infrastructure, best-in-class Delhi Metro network, and unmatched food.",
    "tech_hubs": ["Connaught Place", "Saket District Centre", "Okhla Phase 3", "Nehru Place", "Aerocity"],
    "rent": { "pg": 9500, "1bhk": 16000, "2bhk_shared": 11500, "2bhk_private": 26000, "3bhk_shared": 9500 },
    "food": { "basic": 4600, "moderate": 7800, "premium": 12500 },
    "transport": { "basic": 1500, "moderate": 3200, "premium": 6500 },
    "utilities": 2100,
    "internet_phone": 900,
    "subscriptions": 650,
    "discretionary_base": 2800,
    "neighborhoods": [
      { "id": "saket_malviya", "name": "Saket / Malviya Nagar", "vibe": "Select CityWalk, cafes, Yellow line metro", "distance_to_it_hub_km": 3.0, "avg_1bhk_rent": 19500, "avg_2bhk_shared_rent": 14000, "avg_pg_rent": 11500, "safety_score": 87, "connectivity_score": 94, "lifestyle_score": 93, "best_suited_for": "Tech & consulting professionals in South Delhi" },
      { "id": "lajpat_nagar", "name": "Lajpat Nagar / South Ext", "vibe": "Central connectivity, Pink/Violet metro line", "distance_to_it_hub_km": 4.0, "avg_1bhk_rent": 18000, "avg_2bhk_shared_rent": 13000, "avg_pg_rent": 10500, "safety_score": 83, "connectivity_score": 96, "lifestyle_score": 90, "best_suited_for": "Professionals needing quick access across Central Delhi" },
      { "id": "dwarka", "name": "Dwarka (Sectors 6-22)", "vibe": "Spacious planned sub-city near IGI Airport", "distance_to_it_hub_km": 8.0, "avg_1bhk_rent": 14500, "avg_2bhk_shared_rent": 10000, "avg_pg_rent": 8500, "safety_score": 89, "connectivity_score": 92, "lifestyle_score": 86, "best_suited_for": "Gurugram commuters looking for green surroundings" }
    ]
  },
  "hyderabad": {
    "id": "hyderabad",
    "name": "Hyderabad",
    "state": "Telangana",
    "tier": "Tier 1 (Cyberabad)",
    "tagline": "Fastest Growing Tech Haven",
    "short_desc": "Booming IT destination with wide flyovers, delicious biryani, and high disposable income retention.",
    "tech_hubs": ["HITEC City", "Gachibowli", "Madhapur", "Financial District", "Kondapur"],
    "rent": { "pg": 9000, "1bhk": 14500, "2bhk_shared": 10500, "2bhk_private": 24000, "3bhk_shared": 8500 },
    "food": { "basic": 4500, "moderate": 7400, "premium": 11500 },
    "transport": { "basic": 1600, "moderate": 3300, "premium": 6200 },
    "utilities": 2200,
    "internet_phone": 899,
    "subscriptions": 650,
    "discretionary_base": 2600,
    "neighborhoods": [
      { "id": "gachibowli", "name": "Gachibowli", "vibe": "Sports stadium, luxury high-rises, tech parks", "distance_to_it_hub_km": 1.0, "avg_1bhk_rent": 17000, "avg_2bhk_shared_rent": 12000, "avg_pg_rent": 9500, "safety_score": 93, "connectivity_score": 90, "lifestyle_score": 91, "best_suited_for": "Microsoft, Amazon, Google engineers in Financial District" },
      { "id": "madhapur", "name": "Madhapur / HITEC City", "vibe": "Heart of Cyberabad, Cyber Towers, cafes, Inorbit Mall", "distance_to_it_hub_km": 0.5, "avg_1bhk_rent": 18000, "avg_2bhk_shared_rent": 13000, "avg_pg_rent": 10500, "safety_score": 91, "connectivity_score": 94, "lifestyle_score": 94, "best_suited_for": "Techies wanting walking distance to office and nightlife" },
      { "id": "kondapur", "name": "Kondapur / Hafeezpet", "vibe": "Residential density, supermarkets, botanical gardens nearby", "distance_to_it_hub_km": 2.5, "avg_1bhk_rent": 14000, "avg_2bhk_shared_rent": 10000, "avg_pg_rent": 8500, "safety_score": 90, "connectivity_score": 88, "lifestyle_score": 87, "best_suited_for": "Budget-friendly flat sharers working in Gachibowli" }
    ]
  },
  "pune": {
    "id": "pune",
    "name": "Pune",
    "state": "Maharashtra",
    "tier": "Tier 1 (Automobile & IT)",
    "tagline": "Youth, Culture & Work-Life Balance",
    "short_desc": "Oxford of the East with pleasant weather, relaxed work-life balance, and vibrant youth culture.",
    "tech_hubs": ["Hinjewadi IT Park", "Magarpatta City", "Kharadi EON", "Baner High St"],
    "rent": { "pg": 8500, "1bhk": 14000, "2bhk_shared": 10000, "2bhk_private": 23000, "3bhk_shared": 8000 },
    "food": { "basic": 4500, "moderate": 7500, "premium": 11800 },
    "transport": { "basic": 1500, "moderate": 3200, "premium": 6000 },
    "utilities": 2100,
    "internet_phone": 899,
    "subscriptions": 650,
    "discretionary_base": 2700,
    "neighborhoods": [
      { "id": "baner_balewadi", "name": "Baner / Balewadi High St", "vibe": "Upscale dining, cafes, co-working hubs", "distance_to_it_hub_km": 5.0, "avg_1bhk_rent": 17500, "avg_2bhk_shared_rent": 12500, "avg_pg_rent": 10500, "safety_score": 92, "connectivity_score": 91, "lifestyle_score": 96, "best_suited_for": "Professionals wanting top cafes & social life" },
      { "id": "hinjewadi", "name": "Hinjewadi (Phases 1-3)", "vibe": "Self-contained IT township, Infosys/Wipro/TCS campuses", "distance_to_it_hub_km": 1.0, "avg_1bhk_rent": 12500, "avg_2bhk_shared_rent": 9000, "avg_pg_rent": 8000, "safety_score": 88, "connectivity_score": 82, "lifestyle_score": 83, "best_suited_for": "Engineers working inside Hinjewadi IT park" },
      { "id": "kharadi", "name": "Kharadi (EON Free Zone)", "vibe": "East Pune IT nexus (Barclays, Credit Suisse, UBS)", "distance_to_it_hub_km": 1.5, "avg_1bhk_rent": 16000, "avg_2bhk_shared_rent": 11500, "avg_pg_rent": 9500, "safety_score": 90, "connectivity_score": 87, "lifestyle_score": 90, "best_suited_for": "Finance & software techies at EON" }
    ]
  },
  "chennai": {
    "id": "chennai",
    "name": "Chennai",
    "state": "Tamil Nadu",
    "tier": "Tier 1 (SaaS Hub)",
    "tagline": "SaaS & Automotive Gateway",
    "short_desc": "Coastal tech fortress with deep cultural roots, expansive OMR IT highway, and sensible rentals.",
    "tech_hubs": ["OMR", "TIDEL Park", "DLF Cybercity Porur", "Siruseri SIPCOT"],
    "rent": { "pg": 8000, "1bhk": 13000, "2bhk_shared": 9000, "2bhk_private": 21000, "3bhk_shared": 7500 },
    "food": { "basic": 4200, "moderate": 6800, "premium": 10800 },
    "transport": { "basic": 1400, "moderate": 3000, "premium": 5800 },
    "utilities": 2000,
    "internet_phone": 899,
    "subscriptions": 650,
    "discretionary_base": 2400,
    "neighborhoods": [
      { "id": "thoraipakkam", "name": "Thoraipakkam / Perungudi", "vibe": "OMR frontline, TIDEL Park access", "distance_to_it_hub_km": 2.0, "avg_1bhk_rent": 13500, "avg_2bhk_shared_rent": 9500, "avg_pg_rent": 8000, "safety_score": 91, "connectivity_score": 87, "lifestyle_score": 86, "best_suited_for": "SaaS & IT engineers at OMR" },
      { "id": "adyar", "name": "Adyar / Besant Nagar", "vibe": "Tree-lined avenues, beach promenade, cafes", "distance_to_it_hub_km": 7.0, "avg_1bhk_rent": 22000, "avg_2bhk_shared_rent": 15000, "avg_pg_rent": 12000, "safety_score": 96, "connectivity_score": 92, "lifestyle_score": 97, "best_suited_for": "Beachside lifestyle seekers" }
    ]
  },
  "gurugram": {
    "id": "gurugram",
    "name": "Gurugram",
    "state": "Haryana",
    "tier": "Tier 1 (Millennium City)",
    "tagline": "Corporate Powerhouse",
    "short_desc": "Gleaming glass skyscrapers, Cyber Hub, high corporate salaries, and bustling nightlife.",
    "tech_hubs": ["DLF Cyber City", "Golf Course Road", "Golf Course Ext", "Candor TechSpace"],
    "rent": { "pg": 11500, "1bhk": 21000, "2bhk_shared": 14500, "2bhk_private": 34000, "3bhk_shared": 12000 },
    "food": { "basic": 5000, "moderate": 8800, "premium": 14000 },
    "transport": { "basic": 1800, "moderate": 4000, "premium": 7500 },
    "utilities": 3200,
    "internet_phone": 999,
    "subscriptions": 650,
    "discretionary_base": 3400,
    "neighborhoods": [
      { "id": "dlf_cyber", "name": "DLF Phase 1-3 / Cyber City", "vibe": "Rapid Metro, Cyber Hub, builder floors", "distance_to_it_hub_km": 1.0, "avg_1bhk_rent": 24000, "avg_2bhk_shared_rent": 16500, "avg_pg_rent": 13000, "safety_score": 87, "connectivity_score": 96, "lifestyle_score": 97, "best_suited_for": "Cyber City professionals wanting zero commute" },
      { "id": "golf_course", "name": "Golf Course Road", "vibe": "Luxury high rises, 16-lane expressway", "distance_to_it_hub_km": 4.0, "avg_1bhk_rent": 30000, "avg_2bhk_shared_rent": 20000, "avg_pg_rent": 15500, "safety_score": 92, "connectivity_score": 95, "lifestyle_score": 98, "best_suited_for": "Senior leaders and consultants" }
    ]
  },
  "noida": {
    "id": "noida",
    "name": "Noida",
    "state": "Uttar Pradesh",
    "tier": "Tier 1 (NCR IT)",
    "tagline": "Planned High-Rise City",
    "short_desc": "Spacious expressways, planned sectors, modern high-rises, and great cost-to-quality ratio.",
    "tech_hubs": ["Noida Expressway", "Sector 62 IT Hub", "Sector 142 Advant", "Film City"],
    "rent": { "pg": 8500, "1bhk": 14000, "2bhk_shared": 9500, "2bhk_private": 22000, "3bhk_shared": 8000 },
    "food": { "basic": 4400, "moderate": 7200, "premium": 11200 },
    "transport": { "basic": 1500, "moderate": 3200, "premium": 6000 },
    "utilities": 2300,
    "internet_phone": 899,
    "subscriptions": 650,
    "discretionary_base": 2500,
    "neighborhoods": [
      { "id": "sec62", "name": "Sector 62 / 63 IT Cluster", "vibe": "Major IT campus cluster, Blue line metro", "distance_to_it_hub_km": 0.5, "avg_1bhk_rent": 13500, "avg_2bhk_shared_rent": 9000, "avg_pg_rent": 8000, "safety_score": 87, "connectivity_score": 93, "lifestyle_score": 85, "best_suited_for": "Sector 62 developers" },
      { "id": "sec137", "name": "Sector 137 / 142 (Advant)", "vibe": "High-rise towers, Aqua Metro, food street", "distance_to_it_hub_km": 1.0, "avg_1bhk_rent": 14500, "avg_2bhk_shared_rent": 10000, "avg_pg_rent": 8500, "safety_score": 90, "connectivity_score": 89, "lifestyle_score": 88, "best_suited_for": "Expressway techies" }
    ]
  },
  "kolkata": {
    "id": "kolkata",
    "name": "Kolkata",
    "state": "West Bengal",
    "tier": "Tier 1 (Cultural Capital)",
    "tagline": "City of Joy & Highest Savings",
    "short_desc": "City of Joy with the lowest cost of living among metros, heritage trams, and great IT parks.",
    "tech_hubs": ["Salt Lake Sector V", "New Town Action Area 1-3", "Rajarhat"],
    "rent": { "pg": 6500, "1bhk": 10500, "2bhk_shared": 7500, "2bhk_private": 17000, "3bhk_shared": 6000 },
    "food": { "basic": 3800, "moderate": 6000, "premium": 9500 },
    "transport": { "basic": 1100, "moderate": 2400, "premium": 4800 },
    "utilities": 1800,
    "internet_phone": 799,
    "subscriptions": 650,
    "discretionary_base": 2000,
    "neighborhoods": [
      { "id": "sector_v", "name": "Salt Lake (Sector V)", "vibe": "IT heartland, Wipro/TCS complexes, Green Line metro", "distance_to_it_hub_km": 0.5, "avg_1bhk_rent": 11500, "avg_2bhk_shared_rent": 8000, "avg_pg_rent": 7000, "safety_score": 93, "connectivity_score": 94, "lifestyle_score": 87, "best_suited_for": "Salt lake IT engineers" },
      { "id": "new_town", "name": "New Town (Action Area 1)", "vibe": "Eco Park, wide boulevards, IT SEZs", "distance_to_it_hub_km": 2.5, "avg_1bhk_rent": 11000, "avg_2bhk_shared_rent": 7500, "avg_pg_rent": 6500, "safety_score": 92, "connectivity_score": 88, "lifestyle_score": 89, "best_suited_for": "Modern flat seekers" }
    ]
  },
  "ahmedabad": {
    "id": "ahmedabad",
    "name": "Ahmedabad",
    "state": "Gujarat",
    "tier": "Tier 1 (Enterprise & GIFT City)",
    "tagline": "GIFT City & Entrepreneurial Fortress",
    "short_desc": "Thriving entrepreneurial city, international finance hub (GIFT City), peaceful, and ultra-affordable.",
    "tech_hubs": ["GIFT City", "SG Highway", "Sindhu Bhavan Road", "Science City"],
    "rent": { "pg": 7000, "1bhk": 11000, "2bhk_shared": 8000, "2bhk_private": 18000, "3bhk_shared": 6500 },
    "food": { "basic": 3900, "moderate": 6200, "premium": 9800 },
    "transport": { "basic": 1200, "moderate": 2600, "premium": 5000 },
    "utilities": 1900,
    "internet_phone": 799,
    "subscriptions": 650,
    "discretionary_base": 2100,
    "neighborhoods": [
      { "id": "prahlad_nagar", "name": "Prahlad Nagar / SG Highway", "vibe": "Prime commercial street, high-end restaurants", "distance_to_it_hub_km": 1.0, "avg_1bhk_rent": 14000, "avg_2bhk_shared_rent": 9500, "avg_pg_rent": 8000, "safety_score": 96, "connectivity_score": 93, "lifestyle_score": 94, "best_suited_for": "Corporate executives & IT professionals on SG Highway" },
      { "id": "gift_city", "name": "GIFT City Vicinity", "vibe": "India's first smart city, zero traffic, wide greenery", "distance_to_it_hub_km": 1.0, "avg_1bhk_rent": 12000, "avg_2bhk_shared_rent": 8500, "avg_pg_rent": 7000, "safety_score": 98, "connectivity_score": 88, "lifestyle_score": 86, "best_suited_for": "Fintech & global banking specialists" }
    ]
  }
};
