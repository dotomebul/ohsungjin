import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    phoneNumber: null,
    region: "us",
    lastKnownLat: null,
    lastKnownLng: null,
    lastLocationUpdate: null,
    locationSharingEnabled: false,
    locationUpdateInterval: 30,
    notificationsEnabled: true,
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Evacora Routers", () => {
  describe("disasters.list", () => {
    it("should return US disasters", async () => {
      const caller = appRouter.createCaller(createTestContext());
      const disasters = await caller.disasters.list({ region: "us" });
      
      expect(disasters).toBeInstanceOf(Array);
      expect(disasters.length).toBeGreaterThan(0);
      expect(disasters[0]).toHaveProperty("code");
      expect(disasters[0]).toHaveProperty("name");
      expect(disasters[0]).toHaveProperty("icon");
    });

    it("should return EU disasters", async () => {
      const caller = appRouter.createCaller(createTestContext());
      const disasters = await caller.disasters.list({ region: "eu" });
      
      expect(disasters).toBeInstanceOf(Array);
      expect(disasters.length).toBeGreaterThan(0);
    });

    it("should return global disasters", async () => {
      const caller = appRouter.createCaller(createTestContext());
      const disasters = await caller.disasters.list({ region: "global" });
      
      expect(disasters).toBeInstanceOf(Array);
      expect(disasters.length).toBeGreaterThan(0);
    });
  });

  describe("disasters.getGuide", () => {
    it("should return wildfire guide for US", async () => {
      const caller = appRouter.createCaller(createTestContext());
      const guide = await caller.disasters.getGuide({ disasterCode: "wildfire" });
      
      expect(guide).toBeDefined();
      expect(guide?.name).toBe("Wildfire");
      expect(guide?.icon).toBe("🔥");
      expect(guide?.immediateActions).toBeInstanceOf(Array);
      expect(guide?.evacuationSteps).toBeInstanceOf(Array);
      expect(guide?.safetyTips).toBeInstanceOf(Array);
      expect(guide?.whatToBring).toBeInstanceOf(Array);
    });

    it("should return bombing guide for EU", async () => {
      const caller = appRouter.createCaller(createTestContext());
      const guide = await caller.disasters.getGuide({ disasterCode: "bombing" });
      
      expect(guide).toBeDefined();
      expect(guide?.name).toBe("Bombing / Air Raid");
      expect(guide?.icon).toBe("💣");
      expect(guide?.emergencyNumber).toBe("112");
    });

    it("should return null for non-existent disaster", async () => {
      const caller = appRouter.createCaller(createTestContext());
      const guide = await caller.disasters.getGuide({ disasterCode: "nonexistent" });
      
      expect(guide).toBeNull();
    });
  });

  describe("user.getProfile", () => {
    it("should return current user profile", async () => {
      const ctx = createTestContext(42);
      const caller = appRouter.createCaller(ctx);
      const profile = await caller.user.getProfile();
      
      expect(profile).toBeDefined();
      expect(profile?.id).toBe(42);
      expect(profile?.openId).toBe("test-user-42");
    });
  });

  describe("notifications.sendSafetyCheck", () => {
    it("should send safety check to contacts", async () => {
      const caller = appRouter.createCaller(createTestContext());
      const result = await caller.notifications.sendSafetyCheck({
        contactIds: [],
        latitude: 40.7128,
        longitude: -74.0060,
      });
      
      expect(result.success).toBe(true);
      expect(result.sentTo).toBe(0);
    });
  });

  describe("notifications.sendSOS", () => {
    it("should send SOS alert with location", async () => {
      const caller = appRouter.createCaller(createTestContext());
      const result = await caller.notifications.sendSOS({
        contactIds: [],
        latitude: 40.7128,
        longitude: -74.0060,
        message: "Emergency! Need help!",
      });
      
      expect(result.success).toBe(true);
      expect(result.sentTo).toBe(0);
    });
  });

  describe("auth.me", () => {
    it("should return current user when authenticated", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      const user = await caller.auth.me();
      
      expect(user).toBeDefined();
      expect(user?.id).toBe(ctx.user.id);
    });

    it("should return null when not authenticated", async () => {
      const ctx = createTestContext();
      ctx.user = null;
      const caller = appRouter.createCaller(ctx);
      const user = await caller.auth.me();
      
      expect(user).toBeNull();
    });
  });
});
