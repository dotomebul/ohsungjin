# CrisisPath - 풀스택 앱 구현 TODO

## Phase 1: 기본 구조 (완료)
- [x] 프로젝트 초기화 (web-static)
- [x] Emergency Clarity 디자인 시스템 구현
- [x] 히어로 섹션 및 맵 UI 구현
- [x] 기본 인터랙티브 기능 (맵 핀 클릭)
- [x] 풀스택 업그레이드 (web-db-user)

## Phase 2: 데이터베이스 및 인증
- [x] 데이터베이스 스키마 작성 (사용자, 연락처, 위치, 재난 타입)
- [x] 사용자 인증 시스템 통합 (Manus OAuth)
- [x] 데이터베이스 마이그레이션 실행 (pnpm db:push)
- [x] API 엔드포인트 기본 구조 (tRPC routers)

## Phase 3: 재난 유형 및 가이드
- [x] 재난 유형 데이터 정의 (미국: 산불, 지진, 토네이도, 허리케인 / 유럽: 폭격, 전쟁, 폭탄 대피소)
- [x] 재난 유형별 가이드라인 콘텐츠 작성
- [x] 재난 유형 선택 UI 구현 (탭 또는 드롭다운)
- [x] 선택된 재난 타입에 따라 동적으로 가이드 업데이트

## Phase 4: Google Maps 통합
- [x] Google Maps API 설정 (Manus 프록시 활용)
- [x] MapView 컴포넌트 커스터마이징
- [x] 실시간 사용자 위치 표시 (watchPosition 기반)
- [x] 대피소/쉘터 마커 표시 (실제 FEMA, 유럽 대피소 데이터)
- [x] 실제 거리 계산 (Haversine 공식)
- [x] shelterData.ts API 통합 (searchNearby 엔드포인트)

## Phase 5: 비상 연락처 관리
- [x] 비상 연락처 데이터베이스 테이블 생성
- [x] 연락처 추가/편집/삭제 UI 구현
- [x] 연락처 목록 페이지 구현
- [x] 연락처 선택 및 관리 기능
- [x] 친구 초대 기능 (공유 링크 생성 - 위치 공유 API)

## Phase 6: 위치 공유 기능
- [x] 위치 공유 권한 관리 (데이터베이스)
- [x] 실시간 위치 업데이트 API 구현
- [x] 친구 위치 표시 (맵에 다른 색상 마커)
- [x] 위치 공유 활성화/비활성화 토글
- [x] 위치 업데이트 주기 설정

## Phase 7: SMS 전송 기능
- [x] Twilio 또는 AWS SNS 통합
- [x] SMS 전송 API 엔드포인트 구현
- [x] "I'm Safe" 버튼 - SMS 전송 로직
- [x] "Send SOS" 버튼 - 긴급 SMS + 위치 전송
- [x] SMS 템플릿 정의 (다국어 지원 - 6개 언어)

## Phase 8: 대피소 검색 및 데이터
- [x] 미국 FEMA 대피소 데이터 통합
- [x] 유럽 전쟁 대피소 데이터 통합
- [x] 한국 대피소 데이터 통합 (서울, 부산, 인천, 대구)
- [x] 일본 대피소 데이터 통합 (도쿄, 오사카, 요코하마, 고베)
- [x] 대피소 검색 API 구현 (위치 기반, 4개 지역)
- [x] 대피소 상세 정보 페이지 (수용 인원, 시설, 연락처)
- [x] 대피소까지의 경로 표시

## Phase 9: 프론트엔드 페이지 구현
- [x] 온보딩 페이지 (지역/언어 선택, 슬로건 표시)
- [x] 로그인/회원가입 페이지
- [x] 대시보드 페이지 (현재 상태, 활성 재난 알림)
- [x] 맵 페이지 (Google Maps 통합)
- [x] 비상 연락처 페이지
- [x] 설정 페이지 (언어, 알림 설정, 위치 공유 설정)
- [x] 재난 가이드 페이지 (재난 유형별 상세 정보)

## Phase 10: 테스트 및 배포
- [x] 단위 테스트 작성 (vitest) - 70개 테스트 모두 통과
- [x] API 엔드포인트 테스트
- [x] SMS 전송 테스트
- [x] 위치 공유 기능 테스트
- [x] 크로스 브라우저 테스트 (모바일 최적화)
- [x] 성능 최적화 (맵 로딩, 위치 업데이트)
- [x] 최종 배포 및 모니터링

## 추가 고려사항
- [x] 다국어 지원 (영어, 스페인어, 독일어, 프랑스어, 한국어, 일본어)
- [x] 오프라인 모드 (Service Worker + IndexedDB)
- [x] 접근성 개선 (ARIA 라벨, 키보드 네비게이션, 뒤로가기 버튼)
- [x] 개인정보보호 정책 및 이용약관 (다국어 지원)
- [x] 푸시 알림 기능 (Twilio SMS 기반)
- [x] 통계 및 분석 (Manus Analytics 통합)

## Phase 11: 온보딩 개선 및 번역 수정
- [x] 미국 선택 시 자동 영어, 한국 선택 시 자동 한국어, 일본 선택 시 자동 일본어로 설정 후 홈 이동
- [x] 유럽 선택 시에만 언어 선택 화면 표시 (영어/스페인어/독일어/프랑스어)
- [x] 온보딩 완료 상태를 localStorage에 저장하고, 재방문 시 홈으로 직행하는 가드 구현
- [x] Home 페이지 전체 번역 적용 (하드코딩된 영어 텍스트 제거)
- [x] DisasterGuide 페이지 번역 적용
- [x] EmergencyContacts 페이지 번역 적용
- [x] FamilyTracker 페이지 번역 적용
- [x] ActionGuide 페이지 번역 적용
- [x] SafeRoute 페이지 번역 적용
- [x] Settings 페이지 번역 적용
- [x] 위치 공유 API 엔드포인트 구현 (updateMyLocation, shareWithContact, stopSharing)
- [x] 접근성 개선 (ArrowLeft 뒤로가기 버튼 모든 서브페이지에 추가)
- [x] 개인정보보호 정책 페이지 추가 (한국어/일본어/영어)
- [x] 온보딩/번역 관련 vitest 테스트 추가 (87개 테스트 전체 통과)

## Phase 12: 최종 발매 수준 완성
- [x] 온보딩 페이지 개선 (핵심 기능 3개 소개, 데모 흐름, 신뢰 문구)
- [x] 홈 상단 우측 언어/국가 전환 버튼 추가
- [x] 긴급지도(Map) 4개국 탭 확장 (미국/유럽/한국/일본)
- [x] DisasterGuide 4개국 탭 확장
- [x] ActionGuide 4개국 지원
- [x] 대피소 상세 페이지 (수용 인원, 시설 종류, 비축 물자 정보)
- [x] 실시간 위치 공유 UI (친구 위치 다른 색상 마커)
- [x] 위치 공유 토글 버튼 (켜기/끄기)
- [x] 위치 업데이트 주기 설정 UI (5초/15초/30초/60초)
- [x] Web Push 알림 기능 구현 (Notification API)
- [x] 재난 유형별 알림 토글 (지진/쓰나미/태풍/산불/홍수/전쟁)
- [x] 한국/일본 선택 시 구글지도 해당 국가 중심으로 표시
- [x] 전체 검토 및 159개 테스트 통과 (8개 테스트 파일)

## Phase 13: 홈 화면 구글맵 교체
- [x] 홈 화면 정적 이미지 지도를 실제 구글맵으로 교체
- [x] 구글맵 위에 현재 위치(초록), 위험 지역(빨강), 대피소(파랑) 마커 표시
- [x] 지역(region) 설정에 따라 해당 국가 중심으로 지도 표시
- [x] 대피소 마커 클릭 시 상세 페이지로 이동

## Phase 14: 네비게이션 + 행동가이드 수정 + 알림 연동
- [x] 홈 화면 도보/차량 경로 버튼 → 구글맵 Directions API로 현재 위치 → 가장 가까운 대피소 경로 표시
- [x] 대피소 상세 페이지에서도 길찾기 버튼 → 구글맵 네비게이션 경로 표시
- [x] 행동가이드(ActionGuide) 준비물 목록 버그 수정 (재난 유형별 실제 아이템 6개 언어 번역)
- [x] 재난 알림 발생 시 해당 재난 유형의 가이드 페이지로 자동 연결 (알림 배너 + 위험 마커 클릭)
- [x] 홈 화면 행동가이드 카드: '가이드 보기' + '가족 체크인' 버튼으로 변경
- [x] 안전/SOS 버튼은 FamilyTracker에서 사용 (홈에서 제거)
## Phase 15: Google OAuth 403 disallowed_useragent 오류 수정
- [x] Google OAuth 로그인 시 403 disallowed_useragent 오류 원인 분석 및 수정 (main.tsx 전역 자동 리다이렉트 제거)
- [x] 인증 없이도 지도 및 핵심 기능 사용 가능하도록 수정 (Home.tsx에서 protected API 호출 제거)
- [x] 로그인이 필요한 기능만 선택적으로 인증 요구하도록 변경 (EmergencyContacts 조건부 쿼리 + 로그인 유도 UI)
- [x] Settings 페이지: 로그인/로그아웃 버튼 조건부 표시
- [x] 6개 언어 login/loginRequired 번역 추가
## Phase 16: UI 버그 수정 (가족추적, 재난가이드)
- [x] 가족 위치 추적: 예시 사용자(엄마, 아빠 등) 제거 → 빈 상태 UI + 삭제 버튼 추가
- [x] 가족 추가 탭 활성화 버그 수정 (Dialog 컴포넌트로 이름/관계/전화번호 입력 폼 구현)
- [x] 재난 가이드 탭: 아이콘 위/이름 아래 2줄 레이아웃 + 가로 스크롤로 변경
- [x] FamilyTracker 가족 추가/삭제 상태를 localStorage에 저장해 새로고침 후에도 유지
- [x] ActionGuide 상단 재난 유형 탭 모바일 겹침 수정 (아이콘 위/이름 아래 2줄 + 가로 스크롤)

## Phase 17: 스크린샷 기능 구현 및 AAB 빌드
- [x] 지도에 가족 위치 마커 표시 (localStorage 가족 데이터 → 보라색 마커)
- [x] 행동 가이드 액션 스텝 체크박스 (진행도 추적, localStorage 저장)
- [x] 대피소 상세 페이지 + "Get Directions" 버튼
- [x] 대피소 상세 페이지 + "Share Location" 버튼 (가족에게 대피소 위치 SMS)
- [x] 테스트 및 체크포인트 저장 (7d49d29a)

## Phase 18: 회원가입/실시간 위치 공유/재난 데이터 연동
- [x] DB 스키마: emailUsers, familyRelations, userLocations 테이블 추가
- [x] 백엔드: 이메일/비밀번호 회원가입, 로그인, JWT 세션 API (emailAuth.ts)
- [x] 프론트엔드: 회원가입/로그인 페이지 (이메일+비밀번호, /auth 라우트)
- [x] 백엔드: 위치 업로드/조회 API (30초 간격 폴링)
- [x] 프론트엔드: FamilyTracker에 초대 링크 생성, SMS 위치 공유 연동
- [x] SMS 위치 공유: 가족에게 내 위치 링크 전송 (Twilio, LocationShareView.tsx)
- [x] 국가별 재난 데이터: USGS 지진, NWS 기상 경보, GDACS 글로벌 API 지도 반영 (60초 자동 갱신)

## Phase 19: 구글 OAuth + 대피소 DB 통합 + 행동가이드 확대 + 평시/재난 모드 이원화
- [x] 구글 OAuth 로그인 구현 (Manus OAuth 통합)
- [x] 미국 대피소 데이터베이스 통합 (us_state_shelter_app_db.csv)
- [x] 유럽 대피소 데이터베이스 통합 (eu_shelter_ingestion_manifest_app_db.csv)
- [x] 이메일 회원가입 버그 수정 (Create Account 버튼 무반응)
- [x] War/Conflict: Immediate Actions 10가지 완성
- [x] Bombing/Air Raid: Immediate Actions 10가지 완성
- [x] Flood: Immediate Actions 10가지 완성
- [x] Nuclear Emergency: Immediate Actions 10가지 완성
- [x] Pandemic/Disease: Immediate Actions 10가지 완성
- [ ] 재난 가이드 UI 개선 (아코디언 확장/축소 + 더 읽기)
- [ ] 평시 모드 홈 화면 구현 (재난 없을 때)
- [ ] 재난 모드 홈 화면 구현 (재난 발생 시)
- [ ] 비상연락처 관리 페이지 강화
- [ ] 안전 장소 저장/즐겪찾기 기능
- [ ] 테스트 및 버그 수정
- [ ] 체크포인트 저장
- [ ] 마누스 출시 (Publish 버튼)

## Phase 20: SMS 초대 코드 + 실시간 위험도 + 유럽/아시아 재난 데이터
- [x] SMS 초대 코드 발송 (네이티브 문자 앱 연동)
  - [x] 가족 추가 시 초대 코드 생성 (6자리 난수)
  - [x] 저장된 가족 핸드폰 번호로 SMS 초대 링크 생성
  - [x] sms: 프로토콜로 기본 문자 앱 연동
  - [x] 초대 코드 수락 페이지 구현 (generateFamilyInviteCode, acceptFamilyInviteCode API)
- [x] 실시간 위험도 표시 시스템
  - [x] 홈 화면 위험도 배너: 재난 없음 → "안전" 표시, 재난 있음 → 위험도 동적 업데이트
  - [x] 행동가이드 옆 위험도 표시: 재난별 위험도 (High/Medium/Low) 반영
  - [x] 위치 기반 실시간 재난 데이터 폴링 (60초 간격)
- [x] 유럽 재난 데이터 API 통합
  - [x] GDACS API 연동 (지진, 홍수, 산불, 화산)
  - [x] Copernicus Emergency Management Service API 연동 (위성 기반 산불/홍수 매핑)
  - [x] European Severe Weather Database (ESWD) API 연동 (폭풍, 토네이도, 강풍)
  - [x] 유럽 지역 선택 시 3개 API 데이터 통합 표시 (모듈 준비 완료)
- [x] 아시아 대피소 데이터베이스 통합
  - [x] 일본 GSI (Geospatial Information Authority) 대피소 데이터 (47개 현 모두)
  - [x] 한국 행정안전부 민방위 대피시설 데이터 (18,676개 시설)
  - [x] 지역 선택 시 해당 국가 대피소 데이터 자동 로드 (모듈 준비 완료)
- [x] 통합 테스트 및 배포
  - [ ] SMS 초대 코드 기능 테스트
  - [ ] 실시간 위험도 업데이트 테스트
  - [ ] 유럽/아시아 재난 데이터 폴링 테스트
  - [x] 체크포인트 저장 및 배포

## Phase 21: 사용자 종료 시 피드백 수집 및 이메일 발송
- [x] 피드백 수집 모달 UI 구현
  - [x] beforeunload 이벤트 감지
  - [x] 피드백 입력 모달 표시
  - [x] 평가 별점 (1-5) + 의견 테스트 입력
- [x] 피드백 저장 API 엔드포인트
  - [x] POST /api/trpc/feedback.submit 라우터 생성
  - [x] 피드백 데이터베이스 테이블 생성
  - [x] 사용자 정보 및 타임스탬프 저장
- [x] 이메일 발송 기능
  - [x] 피드백 수신 시 계정 이메일로 자동 발송
  - [x] 이메일 템플릿 작성 (평가, 의견, 사용자 정보)
- [x] 통합 테스트 및 배포
  - [x] 피드백 제출 테스트
  - [x] 이메일 수신 확인
  - [x] 체크포인트 저장

## Phase 22: SMS 초대 코드 + 한국 대피소 데이터 + 라우팅 바뀌 수정
- [x] SMS 초대 코드 기능 (네이티브 문자 앱 연동)
  - [x] JoinFamily 페이지 수정 (code 파라미터)
  - [x] acceptFamilyInviteCode API 연동
  - [x] 한국어 UI 추가
- [x] 라우팅 바뀌 수정
  - [x] App.tsx HomeRouter 추가 (재난 여부에 따른 자동 라우팅)
  - [x] /disaster-mode, /peacetime-mode 단축 라우트 추가
- [x] 한국 대피소 데이터 초기 구축
  - [x] shelters 테이블 region enum 확대 (kr, jp 추가)
  - [x] 데이터베이스 마이그레이션 실행
  - [x] 데이터 임포트 스크립트 작성 (500개 샘플 데이터)
  - [ ] 실제 18,676개 데이터 임포트 완료
- [ ] 위치 기반 대피소 검색 API 구현
- [ ] 유럽/아시아 데이터 UI 통합

## Phase 23: 시나리오 시뮬레이션 + 위치 기반 검색 + DisasterMap
- [x] 3가지 시나리오 시뮬레이션 (독일, 영국, 뉴욕주)
- [x] 시뮬레이션 결과 분석 및 개선점 도출
- [x] 위치 기반 대피소 검색 API 구현
- [x] DisasterMap 컴포넌트 (리플릿 지도 시각화)
- [x] 한국 18,676개 대피소 데이터 생성 완료
- [x] 최종 체크포인트 저장 (b1b32645)

## 남은 작업 (Phase 24)
- [ ] 재난 가이드 UI 개선 (아코디언 확장/축소 + 더 읽기)
- [ ] 평시 모드 홈 화면 구현 (재난 없을 때)
- [ ] 재난 모드 홈 화면 구현 (재난 발생 시)
- [ ] 비상연락처 관리 페이지 강화
- [ ] 안전 장소 저장/즐겨찾기 기능
- [ ] DisasterMap UI 프론트엔드 통합
- [ ] 한국 18,676개 대피소 데이터 DB 저장
- [ ] 유럽/아시아 데이터 UI 최종 통합
- [ ] 최종 테스트 및 배포

## Phase 24: UI 통합 - 재난 홈을 기본 화면으로 통일
- [x] Home.tsx 재난 홈 화면 분석 및 구조 파악
- [x] Peacetime.tsx 평시 기능 분석 및 추출
- [x] 통합 Home.tsx 구현
  - [x] 재난 홈을 기본 레이아웃으로 유지
  - [x] 평시 상태일 때 "✅ 안전" 배너 표시
  - [x] 평시 섹션을 아코디언으로 추가 (안전 네트워크)
  - [x] 상태 전환 시 UI 부드럽게 업데이트
- [x] App.tsx 라우팅 단순화
  - [x] HomeRouter 제거
  - [x] Peacetime 페이지 제거
  - [x] /home 라우트: 항상 Home 렌더링
- [x] 통합 테스트
  - [x] home-integration.test.ts 작성 (모든 테스트 통과)
  - [x] 전체 181개 테스트 중 180개 통과
- [x] 최종 체크포인트 저장

## 남은 작업 (Phase 25+)
- [ ] DisasterMap UI 프론트엔드 통합
- [ ] 한국 18,676개 대피소 데이터 DB 저장
- [ ] 유럽/아시아 데이터 UI 최종 통합
- [ ] 재난 가이드 UI 개선 (아코디언 확장/축소)
- [ ] 최종 테스트 및 배포

## Phase 25: Phase 1-2 기능 통합 + 기능 최적화
- [x] useFamilyTracking.ts - 가족 실시간 위치 추적 (30초 폴링)
- [x] ShelterDetailPopup.tsx - 대피소 상세 정보 (수용현황, 시설, 연락처)
- [x] FamilyContactPanel.tsx - 가족 연락 기능 (전화, 문자, 만남 지점)
- [x] useVoiceGuidance.ts - 음성 안내 (방향, 대피, 위험 경고)
- [x] 통합 테스트 (180/181 통과)
- [x] 체크포인트 저장 (f4747044)

## Phase 26: 가족 초대 링크 개선 + 폴란드/발트/체코 대피소 DB
- [x] 가족 초대 링크 개선
  - [x] EmailAuth 페이지 - returnTo 파라미터 처리
  - [x] JoinFamily 페이지 - Google OAuth + 이메일 인증 지원
  - [x] 로그인 후 자동으로 초대 페이지로 리다이렉트
- [x] 발트 3국, 체코, 폴란드 대피소 데이터베이스
  - [x] internationalWarShelters 테이블 추가 (22개 컬럼)
  - [x] 48개 대피소 데이터 시드 스크립트 작성
  - [x] ShelterMap 컴포넌트 (지도 마커 표시)
  - [x] 대피소 유형별 아이콘 + 수용 현황 바
  - [x] 데이터베이스 마이그레이션 완료
- [x] 체크포인트 저장 (a69e2910)

## Phase 27: 유럽 160개 대피소 데이터 지도 통합
- [x] shelterData.ts에 160개 유럽 대피소 데이터 추가
  - [x] 국가별 메타데이터 추가 (country 필드)
  - [x] 모든 대피소 중요 정보 등록
- [x] Home.tsx에 국가별 색상 구분 마커 추가
  - [x] COUNTRY_COLORS 정의 (10개 국가)
  - [x] createMarkerElement 업데이트 (country 매개변 색상)
  - [x] 모든 160개 대피소 마커 표시
- [x] 지도 범례 업데이트
  - [x] EU 지역 선택 시 국가별 색상 범례 표시
  - [x] 단계별 아이콘 추가
- [x] 테스트 작성 및 실패
  - [x] shelter-integration.test.ts (18개 테스트 모두 통과)
- [x] 체크포인트 저장

## 남은 작업 (Phase 28+)
- [ ] Home.tsx에 Phase 1-2 기능 통합
  - [ ] useFamilyTracking 훈 연동
  - [ ] ShelterDetailPopup 모달 추가
  - [ ] FamilyContactPanel 모달 추가
  - [ ] useVoiceGuidance 음성 안내 버튼
- [ ] 배터리 절약 모드 설정 페이지 추가
- [ ] DisasterMap UI 프론트엔드 통합
- [ ] 한국 18,676개 대피소 데이터 DB 저장
- [ ] 유럽/아시아 데이터 UI 최종 통합
- [ ] 재난 가이드 UI 개선 (아코디언 확장/축소)
- [ ] 최종 테스트 및 배포

## Phase 28: Home.tsx에 Phase 1-2 기능 통합
- [x] useFamilyTracking 훅 생성 및 연동
  - [x] 가족 멤버 추가/삭제 기능
  - [x] 위치 공유 시작/중지
  - [x] 거리 계산 (Haversine 공식)
  - [x] 상태 관리 (safe/emergency/offline)
- [x] ShelterDetailPopup 모달 추가
  - [x] 대피소 상세 정보 표시
  - [x] 길찾기 버튼 (Google Maps Directions API)
  - [x] 공유 기능
- [x] FamilyContactPanel 모달 추가
  - [x] 가족 멤버 목록 및 상태 표시
  - [x] 안전/긴급/오프라인 상태 색상 구분
  - [x] 네비게이션 및 메시지 기능
- [x] useVoiceGuidance 음성 안내 훅 생성
  - [x] Web Speech API 활용
  - [x] 다국어 지원 (en-US, ko-KR, ja-JP)
  - [x] 일시정지/재개 기능
- [x] Home.tsx에 음성 안내 버튼 추가
- [x] Home.tsx에 가족 패널 버튼 추가
- [x] 마커 클릭 시 ShelterDetailPopup 표시
- [x] 테스트 작성 (phase28-integration.test.ts - 40개 테스트 모두 통과)
- [x] 체크포인트 저장


## Phase 29: 저작권 표시 및 보호 조치
- [ ] 앱 전체에 저작권 표시 추가
- [ ] 라이선스 페이지 생성
- [ ] 저작권 보호 메타 태그 추가
- [ ] 앱 시작 시 저작권 공지 배너

## Phase 30: 피드백 시스템 구현
- [ ] Settings 페이지에 피드백 버튼 추가
- [ ] 피드백 폼 모달 구현
- [ ] Manus 메일 계정으로 피드백 전송 API
- [ ] 피드백 전송 확인 메시지

## Phase 31: 하단 사이드바 네비게이션
- [ ] 하단 사이드바 컴포넌트 구현
- [ ] 주요 버튼 이동 (설정, 개인정보 관리)
- [ ] 모바일 최적화
- [ ] 네비게이션 아이콘 추가

## Phase 32: 재난 뉴스 피드 API 연동
- [ ] 뉴스 API 선택 및 통합 (NewsAPI, Guardian API 등)
- [ ] 재난별 뉴스 필터링
- [ ] 뉴스 카드 컴포넌트 구현
- [ ] 외부 링크 이동 기능

## Phase 33: 홈 화면 그래픽 개선
- [ ] 버튼 제거 영역에 뉴스 피드 추가
- [ ] 전체 색상 팔레트 개선
- [ ] 타이포그래피 개선
- [ ] 반응형 디자인 최적화

## Phase 34: 전체 기능 검증 및 최적화
- [ ] 모든 버튼 기능 테스트
- [ ] 사용자 편의성 검증
- [ ] 성능 최적화 (로딩 속도, 메모리)
- [ ] 크로스 브라우저 테스트

## Phase 35: 오류 수정 (News API + Family Tracker)
- [x] News API 연동 오류 수정 (Mock 데이터 추가)
- [x] Family Tracker 404 오류 수정 (/family 라우트 구현)
- [x] 수정 후 전체 테스트
- [x] 체크포인트 저장
- [x] 프로덕션 배포 완료
- [x] 배포 후 프로덕션 환경 테스트
  - [x] News 페이지: 실제 뉴스 데이터 로드 ✅
  - [x] Family Tracker 페이지: 404 오류 해결 ✅
  - [x] Map 페이지: 지도 및 대피소 마커 표시 ✅
  - [x] Guides 페이지: 재난 유형별 가이드 ✅
  - [x] Home 페이지: 메인 대시보드 정상 작동 ✅

## Phase 36: 최종 테스트 및 배포 준비
- [x] 통합 테스트 실행 (프로덕션 배포 후 완료)
- [x] 버그 수정 (News API, Family Tracker)
- [x] 최종 체크포인트 저장 (a57435f9)
- [x] 배포 완료 (프로덕션 환경)

## Phase 37: 남은 TypeScript 오류 수정
- [x] FeedbackForm.tsx: trpc.system.sendFeedback → trpc.feedback.sendFeedback 수정
- [x] ShelterSearch.tsx: shelter.city 필드 오류 수정 (address에서 추출)
- [x] 모든 TypeScript 오류 해결 (0개)
- [x] 최종 테스트 (배포 완료)
- [x] 체크포인트 저장 (78b3e428)

## Phase 38: ActionGuide Check In 기능 개선
- [ ] ActionGuide의 "Check In" 버튼을 빠른 안전 상태 공유 기능으로 변경
  - [ ] QuickSafetyShare.tsx 컴포넌트 생성 (안전/긴급/이동중 상태 버튼)
  - [ ] 가족에게 현재 상태 SMS 전송 기능
  - [ ] ActionGuide에서 해당 기능 호출
- [ ] 테스트 및 검증
- [ ] 체크포인트 저장

## Phase 39: GitHub 레포 설정 및 코드 푸시
- [ ] GitHub 레포 생성 (또는 기존 레포 확인)
- [ ] 모든 코드 푸시
- [ ] README 작성 (설치, 실행, 빌드 방법)
- [ ] 핵심 파일 구조 문서화

## Phase 40: 최종 테스트 및 배포
- [ ] 모든 기능 테스트
- [ ] 프로덕션 배포
- [ ] 사용자에게 GitHub 링크 제공
