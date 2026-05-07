/**
 * Evacora - 다국어 지원 (i18n)
 * 영어, 스페인어, 독일어, 프랑스어, 한국어, 일본어
 */

export type Language = 'en' | 'es' | 'de' | 'fr' | 'ko' | 'ja';
export type Region = 'us' | 'eu' | 'kr' | 'jp';

export interface Translations {
  common: {
    appName: string;
    appTagline: string;
    appDescription: string;
    selectLanguage: string;
    selectRegion: string;
    continue: string;
    back: string;
    home: string;
    guides: string;
    contacts: string;
    map: string;
    dashboard: string;
    settings: string;
    logout: string;
    loading: string;
    error: string;
    success: string;
    offline: string;
    online: string;
    login: string;
    loginRequired: string;
  };
  disasters: {
    wildfire: string;
    earthquake: string;
    tornado: string;
    hurricane: string;
    bombing: string;
    war: string;
    flood: string;
    nuclear: string;
    typhoon: string;
    tsunami: string;
  };
  actions: {
    imSafe: string;
    sendSOS: string;
    addContact: string;
    editContact: string;
    deleteContact: string;
    shareLocation: string;
    searchShelter: string;
    viewGuide: string;
    downloadOffline: string;
  };
  alerts: {
    emergencyMode: string;
    liveIndicator: string;
    activeAlert: string;
    highRisk: string;
    mediumRisk: string;
    safeStatus: string;
  };
  regions: {
    unitedStates: string;
    europe: string;
    korea: string;
    japan: string;
  };
  home: {
    crisisResponseApp: string;
    areaMap: string;
    tapAPoint: string;
    you: string;
    danger: string;
    shelter: string;
    actionGuide: string;
    walkRoute: string;
    driveRoute: string;
    familyTracker: string;
    familyTrackerDesc: string;
    actionGuideDesc: string;
    safeRoute: string;
    safeRouteDesc: string;
    emergencyMap: string;
    disasterGuides: string;
    emergencyContacts: string;
    shelterInfo: string;
    conditions: string;
    footerNote: string;
    noLocation: string;
    noContacts: string;
    safetyCheckSent: string;
    sosSent: string;
    callFeature: string;
  };
  guide: {
    title: string;
    immediateActions: string;
    evacuationSteps: string;
    safetyTips: string;
    whatToBring: string;
    noGuideAvailable: string;
    selectDisaster: string;
    waterFood: string;
    firstAidKit: string;
    flashlight: string;
    phoneCharger: string;
    idDocuments: string;
    medications: string;
    helmet: string;
    whistle: string;
    dustMask: string;
    nMask: string;
    goggles: string;
    wetTowel: string;
    rainGear: string;
    radio: string;
    rope: string;
    plywood: string;
    lifeJacket: string;
    waterproofBag: string;
    blanket: string;
    cashSmallBills: string;
    warmClothes: string;
  };
  contact: {
    title: string;
    subtitle: string;
    addNew: string;
    name: string;
    phone: string;
    relationship: string;
    primary: string;
    noContacts: string;
    addFirst: string;
    sendSafetyAll: string;
    sendSOSAll: string;
    confirmDelete: string;
    family: string;
    friend: string;
    other: string;
  };
  mapPage: {
    title: string;
    radius: string;
    loadingShelters: string;
    legend: string;
    yourLocation: string;
    shelterPlace: string;
    dangerZone: string;
    nearbyShelters: string;
    noShelters: string;
    address: string;
    phone: string;
    distance: string;
    capacity: string;
  };
  family: {
    title: string;
    subtitle: string;
    allSafe: string;
    emergencyAlert: string;
    lastSeen: string;
    away: string;
    checkIn: string;
    call: string;
    message: string;
    addMember: string;
    sendInvite: string;
    safe: string;
    moving: string;
    unknown: string;
    noMembers: string;
    addMemberDesc: string;
  };
  settingsPage: {
    title: string;
    language: string;
    region: string;
    notifications: string;
    emergencyAlerts: string;
    locationUpdates: string;
    smsNotifications: string;
    about: string;
    version: string;
    privacy: string;
    terms: string;
  };
  shelterDetail: {
    title: string;
    overview: string;
    capacity: string;
    currentOccupancy: string;
    available: string;
    facilities: string;
    supplies: string;
    supplyName: string;
    quantity: string;
    unit: string;
    lastUpdated: string;
    getDirections: string;
    callShelter: string;
    shareLocation: string;
    disasterTypes: string;
    notFound: string;
    backToMap: string;
  };
  locationSharing: {
    title: string;
    subtitle: string;
    sharingOn: string;
    sharingOff: string;
    toggleSharing: string;
    updateInterval: string;
    seconds: string;
    friendsOnMap: string;
    noFriends: string;
    shareWith: string;
    stopSharing: string;
    lastUpdate: string;
  };
  pushNotification: {
    title: string;
    enable: string;
    disable: string;
    enabled: string;
    disabled: string;
    permissionDenied: string;
    alertTypes: string;
    earthquakeAlert: string;
    tsunamiAlert: string;
    typhoonAlert: string;
    wildfireAlert: string;
    floodAlert: string;
    warAlert: string;
  };
}

export const EN_TRANSLATIONS: Translations = {
  common: {
    appName: 'Evacora',
    appTagline: 'Know what to do. Right now.',
    appDescription: 'Crisis guidance app that helps users respond quickly during disasters and emergencies',
    selectLanguage: 'Select Language',
    selectRegion: 'Select Region',
    continue: 'Continue',
    back: 'Back',
    home: 'Home',
    guides: 'Guides',
    contacts: 'Contacts',
    map: 'Map',
    dashboard: 'Dashboard',
    settings: 'Settings',
    logout: 'Logout',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    offline: 'Offline',
    online: 'Online',
    login: 'Sign In',
    loginRequired: 'Sign in required to use this feature',
  },
  disasters: {
    wildfire: 'Wildfire',
    earthquake: 'Earthquake',
    tornado: 'Tornado',
    hurricane: 'Hurricane',
    bombing: 'Bombing / Air Raid',
    war: 'War / Conflict',
    flood: 'Flood',
    nuclear: 'Nuclear Emergency',
    typhoon: 'Typhoon',
    tsunami: 'Tsunami',
  },
  actions: {
    imSafe: "I'm Safe",
    sendSOS: 'Send SOS',
    addContact: 'Add Contact',
    editContact: 'Edit Contact',
    deleteContact: 'Delete Contact',
    shareLocation: 'Share Location',
    searchShelter: 'Search Shelter',
    viewGuide: 'View Guide',
    downloadOffline: 'Download for Offline',
  },
  alerts: {
    emergencyMode: 'Emergency Mode',
    liveIndicator: 'LIVE',
    activeAlert: 'Active Alert',
    highRisk: 'High Risk',
    mediumRisk: 'Medium Risk',
    safeStatus: 'Safe',
  },
  regions: {
    unitedStates: 'United States',
    europe: 'Europe',
    korea: 'South Korea',
    japan: 'Japan',
  },
  home: {
    crisisResponseApp: 'Crisis Response App',
    areaMap: 'Area Map',
    tapAPoint: 'Tap a point',
    you: 'You',
    danger: 'Danger',
    shelter: 'Shelter',
    actionGuide: 'Action Guide',
    walkRoute: 'Walk Route',
    driveRoute: 'Drive Route',
    familyTracker: 'Family Tracker',
    familyTrackerDesc: 'Real-time location & check-in',
    actionGuideDesc: 'Real-time emergency steps',
    safeRoute: 'Safe Route',
    safeRouteDesc: 'Safe path & shelter guide',
    emergencyMap: 'Emergency map',
    disasterGuides: 'Disaster guides',
    emergencyContacts: 'Emergency Contacts',
    shelterInfo: 'Lincoln High Gym',
    conditions: 'Wind: NW 12mph',
    footerNote: 'In a real emergency, always follow official guidance.',
    noLocation: 'Unable to get your location',
    noContacts: 'No emergency contacts added',
    safetyCheckSent: 'Safety check sent!',
    sosSent: 'SOS sent!',
    callFeature: 'Feature coming soon',
  },
  guide: {
    title: 'Emergency Guides',
    immediateActions: 'Immediate Actions',
    evacuationSteps: 'Evacuation Steps',
    safetyTips: 'Safety Tips',
    whatToBring: 'What to Bring',
    noGuideAvailable: 'No guide available for this disaster type.',
    selectDisaster: 'Select a disaster type to view the guide.',
    waterFood: 'Water & Food',
    firstAidKit: 'First Aid Kit',
    flashlight: 'Flashlight',
    phoneCharger: 'Phone Charger',
    idDocuments: 'ID & Documents',
    medications: 'Medications',
    helmet: 'Helmet',
    whistle: 'Whistle',
    dustMask: 'Dust Mask',
    nMask: 'N95 Mask',
    goggles: 'Goggles',
    wetTowel: 'Wet Towel',
    rainGear: 'Rain Gear',
    radio: 'Emergency Radio',
    rope: 'Rope',
    plywood: 'Plywood',
    lifeJacket: 'Life Jacket',
    waterproofBag: 'Waterproof Bag',
    blanket: 'Blanket',
    cashSmallBills: 'Cash (small bills)',
    warmClothes: 'Warm Clothes',
  },
  contact: {
    title: 'Emergency Contacts',
    subtitle: 'Manage your emergency contacts',
    addNew: 'Add New Contact',
    name: 'Name',
    phone: 'Phone Number',
    relationship: 'Relationship',
    primary: 'Primary',
    noContacts: 'No emergency contacts yet',
    addFirst: 'Add your first emergency contact',
    sendSafetyAll: 'Send Safety Check to All',
    sendSOSAll: 'Send SOS to All',
    confirmDelete: 'Are you sure you want to delete this contact?',
    family: 'Family',
    friend: 'Friend',
    other: 'Other',
  },
  mapPage: {
    title: 'Emergency Map',
    radius: 'Radius',
    loadingShelters: 'Loading shelters...',
    legend: 'Legend',
    yourLocation: 'Your Location',
    shelterPlace: 'Shelter / Safe Place',
    dangerZone: 'Danger Zone',
    nearbyShelters: 'Nearby Shelters',
    noShelters: 'No shelters found in this area',
    address: 'Address',
    phone: 'Phone',
    distance: 'Distance',
    capacity: 'Capacity',
  },
  family: {
    title: 'Family Tracker',
    subtitle: 'Real-time locations and safety status',
    allSafe: 'All Safe',
    emergencyAlert: 'Emergency Alert',
    lastSeen: 'Last Seen',
    away: 'away',
    checkIn: 'Check In',
    call: 'Call',
    message: 'Message',
    addMember: 'Add Member',
    sendInvite: 'Send Invite',
    safe: 'Safe',
    moving: 'Moving',
    unknown: 'Unknown',
    noMembers: 'No family members added yet',
    addMemberDesc: 'Add family members to track their location and safety status',
  },
  settingsPage: {
    title: 'Settings',
    language: 'Language',
    region: 'Region',
    notifications: 'Notifications',
    emergencyAlerts: 'Emergency Alerts',
    locationUpdates: 'Location Updates',
    smsNotifications: 'SMS Notifications',
    about: 'About',
    version: 'Version',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
  },
  shelterDetail: {
    title: 'Shelter Details',
    overview: 'Overview',
    capacity: 'Capacity',
    currentOccupancy: 'Current Occupancy',
    available: 'Available',
    facilities: 'Facilities',
    supplies: 'Emergency Supplies',
    supplyName: 'Item',
    quantity: 'Quantity',
    unit: 'Unit',
    lastUpdated: 'Last Updated',
    getDirections: 'Get Directions',
    callShelter: 'Call Shelter',
    shareLocation: 'Share Location',
    disasterTypes: 'Disaster Types',
    notFound: 'Shelter not found',
    backToMap: 'Back to Map',
  },
  locationSharing: {
    title: 'Location Sharing',
    subtitle: 'Share your location with family and friends',
    sharingOn: 'Sharing On',
    sharingOff: 'Sharing Off',
    toggleSharing: 'Toggle Sharing',
    updateInterval: 'Update Interval',
    seconds: 'seconds',
    friendsOnMap: 'Friends on Map',
    noFriends: 'No friends sharing location',
    shareWith: 'Share with',
    stopSharing: 'Stop Sharing',
    lastUpdate: 'Last update',
  },
  pushNotification: {
    title: 'Push Notifications',
    enable: 'Enable Notifications',
    disable: 'Disable Notifications',
    enabled: 'Notifications Enabled',
    disabled: 'Notifications Disabled',
    permissionDenied: 'Notification permission denied',
    alertTypes: 'Alert Types',
    earthquakeAlert: 'Earthquake Alert',
    tsunamiAlert: 'Tsunami Alert',
    typhoonAlert: 'Typhoon Alert',
    wildfireAlert: 'Wildfire Alert',
    floodAlert: 'Flood Alert',
    warAlert: 'War/Conflict Alert',
  },
};

export const KO_TRANSLATIONS: Translations = {
  common: {
    appName: 'Evacora',
    appTagline: '지금 바로 알아야 할 것들',
    appDescription: '재난과 긴급상황 중 빠른 대응을 돕는 위기 대응 가이드 앱',
    selectLanguage: '언어 선택',
    selectRegion: '지역 선택',
    continue: '계속',
    back: '뒤로',
    home: '홈',
    guides: '가이드',
    contacts: '비상연락처',
    map: '지도',
    dashboard: '대시보드',
    settings: '설정',
    logout: '로그아웃',
    loading: '로딩 중...',
    error: '오류',
    success: '성공',
    offline: '오프라인',
    online: '온라인',
    login: '로그인',
    loginRequired: '이 기능을 사용하려면 로그인이 필요합니다',
  },
  disasters: {
    wildfire: '산불',
    earthquake: '지진',
    tornado: '토네이도',
    hurricane: '허리케인',
    bombing: '폭격 / 공습',
    war: '전쟁 / 분쟁',
    flood: '홍수',
    nuclear: '핵 긴급상황',
    typhoon: '태풍',
    tsunami: '쓰나미',
  },
  actions: {
    imSafe: '안전합니다',
    sendSOS: 'SOS 보내기',
    addContact: '연락처 추가',
    editContact: '연락처 편집',
    deleteContact: '연락처 삭제',
    shareLocation: '위치 공유',
    searchShelter: '대피소 검색',
    viewGuide: '가이드 보기',
    downloadOffline: '오프라인 다운로드',
  },
  alerts: {
    emergencyMode: '긴급 모드',
    liveIndicator: '실시간',
    activeAlert: '활성 경고',
    highRisk: '높은 위험',
    mediumRisk: '중간 위험',
    safeStatus: '안전',
  },
  regions: {
    unitedStates: '미국',
    europe: '유럽',
    korea: '대한민국',
    japan: '일본',
  },
  home: {
    crisisResponseApp: '위기 대응 앱',
    areaMap: '지역 지도',
    tapAPoint: '지점을 탭하세요',
    you: '현재 위치',
    danger: '위험',
    shelter: '대피소',
    actionGuide: '행동 가이드',
    walkRoute: '도보 경로',
    driveRoute: '차량 경로',
    familyTracker: '가족 위치추적',
    familyTrackerDesc: '실시간 위치 및 체크인',
    actionGuideDesc: '실시간 긴급 대응 지침',
    safeRoute: '안전 경로',
    safeRouteDesc: '안전한 경로 및 대피소 안내',
    emergencyMap: '긴급 지도',
    disasterGuides: '재난 가이드',
    emergencyContacts: '비상 연락처',
    shelterInfo: '가까운 대피소',
    conditions: '바람: 북서 12mph',
    footerNote: '실제 긴급상황에서는 항상 공식 지침을 따르세요.',
    noLocation: '위치를 가져올 수 없습니다',
    noContacts: '비상 연락처가 없습니다',
    safetyCheckSent: '안전 확인 전송 완료!',
    sosSent: 'SOS 전송 완료!',
    callFeature: '곧 제공될 기능입니다',
  },
  guide: {
    title: '긴급 가이드',
    immediateActions: '즉시 행동',
    evacuationSteps: '대피 단계',
    safetyTips: '안전 수칙',
    whatToBring: '준비물',
    noGuideAvailable: '이 재난 유형에 대한 가이드가 없습니다.',
    selectDisaster: '가이드를 보려면 재난 유형을 선택하세요.',
    waterFood: '물 & 식량',
    firstAidKit: '구급상자',
    flashlight: '손전등',
    phoneCharger: '휴대폰 충전기',
    idDocuments: '신분증 & 서류',
    medications: '상비약',
    helmet: '헬멧',
    whistle: '호루라기',
    dustMask: '방진 마스크',
    nMask: 'N95 마스크',
    goggles: '보호 안경',
    wetTowel: '젖은 수건',
    rainGear: '우비',
    radio: '비상 라디오',
    rope: '밧줄',
    plywood: '합판',
    lifeJacket: '구명조끼',
    waterproofBag: '방수 가방',
    blanket: '담요',
    cashSmallBills: '현금 (소액권)',
    warmClothes: '방한복',
  },
  contact: {
    title: '비상 연락처',
    subtitle: '비상 연락처를 관리하세요',
    addNew: '새 연락처 추가',
    name: '이름',
    phone: '전화번호',
    relationship: '관계',
    primary: '주요',
    noContacts: '비상 연락처가 없습니다',
    addFirst: '첫 번째 비상 연락처를 추가하세요',
    sendSafetyAll: '전체 안전 확인 전송',
    sendSOSAll: '전체 SOS 전송',
    confirmDelete: '이 연락처를 삭제하시겠습니까?',
    family: '가족',
    friend: '친구',
    other: '기타',
  },
  mapPage: {
    title: '긴급 지도',
    radius: '반경',
    loadingShelters: '대피소 로딩 중...',
    legend: '범례',
    yourLocation: '현재 위치',
    shelterPlace: '대피소 / 안전 장소',
    dangerZone: '위험 지역',
    nearbyShelters: '주변 대피소',
    noShelters: '이 지역에 대피소가 없습니다',
    address: '주소',
    phone: '전화',
    distance: '거리',
    capacity: '수용 인원',
  },
  family: {
    title: '가족 추적',
    subtitle: '실시간 위치 및 안전 상태',
    allSafe: '모두 안전',
    emergencyAlert: '긴급 경보',
    lastSeen: '마지막 확인',
    away: '떨어져 있음',
    checkIn: '체크인',
    call: '전화',
    message: '메시지',
    addMember: '가족 추가',
    sendInvite: '초대 보내기',
    safe: '안전',
    moving: '이동 중',
    unknown: '알 수 없음',
    noMembers: '추가된 가족이 없습니다',
    addMemberDesc: '가족을 추가하여 위치와 안전 상태를 추적하세요',
  },
  settingsPage: {
    title: '설정',
    language: '언어',
    region: '지역',
    notifications: '알림',
    emergencyAlerts: '긴급 알림',
    locationUpdates: '위치 업데이트',
    smsNotifications: 'SMS 알림',
    about: '정보',
    version: '버전',
    privacy: '개인정보처리방침',
    terms: '이용약관',
  },
  shelterDetail: {
    title: '대피소 상세정보',
    overview: '개요',
    capacity: '수용 인원',
    currentOccupancy: '현재 수용 인원',
    available: '수용 가능',
    facilities: '시설 종류',
    supplies: '비축 물자',
    supplyName: '품목',
    quantity: '수량',
    unit: '단위',
    lastUpdated: '최종 업데이트',
    getDirections: '길찾기',
    callShelter: '대피소 전화',
    shareLocation: '위치 공유',
    disasterTypes: '대응 재난 유형',
    notFound: '대피소를 찾을 수 없습니다',
    backToMap: '지도로 돌아가기',
  },
  locationSharing: {
    title: '위치 공유',
    subtitle: '가족과 친구에게 위치를 공유하세요',
    sharingOn: '공유 중',
    sharingOff: '공유 꺼짐',
    toggleSharing: '공유 전환',
    updateInterval: '업데이트 주기',
    seconds: '초',
    friendsOnMap: '지도 위 친구',
    noFriends: '위치를 공유하는 친구가 없습니다',
    shareWith: '공유 대상',
    stopSharing: '공유 중지',
    lastUpdate: '마지막 업데이트',
  },
  pushNotification: {
    title: '푸시 알림',
    enable: '알림 켜기',
    disable: '알림 끄기',
    enabled: '알림 활성화됨',
    disabled: '알림 비활성화됨',
    permissionDenied: '알림 권한이 거부되었습니다',
    alertTypes: '알림 유형',
    earthquakeAlert: '지진 경보',
    tsunamiAlert: '쓰나미 경보',
    typhoonAlert: '태풍 경보',
    wildfireAlert: '산불 경보',
    floodAlert: '홍수 경보',
    warAlert: '전쟁/분쟁 경보',
  },
};

export const JA_TRANSLATIONS: Translations = {
  common: {
    appName: 'Evacora',
    appTagline: '今すぐ知るべきこと',
    appDescription: '災害と緊急事態中の迅速な対応を支援する危機対応ガイドアプリ',
    selectLanguage: '言語を選択',
    selectRegion: '地域を選択',
    continue: '続行',
    back: '戻る',
    home: 'ホーム',
    guides: 'ガイド',
    contacts: '緊急連絡先',
    map: '地図',
    dashboard: 'ダッシュボード',
    settings: '設定',
    logout: 'ログアウト',
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功',
    offline: 'オフライン',
    online: 'オンライン',
    login: 'ログイン',
    loginRequired: 'この機能を使用するにはログインが必要です',
  },
  disasters: {
    wildfire: '山火事',
    earthquake: '地震',
    tornado: '竜巻',
    hurricane: 'ハリケーン',
    bombing: '爆撃 / 空襲',
    war: '戦争 / 紛争',
    flood: '洪水',
    nuclear: '原子力緊急事態',
    typhoon: '台風',
    tsunami: '津波',
  },
  actions: {
    imSafe: '安全です',
    sendSOS: 'SOS送信',
    addContact: '連絡先を追加',
    editContact: '連絡先を編集',
    deleteContact: '連絡先を削除',
    shareLocation: '位置情報を共有',
    searchShelter: 'シェルター検索',
    viewGuide: 'ガイドを表示',
    downloadOffline: 'オフラインでダウンロード',
  },
  alerts: {
    emergencyMode: '緊急モード',
    liveIndicator: 'ライブ',
    activeAlert: 'アクティブアラート',
    highRisk: '高リスク',
    mediumRisk: '中リスク',
    safeStatus: '安全',
  },
  regions: {
    unitedStates: 'アメリカ合衆国',
    europe: 'ヨーロッパ',
    korea: '大韓民国',
    japan: '日本',
  },
  home: {
    crisisResponseApp: '危機対応アプリ',
    areaMap: 'エリアマップ',
    tapAPoint: 'ポイントをタップ',
    you: '現在地',
    danger: '危険',
    shelter: 'シェルター',
    actionGuide: '行動ガイド',
    walkRoute: '徒歩ルート',
    driveRoute: '車ルート',
    familyTracker: '家族追跡',
    familyTrackerDesc: 'リアルタイム位置＆チェックイン',
    actionGuideDesc: 'リアルタイム緊急対応手順',
    safeRoute: '安全ルート',
    safeRouteDesc: '安全な経路＆シェルターガイド',
    emergencyMap: '緊急マップ',
    disasterGuides: '災害ガイド',
    emergencyContacts: '緊急連絡先',
    shelterInfo: '最寄りのシェルター',
    conditions: '風速: 北西 12mph',
    footerNote: '実際の緊急事態では、常に公式のガイダンスに従ってください。',
    noLocation: '位置情報を取得できません',
    noContacts: '緊急連絡先が登録されていません',
    safetyCheckSent: '安全確認を送信しました！',
    sosSent: 'SOSを送信しました！',
    callFeature: '近日公開予定',
  },
  guide: {
    title: '緊急ガイド',
    immediateActions: '即時行動',
    evacuationSteps: '避難手順',
    safetyTips: '安全のヒント',
    whatToBring: '持ち物',
    noGuideAvailable: 'この災害タイプのガイドはありません。',
    selectDisaster: 'ガイドを表示するには災害タイプを選択してください。',
    waterFood: '水 & 食料',
    firstAidKit: '救急箱',
    flashlight: '懐中電灯',
    phoneCharger: '携帯充電器',
    idDocuments: '身分証 & 書類',
    medications: '常備薬',
    helmet: 'ヘルメット',
    whistle: '笛',
    dustMask: '防塵マスク',
    nMask: 'N95マスク',
    goggles: '保護メガネ',
    wetTowel: '湿ったタオル',
    rainGear: '雨具',
    radio: '非常用ラジオ',
    rope: 'ロープ',
    plywood: '合板',
    lifeJacket: '救命胴衣',
    waterproofBag: '防水バッグ',
    blanket: '毛布',
    cashSmallBills: '現金（小額紙幣）',
    warmClothes: '防寒着',
  },
  contact: {
    title: '緊急連絡先',
    subtitle: '緊急連絡先を管理',
    addNew: '新しい連絡先を追加',
    name: '名前',
    phone: '電話番号',
    relationship: '関係',
    primary: 'メイン',
    noContacts: '緊急連絡先がありません',
    addFirst: '最初の緊急連絡先を追加してください',
    sendSafetyAll: '全員に安全確認を送信',
    sendSOSAll: '全員にSOS送信',
    confirmDelete: 'この連絡先を削除しますか？',
    family: '家族',
    friend: '友人',
    other: 'その他',
  },
  mapPage: {
    title: '緊急マップ',
    radius: '半径',
    loadingShelters: 'シェルター読み込み中...',
    legend: '凡例',
    yourLocation: '現在地',
    shelterPlace: 'シェルター / 安全な場所',
    dangerZone: '危険ゾーン',
    nearbyShelters: '近くのシェルター',
    noShelters: 'この地域にシェルターはありません',
    address: '住所',
    phone: '電話',
    distance: '距離',
    capacity: '収容人数',
  },
  family: {
    title: '家族追跡',
    subtitle: 'リアルタイム位置と安全状態',
    allSafe: '全員安全',
    emergencyAlert: '緊急アラート',
    lastSeen: '最終確認',
    away: '離れている',
    checkIn: 'チェックイン',
    call: '電話',
    message: 'メッセージ',
    addMember: '家族を追加',
    sendInvite: '招待を送信',
    safe: '安全',
    moving: '移動中',
    unknown: '不明',
    noMembers: 'まだ家族が追加されていません',
    addMemberDesc: '家族を追加して位置と安全状態を追跡しましょう',
  },
  settingsPage: {
    title: '設定',
    language: '言語',
    region: '地域',
    notifications: '通知',
    emergencyAlerts: '緊急アラート',
    locationUpdates: '位置情報更新',
    smsNotifications: 'SMS通知',
    about: '情報',
    version: 'バージョン',
    privacy: 'プライバシーポリシー',
    terms: '利用規約',
  },
  shelterDetail: {
    title: '避難所詳細',
    overview: '概要',
    capacity: '収容人数',
    currentOccupancy: '現在の収容人数',
    available: '収容可能',
    facilities: '施設種類',
    supplies: '備蓄物資',
    supplyName: '品目',
    quantity: '数量',
    unit: '単位',
    lastUpdated: '最終更新',
    getDirections: '道案内',
    callShelter: '避難所に電話',
    shareLocation: '位置を共有',
    disasterTypes: '対応災害タイプ',
    notFound: '避難所が見つかりません',
    backToMap: '地図に戻る',
  },
  locationSharing: {
    title: '位置情報共有',
    subtitle: '家族や友人と位置情報を共有',
    sharingOn: '共有中',
    sharingOff: '共有オフ',
    toggleSharing: '共有切り替え',
    updateInterval: '更新間隔',
    seconds: '秒',
    friendsOnMap: '地図上の友人',
    noFriends: '位置情報を共有している友人がいません',
    shareWith: '共有先',
    stopSharing: '共有停止',
    lastUpdate: '最終更新',
  },
  pushNotification: {
    title: 'プッシュ通知',
    enable: '通知を有効にする',
    disable: '通知を無効にする',
    enabled: '通知有効',
    disabled: '通知無効',
    permissionDenied: '通知権限が拒否されました',
    alertTypes: 'アラートタイプ',
    earthquakeAlert: '地震警報',
    tsunamiAlert: '津波警報',
    typhoonAlert: '台風警報',
    wildfireAlert: '山火事警報',
    floodAlert: '洪水警報',
    warAlert: '戦争/紛争警報',
  },
};

export const ES_TRANSLATIONS: Translations = {
  common: {
    appName: 'Evacora',
    appTagline: 'Sabe qué hacer. Ahora mismo.',
    appDescription: 'Aplicación de guía de crisis que ayuda a los usuarios a responder rápidamente durante desastres y emergencias',
    selectLanguage: 'Seleccionar idioma',
    selectRegion: 'Seleccionar región',
    continue: 'Continuar',
    back: 'Atrás',
    home: 'Inicio',
    guides: 'Guías',
    contacts: 'Contactos',
    map: 'Mapa',
    dashboard: 'Panel de control',
    settings: 'Configuración',
    logout: 'Cerrar sesión',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    offline: 'Sin conexión',
    online: 'En línea',
    login: 'Iniciar sesión',
    loginRequired: 'Inicie sesión para usar esta función',
  },
  disasters: {
    wildfire: 'Incendio forestal',
    earthquake: 'Terremoto',
    tornado: 'Tornado',
    hurricane: 'Huracán',
    bombing: 'Bombardeo / Ataque aéreo',
    war: 'Guerra / Conflicto',
    flood: 'Inundación',
    nuclear: 'Emergencia nuclear',
    typhoon: 'Tifón',
    tsunami: 'Tsunami',
  },
  actions: {
    imSafe: 'Estoy seguro',
    sendSOS: 'Enviar SOS',
    addContact: 'Añadir contacto',
    editContact: 'Editar contacto',
    deleteContact: 'Eliminar contacto',
    shareLocation: 'Compartir ubicación',
    searchShelter: 'Buscar refugio',
    viewGuide: 'Ver guía',
    downloadOffline: 'Descargar para desconectado',
  },
  alerts: {
    emergencyMode: 'Modo de emergencia',
    liveIndicator: 'EN DIRECTO',
    activeAlert: 'Alerta activa',
    highRisk: 'Riesgo alto',
    mediumRisk: 'Riesgo medio',
    safeStatus: 'Seguro',
  },
  regions: {
    unitedStates: 'Estados Unidos',
    europe: 'Europa',
    korea: 'Corea del Sur',
    japan: 'Japón',
  },
  home: {
    crisisResponseApp: 'App de Respuesta a Crisis',
    areaMap: 'Mapa del Área',
    tapAPoint: 'Toca un punto',
    you: 'Tú',
    danger: 'Peligro',
    shelter: 'Refugio',
    actionGuide: 'Guía de Acción',
    walkRoute: 'Ruta a pie',
    driveRoute: 'Ruta en coche',
    familyTracker: 'Rastreo Familiar',
    familyTrackerDesc: 'Ubicación en tiempo real y check-in',
    actionGuideDesc: 'Pasos de emergencia en tiempo real',
    safeRoute: 'Ruta Segura',
    safeRouteDesc: 'Ruta segura y guía de refugios',
    emergencyMap: 'Mapa de emergencia',
    disasterGuides: 'Guías de desastres',
    emergencyContacts: 'Contactos de Emergencia',
    shelterInfo: 'Refugio más cercano',
    conditions: 'Viento: NO 12mph',
    footerNote: 'En una emergencia real, siga siempre las indicaciones oficiales.',
    noLocation: 'No se puede obtener su ubicación',
    noContacts: 'No hay contactos de emergencia',
    safetyCheckSent: '¡Verificación de seguridad enviada!',
    sosSent: '¡SOS enviado!',
    callFeature: 'Función próximamente',
  },
  guide: {
    title: 'Guías de Emergencia',
    immediateActions: 'Acciones Inmediatas',
    evacuationSteps: 'Pasos de Evacuación',
    safetyTips: 'Consejos de Seguridad',
    whatToBring: 'Qué Llevar',
    noGuideAvailable: 'No hay guía disponible para este tipo de desastre.',
    selectDisaster: 'Seleccione un tipo de desastre para ver la guía.',
    waterFood: 'Agua y Comida',
    firstAidKit: 'Botiquín',
    flashlight: 'Linterna',
    phoneCharger: 'Cargador de Teléfono',
    idDocuments: 'Identificación y Documentos',
    medications: 'Medicamentos',
    helmet: 'Casco',
    whistle: 'Silbato',
    dustMask: 'Máscara Antipolvo',
    nMask: 'Máscara N95',
    goggles: 'Gafas Protectoras',
    wetTowel: 'Toalla Húmeda',
    rainGear: 'Impermeable',
    radio: 'Radio de Emergencia',
    rope: 'Cuerda',
    plywood: 'Madera Contrachapada',
    lifeJacket: 'Chaleco Salvavidas',
    waterproofBag: 'Bolsa Impermeable',
    blanket: 'Manta',
    cashSmallBills: 'Efectivo (billetes pequeños)',
    warmClothes: 'Ropa de Abrigo',
  },
  contact: {
    title: 'Contactos de Emergencia',
    subtitle: 'Gestione sus contactos de emergencia',
    addNew: 'Añadir Nuevo Contacto',
    name: 'Nombre',
    phone: 'Teléfono',
    relationship: 'Relación',
    primary: 'Principal',
    noContacts: 'No hay contactos de emergencia',
    addFirst: 'Añada su primer contacto de emergencia',
    sendSafetyAll: 'Enviar verificación a todos',
    sendSOSAll: 'Enviar SOS a todos',
    confirmDelete: '¿Está seguro de que desea eliminar este contacto?',
    family: 'Familia',
    friend: 'Amigo',
    other: 'Otro',
  },
  mapPage: {
    title: 'Mapa de Emergencia',
    radius: 'Radio',
    loadingShelters: 'Cargando refugios...',
    legend: 'Leyenda',
    yourLocation: 'Su Ubicación',
    shelterPlace: 'Refugio / Lugar Seguro',
    dangerZone: 'Zona de Peligro',
    nearbyShelters: 'Refugios Cercanos',
    noShelters: 'No se encontraron refugios en esta área',
    address: 'Dirección',
    phone: 'Teléfono',
    distance: 'Distancia',
    capacity: 'Capacidad',
  },
  family: {
    title: 'Familia',
    subtitle: 'Ubicaciones en tiempo real y estado de seguridad',
    allSafe: 'Todos Seguros',
    emergencyAlert: 'Alerta de Emergencia',
    lastSeen: 'Última vez visto',
    away: 'lejos',
    checkIn: 'Registrarse',
    call: 'Llamar',
    message: 'Mensaje',
    addMember: 'Añadir Miembro',
    sendInvite: 'Enviar Invitación',
    safe: 'Seguro',
    moving: 'Moviéndose',
    unknown: 'Desconocido',
    noMembers: 'Ningún miembro de la familia añadido aún',
    addMemberDesc: 'Añade miembros de la familia para rastrear su ubicación y estado de seguridad',
  },
  settingsPage: {
    title: 'Configuración',
    language: 'Idioma',
    region: 'Región',
    notifications: 'Notificaciones',
    emergencyAlerts: 'Alertas de Emergencia',
    locationUpdates: 'Actualizaciones de Ubicación',
    smsNotifications: 'Notificaciones SMS',
    about: 'Acerca de',
    version: 'Versión',
    privacy: 'Política de Privacidad',
    terms: 'Términos de Servicio',
  },
  shelterDetail: {
    title: 'Detalles del Refugio',
    overview: 'Resumen',
    capacity: 'Capacidad',
    currentOccupancy: 'Ocupación Actual',
    available: 'Disponible',
    facilities: 'Instalaciones',
    supplies: 'Suministros de Emergencia',
    supplyName: 'Artículo',
    quantity: 'Cantidad',
    unit: 'Unidad',
    lastUpdated: 'Última Actualización',
    getDirections: 'Obtener Direcciones',
    callShelter: 'Llamar al Refugio',
    shareLocation: 'Compartir Ubicación',
    disasterTypes: 'Tipos de Desastre',
    notFound: 'Refugio no encontrado',
    backToMap: 'Volver al Mapa',
  },
  locationSharing: {
    title: 'Compartir Ubicación',
    subtitle: 'Comparta su ubicación con familiares y amigos',
    sharingOn: 'Compartiendo',
    sharingOff: 'No Compartiendo',
    toggleSharing: 'Alternar Compartir',
    updateInterval: 'Intervalo de Actualización',
    seconds: 'segundos',
    friendsOnMap: 'Amigos en el Mapa',
    noFriends: 'No hay amigos compartiendo ubicación',
    shareWith: 'Compartir con',
    stopSharing: 'Dejar de Compartir',
    lastUpdate: 'Última actualización',
  },
  pushNotification: {
    title: 'Notificaciones Push',
    enable: 'Activar Notificaciones',
    disable: 'Desactivar Notificaciones',
    enabled: 'Notificaciones Activadas',
    disabled: 'Notificaciones Desactivadas',
    permissionDenied: 'Permiso de notificación denegado',
    alertTypes: 'Tipos de Alerta',
    earthquakeAlert: 'Alerta de Terremoto',
    tsunamiAlert: 'Alerta de Tsunami',
    typhoonAlert: 'Alerta de Tifón',
    wildfireAlert: 'Alerta de Incendio',
    floodAlert: 'Alerta de Inundación',
    warAlert: 'Alerta de Guerra/Conflicto',
  },
};

export const DE_TRANSLATIONS: Translations = {
  common: {
    appName: 'Evacora',
    appTagline: 'Wissen Sie, was zu tun ist. Jetzt gleich.',
    appDescription: 'Krisenleitleitungs-App, die Benutzern hilft, schnell auf Katastrophen und Notfälle zu reagieren',
    selectLanguage: 'Sprache wählen',
    selectRegion: 'Region wählen',
    continue: 'Fortfahren',
    back: 'Zurück',
    home: 'Startseite',
    guides: 'Leitfäden',
    contacts: 'Kontakte',
    map: 'Karte',
    dashboard: 'Dashboard',
    settings: 'Einstellungen',
    logout: 'Abmelden',
    loading: 'Wird geladen...',
    error: 'Fehler',
    success: 'Erfolg',
    offline: 'Offline',
    online: 'Online',
    login: 'Anmelden',
    loginRequired: 'Anmeldung erforderlich, um diese Funktion zu nutzen',
  },
  disasters: {
    wildfire: 'Waldbrand',
    earthquake: 'Erdbeben',
    tornado: 'Tornado',
    hurricane: 'Hurrikan',
    bombing: 'Bombardierung / Luftangriff',
    war: 'Krieg / Konflikt',
    flood: 'Hochwasser',
    nuclear: 'Nuklearer Notfall',
    typhoon: 'Taifun',
    tsunami: 'Tsunami',
  },
  actions: {
    imSafe: 'Mir geht es gut',
    sendSOS: 'SOS senden',
    addContact: 'Kontakt hinzufügen',
    editContact: 'Kontakt bearbeiten',
    deleteContact: 'Kontakt löschen',
    shareLocation: 'Standort teilen',
    searchShelter: 'Unterkunft suchen',
    viewGuide: 'Leitfaden anzeigen',
    downloadOffline: 'Offline herunterladen',
  },
  alerts: {
    emergencyMode: 'Notfallmodus',
    liveIndicator: 'LIVE',
    activeAlert: 'Aktive Warnung',
    highRisk: 'Hohes Risiko',
    mediumRisk: 'Mittleres Risiko',
    safeStatus: 'Sicher',
  },
  regions: {
    unitedStates: 'Vereinigte Staaten',
    europe: 'Europa',
    korea: 'Südkorea',
    japan: 'Japan',
  },
  home: {
    crisisResponseApp: 'Krisenreaktions-App',
    areaMap: 'Gebietskarte',
    tapAPoint: 'Punkt antippen',
    you: 'Sie',
    danger: 'Gefahr',
    shelter: 'Unterkunft',
    actionGuide: 'Handlungsleitfaden',
    walkRoute: 'Fußweg',
    driveRoute: 'Fahrweg',
    familyTracker: 'Familien-Tracker',
    familyTrackerDesc: 'Echtzeit-Standort & Check-in',
    actionGuideDesc: 'Echtzeit-Notfallschritte',
    safeRoute: 'Sicherer Weg',
    safeRouteDesc: 'Sicherer Pfad & Unterkunftsführer',
    emergencyMap: 'Notfallkarte',
    disasterGuides: 'Katastrophenleitfäden',
    emergencyContacts: 'Notfallkontakte',
    shelterInfo: 'Nächste Unterkunft',
    conditions: 'Wind: NW 12mph',
    footerNote: 'Folgen Sie in einem echten Notfall immer den offiziellen Anweisungen.',
    noLocation: 'Standort kann nicht ermittelt werden',
    noContacts: 'Keine Notfallkontakte hinzugefügt',
    safetyCheckSent: 'Sicherheitscheck gesendet!',
    sosSent: 'SOS gesendet!',
    callFeature: 'Funktion demnächst verfügbar',
  },
  guide: {
    title: 'Notfall-Leitfäden',
    immediateActions: 'Sofortmaßnahmen',
    evacuationSteps: 'Evakuierungsschritte',
    safetyTips: 'Sicherheitstipps',
    whatToBring: 'Was mitbringen',
    noGuideAvailable: 'Kein Leitfaden für diesen Katastrophentyp verfügbar.',
    selectDisaster: 'Wählen Sie einen Katastrophentyp, um den Leitfaden anzuzeigen.',
    waterFood: 'Wasser & Lebensmittel',
    firstAidKit: 'Erste-Hilfe-Kasten',
    flashlight: 'Taschenlampe',
    phoneCharger: 'Handy-Ladegerät',
    idDocuments: 'Ausweis & Dokumente',
    medications: 'Medikamente',
    helmet: 'Helm',
    whistle: 'Pfeife',
    dustMask: 'Staubmaske',
    nMask: 'N95-Maske',
    goggles: 'Schutzbrille',
    wetTowel: 'Nasses Handtuch',
    rainGear: 'Regenkleidung',
    radio: 'Notfallradio',
    rope: 'Seil',
    plywood: 'Sperrholz',
    lifeJacket: 'Schwimmweste',
    waterproofBag: 'Wasserdichte Tasche',
    blanket: 'Decke',
    cashSmallBills: 'Bargeld (kleine Scheine)',
    warmClothes: 'Warme Kleidung',
  },
  contact: {
    title: 'Notfallkontakte',
    subtitle: 'Verwalten Sie Ihre Notfallkontakte',
    addNew: 'Neuen Kontakt hinzufügen',
    name: 'Name',
    phone: 'Telefonnummer',
    relationship: 'Beziehung',
    primary: 'Primär',
    noContacts: 'Keine Notfallkontakte',
    addFirst: 'Fügen Sie Ihren ersten Notfallkontakt hinzu',
    sendSafetyAll: 'Sicherheitscheck an alle senden',
    sendSOSAll: 'SOS an alle senden',
    confirmDelete: 'Möchten Sie diesen Kontakt wirklich löschen?',
    family: 'Familie',
    friend: 'Freund',
    other: 'Sonstiges',
  },
  mapPage: {
    title: 'Notfallkarte',
    radius: 'Radius',
    loadingShelters: 'Unterkünfte werden geladen...',
    legend: 'Legende',
    yourLocation: 'Ihr Standort',
    shelterPlace: 'Unterkunft / Sicherer Ort',
    dangerZone: 'Gefahrenzone',
    nearbyShelters: 'Nahe Unterkünfte',
    noShelters: 'Keine Unterkünfte in dieser Gegend gefunden',
    address: 'Adresse',
    phone: 'Telefon',
    distance: 'Entfernung',
    capacity: 'Kapazität',
  },
  family: {
    title: 'Familie',
    subtitle: 'Echtzeit-Standorte und Sicherheitsstatus',
    allSafe: 'Alle sicher',
    emergencyAlert: 'Notfallwarnung',
    lastSeen: 'Zuletzt gesehen',
    away: 'entfernt',
    checkIn: 'Einchecken',
    call: 'Anrufen',
    message: 'Nachricht',
    addMember: 'Mitglied hinzufügen',
    sendInvite: 'Einladung senden',
    safe: 'Sicher',
    moving: 'Unterwegs',
    unknown: 'Unbekannt',
    noMembers: 'Noch keine Familienmitglieder hinzugefügt',
    addMemberDesc: 'Fügen Sie Familienmitglieder hinzu, um ihren Standort und ihren Sicherheitsstatus zu verfolgen',
  },
  settingsPage: {
    title: 'Einstellungen',
    language: 'Sprache',
    region: 'Region',
    notifications: 'Benachrichtigungen',
    emergencyAlerts: 'Notfallwarnungen',
    locationUpdates: 'Standortaktualisierungen',
    smsNotifications: 'SMS-Benachrichtigungen',
    about: 'Über',
    version: 'Version',
    privacy: 'Datenschutzrichtlinie',
    terms: 'Nutzungsbedingungen',
  },
  shelterDetail: {
    title: 'Schutzraumdetails',
    overview: 'Übersicht',
    capacity: 'Kapazität',
    currentOccupancy: 'Aktuelle Belegung',
    available: 'Verfügbar',
    facilities: 'Einrichtungen',
    supplies: 'Notfallvorräte',
    supplyName: 'Artikel',
    quantity: 'Menge',
    unit: 'Einheit',
    lastUpdated: 'Zuletzt aktualisiert',
    getDirections: 'Route anzeigen',
    callShelter: 'Schutzraum anrufen',
    shareLocation: 'Standort teilen',
    disasterTypes: 'Katastrophentypen',
    notFound: 'Schutzraum nicht gefunden',
    backToMap: 'Zurück zur Karte',
  },
  locationSharing: {
    title: 'Standortfreigabe',
    subtitle: 'Teilen Sie Ihren Standort mit Familie und Freunden',
    sharingOn: 'Freigabe aktiv',
    sharingOff: 'Freigabe aus',
    toggleSharing: 'Freigabe umschalten',
    updateInterval: 'Aktualisierungsintervall',
    seconds: 'Sekunden',
    friendsOnMap: 'Freunde auf der Karte',
    noFriends: 'Keine Freunde teilen ihren Standort',
    shareWith: 'Teilen mit',
    stopSharing: 'Freigabe stoppen',
    lastUpdate: 'Letzte Aktualisierung',
  },
  pushNotification: {
    title: 'Push-Benachrichtigungen',
    enable: 'Benachrichtigungen aktivieren',
    disable: 'Benachrichtigungen deaktivieren',
    enabled: 'Benachrichtigungen aktiviert',
    disabled: 'Benachrichtigungen deaktiviert',
    permissionDenied: 'Benachrichtigungsberechtigung verweigert',
    alertTypes: 'Alarmtypen',
    earthquakeAlert: 'Erdbebenwarnung',
    tsunamiAlert: 'Tsunamiwarnung',
    typhoonAlert: 'Taifunwarnung',
    wildfireAlert: 'Waldbrandwarnung',
    floodAlert: 'Hochwasserwarnung',
    warAlert: 'Kriegs-/Konfliktwarnung',
  },
};

export const FR_TRANSLATIONS: Translations = {
  common: {
    appName: 'Evacora',
    appTagline: 'Sachez quoi faire. Maintenant.',
    appDescription: "Application de guide de crise qui aide les utilisateurs à réagir rapidement en cas de catastrophe et d'urgence",
    selectLanguage: 'Sélectionner la langue',
    selectRegion: 'Sélectionner la région',
    continue: 'Continuer',
    back: 'Retour',
    home: 'Accueil',
    guides: 'Guides',
    contacts: 'Contacts',
    map: 'Carte',
    dashboard: 'Tableau de bord',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    offline: 'Hors ligne',
    online: 'En ligne',
    login: 'Se connecter',
    loginRequired: 'Connexion requise pour utiliser cette fonctionnalité',
  },
  disasters: {
    wildfire: 'Incendie de forêt',
    earthquake: 'Tremblement de terre',
    tornado: 'Tornade',
    hurricane: 'Ouragan',
    bombing: 'Bombardement / Raid aérien',
    war: 'Guerre / Conflit',
    flood: 'Inondation',
    nuclear: 'Urgence nucléaire',
    typhoon: 'Typhon',
    tsunami: 'Tsunami',
  },
  actions: {
    imSafe: 'Je vais bien',
    sendSOS: 'Envoyer SOS',
    addContact: 'Ajouter un contact',
    editContact: 'Modifier le contact',
    deleteContact: 'Supprimer le contact',
    shareLocation: 'Partager la localisation',
    searchShelter: 'Rechercher un refuge',
    viewGuide: 'Afficher le guide',
    downloadOffline: 'Télécharger hors ligne',
  },
  alerts: {
    emergencyMode: 'Mode urgence',
    liveIndicator: 'EN DIRECT',
    activeAlert: 'Alerte active',
    highRisk: 'Risque élevé',
    mediumRisk: 'Risque moyen',
    safeStatus: 'Sûr',
  },
  regions: {
    unitedStates: 'États-Unis',
    europe: 'Europe',
    korea: 'Corée du Sud',
    japan: 'Japon',
  },
  home: {
    crisisResponseApp: 'App de Réponse aux Crises',
    areaMap: 'Carte de la Zone',
    tapAPoint: 'Touchez un point',
    you: 'Vous',
    danger: 'Danger',
    shelter: 'Refuge',
    actionGuide: "Guide d'Action",
    walkRoute: 'Itinéraire à pied',
    driveRoute: 'Itinéraire en voiture',
    familyTracker: 'Suivi Familial',
    familyTrackerDesc: 'Localisation en temps réel et check-in',
    actionGuideDesc: "Étapes d'urgence en temps réel",
    safeRoute: 'Itinéraire Sûr',
    safeRouteDesc: 'Chemin sûr et guide des refuges',
    emergencyMap: "Carte d'urgence",
    disasterGuides: 'Guides de catastrophes',
    emergencyContacts: "Contacts d'Urgence",
    shelterInfo: 'Refuge le plus proche',
    conditions: 'Vent: NO 12mph',
    footerNote: "En cas d'urgence réelle, suivez toujours les directives officielles.",
    noLocation: 'Impossible de déterminer votre position',
    noContacts: "Aucun contact d'urgence ajouté",
    safetyCheckSent: 'Vérification de sécurité envoyée !',
    sosSent: 'SOS envoyé !',
    callFeature: 'Fonctionnalité bientôt disponible',
  },
  guide: {
    title: "Guides d'Urgence",
    immediateActions: 'Actions Immédiates',
    evacuationSteps: "Étapes d'Évacuation",
    safetyTips: 'Conseils de Sécurité',
    whatToBring: 'Quoi Apporter',
    noGuideAvailable: "Aucun guide disponible pour ce type de catastrophe.",
    selectDisaster: 'Sélectionnez un type de catastrophe pour afficher le guide.',
    waterFood: 'Eau & Nourriture',
    firstAidKit: 'Trousse de Secours',
    flashlight: 'Lampe de Poche',
    phoneCharger: 'Chargeur de Téléphone',
    idDocuments: 'Pièce d\'Identité & Documents',
    medications: 'Médicaments',
    helmet: 'Casque',
    whistle: 'Sifflet',
    dustMask: 'Masque Anti-poussière',
    nMask: 'Masque N95',
    goggles: 'Lunettes de Protection',
    wetTowel: 'Serviette Humide',
    rainGear: 'Vêtements de Pluie',
    radio: 'Radio d\'Urgence',
    rope: 'Corde',
    plywood: 'Contreplaqué',
    lifeJacket: 'Gilet de Sauvetage',
    waterproofBag: 'Sac Étanche',
    blanket: 'Couverture',
    cashSmallBills: 'Espèces (petites coupures)',
    warmClothes: 'Vêtements Chauds',
  },
  contact: {
    title: "Contacts d'Urgence",
    subtitle: "Gérez vos contacts d'urgence",
    addNew: 'Ajouter un Nouveau Contact',
    name: 'Nom',
    phone: 'Téléphone',
    relationship: 'Relation',
    primary: 'Principal',
    noContacts: "Aucun contact d'urgence",
    addFirst: "Ajoutez votre premier contact d'urgence",
    sendSafetyAll: 'Envoyer vérification à tous',
    sendSOSAll: 'Envoyer SOS à tous',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer ce contact ?',
    family: 'Famille',
    friend: 'Ami',
    other: 'Autre',
  },
  mapPage: {
    title: "Carte d'Urgence",
    radius: 'Rayon',
    loadingShelters: 'Chargement des refuges...',
    legend: 'Légende',
    yourLocation: 'Votre Position',
    shelterPlace: 'Refuge / Lieu Sûr',
    dangerZone: 'Zone de Danger',
    nearbyShelters: 'Refuges à Proximité',
    noShelters: 'Aucun refuge trouvé dans cette zone',
    address: 'Adresse',
    phone: 'Téléphone',
    distance: 'Distance',
    capacity: 'Capacité',
  },
  family: {
    title: 'Famille',
    subtitle: 'Emplacements en temps réel et état de sécurité',
    allSafe: 'Tous en sécurité',
    emergencyAlert: 'Alerte d\'urgence',
    lastSeen: 'Vu pour la dernière fois',
    away: 'loin',
    checkIn: 'Enregistrement',
    call: 'Appel',
    message: 'Message',
    addMember: 'Ajouter un membre',
    sendInvite: 'Envoyer une invitation',
    safe: 'Sûr',
    moving: 'En mouvement',
    unknown: 'Inconnu',
    noMembers: 'Aucun membre de la famille ajouté pour le moment',
    addMemberDesc: 'Ajoutez des membres de la famille pour suivre leur localisation et leur état de sécurité',
  },
  settingsPage: {
    title: 'Paramètres',
    language: 'Langue',
    region: 'Région',
    notifications: 'Notifications',
    emergencyAlerts: "Alertes d'Urgence",
    locationUpdates: 'Mises à jour de localisation',
    smsNotifications: 'Notifications SMS',
    about: 'À propos',
    version: 'Version',
    privacy: 'Politique de Confidentialité',
    terms: "Conditions d'Utilisation",
  },
  shelterDetail: {
    title: 'Détails du Refuge',
    overview: 'Aperçu',
    capacity: 'Capacité',
    currentOccupancy: 'Occupation Actuelle',
    available: 'Disponible',
    facilities: 'Installations',
    supplies: 'Fournitures d\'Urgence',
    supplyName: 'Article',
    quantity: 'Quantité',
    unit: 'Unité',
    lastUpdated: 'Dernière mise à jour',
    getDirections: 'Itinéraire',
    callShelter: 'Appeler le Refuge',
    shareLocation: 'Partager la Position',
    disasterTypes: 'Types de Catastrophe',
    notFound: 'Refuge non trouvé',
    backToMap: 'Retour à la Carte',
  },
  locationSharing: {
    title: 'Partage de Position',
    subtitle: 'Partagez votre position avec votre famille et vos amis',
    sharingOn: 'Partage actif',
    sharingOff: 'Partage désactivé',
    toggleSharing: 'Basculer le partage',
    updateInterval: 'Intervalle de mise à jour',
    seconds: 'secondes',
    friendsOnMap: 'Amis sur la carte',
    noFriends: 'Aucun ami ne partage sa position',
    shareWith: 'Partager avec',
    stopSharing: 'Arrêter le partage',
    lastUpdate: 'Dernière mise à jour',
  },
  pushNotification: {
    title: 'Notifications Push',
    enable: 'Activer les notifications',
    disable: 'Désactiver les notifications',
    enabled: 'Notifications activées',
    disabled: 'Notifications désactivées',
    permissionDenied: 'Permission de notification refusée',
    alertTypes: 'Types d\'Alerte',
    earthquakeAlert: 'Alerte Tremblement de Terre',
    tsunamiAlert: 'Alerte Tsunami',
    typhoonAlert: 'Alerte Typhon',
    wildfireAlert: 'Alerte Incendie',
    floodAlert: 'Alerte Inondation',
    warAlert: 'Alerte Guerre/Conflit',
  },
};

export const TRANSLATIONS_MAP: Record<Language, Translations> = {
  en: EN_TRANSLATIONS,
  es: ES_TRANSLATIONS,
  de: DE_TRANSLATIONS,
  fr: FR_TRANSLATIONS,
  ko: KO_TRANSLATIONS,
  ja: JA_TRANSLATIONS,
};

export function getTranslations(language: Language): Translations {
  return TRANSLATIONS_MAP[language] || EN_TRANSLATIONS;
}

export function getLanguageName(language: Language): string {
  const names: Record<Language, string> = {
    en: 'English',
    es: 'Español',
    de: 'Deutsch',
    fr: 'Français',
    ko: '한국어',
    ja: '日本語',
  };
  return names[language];
}

export function getRegionLanguages(region: Region): Language[] {
  const regionLanguages: Record<Region, Language[]> = {
    us: ['en', 'es'],
    eu: ['en', 'de', 'fr'],
    kr: ['ko', 'en'],
    jp: ['ja', 'en'],
  };
  return regionLanguages[region];
}
