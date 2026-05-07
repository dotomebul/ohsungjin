# Google Play Console 출시 가이드 - Evacora

## 📋 준비 완료 자산

### 1. 앱 정보
- **앱 이름**: Evacora
- **패키지명**: com.evacora.app (Play Console에서 설정)
- **카테고리**: 긴급/안전 (Safety)
- **대상 국가**: 미국, 유럽
- **가격**: 무료
- **개발자 계정**: tjdwls5068@gmail.com

### 2. 생성된 자산
- ✅ 앱 아이콘 (512x512px) - `/home/ubuntu/webdev-static-assets/evacora-icon-512x512.png`
- ✅ Play Store 스크린샷 5개 (1080x1920px)
  - 홈 화면 (기능 소개)
  - 지도 (위치 공유, 대피소)
  - 행동 가이드 (재난 대응)
  - 가족 추적 (위치 공유)
  - 대피소 상세 (정보 + 길찾기)
- ✅ 개인정보보호정책 페이지 (영어/한국어)
- ✅ 이용약관 페이지 (영어/한국어)

### 3. 정책 페이지 URL
- **개인정보보호정책**: `https://crisisapp-lnadnnql.manus.space/privacy-policy`
- **이용약관**: `https://crisisapp-lnadnnql.manus.space/terms-of-service`

---

## 🚀 Play Console 업로드 단계

### Step 1: Play Console 접속
1. [Google Play Console](https://play.google.com/console) 접속
2. tjdwls5068@gmail.com으로 로그인
3. 새 앱 만들기 → "Evacora" 입력

### Step 2: 앱 세부정보 작성
1. **앱 이름**: Evacora
2. **기본 언어**: English
3. **카테고리**: Safety (긴급/안전)
4. **콘텐츠 등급**: 
   - 폭력: 없음
   - 성인 콘텐츠: 없음
   - 기타: 모두 "없음"
5. **대상 연령**: 3세 이상
6. **개인정보보호정책**: `https://crisisapp-lnadnnql.manus.space/privacy-policy`

### Step 3: 앱 설명
**짧은 설명** (80자):
```
Real-time emergency guidance, nearest shelter routing, family location sharing
```

**전체 설명** (4000자):
```
Evacora is a free emergency safety app that provides real-time crisis guidance, 
finds the nearest shelters with capacity and supplies, and enables one-tap family 
check-ins with live location sharing.

Key Features:
• Real-time Disaster Alerts - Get instant emergency warnings for earthquakes, 
  wildfires, tsunamis, hurricanes, floods, tornadoes, and more
• Safe Shelter Routing - Find nearest shelters with capacity, amenities, and 
  turn-by-turn directions
• Family Location Tracker - Share your location with family members and receive 
  instant alerts if they enter danger zones
• Disaster Action Guides - Step-by-step instructions for 8+ disaster types in 
  6 languages (English, Korean, Japanese, Spanish, German, French)
• SMS Safety Check-ins - Send "I'm Safe" or SOS alerts to your emergency contacts

Supported Regions:
• United States (FEMA shelters)
• Europe (War shelters)
• South Korea (Government shelters)
• Japan (Disaster shelters)

Languages: English, 한국어, 日本語, Español, Deutsch, Français

Privacy First: Your location data is encrypted and only shared with family members 
you explicitly authorize. We never sell your data.

Offline Ready: Download disaster guides for offline access when internet is unavailable.

Free & Open: No ads, no premium features. Emergency safety should be accessible to everyone.
```

### Step 4: 스크린샷 업로드
1. **휴대폰 스크린샷** (필수, 최소 2개):
   - 업로드: evacora-screenshot-1.png (홈 화면)
   - 업로드: evacora-screenshot-2.png (지도)
   - 업로드: evacora-screenshot-3.png (행동 가이드)
   - 업로드: evacora-screenshot-4.png (가족 추적)
   - 업로드: evacora-screenshot-5.png (대피소 상세)

2. **기능 그래픽** (선택사항):
   - 1200x500px 이미지 (앱 특징 강조)

### Step 5: 아이콘 업로드
1. **앱 아이콘**: evacora-icon-512x512.png 업로드

### Step 6: 콘텐츠 등급 설문지
1. Play Console → 콘텐츠 등급 → 설문지 작성
2. 모든 항목에 "해당 없음" 선택
3. 제출

### Step 7: 대상 국가 설정
1. **배포 국가**:
   - ✅ 미국 (United States)
   - ✅ 유럽 (Germany, France, Spain, Italy, UK, etc.)
   - 선택사항: 한국, 일본 (추후 추가 가능)

### Step 8: 가격 설정
1. **가격**: 무료 선택

### Step 9: 이용약관 및 정책
1. **개인정보보호정책**: `https://crisisapp-lnadnnql.manus.space/privacy-policy`
2. **이용약관**: `https://crisispath-lnadnnql.manus.space/terms-of-service`

---

## 🔧 PWA → Play Store 배포 (Trusted Web Activity)

Evacora는 PWA(Progressive Web App)이므로, Google Play에 직접 배포하려면 **Trusted Web Activity (TWA)** 래퍼가 필요합니다.

### 옵션 A: Manus 자동 배포 (권장)
Manus 플랫폼이 자동으로 TWA AAB를 생성하고 Play Console에 업로드할 수 있습니다:
1. Manus 관리 UI → Publish → "Deploy to Google Play"
2. Play Console 계정 연결 (OAuth)
3. 자동 배포 완료

### 옵션 B: 수동 TWA 빌드
1. [Bubblewrap CLI](https://github.com/GoogleChromeLabs/bubblewrap) 설치
2. 다음 명령 실행:
```bash
bubblewrap init \
  --manifest https://crisisapp-lnadnnql.manus.space/manifest.json \
  --package-id com.evacora.app \
  --app-name Evacora \
  --app-version 1.0.0 \
  --launcher-icon /path/to/evacora-icon-512x512.png
```
3. AAB 생성:
```bash
bubblewrap build
```
4. Play Console에 업로드

---

## ✅ 체크리스트

- [ ] Play Console 계정 확인 (tjdwls5068@gmail.com)
- [ ] 앱 이름, 설명, 카테고리 작성
- [ ] 스크린샷 5개 업로드
- [ ] 아이콘 업로드
- [ ] 개인정보보호정책 URL 입력
- [ ] 이용약관 URL 입력
- [ ] 콘텐츠 등급 설문지 완료
- [ ] 대상 국가 설정 (미국, 유럽)
- [ ] 가격 설정 (무료)
- [ ] TWA AAB 생성 및 업로드
- [ ] 베타 테스트 시작 (선택사항)
- [ ] 검토 제출

---

## 📱 앱 검토 시간
- **일반적인 검토 시간**: 2-3시간
- **최대 검토 시간**: 24시간
- **거부 사유**: 정책 위반, 기술 오류 등

---

## 🔗 유용한 링크
- [Google Play Console](https://play.google.com/console)
- [Play 정책 센터](https://support.google.com/googleplay/android-developer)
- [Bubblewrap 문서](https://github.com/GoogleChromeLabs/bubblewrap)
- [Trusted Web Activity 가이드](https://developers.google.com/web/android/trusted-web-activity)

---

## 📞 지원
문제가 발생하면 다음을 확인하세요:
1. 개인정보보호정책 및 이용약관이 접근 가능한지 확인
2. 앱 아이콘이 정확한 크기(512x512px)인지 확인
3. 스크린샷이 1080x1920px인지 확인
4. 모든 필수 필드가 작성되었는지 확인

**성공을 기원합니다! 🚀**
