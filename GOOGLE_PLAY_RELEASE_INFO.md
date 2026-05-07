# Google Play Console 배포 자료

## 📱 **출시명 (Release Name)**

### 권장 출시명 (3가지 옵션)

#### **Option 1: 버전 중심 (표준)**
```
Version 1.0.0 - Launch Release
```

#### **Option 2: 기능 중심 (마케팅)**
```
Evacora v1.0 - Real-time Crisis Response
```

#### **Option 3: 임팩트 중심 (감정)**
```
v1.0 - Know What To Do When Disaster Strikes
```

### **최종 추천**
```
Evacora v1.0.0 - Official Launch
```

---

## 📝 **출시노트 (Release Notes)**

### **한국어 버전**
```
🚨 Evacora v1.0.0 - 공식 출시

Evacora가 출시되었습니다! 재난 상황에서 당신을 보호하는 AI 기반 위기 대응 앱입니다.

✨ 주요 기능:

📰 실시간 재난 뉴스
- 1분 간격 자동 업데이트
- 9가지 재난 유형 (지진, 산불, 쓰나미, 태풍, 홍수, 전쟁 등)

🗺️ 대피소 찾기
- 160개 유럽 + 25개 한국 대피소
- 최적 경로 안내
- 실시간 검색

👨‍👩‍👧‍👦 가족 위치 추적
- 가족 멤버 위치 공유
- 안전 상태 표시
- 거리 계산

🎤 AI 음성 안내
- 6개 언어 지원
- 손 없이 조작 가능

📱 오프라인 모드
- 인터넷 없이 사용 가능
- 중요 정보 접근

🌍 185개 국가 지원

💰 가격
- 무료: 기본 기능
- 프리미엄: $4.99/월 (가족 추적 무제한)

🎯 우리의 미션
기술을 통해 생명을 구하고, 모든 사람이 긴급 상황에 대응할 수 있도록 합니다.

버그 리포트 및 피드백: support@evacuora.app

안전하게 지내세요. 정보를 얻으세요. 연결되어 있으세요.
```

### **영어 버전**
```
🚨 Evacora v1.0.0 - Official Launch

Evacora is here! The world's first AI-powered crisis companion that keeps you safe in emergencies.

✨ Key Features:

📰 Real-Time Disaster News
- Updated every minute
- 9 disaster types (earthquakes, wildfires, tsunamis, typhoons, floods, wars, etc.)

🗺️ Shelter Finder
- 160+ European + 25+ Korean shelters
- Optimal routing
- Real-time search

👨‍👩‍👧‍👦 Family Location Tracking
- Share family member locations
- Safety status indicators
- Distance calculation

🎤 AI Voice Guidance
- 6 languages supported
- Hands-free operation

📱 Offline Mode
- Works without internet
- Access critical information anywhere

🌍 Available in 185 Countries

💰 Pricing
- Free: Basic features
- Premium: $4.99/month (unlimited family tracking)

🎯 Our Mission
Saving lives through technology. Making emergency response accessible to everyone, everywhere.

Report bugs or feedback: support@evacuora.app

Stay safe. Stay informed. Stay connected.
```

---

## 📦 **앱번들 (AAB) 정보**

### **앱번들 파일 생성 방법**

#### **Step 1: Android Studio에서 생성**

```
1. Android Studio 열기
2. Build 메뉴 > Generate Signed Bundle / APK
3. "Android App Bundle" 선택
4. 서명 키 생성 (처음인 경우):
   - Key store path: 새로 생성
   - Key alias: evacora_key
   - Password: [안전한 비밀번호]
5. Release 빌드 선택
6. AAB 파일 생성
```

#### **Step 2: 명령어로 생성**

```bash
# 프로젝트 루트 디렉토리에서
./gradlew bundleRelease

# 생성된 파일 위치:
# app/build/outputs/bundle/release/app-release.aab
```

### **앱번들 파일 사양**

| 항목 | 값 |
|------|-----|
| **파일명** | app-release.aab |
| **파일 크기** | 약 50-100MB (예상) |
| **형식** | Android App Bundle |
| **서명** | Release 키로 서명 |
| **최소 SDK** | 21 (Android 5.0) |
| **대상 SDK** | 34 (Android 14) |

### **앱번들 검증**

Google Play Console에 업로드하기 전에:

```bash
# 1. bundletool 다운로드
wget https://github.com/google/bundletool/releases/download/1.15.6/bundletool-all.jar

# 2. 번들 검증
java -jar bundletool-all.jar validate --bundle-path=app-release.aab

# 3. APK 생성 (테스트용)
java -jar bundletool-all.jar build-apks \
  --bundle=app-release.aab \
  --output=app.apks \
  --ks=keystore.jks \
  --ks-pass=pass:[password] \
  --ks-key-alias=evacora_key \
  --key-pass=pass:[password]
```

---

## 🔐 **서명 키 관리**

### **서명 키 정보**

```
Key Alias: evacora_key
Key Store: evacora.jks
Validity: 25년 (Google Play 권장)
Algorithm: RSA 2048-bit
```

### **⚠️ 중요 사항**

- ✅ 서명 키를 **안전한 곳에 보관**
- ✅ 비밀번호를 **기억**해두기
- ✅ 키를 **절대 잃어버리지 않기** (앱 업데이트 불가)
- ✅ 키 정보를 **다른 사람과 공유하지 않기**

---

## 📋 **Google Play Console 업로드 체크리스트**

### **배포 전**
- [ ] 출시명 결정
- [ ] 출시노트 작성 (한국어/영어)
- [ ] 앱번들(AAB) 파일 생성
- [ ] 앱번들 검증
- [ ] 스크린샷 5장 준비
- [ ] 앱 아이콘 준비

### **업로드 단계**
- [ ] Google Play Console 접속
- [ ] "앱 만들기" 또는 기존 앱 선택
- [ ] "릴리스 > 프로덕션" 선택
- [ ] "새 릴리스 만들기" 클릭
- [ ] 앱번들 업로드
- [ ] 출시명 입력
- [ ] 출시노트 입력
- [ ] 스크린샷 업로드
- [ ] 검토 전 확인

### **배포 후**
- [ ] 검토 상태 모니터링 (1-24시간)
- [ ] 승인 확인
- [ ] 배포 시작
- [ ] 앱 스토어 확인

---

## 🎯 **버전 정보**

### **현재 버전**
```
Version: 1.0.0
Build: 1
Release Date: 2026-04-28
```

### **향후 버전 계획**

| 버전 | 예정 | 주요 기능 |
|------|------|---------|
| 1.0.0 | 2026-04-28 | 초기 출시 |
| 1.1.0 | 2026-05-28 | 버그 수정 + 성능 개선 |
| 1.2.0 | 2026-06-28 | 새로운 재난 유형 추가 |
| 2.0.0 | 2026-09-28 | AI 기능 강화 + 새로운 UI |

---

## 📊 **배포 통계**

### **예상 검토 시간**
- 일반적: 1-3시간
- 최대: 24시간

### **예상 다운로드**
- 첫 주: 1,000-5,000
- 첫 달: 10,000-50,000
- 3개월: 50,000-200,000

### **예상 평점**
- 목표: 4.5/5 이상
- 리뷰 수: 첫 달 100+

---

## 💡 **팁**

### **배포 성공 팁**
1. ✅ 명확한 출시노트 작성
2. ✅ 고품질 스크린샷 준비
3. ✅ 정책 준수 확인
4. ✅ 빠른 버그 수정 준비
5. ✅ 사용자 리뷰 모니터링

### **피해야 할 것**
1. ❌ 불명확한 설명
2. ❌ 저품질 이미지
3. ❌ 정책 위반 콘텐츠
4. ❌ 과장된 주장
5. ❌ 개인정보 보호 정책 미준비

---

## 📞 **다음 단계**

1. **앱번들 생성**
   - Android Studio 또는 명령어로 생성
   - 파일 검증

2. **Google Play Console 업로드**
   - 출시명 입력
   - 출시노트 입력
   - 앱번들 업로드
   - "검토를 위해 전송" 클릭

3. **모니터링**
   - 검토 상태 확인 (1-24시간)
   - 승인 후 배포 확인
   - 사용자 리뷰 모니터링

---

**준비 완료! Google Play Console에 업로드하시면 됩니다!**
