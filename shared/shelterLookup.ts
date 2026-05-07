import shelterManifest from './shelterManifest.json';

export interface USShelterInfo {
  state: string;
  state_code: string;
  ema_url: string;
  fema_app_url: string;
  fema_sms: string;
  fema_sms_template: string;
  red_cross_url: string;
  lookup_methods: string[];
}

export interface EUShelterInfo {
  country: string;
  country_ko: string;
  iso2: string;
  iso3: string;
  emergency_number: string;
  profile_url: string;
  has_official_locator: string;
  locator_url: string;
  notes: string;
}

/**
 * 미국 주 코드로 대피소 조회 정보 조회
 */
export function getUSShelterInfo(stateCode: string): USShelterInfo | null {
  const normalized = stateCode.toUpperCase();
  return (shelterManifest.us as USShelterInfo[]).find(
    (s) => s.state_code === normalized
  ) || null;
}

/**
 * 미국 주 이름으로 대피소 조회 정보 조회
 */
export function getUSShelterInfoByName(stateName: string): USShelterInfo | null {
  const normalized = stateName.toLowerCase();
  return (shelterManifest.us as USShelterInfo[]).find(
    (s) => s.state.toLowerCase() === normalized
  ) || null;
}

/**
 * 유럽 국가 코드(ISO2)로 대피소 조회 정보 조회
 */
export function getEUShelterInfo(countryCode: string): EUShelterInfo | null {
  const normalized = countryCode.toUpperCase();
  return (shelterManifest.eu as EUShelterInfo[]).find(
    (c) => c.iso2 === normalized
  ) || null;
}

/**
 * 유럽 국가명으로 대피소 조회 정보 조회
 */
export function getEUShelterInfoByName(countryName: string): EUShelterInfo | null {
  const normalized = countryName.toLowerCase();
  return (shelterManifest.eu as EUShelterInfo[]).find(
    (c) => c.country.toLowerCase() === normalized
  ) || null;
}

/**
 * 미국 모든 주의 대피소 조회 정보 조회
 */
export function getAllUSShelterInfo(): USShelterInfo[] {
  return shelterManifest.us as USShelterInfo[];
}

/**
 * 유럽 모든 국가의 대피소 조회 정보 조회
 */
export function getAllEUShelterInfo(): EUShelterInfo[] {
  return shelterManifest.eu as EUShelterInfo[];
}

/**
 * 미국 주에 대한 대피소 조회 방법 텍스트 생성
 */
export function getUSShelterLookupGuide(stateCode: string): string {
  const info = getUSShelterInfo(stateCode);
  if (!info) return '';

  const lines: string[] = [];
  lines.push(`🏠 **${info.state} Emergency Shelters**\n`);
  lines.push(`**Primary Methods:**`);

  if (info.lookup_methods[0] === 'state_page_first') {
    lines.push(`1. Visit state emergency management: ${info.ema_url}`);
  }

  if (info.lookup_methods.includes('fema_app')) {
    lines.push(`2. Use FEMA App: ${info.fema_app_url}`);
  }

  if (info.lookup_methods.includes('fema_sms')) {
    lines.push(`3. Text **${info.fema_sms_template}}** to **${info.fema_sms}**`);
  }

  if (info.lookup_methods.includes('red_cross_shelter_map')) {
    lines.push(`4. Red Cross Shelter Map: ${info.red_cross_url}`);
  }

  lines.push(`\n**Emergency Number:** 911`);

  return lines.join('\n');
}

/**
 * 유럽 국가에 대한 대피소 조회 방법 텍스트 생성
 */
export function getEUShelterLookupGuide(countryCode: string): string {
  const info = getEUShelterInfo(countryCode);
  if (!info) return '';

  const lines: string[] = [];
  lines.push(`🏠 **${info.country} Emergency Shelters**\n`);
  lines.push(`**Emergency Number:** ${info.emergency_number}`);

  if (info.locator_url) {
    lines.push(`**Official Shelter Locator:** ${info.locator_url}`);
  }

  if (info.has_official_locator !== 'yes') {
    lines.push(`\n**Note:** ${info.notes}`);
  }

  lines.push(`\n**Country Profile:** ${info.profile_url}`);

  return lines.join('\n');
}

/**
 * 지역과 위치 정보로 가장 적절한 대피소 조회 가이드 제공
 */
export function getShelterGuideForLocation(
  region: 'us' | 'eu',
  location: string
): string {
  if (region === 'us') {
    // 주 코드 또는 주 이름으로 시도
    let info = getUSShelterInfo(location);
    if (!info) {
      info = getUSShelterInfoByName(location);
    }
    if (info) {
      return getUSShelterLookupGuide(info.state_code);
    }
  } else if (region === 'eu') {
    // 국가 코드 또는 국가명으로 시도
    let info = getEUShelterInfo(location);
    if (!info) {
      info = getEUShelterInfoByName(location);
    }
    if (info) {
      return getEUShelterLookupGuide(info.iso2);
    }
  }

  return `Unable to find shelter information for ${location}`;
}
