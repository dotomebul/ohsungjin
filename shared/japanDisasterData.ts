/**
 * Evacora - 일본 재난 가이드 및 대피소 데이터
 * 지진, 쓰나미, 태풍, 폭우 등
 */

export interface JapanShelter {
  id: string;
  name: string;
  address: string;
  lat: string;
  lng: string;
  prefecture: string;
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

export interface JapanDisasterGuide {
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

// 일본 재난 가이드
export const JAPAN_DISASTER_GUIDES: Record<string, JapanDisasterGuide> = {
  earthquake: {
    code: 'earthquake',
    name: '地震 (지진)',
    description: '일본은 환태평양 지진대에 위치하여 지진이 자주 발생',
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
      { name: '긴급신고', phone: '110' },
      { name: '소방청', phone: '119' },
      { name: '기상청', phone: '03-3280-0311' },
    ],
    riskLevel: 'high',
    seasonality: '연중 발생 가능',
  },
  tsunami: {
    code: 'tsunami',
    name: '津波 (쓰나미)',
    description: '지진으로 인한 쓰나미는 해안 지역에 큰 피해를 입힘',
    initialPreparations: [
      '쓰나미 위험 지역 파악',
      '고지대 대피 경로 확인',
      '비상용품 준비',
      '가족 연락처 확인',
      '지진 경보 시스템 설정',
    ],
    duringDisaster: [
      '지진 감지 시 즉시 고지대로 이동',
      '차량 사용 금지',
      '해안 지역 피하기',
      '라디오나 TV로 정보 수집',
      '대피소 지시 따르기',
    ],
    afterDisaster: [
      '해수 물이 빠질 때까지 고지대 대기',
      '부상자 응급 처치',
      '위생 관리 (물 소독)',
      '가족과 안부 확인',
      '복구 작업 참여',
    ],
    emergencyContacts: [
      { name: '긴급신고', phone: '110' },
      { name: '소방청', phone: '119' },
      { name: '해상보안청', phone: '118' },
    ],
    riskLevel: 'high',
    seasonality: '연중 발생 가능 (지진 시)',
  },
  typhoon: {
    code: 'typhoon',
    name: '台風 (태풍)',
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
      { name: '긴급신고', phone: '110' },
      { name: '소방청', phone: '119' },
      { name: '기상청', phone: '03-3280-0311' },
    ],
    riskLevel: 'high',
    seasonality: '8월~10월 (여름~가을)',
  },
  heavyRain: {
    code: 'heavyRain',
    name: '豪雨 (폭우)',
    description: '단시간에 많은 양의 비가 내리는 현상으로 산사태 위험',
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
      { name: '긴급신고', phone: '110' },
      { name: '소방청', phone: '119' },
      { name: '기상청', phone: '03-3280-0311' },
    ],
    riskLevel: 'high',
    seasonality: '6월~9월',
  },
};

// 일본 주요 도시 대피소
export const JAPAN_SHELTERS: JapanShelter[] = [
  {
    id: 'jp-tokyo-001',
    name: '東京都庁地下シェルター (도쿄도청 지하 대피소)',
    address: '東京都新宿区西新宿2-8-1',
    lat: '35.6895',
    lng: '139.6917',
    prefecture: '東京都',
    type: 'government',
    capacity: 3000,
    amenities: ['대피실', '물 공급', '의료 시설', '통신 센터', '화장실'],
    phone: '03-5321-1111',
    disasterTypes: ['earthquake', 'tsunami', 'typhoon', 'heavyRain'],
    operatingHours: '긴급 시 24/7',
    accessibilityFeatures: ['휠체어 접근 가능', '엘리베이터'],
    petFriendly: false,
    notes: '도쿄 중심부 대피소, 도청 지하에 위치',
  },
  {
    id: 'jp-osaka-001',
    name: '大阪府庁地下シェルター (오사카부청 지하 대피소)',
    address: '大阪府大阪市中央区大手前2-1-22',
    lat: '34.6862',
    lng: '135.5261',
    prefecture: '大阪府',
    type: 'government',
    capacity: 2000,
    amenities: ['대피실', '물 공급', '의료 시설', '화장실'],
    phone: '06-6941-0351',
    disasterTypes: ['earthquake', 'tsunami', 'typhoon', 'heavyRain'],
    operatingHours: '긴급 시 24/7',
    accessibilityFeatures: ['휠체어 접근 가능'],
    petFriendly: false,
    notes: '오사카 중심부 대피소, 해일 위험 지역',
  },
  {
    id: 'jp-kyoto-001',
    name: '京都府庁地下シェルター (교토부청 지하 대피소)',
    address: '京都府京都市上京区下立売通新町西入薮ノ内町',
    lat: '35.0116',
    lng: '135.7681',
    prefecture: '京都府',
    type: 'government',
    capacity: 1200,
    amenities: ['대피실', '물 공급', '의료 시설', '화장실'],
    phone: '075-414-4111',
    disasterTypes: ['earthquake', 'typhoon', 'heavyRain'],
    operatingHours: '긴급 시 24/7',
    accessibilityFeatures: ['휠체어 접근 가능'],
    petFriendly: false,
    notes: '교토 중심부 대피소',
  },
  {
    id: 'jp-hiroshima-001',
    name: '広島県庁地下シェルター (히로시마현청 지하 대피소)',
    address: '広島県広島市中区基町10-52',
    lat: '34.3964',
    lng: '132.4554',
    prefecture: '広島県',
    type: 'government',
    capacity: 1000,
    amenities: ['대피실', '물 공급', '의료 시설', '화장실'],
    phone: '082-228-2111',
    disasterTypes: ['earthquake', 'tsunami', 'typhoon', 'heavyRain'],
    operatingHours: '긴급 시 24/7',
    accessibilityFeatures: ['휠체어 접근 가능'],
    petFriendly: false,
    notes: '히로시마 중심부 대피소, 해일 위험 지역',
  },
  {
    id: 'jp-fukuoka-001',
    name: '福岡県庁地下シェルター (후쿠오카현청 지하 대피소)',
    address: '福岡県福岡市博多区東公園7-7',
    lat: '33.5904',
    lng: '130.4017',
    prefecture: '福岡県',
    type: 'government',
    capacity: 1000,
    amenities: ['대피실', '물 공급', '의료 시설', '화장실'],
    phone: '092-651-1111',
    disasterTypes: ['earthquake', 'tsunami', 'typhoon', 'heavyRain'],
    operatingHours: '긴급 시 24/7',
    accessibilityFeatures: ['휠체어 접근 가능'],
    petFriendly: false,
    notes: '후쿠오카 중심부 대피소, 해일 위험 지역',
  },
  {
    id: 'jp-nagoya-001',
    name: '愛知県庁地下シェルター (아이치현청 지하 대피소)',
    address: '愛知県名古屋市中区三の丸3-1-2',
    lat: '35.1815',
    lng: '136.8964',
    prefecture: '愛知県',
    type: 'government',
    capacity: 1200,
    amenities: ['대피실', '물 공급', '의료 시설', '화장실'],
    phone: '052-961-2111',
    disasterTypes: ['earthquake', 'tsunami', 'typhoon', 'heavyRain'],
    operatingHours: '긴급 시 24/7',
    accessibilityFeatures: ['휠체어 접근 가능'],
    petFriendly: false,
    notes: '나고야 중심부 대피소, 해일 위험 지역',
  },
  {
    id: 'jp-sapporo-001',
    name: '北海道庁地下シェルター (홋카이도청 지하 대피소)',
    address: '北海道札幌市中央区北3条西6-2-1',
    lat: '43.0642',
    lng: '141.3469',
    prefecture: '北海道',
    type: 'government',
    capacity: 800,
    amenities: ['대피실', '물 공급', '의료 시설', '화장실'],
    phone: '011-204-5000',
    disasterTypes: ['earthquake', 'tsunami', 'typhoon', 'heavyRain'],
    operatingHours: '긴급 시 24/7',
    accessibilityFeatures: ['휠체어 접근 가능'],
    petFriendly: false,
    notes: '삿포로 중심부 대피소',
  },
];

export function getJapanSheltersByPrefecture(prefecture: string): JapanShelter[] {
  return JAPAN_SHELTERS.filter((shelter) => shelter.prefecture === prefecture);
}

export function getJapanSheltersByDisasterType(disasterCode: string): JapanShelter[] {
  return JAPAN_SHELTERS.filter((shelter) => shelter.disasterTypes.includes(disasterCode));
}

export function getAccessibleJapanShelters(): JapanShelter[] {
  return JAPAN_SHELTERS.filter((shelter) =>
    shelter.accessibilityFeatures.some((feature) => feature.includes('휠체어'))
  );
}
