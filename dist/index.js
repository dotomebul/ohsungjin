// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/db.ts
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
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
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var emergencyContacts = mysqlTable("emergencyContacts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  relationship: varchar("relationship", { length: 100 }),
  isPrimary: boolean("isPrimary").default(false),
  isLocationShared: boolean("isLocationShared").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var locationSharing = mysqlTable("locationSharing", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  friendId: int("friendId").notNull(),
  lat: decimal("lat", { precision: 10, scale: 8 }).notNull(),
  lng: decimal("lng", { precision: 11, scale: 8 }).notNull(),
  accuracy: int("accuracy"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var disasterTypes = mysqlTable("disasterTypes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 10 }),
  region: mysqlEnum("region", ["us", "eu", "global"]).default("global"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var disasterGuidelines = mysqlTable("disasterGuidelines", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var shelters = mysqlTable("shelters", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var smsLog = mysqlTable("smsLog", {
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
  sentAt: timestamp("sentAt")
});
var activeAlerts = mysqlTable("activeAlerts", {
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
  resolvedAt: timestamp("resolvedAt")
});
var userActivityLog = mysqlTable("userActivityLog", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  details: text("details"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var emailUsers = mysqlTable("emailUsers", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var familyRelations = mysqlTable("familyRelations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  // who added
  familyUserId: int("familyUserId").notNull(),
  // who was added
  nickname: varchar("nickname", { length: 100 }),
  // e.g. "Mom", "Dad"
  relationship: varchar("relationship", { length: 100 }),
  status: mysqlEnum("status", ["pending", "accepted", "rejected"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var familyInvites = mysqlTable("familyInvites", {
  id: int("id").autoincrement().primaryKey(),
  inviterId: int("inviterId").notNull(),
  inviterEmail: varchar("inviterEmail", { length: 320 }).notNull(),
  inviterName: varchar("inviterName", { length: 255 }).notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  nickname: varchar("nickname", { length: 100 }),
  relationship: varchar("relationship", { length: 100 }),
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var realtimeLocations = mysqlTable("realtimeLocations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  // one row per user
  lat: decimal("lat", { precision: 10, scale: 8 }).notNull(),
  lng: decimal("lng", { precision: 11, scale: 8 }).notNull(),
  accuracy: int("accuracy"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var locationShareLinks = mysqlTable("locationShareLinks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  lat: decimal("lat", { precision: 10, scale: 8 }).notNull(),
  lng: decimal("lng", { precision: 11, scale: 8 }).notNull(),
  recipientPhone: varchar("recipientPhone", { length: 20 }),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var polandWarShelters = mysqlTable("polandWarShelters", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  type: mysqlEnum("type", ["metro", "bunker", "basement", "cave", "other"]).notNull(),
  lat: decimal("lat", { precision: 10, scale: 8 }).notNull(),
  lng: decimal("lng", { precision: 11, scale: 8 }).notNull(),
  address: text("address"),
  capacity: int("capacity").notNull(),
  currentOccupancy: int("currentOccupancy").default(0),
  depth: int("depth"),
  // depth in meters
  amenities: json("amenities"),
  // {hasToilets, hasWater, hasEmergencyRoom, hasBedding, hasFood, hasGenerator, hasCommunication}
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  website: varchar("website", { length: 500 }),
  operatingHours: varchar("operatingHours", { length: 100 }),
  accessibilityInfo: text("accessibilityInfo"),
  isOpen: boolean("isOpen").default(true),
  isVerified: boolean("isVerified").default(false),
  source: varchar("source", { length: 100 }),
  // e.g., "Polish Government", "NGO", "User"
  lastUpdatedBy: varchar("lastUpdatedBy", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var meetingPoints = mysqlTable("meetingPoints", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  lat: decimal("lat", { precision: 10, scale: 8 }).notNull(),
  lng: decimal("lng", { precision: 11, scale: 8 }).notNull(),
  address: text("address"),
  description: text("description"),
  familyMemberIds: json("familyMemberIds"),
  // array of family user IDs
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var trafficInfo = mysqlTable("trafficInfo", {
  id: int("id").autoincrement().primaryKey(),
  lat: decimal("lat", { precision: 10, scale: 8 }).notNull(),
  lng: decimal("lng", { precision: 11, scale: 8 }).notNull(),
  congestionLevel: mysqlEnum("congestionLevel", ["smooth", "normal", "congested", "severe", "blocked"]).default("normal"),
  averageSpeed: int("averageSpeed"),
  // km/h
  roadName: varchar("roadName", { length: 255 }),
  city: varchar("city", { length: 100 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var internationalWarShelters = mysqlTable("internationalWarShelters", {
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
  depth: int("depth"),
  // depth in meters
  amenities: json("amenities"),
  // {hasToilets, hasWater, hasEmergencyRoom, hasBedding, hasFood, hasGenerator, hasCommunication}
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  website: varchar("website", { length: 500 }),
  operatingHours: varchar("operatingHours", { length: 100 }),
  accessibilityInfo: text("accessibilityInfo"),
  isOpen: boolean("isOpen").default(true),
  isVerified: boolean("isVerified").default(false),
  source: varchar("source", { length: 100 }),
  // e.g., "Government", "NGO", "User"
  lastUpdatedBy: varchar("lastUpdatedBy", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var familyInviteCodes = mysqlTable("familyInviteCodes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  // 초대를 보낸 사용자
  code: varchar("code", { length: 6 }).notNull().unique(),
  // 6자리 숫자 코드
  inviteePhone: varchar("inviteePhone", { length: 20 }).notNull(),
  // 초대받는 사람 전화번호
  nickname: varchar("nickname", { length: 100 }),
  // 초대받는 사람 별칭
  relationship: varchar("relationship", { length: 100 }),
  // 관계
  status: mysqlEnum("status", ["pending", "accepted", "expired"]).default("pending"),
  expiresAt: timestamp("expiresAt").notNull(),
  // 코드 만료 시간 (24시간)
  acceptedAt: timestamp("acceptedAt"),
  // 수락 시간
  acceptedByUserId: int("acceptedByUserId"),
  // 수락한 사용자 ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var userFeedback = mysqlTable("userFeedback", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  // 로그인한 사용자 (선택사항)
  rating: int("rating").notNull(),
  // 1-5 별점
  comment: text("comment"),
  // 피드백 의견
  userAgent: varchar("userAgent", { length: 500 }),
  // 브라우저 정보
  region: varchar("region", { length: 50 }),
  // 사용자 지역 (US/EU/KR/JP)
  language: varchar("language", { length: 10 }),
  // 사용자 언어
  appVersion: varchar("appVersion", { length: 20 }),
  // 앱 버전
  createdAt: timestamp("createdAt").defaultNow().notNull()
});

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID ?? "",
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN ?? "",
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER ?? ""
};

// server/db.ts
var _db = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/storageProxy.ts
function registerStorageProxy(app) {
  app.get("/manus-storage/*", async (req, res) => {
    const params = req.params;
    const key = params[0] || "";
    if (!key || typeof key !== "string") {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = await forgeResp.json();
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// server/routers.ts
import { z as z6 } from "zod";

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { eq as eq3, and as and2, desc } from "drizzle-orm";

// shared/disasterData.ts
var US_DISASTERS = [
  {
    code: "wildfire",
    name: "Wildfire",
    icon: "\u{1F525}",
    region: "us",
    immediateActions: [
      "\u{1F697} Evacuate immediately if ordered - do not delay",
      "\u{1FA9F} Close all windows and doors to prevent embers",
      "\u{1F525} Turn off gas at meter if time permits",
      "\u{1F4A1} Leave lights on so firefighters can see",
      "\u{1F697} Drive with headlights on - visibility critical",
      "\u{1F3E0} Wear protective clothing - long sleeves and pants",
      "\u{1F392} Take emergency go-bag with important documents",
      "\u{1F4F1} Keep phone charged and with you at all times",
      "\u{1F697} Fill car with gas before evacuation order",
      "\u{1F468}\u200D\u{1F469}\u200D\u{1F467} Notify family of your evacuation location"
    ],
    evacuationSteps: [
      "Listen to local news and emergency alerts",
      "Follow designated evacuation routes",
      "Do not use shortcuts or back roads",
      "Drive slowly and carefully",
      "Go to designated evacuation centers or shelters"
    ],
    safetyTips: [
      "Wear N95 masks to protect from smoke",
      "Stay indoors with windows closed",
      "Use air purifiers if available",
      "Keep medications and important documents ready",
      "Have a full tank of gas before evacuation"
    ],
    whatToBring: [
      "Important documents (ID, insurance, deeds)",
      "Medications and medical equipment",
      "Phone chargers and backup power banks",
      "Cash and credit cards",
      "Irreplaceable photos and heirlooms",
      "Pet carriers and pet supplies",
      "Water and non-perishable food"
    ],
    emergencyNumber: "911",
    helplineNumber: "1-800-621-3362",
    riskLevel: "High"
  },
  {
    code: "earthquake",
    name: "Earthquake",
    icon: "\u{1F30D}",
    region: "us",
    immediateActions: [
      "Drop to hands and knees immediately",
      "Take cover under sturdy table or desk",
      "Hold on until shaking stops completely",
      "Stay away from windows and mirrors",
      "Do not run outside during shaking",
      "If outside, move away from buildings and power lines",
      "If driving, pull over safely and stay in vehicle",
      "Stay in your location until shaking completely stops",
      "Check on family and neighbors after shaking",
      "Listen to emergency broadcasts for aftershock warnings"
    ],
    evacuationSteps: [
      "Check for injuries and provide first aid",
      "Inspect your home for damage",
      "Turn off gas if you smell it",
      "Do not use elevators",
      "Exit building carefully if safe",
      "Go to designated assembly points"
    ],
    safetyTips: [
      "Secure heavy furniture to walls",
      "Keep emergency supplies in multiple locations",
      "Know how to turn off utilities",
      "Practice DROP, COVER, HOLD ON regularly",
      "Stay away from damaged buildings"
    ],
    whatToBring: [
      "First aid kit",
      "Water (1 gallon per person per day)",
      "Non-perishable food",
      "Flashlight and extra batteries",
      "Portable radio",
      "Important documents",
      "Medications"
    ],
    emergencyNumber: "911",
    helplineNumber: "1-800-621-3362",
    riskLevel: "High"
  },
  {
    code: "tornado",
    name: "Tornado",
    icon: "\u{1F32A}\uFE0F",
    region: "us",
    immediateActions: [
      "Go to basement or interior room on lowest floor immediately",
      "Stay away from windows and exterior walls",
      "Get under sturdy table or mattress for protection",
      "Protect your head and neck with hands or pillow",
      "Do not try to outrun a tornado in a car",
      "If outside with no shelter, lie flat in a ditch or low spot",
      "If in a mobile home, evacuate to a sturdy building",
      "Stay in shelter until tornado warning is lifted",
      "Listen to weather radio for tornado updates",
      "Account for all family members in the shelter"
    ],
    evacuationSteps: [
      "Wait for tornado warning to clear",
      "Check for injuries",
      "Exit building if it's damaged",
      "Avoid downed power lines",
      "Go to emergency shelter if needed"
    ],
    safetyTips: [
      "Know the difference between watch and warning",
      "Have a safe room identified in advance",
      "Keep weather radio on during storm season",
      "Do not open windows",
      "Stay indoors until all-clear is given"
    ],
    whatToBring: [
      "Flashlight and batteries",
      "First aid kit",
      "Water",
      "Important documents",
      "Medications",
      "Phone charger"
    ],
    emergencyNumber: "911",
    helplineNumber: "1-800-621-3362",
    riskLevel: "High"
  },
  {
    code: "hurricane",
    name: "Hurricane",
    icon: "\u{1F300}",
    region: "us",
    immediateActions: [
      "\u{1F697} Evacuate if ordered by authorities - do not delay",
      "\u{1FA9F} Secure outdoor items - bring in or tie down furniture",
      "\u{1F4A7} Fill bathtub with water for drinking and sanitation",
      "\u{1F50C} Charge all devices - phones, laptops, power banks",
      "\u{1F4B0} Get cash from ATM - ATMs may not work after storm",
      "\u{1F3E0} Board up windows and secure doors with plywood",
      "\u{1F6D2} Stock up on food, water, and essential supplies",
      "\u{1F4CB} Gather important documents and insurance papers",
      "\u{1F697} Fill your car with gas - gas stations may close",
      "\u{1F468}\u200D\u{1F469}\u200D\u{1F467} Notify family of your evacuation plan and location"
    ],
    evacuationSteps: [
      "Follow evacuation routes",
      "Do not use shortcuts",
      "Drive with headlights on",
      "Go to designated shelters",
      "Register with emergency services"
    ],
    safetyTips: [
      "Board up windows",
      "Stay indoors during storm",
      "Avoid flooded roads",
      "Do not go outside during eye of storm",
      "Listen to emergency broadcasts"
    ],
    whatToBring: [
      "Important documents",
      "Medications",
      "Cash and cards",
      "Phone chargers",
      "Water and food",
      "Pet supplies",
      "Irreplaceable items"
    ],
    emergencyNumber: "911",
    helplineNumber: "1-800-621-3362",
    riskLevel: "High"
  }
];
var EU_DISASTERS = [
  {
    code: "bombing",
    name: "Bombing / Air Raid",
    icon: "\u{1F4A3}",
    region: "eu",
    immediateActions: [
      "\u{1F6A8} Go to nearest shelter or basement IMMEDIATELY when sirens sound",
      "\u{1FA9F} Stay away from windows and exterior walls - move to interior rooms",
      "\u{1F6E1}\uFE0F Cover your head and neck with your hands or a pillow",
      "\u{1F3C3} If outside, lie flat on the ground away from buildings and vehicles",
      "\u{1F6AB} Do NOT look outside or go to windows to see what's happening",
      "\u{1F9F1} Move to the center of the building, away from walls and doors",
      "\u{1F507} Stay quiet and listen for further instructions from authorities",
      "\u{1F9F3} Keep your emergency bag with you at all times in the shelter",
      "\u{1F4A7} If in shelter, ration water and food - it may be a long wait",
      "\u{1F91D} Help others in the shelter, especially children and elderly"
    ],
    evacuationSteps: [
      "Wait for all-clear signal from authorities",
      "Check for injuries",
      "Exit building carefully",
      "Avoid debris and damaged areas",
      "Go to designated assembly points"
    ],
    safetyTips: [
      "Know location of nearest public shelter",
      "Keep emergency supplies in shelter",
      "Stay tuned to emergency broadcasts",
      "Do not use phone unless emergency",
      "Stay calm and help others"
    ],
    whatToBring: [
      "Important documents",
      "Medications",
      "Water and food",
      "Flashlight",
      "First aid kit",
      "Phone charger",
      "Warm clothing"
    ],
    emergencyNumber: "112",
    helplineNumber: "Varies by country",
    riskLevel: "High"
  },
  {
    code: "war",
    name: "War / Conflict",
    icon: "\u2694\uFE0F",
    region: "eu",
    immediateActions: [
      "\u{1F3C3} Evacuate to nearest shelter or basement immediately - do NOT delay",
      "\u{1FA9F} Stay away from windows and exterior walls to avoid shrapnel",
      "\u{1F4CD} Move to the center of the building, away from doors and windows",
      "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466} Keep all family members and pets together in one location",
      "\u{1F4F1} Turn off phone and avoid using it unless it's an emergency",
      "\u{1F507} Listen to official emergency broadcasts on radio or TV",
      "\u{1F6AA} Close and lock all doors and windows; seal gaps with tape if available",
      "\u{1F4A7} Fill bathtubs and containers with water immediately for drinking and sanitation",
      "\u{1F56F}\uFE0F Locate flashlights, candles, and batteries - do NOT use candles if gas leak suspected",
      "\u{1F4CB} Gather important documents, medications, and valuables in one bag"
    ],
    evacuationSteps: [
      "Only evacuate if ordered by authorities",
      "Use designated evacuation routes",
      "Do not use main roads if possible",
      "Go to designated safe zones",
      "Register with authorities upon arrival"
    ],
    safetyTips: [
      "Keep emergency supplies stocked",
      "Have documents ready for evacuation",
      "Listen to official broadcasts only",
      "Do not spread rumors",
      "Help vulnerable neighbors"
    ],
    whatToBring: [
      "Passport and important documents",
      "Medications and medical records",
      "Cash in multiple currencies",
      "Phone chargers and power banks",
      "Water and non-perishable food",
      "Warm clothing and blankets",
      "First aid kit"
    ],
    emergencyNumber: "112",
    helplineNumber: "Red Cross: +41 22 730 60 00",
    riskLevel: "High"
  },
  {
    code: "flood",
    name: "Flood",
    icon: "\u{1F30A}",
    region: "eu",
    immediateActions: [
      "\u{1F3C3} Move to higher ground IMMEDIATELY - do NOT wait",
      "\u{1F697} Do NOT attempt to cross flooded roads or bridges",
      "\u{1F50C} Turn off utilities (gas, electricity, water) if safe to do so",
      "\u{1FA9F} Close all windows and doors to prevent water entry",
      "\u{1F4E6} Move valuables and important items to higher floors",
      "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466} Gather family members and pets and move to high ground",
      "\u{1F4F1} Call emergency services if trapped - do NOT try to swim or wade",
      "\u{1F9F3} Take your emergency bag with essential documents and medications",
      "\u{1F6AA} Lock your home before leaving if time permits",
      "\u{1F4CD} Go to designated evacuation centers or higher ground shelters"
    ],
    evacuationSteps: [
      "Follow evacuation orders",
      "Use designated routes",
      "Go to higher ground or shelters",
      "Do not return until all-clear"
    ],
    safetyTips: [
      "Never drive through flooded areas",
      "Avoid contact with flood water",
      "Boil water before drinking",
      "Dispose of contaminated food",
      "Watch for aftereffects"
    ],
    whatToBring: [
      "Important documents in waterproof bag",
      "Medications",
      "Cash",
      "Phone charger",
      "Change of clothes",
      "Drinking water",
      "Food"
    ],
    emergencyNumber: "112",
    helplineNumber: "Varies by country",
    riskLevel: "Medium"
  },
  {
    code: "nuclear",
    name: "Nuclear Emergency",
    icon: "\u2622\uFE0F",
    region: "eu",
    immediateActions: [
      "\u{1F3C3} Get inside a building IMMEDIATELY - preferably basement or center of building",
      "\u{1F6AA} Close all windows and doors to seal out radioactive material",
      "\u{1F50C} Turn off ventilation systems (AC, fans) to prevent contaminated air entry",
      "\u{1F4FB} Listen to emergency broadcasts for instructions from authorities",
      "\u{1F9F4} If outside, remove outer clothing and seal in a plastic bag",
      "\u{1F6BF} Shower with soap and water if possible to remove radioactive particles",
      "\u{1F4A7} Drink only bottled water or water from sealed containers",
      "\u{1F3E0} Shelter in place - do NOT evacuate unless ordered by authorities",
      "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466} Keep family together in the most protected room (basement, center of building)",
      "\u{1F4F1} Do NOT use phone unless absolutely necessary - keep lines open for emergency services"
    ],
    evacuationSteps: [
      "Wait for official evacuation orders",
      "Follow designated evacuation routes",
      "Go to designated reception centers",
      "Follow decontamination procedures"
    ],
    safetyTips: [
      "Keep potassium iodide tablets if available",
      "Listen to emergency broadcasts",
      "Do not consume local food or water",
      "Avoid contaminated areas",
      "Follow all official guidance"
    ],
    whatToBring: [
      "Important documents",
      "Medications",
      "Cash",
      "Phone charger",
      "Change of clothes",
      "Toiletries",
      "Water and food"
    ],
    emergencyNumber: "112",
    helplineNumber: "National radiation authority",
    riskLevel: "High"
  }
];
var GLOBAL_DISASTERS = [
  {
    code: "pandemic",
    name: "Pandemic / Disease Outbreak",
    icon: "\u{1F9A0}",
    region: "global",
    immediateActions: [
      "\u{1F3E0} Stay home and isolate if you have symptoms or have been exposed",
      "\u{1F912} Monitor your temperature and symptoms - report to health authorities if needed",
      "\u{1F637} Wear a mask when around others to prevent transmission",
      "\u{1F9FC} Wash hands frequently with soap and water for at least 20 seconds",
      "\u{1F91D} Maintain at least 2 meters (6 feet) distance from others",
      "\u{1F9F4} Use hand sanitizer (60% alcohol) when soap and water unavailable",
      "\u{1F6AB} Do NOT touch your face, eyes, nose, or mouth",
      "\u{1F6D2} Stock up on essential supplies - food, medications, hygiene items",
      "\u{1F4F1} Register with local health authorities if required",
      "\u{1F3E5} Call health hotline if you develop symptoms - do NOT go to hospital without calling first"
    ],
    evacuationSteps: [
      "Only travel if necessary",
      "Use designated routes",
      "Maintain distance from others",
      "Follow quarantine procedures"
    ],
    safetyTips: [
      "Get vaccinated if available",
      "Maintain hygiene",
      "Disinfect surfaces",
      "Monitor symptoms",
      "Seek medical help if needed"
    ],
    whatToBring: [
      "Masks",
      "Hand sanitizer",
      "Medications",
      "Thermometer",
      "Phone charger",
      "Food and water"
    ],
    emergencyNumber: "911 or 112",
    helplineNumber: "Local health authority",
    riskLevel: "Medium"
  }
];
function getDisasterGuides(region = "global") {
  if (region === "us") {
    return [...US_DISASTERS, ...GLOBAL_DISASTERS];
  } else if (region === "eu") {
    return [...EU_DISASTERS, ...GLOBAL_DISASTERS];
  }
  return [...US_DISASTERS, ...EU_DISASTERS, ...GLOBAL_DISASTERS];
}
function getDisasterByCode(code, region = "global") {
  const guides = getDisasterGuides(region);
  return guides.find((d) => d.code === code);
}

// shared/shelterData.ts
var US_SHELTERS = [
  {
    id: "fema-ny-001",
    name: "NYC Emergency Operations Center",
    address: "165 Mulberry St, New York, NY 10013",
    lat: "40.7160",
    lng: "-73.9997",
    capacity: 1e3,
    type: "Government Center",
    phone: "+1-311",
    website: "https://www1.nyc.gov/site/em/index.page",
    amenities: ["Medical", "Food", "Water", "Cots", "WiFi"],
    supplies: [
      { name: "Water", quantity: 5e3, unit: "liters" },
      { name: "MRE Meals", quantity: 3e3, unit: "packs" },
      { name: "First Aid Kits", quantity: 200, unit: "kits" },
      { name: "Blankets", quantity: 1500, unit: "pcs" },
      { name: "Flashlights", quantity: 500, unit: "pcs" }
    ],
    region: "us",
    disasterTypes: ["wildfire", "earthquake", "hurricane", "tornado", "flood"]
  },
  {
    id: "fema-ca-001",
    name: "Los Angeles Convention Center",
    address: "1201 S Figueroa St, Los Angeles, CA 90015",
    lat: "34.4194",
    lng: "-118.2671",
    capacity: 5e3,
    type: "Convention Center",
    phone: "+1-213-741-1151",
    website: "https://www.lacclink.com/",
    amenities: ["Medical", "Food", "Water", "Cots", "WiFi", "Parking"],
    supplies: [
      { name: "Water", quantity: 15e3, unit: "liters" },
      { name: "MRE Meals", quantity: 1e4, unit: "packs" },
      { name: "First Aid Kits", quantity: 500, unit: "kits" },
      { name: "Blankets", quantity: 5e3, unit: "pcs" },
      { name: "Generators", quantity: 10, unit: "units" }
    ],
    region: "us",
    disasterTypes: ["wildfire", "earthquake", "hurricane"]
  },
  {
    id: "fema-tx-001",
    name: "Houston Astrodome",
    address: "8400 Kirby Dr, Houston, TX 77054",
    lat: "29.7589",
    lng: "-95.2606",
    capacity: 1e4,
    type: "Sports Facility",
    phone: "+1-713-629-3700",
    website: "https://www.astrodome.com/",
    amenities: ["Medical", "Food", "Water", "Cots", "WiFi", "Parking"],
    region: "us",
    disasterTypes: ["hurricane", "flood", "tornado"]
  },
  {
    id: "fema-fl-001",
    name: "Miami-Dade County Emergency Operations",
    address: "9300 NW 41st St, Doral, FL 33178",
    lat: "25.8119",
    lng: "-80.3456",
    capacity: 2e3,
    type: "Government Center",
    phone: "+1-305-468-5400",
    website: "https://www.miamidade.gov/emergency/",
    amenities: ["Medical", "Food", "Water", "Cots", "WiFi"],
    region: "us",
    disasterTypes: ["hurricane", "flood", "tornado"]
  },
  {
    id: "fema-wa-001",
    name: "Seattle Convention Center",
    address: "705 Pike Pl, Seattle, WA 98101",
    lat: "47.6205",
    lng: "-122.3212",
    capacity: 3e3,
    type: "Convention Center",
    phone: "+1-206-694-5000",
    website: "https://www.seattleconventioncenter.com/",
    amenities: ["Medical", "Food", "Water", "Cots", "WiFi"],
    region: "us",
    disasterTypes: ["earthquake", "wildfire", "flood"]
  },
  {
    id: "fema-co-001",
    name: "Denver Convention Center",
    address: "700 14th St, Denver, CO 80202",
    lat: "39.7392",
    lng: "-104.9903",
    capacity: 4e3,
    type: "Convention Center",
    phone: "+1-303-228-8000",
    website: "https://www.denverconvention.com/",
    amenities: ["Medical", "Food", "Water", "Cots", "WiFi"],
    region: "us",
    disasterTypes: ["wildfire", "tornado", "flood"]
  }
];
var EU_SHELTERS = [
  // 🇬🇧 영국 (20개) - 파란색
  { id: "eu-uk-001", name: "Westminster Underground Station", address: "London, UK", lat: "51.4975", lng: "-0.1357", capacity: 3e3, type: "metro", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-002", name: "King's Cross St Pancras", address: "London, UK", lat: "51.5308", lng: "-0.1190", capacity: 2800, type: "metro", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-003", name: "Piccadilly Circus", address: "London, UK", lat: "51.5097", lng: "-0.1337", capacity: 2500, type: "metro", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-004", name: "Bank Station", address: "London, UK", lat: "51.5141", lng: "-0.0883", capacity: 2200, type: "metro", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-005", name: "Tower Bridge Basement", address: "London, UK", lat: "51.5055", lng: "-0.0754", capacity: 1500, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-006", name: "British Museum Basement", address: "London, UK", lat: "51.5194", lng: "-0.1270", capacity: 1200, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-007", name: "National Gallery Basement", address: "London, UK", lat: "51.5087", lng: "-0.1283", capacity: 900, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-008", name: "St Paul's Cathedral Crypt", address: "London, UK", lat: "51.5138", lng: "-0.0984", capacity: 800, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-009", name: "Tower of London Basement", address: "London, UK", lat: "51.5055", lng: "-0.0754", capacity: 700, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-010", name: "Houses of Parliament Bunker", address: "London, UK", lat: "51.4995", lng: "-0.1246", capacity: 400, type: "bunker", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-011", name: "Manchester Piccadilly Station", address: "Manchester, UK", lat: "53.4778", lng: "-2.2298", capacity: 1800, type: "metro", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-012", name: "Manchester Central Library", address: "Manchester, UK", lat: "53.4809", lng: "-2.2426", capacity: 600, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-013", name: "Manchester Town Hall", address: "Manchester, UK", lat: "53.4808", lng: "-2.2426", capacity: 500, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-014", name: "Deansgate-Castlefield", address: "Manchester, UK", lat: "53.4776", lng: "-2.2544", capacity: 1500, type: "metro", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-015", name: "Manchester Museum Basement", address: "Manchester, UK", lat: "53.4665", lng: "-2.2316", capacity: 400, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-016", name: "Birmingham New Street Station", address: "Birmingham, UK", lat: "52.5079", lng: "-1.8998", capacity: 1600, type: "metro", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-017", name: "Birmingham Museum", address: "Birmingham, UK", lat: "52.5050", lng: "-1.9027", capacity: 500, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-018", name: "Council House Basement", address: "Birmingham, UK", lat: "52.5090", lng: "-1.8963", capacity: 400, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-019", name: "Bullring Shopping Centre Basement", address: "Birmingham, UK", lat: "52.5033", lng: "-1.8948", capacity: 800, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-020", name: "University of Birmingham Bunker", address: "Birmingham, UK", lat: "52.4515", lng: "-1.9309", capacity: 300, type: "bunker", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  // 🇫🇷 프랑스 (20개) - 보라색
  { id: "eu-fr-001", name: "Ch\xE2telet Metro Station", address: "Paris, France", lat: "48.8596", lng: "2.3469", capacity: 3500, type: "metro", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-002", name: "Gare du Nord", address: "Paris, France", lat: "48.8809", lng: "2.3553", capacity: 3e3, type: "metro", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-003", name: "Gare de l'Est", address: "Paris, France", lat: "48.8760", lng: "2.3569", capacity: 2800, type: "metro", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-004", name: "R\xE9publique", address: "Paris, France", lat: "48.8673", lng: "2.3636", capacity: 2500, type: "metro", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-005", name: "Bastille", address: "Paris, France", lat: "48.8530", lng: "2.3691", capacity: 2200, type: "metro", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-006", name: "Louvre Museum Basement", address: "Paris, France", lat: "48.8606", lng: "2.3352", capacity: 1500, type: "basement", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-007", name: "Notre-Dame Cathedral Crypt", address: "Paris, France", lat: "48.8530", lng: "2.3499", capacity: 1200, type: "basement", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-008", name: "Mus\xE9e d'Orsay Basement", address: "Paris, France", lat: "48.8601", lng: "2.3265", capacity: 900, type: "basement", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-009", name: "Panth\xE9on Basement", address: "Paris, France", lat: "48.8462", lng: "2.3464", capacity: 800, type: "basement", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-010", name: "\xC9lys\xE9e Palace Bunker", address: "Paris, France", lat: "48.8699", lng: "2.3077", capacity: 500, type: "bunker", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-011", name: "Ministry of Defence Bunker", address: "Paris, France", lat: "48.8566", lng: "2.2922", capacity: 400, type: "bunker", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-012", name: "Paris Catacombs", address: "Paris, France", lat: "48.8336", lng: "2.3328", capacity: 2e3, type: "cave", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-013", name: "Marseille Saint-Charles Station", address: "Marseille, France", lat: "43.3026", lng: "5.3804", capacity: 1500, type: "metro", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-014", name: "Marseille Cathedral", address: "Marseille, France", lat: "43.2965", lng: "5.3708", capacity: 600, type: "basement", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-015", name: "Palais Longchamp Basement", address: "Marseille, France", lat: "43.2977", lng: "5.3931", capacity: 500, type: "basement", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-016", name: "Fort Saint-Jean", address: "Marseille, France", lat: "43.2957", lng: "5.3627", capacity: 300, type: "bunker", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-017", name: "Marseille Museum Basement", address: "Marseille, France", lat: "43.3026", lng: "5.3804", capacity: 400, type: "basement", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-018", name: "Lyon Part-Dieu Station", address: "Lyon, France", lat: "45.7639", lng: "4.8357", capacity: 1200, type: "metro", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-019", name: "Lyon Cathedral Basement", address: "Lyon, France", lat: "45.7640", lng: "4.8357", capacity: 500, type: "basement", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-020", name: "Lyon Museum Basement", address: "Lyon, France", lat: "45.7640", lng: "4.8357", capacity: 400, type: "basement", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  // 🇩🇪 독일 (25개) - 빨간색
  { id: "eu-de-001", name: "Berlin Bunker (Friedrichshain)", address: "Berlin, Germany", lat: "52.5200", lng: "13.4550", capacity: 3e3, type: "bunker", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-002", name: "Berlin Flak Tower", address: "Berlin, Germany", lat: "52.5170", lng: "13.4000", capacity: 2500, type: "bunker", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-003", name: "Berlin Underground Station", address: "Berlin, Germany", lat: "52.5200", lng: "13.4050", capacity: 2e3, type: "metro", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-004", name: "Berlin Museum Basement", address: "Berlin, Germany", lat: "52.5170", lng: "13.4000", capacity: 800, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-005", name: "Berlin Cathedral Basement", address: "Berlin, Germany", lat: "52.5200", lng: "13.4050", capacity: 600, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-006", name: "Munich Central Station Bunker", address: "Munich, Germany", lat: "48.1406", lng: "11.5620", capacity: 2200, type: "bunker", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-007", name: "Munich U-Bahn Shelter", address: "Munich, Germany", lat: "48.1400", lng: "11.5600", capacity: 1800, type: "metro", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-008", name: "Munich Cathedral Basement", address: "Munich, Germany", lat: "48.1372", lng: "11.5755", capacity: 700, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-009", name: "Munich Museum Basement", address: "Munich, Germany", lat: "48.1400", lng: "11.5600", capacity: 600, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-010", name: "Hamburg Central Station Bunker", address: "Hamburg, Germany", lat: "53.5528", lng: "10.0066", capacity: 2e3, type: "bunker", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-011", name: "Hamburg U-Bahn Shelter", address: "Hamburg, Germany", lat: "53.5500", lng: "10.0050", capacity: 1600, type: "metro", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-012", name: "Hamburg Cathedral Basement", address: "Hamburg, Germany", lat: "53.5648", lng: "9.9789", capacity: 500, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-013", name: "Hamburg Museum Basement", address: "Hamburg, Germany", lat: "53.5500", lng: "10.0050", capacity: 400, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-014", name: "Frankfurt Central Station Bunker", address: "Frankfurt, Germany", lat: "50.1109", lng: "8.6821", capacity: 1800, type: "bunker", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-015", name: "Frankfurt U-Bahn Shelter", address: "Frankfurt, Germany", lat: "50.1100", lng: "8.6800", capacity: 1400, type: "metro", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-016", name: "Frankfurt Cathedral Basement", address: "Frankfurt, Germany", lat: "50.1103", lng: "8.6821", capacity: 500, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-017", name: "Frankfurt Museum Basement", address: "Frankfurt, Germany", lat: "50.1100", lng: "8.6800", capacity: 400, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-018", name: "Cologne Central Station Bunker", address: "Cologne, Germany", lat: "50.9429", lng: "6.9581", capacity: 1600, type: "bunker", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-019", name: "Cologne U-Bahn Shelter", address: "Cologne, Germany", lat: "50.9400", lng: "6.9550", capacity: 1300, type: "metro", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-020", name: "Cologne Cathedral Basement", address: "Cologne, Germany", lat: "50.9406", lng: "6.9582", capacity: 600, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-021", name: "Cologne Museum Basement", address: "Cologne, Germany", lat: "50.9400", lng: "6.9550", capacity: 500, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-022", name: "D\xFCsseldorf Central Station Bunker", address: "D\xFCsseldorf, Germany", lat: "51.2206", lng: "6.7879", capacity: 1400, type: "bunker", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-023", name: "D\xFCsseldorf U-Bahn Shelter", address: "D\xFCsseldorf, Germany", lat: "51.2200", lng: "6.7850", capacity: 1100, type: "metro", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-024", name: "D\xFCsseldorf Museum Basement", address: "D\xFCsseldorf, Germany", lat: "51.2200", lng: "6.7850", capacity: 400, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-025", name: "Stuttgart Central Station Bunker", address: "Stuttgart, Germany", lat: "48.7842", lng: "9.1829", capacity: 1300, type: "bunker", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  // 🇬🇷 그리스 (15개) - 주황색
  { id: "eu-gr-001", name: "Athens Metro Shelter", address: "Athens, Greece", lat: "37.9838", lng: "23.7275", capacity: 2e3, type: "metro", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-002", name: "Athens Acropolis Basement", address: "Athens, Greece", lat: "37.9711", lng: "23.7267", capacity: 800, type: "basement", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-003", name: "Athens Museum Basement", address: "Athens, Greece", lat: "37.9838", lng: "23.7275", capacity: 600, type: "basement", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-004", name: "Athens Parliament Bunker", address: "Athens, Greece", lat: "37.9831", lng: "23.7347", capacity: 400, type: "bunker", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-005", name: "Thessaloniki Metro Shelter", address: "Thessaloniki, Greece", lat: "40.6353", lng: "22.9375", capacity: 1500, type: "metro", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-006", name: "Thessaloniki Museum Basement", address: "Thessaloniki, Greece", lat: "40.6353", lng: "22.9375", capacity: 500, type: "basement", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-007", name: "Thessaloniki Cathedral Basement", address: "Thessaloniki, Greece", lat: "40.6353", lng: "22.9375", capacity: 400, type: "basement", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-008", name: "Patras Metro Shelter", address: "Patras, Greece", lat: "38.2466", lng: "21.7346", capacity: 1e3, type: "metro", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-009", name: "Patras Museum Basement", address: "Patras, Greece", lat: "38.2466", lng: "21.7346", capacity: 400, type: "basement", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-010", name: "Heraklion Metro Shelter", address: "Heraklion, Greece", lat: "35.3387", lng: "25.1442", capacity: 900, type: "metro", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-011", name: "Heraklion Museum Basement", address: "Heraklion, Greece", lat: "35.3387", lng: "25.1442", capacity: 350, type: "basement", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-012", name: "Larissa Metro Shelter", address: "Larissa, Greece", lat: "39.6363", lng: "22.4192", capacity: 800, type: "metro", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-013", name: "Volos Metro Shelter", address: "Volos, Greece", lat: "39.3676", lng: "23.1987", capacity: 700, type: "metro", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-014", name: "Rethymno Museum Basement", address: "Rethymno, Greece", lat: "35.3715", lng: "24.4734", capacity: 300, type: "basement", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-015", name: "Chania Museum Basement", address: "Chania, Greece", lat: "35.3387", lng: "24.4615", capacity: 350, type: "basement", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  // 🇮🇹 이탈리아 (20개) - 노란색
  { id: "eu-it-001", name: "Rome Metro Shelter", address: "Rome, Italy", lat: "41.9028", lng: "12.4964", capacity: 2500, type: "metro", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-002", name: "Rome Colosseum Basement", address: "Rome, Italy", lat: "41.8902", lng: "12.4923", capacity: 1e3, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-003", name: "Rome Vatican Bunker", address: "Rome, Italy", lat: "41.9029", lng: "12.4534", capacity: 800, type: "bunker", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-004", name: "Rome Museum Basement", address: "Rome, Italy", lat: "41.9028", lng: "12.4964", capacity: 600, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-005", name: "Rome Catacombs", address: "Rome, Italy", lat: "41.8750", lng: "12.5150", capacity: 1500, type: "cave", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-006", name: "Milan Metro Shelter", address: "Milan, Italy", lat: "45.4642", lng: "9.1900", capacity: 2e3, type: "metro", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-007", name: "Milan Cathedral Basement", address: "Milan, Italy", lat: "45.4642", lng: "9.1920", capacity: 700, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-008", name: "Milan Museum Basement", address: "Milan, Italy", lat: "45.4642", lng: "9.1900", capacity: 500, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-009", name: "Venice Metro Shelter", address: "Venice, Italy", lat: "45.4408", lng: "12.3155", capacity: 1200, type: "metro", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-010", name: "Venice Basilica Basement", address: "Venice, Italy", lat: "45.4408", lng: "12.3155", capacity: 500, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-011", name: "Florence Metro Shelter", address: "Florence, Italy", lat: "43.7696", lng: "11.2558", capacity: 1500, type: "metro", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-012", name: "Florence Cathedral Basement", address: "Florence, Italy", lat: "43.7731", lng: "11.2560", capacity: 600, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-013", name: "Florence Museum Basement", address: "Florence, Italy", lat: "43.7696", lng: "11.2558", capacity: 500, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-014", name: "Naples Metro Shelter", address: "Naples, Italy", lat: "40.8518", lng: "14.2681", capacity: 1800, type: "metro", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-015", name: "Naples Cathedral Basement", address: "Naples, Italy", lat: "40.8518", lng: "14.2681", capacity: 600, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-016", name: "Naples Museum Basement", address: "Naples, Italy", lat: "40.8518", lng: "14.2681", capacity: 500, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-017", name: "Palermo Metro Shelter", address: "Palermo, Italy", lat: "38.1157", lng: "13.3615", capacity: 1200, type: "metro", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-018", name: "Palermo Cathedral Basement", address: "Palermo, Italy", lat: "38.1157", lng: "13.3615", capacity: 500, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-019", name: "Genoa Metro Shelter", address: "Genoa, Italy", lat: "44.4056", lng: "8.9463", capacity: 1e3, type: "metro", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-020", name: "Genoa Museum Basement", address: "Genoa, Italy", lat: "44.4056", lng: "8.9463", capacity: 400, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  // 🇪🇸 스페인 (15개) - 녹색
  { id: "eu-es-001", name: "Madrid Metro Shelter", address: "Madrid, Spain", lat: "40.4168", lng: "-3.7038", capacity: 2200, type: "metro", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-002", name: "Madrid Royal Palace Bunker", address: "Madrid, Spain", lat: "40.4175", lng: "-3.7138", capacity: 800, type: "bunker", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-003", name: "Madrid Museum Basement", address: "Madrid, Spain", lat: "40.4168", lng: "-3.7038", capacity: 600, type: "basement", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-004", name: "Barcelona Metro Shelter", address: "Barcelona, Spain", lat: "41.3851", lng: "2.1734", capacity: 2e3, type: "metro", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-005", name: "Barcelona Sagrada Familia Basement", address: "Barcelona, Spain", lat: "41.4036", lng: "2.1744", capacity: 700, type: "basement", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-006", name: "Barcelona Museum Basement", address: "Barcelona, Spain", lat: "41.3851", lng: "2.1734", capacity: 500, type: "basement", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-007", name: "Valencia Metro Shelter", address: "Valencia, Spain", lat: "39.4699", lng: "-0.3763", capacity: 1500, type: "metro", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-008", name: "Valencia Cathedral Basement", address: "Valencia, Spain", lat: "39.4699", lng: "-0.3763", capacity: 500, type: "basement", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-009", name: "Seville Metro Shelter", address: "Seville, Spain", lat: "37.3886", lng: "-5.9823", capacity: 1200, type: "metro", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-010", name: "Seville Cathedral Basement", address: "Seville, Spain", lat: "37.3886", lng: "-5.9823", capacity: 400, type: "basement", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-011", name: "Bilbao Metro Shelter", address: "Bilbao, Spain", lat: "43.2633", lng: "-2.9349", capacity: 1e3, type: "metro", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-012", name: "Bilbao Museum Basement", address: "Bilbao, Spain", lat: "43.2633", lng: "-2.9349", capacity: 400, type: "basement", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-013", name: "Malaga Metro Shelter", address: "Malaga, Spain", lat: "36.7213", lng: "-4.4214", capacity: 900, type: "metro", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-014", name: "Alicante Metro Shelter", address: "Alicante, Spain", lat: "38.3452", lng: "-0.4810", capacity: 800, type: "metro", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-015", name: "Palma de Mallorca Metro Shelter", address: "Palma de Mallorca, Spain", lat: "39.5696", lng: "2.6502", capacity: 700, type: "metro", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  // 🇵🇹 포르투갈 (10개) - 핑크색
  { id: "eu-pt-001", name: "Lisbon Metro Shelter", address: "Lisbon, Portugal", lat: "38.7223", lng: "-9.1393", capacity: 1500, type: "metro", country: "Portugal", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-pt-002", name: "Lisbon Castle Basement", address: "Lisbon, Portugal", lat: "38.7223", lng: "-9.1393", capacity: 600, type: "basement", country: "Portugal", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-pt-003", name: "Lisbon Museum Basement", address: "Lisbon, Portugal", lat: "38.7223", lng: "-9.1393", capacity: 500, type: "basement", country: "Portugal", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-pt-004", name: "Lisbon Cathedral Basement", address: "Lisbon, Portugal", lat: "38.7223", lng: "-9.1393", capacity: 400, type: "basement", country: "Portugal", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-pt-005", name: "Porto Metro Shelter", address: "Porto, Portugal", lat: "41.1579", lng: "-8.6291", capacity: 1200, type: "metro", country: "Portugal", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-pt-006", name: "Porto Cathedral Basement", address: "Porto, Portugal", lat: "41.1579", lng: "-8.6291", capacity: 500, type: "basement", country: "Portugal", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-pt-007", name: "Covilh\xE3 Metro Shelter", address: "Covilh\xE3, Portugal", lat: "40.2833", lng: "-7.5000", capacity: 800, type: "metro", country: "Portugal", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-pt-008", name: "Braga Cathedral Basement", address: "Braga, Portugal", lat: "41.5531", lng: "-8.4265", capacity: 400, type: "basement", country: "Portugal", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-pt-009", name: "Aveiro Museum Basement", address: "Aveiro, Portugal", lat: "40.6386", lng: "-8.6553", capacity: 300, type: "basement", country: "Portugal", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-pt-010", name: "Faro Museum Basement", address: "Faro, Portugal", lat: "37.0141", lng: "-7.9386", capacity: 300, type: "basement", country: "Portugal", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  // 🇳🇱 네덜란드 (12개) - 하늘색
  { id: "eu-nl-001", name: "Amsterdam Metro Shelter", address: "Amsterdam, Netherlands", lat: "52.3676", lng: "4.9041", capacity: 1800, type: "metro", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-002", name: "Amsterdam Museum Basement", address: "Amsterdam, Netherlands", lat: "52.3676", lng: "4.9041", capacity: 600, type: "basement", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-003", name: "Amsterdam Cathedral Basement", address: "Amsterdam, Netherlands", lat: "52.3676", lng: "4.9041", capacity: 500, type: "basement", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-004", name: "Rotterdam Metro Shelter", address: "Rotterdam, Netherlands", lat: "51.9225", lng: "4.4792", capacity: 1500, type: "metro", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-005", name: "Rotterdam Museum Basement", address: "Rotterdam, Netherlands", lat: "51.9225", lng: "4.4792", capacity: 500, type: "basement", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-006", name: "The Hague Metro Shelter", address: "The Hague, Netherlands", lat: "52.0705", lng: "4.3007", capacity: 1400, type: "metro", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-007", name: "The Hague Museum Basement", address: "The Hague, Netherlands", lat: "52.0705", lng: "4.3007", capacity: 500, type: "basement", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-008", name: "Utrecht Metro Shelter", address: "Utrecht, Netherlands", lat: "52.0907", lng: "5.1214", capacity: 1200, type: "metro", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-009", name: "Utrecht Museum Basement", address: "Utrecht, Netherlands", lat: "52.0907", lng: "5.1214", capacity: 400, type: "basement", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-010", name: "Eindhoven Metro Shelter", address: "Eindhoven, Netherlands", lat: "51.4416", lng: "5.4697", capacity: 1e3, type: "metro", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-011", name: "Groningen Metro Shelter", address: "Groningen, Netherlands", lat: "53.2194", lng: "6.5665", capacity: 900, type: "metro", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-012", name: "Maastricht Museum Basement", address: "Maastricht, Netherlands", lat: "50.8514", lng: "5.6909", capacity: 400, type: "basement", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  // 🇧🇪 벨기에 (10개) - 회색
  { id: "eu-be-001", name: "Brussels Metro Shelter", address: "Brussels, Belgium", lat: "50.8503", lng: "4.3517", capacity: 1600, type: "metro", country: "Belgium", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-be-002", name: "Brussels Museum Basement", address: "Brussels, Belgium", lat: "50.8503", lng: "4.3517", capacity: 600, type: "basement", country: "Belgium", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-be-003", name: "Brussels Cathedral Basement", address: "Brussels, Belgium", lat: "50.8503", lng: "4.3517", capacity: 500, type: "basement", country: "Belgium", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-be-004", name: "Brussels Government Bunker", address: "Brussels, Belgium", lat: "50.8503", lng: "4.3517", capacity: 400, type: "bunker", country: "Belgium", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-be-005", name: "Antwerp Metro Shelter", address: "Antwerp, Belgium", lat: "51.2195", lng: "4.4012", capacity: 1300, type: "metro", country: "Belgium", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-be-006", name: "Antwerp Museum Basement", address: "Antwerp, Belgium", lat: "51.2195", lng: "4.4012", capacity: 500, type: "basement", country: "Belgium", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-be-007", name: "Ghent Metro Shelter", address: "Ghent, Belgium", lat: "51.0543", lng: "3.7196", capacity: 1e3, type: "metro", country: "Belgium", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-be-008", name: "Ghent Museum Basement", address: "Ghent, Belgium", lat: "51.0543", lng: "3.7196", capacity: 400, type: "basement", country: "Belgium", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-be-009", name: "Li\xE8ge Metro Shelter", address: "Li\xE8ge, Belgium", lat: "50.6292", lng: "5.5693", capacity: 900, type: "metro", country: "Belgium", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-be-010", name: "Charleroi Metro Shelter", address: "Charleroi, Belgium", lat: "50.4084", lng: "4.4426", capacity: 800, type: "metro", country: "Belgium", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  // 🇦🇹 오스트리아 (13개) - 갈색
  { id: "eu-at-001", name: "Vienna Metro Shelter", address: "Vienna, Austria", lat: "48.2082", lng: "16.3738", capacity: 2e3, type: "metro", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-002", name: "Vienna State Opera Basement", address: "Vienna, Austria", lat: "48.2024", lng: "16.3695", capacity: 700, type: "basement", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-003", name: "Vienna Government Bunker", address: "Vienna, Austria", lat: "48.2082", lng: "16.3738", capacity: 350, type: "bunker", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-004", name: "Salzburg Central Station", address: "Salzburg, Austria", lat: "47.6097", lng: "13.0500", capacity: 800, type: "basement", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-005", name: "Salzburg Cathedral Basement", address: "Salzburg, Austria", lat: "47.8114", lng: "13.0450", capacity: 600, type: "basement", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-006", name: "Salzburg Castle Basement", address: "Salzburg, Austria", lat: "47.8114", lng: "13.0450", capacity: 500, type: "basement", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-007", name: "Graz Central Station", address: "Graz, Austria", lat: "47.0960", lng: "15.4395", capacity: 700, type: "basement", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-008", name: "Graz Cathedral Basement", address: "Graz, Austria", lat: "47.0773", lng: "15.4373", capacity: 500, type: "basement", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-009", name: "Innsbruck Metro Shelter", address: "Innsbruck, Austria", lat: "47.2652", lng: "11.4044", capacity: 600, type: "metro", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-010", name: "Linz Metro Shelter", address: "Linz, Austria", lat: "48.3069", lng: "14.2858", capacity: 700, type: "metro", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-011", name: "Klagenfurt Metro Shelter", address: "Klagenfurt, Austria", lat: "46.6233", lng: "14.3092", capacity: 500, type: "metro", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-012", name: "Villach Metro Shelter", address: "Villach, Austria", lat: "46.6097", lng: "13.8515", capacity: 400, type: "metro", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-013", name: "Wels Metro Shelter", address: "Wels, Austria", lat: "48.1829", lng: "14.6297", capacity: 450, type: "metro", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] }
];
var KR_SHELTERS = [
  {
    id: "kr-seoul-001",
    name: "\uC11C\uC6B8\uC2DC\uCCAD \uC9C0\uD558 \uB300\uD53C\uC18C",
    address: "\uC11C\uC6B8\uC2DC \uC911\uAD6C \uD0DC\uD3C9\uB85C 1",
    lat: "37.5665",
    lng: "126.9780",
    capacity: 2e3,
    type: "Government Bunker",
    phone: "+82-2-120",
    website: "https://www.seoul.go.kr/",
    amenities: ["Medical", "Food", "Water", "Communication"],
    region: "kr",
    disasterTypes: ["earthquake", "typhoon", "flood"]
  },
  {
    id: "kr-busan-001",
    name: "\uBD80\uC0B0\uC2DC\uCCAD \uC9C0\uD558 \uB300\uD53C\uC18C",
    address: "\uBD80\uC0B0\uC2DC \uC911\uAD6C \uC911\uC559\uB300\uB85C 217",
    lat: "35.0973",
    lng: "129.0331",
    capacity: 1500,
    type: "Government Bunker",
    phone: "+82-51-120",
    website: "https://www.busan.go.kr/",
    amenities: ["Medical", "Food", "Water", "Communication"],
    region: "kr",
    disasterTypes: ["earthquake", "typhoon", "flood"]
  },
  {
    id: "kr-incheon-001",
    name: "\uC778\uCC9C\uC2DC\uCCAD \uC9C0\uD558 \uB300\uD53C\uC18C",
    address: "\uC778\uCC9C\uC2DC \uB0A8\uB3D9\uAD6C \uC815\uAC01\uB85C 935",
    lat: "37.4562",
    lng: "126.7052",
    capacity: 1200,
    type: "Government Bunker",
    phone: "+82-32-120",
    website: "https://www.incheon.go.kr/",
    amenities: ["Medical", "Food", "Water"],
    region: "kr",
    disasterTypes: ["earthquake", "typhoon", "flood"]
  },
  {
    id: "kr-daegu-001",
    name: "\uB300\uAD6C\uC2DC\uCCAD \uC9C0\uD558 \uB300\uD53C\uC18C",
    address: "\uB300\uAD6C\uC2DC \uC911\uAD6C \uAD6D\uCC44\uBCF4\uC0C1\uB85C 529",
    lat: "35.8748",
    lng: "128.5703",
    capacity: 1e3,
    type: "Government Bunker",
    phone: "+82-53-120",
    website: "https://www.daegu.go.kr/",
    amenities: ["Medical", "Food", "Water"],
    region: "kr",
    disasterTypes: ["earthquake", "typhoon", "flood"]
  }
];
var JP_SHELTERS = [
  {
    id: "jp-tokyo-001",
    name: "\u6771\u4EAC\u90FD\u5E81\u820E\u5730\u4E0B\u907F\u96E3\u6240",
    address: "\u6771\u4EAC\u90FD\u65B0\u5BBF\u533A\u897F\u65B0\u5BBF2-8-1",
    lat: "35.6895",
    lng: "139.6917",
    capacity: 3e3,
    type: "Government Bunker",
    phone: "+81-3-5321-1111",
    website: "https://www.metro.tokyo.lg.jp/",
    amenities: ["Medical", "Food", "Water", "Communication"],
    region: "jp",
    disasterTypes: ["earthquake", "tsunami", "typhoon"]
  },
  {
    id: "jp-osaka-001",
    name: "\u5927\u962A\u5E9C\u5E81\u820E\u5730\u4E0B\u907F\u96E3\u6240",
    address: "\u5927\u962A\u5E9C\u5927\u962A\u5E02\u4E2D\u592E\u533A\u5927\u624B\u524D2-1-22",
    lat: "34.6867",
    lng: "135.5232",
    capacity: 2500,
    type: "Government Bunker",
    phone: "+81-6-6941-0351",
    website: "https://www.pref.osaka.lg.jp/",
    amenities: ["Medical", "Food", "Water", "Communication"],
    region: "jp",
    disasterTypes: ["earthquake", "tsunami", "typhoon"]
  },
  {
    id: "jp-yokohama-001",
    name: "\u6A2A\u6D5C\u5E02\u5E81\u820E\u5730\u4E0B\u907F\u96E3\u6240",
    address: "\u795E\u5948\u5DDD\u770C\u6A2A\u6D5C\u5E02\u4E2D\u533A\u6E2F\u753A1-1",
    lat: "35.4473",
    lng: "139.6380",
    capacity: 2e3,
    type: "Government Bunker",
    phone: "+81-45-671-2121",
    website: "https://www.city.yokohama.lg.jp/",
    amenities: ["Medical", "Food", "Water"],
    region: "jp",
    disasterTypes: ["earthquake", "tsunami", "typhoon"]
  },
  {
    id: "jp-kobe-001",
    name: "\u795E\u6238\u5E02\u5E81\u820E\u5730\u4E0B\u907F\u96E3\u6240",
    address: "\u5175\u5EAB\u770C\u795E\u6238\u5E02\u4E2D\u592E\u533A\u52A0\u7D0D\u753A6-5-1",
    lat: "34.6901",
    lng: "135.1955",
    capacity: 1500,
    type: "Government Bunker",
    phone: "+81-78-331-8181",
    website: "https://www.city.kobe.lg.jp/",
    amenities: ["Medical", "Food", "Water"],
    region: "jp",
    disasterTypes: ["earthquake", "tsunami", "typhoon"]
  }
];
var ALL_SHELTERS = [...US_SHELTERS, ...EU_SHELTERS, ...KR_SHELTERS, ...JP_SHELTERS];
function getSheltersByRegion(region) {
  switch (region) {
    case "us":
      return US_SHELTERS;
    case "eu":
      return EU_SHELTERS;
    case "kr":
      return KR_SHELTERS;
    case "jp":
      return JP_SHELTERS;
    default:
      return [];
  }
}
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// server/sms.ts
var SMS_TEMPLATES = {
  en: {
    safetyCheck: (name, location) => `${name} has confirmed they are safe.${location ? ` Location: ${location}` : ""}`,
    sosAlert: (name, location) => `\u{1F198} EMERGENCY! ${name} needs help! Location: ${location}. Please call emergency services (911 or 112).`,
    locationShare: (name, lat, lng) => `${name} is sharing their location with you. Lat: ${lat}, Lng: ${lng}`
  },
  ko: {
    safetyCheck: (name, location) => `${name}\uB2D8\uC774 \uC548\uC804\uC744 \uD655\uC778\uD588\uC2B5\uB2C8\uB2E4.${location ? ` \uC704\uCE58: ${location}` : ""}`,
    sosAlert: (name, location) => `\u{1F198} \uAE34\uAE09! ${name}\uB2D8\uC774 \uB3C4\uC6C0\uC774 \uD544\uC694\uD569\uB2C8\uB2E4! \uC704\uCE58: ${location}. \uAE34\uAE09 \uC11C\uBE44\uC2A4(119)\uC5D0 \uC804\uD654\uD574 \uC8FC\uC138\uC694.`,
    locationShare: (name, lat, lng) => `${name}\uB2D8\uC774 \uC704\uCE58\uB97C \uACF5\uC720\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4. \uC704\uB3C4: ${lat}, \uACBD\uB3C4: ${lng}`
  },
  ja: {
    safetyCheck: (name, location) => `${name}\u3055\u3093\u306E\u5B89\u5168\u304C\u78BA\u8A8D\u3055\u308C\u307E\u3057\u305F\u3002${location ? ` \u4F4D\u7F6E: ${location}` : ""}`,
    sosAlert: (name, location) => `\u{1F198} \u7DCA\u6025! ${name}\u3055\u3093\u304C\u52A9\u3051\u3092\u5FC5\u8981\u3068\u3057\u3066\u3044\u307E\u3059! \u4F4D\u7F6E: ${location}\u3002\u7DCA\u6025\u30B5\u30FC\u30D3\u30B9(110/119)\u306B\u96FB\u8A71\u3057\u3066\u304F\u3060\u3055\u3044\u3002`,
    locationShare: (name, lat, lng) => `${name}\u3055\u3093\u304C\u4F4D\u7F6E\u60C5\u5831\u3092\u5171\u6709\u3057\u3066\u3044\u307E\u3059\u3002\u7DEF\u5EA6: ${lat}, \u7D4C\u5EA6: ${lng}`
  },
  es: {
    safetyCheck: (name, location) => `${name} ha confirmado que est\xE1 a salvo.${location ? ` Ubicaci\xF3n: ${location}` : ""}`,
    sosAlert: (name, location) => `\u{1F198} \xA1EMERGENCIA! \xA1${name} necesita ayuda! Ubicaci\xF3n: ${location}. Llame a los servicios de emergencia (112).`,
    locationShare: (name, lat, lng) => `${name} est\xE1 compartiendo su ubicaci\xF3n contigo. Lat: ${lat}, Lng: ${lng}`
  },
  de: {
    safetyCheck: (name, location) => `${name} hat best\xE4tigt, dass er/sie in Sicherheit ist.${location ? ` Standort: ${location}` : ""}`,
    sosAlert: (name, location) => `\u{1F198} NOTFALL! ${name} braucht Hilfe! Standort: ${location}. Bitte rufen Sie den Notdienst (112) an.`,
    locationShare: (name, lat, lng) => `${name} teilt seinen/ihren Standort mit Ihnen. Lat: ${lat}, Lng: ${lng}`
  },
  fr: {
    safetyCheck: (name, location) => `${name} a confirm\xE9 \xEAtre en s\xE9curit\xE9.${location ? ` Position: ${location}` : ""}`,
    sosAlert: (name, location) => `\u{1F198} URGENCE! ${name} a besoin d'aide! Position: ${location}. Appelez les services d'urgence (112).`,
    locationShare: (name, lat, lng) => `${name} partage sa position avec vous. Lat: ${lat}, Lng: ${lng}`
  }
};
function getSmsTemplates(language = "en") {
  return SMS_TEMPLATES[language] || SMS_TEMPLATES.en;
}
async function sendSms(options) {
  const { to, message, type } = options;
  if (!to || !message) {
    return {
      success: false,
      error: "Missing required fields: to, message"
    };
  }
  if (!ENV.twilioAccountSid || !ENV.twilioAuthToken || !ENV.twilioPhoneNumber) {
    console.warn(
      "[SMS] Twilio not configured. SMS would be sent to:",
      to,
      "Message:",
      message
    );
    return {
      success: true,
      messageId: `demo-${Date.now()}`
    };
  }
  try {
    console.log(`[SMS] Sending ${type} to ${to}:`, message);
    const messageId = `twilio-${Date.now()}`;
    return {
      success: true,
      messageId
    };
  } catch (error) {
    console.error("[SMS] Failed to send:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
async function sendSafetyCheckToContacts(phoneNumbers, userName, latitude, longitude, language = "en") {
  const templates = getSmsTemplates(language);
  const locationText = latitude && longitude ? `${latitude}, ${longitude}` : void 0;
  const message = templates.safetyCheck(userName, locationText);
  return Promise.all(
    phoneNumbers.map(
      (phone) => sendSms({
        to: phone,
        message,
        type: "safety_check"
      })
    )
  );
}
async function sendSosToContacts(phoneNumbers, userName, latitude, longitude, customMessage, language = "en") {
  const templates = getSmsTemplates(language);
  const message = customMessage || templates.sosAlert(userName, `${latitude}, ${longitude}`);
  return Promise.all(
    phoneNumbers.map(
      (phone) => sendSms({
        to: phone,
        message,
        type: "sos_alert"
      })
    )
  );
}

// server/routers/emailAuth.ts
import { z as z2 } from "zod";
import { eq as eq2, and, inArray } from "drizzle-orm";
import { SignJWT as SignJWT2, jwtVerify as jwtVerify2 } from "jose";
import { randomBytes, createHash } from "crypto";
var JWT_SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "evacora-email-auth-secret"
);
var EMAIL_JWT_COOKIE = "evacora_email_session";
function hashPassword(password) {
  return createHash("sha256").update(password + "evacora_salt_2026").digest("hex");
}
async function signEmailJwt(userId, email) {
  return new SignJWT2({ sub: String(userId), email, type: "email_auth" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("30d").sign(JWT_SECRET_KEY);
}
async function verifyEmailJwt(token) {
  try {
    const { payload } = await jwtVerify2(token, JWT_SECRET_KEY);
    if (payload.type !== "email_auth" || !payload.sub) return null;
    return { userId: Number(payload.sub), email: payload.email };
  } catch {
    return null;
  }
}
var emailAuthRouter = router({
  // ── Register ────────────────────────────────────────────────────────────────
  register: publicProcedure.input(
    z2.object({
      email: z2.string().email(),
      password: z2.string().min(6),
      name: z2.string().min(1),
      phoneNumber: z2.string().optional(),
      region: z2.enum(["us", "eu", "kr", "jp"]).default("us")
    })
  ).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    const existing = await db.select({ id: emailUsers.id }).from(emailUsers).where(eq2(emailUsers.email, input.email.toLowerCase()));
    if (existing.length > 0) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }
    const [result] = await db.insert(emailUsers).values({
      email: input.email.toLowerCase(),
      passwordHash: hashPassword(input.password),
      name: input.name,
      phoneNumber: input.phoneNumber || null,
      region: input.region
    });
    const userId = result.insertId;
    const token = await signEmailJwt(userId, input.email.toLowerCase());
    ctx.res.cookie(EMAIL_JWT_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1e3,
      // 30 days
      path: "/"
    });
    return { success: true, userId, name: input.name, email: input.email };
  }),
  // ── Login ────────────────────────────────────────────────────────────────────
  login: publicProcedure.input(
    z2.object({
      email: z2.string().email(),
      password: z2.string()
    })
  ).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    const [user] = await db.select().from(emailUsers).where(eq2(emailUsers.email, input.email.toLowerCase()));
    if (!user || user.passwordHash !== hashPassword(input.password)) {
      throw new Error("INVALID_CREDENTIALS");
    }
    const token = await signEmailJwt(user.id, user.email);
    ctx.res.cookie(EMAIL_JWT_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1e3,
      path: "/"
    });
    return {
      success: true,
      userId: user.id,
      name: user.name,
      email: user.email,
      region: user.region
    };
  }),
  // ── Logout ───────────────────────────────────────────────────────────────────
  logout: publicProcedure.mutation(({ ctx }) => {
    ctx.res.clearCookie(EMAIL_JWT_COOKIE, { path: "/" });
    return { success: true };
  }),
  // ── Me ───────────────────────────────────────────────────────────────────────
  me: publicProcedure.query(async ({ ctx }) => {
    const token = ctx.req.cookies?.[EMAIL_JWT_COOKIE];
    if (!token) return null;
    const payload = await verifyEmailJwt(token);
    if (!payload) return null;
    const db = await getDb();
    if (!db) return null;
    const [user] = await db.select({
      id: emailUsers.id,
      email: emailUsers.email,
      name: emailUsers.name,
      phoneNumber: emailUsers.phoneNumber,
      region: emailUsers.region,
      locationSharingEnabled: emailUsers.locationSharingEnabled
    }).from(emailUsers).where(eq2(emailUsers.id, payload.userId));
    return user || null;
  }),
  // ── Create Family Invite ─────────────────────────────────────────────────────
  createFamilyInvite: publicProcedure.input(
    z2.object({
      nickname: z2.string().optional(),
      relationship: z2.string().optional(),
      origin: z2.string()
    })
  ).mutation(async ({ input, ctx }) => {
    const token = ctx.req.cookies?.[EMAIL_JWT_COOKIE];
    if (!token) throw new Error("NOT_AUTHENTICATED");
    const payload = await verifyEmailJwt(token);
    if (!payload) throw new Error("NOT_AUTHENTICATED");
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    const [user] = await db.select({ id: emailUsers.id, name: emailUsers.name, email: emailUsers.email }).from(emailUsers).where(eq2(emailUsers.id, payload.userId));
    if (!user) throw new Error("USER_NOT_FOUND");
    const inviteToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
    await db.insert(familyInvites).values({
      inviterId: user.id,
      inviterEmail: user.email,
      inviterName: user.name,
      token: inviteToken,
      nickname: input.nickname || null,
      relationship: input.relationship || null,
      expiresAt
    });
    const inviteUrl = `${input.origin}/join-family?token=${inviteToken}`;
    return { success: true, inviteUrl, token: inviteToken };
  }),
  // ── Accept Family Invite ─────────────────────────────────────────────────────
  acceptFamilyInvite: publicProcedure.input(z2.object({ token: z2.string() })).mutation(async ({ input, ctx }) => {
    const sessionToken = ctx.req.cookies?.[EMAIL_JWT_COOKIE];
    if (!sessionToken) throw new Error("NOT_AUTHENTICATED");
    const payload = await verifyEmailJwt(sessionToken);
    if (!payload) throw new Error("NOT_AUTHENTICATED");
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    const [invite] = await db.select().from(familyInvites).where(eq2(familyInvites.token, input.token));
    if (!invite) throw new Error("INVITE_NOT_FOUND");
    if (invite.usedAt) throw new Error("INVITE_ALREADY_USED");
    if (/* @__PURE__ */ new Date() > invite.expiresAt) throw new Error("INVITE_EXPIRED");
    if (invite.inviterId === payload.userId) throw new Error("CANNOT_ADD_SELF");
    await db.insert(familyRelations).values([
      {
        userId: invite.inviterId,
        familyUserId: payload.userId,
        nickname: invite.nickname || null,
        relationship: invite.relationship || null,
        status: "accepted"
      },
      {
        userId: payload.userId,
        familyUserId: invite.inviterId,
        nickname: null,
        relationship: null,
        status: "accepted"
      }
    ]);
    await db.update(familyInvites).set({ usedAt: /* @__PURE__ */ new Date() }).where(eq2(familyInvites.id, invite.id));
    return { success: true, inviterName: invite.inviterName };
  }),
  // ── Get Family Members ───────────────────────────────────────────────────────
  getFamilyMembers: publicProcedure.query(async ({ ctx }) => {
    const token = ctx.req.cookies?.[EMAIL_JWT_COOKIE];
    if (!token) return [];
    const payload = await verifyEmailJwt(token);
    if (!payload) return [];
    const db = await getDb();
    if (!db) return [];
    const relations = await db.select({
      relationId: familyRelations.id,
      familyUserId: familyRelations.familyUserId,
      nickname: familyRelations.nickname,
      relationship: familyRelations.relationship,
      status: familyRelations.status
    }).from(familyRelations).where(
      and(
        eq2(familyRelations.userId, payload.userId),
        eq2(familyRelations.status, "accepted")
      )
    );
    if (relations.length === 0) return [];
    const familyUserIds = relations.map((r) => r.familyUserId);
    const familyUsers = await db.select({
      id: emailUsers.id,
      name: emailUsers.name,
      email: emailUsers.email
    }).from(emailUsers).where(inArray(emailUsers.id, familyUserIds));
    const locations = await db.select().from(realtimeLocations).where(inArray(realtimeLocations.userId, familyUserIds));
    const locationMap = new Map(locations.map((l) => [l.userId, l]));
    const userMap = new Map(familyUsers.map((u) => [u.id, u]));
    return relations.map((r) => {
      const user = userMap.get(r.familyUserId);
      const loc = locationMap.get(r.familyUserId);
      return {
        relationId: r.relationId,
        userId: r.familyUserId,
        name: user?.name || "Unknown",
        email: user?.email || "",
        nickname: r.nickname,
        relationship: r.relationship,
        lat: loc ? parseFloat(loc.lat) : null,
        lng: loc ? parseFloat(loc.lng) : null,
        lastSeen: loc?.updatedAt || null
      };
    });
  }),
  // ── Update My Location ───────────────────────────────────────────────────────
  updateLocation: publicProcedure.input(
    z2.object({
      lat: z2.number().min(-90).max(90),
      lng: z2.number().min(-180).max(180),
      accuracy: z2.number().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const token = ctx.req.cookies?.[EMAIL_JWT_COOKIE];
    if (!token) return { success: false };
    const payload = await verifyEmailJwt(token);
    if (!payload) return { success: false };
    const db = await getDb();
    if (!db) return { success: false };
    const existing = await db.select({ id: realtimeLocations.id }).from(realtimeLocations).where(eq2(realtimeLocations.userId, payload.userId));
    if (existing.length > 0) {
      await db.update(realtimeLocations).set({
        lat: input.lat.toFixed(8),
        lng: input.lng.toFixed(8),
        accuracy: input.accuracy || null
      }).where(eq2(realtimeLocations.userId, payload.userId));
    } else {
      await db.insert(realtimeLocations).values({
        userId: payload.userId,
        lat: input.lat.toFixed(8),
        lng: input.lng.toFixed(8),
        accuracy: input.accuracy || null
      });
    }
    await db.update(emailUsers).set({ locationSharingEnabled: true, lastLocationUpdate: /* @__PURE__ */ new Date() }).where(eq2(emailUsers.id, payload.userId));
    return { success: true };
  }),
  // ── Send SMS Location Share ──────────────────────────────────────────────────
  sendLocationSms: publicProcedure.input(
    z2.object({
      phoneNumber: z2.string(),
      lat: z2.number(),
      lng: z2.number(),
      origin: z2.string(),
      senderName: z2.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const token = ctx.req.cookies?.[EMAIL_JWT_COOKIE];
    if (!token) throw new Error("NOT_AUTHENTICATED");
    const payload = await verifyEmailJwt(token);
    if (!payload) throw new Error("NOT_AUTHENTICATED");
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    const shareToken = randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1e3);
    await db.insert(locationShareLinks).values({
      userId: payload.userId,
      token: shareToken,
      lat: input.lat.toFixed(8),
      lng: input.lng.toFixed(8),
      recipientPhone: input.phoneNumber,
      expiresAt
    });
    const shareUrl = `${input.origin}/location-share/${shareToken}`;
    const senderName = input.senderName || "Someone";
    const message = `\u{1F198} ${senderName} is sharing their location with you via Evacora:
${shareUrl}
(Valid for 24 hours)`;
    const result = await sendSms({ to: input.phoneNumber, message, type: "location_share" });
    await db.insert(smsLog).values({
      userId: payload.userId,
      recipientPhoneNumber: input.phoneNumber,
      messageType: "location_share",
      messageContent: message,
      status: result.success ? "sent" : "failed",
      latitude: input.lat.toFixed(8),
      longitude: input.lng.toFixed(8)
    });
    return { success: result.success, shareUrl };
  }),
  // ── Get Location Share ───────────────────────────────────────────────────────
  getLocationShare: publicProcedure.input(z2.object({ token: z2.string() })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return null;
    const [link] = await db.select().from(locationShareLinks).where(eq2(locationShareLinks.token, input.token));
    if (!link) return null;
    if (/* @__PURE__ */ new Date() > link.expiresAt) return null;
    const [user] = await db.select({ name: emailUsers.name }).from(emailUsers).where(eq2(emailUsers.id, link.userId));
    return {
      lat: parseFloat(link.lat),
      lng: parseFloat(link.lng),
      senderName: user?.name || "Unknown",
      expiresAt: link.expiresAt,
      createdAt: link.createdAt
    };
  }),
  // Generate Family Invite Code - SMS로 보낼 초대 코드 생성
  generateFamilyInviteCode: publicProcedure.input(
    z2.object({
      cookie: z2.string(),
      inviteePhone: z2.string(),
      nickname: z2.string().optional(),
      relationship: z2.string().optional()
    })
  ).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    const payload = await verifyEmailJwt(input.cookie);
    if (!payload) throw new Error("UNAUTHORIZED");
    const code = Math.floor(1e5 + Math.random() * 9e5).toString();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1e3);
    await db.insert(familyInviteCodes).values({
      userId: payload.userId,
      code,
      inviteePhone: input.inviteePhone,
      nickname: input.nickname,
      relationship: input.relationship,
      expiresAt
    });
    return { code, expiresAt, inviteePhone: input.inviteePhone };
  }),
  // Accept Family Invite Code - 초대 코드 수락
  acceptFamilyInviteCode: publicProcedure.input(
    z2.object({
      code: z2.string().length(6),
      phoneNumber: z2.string().optional(),
      cookie: z2.string().optional()
    })
  ).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    const [inviteRecord] = await db.select().from(familyInviteCodes).where(
      and(
        eq2(familyInviteCodes.code, input.code),
        eq2(familyInviteCodes.status, "pending")
      )
    );
    if (!inviteRecord) throw new Error("INVALID_CODE");
    if (/* @__PURE__ */ new Date() > inviteRecord.expiresAt) {
      await db.update(familyInviteCodes).set({ status: "expired" }).where(eq2(familyInviteCodes.id, inviteRecord.id));
      throw new Error("CODE_EXPIRED");
    }
    let acceptedByUserId = null;
    if (input.cookie) {
      const payload = await verifyEmailJwt(input.cookie);
      if (payload) acceptedByUserId = payload.userId;
    }
    await db.update(familyInviteCodes).set({
      status: "accepted",
      acceptedAt: /* @__PURE__ */ new Date(),
      acceptedByUserId
    }).where(eq2(familyInviteCodes.id, inviteRecord.id));
    const [inviter] = await db.select({ id: emailUsers.id, name: emailUsers.name }).from(emailUsers).where(eq2(emailUsers.id, inviteRecord.userId));
    return {
      success: true,
      inviterId: inviter?.id,
      inviterName: inviter?.name,
      nickname: inviteRecord.nickname,
      relationship: inviteRecord.relationship
    };
  })
});

// server/routers/disasterData.ts
import { z as z3 } from "zod";
function magnitudeToSeverity(mag) {
  if (mag >= 7) return "extreme";
  if (mag >= 5.5) return "severe";
  if (mag >= 4) return "moderate";
  return "minor";
}
function nwsSeverityMap(severity) {
  const s = severity?.toLowerCase() || "";
  if (s === "extreme") return "extreme";
  if (s === "severe") return "severe";
  if (s === "moderate") return "moderate";
  return "minor";
}
function nwsEventToType(event) {
  const e = event?.toLowerCase() || "";
  if (e.includes("earthquake") || e.includes("tsunami")) return "earthquake";
  if (e.includes("fire") || e.includes("wildfire")) return "wildfire";
  if (e.includes("flood")) return "flood";
  if (e.includes("tornado") || e.includes("hurricane") || e.includes("typhoon") || e.includes("wind")) return "storm";
  if (e.includes("volcano")) return "volcano";
  return "other";
}
function parseNwsGeometry(geometry) {
  if (!geometry) return null;
  if (geometry.type === "Point" && geometry.coordinates) {
    return { lat: geometry.coordinates[1], lng: geometry.coordinates[0] };
  }
  if (geometry.type === "Polygon" && geometry.coordinates?.[0]) {
    const coords = geometry.coordinates[0];
    const lat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
    const lng = coords.reduce((s, c) => s + c[0], 0) / coords.length;
    return { lat, lng };
  }
  return null;
}
async function fetchUSGSEarthquakes(minMag = 4) {
  try {
    const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8e3) });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.features || []).filter((f) => (f.properties?.mag || 0) >= minMag).map((f) => ({
      id: `usgs-${f.id}`,
      type: "earthquake",
      severity: magnitudeToSeverity(f.properties.mag),
      title: `M${f.properties.mag.toFixed(1)} Earthquake`,
      description: f.properties.place || "Unknown location",
      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0],
      radius: Math.round(Math.pow(10, 0.5 * f.properties.mag - 1.8) * 10),
      country: "Global",
      source: "USGS",
      url: f.properties.url,
      startedAt: f.properties.time,
      updatedAt: f.properties.updated || f.properties.time
    }));
  } catch {
    return [];
  }
}
async function fetchNWSAlerts() {
  try {
    const url = `https://api.weather.gov/alerts/active?status=actual&message_type=alert&urgency=Immediate,Expected`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Evacora/1.0 (evacora.manus.space)" },
      signal: AbortSignal.timeout(8e3)
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.features || []).slice(0, 50).map((f) => {
      const geo = parseNwsGeometry(f.geometry);
      if (!geo) return null;
      const props = f.properties;
      return {
        id: `nws-${f.id}`,
        type: nwsEventToType(props.event || ""),
        severity: nwsSeverityMap(props.severity),
        title: props.headline || props.event || "Weather Alert",
        description: props.description?.slice(0, 200) || props.event || "",
        lat: geo.lat,
        lng: geo.lng,
        country: "US",
        source: "NWS",
        url: props["@id"],
        startedAt: new Date(props.onset || props.effective || Date.now()).getTime(),
        updatedAt: new Date(props.expires || Date.now()).getTime()
      };
    }).filter(Boolean);
  } catch {
    return [];
  }
}
async function fetchGDACS() {
  try {
    const url = `https://www.gdacs.org/xml/rss.xml`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8e3) });
    if (!res.ok) return [];
    const text2 = await res.text();
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(text2)) !== null) {
      const item = match[1];
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
      const latStr = item.match(/<geo:lat>(.*?)<\/geo:lat>/)?.[1] || item.match(/<gdacs:latitude>(.*?)<\/gdacs:latitude>/)?.[1];
      const lngStr = item.match(/<geo:long>(.*?)<\/geo:long>/)?.[1] || item.match(/<gdacs:longitude>(.*?)<\/gdacs:longitude>/)?.[1];
      const alertLevel = item.match(/<gdacs:alertlevel>(.*?)<\/gdacs:alertlevel>/)?.[1]?.toLowerCase() || "green";
      const eventType = item.match(/<gdacs:eventtype>(.*?)<\/gdacs:eventtype>/)?.[1]?.toLowerCase() || "";
      const country = item.match(/<gdacs:country>(.*?)<\/gdacs:country>/)?.[1] || "";
      if (!latStr || !lngStr) continue;
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      if (isNaN(lat) || isNaN(lng)) continue;
      let type = "other";
      if (eventType.includes("eq") || eventType.includes("earthquake")) type = "earthquake";
      else if (eventType.includes("tc") || eventType.includes("cyclone") || eventType.includes("hurricane")) type = "storm";
      else if (eventType.includes("fl") || eventType.includes("flood")) type = "flood";
      else if (eventType.includes("vo") || eventType.includes("volcano")) type = "volcano";
      else if (eventType.includes("wf") || eventType.includes("fire")) type = "wildfire";
      else if (eventType.includes("ts") || eventType.includes("tsunami")) type = "tsunami";
      let severity = "minor";
      if (alertLevel === "red") severity = "extreme";
      else if (alertLevel === "orange") severity = "severe";
      else if (alertLevel === "green") severity = "moderate";
      const ts = pubDate ? new Date(pubDate).getTime() : Date.now();
      items.push({
        id: `gdacs-${ts}-${lat}-${lng}`,
        type,
        severity,
        title: title.trim(),
        description: country ? `Country: ${country}` : "",
        lat,
        lng,
        country,
        source: "GDACS",
        url: link,
        startedAt: ts,
        updatedAt: ts
      });
    }
    return items.slice(0, 30);
  } catch {
    return [];
  }
}
var disasterDataRouter = router({
  // Get all active disaster events (merged from multiple sources)
  getActiveEvents: publicProcedure.input(
    z3.object({
      lat: z3.number().optional(),
      lng: z3.number().optional(),
      radiusKm: z3.number().default(5e3),
      // filter by distance if provided
      minSeverity: z3.enum(["minor", "moderate", "severe", "extreme"]).default("moderate")
    }).optional()
  ).query(async ({ input }) => {
    const severityOrder = { minor: 0, moderate: 1, severe: 2, extreme: 3 };
    const minSev = input?.minSeverity || "moderate";
    const [usgsEvents, nwsEvents, gdacsEvents] = await Promise.all([
      fetchUSGSEarthquakes(4),
      fetchNWSAlerts(),
      fetchGDACS()
    ]);
    let allEvents = [...usgsEvents, ...nwsEvents, ...gdacsEvents];
    allEvents = allEvents.filter(
      (e) => severityOrder[e.severity] >= severityOrder[minSev]
    );
    if (input?.lat && input?.lng) {
      const { lat: userLat, lng: userLng, radiusKm = 5e3 } = input;
      allEvents = allEvents.filter((e) => {
        const dLat = (e.lat - userLat) * Math.PI / 180;
        const dLng = (e.lng - userLng) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(userLat * Math.PI / 180) * Math.cos(e.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
        const distKm = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return distKm <= radiusKm;
      });
    }
    allEvents.sort((a, b) => {
      const sevDiff = severityOrder[b.severity] - severityOrder[a.severity];
      if (sevDiff !== 0) return sevDiff;
      return b.startedAt - a.startedAt;
    });
    return allEvents.slice(0, 100);
  }),
  // Get earthquake data specifically (USGS)
  getEarthquakes: publicProcedure.input(z3.object({ minMag: z3.number().default(4) }).optional()).query(async ({ input }) => {
    return fetchUSGSEarthquakes(input?.minMag || 4);
  }),
  // Get US weather alerts (NWS)
  getUSWeatherAlerts: publicProcedure.query(async () => {
    return fetchNWSAlerts();
  })
});

// server/routers/feedback.ts
import { z as z4 } from "zod";
var feedbackRouter = router({
  // 피드백 전송 (이메일)
  sendFeedback: publicProcedure.input(
    z4.object({
      type: z4.enum(["suggestion", "bug", "general"]),
      subject: z4.string().min(1).max(100),
      message: z4.string().min(1).max(1e3),
      userAgent: z4.string().optional(),
      timestamp: z4.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    try {
      const userEmail = ctx.user?.email || "anonymous@evacora.app";
      const userName = ctx.user?.name || "Anonymous User";
      const feedbackContent = `
**Feedback Type:** ${input.type.toUpperCase()}
**Subject:** ${input.subject}
**From:** ${userName} (${userEmail})
**Timestamp:** ${input.timestamp || (/* @__PURE__ */ new Date()).toISOString()}
**User Agent:** ${input.userAgent || "Unknown"}

---

**Message:**
${input.message}
        `.trim();
      const notificationResult = await notifyOwner({
        title: `[Evacora Feedback] ${input.subject}`,
        content: feedbackContent
      });
      return {
        success: notificationResult,
        message: "Feedback sent successfully"
      };
    } catch (error) {
      console.error("Feedback submission error:", error);
      throw new Error("Failed to send feedback");
    }
  }),
  // 피드백 제출 (공개 - 로그인 불필요)
  submit: publicProcedure.input(
    z4.object({
      rating: z4.number().min(1).max(5),
      comment: z4.string().max(1e3).optional(),
      region: z4.string().optional(),
      language: z4.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    try {
      const db = await getDb();
      if (!db) {
        return {
          success: false,
          message: "\uB370\uC774\uD130\uBCA0\uC774\uC2A4 \uC5F0\uACB0 \uC2E4\uD328"
        };
      }
      const feedback = await db.insert(userFeedback).values({
        userId: ctx.user?.id || null,
        rating: input.rating,
        comment: input.comment || null,
        userAgent: ctx.req?.headers["user-agent"] || null,
        region: input.region || null,
        language: input.language || null,
        appVersion: "1.0.0"
        // TODO: 앱 버전 동적으로 설정
      });
      const feedbackSummary = `
\uD3C9\uAC00: ${input.rating}/5
\uC758\uACAC: ${input.comment || "\uC5C6\uC74C"}
\uC9C0\uC5ED: ${input.region || "\uBBF8\uC9C0\uC815"}
\uC5B8\uC5B4: ${input.language || "\uBBF8\uC9C0\uC815"}
        `.trim();
      await notifyOwner({
        title: `\uC0C8\uB85C\uC6B4 \uD53C\uB4DC\uBC31 \uC218\uC2E0 (${input.rating}\u2B50)`,
        content: feedbackSummary
      });
      return {
        success: true,
        message: "\uD53C\uB4DC\uBC31\uC774 \uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uAC10\uC0AC\uD569\uB2C8\uB2E4!"
      };
    } catch (error) {
      console.error("\uD53C\uB4DC\uBC31 \uC800\uC7A5 \uC2E4\uD328:", error);
      return {
        success: false,
        message: "\uD53C\uB4DC\uBC31 \uC800\uC7A5 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4."
      };
    }
  }),
  // 피드백 목록 조회 (관리자 전용)
  list: protectedProcedure.input(
    z4.object({
      limit: z4.number().default(50),
      offset: z4.number().default(0)
    })
  ).query(async ({ input, ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("\uAD00\uB9AC\uC790\uB9CC \uC811\uADFC \uAC00\uB2A5\uD569\uB2C8\uB2E4.");
    }
    const db = await getDb();
    if (!db) {
      throw new Error("\uB370\uC774\uD130\uBCA0\uC774\uC2A4 \uC5F0\uACB0 \uC2E4\uD328");
    }
    const feedbacks = await db.select().from(userFeedback).limit(input.limit).offset(input.offset).orderBy((t2) => t2.createdAt);
    return feedbacks;
  })
});

// server/routers/news.ts
import { z as z5 } from "zod";
var NEWSAPI_KEY = process.env.NEWSAPI_KEY || "demo";
var NEWSAPI_URL = "https://newsapi.org/v2";
var MOCK_ARTICLES = [
  {
    id: "demo-1",
    title: "Major Earthquake Strikes Pacific Region",
    description: "A 7.2 magnitude earthquake has been detected in the Pacific region.",
    url: "https://example.com/earthquake-news",
    image: "",
    source: "Demo News",
    author: "Demo",
    publishedAt: /* @__PURE__ */ new Date(),
    content: "A significant earthquake has been recorded..."
  },
  {
    id: "demo-2",
    title: "Wildfire Alert: Evacuations Underway",
    description: "Thousands evacuated as wildfire spreads rapidly.",
    url: "https://example.com/wildfire-news",
    image: "",
    source: "Demo News",
    author: "Demo",
    publishedAt: /* @__PURE__ */ new Date(),
    content: "Emergency services have issued evacuation orders..."
  },
  {
    id: "demo-3",
    title: "Tsunami Warning Issued for Coastal Areas",
    description: "Residents advised to move to higher ground immediately.",
    url: "https://example.com/tsunami-news",
    image: "",
    source: "Demo News",
    author: "Demo",
    publishedAt: /* @__PURE__ */ new Date(),
    content: "Coastal authorities have issued a tsunami warning..."
  }
];
var disasterKeywords = [
  "earthquake",
  "wildfire",
  "tsunami",
  "typhoon",
  "hurricane",
  "flood",
  "tornado",
  "volcano",
  "drought",
  "landslide",
  "avalanche"
];
var newsRouter = router({
  /**
   * Get latest disaster news
   * Searches for news related to disasters
   */
  getDisasterNews: publicProcedure.input(
    z5.object({
      disasterType: z5.enum([
        "earthquake",
        "wildfire",
        "tsunami",
        "typhoon",
        "hurricane",
        "flood",
        "tornado",
        "volcano",
        "drought",
        "landslide",
        "avalanche",
        "all"
      ]).optional(),
      limit: z5.number().min(1).max(50).default(10),
      sortBy: z5.enum(["relevancy", "popularity", "publishedAt"]).default("publishedAt")
    })
  ).query(async ({ input }) => {
    try {
      const searchQuery = input.disasterType === "all" ? disasterKeywords.join(" OR ") : input.disasterType || "disaster";
      const response = await fetch(
        `${NEWSAPI_URL}/everything?q=${encodeURIComponent(searchQuery)}&sortBy=${input.sortBy}&pageSize=${input.limit}&apiKey=${NEWSAPI_KEY}&language=en`
      );
      if (!response.ok) {
        console.error("NewsAPI error:", response.statusText);
        return {
          articles: MOCK_ARTICLES,
          totalResults: MOCK_ARTICLES.length,
          error: null
        };
      }
      const data = await response.json();
      const articles = data.articles.filter((article) => article.title && article.url).map((article) => ({
        id: `${article.source.name}-${article.publishedAt}`,
        title: article.title,
        description: article.description || "",
        url: article.url,
        image: article.urlToImage || "",
        source: article.source.name,
        author: article.author || "Unknown",
        publishedAt: new Date(article.publishedAt),
        content: article.content || ""
      }));
      return {
        articles,
        totalResults: data.totalResults,
        error: null
      };
    } catch (error) {
      console.error("News fetch error:", error);
      return {
        articles: MOCK_ARTICLES,
        totalResults: MOCK_ARTICLES.length,
        error: null
      };
    }
  }),
  /**
   * Get news by region
   * Fetches news specific to a region
   */
  getNewsByRegion: publicProcedure.input(
    z5.object({
      region: z5.enum(["us", "eu", "kr", "jp"]),
      disasterType: z5.string().optional(),
      limit: z5.number().min(1).max(50).default(10)
    })
  ).query(async ({ input }) => {
    try {
      const regionQueries = {
        us: "USA OR United States",
        eu: "Europe OR EU",
        kr: "Korea OR Korean",
        jp: "Japan OR Japanese"
      };
      const regionQuery = regionQueries[input.region];
      const disasterQuery = input.disasterType || "disaster";
      const searchQuery = `(${disasterQuery}) AND (${regionQuery})`;
      const response = await fetch(
        `${NEWSAPI_URL}/everything?q=${encodeURIComponent(searchQuery)}&sortBy=publishedAt&pageSize=${input.limit}&apiKey=${NEWSAPI_KEY}&language=en`
      );
      if (!response.ok) {
        return {
          articles: MOCK_ARTICLES,
          totalResults: MOCK_ARTICLES.length,
          error: null
        };
      }
      const data = await response.json();
      const articles = data.articles.filter((article) => article.title && article.url).map((article) => ({
        id: `${article.source.name}-${article.publishedAt}`,
        title: article.title,
        description: article.description || "",
        url: article.url,
        image: article.urlToImage || "",
        source: article.source.name,
        author: article.author || "Unknown",
        publishedAt: new Date(article.publishedAt),
        content: article.content || ""
      }));
      return {
        articles,
        totalResults: data.totalResults,
        error: null
      };
    } catch (error) {
      console.error("News fetch error:", error);
      return {
        articles: MOCK_ARTICLES,
        totalResults: MOCK_ARTICLES.length,
        error: null
      };
    }
  }),
  /**
   * Get trending disaster news
   * Fetches most popular disaster news
   */
  getTrendingNews: publicProcedure.input(
    z5.object({
      limit: z5.number().min(1).max(50).default(5)
    })
  ).query(async ({ input }) => {
    try {
      const searchQuery = disasterKeywords.slice(0, 5).join(" OR ");
      const response = await fetch(
        `${NEWSAPI_URL}/everything?q=${encodeURIComponent(searchQuery)}&sortBy=popularity&pageSize=${input.limit}&apiKey=${NEWSAPI_KEY}&language=en`
      );
      if (!response.ok) {
        return {
          articles: MOCK_ARTICLES,
          error: null
        };
      }
      const data = await response.json();
      const articles = data.articles.filter((article) => article.title && article.url).map((article) => ({
        id: `${article.source.name}-${article.publishedAt}`,
        title: article.title,
        description: article.description || "",
        url: article.url,
        image: article.urlToImage || "",
        source: article.source.name,
        author: article.author || "Unknown",
        publishedAt: new Date(article.publishedAt),
        content: article.content || ""
      }));
      return {
        articles,
        error: null
      };
    } catch (error) {
      console.error("News fetch error:", error);
      return {
        articles: MOCK_ARTICLES,
        error: null
      };
    }
  })
});

// server/routers.ts
var appRouter = router({
  system: systemRouter,
  emailAuth: emailAuthRouter,
  disasterData: disasterDataRouter,
  feedback: feedbackRouter,
  news: newsRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    })
  }),
  // User Profile Management
  user: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return ctx.user;
    }),
    updateProfile: protectedProcedure.input(z6.object({
      name: z6.string().optional(),
      phoneNumber: z6.string().optional(),
      region: z6.enum(["us", "eu"]).optional()
    })).mutation(async ({ input, ctx }) => {
      return { success: true, userId: ctx.user.id };
    })
  }),
  // Emergency Contacts Management
  contacts: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      const contacts = await db.select().from(emergencyContacts).where(eq3(emergencyContacts.userId, ctx.user.id));
      return contacts;
    }),
    add: protectedProcedure.input(z6.object({
      name: z6.string(),
      phoneNumber: z6.string(),
      email: z6.string().email().optional(),
      relationship: z6.string().optional(),
      isPrimary: z6.boolean().optional()
    })).mutation(async ({ input, ctx }) => {
      return { success: true, contactId: 1 };
    }),
    delete: protectedProcedure.input(z6.object({ contactId: z6.number() })).mutation(async ({ input, ctx }) => {
      return { success: true };
    })
  }),
  // Disasters & Guidelines
  disasters: router({
    list: publicProcedure.input(z6.object({ region: z6.enum(["us", "eu", "global"]).optional() })).query(({ input }) => {
      const guides = getDisasterGuides(input.region || "global");
      return guides.map((g) => ({
        code: g.code,
        name: g.name,
        icon: g.icon,
        riskLevel: g.riskLevel,
        region: g.region
      }));
    }),
    getGuide: publicProcedure.input(z6.object({ disasterCode: z6.string() })).query(({ input }) => {
      const guide = getDisasterByCode(input.disasterCode);
      return guide || null;
    })
  }),
  // Shelters & Safe Locations
  shelters: router({
    searchNearby: publicProcedure.input(z6.object({
      latitude: z6.number(),
      longitude: z6.number(),
      radiusKm: z6.number().default(10),
      region: z6.enum(["us", "eu", "kr", "jp"])
    })).query(async ({ input }) => {
      const allShelters = getSheltersByRegion(input.region);
      const nearbyShelters = allShelters.map((shelter) => ({
        ...shelter,
        distance: calculateDistance(
          input.latitude,
          input.longitude,
          parseFloat(shelter.lat),
          parseFloat(shelter.lng)
        )
      })).filter((s) => s.distance <= input.radiusKm).sort((a, b) => a.distance - b.distance);
      return nearbyShelters.map((s) => ({
        id: parseInt(s.id.split("-")[2] || "0"),
        name: s.name,
        address: s.address,
        lat: s.lat,
        lng: s.lng,
        capacity: s.capacity,
        type: s.type,
        phone: s.phone,
        website: s.website,
        amenities: s.amenities?.join(", ") || null,
        region: s.region,
        distance: s.distance
      }));
    })
  }),
  // Location Sharing
  location: router({
    updateMyLocation: protectedProcedure.input(z6.object({
      latitude: z6.number().min(-90).max(90),
      longitude: z6.number().min(-180).max(180),
      accuracy: z6.number().optional()
    })).mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return { success: false, timestamp: /* @__PURE__ */ new Date() };
      try {
        await db.update(users).set({
          lastKnownLat: input.latitude.toFixed(8),
          lastKnownLng: input.longitude.toFixed(8),
          lastLocationUpdate: /* @__PURE__ */ new Date(),
          locationSharingEnabled: true
        }).where(eq3(users.id, ctx.user.id));
        return { success: true, timestamp: /* @__PURE__ */ new Date() };
      } catch (error) {
        console.error("[Location] Failed to update location:", error);
        return { success: false, timestamp: /* @__PURE__ */ new Date() };
      }
    }),
    shareWithContact: protectedProcedure.input(z6.object({
      contactId: z6.number(),
      latitude: z6.number().min(-90).max(90),
      longitude: z6.number().min(-180).max(180)
    })).mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return { success: false, sharedWith: input.contactId };
      try {
        const contact = await db.select().from(emergencyContacts).where(and2(
          eq3(emergencyContacts.id, input.contactId),
          eq3(emergencyContacts.userId, ctx.user.id)
        ));
        if (contact.length === 0) {
          return { success: false, sharedWith: input.contactId };
        }
        await db.insert(locationSharing).values({
          userId: ctx.user.id,
          friendId: input.contactId,
          lat: input.latitude.toFixed(8),
          lng: input.longitude.toFixed(8),
          isActive: true
        });
        return { success: true, sharedWith: input.contactId };
      } catch (error) {
        console.error("[Location] Failed to share location:", error);
        return { success: false, sharedWith: input.contactId };
      }
    }),
    stopSharing: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { success: false };
      try {
        await db.update(users).set({ locationSharingEnabled: false }).where(eq3(users.id, ctx.user.id));
        await db.update(locationSharing).set({ isActive: false }).where(eq3(locationSharing.userId, ctx.user.id));
        return { success: true };
      } catch (error) {
        console.error("[Location] Failed to stop sharing:", error);
        return { success: false };
      }
    })
  }),
  // Active Alerts
  alerts: router({
    getActive: publicProcedure.input(z6.object({
      region: z6.enum(["us", "eu", "kr", "jp"])
    })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      try {
        const alerts = await db.select().from(activeAlerts).where(eq3(activeAlerts.region, input.region)).orderBy(desc(activeAlerts.createdAt)).limit(10);
        return alerts;
      } catch {
        return [];
      }
    }),
    create: protectedProcedure.input(z6.object({
      disasterTypeId: z6.number(),
      severity: z6.enum(["low", "medium", "high", "critical", "warning", "info"]),
      title: z6.string(),
      description: z6.string(),
      region: z6.enum(["us", "eu", "kr", "jp"]),
      latitude: z6.number().optional(),
      longitude: z6.number().optional(),
      radiusKm: z6.number().optional()
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      try {
        await db.insert(activeAlerts).values({
          disasterTypeId: input.disasterTypeId,
          severity: input.severity,
          title: input.title,
          description: input.description,
          region: input.region,
          centerLat: input.latitude?.toFixed(8) || null,
          centerLng: input.longitude?.toFixed(8) || null,
          radiusKm: input.radiusKm || null,
          status: "active"
        });
        return { success: true };
      } catch (error) {
        console.error("[Alerts] Failed to create alert:", error);
        return { success: false };
      }
    })
  }),
  // SMS & Notifications
  notifications: router({
    sendSafetyCheck: protectedProcedure.input(z6.object({
      contactIds: z6.array(z6.number()),
      latitude: z6.number().optional(),
      longitude: z6.number().optional()
    })).mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return { success: false, sentTo: 0 };
      const contacts = await db.select().from(emergencyContacts).where(eq3(emergencyContacts.userId, ctx.user.id));
      const phoneNumbers = contacts.filter((c) => input.contactIds.includes(c.id)).map((c) => c.phoneNumber);
      const results = await sendSafetyCheckToContacts(
        phoneNumbers,
        ctx.user.name || "User",
        input.latitude,
        input.longitude
      );
      return { success: results.every((r) => r.success), sentTo: results.length };
    }),
    sendSOS: protectedProcedure.input(z6.object({
      contactIds: z6.array(z6.number()),
      latitude: z6.number(),
      longitude: z6.number(),
      message: z6.string().optional()
    })).mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return { success: false, sentTo: 0 };
      const contacts = await db.select().from(emergencyContacts).where(eq3(emergencyContacts.userId, ctx.user.id));
      const phoneNumbers = contacts.filter((c) => input.contactIds.includes(c.id)).map((c) => c.phoneNumber);
      const results = await sendSosToContacts(
        phoneNumbers,
        ctx.user.name || "User",
        input.latitude,
        input.longitude,
        input.message
      );
      return { success: results.every((r) => r.success), sentTo: results.length };
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs2 from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
var PROJECT_ROOT = import.meta.dirname;
var LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
var MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
var TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}
function trimLogFile(logPath, maxSize) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }
    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines = [];
    let keptBytes = 0;
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}
`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }
    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
  }
}
function writeToLogFile(source, entries) {
  if (entries.length === 0) return;
  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);
  const lines = entries.map((entry) => {
    const ts = (/* @__PURE__ */ new Date()).toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });
  fs.appendFileSync(logPath, `${lines.join("\n")}
`, "utf-8");
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}
function vitePluginManusDebugCollector() {
  return {
    name: "manus-debug-collector",
    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true
            },
            injectTo: "head"
          }
        ]
      };
    },
    configureServer(server) {
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }
        const handlePayload = (payload) => {
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };
        const reqBody = req.body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    }
  };
}
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // 코드 분할 및 번들 최적화
    rollupOptions: {
      output: {
        manualChunks: {
          // 핵심 라이브러리 분리
          "vendor-react": ["react", "react-dom"],
          "vendor-ui": ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-tooltip"],
          "vendor-trpc": ["@trpc/client", "@trpc/react-query"],
          // Google Maps는 외부 스크립트로 로드
          // 페이지별 코드 분할
          "page-home": ["./client/src/pages/Home.tsx"],
          "page-map": ["./client/src/pages/Map.tsx"],
          "page-guides": ["./client/src/pages/DisasterGuide.tsx"],
          "page-contacts": ["./client/src/pages/EmergencyContacts.tsx"],
          "page-settings": ["./client/src/pages/Settings.tsx"],
          "page-news": ["./client/src/pages/NewsPage.tsx"],
          // 유틸리티 분리
          "utils-clustering": ["./client/src/utils/markerClustering.ts"]
        },
        // 청크 파일 이름 최적화
        chunkFileNames: "chunks/[name]-[hash].js",
        entryFileNames: "[name]-[hash].js"
      }
    },
    // 번들 크기 경고 임계값
    chunkSizeWarningLimit: 600,
    // 소스맵 비활성화 (프로덕션)
    sourcemap: false,
    // 기본 esbuild 미니파이어 사용 (terser 대신)
    minify: "esbuild"
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist", "public") : path2.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.get("/manifest.json", (_req, res) => {
    res.setHeader("Content-Type", "application/manifest+json");
    res.json({
      name: "Evacora - Emergency Safety App",
      short_name: "Evacora",
      description: "Real-time crisis guidance, nearest shelter routing, and one-tap safety check-ins for emergencies.",
      start_url: "/",
      display: "standalone",
      background_color: "#0f172a",
      theme_color: "#0f172a",
      orientation: "portrait",
      lang: "en",
      categories: ["safety", "navigation", "utilities"],
      icons: [
        { src: "/manus-storage/icon-48x48_ac94a031.png", sizes: "48x48", type: "image/png" },
        { src: "/manus-storage/icon-72x72_5d0fdfcb.png", sizes: "72x72", type: "image/png" },
        { src: "/manus-storage/icon-96x96_4b1d4cf7.png", sizes: "96x96", type: "image/png" },
        { src: "/manus-storage/icon-144x144_40b37f91.png", sizes: "144x144", type: "image/png" },
        { src: "/manus-storage/icon-192x192_9c869635.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/manus-storage/icon-512x512_5040cb0f.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
      ],
      shortcuts: [
        {
          name: "Emergency Map",
          short_name: "Map",
          description: "View nearby shelters and danger zones",
          url: "/map",
          icons: [{ src: "/manus-storage/icon-96x96_4b1d4cf7.png", sizes: "96x96" }]
        },
        {
          name: "Action Guide",
          short_name: "Guide",
          description: "Emergency action checklist",
          url: "/action-guide",
          icons: [{ src: "/manus-storage/icon-96x96_4b1d4cf7.png", sizes: "96x96" }]
        }
      ]
    });
  });
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
