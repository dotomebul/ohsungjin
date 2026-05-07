/**
 * Evacora - 복합 재난 시나리오 및 통합 대응 체계
 * 여러 재난이 동시에 발생하는 상황 대응
 */

export interface ComplexScenario {
  id: string;
  name: string;
  description: string;
  disasterCodes: string[];
  region: 'us' | 'eu';
  probability: 'low' | 'medium' | 'high';
  combinedRiskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  immediateActions: string[];
  priorityItems: string[];
  shelterPreference: 'basement' | 'underground' | 'elevated' | 'evacuation';
  estimatedEvacuationTime: string;
  notes: string[];
}

export const COMPLEX_SCENARIOS: ComplexScenario[] = [
  // 산불 + 공기질 악화 (US)
  {
    id: 'wildfire-airquality-us',
    name: 'Wildfire with Poor Air Quality',
    description: 'Active wildfire with heavy smoke affecting air quality in surrounding areas',
    disasterCodes: ['wildfire'],
    region: 'us',
    probability: 'high',
    combinedRiskLevel: 'High',
    immediateActions: [
      'Evacuate immediately if ordered',
      'Wear N95 masks or better',
      'Close all windows and doors',
      'Turn off HVAC systems',
      'Move to higher ground away from smoke',
    ],
    priorityItems: [
      'N95 masks (20+ per person)',
      'Medications (respiratory inhalers)',
      'Air purifier with HEPA filter',
      'Bottled water',
      'Non-perishable food',
      'Phone charger',
      'Important documents',
    ],
    shelterPreference: 'evacuation',
    estimatedEvacuationTime: '15-30 minutes',
    notes: [
      'Vulnerable groups: elderly, children, people with respiratory conditions',
      'Monitor air quality index (AQI) continuously',
      'Use MERV-13 or higher rated filters',
      'Seal windows with duct tape if sheltering in place',
    ],
  },

  // 지진 + 해일 (US - 태평양 연안)
  {
    id: 'earthquake-tsunami-us',
    name: 'Earthquake with Tsunami Risk',
    description: 'Strong earthquake near coast with potential tsunami waves',
    disasterCodes: ['earthquake'],
    region: 'us',
    probability: 'medium',
    combinedRiskLevel: 'Critical',
    immediateActions: [
      'DROP, COVER, and HOLD ON immediately',
      'Move to high ground after shaking stops',
      'Do not go to beach to observe waves',
      'Follow evacuation orders',
      'Move inland at least 1 mile',
    ],
    priorityItems: [
      'First aid kit',
      'Bottled water (3 gallons per person)',
      'Non-perishable food (3-day supply)',
      'Medications (7-day supply)',
      'Flashlight & batteries',
      'Battery-powered radio',
      'Phone charger',
      'Important documents',
    ],
    shelterPreference: 'elevated',
    estimatedEvacuationTime: '10-15 minutes (after shaking)',
    notes: [
      'Tsunami can arrive within minutes of earthquake',
      'Move to 3rd floor or higher',
      'Stay away from beaches and harbors',
      'Multiple waves possible over several hours',
    ],
  },

  // 토네이도 + 홍수 (US - 중부)
  {
    id: 'tornado-flood-us',
    name: 'Tornado with Flooding',
    description: 'Severe tornado with heavy rainfall causing flash flooding',
    disasterCodes: ['tornado', 'flood'],
    region: 'us',
    probability: 'medium',
    combinedRiskLevel: 'Critical',
    immediateActions: [
      'Go to basement or interior room immediately',
      'Stay away from windows',
      'Cover yourself with mattress',
      'After tornado: move to higher ground',
      'Do not drive through flooded areas',
    ],
    priorityItems: [
      'Flashlight & batteries',
      'First aid kit',
      'Medications (7-day supply)',
      'Bottled water (1 gallon per person)',
      'Non-perishable food',
      'Battery-powered radio',
      'Phone charger',
      'Important documents in waterproof container',
    ],
    shelterPreference: 'basement',
    estimatedEvacuationTime: '5-10 minutes (tornado), then 30 min (flooding)',
    notes: [
      'Basement may flood - have escape route',
      'Multiple tornadoes possible',
      'Flash flooding can occur rapidly',
      'Do not attempt to cross flooded roads',
    ],
  },

  // 허리케인 + 폭풍해일 (US - 해안)
  {
    id: 'hurricane-storm-surge-us',
    name: 'Hurricane with Storm Surge',
    description: 'Major hurricane with dangerous storm surge and flooding',
    disasterCodes: ['hurricane'],
    region: 'us',
    probability: 'high',
    combinedRiskLevel: 'Critical',
    immediateActions: [
      'Evacuate immediately if ordered',
      'Move inland to higher ground',
      'Do not stay in mobile homes',
      'Secure outdoor items',
      'Fill bathtub with water',
    ],
    priorityItems: [
      'Important documents in waterproof container',
      'Medications (2-week supply)',
      'Bottled water (1 gallon per person per day)',
      'Non-perishable food (2-week supply)',
      'Flashlight & batteries',
      'Battery-powered radio',
      'Phone charger',
      'Cash & credit cards',
    ],
    shelterPreference: 'evacuation',
    estimatedEvacuationTime: '24-48 hours notice',
    notes: [
      'Storm surge can reach 20+ feet',
      'Evacuate to Category 2+ shelter',
      'Bring pets and important items',
      'Do not return until all-clear given',
    ],
  },

  // 폭격 + 화학 오염 (EU)
  {
    id: 'bombing-chemical-eu',
    name: 'Bombing with Chemical Contamination',
    description: 'Air raid with potential chemical weapon deployment',
    disasterCodes: ['bombing'],
    region: 'eu',
    probability: 'low',
    combinedRiskLevel: 'Critical',
    immediateActions: [
      'Go to designated shelter immediately',
      'Seal all windows and doors',
      'Turn off ventilation systems',
      'Wear gas mask if available',
      'Listen to emergency broadcasts',
    ],
    priorityItems: [
      'Gas mask with filters',
      'Potassium iodide tablets',
      'Medications (2-week supply)',
      'Bottled water (sealed)',
      'Non-perishable food (sealed)',
      'First aid kit',
      'Phone charger',
      'Important documents',
    ],
    shelterPreference: 'underground',
    estimatedEvacuationTime: 'Immediate (shelter in place)',
    notes: [
      'Seek underground shelter (basement, bunker)',
      'Seal room with duct tape & plastic',
      'Do not go outside without protection',
      'Chemical agents may persist for hours',
    ],
  },

  // 전쟁 + 기근 (EU)
  {
    id: 'war-famine-eu',
    name: 'War with Supply Chain Disruption',
    description: 'Conflict causing food and medicine shortages',
    disasterCodes: ['war'],
    region: 'eu',
    probability: 'medium',
    combinedRiskLevel: 'Critical',
    immediateActions: [
      'Evacuate to safe zone',
      'Stockpile food and medicine',
      'Ration supplies carefully',
      'Join community aid programs',
      'Stay informed via radio',
    ],
    priorityItems: [
      'Non-perishable food (4-week supply)',
      'Medications (4-week supply)',
      'Bottled water (2-3 gallons per person)',
      'First aid kit & medical supplies',
      'Vitamins & supplements',
      'Baby formula & diapers',
      'Pet food',
      'Important documents',
    ],
    shelterPreference: 'underground',
    estimatedEvacuationTime: 'Immediate (prepare to leave within hours)',
    notes: [
      'Prepare for extended displacement',
      'Rotate food supplies regularly',
      'Keep detailed medication records',
      'Join local mutual aid networks',
    ],
  },

  // 홍수 + 지진 (US - 캘리포니아)
  {
    id: 'flood-earthquake-us',
    name: 'Flood with Earthquake Damage',
    description: 'Flooding combined with earthquake damage to infrastructure',
    disasterCodes: ['flood', 'earthquake'],
    region: 'us',
    probability: 'low',
    combinedRiskLevel: 'Critical',
    immediateActions: [
      'DROP, COVER, and HOLD ON if earthquake occurs',
      'Move to higher ground immediately after',
      'Avoid damaged buildings',
      'Do not cross flooded roads',
      'Follow evacuation routes',
    ],
    priorityItems: [
      'First aid kit & medical supplies',
      'Bottled water (3 gallons per person)',
      'Non-perishable food (3-day supply)',
      'Medications (7-day supply)',
      'Flashlight & batteries',
      'Battery-powered radio',
      'Phone charger',
      'Important documents in waterproof container',
    ],
    shelterPreference: 'elevated',
    estimatedEvacuationTime: '30-60 minutes',
    notes: [
      'Infrastructure damage may prevent rescue',
      'Multiple hazards present simultaneously',
      'Self-sufficiency critical',
      'Avoid all damaged structures',
    ],
  },

  // 핵 긴급상황 + 화학 오염 (EU)
  {
    id: 'nuclear-chemical-eu',
    name: 'Nuclear Incident with Chemical Spill',
    description: 'Nuclear facility incident combined with chemical contamination',
    disasterCodes: ['nuclear'],
    region: 'eu',
    probability: 'low',
    combinedRiskLevel: 'Critical',
    immediateActions: [
      'Evacuate immediately',
      'Move upwind and away from incident',
      'Go to underground shelter',
      'Seal all windows and doors',
      'Turn off ventilation',
    ],
    priorityItems: [
      'Potassium iodide tablets',
      'Gas mask with filters',
      'Medications (2-week supply)',
      'Bottled water (sealed)',
      'Non-perishable food (sealed)',
      'First aid kit',
      'Phone charger',
      'Important documents',
    ],
    shelterPreference: 'underground',
    estimatedEvacuationTime: 'Immediate (or shelter in place)',
    notes: [
      'Seek deepest underground shelter',
      'Seal room completely',
      'Stay sheltered for 24-48 hours minimum',
      'Follow government evacuation orders',
    ],
  },
];

export function getComplexScenario(id: string): ComplexScenario | undefined {
  return COMPLEX_SCENARIOS.find((scenario) => scenario.id === id);
}

export function getScenariosByDisasters(disasterCodes: string[], region: 'us' | 'eu'): ComplexScenario[] {
  return COMPLEX_SCENARIOS.filter((scenario) => {
    if (scenario.region !== region) return false;
    return disasterCodes.some((code) => scenario.disasterCodes.includes(code));
  });
}

export function getHighRiskScenarios(region: 'us' | 'eu'): ComplexScenario[] {
  return COMPLEX_SCENARIOS.filter(
    (scenario) =>
      scenario.region === region &&
      (scenario.combinedRiskLevel === 'Critical' || scenario.combinedRiskLevel === 'High')
  );
}

export function getAllComplexScenarios(): ComplexScenario[] {
  return COMPLEX_SCENARIOS;
}
