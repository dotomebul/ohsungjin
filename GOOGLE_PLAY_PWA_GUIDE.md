# Google Play Console에서 PWA 앱 배포하기 - Evacora

## 📱 PWA란?
**Progressive Web App (PWA)**는 웹 기술로 만들어진 앱으로, Google Play Console에서 **Trusted Web Activity (TWA)** 형식으로 배포할 수 있습니다. Play Console이 자동으로 AAB를 생성하고 서명 처리합니다.

---

## 🚀 Step-by-Step 가이드

### Step 1: Google Play Console 접속
1. [Google Play Console](https://play.google.com/console) 접속
2. **tjdwls5068@gmail.com**으로 로그인
3. 좌측 메뉴 → **모든 앱** → **새 앱 만들기** 클릭

### Step 2: 앱 기본 정보 입력
```
앱 이름: Evacora
기본 언어: English
앱 또는 게임: 앱
유료 또는 무료: 무료
```
→ **만들기** 클릭

### Step 3: 앱 세부정보 작성

#### 3.1 앱 액세스 (좌측 메뉴)
- **앱 액세스**: "전체 기능 액세스" 선택

#### 3.2 광고 (좌측 메뉴)
- **광고**: "이 앱에 광고가 없습니다" 선택

#### 3.3 콘텐츠 등급 (좌측 메뉴)
1. **콘텐츠 등급 설문지** 작성
   - 모든 항목: "해당 없음" 선택
   - 제출

#### 3.4 대상 연령 (좌측 메뉴)
- **대상 연령**: "3세 이상" 선택

#### 3.5 정책 (좌측 메뉴)
1. **개인정보보호정책**:
   ```
   https://crisisapp-lnadnnql.manus.space/privacy-policy
   ```

2. **이용약관** (선택사항):
   ```
   https://crisisapp-lnadnnql.manus.space/terms-of-service
   ```

3. **기타 정책** (필요시):
   - 모두 "해당 없음" 선택

### Step 4: 앱 설명 작성 (좌측 메뉴 → 스토어 설정)

#### 4.1 앱 이름
```
Evacora
```

#### 4.2 짧은 설명 (80자 이내)
```
Real-time emergency guidance, shelter routing, family location sharing
```

#### 4.3 전체 설명 (4000자 이내)
```
Evacora is a free emergency safety app providing real-time crisis guidance, 
nearest shelter routing, and family location sharing.

KEY FEATURES:
• Real-time Disaster Alerts - Instant warnings for earthquakes, wildfires, 
  tsunamis, hurricanes, floods, and more
• Safe Shelter Routing - Find nearest shelters with capacity and directions
• Family Location Tracker - Share location with family, get danger zone alerts
• Disaster Action Guides - Step-by-step instructions in 6 languages
• SMS Safety Check-ins - Send "I'm Safe" or SOS to emergency contacts

SUPPORTED REGIONS:
• United States (FEMA shelters)
• Europe (War shelters)
• South Korea (Government shelters)
• Japan (Disaster shelters)

LANGUAGES: English, 한국어, 日本語, Español, Deutsch, Français

PRIVACY FIRST: Your location is encrypted and only shared with authorized family members.

FREE & OPEN: No ads, no premium features. Emergency safety for everyone.
```

### Step 5: 스크린샷 및 아이콘 업로드 (좌측 메뉴 → 스토어 설정)

#### 5.1 휴대폰 스크린샷 (필수)
1. **스크린샷** 섹션 스크롤
2. **추가** 버튼 클릭
3. 다음 5개 이미지 업로드:
   - `evacora-screenshot-1.png` (홈 화면)
   - `evacora-screenshot-2.png` (지도)
   - `evacora-screenshot-3.png` (행동 가이드)
   - `evacora-screenshot-4.png` (가족 추적)
   - `evacora-screenshot-5.png` (대피소 상세)

#### 5.2 앱 아이콘 (필수)
1. **앱 아이콘** 섹션 찾기
2. `evacora-icon-512x512.png` 업로드

#### 5.3 기능 그래픽 (선택사항)
- 생략 가능

### Step 6: 카테고리 및 콘텐츠 등급

#### 6.1 카테고리 (좌측 메뉴 → 스토어 설정)
```
주 카테고리: 안전 (Safety)
또는: 지도 및 네비게이션 (Maps & Navigation)
```

#### 6.2 콘텐츠 등급
- 이미 Step 3.3에서 작성함

### Step 7: 대상 국가 설정 (좌측 메뉴 → 배포)

1. **국가/지역** 클릭
2. 다음 국가 선택:
   - ✅ 미국 (United States)
   - ✅ 독일 (Germany)
   - ✅ 프랑스 (France)
   - ✅ 스페인 (Spain)
   - ✅ 영국 (United Kingdom)
   - ✅ 이탈리아 (Italy)
   - (선택사항) 한국, 일본 추후 추가 가능

### Step 8: 가격 설정 (좌측 메뉴 → 배포)

1. **가격** 클릭
2. **무료** 선택
3. 저장

### Step 9: 릴리스 생성 (좌측 메뉴 → 릴리스)

#### 9.1 프로덕션 트랙 설정
1. **프로덕션** 클릭
2. **새 릴리스 만들기** 클릭

#### 9.2 AAB/APK 업로드
**중요**: Google Play Console에서 자동으로 AAB를 생성하려면, **Trusted Web Activity** 형식을 사용해야 합니다.

**옵션 A: Google Play Console 자동 생성 (권장)**
1. "AAB 또는 APK 추가" 클릭
2. 다음 정보 입력:
   ```
   앱 URL: https://crisisapp-lnadnnql.manus.space
   패키지명: com.evacora.app
   ```
3. Play Console이 자동으로 AAB 생성 및 서명

**옵션 B: 수동 AAB 업로드**
- 미리 생성한 AAB 파일 업로드 (이 가이드에서는 불필요)

#### 9.3 릴리스 정보 입력
1. **릴리스 정보** 입력:
   ```
   버전: 1.0.0
   릴리스 노트: 
   - Initial release of Evacora
   - Real-time emergency guidance
   - Shelter routing and family location sharing
   ```

2. **저장** → **검토 제출** 클릭

### Step 10: 검토 대기
- **검토 시간**: 2-3시간 (최대 24시간)
- **상태 확인**: Play Console 대시보드에서 "검토 중" 표시
- **승인 후**: 자동으로 Play Store에 배포됨

---

## ✅ 체크리스트

### 필수 항목
- [ ] Google Play Console 계정 로그인 (tjdwls5068@gmail.com)
- [ ] 새 앱 "Evacora" 생성
- [ ] 앱 이름, 짧은 설명, 전체 설명 입력
- [ ] 스크린샷 5개 업로드
- [ ] 앱 아이콘 업로드
- [ ] 개인정보보호정책 URL 입력
- [ ] 콘텐츠 등급 설문지 완료
- [ ] 카테고리 선택 (안전 또는 지도/네비게이션)
- [ ] 대상 국가 설정 (미국, 유럽)
- [ ] 가격 설정 (무료)
- [ ] 앱 URL 입력: `https://crisisapp-lnadnnql.manus.space`
- [ ] 릴리스 정보 입력
- [ ] 검토 제출

### 선택사항
- [ ] 기능 그래픽 업로드
- [ ] 이용약관 URL 입력
- [ ] 추가 국가 선택 (한국, 일본 등)

---

## 🔧 앱 URL 정보

| 항목 | 값 |
|------|-----|
| **앱 URL** | https://crisisapp-lnadnnql.manus.space |
| **패키지명** | com.evacora.app |
| **앱 이름** | Evacora |
| **버전** | 1.0.0 |
| **개인정보보호정책** | https://crisisapp-lnadnnql.manus.space/privacy-policy |
| **이용약관** | https://crisisapp-lnadnnql.manus.space/terms-of-service |

---

## 📸 스크린샷 정보

| 순서 | 파일명 | 설명 |
|------|--------|------|
| 1 | evacora-screenshot-1.png | 홈 화면 - 3가지 핵심 기능 소개 |
| 2 | evacora-screenshot-2.png | 지도 - 위치, 위험 지역, 대피소, 가족 공유 |
| 3 | evacora-screenshot-3.png | 행동 가이드 - 재난 유형, 진행도, 준비물 |
| 4 | evacora-screenshot-4.png | 가족 추적 - 빈 상태 + 추가 다이얼로그 |
| 5 | evacora-screenshot-5.png | 대피소 상세 - 정보 + 길찾기 |

---

## 🎨 앱 아이콘 정보

| 항목 | 값 |
|------|-----|
| **파일명** | evacora-icon-512x512.png |
| **크기** | 512x512 픽셀 |
| **형식** | PNG |
| **배경** | 흰색 또는 투명 |
| **디자인** | 빨간 방패 + 위치 핀 + 동심원 |

---

## ❓ FAQ

### Q1: "앱 URL"에 입력할 주소는?
**A**: `https://crisisapp-lnadnnql.manus.space` (Manus에서 자동 생성된 도메인)

### Q2: 패키지명은 어떻게 정하나?
**A**: Google Play Console이 자동으로 생성합니다. 기본값: `com.evacora.app`

### Q3: AAB 파일을 직접 생성해야 하나?
**A**: 아니요. Play Console이 앱 URL에서 자동으로 AAB를 생성합니다.

### Q4: 검토가 거부되면?
**A**: 일반적인 거부 사유:
- 개인정보보호정책 URL 접근 불가 → URL 확인
- 스크린샷 품질 낮음 → 고해상도 이미지 재업로드
- 정책 위반 → 앱 설명 수정

### Q5: 업데이트는 어떻게 하나?
**A**: 웹앱을 수정 후 Manus에서 "Publish" 클릭 → 자동으로 Play Store에 반영 (재검토 불필요)

---

## 📞 지원

**문제 발생 시:**
1. [Google Play Console 도움말](https://support.google.com/googleplay/android-developer)
2. [Trusted Web Activity 가이드](https://developers.google.com/web/android/trusted-web-activity)
3. Manus 지원팀: https://help.manus.im

---

## ✨ 성공 팁

1. **스크린샷 품질**: 1080x1920px 고해상도 사용
2. **설명 작성**: 명확하고 간결하게 작성
3. **정책 페이지**: 반드시 접근 가능해야 함
4. **테스트**: 검토 제출 전 웹앱 정상 작동 확인
5. **인내심**: 검토 시간 2-3시간 소요

**축하합니다! 이제 Google Play Store에 Evacora를 배포할 준비가 되었습니다! 🚀**
