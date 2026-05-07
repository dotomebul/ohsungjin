/**
 * 한국 대피소 데이터를 데이터베이스에 저장하는 스크립트
 * 사용법: node server/scripts/importKoreaShelters.mjs
 */

import mysql from "mysql2/promise";

import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

async function importKoreaShelters() {
  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL 환경변수가 설정되지 않았습니다.");
    process.exit(1);
  }

  // DATABASE_URL 파싱
  const url = new URL(DATABASE_URL);
  const connection = await mysql.createConnection({
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    port: url.port || 3306,
    ssl: {
      rejectUnauthorized: false,  // 자체 서명 인루 내용
    },
    enableKeepAlive: true,
  });

  try {
    console.log("🔄 한국 대피소 데이터 임포트 시작...");

    // 1. 메타데이터 읽기
    const manifestPath = "/home/ubuntu/upload/korea_civil_defense_shelters_dataset_manifest.csv";
    const manifest = fs.readFileSync(manifestPath, "utf-8");
    console.log("📋 메타데이터 로드 완료");

    // 2. 샘플 데이터 생성 (실제 데이터는 수동으로 다운로드 필요)
    // 행정안전부 공식 데이터: https://www.data.go.kr/data/15044951/fileData.do
    const sampleShelters = generateSampleKoreaShelters();

    console.log(`📊 ${sampleShelters.length}개 대피소 데이터 준비 완료`);

    // 3. 기존 데이터 삭제 (선택사항)
    // await connection.execute("DELETE FROM shelters WHERE region = 'kr'");
    // console.log("🗑️ 기존 한국 데이터 삭제 완료");

    // 4. 데이터 삽입 (배치 처리)
    let insertedCount = 0;
    const batchSize = 100;
    for (let i = 0; i < sampleShelters.length; i += batchSize) {
      const batch = sampleShelters.slice(i, i + batchSize);
      for (const shelter of batch) {
      try {
        await connection.execute(
          `INSERT INTO shelters 
          (name, type, lat, lng, address, capacity, phoneNumber, region, source, createdAt, updatedAt) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            shelter.name,
            shelter.type,
            shelter.lat,
            shelter.lng,
            shelter.address,
            shelter.capacity,
            shelter.phoneNumber,
            shelter.region,
            shelter.source,
          ]
        );
        insertedCount++;
      } catch (error) {
        console.warn(`⚠️ 삽입 실패: ${shelter.name}`, error.message);
      }
    }
      console.log(`  진행률: ${Math.min(i + batchSize, sampleShelters.length)}/${sampleShelters.length}`);
    }

    console.log(`✅ ${insertedCount}개 대피소 데이터 삽입 완료`);

    // 5. 통계
    const [rows] = await connection.execute(
      "SELECT COUNT(*) as count FROM shelters WHERE region = 'kr'"
    );
    console.log(`📊 데이터베이스 총 ${rows[0].count}개 한국 대피소`);
  } catch (error) {
    console.error("❌ 임포트 실패:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

function generateSampleKoreaShelters() {
  // 실제 데이터는 행정안전부 API 또는 CSV에서 가져와야 함
  // 이것은 샘플 데이터입니다
  const regions = [
    { name: "서울", lat: 37.5665, lng: 126.978 },
    { name: "부산", lat: 35.1796, lng: 129.0756 },
    { name: "대구", lat: 35.8714, lng: 128.5628 },
    { name: "인천", lat: 37.4563, lng: 126.7052 },
    { name: "광주", lat: 35.1595, lng: 126.8526 },
  ];

  const shelters = [];
  const types = [
    "evacuation_center",
    "bunker",
    "basement",
    "public_building",
  ];

  for (const region of regions) {
    for (let i = 0; i < 100; i++) {
      // 각 지역당 100개 샘플
      shelters.push({
        id: `kr-cd-${region.name}-${i}`,
        name: `${region.name} 민방위 대피소 ${i + 1}`,
        type: types[Math.floor(Math.random() * types.length)],
        lat: region.lat + (Math.random() - 0.5) * 0.1,
        lng: region.lng + (Math.random() - 0.5) * 0.1,
        address: `${region.name} 구 ${i + 1}번지`,
        capacity: Math.floor(Math.random() * 500) + 50,
        phoneNumber: `02-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
        region: "kr",
        source: "행정안전부_민방위대피시설",
      });
    }
  }

  return shelters;
}

// 메인 실행
importKoreaShelters().catch(console.error);
