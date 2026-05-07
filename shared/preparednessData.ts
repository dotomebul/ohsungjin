/**
 * Evacora - 상황별 준비물 알림 데이터
 * 각 재난 유형별 즉시 필요 물품 및 준비 사항
 */

export interface PreparednessKit {
  disasterCode: string;
  disasterName: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  immediateItems: string[];
  firstHourItems: string[];
  firstDayItems: string[];
  estimatedEvacuationTime: string;
  notes: string[];
}

export const PREPAREDNESS_KITS: PreparednessKit[] = [
  // 산불 (Wildfire)
  {
    disasterCode: 'wildfire',
    disasterName: 'Wildfire',
    urgency: 'CRITICAL',
    immediateItems: [
      'ID, passport, birth certificate',
      'Medications (7-day supply)',
      'Phone charger & power bank',
      'Cash & credit cards',
      'Important documents (insurance, deeds)',
      'Pet carriers & leashes',
      'N95 masks (minimum 10)',
      'Water (1 gallon per person)',
    ],
    firstHourItems: [
      'Irreplaceable photos & heirlooms',
      'Laptop & external hard drives',
      'Jewelry & valuables',
      'Clothes for 3 days',
      'Toiletries & hygiene items',
      'Prescription glasses/contacts',
      'Hearing aids & batteries',
      'Medical equipment (CPAP, etc)',
    ],
    firstDayItems: [
      'Non-perishable food (3-day supply)',
      'First aid kit',
      'Flashlight & batteries',
      'Radio (battery or hand-crank)',
      'Blankets & sleeping bags',
      'Change of clothes for family',
      'Pet food & supplies',
      'Important phone numbers written down',
    ],
    estimatedEvacuationTime: '15-30 minutes',
    notes: [
      'Close all windows and doors',
      'Turn off gas at meter if time permits',
      'Leave lights on for firefighters',
      'Drive with headlights on',
      'Follow designated evacuation routes only',
    ],
  },

  // 지진 (Earthquake)
  {
    disasterCode: 'earthquake',
    disasterName: 'Earthquake',
    urgency: 'CRITICAL',
    immediateItems: [
      'First aid kit',
      'Bottled water (1 gallon per person)',
      'Non-perishable food',
      'Medications (7-day supply)',
      'Flashlight & extra batteries',
      'Battery-powered or hand-crank radio',
      'Phone charger & power bank',
      'Whistle for signaling',
    ],
    firstHourItems: [
      'ID & important documents',
      'Cash & credit cards',
      'Sturdy shoes & work gloves',
      'Dust masks or N95 masks',
      'Moist towelettes & garbage bags',
      'Wrench or pliers (to turn off utilities)',
      'Manual can opener',
      'Local maps',
    ],
    firstDayItems: [
      'Change of clothes & sturdy shoes',
      'Sleeping bag or blanket',
      'Prescription eyeglasses',
      'Infant formula & diapers',
      'Pet food & carriers',
      'Comfort items (books, games)',
      'Important phone numbers',
      'Copies of insurance policies',
    ],
    estimatedEvacuationTime: 'Immediate (shelter in place initially)',
    notes: [
      'DROP, COVER, and HOLD ON immediately',
      'Stay away from windows and mirrors',
      'Do not use elevators',
      'Check for gas leaks (smell of rotten eggs)',
      'Turn off gas if you smell it',
    ],
  },

  // 토네이도 (Tornado)
  {
    disasterCode: 'tornado',
    disasterName: 'Tornado',
    urgency: 'CRITICAL',
    immediateItems: [
      'Flashlight & extra batteries',
      'First aid kit',
      'Medications (7-day supply)',
      'Important documents in waterproof container',
      'Phone charger & power bank',
      'Cash & credit cards',
      'Bottled water',
      'Non-perishable food',
    ],
    firstHourItems: [
      'Battery-powered or hand-crank radio',
      'Whistle for signaling',
      'Sturdy shoes & work gloves',
      'Dust masks or N95 masks',
      'Moist towelettes & garbage bags',
      'Wrench or pliers',
      'Manual can opener',
      'Local maps',
    ],
    firstDayItems: [
      'Change of clothes & sturdy shoes',
      'Sleeping bag or blanket',
      'Prescription eyeglasses',
      'Infant formula & diapers',
      'Pet food & carriers',
      'Comfort items',
      'Important phone numbers',
      'Insurance policy copies',
    ],
    estimatedEvacuationTime: '10-15 minutes',
    notes: [
      'Go to basement or interior room on lowest floor',
      'Stay away from windows',
      'Cover yourself with mattress or blankets',
      'Do not try to outrun tornado in vehicle',
      'Listen to weather alerts continuously',
    ],
  },

  // 허리케인 (Hurricane)
  {
    disasterCode: 'hurricane',
    disasterName: 'Hurricane',
    urgency: 'HIGH',
    immediateItems: [
      'Important documents in waterproof container',
      'Medications (2-week supply)',
      'Phone charger & power bank',
      'Cash & credit cards',
      'Bottled water (1 gallon per person per day)',
      'Non-perishable food (2-week supply)',
      'Flashlight & extra batteries',
      'Battery-powered or hand-crank radio',
    ],
    firstHourItems: [
      'First aid kit',
      'Prescription eyeglasses',
      'Infant formula & diapers',
      'Pet food & carriers',
      'Change of clothes (2-3 days)',
      'Sturdy shoes & work gloves',
      'Dust masks or N95 masks',
      'Moist towelettes & garbage bags',
    ],
    firstDayItems: [
      'Sleeping bag or blanket',
      'Comfort items (books, games)',
      'Important phone numbers written down',
      'Copies of insurance policies',
      'Photos of home & valuables',
      'Irreplaceable items',
      'Laptop & external hard drives',
      'Jewelry & valuables',
    ],
    estimatedEvacuationTime: '24-48 hours notice',
    notes: [
      'Evacuate if ordered by authorities',
      'Board up windows',
      'Secure outdoor items',
      'Fill bathtub with water for flushing',
      'Turn off gas at meter',
    ],
  },

  // 폭격/공습 (Bombing/Air Raid) - 유럽
  {
    disasterCode: 'bombing',
    disasterName: 'Bombing / Air Raid',
    urgency: 'CRITICAL',
    immediateItems: [
      'ID & passport',
      'Medications (7-day supply)',
      'Phone charger & power bank',
      'Cash & credit cards',
      'Important documents',
      'First aid kit',
      'Bottled water',
      'Non-perishable food',
    ],
    firstHourItems: [
      'Flashlight & extra batteries',
      'Battery-powered radio',
      'Dust masks or N95 masks',
      'Sturdy shoes & work gloves',
      'Whistle for signaling',
      'Change of clothes',
      'Sleeping bag or blanket',
      'Prescription eyeglasses',
    ],
    firstDayItems: [
      'Infant formula & diapers',
      'Pet food & carriers',
      'Comfort items',
      'Important phone numbers',
      'Insurance policy copies',
      'Photos of home & valuables',
      'Irreplaceable items',
      'Laptop & external hard drives',
    ],
    estimatedEvacuationTime: 'Immediate (5-10 minutes)',
    notes: [
      'Go to designated shelter immediately',
      'Stay in basement or interior room',
      'Stay away from windows & doors',
      'Listen to emergency broadcasts',
      'Do not leave shelter until all-clear is given',
    ],
  },

  // 전쟁/분쟁 (War/Conflict)
  {
    disasterCode: 'war',
    disasterName: 'War / Conflict',
    urgency: 'CRITICAL',
    immediateItems: [
      'ID & passport',
      'Medications (2-week supply)',
      'Phone charger & power bank',
      'Cash & credit cards (multiple currencies)',
      'Important documents in waterproof container',
      'Bottled water (2-3 gallons per person)',
      'Non-perishable food (2-week supply)',
      'First aid kit & medical supplies',
    ],
    firstHourItems: [
      'Flashlight & extra batteries',
      'Battery-powered radio',
      'Dust masks or N95 masks',
      'Sturdy shoes & work gloves',
      'Whistle for signaling',
      'Change of clothes (3-5 days)',
      'Sleeping bag or blanket',
      'Prescription eyeglasses',
    ],
    firstDayItems: [
      'Infant formula & diapers',
      'Pet food & carriers',
      'Comfort items (books, games)',
      'Important phone numbers',
      'Insurance policy copies',
      'Photos of home & valuables',
      'Irreplaceable items',
      'Laptop & external hard drives',
    ],
    estimatedEvacuationTime: 'Immediate (prepare to leave within hours)',
    notes: [
      'Follow government evacuation orders',
      'Go to designated shelter or safe zone',
      'Avoid main roads & populated areas',
      'Stay informed via emergency broadcasts',
      'Help vulnerable people (elderly, children)',
    ],
  },

  // 홍수 (Flood)
  {
    disasterCode: 'flood',
    disasterName: 'Flood',
    urgency: 'HIGH',
    immediateItems: [
      'Important documents in waterproof container',
      'Medications (7-day supply)',
      'Phone charger & power bank',
      'Cash & credit cards',
      'Bottled water (1 gallon per person)',
      'Non-perishable food',
      'Flashlight & extra batteries',
      'Battery-powered radio',
    ],
    firstHourItems: [
      'First aid kit',
      'Sturdy shoes & work gloves',
      'Dust masks or N95 masks',
      'Change of clothes (2-3 days)',
      'Sleeping bag or blanket',
      'Prescription eyeglasses',
      'Infant formula & diapers',
      'Pet food & carriers',
    ],
    firstDayItems: [
      'Comfort items (books, games)',
      'Important phone numbers',
      'Insurance policy copies',
      'Photos of home & valuables',
      'Irreplaceable items',
      'Laptop & external hard drives',
      'Jewelry & valuables',
      'Moist towelettes & garbage bags',
    ],
    estimatedEvacuationTime: '30 minutes to several hours',
    notes: [
      'Do not drive through flooded areas',
      'Move to higher ground immediately',
      'Turn off utilities if time permits',
      'Listen to emergency broadcasts',
      'Help neighbors if safe to do so',
    ],
  },

  // 핵 긴급상황 (Nuclear Emergency)
  {
    disasterCode: 'nuclear',
    disasterName: 'Nuclear Emergency',
    urgency: 'CRITICAL',
    immediateItems: [
      'Potassium iodide tablets (if available)',
      'Medications (7-day supply)',
      'Phone charger & power bank',
      'Important documents',
      'Cash & credit cards',
      'Bottled water (1 gallon per person)',
      'Non-perishable food',
      'First aid kit',
    ],
    firstHourItems: [
      'Flashlight & extra batteries',
      'Battery-powered radio',
      'Dust masks or N95 masks (or duct tape & plastic sheeting)',
      'Sturdy shoes & work gloves',
      'Change of clothes',
      'Sleeping bag or blanket',
      'Prescription eyeglasses',
      'Infant formula & diapers',
    ],
    firstDayItems: [
      'Pet food & carriers',
      'Comfort items',
      'Important phone numbers',
      'Insurance policy copies',
      'Photos of home & valuables',
      'Irreplaceable items',
      'Laptop & external hard drives',
      'Moist towelettes & garbage bags',
    ],
    estimatedEvacuationTime: 'Immediate (or shelter in place)',
    notes: [
      'Go to basement or center of building',
      'Seal windows & doors with duct tape & plastic',
      'Turn off ventilation systems',
      'Listen to emergency broadcasts for evacuation orders',
      'Stay sheltered for at least 24 hours',
    ],
  },
];

export function getPreparednessKit(disasterCode: string): PreparednessKit | undefined {
  return PREPAREDNESS_KITS.find((kit) => kit.disasterCode === disasterCode);
}

export function getAllPreparednessKits(): PreparednessKit[] {
  return PREPAREDNESS_KITS;
}

export function getPreparednessKitsByUrgency(urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM'): PreparednessKit[] {
  return PREPAREDNESS_KITS.filter((kit) => kit.urgency === urgency);
}
