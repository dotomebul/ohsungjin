import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  emailUsers,
  familyRelations,
  familyInvites,
  familyInviteCodes,
  realtimeLocations,
  locationShareLinks,
  smsLog,
} from "../../drizzle/schema";
import { eq, and, or, inArray } from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";
import { randomBytes, createHash } from "crypto";
import { sendSms } from "../sms";

const JWT_SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "evacora-email-auth-secret"
);

const EMAIL_JWT_COOKIE = "evacora_email_session";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hashPassword(password: string): string {
  return createHash("sha256")
    .update(password + "evacora_salt_2026")
    .digest("hex");
}

async function signEmailJwt(userId: number, email: string): Promise<string> {
  return new SignJWT({ sub: String(userId), email, type: "email_auth" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET_KEY);
}

export async function verifyEmailJwt(
  token: string
): Promise<{ userId: number; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY);
    if (payload.type !== "email_auth" || !payload.sub) return null;
    return { userId: Number(payload.sub), email: payload.email as string };
  } catch {
    return null;
  }
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const emailAuthRouter = router({
  // ── Register ────────────────────────────────────────────────────────────────
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1),
        phoneNumber: z.string().optional(),
        region: z.enum(["us", "eu", "kr", "jp"]).default("us"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");

      // Check duplicate email
      const existing = await db
        .select({ id: emailUsers.id })
        .from(emailUsers)
        .where(eq(emailUsers.email, input.email.toLowerCase()));
      if (existing.length > 0) {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }

      const [result] = await db.insert(emailUsers).values({
        email: input.email.toLowerCase(),
        passwordHash: hashPassword(input.password),
        name: input.name,
        phoneNumber: input.phoneNumber || null,
        region: input.region,
      });

      const userId = (result as any).insertId as number;
      const token = await signEmailJwt(userId, input.email.toLowerCase());

      ctx.res.cookie(EMAIL_JWT_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: "/",
      });

      return { success: true, userId, name: input.name, email: input.email };
    }),

  // ── Login ────────────────────────────────────────────────────────────────────
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");

      const [user] = await db
        .select()
        .from(emailUsers)
        .where(eq(emailUsers.email, input.email.toLowerCase()));

      if (!user || user.passwordHash !== hashPassword(input.password)) {
        throw new Error("INVALID_CREDENTIALS");
      }

      const token = await signEmailJwt(user.id, user.email);

      ctx.res.cookie(EMAIL_JWT_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      return {
        success: true,
        userId: user.id,
        name: user.name,
        email: user.email,
        region: user.region,
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

    const [user] = await db
      .select({
        id: emailUsers.id,
        email: emailUsers.email,
        name: emailUsers.name,
        phoneNumber: emailUsers.phoneNumber,
        region: emailUsers.region,
        locationSharingEnabled: emailUsers.locationSharingEnabled,
      })
      .from(emailUsers)
      .where(eq(emailUsers.id, payload.userId));

    return user || null;
  }),

  // ── Create Family Invite ─────────────────────────────────────────────────────
  createFamilyInvite: publicProcedure
    .input(
      z.object({
        nickname: z.string().optional(),
        relationship: z.string().optional(),
        origin: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const token = ctx.req.cookies?.[EMAIL_JWT_COOKIE];
      if (!token) throw new Error("NOT_AUTHENTICATED");
      const payload = await verifyEmailJwt(token);
      if (!payload) throw new Error("NOT_AUTHENTICATED");

      const db = await getDb();
      if (!db) throw new Error("DB unavailable");

      const [user] = await db
        .select({ id: emailUsers.id, name: emailUsers.name, email: emailUsers.email })
        .from(emailUsers)
        .where(eq(emailUsers.id, payload.userId));
      if (!user) throw new Error("USER_NOT_FOUND");

      const inviteToken = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      await db.insert(familyInvites).values({
        inviterId: user.id,
        inviterEmail: user.email,
        inviterName: user.name,
        token: inviteToken,
        nickname: input.nickname || null,
        relationship: input.relationship || null,
        expiresAt,
      });

      const inviteUrl = `${input.origin}/join-family?token=${inviteToken}`;
      return { success: true, inviteUrl, token: inviteToken };
    }),

  // ── Accept Family Invite ─────────────────────────────────────────────────────
  acceptFamilyInvite: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const sessionToken = ctx.req.cookies?.[EMAIL_JWT_COOKIE];
      if (!sessionToken) throw new Error("NOT_AUTHENTICATED");
      const payload = await verifyEmailJwt(sessionToken);
      if (!payload) throw new Error("NOT_AUTHENTICATED");

      const db = await getDb();
      if (!db) throw new Error("DB unavailable");

      const [invite] = await db
        .select()
        .from(familyInvites)
        .where(eq(familyInvites.token, input.token));

      if (!invite) throw new Error("INVITE_NOT_FOUND");
      if (invite.usedAt) throw new Error("INVITE_ALREADY_USED");
      if (new Date() > invite.expiresAt) throw new Error("INVITE_EXPIRED");
      if (invite.inviterId === payload.userId) throw new Error("CANNOT_ADD_SELF");

      // Create bidirectional family relation
      await db.insert(familyRelations).values([
        {
          userId: invite.inviterId,
          familyUserId: payload.userId,
          nickname: invite.nickname || null,
          relationship: invite.relationship || null,
          status: "accepted",
        },
        {
          userId: payload.userId,
          familyUserId: invite.inviterId,
          nickname: null,
          relationship: null,
          status: "accepted",
        },
      ]);

      // Mark invite as used
      await db
        .update(familyInvites)
        .set({ usedAt: new Date() })
        .where(eq(familyInvites.id, invite.id));

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

    const relations = await db
      .select({
        relationId: familyRelations.id,
        familyUserId: familyRelations.familyUserId,
        nickname: familyRelations.nickname,
        relationship: familyRelations.relationship,
        status: familyRelations.status,
      })
      .from(familyRelations)
      .where(
        and(
          eq(familyRelations.userId, payload.userId),
          eq(familyRelations.status, "accepted")
        )
      );

    if (relations.length === 0) return [];

    const familyUserIds = relations.map((r) => r.familyUserId);

    const familyUsers = await db
      .select({
        id: emailUsers.id,
        name: emailUsers.name,
        email: emailUsers.email,
      })
      .from(emailUsers)
      .where(inArray(emailUsers.id, familyUserIds));

    // Get latest locations
    const locations = await db
      .select()
      .from(realtimeLocations)
      .where(inArray(realtimeLocations.userId, familyUserIds));

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
        lastSeen: loc?.updatedAt || null,
      };
    });
  }),

  // ── Update My Location ───────────────────────────────────────────────────────
  updateLocation: publicProcedure
    .input(
      z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        accuracy: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const token = ctx.req.cookies?.[EMAIL_JWT_COOKIE];
      if (!token) return { success: false };
      const payload = await verifyEmailJwt(token);
      if (!payload) return { success: false };

      const db = await getDb();
      if (!db) return { success: false };

      // Upsert: update if exists, insert if not
      const existing = await db
        .select({ id: realtimeLocations.id })
        .from(realtimeLocations)
        .where(eq(realtimeLocations.userId, payload.userId));

      if (existing.length > 0) {
        await db
          .update(realtimeLocations)
          .set({
            lat: input.lat.toFixed(8),
            lng: input.lng.toFixed(8),
            accuracy: input.accuracy || null,
          })
          .where(eq(realtimeLocations.userId, payload.userId));
      } else {
        await db.insert(realtimeLocations).values({
          userId: payload.userId,
          lat: input.lat.toFixed(8),
          lng: input.lng.toFixed(8),
          accuracy: input.accuracy || null,
        });
      }

      // Also update locationSharingEnabled
      await db
        .update(emailUsers)
        .set({ locationSharingEnabled: true, lastLocationUpdate: new Date() })
        .where(eq(emailUsers.id, payload.userId));

      return { success: true };
    }),

  // ── Send SMS Location Share ──────────────────────────────────────────────────
  sendLocationSms: publicProcedure
    .input(
      z.object({
        phoneNumber: z.string(),
        lat: z.number(),
        lng: z.number(),
        origin: z.string(),
        senderName: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const token = ctx.req.cookies?.[EMAIL_JWT_COOKIE];
      if (!token) throw new Error("NOT_AUTHENTICATED");
      const payload = await verifyEmailJwt(token);
      if (!payload) throw new Error("NOT_AUTHENTICATED");

      const db = await getDb();
      if (!db) throw new Error("DB unavailable");

      const shareToken = randomBytes(16).toString("hex");
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

      await db.insert(locationShareLinks).values({
        userId: payload.userId,
        token: shareToken,
        lat: input.lat.toFixed(8),
        lng: input.lng.toFixed(8),
        recipientPhone: input.phoneNumber,
        expiresAt,
      });

      const shareUrl = `${input.origin}/location-share/${shareToken}`;
      const senderName = input.senderName || "Someone";
      const message = `🆘 ${senderName} is sharing their location with you via Evacora:\n${shareUrl}\n(Valid for 24 hours)`;

      const result = await sendSms({ to: input.phoneNumber, message, type: "location_share" });

      // Log SMS
      await db.insert(smsLog).values({
        userId: payload.userId,
        recipientPhoneNumber: input.phoneNumber,
        messageType: "location_share",
        messageContent: message,
        status: result.success ? "sent" : "failed",
        latitude: input.lat.toFixed(8),
        longitude: input.lng.toFixed(8),
      });

      return { success: result.success, shareUrl };
    }),

  // ── Get Location Share ───────────────────────────────────────────────────────
  getLocationShare: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [link] = await db
        .select()
        .from(locationShareLinks)
        .where(eq(locationShareLinks.token, input.token));

      if (!link) return null;
      if (new Date() > link.expiresAt) return null;

      const [user] = await db
        .select({ name: emailUsers.name })
        .from(emailUsers)
        .where(eq(emailUsers.id, link.userId));

      return {
        lat: parseFloat(link.lat),
        lng: parseFloat(link.lng),
        senderName: user?.name || "Unknown",
        expiresAt: link.expiresAt,
        createdAt: link.createdAt,
      };
    }),

  // Generate Family Invite Code - SMS로 보낼 초대 코드 생성
  generateFamilyInviteCode: publicProcedure
    .input(
      z.object({
        cookie: z.string(),
        inviteePhone: z.string(),
        nickname: z.string().optional(),
        relationship: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");

      const payload = await verifyEmailJwt(input.cookie);
      if (!payload) throw new Error("UNAUTHORIZED");

      // 6자리 숫자 코드 생성
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await db.insert(familyInviteCodes).values({
        userId: payload.userId,
        code,
        inviteePhone: input.inviteePhone,
        nickname: input.nickname,
        relationship: input.relationship,
        expiresAt,
      });

      return { code, expiresAt, inviteePhone: input.inviteePhone };
    }),

  // Accept Family Invite Code - 초대 코드 수락
  acceptFamilyInviteCode: publicProcedure
    .input(
      z.object({
        code: z.string().length(6),
        phoneNumber: z.string().optional(),
        cookie: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");

      const [inviteRecord] = await db
        .select()
        .from(familyInviteCodes)
        .where(
          and(
            eq(familyInviteCodes.code, input.code),
            eq(familyInviteCodes.status, "pending")
          )
        );

      if (!inviteRecord) throw new Error("INVALID_CODE");

      if (new Date() > inviteRecord.expiresAt) {
        await db
          .update(familyInviteCodes)
          .set({ status: "expired" })
          .where(eq(familyInviteCodes.id, inviteRecord.id));
        throw new Error("CODE_EXPIRED");
      }

      let acceptedByUserId: number | null = null;
      if (input.cookie) {
        const payload = await verifyEmailJwt(input.cookie);
        if (payload) acceptedByUserId = payload.userId;
      }

      await db
        .update(familyInviteCodes)
        .set({
          status: "accepted",
          acceptedAt: new Date(),
          acceptedByUserId,
        })
        .where(eq(familyInviteCodes.id, inviteRecord.id));

      const [inviter] = await db
        .select({ id: emailUsers.id, name: emailUsers.name })
        .from(emailUsers)
        .where(eq(emailUsers.id, inviteRecord.userId));

      return {
        success: true,
        inviterId: inviter?.id,
        inviterName: inviter?.name,
        nickname: inviteRecord.nickname,
        relationship: inviteRecord.relationship,
      };
    }),
});
