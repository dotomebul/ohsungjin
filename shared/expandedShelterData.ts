/**
 * Evacora - 확장된 대피소 데이터
 * FEMA 공식 대피소, 유럽 전쟁 벙커, 지역 대피소 등
 */

export interface ExpandedShelter {
  id: string;
  name: string;
  address: string;
  lat: string;
  lng: string;
  region: 'us' | 'eu';
  type: 'fema' | 'bunker' | 'community' | 'hospital' | 'school' | 'government';
  capacity: number;
  amenities: string[];
  phone?: string;
  website?: string;
  disasterTypes: string[];
  operatingHours: string;
  accessibilityFeatures: string[];
  petFriendly: boolean;
  notes: string;
}

// 미국 FEMA 공식 대피소 (주요 도시)
export const US_FEMA_SHELTERS: ExpandedShelter[] = [
  {
    id: 'fema-la-001',
    name: 'Los Angeles Convention Center Emergency Shelter',
    address: '1201 S Figueroa St, Los Angeles, CA 90015',
    lat: '34.0195',
    lng: '-118.2437',
    region: 'us',
    type: 'fema',
    capacity: 5000,
    amenities: ['Cots', 'Meals', 'Medical care', 'Showers', 'Laundry', 'Phone charging'],
    phone: '1-800-621-3362',
    website: 'www.fema.gov',
    disasterTypes: ['wildfire', 'earthquake', 'flood'],
    operatingHours: '24/7 during emergencies',
    accessibilityFeatures: ['Wheelchair accessible', 'Accessible bathrooms', 'Accessible parking'],
    petFriendly: true,
    notes: 'Large capacity shelter with full services',
  },
  {
    id: 'fema-ny-001',
    name: 'Javits Center Emergency Shelter',
    address: '655 W 34th St, New York, NY 10001',
    lat: '40.7532',
    lng: '-74.0019',
    region: 'us',
    type: 'fema',
    capacity: 3000,
    amenities: ['Cots', 'Meals', 'Medical care', 'Showers', 'Phone charging'],
    phone: '1-800-621-3362',
    website: 'www.fema.gov',
    disasterTypes: ['hurricane', 'flood', 'earthquake'],
    operatingHours: '24/7 during emergencies',
    accessibilityFeatures: ['Wheelchair accessible', 'Accessible bathrooms'],
    petFriendly: true,
    notes: 'Major emergency shelter in Manhattan',
  },
  {
    id: 'fema-miami-001',
    name: 'Miami-Dade County Emergency Operations Center',
    address: '9300 NW 41st St, Doral, FL 33178',
    lat: '25.8167',
    lng: '-80.3333',
    region: 'us',
    type: 'government',
    capacity: 2000,
    amenities: ['Cots', 'Meals', 'Medical care', 'Generators', 'Water'],
    phone: '305-468-5400',
    website: 'www.miamidade.gov',
    disasterTypes: ['hurricane', 'flood', 'tornado'],
    operatingHours: '24/7 during emergencies',
    accessibilityFeatures: ['Wheelchair accessible', 'Accessible bathrooms'],
    petFriendly: false,
    notes: 'Hurricane preparedness center',
  },
  {
    id: 'fema-sf-001',
    name: 'San Francisco Moscone Center Emergency Shelter',
    address: '747 Howard St, San Francisco, CA 94103',
    lat: '37.7833',
    lng: '-122.3994',
    region: 'us',
    type: 'fema',
    capacity: 2500,
    amenities: ['Cots', 'Meals', 'Medical care', 'Showers', 'Phone charging'],
    phone: '1-800-621-3362',
    website: 'www.fema.gov',
    disasterTypes: ['earthquake', 'wildfire', 'flood'],
    operatingHours: '24/7 during emergencies',
    accessibilityFeatures: ['Wheelchair accessible', 'Accessible bathrooms'],
    petFriendly: true,
    notes: 'Earthquake and wildfire shelter',
  },
];

// 유럽 전쟁 벙커 및 대피소 (주요 도시)
export const EU_BUNKERS_SHELTERS: ExpandedShelter[] = [
  {
    id: 'eu-berlin-001',
    name: 'Berlin Bunker - Friedrichshain',
    address: 'Friedrichshain, Berlin, Germany',
    lat: '52.5200',
    lng: '13.4050',
    region: 'eu',
    type: 'bunker',
    capacity: 3000,
    amenities: ['Bunker beds', 'Water supply', 'Air filtration', 'Medical station', 'Communication center'],
    phone: '+49-30-2555-0',
    website: 'www.berlin.de',
    disasterTypes: ['bombing', 'war', 'nuclear'],
    operatingHours: '24/7 during emergencies',
    accessibilityFeatures: ['Limited wheelchair access', 'Narrow passages'],
    petFriendly: false,
    notes: 'Historic WWII bunker, still maintained for emergencies',
  },
  {
    id: 'eu-warsaw-001',
    name: 'Warsaw Underground Shelters - Old Town',
    address: 'Old Town, Warsaw, Poland',
    lat: '52.2297',
    lng: '21.0122',
    region: 'eu',
    type: 'bunker',
    capacity: 2000,
    amenities: ['Underground passages', 'Water access', 'Medical supplies', 'Communication'],
    phone: '+48-22-635-1624',
    website: 'www.warsaw.pl',
    disasterTypes: ['bombing', 'war'],
    operatingHours: '24/7 during emergencies',
    accessibilityFeatures: ['Limited wheelchair access', 'Historic structure'],
    petFriendly: false,
    notes: 'Historic WWII shelters, network of underground passages',
  },
  {
    id: 'eu-paris-001',
    name: 'Paris Catacombs Emergency Shelter',
    address: '1 Avenue du Colonel Henri Rol-Tanguy, Paris, France',
    lat: '48.8335',
    lng: '2.3430',
    region: 'eu',
    type: 'bunker',
    capacity: 5000,
    amenities: ['Underground chambers', 'Water access', 'Air circulation', 'Medical station'],
    phone: '+33-1-43-22-47-63',
    website: 'www.paris.fr',
    disasterTypes: ['bombing', 'war', 'nuclear'],
    operatingHours: '24/7 during emergencies',
    accessibilityFeatures: ['Limited wheelchair access', 'Stone passages'],
    petFriendly: false,
    notes: 'Extensive underground network used for emergency shelter',
  },
  {
    id: 'eu-zurich-001',
    name: 'Zurich Civil Protection Bunker',
    address: 'Zurich, Switzerland',
    lat: '47.3769',
    lng: '8.5472',
    region: 'eu',
    type: 'bunker',
    capacity: 1500,
    amenities: ['Modern bunker', 'Air filtration', 'Water supply', 'Medical center', 'Communication'],
    phone: '+41-44-412-1111',
    website: 'www.zurich.ch',
    disasterTypes: ['bombing', 'war', 'nuclear'],
    operatingHours: '24/7 during emergencies',
    accessibilityFeatures: ['Wheelchair accessible', 'Modern facilities'],
    petFriendly: false,
    notes: 'Modern Swiss civil protection bunker',
  },
  {
    id: 'eu-stockholm-001',
    name: 'Stockholm Bunker - Södermalm',
    address: 'Södermalm, Stockholm, Sweden',
    lat: '59.3293',
    lng: '18.0727',
    region: 'eu',
    type: 'bunker',
    capacity: 2000,
    amenities: ['Bunker beds', 'Water supply', 'Air filtration', 'Medical station'],
    phone: '+46-8-508-28900',
    website: 'www.stockholm.se',
    disasterTypes: ['bombing', 'war', 'nuclear'],
    operatingHours: '24/7 during emergencies',
    accessibilityFeatures: ['Limited wheelchair access'],
    petFriendly: false,
    notes: 'Swedish civil defense bunker',
  },
  {
    id: 'eu-prague-001',
    name: 'Prague Underground Shelters',
    address: 'Prague, Czech Republic',
    lat: '50.0755',
    lng: '14.4378',
    region: 'eu',
    type: 'bunker',
    capacity: 3000,
    amenities: ['Underground chambers', 'Water access', 'Medical supplies'],
    phone: '+420-2-2481-1111',
    website: 'www.praha.eu',
    disasterTypes: ['bombing', 'war'],
    operatingHours: '24/7 during emergencies',
    accessibilityFeatures: ['Limited wheelchair access'],
    petFriendly: false,
    notes: 'Historic underground shelter network',
  },
];

// 지역 커뮤니티 대피소
export const COMMUNITY_SHELTERS: ExpandedShelter[] = [
  {
    id: 'community-us-001',
    name: 'Local High School Gymnasium',
    address: 'Various locations',
    lat: '0',
    lng: '0',
    region: 'us',
    type: 'school',
    capacity: 500,
    amenities: ['Cots', 'Basic meals', 'Water', 'Bathrooms', 'Phone charging'],
    phone: 'Local emergency number',
    website: '',
    disasterTypes: ['wildfire', 'tornado', 'flood'],
    operatingHours: '24/7 during emergencies',
    accessibilityFeatures: ['Wheelchair accessible', 'Accessible bathrooms'],
    petFriendly: false,
    notes: 'Local community shelter, check with local authorities',
  },
  {
    id: 'community-eu-001',
    name: 'Local Community Center',
    address: 'Various locations',
    lat: '0',
    lng: '0',
    region: 'eu',
    type: 'community',
    capacity: 300,
    amenities: ['Cots', 'Basic meals', 'Water', 'Bathrooms'],
    phone: 'Local emergency number',
    website: '',
    disasterTypes: ['bombing', 'flood', 'war'],
    operatingHours: '24/7 during emergencies',
    accessibilityFeatures: ['Wheelchair accessible'],
    petFriendly: false,
    notes: 'Local community shelter, check with local authorities',
  },
];

export function getAllShelters(region: 'us' | 'eu'): ExpandedShelter[] {
  if (region === 'us') {
    return [...US_FEMA_SHELTERS, ...COMMUNITY_SHELTERS.filter((s) => s.region === 'us')];
  } else {
    return [...EU_BUNKERS_SHELTERS, ...COMMUNITY_SHELTERS.filter((s) => s.region === 'eu')];
  }
}

export function getSheltersByType(type: ExpandedShelter['type'], region: 'us' | 'eu'): ExpandedShelter[] {
  return getAllShelters(region).filter((shelter) => shelter.type === type);
}

export function getSheltersByDisasterType(disasterCode: string, region: 'us' | 'eu'): ExpandedShelter[] {
  return getAllShelters(region).filter((shelter) => shelter.disasterTypes.includes(disasterCode));
}

export function getPetFriendlyShelters(region: 'us' | 'eu'): ExpandedShelter[] {
  return getAllShelters(region).filter((shelter) => shelter.petFriendly);
}

export function getAccessibleShelters(region: 'us' | 'eu'): ExpandedShelter[] {
  return getAllShelters(region).filter((shelter) =>
    shelter.accessibilityFeatures.some((feature) => feature.includes('Wheelchair'))
  );
}
