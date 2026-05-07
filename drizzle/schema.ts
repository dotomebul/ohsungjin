import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  region: mysqlEnum("region", ["us", "eu", "kr", "jp"]).default("us").notNull(),
  lastKnownLat: decimal("lastKnownLat", { precision: 10, scale: 8 }),
  lastKnownLng: decimal("lastKnownLng", { precision: 11, scale: 8 }),
  lastLocationUpdate: timestamp("lastLocationUpdate"),
  locationSharingEnabled: boolean("locationSharingEnabled").default(false),
  locationUpdateInterval: int("locationUpdateInterval").default(30),
  notificationsEnabled: boolean("notificationsEnabled").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Emergency Contacts ────────────────────────────────────────────────────
export const emergencyContacts = mysqlTable("emergencyContacts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  relationship: varchar("relationship", { length: 100 }),
  isPrimary: boolean("isPrimary").default(false),
  isLocationShared: boolean("isLocationShared").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type InsertEmergencyContact = typeof emergencyContacts.$inferInsert;

// ─── Location Sharing ──────────────────────────────────────────────────────
export const locationSharing = mysqlTable("locationSharing", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  friendId: int("friendId").notNull(),
  lat: decimal("lat", { precision: 10, scale: 8 }).notNull(),
  lng: decimal("lng", { precision: 11, scale: 8 }).notNull(),
  accuracy: int("accuracy"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LocationSharing = typeof locationSharing.$inferSelect;
export type InsertLocationSharing = typeof locationSharing.$inferInsert;

// ─── Disaster Types ────────────────────────────────────────────────────────
export const disasterTypes = mysqlTable("disasterTypes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 10 }),
  region: mysqlEnum("region", ["us", "eu", "global"]).default("global"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DisasterType = typeof disasterTypes.$inferSelect;
export type InsertDisasterType = typeof disasterTypes.$inferInsert;

// ─── Disaster Guidelines ──────────────────────────────────────────────────
export const disasterGuidelines = mysqlTable("disasterGuidelines", {
  id: int("id").autoincrement().primaryKey(),
  disasterTypeId: int("disasterTypeId").notNull(),
  immediateActions: text("immediateActions"),
  evacuationSteps: text("evacuationSteps"),
  safetyTips: text("safetyTips"),
  whatToBring: text("whatToBring"),
  emergencyNumber: varchar("emergencyNumber", { length: 20 }),
  helplineNumber: varchar("helplineNumber", { length: 20 }),
  riskLevel: mysqlEnum("riskLevel", ["Low", "Medium", "High"]).default("Medium"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DisasterGuideline = typeof disasterGuidelines.$inferSelect;
export type InsertDisasterGuideline = typeof disasterGuidelines.$inferInsert;

// ─── Shelters ──────────────────────────────────────────────────────────────
export const shelters = mysqlTable("shelters", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["evacuation_center", "bunker", "basement", "public_building", "other"]),
  lat: decimal("lat", { precision: 10, scale: 8 }).notNull(),
  lng: decimal("lng", { precision: 11, scale: 8 }).notNull(),
  address: text("address"),
  capacity: int("capacity"),
  currentOccupancy: int("currentOccupancy").default(0),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  website: varchar("website", { length: 500 }),
  amenities: text("amenities"),
  isOpen: boolean("isOpen").default(true),
  region: mysqlEnum("region", ["us", "eu", "kr", "jp"]).notNull(),
  source: varchar("source", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Shelter = typeof shelters.$inferSelect;
export type InsertShelter = typeof shelters.$inferInsert;

// ─── SMS Log ───────────────────────────────────────────────────────────────
export const smsLog = mysqlTable("smsLog", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  recipientPhoneNumber: varchar("recipientPhoneNumber", { length: 20 }).notNull(),
  messageType: mysqlEnum("messageType", ["safety_check", "sos_alert", "location_share", "info"]),
  messageContent: text("messageContent"),
  status: mysqlEnum("status", ["pending", "sent", "failed", "delivered"]).default("pending"),
  errorMessage: text("errorMessage"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  sentAt: timestamp("sentAt"),
});

export type SmsLog = typeof smsLog.$inferSelect;
export type InsertSmsLog = typeof smsLog.$inferInsert;

// ─── Active Alerts ────────────────────────────────────────────────────────
export const activeAlerts = mysqlTable("activeAlerts", {
  id: int("id").autoincrement().primaryKey(),
  disasterTypeId: int("disasterTypeId").notNull(),
  region: mysqlEnum("region", ["us", "eu", "kr", "jp"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical", "warning", "info"]).default("medium"),
  centerLat: decimal("centerLat", { precision: 10, scale: 8 }),
  centerLng: decimal("centerLng", { precision: 11, scale: 8 }),
  radiusKm: int("radiusKm"),
  status: mysqlEnum("status", ["active", "resolved", "escalated"]).default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
});

export type ActiveAlert = typeof activeAlerts.$inferSelect;
export type InsertActiveAlert = typeof activeAlerts.$inferInsert;

// ─── User Activity Log ────────────────────────────────────────────────────
export const userActivityLog = mysqlTable("userActivityLog", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  details: text("details"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserActivityLog = typeof userActivityLog.$inferSelect;
export type InsertUserActivityLog = typeof userActivityLog.$inferInsert;

// ─── Email Auth Users ─────────────────────────────────────────────────────
// Separate table for email/password users (not Manus OAuth)
export const emailUsers = mysqlTable("emailUsers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  region: mysqlEnum("region", ["us", "eu", "kr", "jp"]).default("us").notNull(),
  locationSharingEnabled: boolean("locationSharingEnabled").default(false),
  lastKnownLat: decimal("lastKnownLat", { precision: 10, scale: 8 }),
  lastKnownLng: decimal("lastKnownLng", { precision: 11, scale: 8 }),
  lastLocationUpdate: timestamp("lastLocationUpdate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmailUser = typeof emailUsers.$inferSelect;
export type InsertEmailUser = typeof emailUsers.$inferInsert;

// ─── Family Relations ─────────────────────────────────────────────────────
// Links two emailUsers as family members
export const familyRelations = mysqlTable("familyRelations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),       // who added
  familyUserId: int("familyUserId").notNull(), // who was added
  nickname: varchar("nickname", { length: 100 }), // e.g. "Mom", "Dad"
  relationship: varchar("relationship", { length: 100 }),
  status: mysqlEnum("status", ["pending", "accepted", "rejected"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FamilyRelation = typeof familyRelations.$inferSelect;
export type InsertFamilyRelation = typeof familyRelations.$inferInsert;

// ─── Family Invites ───────────────────────────────────────────────────────
// Invite tokens for family link sharing
export const familyInvites = mysqlTable("familyInvites", {
  id: int("id").autoincrement().primaryKey(),
  inviterId: int("inviterId").notNull(),
  inviterEmail: varchar("inviterEmail", { length: 320 }).notNull(),
  inviterName: varchar("inviterName", { length: 255 }).notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  nickname: varchar("nickname", { length: 100 }),
  relationship: varchar("relationship", { length: 100 }),
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FamilyInvite = typeof familyInvites.$inferSelect;
export type InsertFamilyInvite = typeof familyInvites.$inferInsert;

// ─── Real-time Location ───────────────────────────────────────────────────
// Latest location for each emailUser (upsert pattern)
export const realtimeLocations = mysqlTable("realtimeLocations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(), // one row per user
  lat: decimal("lat", { precision: 10, scale: 8 }).notNull(),
  lng: decimal("lng", { precision: 11, scale: 8 }).notNull(),
  accuracy: int("accuracy"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RealtimeLocation = typeof realtimeLocations.$inferSelect;
export type InsertRealtimeLocation = typeof realtimeLocations.$inferInsert;

// ─── Location Share Links ─────────────────────────────────────────────────
// One-time or time-limited location share links (SMS)
export const locationShareLinks = mysqlTable("locationShareLinks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  lat: decimal("lat", { precision: 10, scale: 8 }).notNull(),
  lng: decimal("lng", { precision: 11, scale: 8 }).notNull(),
  recipientPhone: varchar("recipientPhone", { length: 20 }),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LocationShareLink = typeof locationShareLinks.$inferSelect;
export type InsertLocationShareLink = typeof locationShareLinks.$inferInsert;

// ─── Poland War Shelters ──────────────────────────────────────────────────
// Comprehensive database of Polish war shelters (bunkers, metro, basements)
export const polandWarShelters = mysqlTable("polandWarShelters", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  type: mysqlEnum("type", ["metro", "bunker", "basement", "cave", "other"]).notNull(),
  lat: decimal("lat", { precision: 10, scale: 8 }).notNull(),
  lng: decimal("lng", { precision: 11, scale: 8 }).notNull(),
  address: text("address"),
  capacity: int("capacity").notNull(),
  currentOccupancy: int("currentOccupancy").default(0),
  depth: int("depth"), // depth in meters
  amenities: json("amenities"), // {hasToilets, hasWater, hasEmergencyRoom, hasBedding, hasFood, hasGenerator, hasCommunication}
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  website: varchar("website", { length: 500 }),
  operatingHours: varchar("operatingHours", { length: 100 }),
  accessibilityInfo: text("accessibilityInfo"),
  isOpen: boolean("isOpen").default(true),
  isVerified: boolean("isVerified").default(false),
  source: varchar("source", { length: 100 }), // e.g., "Polish Government", "NGO", "User"
  lastUpdatedBy: varchar("lastUpdatedBy", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PolandWarShelter = typeof polandWarShelters.$inferSelect;
export type InsertPolandWarShelter = typeof polandWarShelters.$inferInsert;

// ─── Meeting Points ───────────────────────────────────────────────────────
// Family meeting points during emergencies
export const meetingPoints = mysqlTable("meetingPoints", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  lat: decimal("lat", { precision: 10, scale: 8 }).notNull(),
  lng: decimal("lng", { precision: 11, scale: 8 }).notNull(),
  address: text("address"),
  description: text("description"),
  familyMemberIds: json("familyMemberIds"), // array of family user IDs
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MeetingPoint = typeof meetingPoints.$inferSelect;
export type InsertMeetingPoint = typeof meetingPoints.$inferInsert;

// ─── Traffic Congestion Info ──────────────────────────────────────────────
// Real-time traffic and congestion information
export const trafficInfo = mysqlTable("trafficInfo", {
  id: int("id").autoincrement().primaryKey(),
  lat: decimal("lat", { precision: 10, scale: 8 }).notNull(),
  lng: decimal("lng", { precision: 11, scale: 8 }).notNull(),
  congestionLevel: mysqlEnum("congestionLevel", ["smooth", "normal", "congested", "severe", "blocked"]).default("normal"),
  averageSpeed: int("averageSpeed"), // km/h
  roadName: varchar("roadName", { length: 255 }),
  city: varchar("city", { length: 100 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TrafficInfo = typeof trafficInfo.$inferSelect;
export type InsertTrafficInfo = typeof trafficInfo.$inferInsert;

// ─── International War Shelters (Baltic, Czech, Poland) ────────────────────
// Comprehensive database of war shelters across multiple countries
export const internationalWarShelters = mysqlTable("internationalWarShelters", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  country: mysqlEnum("country", ["poland", "czech", "lithuania", "latvia", "estonia"]).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  type: mysqlEnum("type", ["metro", "bunker", "basement", "cave", "other"]).notNull(),
  lat: decimal("lat", { precision: 10, scale: 8 }).notNull(),
  lng: decimal("lng", { precision: 11, scale: 8 }).notNull(),
  address: text("address"),
  capacity: int("capacity").notNull(),
  currentOccupancy: int("currentOccupancy").default(0),
  depth: int("depth"), // depth in meters
  amenities: json("amenities"), // {hasToilets, hasWater, hasEmergencyRoom, hasBedding, hasFood, hasGenerator, hasCommunication}
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  website: varchar("website", { length: 500 }),
  operatingHours: varchar("operatingHours", { length: 100 }),
  accessibilityInfo: text("accessibilityInfo"),
  isOpen: boolean("isOpen").default(true),
  isVerified: boolean("isVerified").default(false),
  source: varchar("source", { length: 100 }), // e.g., "Government", "NGO", "User"
  lastUpdatedBy: varchar("lastUpdatedBy", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InternationalWarShelter = typeof internationalWarShelters.$inferSelect;
export type InsertInternationalWarShelter = typeof internationalWarShelters.$inferInsert;

// ─── Family Invite Codes ──────────────────────────────────────────────────
// SMS 초대 코드 저장 및 검증용 테이블
export const familyInviteCodes = mysqlTable("familyInviteCodes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),                    // 초대를 보낸 사용자
  code: varchar("code", { length: 6 }).notNull().unique(),  // 6자리 숫자 코드
  inviteePhone: varchar("inviteePhone", { length: 20 }).notNull(),  // 초대받는 사람 전화번호
  nickname: varchar("nickname", { length: 100 }),    // 초대받는 사람 별칭
  relationship: varchar("relationship", { length: 100 }), // 관계
  status: mysqlEnum("status", ["pending", "accepted", "expired"]).default("pending"),
  expiresAt: timestamp("expiresAt").notNull(),        // 코드 만료 시간 (24시간)
  acceptedAt: timestamp("acceptedAt"),                // 수락 시간
  acceptedByUserId: int("acceptedByUserId"),          // 수락한 사용자 ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FamilyInviteCode = typeof familyInviteCodes.$inferSelect;
export type InsertFamilyInviteCode = typeof familyInviteCodes.$inferInsert;

// ─── User Feedback ────────────────────────────────────────────────────────
// 사용자 종료 시 수집한 피드백
export const userFeedback = mysqlTable("userFeedback", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),                              // 로그인한 사용자 (선택사항)
  rating: int("rating").notNull(),                    // 1-5 별점
  comment: text("comment"),                           // 피드백 의견
  userAgent: varchar("userAgent", { length: 500 }),   // 브라우저 정보
  region: varchar("region", { length: 50 }),         // 사용자 지역 (US/EU/KR/JP)
  language: varchar("language", { length: 10 }),     // 사용자 언어
  appVersion: varchar("appVersion", { length: 20 }), // 앱 버전
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserFeedback = typeof userFeedback.$inferSelect;
export type InsertUserFeedback = typeof userFeedback.$inferInsert;
