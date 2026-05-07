/**
 * Evacora - Disaster Types & Guidelines Data
 * Comprehensive disaster response guidance for US and Europe
 */

export interface DisasterGuide {
  code: string;
  name: string;
  icon: string;
  region: "us" | "eu" | "global";
  immediateActions: string[];
  evacuationSteps: string[];
  safetyTips: string[];
  whatToBring: string[];
  emergencyNumber: string;
  helplineNumber: string;
  riskLevel: "Low" | "Medium" | "High";
}

// ─── US Disasters ──────────────────────────────────────────────────────────
export const US_DISASTERS: DisasterGuide[] = [
  {
    code: "wildfire",
    name: "Wildfire",
    icon: "🔥",
    region: "us",
    immediateActions: [
      "🚗 Evacuate immediately if ordered - do not delay",
      "🪟 Close all windows and doors to prevent embers",
      "🔥 Turn off gas at meter if time permits",
      "💡 Leave lights on so firefighters can see",
      "🚗 Drive with headlights on - visibility critical",
      "🏠 Wear protective clothing - long sleeves and pants",
      "🎒 Take emergency go-bag with important documents",
      "📱 Keep phone charged and with you at all times",
      "🚗 Fill car with gas before evacuation order",
      "👨‍👩‍👧 Notify family of your evacuation location",
    ],
    evacuationSteps: [
      "Listen to local news and emergency alerts",
      "Follow designated evacuation routes",
      "Do not use shortcuts or back roads",
      "Drive slowly and carefully",
      "Go to designated evacuation centers or shelters",
    ],
    safetyTips: [
      "Wear N95 masks to protect from smoke",
      "Stay indoors with windows closed",
      "Use air purifiers if available",
      "Keep medications and important documents ready",
      "Have a full tank of gas before evacuation",
    ],
    whatToBring: [
      "Important documents (ID, insurance, deeds)",
      "Medications and medical equipment",
      "Phone chargers and backup power banks",
      "Cash and credit cards",
      "Irreplaceable photos and heirlooms",
      "Pet carriers and pet supplies",
      "Water and non-perishable food",
    ],
    emergencyNumber: "911",
    helplineNumber: "1-800-621-3362",
    riskLevel: "High",
  },
  {
    code: "earthquake",
    name: "Earthquake",
    icon: "🌍",
    region: "us",
    immediateActions: [
      "Drop to hands and knees immediately",
      "Take cover under sturdy table or desk",
      "Hold on until shaking stops completely",
      "Stay away from windows and mirrors",
      "Do not run outside during shaking",
      "If outside, move away from buildings and power lines",
      "If driving, pull over safely and stay in vehicle",
      "Stay in your location until shaking completely stops",
      "Check on family and neighbors after shaking",
      "Listen to emergency broadcasts for aftershock warnings",
    ],
    evacuationSteps: [
      "Check for injuries and provide first aid",
      "Inspect your home for damage",
      "Turn off gas if you smell it",
      "Do not use elevators",
      "Exit building carefully if safe",
      "Go to designated assembly points",
    ],
    safetyTips: [
      "Secure heavy furniture to walls",
      "Keep emergency supplies in multiple locations",
      "Know how to turn off utilities",
      "Practice DROP, COVER, HOLD ON regularly",
      "Stay away from damaged buildings",
    ],
    whatToBring: [
      "First aid kit",
      "Water (1 gallon per person per day)",
      "Non-perishable food",
      "Flashlight and extra batteries",
      "Portable radio",
      "Important documents",
      "Medications",
    ],
    emergencyNumber: "911",
    helplineNumber: "1-800-621-3362",
    riskLevel: "High",
  },
  {
    code: "tornado",
    name: "Tornado",
    icon: "🌪️",
    region: "us",
    immediateActions: [
      "Go to basement or interior room on lowest floor immediately",
      "Stay away from windows and exterior walls",
      "Get under sturdy table or mattress for protection",
      "Protect your head and neck with hands or pillow",
      "Do not try to outrun a tornado in a car",
      "If outside with no shelter, lie flat in a ditch or low spot",
      "If in a mobile home, evacuate to a sturdy building",
      "Stay in shelter until tornado warning is lifted",
      "Listen to weather radio for tornado updates",
      "Account for all family members in the shelter",
    ],
    evacuationSteps: [
      "Wait for tornado warning to clear",
      "Check for injuries",
      "Exit building if it's damaged",
      "Avoid downed power lines",
      "Go to emergency shelter if needed",
    ],
    safetyTips: [
      "Know the difference between watch and warning",
      "Have a safe room identified in advance",
      "Keep weather radio on during storm season",
      "Do not open windows",
      "Stay indoors until all-clear is given",
    ],
    whatToBring: [
      "Flashlight and batteries",
      "First aid kit",
      "Water",
      "Important documents",
      "Medications",
      "Phone charger",
    ],
    emergencyNumber: "911",
    helplineNumber: "1-800-621-3362",
    riskLevel: "High",
  },
  {
    code: "hurricane",
    name: "Hurricane",
    icon: "🌀",
    region: "us",
    immediateActions: [
      "🚗 Evacuate if ordered by authorities - do not delay",
      "🪟 Secure outdoor items - bring in or tie down furniture",
      "💧 Fill bathtub with water for drinking and sanitation",
      "🔌 Charge all devices - phones, laptops, power banks",
      "💰 Get cash from ATM - ATMs may not work after storm",
      "🏠 Board up windows and secure doors with plywood",
      "🛒 Stock up on food, water, and essential supplies",
      "📋 Gather important documents and insurance papers",
      "🚗 Fill your car with gas - gas stations may close",
      "👨‍👩‍👧 Notify family of your evacuation plan and location",
    ],
    evacuationSteps: [
      "Follow evacuation routes",
      "Do not use shortcuts",
      "Drive with headlights on",
      "Go to designated shelters",
      "Register with emergency services",
    ],
    safetyTips: [
      "Board up windows",
      "Stay indoors during storm",
      "Avoid flooded roads",
      "Do not go outside during eye of storm",
      "Listen to emergency broadcasts",
    ],
    whatToBring: [
      "Important documents",
      "Medications",
      "Cash and cards",
      "Phone chargers",
      "Water and food",
      "Pet supplies",
      "Irreplaceable items",
    ],
    emergencyNumber: "911",
    helplineNumber: "1-800-621-3362",
    riskLevel: "High",
  },
];

// ─── European Disasters ────────────────────────────────────────────────────
export const EU_DISASTERS: DisasterGuide[] = [
  {
    code: "bombing",
    name: "Bombing / Air Raid",
    icon: "💣",
    region: "eu",
    immediateActions: [
      "🚨 Go to nearest shelter or basement IMMEDIATELY when sirens sound",
      "🪟 Stay away from windows and exterior walls - move to interior rooms",
      "🛡️ Cover your head and neck with your hands or a pillow",
      "🏃 If outside, lie flat on the ground away from buildings and vehicles",
      "🚫 Do NOT look outside or go to windows to see what's happening",
      "🧱 Move to the center of the building, away from walls and doors",
      "🔇 Stay quiet and listen for further instructions from authorities",
      "🧳 Keep your emergency bag with you at all times in the shelter",
      "💧 If in shelter, ration water and food - it may be a long wait",
      "🤝 Help others in the shelter, especially children and elderly",
    ],
    evacuationSteps: [
      "Wait for all-clear signal from authorities",
      "Check for injuries",
      "Exit building carefully",
      "Avoid debris and damaged areas",
      "Go to designated assembly points",
    ],
    safetyTips: [
      "Know location of nearest public shelter",
      "Keep emergency supplies in shelter",
      "Stay tuned to emergency broadcasts",
      "Do not use phone unless emergency",
      "Stay calm and help others",
    ],
    whatToBring: [
      "Important documents",
      "Medications",
      "Water and food",
      "Flashlight",
      "First aid kit",
      "Phone charger",
      "Warm clothing",
    ],
    emergencyNumber: "112",
    helplineNumber: "Varies by country",
    riskLevel: "High",
  },
  {
    code: "war",
    name: "War / Conflict",
    icon: "⚔️",
    region: "eu",
    immediateActions: [
      "🏃 Evacuate to nearest shelter or basement immediately - do NOT delay",
      "🪟 Stay away from windows and exterior walls to avoid shrapnel",
      "📍 Move to the center of the building, away from doors and windows",
      "👨‍👩‍👧‍👦 Keep all family members and pets together in one location",
      "📱 Turn off phone and avoid using it unless it's an emergency",
      "🔇 Listen to official emergency broadcasts on radio or TV",
      "🚪 Close and lock all doors and windows; seal gaps with tape if available",
      "💧 Fill bathtubs and containers with water immediately for drinking and sanitation",
      "🕯️ Locate flashlights, candles, and batteries - do NOT use candles if gas leak suspected",
      "📋 Gather important documents, medications, and valuables in one bag",
    ],
    evacuationSteps: [
      "Only evacuate if ordered by authorities",
      "Use designated evacuation routes",
      "Do not use main roads if possible",
      "Go to designated safe zones",
      "Register with authorities upon arrival",
    ],
    safetyTips: [
      "Keep emergency supplies stocked",
      "Have documents ready for evacuation",
      "Listen to official broadcasts only",
      "Do not spread rumors",
      "Help vulnerable neighbors",
    ],
    whatToBring: [
      "Passport and important documents",
      "Medications and medical records",
      "Cash in multiple currencies",
      "Phone chargers and power banks",
      "Water and non-perishable food",
      "Warm clothing and blankets",
      "First aid kit",
    ],
    emergencyNumber: "112",
    helplineNumber: "Red Cross: +41 22 730 60 00",
    riskLevel: "High",
  },
  {
    code: "flood",
    name: "Flood",
    icon: "🌊",
    region: "eu",
    immediateActions: [
      "🏃 Move to higher ground IMMEDIATELY - do NOT wait",
      "🚗 Do NOT attempt to cross flooded roads or bridges",
      "🔌 Turn off utilities (gas, electricity, water) if safe to do so",
      "🪟 Close all windows and doors to prevent water entry",
      "📦 Move valuables and important items to higher floors",
      "👨‍👩‍👧‍👦 Gather family members and pets and move to high ground",
      "📱 Call emergency services if trapped - do NOT try to swim or wade",
      "🧳 Take your emergency bag with essential documents and medications",
      "🚪 Lock your home before leaving if time permits",
      "📍 Go to designated evacuation centers or higher ground shelters",
    ],
    evacuationSteps: [
      "Follow evacuation orders",
      "Use designated routes",
      "Go to higher ground or shelters",
      "Do not return until all-clear",
    ],
    safetyTips: [
      "Never drive through flooded areas",
      "Avoid contact with flood water",
      "Boil water before drinking",
      "Dispose of contaminated food",
      "Watch for aftereffects",
    ],
    whatToBring: [
      "Important documents in waterproof bag",
      "Medications",
      "Cash",
      "Phone charger",
      "Change of clothes",
      "Drinking water",
      "Food",
    ],
    emergencyNumber: "112",
    helplineNumber: "Varies by country",
    riskLevel: "Medium",
  },
  {
    code: "nuclear",
    name: "Nuclear Emergency",
    icon: "☢️",
    region: "eu",
    immediateActions: [
      "🏃 Get inside a building IMMEDIATELY - preferably basement or center of building",
      "🚪 Close all windows and doors to seal out radioactive material",
      "🔌 Turn off ventilation systems (AC, fans) to prevent contaminated air entry",
      "📻 Listen to emergency broadcasts for instructions from authorities",
      "🧴 If outside, remove outer clothing and seal in a plastic bag",
      "🚿 Shower with soap and water if possible to remove radioactive particles",
      "💧 Drink only bottled water or water from sealed containers",
      "🏠 Shelter in place - do NOT evacuate unless ordered by authorities",
      "👨‍👩‍👧‍👦 Keep family together in the most protected room (basement, center of building)",
      "📱 Do NOT use phone unless absolutely necessary - keep lines open for emergency services",
    ],
    evacuationSteps: [
      "Wait for official evacuation orders",
      "Follow designated evacuation routes",
      "Go to designated reception centers",
      "Follow decontamination procedures",
    ],
    safetyTips: [
      "Keep potassium iodide tablets if available",
      "Listen to emergency broadcasts",
      "Do not consume local food or water",
      "Avoid contaminated areas",
      "Follow all official guidance",
    ],
    whatToBring: [
      "Important documents",
      "Medications",
      "Cash",
      "Phone charger",
      "Change of clothes",
      "Toiletries",
      "Water and food",
    ],
    emergencyNumber: "112",
    helplineNumber: "National radiation authority",
    riskLevel: "High",
  },
];

// ─── Global Disasters ─────────────────────────────────────────────────────
export const GLOBAL_DISASTERS: DisasterGuide[] = [
  {
    code: "pandemic",
    name: "Pandemic / Disease Outbreak",
    icon: "🦠",
    region: "global",
    immediateActions: [
      "🏠 Stay home and isolate if you have symptoms or have been exposed",
      "🤒 Monitor your temperature and symptoms - report to health authorities if needed",
      "😷 Wear a mask when around others to prevent transmission",
      "🧼 Wash hands frequently with soap and water for at least 20 seconds",
      "🤝 Maintain at least 2 meters (6 feet) distance from others",
      "🧴 Use hand sanitizer (60% alcohol) when soap and water unavailable",
      "🚫 Do NOT touch your face, eyes, nose, or mouth",
      "🛒 Stock up on essential supplies - food, medications, hygiene items",
      "📱 Register with local health authorities if required",
      "🏥 Call health hotline if you develop symptoms - do NOT go to hospital without calling first",
    ],
    evacuationSteps: [
      "Only travel if necessary",
      "Use designated routes",
      "Maintain distance from others",
      "Follow quarantine procedures",
    ],
    safetyTips: [
      "Get vaccinated if available",
      "Maintain hygiene",
      "Disinfect surfaces",
      "Monitor symptoms",
      "Seek medical help if needed",
    ],
    whatToBring: [
      "Masks",
      "Hand sanitizer",
      "Medications",
      "Thermometer",
      "Phone charger",
      "Food and water",
    ],
    emergencyNumber: "911 or 112",
    helplineNumber: "Local health authority",
    riskLevel: "Medium",
  },
];

// ─── Helper Functions ──────────────────────────────────────────────────────

export function getDisasterGuides(region: "us" | "eu" | "global" = "global"): DisasterGuide[] {
  if (region === "us") {
    return [...US_DISASTERS, ...GLOBAL_DISASTERS];
  } else if (region === "eu") {
    return [...EU_DISASTERS, ...GLOBAL_DISASTERS];
  }
  return [...US_DISASTERS, ...EU_DISASTERS, ...GLOBAL_DISASTERS];
}

export function getDisasterByCode(code: string, region: "us" | "eu" | "global" = "global"): DisasterGuide | undefined {
  const guides = getDisasterGuides(region);
  return guides.find((d) => d.code === code);
}

export function getAllDisasters(): DisasterGuide[] {
  return [...US_DISASTERS, ...EU_DISASTERS, ...GLOBAL_DISASTERS];
}
