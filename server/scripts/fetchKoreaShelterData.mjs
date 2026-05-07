/**
 * 한국 행정안전부 민방위 대피시설 데이터 수집 스크립트
 * 공식 API: https://www.data.go.kr/data/15044951/openapi.do
 */

import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const API_BASE = "https://api.data.go.kr/openapi/tn_pubr_public_shelter_info";
const SERVICE_KEY = process.env.DATA_GO_KR_API_KEY || ""; // 환경변수에서 API 키 가져오기

// 페이지당 최대 1000개 데이터 수집
const PAGE_SIZE = 1000;

async function fetchShelterData() {
  console.log("🔄 한국 민방위 대피시설 데이터 수집 시작...");

  const allShelters = [];
  let pageNo = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      console.log(`📄 페이지 ${pageNo} 수집 중...`);

      const url = new URL(API_BASE);
      url.searchParams.append("serviceKey", SERVICE_KEY);
      url.searchParams.append("pageNo", pageNo.toString());
      url.searchParams.append("numOfRows", PAGE_SIZE.toString());
      url.searchParams.append("type", "json");

      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.response?.body?.items?.item) {
        const items = Array.isArray(data.response.body.items.item)
          ? data.response.body.items.item
          : [data.response.body.items.item];

        allShelters.push(
          ...items.map((item) => ({
            id: `kr-cd-${item.mgtNo || item.facilNo}`,
            name: item.facilNm || item.facilNmBdngNmInfo || "미지정",
            type: mapShelterType(item.facilType),
            lat: parseFloat(item.latitude || 0),
            lng: parseFloat(item.longitude || 0),
            address: item.address || item.roadAddr || "주소 미지정",
            capacity: parseInt(item.capacity || 0),
            phoneNumber: item.telNo || "",
            region: "kr",
            source: "행정안전부_민방위대피시설",
            externalSourceId: item.mgtNo || item.facilNo,
          }))
        );

        console.log(`✅ ${items.length}개 시설 수집 (총: ${allShelters.length}개)`);

        // 페이지 수 확인
        const totalCount = data.response?.body?.totalCount || 0;
        if (allShelters.length >= totalCount) {
          hasMore = false;
        }
      } else {
        console.log("⚠️ 더 이상 데이터가 없습니다.");
        hasMore = false;
      }

      pageNo++;

      // API 요청 제한 회피
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // 데이터 저장
    const outputPath = path.join(
      process.cwd(),
      "server/data/korea_shelters.json"
    );
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(allShelters, null, 2));

    console.log(`\n✅ 수집 완료! 총 ${allShelters.length}개 시설`);
    console.log(`📁 저장 위치: ${outputPath}`);

    return allShelters;
  } catch (error) {
    console.error("❌ 데이터 수집 실패:", error.message);
    throw error;
  }
}

function mapShelterType(facilType) {
  const typeMap = {
    "1": "evacuation_center",
    "2": "bunker",
    "3": "basement",
    "4": "public_building",
    "5": "other",
  };
  return typeMap[facilType] || "other";
}

// 메타데이터 기반 스크래핑 (API 키 없을 때)
async function scrapeShelterDataFromMetadata() {
  console.log("🔄 메타데이터 기반 스크래핑 시작...");

  try {
    // 업로드된 메타데이터 읽기
    const manifestPath = "/home/ubuntu/upload/korea_civil_defense_shelters_dataset_manifest.csv";
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    console.log("📋 메타데이터 분석:");
    console.log(manifest);

    // 공식 데이터 포탈 URL에서 다운로드
    const dataPortalUrl =
      "https://www.data.go.kr/data/15044951/fileData.do";
    console.log(`\n📥 데이터 포탈에서 다운로드: ${dataPortalUrl}`);
    console.log("⚠️ 수동 다운로드 필요: CSV 파일을 다운로드 후 /home/ubuntu/upload에 저장하세요.");

    return [];
  } catch (error) {
    console.error("❌ 스크래핑 실패:", error.message);
    return [];
  }
}

// 메인 실행
async function main() {
  try {
    let shelters = [];

    // 방법 1: API 수집
    if (SERVICE_KEY) {
      shelters = await fetchShelterData();
    } else {
      console.log("⚠️ API 키가 없습니다. 메타데이터 기반 스크래핑으로 전환합니다.");
      shelters = await scrapeShelterDataFromMetadata();
    }

    if (shelters.length === 0) {
      console.log("\n💡 팁: 데이터 포탈에서 CSV 파일을 직접 다운로드하세요.");
      console.log("   URL: https://www.data.go.kr/data/15044951/fileData.do");
    }
  } catch (error) {
    console.error("❌ 오류 발생:", error);
    process.exit(1);
  }
}

main();
