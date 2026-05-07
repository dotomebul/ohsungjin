import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { userFeedback } from "../../drizzle/schema";
import { getDb } from "../db";
import { notifyOwner } from "../_core/notification";

export const feedbackRouter = router({
  // 피드백 전송 (이메일)
  sendFeedback: publicProcedure
    .input(
      z.object({
        type: z.enum(['suggestion', 'bug', 'general']),
        subject: z.string().min(1).max(100),
        message: z.string().min(1).max(1000),
        userAgent: z.string().optional(),
        timestamp: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const userEmail = ctx.user?.email || 'anonymous@evacora.app';
        const userName = ctx.user?.name || 'Anonymous User';

        const feedbackContent = `
**Feedback Type:** ${input.type.toUpperCase()}
**Subject:** ${input.subject}
**From:** ${userName} (${userEmail})
**Timestamp:** ${input.timestamp || new Date().toISOString()}
**User Agent:** ${input.userAgent || 'Unknown'}

---

**Message:**
${input.message}
        `.trim();

        // Send notification to owner
        const notificationResult = await notifyOwner({
          title: `[Evacora Feedback] ${input.subject}`,
          content: feedbackContent,
        });

        return {
          success: notificationResult,
          message: 'Feedback sent successfully',
        };
      } catch (error) {
        console.error('Feedback submission error:', error);
        throw new Error('Failed to send feedback');
      }
    }),

  // 피드백 제출 (공개 - 로그인 불필요)
  submit: publicProcedure
    .input(
      z.object({
        rating: z.number().min(1).max(5),
        comment: z.string().max(1000).optional(),
        region: z.string().optional(),
        language: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) {
          return {
            success: false,
            message: "데이터베이스 연결 실패",
          };
        }

        // 피드백 저장
        const feedback = await db.insert(userFeedback).values({
          userId: ctx.user?.id || null,
          rating: input.rating,
          comment: input.comment || null,
          userAgent: (ctx.req?.headers["user-agent"] as string) || null,
          region: input.region || null,
          language: input.language || null,
          appVersion: "1.0.0", // TODO: 앱 버전 동적으로 설정
        });

        // 소유자에게 이메일 알림 발송
        const feedbackSummary = `
평가: ${input.rating}/5
의견: ${input.comment || "없음"}
지역: ${input.region || "미지정"}
언어: ${input.language || "미지정"}
        `.trim();

        await notifyOwner({
          title: `새로운 피드백 수신 (${input.rating}⭐)`,
          content: feedbackSummary,
        });

        return {
          success: true,
          message: "피드백이 저장되었습니다. 감사합니다!",
        };
      } catch (error) {
        console.error("피드백 저장 실패:", error);
        return {
          success: false,
          message: "피드백 저장 중 오류가 발생했습니다.",
        };
      }
    }),

  // 피드백 목록 조회 (관리자 전용)
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      // 관리자만 조회 가능
      if (ctx.user?.role !== "admin") {
        throw new Error("관리자만 접근 가능합니다.");
      }

      const db = await getDb();
      if (!db) {
        throw new Error("데이터베이스 연결 실패");
      }

      const feedbacks = await db
        .select()
        .from(userFeedback)
        .limit(input.limit)
        .offset(input.offset)
        .orderBy((t) => t.createdAt);

      return feedbacks;
    }),
});
