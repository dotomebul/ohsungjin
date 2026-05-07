import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { users, emergencyContacts, locationSharing, smsLog, shelters, activeAlerts } from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { getDisasterByCode, getDisasterGuides } from "@shared/disasterData";
import { getSheltersByRegion, calculateDistance } from "@shared/shelterData";
import { sendSafetyCheckToContacts, sendSosToContacts } from "./sms";
import { emailAuthRouter } from "./routers/emailAuth";
import { disasterDataRouter } from "./routers/disasterData";
import { feedbackRouter } from "./routers/feedback";
import { newsRouter } from "./routers/news";

import { sheltersRouter } from "./routers/shelters";
export const appRouter = router({
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
      return { success: true } as const;
    }),
  }),

  // User Profile Management
  user: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return ctx.user;
    }),

    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        phoneNumber: z.string().optional(),
        region: z.enum(["us", "eu"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return { success: true, userId: ctx.user.id };
      }),
  }),

  // Emergency Contacts Management
  contacts: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      
      const contacts = await db
        .select()
        .from(emergencyContacts)
        .where(eq(emergencyContacts.userId, ctx.user.id));
      
      return contacts;
    }),

    add: protectedProcedure
      .input(z.object({
        name: z.string(),
        phoneNumber: z.string(),
        email: z.string().email().optional(),
        relationship: z.string().optional(),
        isPrimary: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return { success: true, contactId: 1 };
      }),

    delete: protectedProcedure
      .input(z.object({ contactId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        return { success: true };
      }),
  }),

  // Disasters & Guidelines
  disasters: router({
    list: publicProcedure
      .input(z.object({ region: z.enum(["us", "eu", "global"]).optional() }))
      .query(({ input }) => {
        const guides = getDisasterGuides(input.region || "global");
        return guides.map((g) => ({
          code: g.code,
          name: g.name,
          icon: g.icon,
          riskLevel: g.riskLevel,
          region: g.region,
        }));
      }),

    getGuide: publicProcedure
      .input(z.object({ disasterCode: z.string() }))
      .query(({ input }) => {
        const guide = getDisasterByCode(input.disasterCode);
        return guide || null;
      }),
  }),

  // Shelters & Safe Locations
  shelters: router({
    searchNearby: publicProcedure
      .input(z.object({
        latitude: z.number(),
        longitude: z.number(),
        radiusKm: z.number().default(10),
        region: z.enum(["us", "eu", "kr", "jp"]),
      }))
      .query(async ({ input }) => {
        const allShelters = getSheltersByRegion(input.region);
        
        const nearbyShelters = allShelters
          .map(shelter => ({
            ...shelter,
            distance: calculateDistance(
              input.latitude,
              input.longitude,
              parseFloat(shelter.lat),
              parseFloat(shelter.lng)
            ),
          }))
          .filter(s => s.distance <= input.radiusKm)
          .sort((a, b) => a.distance - b.distance);
        
        return nearbyShelters.map(s => ({
          id: parseInt(s.id.split('-')[2] || '0'),
          name: s.name,
          address: s.address,
          lat: s.lat,
          lng: s.lng,
          capacity: s.capacity,
          type: s.type,
          phone: s.phone,
          website: s.website,
          amenities: s.amenities?.join(', ') || null,
          region: s.region,
          distance: s.distance,
        }));
      }),
  }),

  // Location Sharing
  location: router({
    updateMyLocation: protectedProcedure
      .input(z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        accuracy: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) return { success: false, timestamp: new Date() };
        try {
          await db
            .update(users)
            .set({
              lastKnownLat: input.latitude.toFixed(8),
              lastKnownLng: input.longitude.toFixed(8),
              lastLocationUpdate: new Date(),
              locationSharingEnabled: true,
            })
            .where(eq(users.id, ctx.user.id));
          return { success: true, timestamp: new Date() };
        } catch (error) {
          console.error('[Location] Failed to update location:', error);
          return { success: false, timestamp: new Date() };
        }
      }),

    shareWithContact: protectedProcedure
      .input(z.object({
        contactId: z.number(),
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) return { success: false, sharedWith: input.contactId };
        try {
          // Verify contact belongs to user
          const contact = await db
            .select()
            .from(emergencyContacts)
            .where(and(
              eq(emergencyContacts.id, input.contactId),
              eq(emergencyContacts.userId, ctx.user.id)
            ));
          if (contact.length === 0) {
            return { success: false, sharedWith: input.contactId };
          }
          // Insert location sharing record
          await db.insert(locationSharing).values({
            userId: ctx.user.id,
            friendId: input.contactId,
            lat: input.latitude.toFixed(8),
            lng: input.longitude.toFixed(8),
            isActive: true,
          });
          return { success: true, sharedWith: input.contactId };
        } catch (error) {
          console.error('[Location] Failed to share location:', error);
          return { success: false, sharedWith: input.contactId };
        }
      }),

    stopSharing: protectedProcedure
      .mutation(async ({ ctx }) => {
        const db = await getDb();
        if (!db) return { success: false };
        try {
          await db
            .update(users)
            .set({ locationSharingEnabled: false })
            .where(eq(users.id, ctx.user.id));
          // Deactivate all active sharing records
          await db
            .update(locationSharing)
            .set({ isActive: false })
            .where(eq(locationSharing.userId, ctx.user.id));
          return { success: true };
        } catch (error) {
          console.error('[Location] Failed to stop sharing:', error);
          return { success: false };
        }
      }),
  }),

  // Active Alerts
  alerts: router({
    getActive: publicProcedure
      .input(z.object({
        region: z.enum(['us', 'eu', 'kr', 'jp']),
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        try {
          const alerts = await db
            .select()
            .from(activeAlerts)
            .where(eq(activeAlerts.region, input.region))
            .orderBy(desc(activeAlerts.createdAt))
            .limit(10);
          return alerts;
        } catch {
          return [];
        }
      }),

    create: protectedProcedure
      .input(z.object({
        disasterTypeId: z.number(),
        severity: z.enum(['low', 'medium', 'high', 'critical', 'warning', 'info']),
        title: z.string(),
        description: z.string(),
        region: z.enum(['us', 'eu', 'kr', 'jp']),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        radiusKm: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
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
            status: 'active',
          });
          return { success: true };
        } catch (error) {
          console.error('[Alerts] Failed to create alert:', error);
          return { success: false };
        }
      }),
  }),

  // SMS & Notifications
  notifications: router({
    sendSafetyCheck: protectedProcedure
      .input(z.object({
        contactIds: z.array(z.number()),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) return { success: false, sentTo: 0 };
        
        const contacts = await db
          .select()
          .from(emergencyContacts)
          .where(eq(emergencyContacts.userId, ctx.user.id));
        
        const phoneNumbers = contacts
          .filter(c => input.contactIds.includes(c.id))
          .map(c => c.phoneNumber);
        
        const results = await sendSafetyCheckToContacts(
          phoneNumbers,
          ctx.user.name || "User",
          input.latitude,
          input.longitude
        );
        
        return { success: results.every(r => r.success), sentTo: results.length };
      }),

    sendSOS: protectedProcedure
      .input(z.object({
        contactIds: z.array(z.number()),
        latitude: z.number(),
        longitude: z.number(),
        message: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) return { success: false, sentTo: 0 };
        
        const contacts = await db
          .select()
          .from(emergencyContacts)
          .where(eq(emergencyContacts.userId, ctx.user.id));
        
        const phoneNumbers = contacts
          .filter(c => input.contactIds.includes(c.id))
          .map(c => c.phoneNumber);
        
        const results = await sendSosToContacts(
          phoneNumbers,
          ctx.user.name || "User",
          input.latitude,
          input.longitude,
          input.message
        );
        
        return { success: results.every(r => r.success), sentTo: results.length };
      }),
  }),
});

export type AppRouter = typeof appRouter;
