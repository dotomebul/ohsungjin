import { publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { shelters } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * 위치 기반 대피소 검색 라우터
 * - 사용자 위치에서 반경 N km 내 대피소 검색
 * - 재난 유형별 필터링
 * - 수용인원 기반 정렬
 */

// Haversine 공식으로 거리 계산 (km)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const sheltersRouter = {
  // 위치 기반 대피소 검색 (반경 N km)
  findNearby: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        radiusKm: z.number().default(10),
        disasterType: z.string().optional(),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // 데이터베이스에서 모든 대피소 조회
      const allShelters = await db
        .select()
        .from(shelters)
        .where(input.disasterType ? eq(shelters.type, input.disasterType as any) : undefined);

      // 거리 계산 및 필터링
      const nearbyShelters = allShelters
        .map((shelter: any) => ({
          ...shelter,
          distance: calculateDistance(
            input.latitude,
            input.longitude,
            parseFloat(shelter.lat),
            parseFloat(shelter.lng)
          ),
        }))
        .filter((shelter: any) => shelter.distance <= input.radiusKm)
        .sort((a: any, b: any) => a.distance - b.distance)
        .slice(0, input.limit);

      return nearbyShelters;
    }),

  // 지역별 대피소 검색
  findByRegion: publicProcedure
    .input(
      z.object({
        region: z.enum(["us", "eu", "kr", "jp"]),
        limit: z.number().default(50),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      return db
        .select()
        .from(shelters)
        .where(eq(shelters.region, input.region as any))
        .limit(input.limit);
    }),

  // 특정 대피소 상세 정보
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const result = await db
        .select()
        .from(shelters)
        .where(eq(shelters.id, input.id));
      return result[0] || null;
    }),

  // 대피소 통계 (지역별)
  getStatsByRegion: publicProcedure
    .input(z.object({ region: z.enum(["us", "eu", "kr", "jp"]) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const allShelters = await db
        .select()
        .from(shelters)
        .where(eq(shelters.region, input.region as any));

      // 클라이언트 사이드에서 통계 계산
      const stats = allShelters.reduce(
        (acc: any, shelter: any) => {
          const type = shelter.type || "other";
          if (!acc[type]) {
            acc[type] = { type, count: 0, totalCapacity: 0 };
          }
          acc[type].count += 1;
          acc[type].totalCapacity += shelter.capacity || 0;
          return acc;
        },
        {}
      );

      return Object.values(stats);
    }),

  // 반경 내 대피소 개수
  countNearby: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        radiusKm: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const allShelters = await db.select().from(shelters);

      const count = allShelters.filter((shelter: any) => {
        const distance = calculateDistance(
          input.latitude,
          input.longitude,
          parseFloat(shelter.lat),
          parseFloat(shelter.lng)
        );
        return distance <= input.radiusKm;
      }).length;

      return { count, radiusKm: input.radiusKm };
    }),

  // 대피소 검색 (키워드)
  search: publicProcedure
    .input(
      z.object({
        keyword: z.string(),
        region: z.enum(["us", "eu", "kr", "jp"]).optional(),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const allShelters = await db.select().from(shelters);

      // 클라이언트 사이드에서 필터링
      const filtered = allShelters
        .filter((shelter: any) => {
          const nameMatch = shelter.name?.toLowerCase().includes(input.keyword.toLowerCase());
          const regionMatch = !input.region || shelter.region === input.region;
          return nameMatch && regionMatch;
        })
        .slice(0, input.limit);

      return filtered;
    }),
};
