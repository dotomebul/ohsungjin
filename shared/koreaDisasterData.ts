/**
 * Evacora - 한국 재난 가이드 및 대피소 데이터
 * 지진, 태풍, 홍수, 산불, 폭우, 해일 등
 */

export interface KoreaShelter {
  id: string;
  name: string;
  address: string;
  lat: string;
  lng: string;
  city: string;
  type: 'bunker' | 'community' | 'hospital' | 'school' | 'government';
  capacity: number;
  amenities: string[];
  phone?: string;
  disasterTypes: string[];
  operatingHours: string;
  accessibilityFeatures: string[];
  petFriendly: boolean;
  notes: string;
}

export interface KoreaDisasterGuide {
  code: string;
  name: string;
  description: string;
  initialPreparations: string[];
  duringDisaster: string[];
  afterDisaster: string[];
  emergencyContacts: { name: string; phone: string }[];
  riskLevel: 'high' | 'medium' | 'low';
  seasonality: string;
}

// 한국 재난 가이드
export const KOREA_DISASTER_GUIDES: Record<string, KoreaDisasterGuide> = {
  earthquake: {
    code: 'earthquake',
    name: '지진',
    description: '한반도는 지진 활동이 증가하고 있으며, 특히 남해와 동해 지역에서 발생 가능',
    initialPreparations: [
      '지진 대피 계획 수립 및 가족과 공유',
      '비상용품 준비 (물, 식량, 의약품, 손전등, 배터리)',
      '가구 고정 및 위험한 물건 정리',
      '비상 연락처 목록 작성',
      '집 근처 안전한 장소 파악',
    ],
    duringDisaster: [
      '흔들림이 느껴지면 즉시 책상 아래로 몸을 숨김',
      '창문과 거울에서 멀어지기',
      '엘리베이터 사용 금지',
      '건물 밖으로 나가지 않기 (떨어지는 물건 위험)',
      '흔들림이 멈출 때까지 대기',
    ],
    afterDisaster: [
      '가스 누출 확인 및 창문 열기',
      '부상자 응급 처치',
      '라디오나 TV로 정보 수집',
      '안내에 따라 대피소로 이동',
      '가족과 안부 확인',
    ],
    emergencyContacts: [
      { name: '긴급신고', phone: '112' },
      { name: '소방청', phone: '119' },
      { name: '기상청', phone: '1339' },
    ],
    riskLevel: 'high',
    seasonality: '연중 발생 가능',
  },
  typhoon: {
    code: 'typhoon',
    name: '태풍',
    description: '여름과 가을에 발생하는 태풍은 강한 바람과 폭우를 동반',
    initialPreparations: [
      '태풍 경보 확인 및 대피 경로 파악',
      '비상용품 준비 (물, 식량, 의약품, 손전등)',
      '창문과 문 보강',
      '배수구 청소',
      '비상 연락처 확인',
    ],
    duringDisaster: [
      '외출 금지',
      '창문과 문 닫기',
      '라디오나 TV로 정보 수집',
      '필요시 대피소로 이동',
      '가족과 함께 안전한 장소에 머물기',
    ],
    afterDisaster: [
      '주변 피해 상황 확인',
      '가스 누출 확인',
      '부상자 응급 처치',
      '도로 상황 확인 후 외출',
      '복구 작업에 참여',
    ],
    emergencyContacts: [
      { name: '긴급신고', phone: '112' },
      { name: '소방청', phone: '119' },
      { name: '기상청', phone: '1339' },
    ],
    riskLevel: 'high',
    seasonality: '8월~10월 (여름~가을)',
  },
  flood: {
    code: 'flood',
    name: '홍수',
    description: '집중호우로 인한 하천 범람 및 산사태 위험',
    initialPreparations: [
      '주변 하천 및 산사태 위험 지역 파악',
      '비상용품 준비',
      '대피 경로 사전 확인',
      '배수구 청소',
      '가족 연락처 확인',
    ],
    duringDisaster: [
      '고지대로 이동',
      '차량 운행 금지',
      '지하실 및 반지하 주택 피하기',
      '라디오나 TV로 정보 수집',
      '필요시 즉시 대피',
    ],
    afterDisaster: [
      '물이 빠질 때까지 대기',
      '가스 누출 확인',
      '부상자 응급 처치',
      '위생 관리 (물 소독)',
      '복구 작업 참여',
    ],
    emergencyContacts: [
      { name: '긴급신고', phone: '112' },
      { name: '소방청', phone: '119' },
      { name: '행정안전부', phone: '1888-0120' },
    ],
    riskLevel: 'high',
    seasonality: '6월~9월 (장마, 집중호우)',
  },
  wildfire: {
    code: 'wildfire',
    name: '산불',
    description: '건조한 계절에 발생하는 산불로 인한 대규모 피해',
    initialPreparations: [
      '산불 위험 지역 파악',
      '대피 경로 확인',
      '비상용품 준비',
      '차량 연료 항상 충전',
      '가족 연락처 확인',
    ],
    duringDisaster: [
      '산림청 대피 지시 따르기',
      '차량으로 신속하게 대피',
      '창문과 문 닫기',
      '에어컨 실내 순환 모드 설정',
      '라디오로 정보 수집',
    ],
    afterDisaster: [
      '공기질 개선 확인 후 외출',
      '호흡기 질환자 주의',
      '정화 필터 교체',
      '집 청소',
      '피해 상황 보고',
    ],
    emergencyContacts: [
      { name: '긴급신고', phone: '112' },
      { name: '산림청', phone: '1577-1112' },
      { name: '소방청', phone: '119' },
    ],
    riskLevel: 'high',
    seasonality: '11월~4월 (건조한 계절)',
  },
  heavyRain: {
    code: 'heavyRain',
    name: '폭우',
    description: '단시간에 많은 양의 비가 내리는 현상',
    initialPreparations: [
      '우수 배수 시설 확인',
      '비상용품 준비',
      '대피 경로 파악',
      '배수구 청소',
      '가족 연락처 확인',
    ],
    duringDisaster: [
      '외출 금지',
      '지하실 및 반지하 주택 피하기',
      '창문과 문 닫기',
      '라디오나 TV로 정보 수집',
      '필요시 대피',
    ],
    afterDisaster: [
      '물이 빠질 때까지 대기',
      '가스 누출 확인',
      '위생 관리',
      '도로 상황 확인',
      '복구 작업 참여',
    ],
    emergencyContacts: [
      { name: '긴급신고', phone: '112' },
      { name: '소방청', phone: '119' },
      { name: '기상청', phone: '1339' },
    ],
    riskLevel: 'high',
    seasonality: '6월~9월',
  },
};

// 한국 주요 도시 대피소
export const KOREA_SHELTERS: KoreaShelter[] = [
  {
    id: 'kr-seoul-001',
    name: '서울시청 지하 대피소',
    address: '서울시 중구 세종대로 110',
    lat: '37.5665',
    lng: '126.9780',
    city: '서울',
    type: 'government',
    capacity: 2000,
    amenities: ['대피실', '물 공급', '의료 시설', '통신 센터', '화장실'],
    phone: '02-120',
    disasterTypes: ['earthquake', 'typhoon', 'flood', 'heavyRain'],
    operatingHours: '긴급 시 24/7',
    accessibilityFeatures: ['휠체어 접근 가능', '엘리베이터'],
    petFriendly: false,
    notes: '서울 중심부 대피소, 시청 지하에 위치',
  },
  {
    id: 'kr-busan-001',
    name: '부산시청 지하 대피소',
    address: '부산시 중구 중앙대로 217',
    lat: '35.0979',
    lng: '129.0328',
    city: '부산',
    type: 'government',
    capacity: 1500,
    amenities: ['대피실', '물 공급', '의료 시설', '화장실'],
    phone: '051-120',
    disasterTypes: ['earthquake', 'typhoon', 'flood', 'tsunami'],
    operatingHours: '긴급 시 24/7',
    accessibilityFeatures: ['휠체어 접근 가능'],
    petFriendly: false,
    notes: '부산 중심부 대피소, 해일 위험 지역',
  },
  {
    id: 'kr-daegu-001',
    name: '대구시청 지하 대피소',
    address: '대구시 중구 국채보상로 529',
    lat: '35.8714',
    lng: '128.5956',
    city: '대구',
    type: 'government',
    capacity: 1200,
    amenities: ['대피실', '물 공급', '의료 시설', '화장실'],
    phone: '053-120',
    disasterTypes: ['earthquake', 'typhoon', 'flood', 'wildfire'],
    operatingHours: '긴급 시 24/7',
    accessibilityFeatures: ['휠체어 접근 가능'],
    petFriendly: false,
    notes: '대구 중심부 대피소',
  },
  {
    id: 'kr-incheon-001',
    name: '인천시청 지하 대피소',
    address: '인천시 남동구 정각로 935',
    lat: '37.4563',
    lng: '126.7064',
    city: '인천',
    type: 'government',
    capacity: 1000,
    amenities: ['대피실', '물 공급', '의료 시설', '화장실'],
    phone: '032-120',
    disasterTypes: ['earthquake', 'typhoon', 'flood', 'tsunami'],
    operatingHours: '긴급 시 24/7',
    accessibilityFeatures: ['휠체어 접근 가능'],
    petFriendly: false,
    notes: '인천 중심부 대피소, 해일 위험 지역',
  },
  {
    id: 'kr-gwangju-001',
    name: '광주시청 지하 대피소',
    address: '광주시 동구 동명로 239',
    lat: '35.1595',
    lng: '126.8526',
    city: '광주',
    type: 'government',
    capacity: 800,
    amenities: ['대피실', '물 공급', '의료 시설', '화장실'],
    phone: '062-120',
    disasterTypes: ['earthquake', 'typhoon', 'flood', 'wildfire'],
    operatingHours: '긴급 시 24/7',
    accessibilityFeatures: ['휠체어 접근 가능'],
    petFriendly: false,
    notes: '광주 중심부 대피소',
  },
  {
    id: 'kr-daejeon-001',
    name: '대전시청 지하 대피소',
    address: '대전시 서구 둔산로 161',
    lat: '36.3504',
    lng: '127.3845',
    city: '대전',
    type: 'government',
    capacity: 800,
    amenities: ['대피실', '물 공급', '의료 시설', '화장실'],
    phone: '042-120',
    disasterTypes: ['earthquake', 'typhoon', 'flood', 'wildfire'],
    operatingHours: '긴급 시 24/7',
    accessibilityFeatures: ['휠체어 접근 가능'],
    petFriendly: false,
    notes: '대전 중심부 대피소',
  },
  {
    id: 'kr-ulsan-001',
    name: '울산시청 지하 대피소',
    address: '울산시 남구 다운로 1',
    lat: '35.5394',
    lng: '129.3114',
    city: '울산',
    type: 'government',
    capacity: 600,
    amenities: ['대피실', '물 공급', '의료 시설', '화장실'],
    phone: '052-120',
    disasterTypes: ['earthquake', 'typhoon', 'flood', 'tsunami'],
    operatingHours: '긴급 시 24/7',
    accessibilityFeatures: ['휠체어 접근 가능'],
    petFriendly: false,
    notes: '울산 중심부 대피소, 해일 위험 지역',
  },
];

export function getKoreaSheltersByCity(city: string): KoreaShelter[] {
  return KOREA_SHELTERS.filter((shelter) => shelter.city === city);
}

export function getKoreaSheltersByDisasterType(disasterCode: string): KoreaShelter[] {
  return KOREA_SHELTERS.filter((shelter) => shelter.disasterTypes.includes(disasterCode));
}

export function getAccessibleKoreaShelters(): KoreaShelter[] {
  return KOREA_SHELTERS.filter((shelter) =>
    shelter.accessibilityFeatures.some((feature) => feature.includes('휠체어'))
  );
}
