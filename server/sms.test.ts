import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  sendSms,
  sendSafetyCheckToContacts,
  sendSosToContacts,
  sendLocationShareNotification,
  getSmsTemplates,
} from "./sms";

describe("SMS Service", () => {
  describe("sendSms", () => {
    it("should return success for valid SMS", async () => {
      const result = await sendSms({
        to: "+1234567890",
        message: "Test message",
        type: "info",
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it("should return error for missing phone number", async () => {
      const result = await sendSms({
        to: "",
        message: "Test message",
        type: "info",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should return error for missing message", async () => {
      const result = await sendSms({
        to: "+1234567890",
        message: "",
        type: "info",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should handle safety_check type", async () => {
      const result = await sendSms({
        to: "+1234567890",
        message: "Safety check message",
        type: "safety_check",
      });

      expect(result.success).toBe(true);
    });

    it("should handle sos_alert type", async () => {
      const result = await sendSms({
        to: "+1234567890",
        message: "SOS alert message",
        type: "sos_alert",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("sendSafetyCheckToContacts", () => {
    it("should send safety check to multiple contacts", async () => {
      const phoneNumbers = ["+1111111111", "+2222222222", "+3333333333"];
      const results = await sendSafetyCheckToContacts(phoneNumbers, "John Doe");

      expect(results).toHaveLength(3);
      expect(results.every((r) => r.success)).toBe(true);
    });

    it("should include location in message when provided", async () => {
      const results = await sendSafetyCheckToContacts(
        ["+1234567890"],
        "Jane Doe",
        40.7128,
        -74.006
      );

      expect(results[0].success).toBe(true);
    });

    it("should handle empty contact list", async () => {
      const results = await sendSafetyCheckToContacts([], "John Doe");

      expect(results).toHaveLength(0);
    });
  });

  describe("sendSosToContacts", () => {
    it("should send SOS to multiple contacts with location", async () => {
      const phoneNumbers = ["+1111111111", "+2222222222"];
      const results = await sendSosToContacts(
        phoneNumbers,
        "Emergency User",
        40.7128,
        -74.006
      );

      expect(results).toHaveLength(2);
      expect(results.every((r) => r.success)).toBe(true);
    });

    it("should use custom message if provided", async () => {
      const results = await sendSosToContacts(
        ["+1234567890"],
        "User",
        40.7128,
        -74.006,
        "Custom emergency message"
      );

      expect(results[0].success).toBe(true);
    });

    it("should generate default message without custom message", async () => {
      const results = await sendSosToContacts(
        ["+1234567890"],
        "User",
        40.7128,
        -74.006
      );

      expect(results[0].success).toBe(true);
    });
  });

  describe("sendLocationShareNotification", () => {
    it("should send location share notification", async () => {
      const result = await sendLocationShareNotification(
        "+1234567890",
        "Alice",
        40.7128,
        -74.006
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it("should include location coordinates in message", async () => {
      const result = await sendLocationShareNotification(
        "+1234567890",
        "Bob",
        37.7749,
        -122.4194
      );

      expect(result.success).toBe(true);
    });
  });

  // ─── Multilingual SMS Template Tests ───────────────────────────────────────

  describe("getSmsTemplates", () => {
    it("should return English templates by default", () => {
      const templates = getSmsTemplates();
      const msg = templates.safetyCheck("John");
      expect(msg).toContain("John");
      expect(msg).toContain("safe");
    });

    it("should return Korean templates", () => {
      const templates = getSmsTemplates("ko");
      const msg = templates.safetyCheck("김철수");
      expect(msg).toContain("김철수");
      expect(msg).toContain("안전");
    });

    it("should return Japanese templates", () => {
      const templates = getSmsTemplates("ja");
      const msg = templates.safetyCheck("田中");
      expect(msg).toContain("田中");
      expect(msg).toContain("安全");
    });

    it("should return Spanish templates", () => {
      const templates = getSmsTemplates("es");
      const msg = templates.safetyCheck("Juan");
      expect(msg).toContain("Juan");
      expect(msg).toContain("salvo");
    });

    it("should return German templates", () => {
      const templates = getSmsTemplates("de");
      const msg = templates.safetyCheck("Hans");
      expect(msg).toContain("Hans");
      expect(msg).toContain("Sicherheit");
    });

    it("should return French templates", () => {
      const templates = getSmsTemplates("fr");
      const msg = templates.safetyCheck("Pierre");
      expect(msg).toContain("Pierre");
      expect(msg).toContain("sécurité");
    });

    it("should include location in safety check when provided", () => {
      const templates = getSmsTemplates("en");
      const msg = templates.safetyCheck("John", "40.7128, -74.006");
      expect(msg).toContain("40.7128");
    });

    it("should format SOS alert with location", () => {
      const templates = getSmsTemplates("en");
      const msg = templates.sosAlert("John", "40.7128, -74.006");
      expect(msg).toContain("EMERGENCY");
      expect(msg).toContain("40.7128");
    });

    it("should format Korean SOS alert", () => {
      const templates = getSmsTemplates("ko");
      const msg = templates.sosAlert("김철수", "37.5665, 126.978");
      expect(msg).toContain("긴급");
      expect(msg).toContain("119");
    });

    it("should format Japanese SOS alert", () => {
      const templates = getSmsTemplates("ja");
      const msg = templates.sosAlert("田中", "35.6762, 139.6503");
      expect(msg).toContain("緊急");
      expect(msg).toContain("110");
    });

    it("should format location share message", () => {
      const templates = getSmsTemplates("en");
      const msg = templates.locationShare("Alice", 40.7128, -74.006);
      expect(msg).toContain("Alice");
      expect(msg).toContain("40.7128");
    });

    it("should format Korean location share message", () => {
      const templates = getSmsTemplates("ko");
      const msg = templates.locationShare("김철수", 37.5665, 126.978);
      expect(msg).toContain("위치");
      expect(msg).toContain("37.5665");
    });
  });

  describe("multilingual sendSafetyCheckToContacts", () => {
    it("should send Korean safety check", async () => {
      const results = await sendSafetyCheckToContacts(
        ["+82-10-1234-5678"],
        "김철수",
        37.5665,
        126.978,
        "ko"
      );
      expect(results[0].success).toBe(true);
    });

    it("should send Japanese safety check", async () => {
      const results = await sendSafetyCheckToContacts(
        ["+81-3-1234-5678"],
        "田中",
        35.6762,
        139.6503,
        "ja"
      );
      expect(results[0].success).toBe(true);
    });
  });

  describe("multilingual sendSosToContacts", () => {
    it("should send Korean SOS", async () => {
      const results = await sendSosToContacts(
        ["+82-10-1234-5678"],
        "김철수",
        37.5665,
        126.978,
        undefined,
        "ko"
      );
      expect(results[0].success).toBe(true);
    });

    it("should send Japanese SOS", async () => {
      const results = await sendSosToContacts(
        ["+81-3-1234-5678"],
        "田中",
        35.6762,
        139.6503,
        undefined,
        "ja"
      );
      expect(results[0].success).toBe(true);
    });
  });

  describe("multilingual sendLocationShareNotification", () => {
    it("should send Korean location share notification", async () => {
      const result = await sendLocationShareNotification(
        "+82-10-1234-5678",
        "김철수",
        37.5665,
        126.978,
        "ko"
      );
      expect(result.success).toBe(true);
    });

    it("should send Japanese location share notification", async () => {
      const result = await sendLocationShareNotification(
        "+81-3-1234-5678",
        "田中",
        35.6762,
        139.6503,
        "ja"
      );
      expect(result.success).toBe(true);
    });
  });
});
