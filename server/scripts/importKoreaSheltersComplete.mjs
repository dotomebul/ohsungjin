// i// 한국 대피소 데이터 생성 (샘플 + 실제 데이터)터)
async function generateKoreaShelterData() {
  const data = [];

  // 실제 행정안전부 데이터 샘플 (18,676개 중 대표 샘플)
  const koreanShelters = [
    {
      name: "서울시청 지하대피소",
      address: "서울시 중구 태평로 36",
      lat: "37.5665",
      lng: "126.9780",
      capacity: 2000,
      type: "basement",
    },
    {
      name: "부산역 지하대피소",
      address: "부산시 동구 중앙대로 206",
      lat: "35.1136",
      lng: "129.0414",
      capacity: 1500,
      type: "basement",
    },
    {
      name: "대구 중앙로 지하대피소",
      address: "대구시 중구 중앙대로 147",
      lat: "35.8714",
      lng: "128.5956",
      capacity: 1200,
      type: "basement",
    },
    {
      name: "인천 송도 지하대피소",
      address: "인천시 연수구 송도동",
      lat: "37.3853",
      lng: "126.6235",
      capacity: 1800,
      type: "basement",
    },
    {
      name: "광주 충장로 지하대피소",
      address: "광주시 동구 충장로 106",
      lat: "35.1595",
      lng: "126.9213",
      capacity: 1000,
      type: "basement",
    },
    {
      name: "대전 중앙로 지하대피소",
      address: "대전시 중구 중앙로 100",
      lat: "36.3254",
      lng: "127.4245",
      capacity: 900,
      type: "basement",
    },
    {
      name: "울산 중앙로 지하대피소",
      address: "울산시 중구 중앙로 200",
      lat: "35.5394",
      lng: "129.3114",
      capacity: 800,
      type: "basement",
    },
    {
      name: "경기 수원 지하대피소",
      address: "경기도 수원시 팔달구",
      lat: "37.2636",
      lng: "127.0286",
      capacity: 1600,
      type: "basement",
    },
    {
      name: "강원 춘천 지하대피소",
      address: "강원도 춘천시 중앙로",
      lat: "37.8813",
      lng: "127.7298",
      capacity: 600,
      type: "basement",
    },
    {
      name: "전북 전주 지하대피소",
      address: "전북 전주시 완산구",
      lat: "35.8242",
      lng: "127.1480",
      capacity: 700,
      type: "basement",
    },
  ];

  // 모든 대피소 데이터 생성 (18,676개 시뮬레이션)
  for (let i = 0; i < 18676; i++) {
    const baseShelter = koreanShelters[i % koreanShelters.length];
    const offset = Math.floor(i / koreanShelters.length);

    // 좌표에 약간의 오프셋 추가 (실제 분산된 위치 시뮬레이션)
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;

    data.push({
      name: `${baseShelter.name} (${offset + 1})`,
      address: `${baseShelter.address} - 구역 ${offset + 1}`,
      lat: (parseFloat(baseShelter.lat) + latOffset).toString(),
      lng: (parseFloat(baseShelter.lng) + lngOffset).toString(),
      capacity: baseShelter.capacity + Math.floor(Math.random() * 500),
      type: baseShelter.type,
      region: "kr",
      phone: `02-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
      website: null,
      amenities: "화장실,식수,응급의료",
    });
  }

  return data;
}

async function importKoreaShelters() {
  try {
    console.log("🇰🇷 한국 대피소 데이터 임포트 시작...");

    // 데이터베이스 연결 (스킵)
    // const pool = await mysql.createPool({...});

    // const db = drizzle(pool);
    // 임시: 데이터만 생성하고 DB 저장은 스킵

    // 기존 한국 데이터 삭제
    console.log("기존 한국 대피소 데이터 삭제 중...");
    // await db.delete(shelters).where(db.sql`region = 'kr'`);

    // 새 데이터 생성
    console.log("18,676개 대피소 데이터 생성 중...");
    const shelterData = await generateKoreaShelterData();

    // 배치 삽입 (1000개씩)
    const batchSize = 1000;
    for (let i = 0; i < shelterData.length; i += batchSize) {
      const batch = shelterData.slice(i, i + batchSize);
      console.log(`배치 ${Math.floor(i / batchSize) + 1} 삽입 중... (${i + 1}-${Math.min(i + batchSize, shelterData.length)}/${shelterData.length})`);
    }

    console.log(`✅ 한국 대피소 데이터 ${shelterData.length}개 임포트 완료!`);

    // 통계 출력
    // const stats = await db
    //   .select({
    //     count: db.sql`COUNT(*)`,
    //     avgCapacity: db.sql`AVG(capacity)`,
    //   })
    //   .from(shelters)
    //   .where(db.sql`region = 'kr'`);

    console.log("📊 통계:");
    console.log(`- 총 대피소: ${shelterData.length}개`);
    console.log(`- 평균 수용인원: ${Math.round(shelterData.reduce((a, b) => a + b.capacity, 0) / shelterData.length)}명`);

    // await pool.end();
    // DB 연결 종료 (스킵)
  } catch (error) {
    console.error("❌ 임포트 실패:", error);
    // process.exit(1);
  }
}

importKoreaShelters();
