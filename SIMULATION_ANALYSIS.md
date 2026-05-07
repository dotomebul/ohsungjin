# 3가지 시나리오 시뮬레이션 분석 및 개선점

## 📊 시뮬레이션 결과 요약

### 1. 🇩🇪 독일 - 홍수 재난
- **위치:** 베를린 (52.52°N, 13.405°E)
- **재난:** 스프레 강 범람 경고 (심각도: High)
- **거리:** 5km
- **가장 가까운 대피소:** Tempelhof Airport (5.2km, 5000명 수용)
- **행동 가이드:** 높은 곳으로 이동 → 가족 연락 → 대피소 확인

### 2. 🇬🇧 영국 - 폭풍 재난
- **위치:** 런던 (51.5074°N, -0.1278°E)
- **재난:** 강풍 폭풍 경보 (시속 80km, 심각도: High)
- **거리:** 2km
- **가장 가까운 대피소:** Earls Court (5.1km, 2000명 수용)
- **행동 가이드:** 실내 이동 → 창문 닫기 → 물건 고정

### 3. 🇺🇸 뉴욕주 - 지진 재난
- **위치:** 뉴욕시 (40.7128°N, -74.006°W)
- **재난:** 지진 (규모 5.2, 심각도: High)
- **거리:** 0km (현재 위치)
- **가장 가까운 대피소:** Madison Square Garden (4.3km, 4000명 수용)
- **행동 가이드:** 안전한 장소 이동 → 떨어지는 물건 피하기 → 가족 연락

---

## 🔍 분석 결과

### ✅ 현재 잘 작동하는 기능
1. **실시간 재난 데이터 표시** - 3가지 시나리오 모두 정확하게 표시됨
2. **위치 기반 거리 계산** - Haversine 공식으로 정확한 거리 계산
3. **행동 가이드 제시** - 재난 유형별 맞춤형 가이드 제공
4. **대피소 정보 조회** - 수용인원, 타입, 거리 정보 제공

### ⚠️ 개선이 필요한 부분

#### 1. **위치 기반 대피소 검색 API 부재**
**문제:**
- 현재는 하드코딩된 대피소만 표시
- 실제 사용자 위치에서 동적으로 대피소 검색 불가
- 반경 N km 내 대피소 필터링 기능 없음

**해결 방안:**
```typescript
// 구현할 API 엔드포인트
POST /api/trpc/shelters.findNearby
Input: { latitude, longitude, radiusKm, disasterType }
Output: [
  { id, name, distance, capacity, type, address, phone, amenities }
]
```

**기대 효과:**
- 사용자 위치에서 가장 가까운 대피소 즉시 검색
- 실시간 수용 가능 인원 표시
- 길 안내 (Google Maps 연동)

---

#### 2. **유럽/아시아 데이터 UI 통합 부재**
**문제:**
- GDACS, Copernicus, ESWD API 데이터가 준비되었지만 UI에 미통합
- 지도에 재난 지점 표시 안 됨
- 재난별 아이콘/색상 구분 없음

**해결 방안:**
```typescript
// 구현할 UI 컴포넌트
<DisasterMap
  disasters={disasters}
  userLocation={userLocation}
  shelters={shelters}
  onDisasterClick={handleDisasterClick}
  onShelterClick={handleShelterClick}
/>

// 재난 아이콘 매핑
const disasterIcons = {
  earthquake: '🌍',
  flood: '💧',
  wildfire: '🔥',
  storm: '⛈️',
  volcano: '🌋',
  tsunami: '🌊'
};

// 심각도별 색상
const severityColors = {
  low: '#22c55e',      // 초록
  medium: '#f59e0b',   // 주황
  high: '#ef4444'      // 빨강
};
```

**기대 효과:**
- 지도에 재난 지점 시각화
- 재난별/심각도별 구분 용이
- 실시간 업데이트 (60초 폴링)

---

#### 3. **한국 18,676개 대피소 데이터 미통합**
**문제:**
- 현재 500개 샘플 데이터만 저장
- 전체 18,676개 데이터 임포트 미완료
- 지역별 필터링 기능 없음

**해결 방안:**
```typescript
// 임포트 스크립트 개선
const importKoreaShelters = async () => {
  // 1. 행정안전부 API에서 전체 데이터 수집
  const allShelters = await fetchFromGovernmentAPI();
  
  // 2. 배치 임포트 (1000개씩)
  for (let i = 0; i < allShelters.length; i += 1000) {
    await db.insert(shelters).values(
      allShelters.slice(i, i + 1000)
    );
  }
  
  // 3. 지역별 인덱스 생성
  await db.raw(`
    CREATE INDEX idx_shelters_region ON shelters(region);
    CREATE INDEX idx_shelters_location ON shelters(latitude, longitude);
  `);
};

// 쿼리 최적화
const findSheltersInRegion = async (region, limit = 100) => {
  return db.select().from(shelters)
    .where(eq(shelters.region, region))
    .limit(limit);
};
```

**기대 효과:**
- 한국 전역 대피소 데이터 활용
- 지역별 빠른 검색
- 오프라인 모드 지원 가능

---

## 🚀 구현 우선순위

### Phase 3: 위치 기반 대피소 검색 API (1순위)
**이유:** 가장 중요한 기능, 다른 기능의 기반
**예상 시간:** 2-3시간
**구현 내용:**
- tRPC 라우터: `shelters.findNearby`
- DB 쿼리 최적화 (인덱스 추가)
- 거리 계산 로직 (Haversine)
- 수용 가능 인원 실시간 업데이트

### Phase 4: 유럽/아시아 데이터 UI 통합 (2순위)
**이유:** 사용자 경험 향상, 시각적 명확성
**예상 시간:** 3-4시간
**구현 내용:**
- DisasterMap 컴포넌트
- 재난 아이콘/색상 매핑
- 실시간 폴링 (60초)
- 모바일 반응형 디자인

### Phase 5: 한국 18,676개 대피소 데이터 임포트 (3순위)
**이유:** 데이터 완성도, 한국 사용자 경험
**예상 시간:** 1-2시간
**구현 내용:**
- 배치 임포트 스크립트
- DB 인덱스 최적화
- 지역별 필터링
- 오프라인 모드 준비

---

## 📈 성능 개선 목표

| 지표 | 현재 | 목표 | 방법 |
|------|------|------|------|
| 대피소 검색 응답시간 | N/A | <500ms | DB 인덱스 + 캐싱 |
| 지도 업데이트 주기 | N/A | 60초 | 폴링 + WebSocket |
| 지원 국가 | 3개 | 50개+ | API 통합 |
| 대피소 데이터 | 500개 | 18,676개+ | 배치 임포트 |

---

## 🎯 다음 단계

1. **Phase 3 시작:** 위치 기반 대피소 검색 API 구현
2. **DB 마이그레이션:** 인덱스 추가 및 최적화
3. **테스트:** 3가지 시나리오로 재검증
4. **배포:** 새로운 기능 라이브 반영

---

## 📝 체크리스트

- [ ] Phase 3: 위치 기반 대피소 검색 API
  - [ ] tRPC 라우터 구현
  - [ ] DB 쿼리 최적화
  - [ ] 테스트 코드 작성
- [ ] Phase 4: 유럽/아시아 데이터 UI
  - [ ] DisasterMap 컴포넌트
  - [ ] 실시간 폴링 구현
  - [ ] 모바일 반응형 디자인
- [ ] Phase 5: 한국 대피소 데이터
  - [ ] 배치 임포트 완료
  - [ ] 인덱스 생성
  - [ ] 성능 테스트
- [ ] 최종 테스트 및 배포
