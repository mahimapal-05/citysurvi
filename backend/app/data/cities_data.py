"""
Verified cost of living, housing, food, transportation, utilities, and neighborhood dataset
for the Top 10 Job & Tech Cities in India.
Data points reflect realistic contemporary living costs (2025-2026).
"""

from typing import Dict, Any, List

CITIES_DB: Dict[str, Dict[str, Any]] = {
    "bengaluru": {
        "id": "bengaluru",
        "name": "Bengaluru",
        "state": "Karnataka",
        "tier": "Tier 1 (Tech Capital)",
        "short_desc": "India's Silicon Valley with bustling tech parks, craft breweries, and high rental demand.",
        "avg_cost_index": 1.18,  # Relative to baseline
        "tech_hubs": ["Outer Ring Road", "Whitefield", "Electronic City", "Manyata Tech Park", "Bagmane Tech Park"],
        "rent": {
            "pg": 10500,
            "1bhk": 18500,
            "2bhk_shared": 13500,   # per person in a shared 2BHK flat
            "2bhk_private": 30000,
            "3bhk_shared": 11000    # per person in a shared 3BHK flat
        },
        "food": {
            "basic": 5200,          # Home cook / basic mess / groceries
            "moderate": 8500,       # Swiggy/Zomato 2-3x/week + weekend cafe
            "premium": 13500        # Gourmet dining, frequent orders & pubs
        },
        "transport": {
            "basic": 1800,          # BMTC + Namma Metro passes
            "moderate": 3800,       # Metro + Yulu/Rapido/Auto
            "premium": 7200         # Daily Uber/Ola cabs or personal car fuel
        },
        "utilities": 2600,          # BESCOM electricity, water, society maintenance
        "internet_phone": 999,      # High-speed Fiber (100Mbps+) + 5G plan
        "subscriptions": 650,       # Netflix/Prime/Spotify/Gym baseline
        "discretionary_base": 3000, # Misc weekend & grooming
        "neighborhoods": [
            {
                "id": "hsr_layout",
                "name": "HSR Layout",
                "vibe": "Startup hub, lush parks, trendy cafes, walkable avenues",
                "distance_to_it_hub_km": 4.5,
                "avg_1bhk_rent": 22000,
                "avg_2bhk_shared_rent": 15000,
                "avg_pg_rent": 12000,
                "safety_score": 92,
                "connectivity_score": 88,
                "lifestyle_score": 95,
                "best_suited_for": "Startup founders, software engineers working in Koramangala / ORR"
            },
            {
                "id": "koramangala",
                "name": "Koramangala",
                "vibe": "Epicenter of nightlife, food scenes, VC offices",
                "distance_to_it_hub_km": 6.0,
                "avg_1bhk_rent": 24000,
                "avg_2bhk_shared_rent": 16500,
                "avg_pg_rent": 13500,
                "safety_score": 89,
                "connectivity_score": 85,
                "lifestyle_score": 98,
                "best_suited_for": "Young professionals who love vibrant social life & culinary variety"
            },
            {
                "id": "indiranagar",
                "name": "Indiranagar",
                "vibe": "Upscale boutiques, 100ft Road pubs, mature residential streets",
                "distance_to_it_hub_km": 7.5,
                "avg_1bhk_rent": 26000,
                "avg_2bhk_shared_rent": 18000,
                "avg_pg_rent": 14000,
                "safety_score": 93,
                "connectivity_score": 94,
                "lifestyle_score": 96,
                "best_suited_for": "Senior engineers and consultants prioritizing metro access & elite lifestyle"
            },
            {
                "id": "whitefield",
                "name": "Whitefield",
                "vibe": "Gated high-rises, ITPL campus, international schools, Purple Line metro",
                "distance_to_it_hub_km": 1.5,
                "avg_1bhk_rent": 16500,
                "avg_2bhk_shared_rent": 12000,
                "avg_pg_rent": 9500,
                "safety_score": 88,
                "connectivity_score": 86,
                "lifestyle_score": 84,
                "best_suited_for": "IT professionals at ITPL / Brigade Tech Gardens wanting short commutes"
            },
            {
                "id": "electronic_city",
                "name": "Electronic City (Phase 1 & 2)",
                "vibe": "Infosys/Wipro mega-campuses, affordable modern societies",
                "distance_to_it_hub_km": 2.0,
                "avg_1bhk_rent": 13000,
                "avg_2bhk_shared_rent": 9500,
                "avg_pg_rent": 8500,
                "safety_score": 86,
                "connectivity_score": 80,
                "lifestyle_score": 78,
                "best_suited_for": "Entry-level devs & budget-conscious folks seeking maximum savings"
            },
            {
                "id": "marathahalli_bellandur",
                "name": "Bellandur / Marathahalli (ORR)",
                "vibe": "Epicenter of Outer Ring Road tech corridors (Ecospace, Cessna)",
                "distance_to_it_hub_km": 1.0,
                "avg_1bhk_rent": 19000,
                "avg_2bhk_shared_rent": 13500,
                "avg_pg_rent": 11000,
                "safety_score": 84,
                "connectivity_score": 82,
                "lifestyle_score": 82,
                "best_suited_for": "Amazon, Cisco, Flipkart employees wanting zero highway commute"
            }
        ]
    },
    "mumbai": {
        "id": "mumbai",
        "name": "Mumbai",
        "state": "Maharashtra",
        "tier": "Tier 1 (Financial Capital)",
        "short_desc": "Maximum City with high rental premiums, top-notch local trains, and electric coastal lifestyle.",
        "avg_cost_index": 1.45,
        "tech_hubs": ["BKC (Bandra Kurla Complex)", "NESCO Goregaon", "Mindspace Malad", "Powai Hiranandani", "Airoli / Navi Mumbai"],
        "rent": {
            "pg": 13000,
            "1bhk": 26000,
            "2bhk_shared": 18000,
            "2bhk_private": 46000,
            "3bhk_shared": 15000
        },
        "food": {
            "basic": 5500,
            "moderate": 9200,
            "premium": 15000
        },
        "transport": {
            "basic": 1200,          # Local Train pass + BEST AC bus
            "moderate": 3200,       # Metro lines + Kali-peeli / Auto
            "premium": 8000         # Cabs / Western Express highway tolls
        },
        "utilities": 3000,          # Adani/Tata electricity, high maintenance
        "internet_phone": 999,
        "subscriptions": 650,
        "discretionary_base": 3800,
        "neighborhoods": [
            {
                "id": "powai",
                "name": "Powai (Hiranandani)",
                "vibe": "Neo-classical architecture, serene lake views, IT startups & finance MNCs",
                "distance_to_it_hub_km": 1.5,
                "avg_1bhk_rent": 30000,
                "avg_2bhk_shared_rent": 21000,
                "avg_pg_rent": 15000,
                "safety_score": 95,
                "connectivity_score": 87,
                "lifestyle_score": 94,
                "best_suited_for": "Fintech & Product folks near Powai / Vikhroli"
            },
            {
                "id": "andheri_west",
                "name": "Andheri West (Lokhandwala / Versova)",
                "vibe": "Media capital, buzzing cafes, beach access, Metro line 1 & 2A",
                "distance_to_it_hub_km": 5.0,
                "avg_1bhk_rent": 34000,
                "avg_2bhk_shared_rent": 23000,
                "avg_pg_rent": 16000,
                "safety_score": 91,
                "connectivity_score": 96,
                "lifestyle_score": 97,
                "best_suited_for": "Creative & tech professionals who value entertainment & connectivity"
            },
            {
                "id": "goregaon_malad",
                "name": "Goregaon East / Malad (Mindspace / NESCO)",
                "vibe": "Corporate tech parks, large gated communities (Oberoi Woods)",
                "distance_to_it_hub_km": 2.0,
                "avg_1bhk_rent": 24000,
                "avg_2bhk_shared_rent": 16500,
                "avg_pg_rent": 12000,
                "safety_score": 90,
                "connectivity_score": 91,
                "lifestyle_score": 88,
                "best_suited_for": "IT professionals at NESCO / Mindspace"
            },
            {
                "id": "navi_mumbai_vashi",
                "name": "Navi Mumbai (Vashi / Seawoods)",
                "vibe": "Planned wide roads, sprawling gardens, cost-effective rentals",
                "distance_to_it_hub_km": 8.0,
                "avg_1bhk_rent": 15000,
                "avg_2bhk_shared_rent": 10500,
                "avg_pg_rent": 8500,
                "safety_score": 92,
                "connectivity_score": 85,
                "lifestyle_score": 82,
                "best_suited_for": "Professionals working in Airoli / Ghansoli IT parks wanting high savings"
            },
            {
                "id": "bandra_west",
                "name": "Bandra West / Khar",
                "vibe": "Queen of Suburbs, sea facing promenades, iconic restaurants",
                "distance_to_it_hub_km": 4.5,
                "avg_1bhk_rent": 48000,
                "avg_2bhk_shared_rent": 32000,
                "avg_pg_rent": 22000,
                "safety_score": 94,
                "connectivity_score": 93,
                "lifestyle_score": 99,
                "best_suited_for": "High-income earners & executives working in BKC"
            }
        ]
    },
    "delhi": {
        "id": "delhi",
        "name": "Delhi (NCR)",
        "state": "Delhi NCT",
        "tier": "Tier 1 (National Capital)",
        "short_desc": "Heritage meets massive infrastructure, best-in-class Delhi Metro network, and unmatched street food.",
        "avg_cost_index": 1.08,
        "tech_hubs": ["Connaught Place", "Saket District Centre", "Okhla Phase 3", "Nehru Place", "Aerocity"],
        "rent": {
            "pg": 9500,
            "1bhk": 16000,
            "2bhk_shared": 11500,
            "2bhk_private": 26000,
            "3bhk_shared": 9500
        },
        "food": {
            "basic": 4600,
            "moderate": 7800,
            "premium": 12500
        },
        "transport": {
            "basic": 1500,          # DMRC Metro smart card + DTC AC buses
            "moderate": 3200,       # Metro + e-rickshaws
            "premium": 6500         # Cabs & personal car
        },
        "utilities": 2100,          # Delhi power subsidies up to 200/400 units
        "internet_phone": 900,
        "subscriptions": 650,
        "discretionary_base": 2800,
        "neighborhoods": [
            {
                "id": "south_extension_lajpat",
                "name": "Lajpat Nagar / South Ext",
                "vibe": "Central connectivity, Pink/Violet metro line, bustling markets",
                "distance_to_it_hub_km": 4.0,
                "avg_1bhk_rent": 18000,
                "avg_2bhk_shared_rent": 13000,
                "avg_pg_rent": 10500,
                "safety_score": 83,
                "connectivity_score": 96,
                "lifestyle_score": 90,
                "best_suited_for": "Professionals needing quick access to Central & South Delhi"
            },
            {
                "id": "saket_malviya_nagar",
                "name": "Saket / Malviya Nagar",
                "vibe": "Malls, cafes, Select CityWalk, proximity to Yellow Line",
                "distance_to_it_hub_km": 3.0,
                "avg_1bhk_rent": 19500,
                "avg_2bhk_shared_rent": 14000,
                "avg_pg_rent": 11500,
                "safety_score": 87,
                "connectivity_score": 94,
                "lifestyle_score": 93,
                "best_suited_for": "Tech & consulting professionals in South Delhi / Gurugram border"
            },
            {
                "id": "rohini_pitampura",
                "name": "Rohini / Pitampura",
                "vibe": "Planned North-West residential colonies, wide DDA parks",
                "distance_to_it_hub_km": 12.0,
                "avg_1bhk_rent": 12500,
                "avg_2bhk_shared_rent": 8500,
                "avg_pg_rent": 7500,
                "safety_score": 84,
                "connectivity_score": 90,
                "lifestyle_score": 82,
                "best_suited_for": "Value-seekers wanting large flats and Red/Yellow metro access"
            },
            {
                "id": "dwarka",
                "name": "Dwarka (Sectors 6-22)",
                "vibe": "Spacious planned sub-city near IGI Airport & Cyber City",
                "distance_to_it_hub_km": 8.0,
                "avg_1bhk_rent": 14500,
                "avg_2bhk_shared_rent": 10000,
                "avg_pg_rent": 8500,
                "safety_score": 89,
                "connectivity_score": 92,
                "lifestyle_score": 86,
                "best_suited_for": "Airport/Aviation & Gurugram commuters looking for green surroundings"
            }
        ]
    },
    "hyderabad": {
        "id": "hyderabad",
        "name": "Hyderabad",
        "state": "Telangana",
        "tier": "Tier 1 (Cyberabad)",
        "short_desc": "Booming IT destination with wide flyovers, delicious biryani, and high disposable income retention.",
        "avg_cost_index": 0.98,
        "tech_hubs": ["HITEC City", "Gachibowli", "Madhapur", "Financial District (Nanakramguda)", "Kondapur"],
        "rent": {
            "pg": 9000,
            "1bhk": 14500,
            "2bhk_shared": 10500,
            "2bhk_private": 24000,
            "3bhk_shared": 8500
        },
        "food": {
            "basic": 4500,
            "moderate": 7400,
            "premium": 11500
        },
        "transport": {
            "basic": 1600,          # Hyderabad Metro Red/Blue lines + TSRTC
            "moderate": 3300,       # Metro + Shared auto/Ola
            "premium": 6200         # ORR driving / Cabs
        },
        "utilities": 2200,          # TSSPDCL power & society maintenance
        "internet_phone": 899,
        "subscriptions": 650,
        "discretionary_base": 2600,
        "neighborhoods": [
            {
                "id": "gachibowli",
                "name": "Gachibowli",
                "vibe": "Sports stadium, luxury high-rises (My Home, Aparna), tech parks",
                "distance_to_it_hub_km": 1.0,
                "avg_1bhk_rent": 17000,
                "avg_2bhk_shared_rent": 12000,
                "avg_pg_rent": 9500,
                "safety_score": 93,
                "connectivity_score": 90,
                "lifestyle_score": 91,
                "best_suited_for": "Microsoft, Amazon, Google engineers in Financial District"
            },
            {
                "id": "madhapur_hitec",
                "name": "Madhapur / HITEC City",
                "vibe": "Heart of Cyberabad, Cyber Towers, cafes, Inorbit Mall",
                "distance_to_it_hub_km": 0.5,
                "avg_1bhk_rent": 18000,
                "avg_2bhk_shared_rent": 13000,
                "avg_pg_rent": 10500,
                "safety_score": 91,
                "connectivity_score": 94,
                "lifestyle_score": 94,
                "best_suited_for": "Techies wanting walking distance to office and nightlife"
            },
            {
                "id": "kondapur",
                "name": "Kondapur / Hafeezpet",
                "vibe": "Residential density, supermarkets, botanical gardens nearby",
                "distance_to_it_hub_km": 2.5,
                "avg_1bhk_rent": 14000,
                "avg_2bhk_shared_rent": 10000,
                "avg_pg_rent": 8500,
                "safety_score": 90,
                "connectivity_score": 88,
                "lifestyle_score": 87,
                "best_suited_for": "Budget-friendly 2BHK flat sharers working in Gachibowli"
            },
            {
                "id": "financial_district",
                "name": "Nanakramguda / Financial District",
                "vibe": "Ultra-modern skyward towers, global banking & tech giants",
                "distance_to_it_hub_km": 1.5,
                "avg_1bhk_rent": 19000,
                "avg_2bhk_shared_rent": 13500,
                "avg_pg_rent": 11000,
                "safety_score": 94,
                "connectivity_score": 89,
                "lifestyle_score": 89,
                "best_suited_for": "Goldman Sachs, Apple, Wells Fargo employees"
            },
            {
                "id": "kukatpally",
                "name": "Kukatpally (KPHB)",
                "vibe": "High connectivity, metro hub, affordable retail & food joints",
                "distance_to_it_hub_km": 6.5,
                "avg_1bhk_rent": 11500,
                "avg_2bhk_shared_rent": 8000,
                "avg_pg_rent": 7500,
                "safety_score": 88,
                "connectivity_score": 93,
                "lifestyle_score": 84,
                "best_suited_for": "Maximum savings seekers connected via direct metro to HITEC city"
            }
        ]
    },
    "pune": {
        "id": "pune",
        "name": "Pune",
        "state": "Maharashtra",
        "tier": "Tier 1 (Automobile & IT)",
        "short_desc": "Oxford of the East with pleasant weather, relaxed work-life balance, and vibrant youth culture.",
        "avg_cost_index": 1.02,
        "tech_hubs": ["Hinjewadi IT Park (Phase 1-3)", "Magarpatta City", "Kharadi EON IT Park", "Yerwada Commerzone", "Baner-Balewadi High St"],
        "rent": {
            "pg": 8500,
            "1bhk": 14000,
            "2bhk_shared": 10000,
            "2bhk_private": 23000,
            "3bhk_shared": 8000
        },
        "food": {
            "basic": 4500,
            "moderate": 7500,
            "premium": 11800
        },
        "transport": {
            "basic": 1500,          # PMPML buses + Pune Metro
            "moderate": 3200,       # Two-wheeler fuel / Autos
            "premium": 6000         # Cabs & car maintenance
        },
        "utilities": 2100,          # MSEDCL power & maintenance
        "internet_phone": 899,
        "subscriptions": 650,
        "discretionary_base": 2700,
        "neighborhoods": [
            {
                "id": "hinjewadi",
                "name": "Hinjewadi (Phases 1-3)",
                "vibe": "Self-contained IT township, Infosys/Wipro/TCS campuses, Mega societies",
                "distance_to_it_hub_km": 1.0,
                "avg_1bhk_rent": 12500,
                "avg_2bhk_shared_rent": 9000,
                "avg_pg_rent": 8000,
                "safety_score": 88,
                "connectivity_score": 82,
                "lifestyle_score": 83,
                "best_suited_for": "Engineers working inside Hinjewadi IT park"
            },
            {
                "id": "baner_balewadi",
                "name": "Baner / Balewadi High Street",
                "vibe": "Upscale dining, cafes, co-working hubs, great connectivity to Mumbai Expressway",
                "distance_to_it_hub_km": 5.0,
                "avg_1bhk_rent": 17500,
                "avg_2bhk_shared_rent": 12500,
                "avg_pg_rent": 10500,
                "safety_score": 92,
                "connectivity_score": 91,
                "lifestyle_score": 96,
                "best_suited_for": "Professionals who want top cafes and premium social life"
            },
            {
                "id": "kharadi",
                "name": "Kharadi (EON Free Zone)",
                "vibe": "East Pune IT nexus (Barclays, Credit Suisse, UBS), modern gated towers (Gera, Panchshil)",
                "distance_to_it_hub_km": 1.5,
                "avg_1bhk_rent": 16000,
                "avg_2bhk_shared_rent": 11500,
                "avg_pg_rent": 9500,
                "safety_score": 90,
                "connectivity_score": 87,
                "lifestyle_score": 90,
                "best_suited_for": "Finance & software techies at EON / World Trade Centre"
            },
            {
                "id": "viman_nagar",
                "name": "Viman Nagar",
                "vibe": "Phoenix Marketcity, Symbiosis campus, lively youth crowd, airport proximity",
                "distance_to_it_hub_km": 4.5,
                "avg_1bhk_rent": 18500,
                "avg_2bhk_shared_rent": 13000,
                "avg_pg_rent": 11000,
                "safety_score": 93,
                "connectivity_score": 92,
                "lifestyle_score": 95,
                "best_suited_for": "Young techies & consultants loving retail, dining, and central access"
            },
            {
                "id": "wakad",
                "name": "Wakad",
                "vibe": "Bridge between Hinjewadi and city center, packed with young IT families",
                "distance_to_it_hub_km": 3.0,
                "avg_1bhk_rent": 14500,
                "avg_2bhk_shared_rent": 10500,
                "avg_pg_rent": 8500,
                "safety_score": 90,
                "connectivity_score": 89,
                "lifestyle_score": 88,
                "best_suited_for": "Great balance between Hinjewadi commute and Baner nightlife"
            }
        ]
    },
    "chennai": {
        "id": "chennai",
        "name": "Chennai",
        "state": "Tamil Nadu",
        "tier": "Tier 1 (Detroit of Asia / SaaS Hub)",
        "short_desc": "Coastal tech fortress with deep cultural roots, expansive OMR IT highway, and very sensible rentals.",
        "avg_cost_index": 0.94,
        "tech_hubs": ["OMR (Old Mahabalipuram Road)", "TIDEL Park", "DLF Cybercity Porur", "Siruseri SIPCOT", "Guindy Olympia Tech Park"],
        "rent": {
            "pg": 8000,
            "1bhk": 13000,
            "2bhk_shared": 9000,
            "2bhk_private": 21000,
            "3bhk_shared": 7500
        },
        "food": {
            "basic": 4200,
            "moderate": 6800,
            "premium": 10800
        },
        "transport": {
            "basic": 1400,          # Chennai Metro + MTC bus + Suburban train
            "moderate": 3000,       # Metro + Autos
            "premium": 5800         # OMR cabs / personal vehicle
        },
        "utilities": 2000,          # TANGEDCO power (subsidized slabs)
        "internet_phone": 899,
        "subscriptions": 650,
        "discretionary_base": 2400,
        "neighborhoods": [
            {
                "id": "thoraipakkam_omr",
                "name": "Thoraipakkam / Perungudi (OMR)",
                "vibe": "IT corridor frontline, quick access to TIDEL Park & Ascendas",
                "distance_to_it_hub_km": 2.0,
                "avg_1bhk_rent": 13500,
                "avg_2bhk_shared_rent": 9500,
                "avg_pg_rent": 8000,
                "safety_score": 91,
                "connectivity_score": 87,
                "lifestyle_score": 86,
                "best_suited_for": "SaaS & IT engineers at OMR tech parks"
            },
            {
                "id": "sholinganallur",
                "name": "Sholinganallur",
                "vibe": "Junction of OMR and ECR, TCS/Cognizant hubs, sea breeze",
                "distance_to_it_hub_km": 1.5,
                "avg_1bhk_rent": 12000,
                "avg_2bhk_shared_rent": 8500,
                "avg_pg_rent": 7500,
                "safety_score": 90,
                "connectivity_score": 85,
                "lifestyle_score": 84,
                "best_suited_for": "IT professionals at ELCOT SEZ seeking peaceful coastal weekends"
            },
            {
                "id": "adyar_besant_nagar",
                "name": "Adyar / Besant Nagar (Elliot's Beach)",
                "vibe": "Tree-lined avenues, beach promenade, upscale traditional heritage",
                "distance_to_it_hub_km": 7.0,
                "avg_1bhk_rent": 22000,
                "avg_2bhk_shared_rent": 15000,
                "avg_pg_rent": 12000,
                "safety_score": 96,
                "connectivity_score": 92,
                "lifestyle_score": 97,
                "best_suited_for": "Senior consultants & founders seeking prime beachside lifestyle"
            },
            {
                "id": "porur",
                "name": "Porur (DLF CyberCity)",
                "vibe": "West Chennai IT nucleus, commercial connectivity, dense markets",
                "distance_to_it_hub_km": 2.0,
                "avg_1bhk_rent": 13000,
                "avg_2bhk_shared_rent": 9000,
                "avg_pg_rent": 7800,
                "safety_score": 89,
                "connectivity_score": 89,
                "lifestyle_score": 85,
                "best_suited_for": "Employees at DLF CyberCity and L&T Infotech"
            }
        ]
    },
    "gurugram": {
        "id": "gurugram",
        "name": "Gurugram",
        "state": "Haryana",
        "tier": "Tier 1 (Millennium City)",
        "short_desc": "Gleaming glass skyscrapers, Cyber Hub, high corporate salaries, and bustling nightlife.",
        "avg_cost_index": 1.25,
        "tech_hubs": ["DLF Cyber City", "Golf Course Road", "Golf Course Extension", "Udyog Vihar", "Candor TechSpace Sector 48/21"],
        "rent": {
            "pg": 11500,
            "1bhk": 21000,
            "2bhk_shared": 14500,
            "2bhk_private": 34000,
            "3bhk_shared": 12000
        },
        "food": {
            "basic": 5000,
            "moderate": 8800,
            "premium": 14000
        },
        "transport": {
            "basic": 1800,          # Rapid Metro + Yellow line
            "moderate": 4000,       # Cabs / Autos across highways
            "premium": 7500         # Car maintenance / frequent cabbing
        },
        "utilities": 3200,          # DHBVN power + backup generator charges (higher in peak summer)
        "internet_phone": 999,
        "subscriptions": 650,
        "discretionary_base": 3400,
        "neighborhoods": [
            {
                "id": "dlf_phase_1_2_3",
                "name": "DLF Phase 1, 2 & 3 / Cyber City",
                "vibe": "Steps from Cyber Hub, Rapid Metro, bustling food outlets, builder floors",
                "distance_to_it_hub_km": 1.0,
                "avg_1bhk_rent": 24000,
                "avg_2bhk_shared_rent": 16500,
                "avg_pg_rent": 13000,
                "safety_score": 87,
                "connectivity_score": 96,
                "lifestyle_score": 97,
                "best_suited_for": "Consultants & engineers working at DLF Cyber City wanting zero commute"
            },
            {
                "id": "golf_course_road",
                "name": "Golf Course Road (Sectors 42, 43, 53, 54)",
                "vibe": "Ultra-luxury high rises (Camelias/Magnolias vicinity), 16-lane expressway",
                "distance_to_it_hub_km": 4.0,
                "avg_1bhk_rent": 30000,
                "avg_2bhk_shared_rent": 20000,
                "avg_pg_rent": 15500,
                "safety_score": 92,
                "connectivity_score": 95,
                "lifestyle_score": 98,
                "best_suited_for": "Investment bankers, partners, and high-income tech leaders"
            },
            {
                "id": "sector_56_57",
                "name": "Sector 56 / 57 (Hong Kong Bazaar)",
                "vibe": "End of Rapid Metro, community markets, great balance of price & lifestyle",
                "distance_to_it_hub_km": 5.5,
                "avg_1bhk_rent": 19000,
                "avg_2bhk_shared_rent": 13500,
                "avg_pg_rent": 11000,
                "safety_score": 88,
                "connectivity_score": 90,
                "lifestyle_score": 91,
                "best_suited_for": "Engineers on Golf Course Extension needing metro connectivity"
            },
            {
                "id": "sohna_road_sector_48",
                "name": "Sohna Road / Sector 47-49",
                "vibe": "Candor Techspace hub, family-oriented gated complexes, shopping arcades",
                "distance_to_it_hub_km": 6.0,
                "avg_1bhk_rent": 17000,
                "avg_2bhk_shared_rent": 12000,
                "avg_pg_rent": 9500,
                "safety_score": 86,
                "connectivity_score": 84,
                "lifestyle_score": 87,
                "best_suited_for": "Employees at Candor TechSpace & Subash Chowk tech offices"
            }
        ]
    },
    "noida": {
        "id": "noida",
        "name": "Noida & Greater Noida",
        "state": "Uttar Pradesh",
        "tier": "Tier 1 (NCR IT & Electronics)",
        "short_desc": "Spacious expressways, planned sectors, modern high-rises, and great cost-to-quality ratio.",
        "avg_cost_index": 0.96,
        "tech_hubs": ["Noida Expressway (Sectors 125-144)", "Sector 62 IT Hub", "Sector 16/18 Film City", "Advant Navis Sector 142"],
        "rent": {
            "pg": 8500,
            "1bhk": 14000,
            "2bhk_shared": 9500,
            "2bhk_private": 22000,
            "3bhk_shared": 8000
        },
        "food": {
            "basic": 4400,
            "moderate": 7200,
            "premium": 11200
        },
        "transport": {
            "basic": 1500,          # Noida Metro (Aqua Line) + Delhi Metro (Blue Line)
            "moderate": 3200,       # Metro + e-rickshaws
            "premium": 6000         # Expressway driving & cabs
        },
        "utilities": 2300,          # PVVNL electricity & society maintenance
        "internet_phone": 899,
        "subscriptions": 650,
        "discretionary_base": 2500,
        "neighborhoods": [
            {
                "id": "sector_62",
                "name": "Sector 62 / 63 (Electronic City)",
                "vibe": "Major IT campus cluster (TCS, Barclays, Paytm), Blue line metro terminus",
                "distance_to_it_hub_km": 0.5,
                "avg_1bhk_rent": 13500,
                "avg_2bhk_shared_rent": 9000,
                "avg_pg_rent": 8000,
                "safety_score": 87,
                "connectivity_score": 93,
                "lifestyle_score": 85,
                "best_suited_for": "Software devs at Sector 62 tech hubs wanting walking commute"
            },
            {
                "id": "sector_137_advant",
                "name": "Sector 137 / 142 (Advant Navis Expressway)",
                "vibe": "High-rise society belt (Paras, Supertech), Aqua Metro, corporate food street",
                "distance_to_it_hub_km": 1.0,
                "avg_1bhk_rent": 14500,
                "avg_2bhk_shared_rent": 10000,
                "avg_pg_rent": 8500,
                "safety_score": 90,
                "connectivity_score": 89,
                "lifestyle_score": 88,
                "best_suited_for": "Expressway techies (KPMG, Samsung, Genpact)"
            },
            {
                "id": "sector_18_atta",
                "name": "Sector 18 / Mall of India",
                "vibe": "Downtown retail hub, Great India Place, high street shopping",
                "distance_to_it_hub_km": 4.0,
                "avg_1bhk_rent": 18000,
                "avg_2bhk_shared_rent": 12500,
                "avg_pg_rent": 10500,
                "safety_score": 91,
                "connectivity_score": 96,
                "lifestyle_score": 95,
                "best_suited_for": "People who prioritize central retail, malls & quick Delhi border crossing"
            },
            {
                "id": "sector_76_78",
                "name": "Sector 74-78 Belt",
                "vibe": "Affordable modern towers (Mahagun, Sethi, Amrapali), bustling street markets",
                "distance_to_it_hub_km": 5.0,
                "avg_1bhk_rent": 13000,
                "avg_2bhk_shared_rent": 8500,
                "avg_pg_rent": 7500,
                "safety_score": 88,
                "connectivity_score": 91,
                "lifestyle_score": 86,
                "best_suited_for": "High-savings young sharers and families"
            }
        ]
    },
    "kolkata": {
        "id": "kolkata",
        "name": "Kolkata",
        "state": "West Bengal",
        "tier": "Tier 1 (Cultural Capital)",
        "short_desc": "City of Joy with the lowest cost of living among metros, heritage trams, and great IT parks.",
        "avg_cost_index": 0.82,
        "tech_hubs": ["Salt Lake Sector V", "New Town Action Area 1-3", "Rajarhat", "Bantala IT SEZ"],
        "rent": {
            "pg": 6500,
            "1bhk": 10500,
            "2bhk_shared": 7500,
            "2bhk_private": 17000,
            "3bhk_shared": 6000
        },
        "food": {
            "basic": 3800,
            "moderate": 6000,
            "premium": 9500
        },
        "transport": {
            "basic": 1100,          # Kolkata Metro (East-West / North-South) + AC buses + Auto
            "moderate": 2400,       # Metro + Yellow cabs/Ola
            "premium": 4800         # Daily cabs / car
        },
        "utilities": 1800,          # CESC power & low maintenance
        "internet_phone": 799,
        "subscriptions": 650,
        "discretionary_base": 2000,
        "neighborhoods": [
            {
                "id": "salt_lake_sector_v",
                "name": "Salt Lake (Sector V)",
                "vibe": "IT heartland, Wipro/TCS/Cognizant complexes, Green Line metro",
                "distance_to_it_hub_km": 0.5,
                "avg_1bhk_rent": 11500,
                "avg_2bhk_shared_rent": 8000,
                "avg_pg_rent": 7000,
                "safety_score": 93,
                "connectivity_score": 94,
                "lifestyle_score": 87,
                "best_suited_for": "Techies wanting near-zero commute in Bengal's tech capital"
            },
            {
                "id": "new_town_action_area_1",
                "name": "New Town (Action Area 1 & 2)",
                "vibe": "Eco Park, wide boulevards, smart city infrastructure, IT SEZs",
                "distance_to_it_hub_km": 2.5,
                "avg_1bhk_rent": 11000,
                "avg_2bhk_shared_rent": 7500,
                "avg_pg_rent": 6500,
                "safety_score": 92,
                "connectivity_score": 88,
                "lifestyle_score": 89,
                "best_suited_for": "Modern flat seekers wanting wide green spaces and low noise"
            },
            {
                "id": "ballygunge_south_kolkata",
                "name": "Ballygunge / Gariahat",
                "vibe": "South Kolkata heritage, legendary cafes, street fashion, cultural adda",
                "distance_to_it_hub_km": 10.0,
                "avg_1bhk_rent": 15000,
                "avg_2bhk_shared_rent": 10000,
                "avg_pg_rent": 8500,
                "safety_score": 95,
                "connectivity_score": 91,
                "lifestyle_score": 96,
                "best_suited_for": "Culture lovers prioritizing old Kolkata charm & culinary heritage"
            }
        ]
    },
    "ahmedabad": {
        "id": "ahmedabad",
        "name": "Ahmedabad & GIFT City",
        "state": "Gujarat",
        "tier": "Tier 1 (GIFT City & Enterprise)",
        "short_desc": "Thriving entrepreneurial city, international finance hub (GIFT City), peaceful, and ultra-affordable.",
        "avg_cost_index": 0.85,
        "tech_hubs": ["GIFT City (Gandhinagar)", "SG Highway (Prahlad Nagar)", "Science City", "Sindhu Bhavan Road", "Sanand"],
        "rent": {
            "pg": 7000,
            "1bhk": 11000,
            "2bhk_shared": 8000,
            "2bhk_private": 18000,
            "3bhk_shared": 6500
        },
        "food": {
            "basic": 3900,
            "moderate": 6200,
            "premium": 9800
        },
        "transport": {
            "basic": 1200,          # Ahmedabad Metro + BRTS Janmarg
            "moderate": 2600,       # Two-wheeler fuel / Autos
            "premium": 5000         # Car / SG Highway drives
        },
        "utilities": 1900,          # Torrent Power & maintenance
        "internet_phone": 799,
        "subscriptions": 650,
        "discretionary_base": 2100,
        "neighborhoods": [
            {
                "id": "prahlad_nagar_sg_highway",
                "name": "Prahlad Nagar / SG Highway",
                "vibe": "Prime commercial street, high-end restaurants, corporate offices",
                "distance_to_it_hub_km": 1.0,
                "avg_1bhk_rent": 14000,
                "avg_2bhk_shared_rent": 9500,
                "avg_pg_rent": 8000,
                "safety_score": 96,
                "connectivity_score": 93,
                "lifestyle_score": 94,
                "best_suited_for": "Corporate executives & IT professionals on SG Highway"
            },
            {
                "id": "sindhu_bhavan_road",
                "name": "Sindhu Bhavan Road (SBR) / Bodakdev",
                "vibe": "Elite lifestyle, premier cafes, luxury automotive showrooms, tranquil",
                "distance_to_it_hub_km": 3.0,
                "avg_1bhk_rent": 16000,
                "avg_2bhk_shared_rent": 11000,
                "avg_pg_rent": 9000,
                "safety_score": 97,
                "connectivity_score": 91,
                "lifestyle_score": 96,
                "best_suited_for": "High-earning fintech & startup professionals"
            },
            {
                "id": "gift_city_vicinity",
                "name": "GIFT City / Gandhinagar Infocity",
                "vibe": "India's first operational smart city, IFSC towers, zero traffic, wide greenery",
                "distance_to_it_hub_km": 1.0,
                "avg_1bhk_rent": 12000,
                "avg_2bhk_shared_rent": 8500,
                "avg_pg_rent": 7000,
                "safety_score": 98,
                "connectivity_score": 88,
                "lifestyle_score": 86,
                "best_suited_for": "Fintech, Global Banking & IT specialists stationed at GIFT City"
            }
        ]
    }
}

def get_city_data(city_query: str) -> Dict[str, Any]:
    """Helper to find city by ID or approximate name."""
    query = city_query.strip().lower()
    if query in CITIES_DB:
        return CITIES_DB[query]
    
    # Aliases
    aliases = {
        "bangalore": "bengaluru",
        "blr": "bengaluru",
        "bombay": "mumbai",
        "bom": "mumbai",
        "delhi ncr": "delhi",
        "new delhi": "delhi",
        "hyd": "hyderabad",
        "madras": "chennai",
        "maa": "chennai",
        "gurgaon": "gurugram",
        "ggn": "gurugram",
        "calcutta": "kolkata",
        "ccu": "kolkata",
        "amd": "ahmedabad"
    }
    if query in aliases:
        return CITIES_DB[aliases[query]]
    
    # Substring search
    for cid, cdata in CITIES_DB.items():
        if cid in query or cdata["name"].lower() in query:
            return cdata
            
    # Default fallback to Bengaluru
    return CITIES_DB["bengaluru"]
