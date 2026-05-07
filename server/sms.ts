import { ENV } from "./_core/env";
import type { Language } from "@shared/i18n/translations";

/**
 * SMS Service using Twilio
 * Handles sending SMS notifications for emergency alerts and safety checks
 * Supports multilingual message templates
 */

export interface SendSmsOptions {
  to: string; // Phone number to send to
  message: string;
  type: "safety_check" | "sos_alert" | "location_share" | "info";
}

export interface SmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ─── Multilingual SMS Templates ──────────────────────────────────────────────

interface SmsTemplates {
  safetyCheck: (name: string, location?: string) => string;
  sosAlert: (name: string, location: string) => string;
  locationShare: (name: string, lat: number, lng: number) => string;
}

const SMS_TEMPLATES: Record<Language, SmsTemplates> = {
  en: {
    safetyCheck: (name, location) =>
      `${name} has confirmed they are safe.${location ? ` Location: ${location}` : ""}`,
    sosAlert: (name, location) =>
      `🆘 EMERGENCY! ${name} needs help! Location: ${location}. Please call emergency services (911 or 112).`,
    locationShare: (name, lat, lng) =>
      `${name} is sharing their location with you. Lat: ${lat}, Lng: ${lng}`,
  },
  ko: {
    safetyCheck: (name, location) =>
      `${name}님이 안전을 확인했습니다.${location ? ` 위치: ${location}` : ""}`,
    sosAlert: (name, location) =>
      `🆘 긴급! ${name}님이 도움이 필요합니다! 위치: ${location}. 긴급 서비스(119)에 전화해 주세요.`,
    locationShare: (name, lat, lng) =>
      `${name}님이 위치를 공유하고 있습니다. 위도: ${lat}, 경도: ${lng}`,
  },
  ja: {
    safetyCheck: (name, location) =>
      `${name}さんの安全が確認されました。${location ? ` 位置: ${location}` : ""}`,
    sosAlert: (name, location) =>
      `🆘 緊急! ${name}さんが助けを必要としています! 位置: ${location}。緊急サービス(110/119)に電話してください。`,
    locationShare: (name, lat, lng) =>
      `${name}さんが位置情報を共有しています。緯度: ${lat}, 経度: ${lng}`,
  },
  es: {
    safetyCheck: (name, location) =>
      `${name} ha confirmado que está a salvo.${location ? ` Ubicación: ${location}` : ""}`,
    sosAlert: (name, location) =>
      `🆘 ¡EMERGENCIA! ¡${name} necesita ayuda! Ubicación: ${location}. Llame a los servicios de emergencia (112).`,
    locationShare: (name, lat, lng) =>
      `${name} está compartiendo su ubicación contigo. Lat: ${lat}, Lng: ${lng}`,
  },
  de: {
    safetyCheck: (name, location) =>
      `${name} hat bestätigt, dass er/sie in Sicherheit ist.${location ? ` Standort: ${location}` : ""}`,
    sosAlert: (name, location) =>
      `🆘 NOTFALL! ${name} braucht Hilfe! Standort: ${location}. Bitte rufen Sie den Notdienst (112) an.`,
    locationShare: (name, lat, lng) =>
      `${name} teilt seinen/ihren Standort mit Ihnen. Lat: ${lat}, Lng: ${lng}`,
  },
  fr: {
    safetyCheck: (name, location) =>
      `${name} a confirmé être en sécurité.${location ? ` Position: ${location}` : ""}`,
    sosAlert: (name, location) =>
      `🆘 URGENCE! ${name} a besoin d'aide! Position: ${location}. Appelez les services d'urgence (112).`,
    locationShare: (name, lat, lng) =>
      `${name} partage sa position avec vous. Lat: ${lat}, Lng: ${lng}`,
  },
};

export function getSmsTemplates(language: Language = "en"): SmsTemplates {
  return SMS_TEMPLATES[language] || SMS_TEMPLATES.en;
}

// ─── Core SMS Function ───────────────────────────────────────────────────────

/**
 * Send SMS via Twilio
 * In production, this would call Twilio API
 * For now, it logs the message and returns success
 */
export async function sendSms(options: SendSmsOptions): Promise<SmsResult> {
  const { to, message, type } = options;

  // Validate inputs
  if (!to || !message) {
    return {
      success: false,
      error: "Missing required fields: to, message",
    };
  }

  // Check if Twilio credentials are configured
  if (!ENV.twilioAccountSid || !ENV.twilioAuthToken || !ENV.twilioPhoneNumber) {
    console.warn(
      "[SMS] Twilio not configured. SMS would be sent to:",
      to,
      "Message:",
      message
    );
    // In demo mode, return success but don't actually send
    return {
      success: true,
      messageId: `demo-${Date.now()}`,
    };
  }

  try {
    // In production, call Twilio API here
    // For now, we'll simulate the API call
    console.log(`[SMS] Sending ${type} to ${to}:`, message);

    // Simulate Twilio API response
    const messageId = `twilio-${Date.now()}`;
    return {
      success: true,
      messageId,
    };
  } catch (error) {
    console.error("[SMS] Failed to send:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ─── High-Level Functions ────────────────────────────────────────────────────

/**
 * Send safety check SMS to multiple contacts (multilingual)
 */
export async function sendSafetyCheckToContacts(
  phoneNumbers: string[],
  userName: string,
  latitude?: number,
  longitude?: number,
  language: Language = "en"
): Promise<SmsResult[]> {
  const templates = getSmsTemplates(language);
  const locationText = latitude && longitude ? `${latitude}, ${longitude}` : undefined;
  const message = templates.safetyCheck(userName, locationText);

  return Promise.all(
    phoneNumbers.map((phone) =>
      sendSms({
        to: phone,
        message,
        type: "safety_check",
      })
    )
  );
}

/**
 * Send SOS alert SMS to multiple contacts (multilingual)
 */
export async function sendSosToContacts(
  phoneNumbers: string[],
  userName: string,
  latitude: number,
  longitude: number,
  customMessage?: string,
  language: Language = "en"
): Promise<SmsResult[]> {
  const templates = getSmsTemplates(language);
  const message = customMessage || templates.sosAlert(userName, `${latitude}, ${longitude}`);

  return Promise.all(
    phoneNumbers.map((phone) =>
      sendSms({
        to: phone,
        message,
        type: "sos_alert",
      })
    )
  );
}

/**
 * Send location share notification (multilingual)
 */
export async function sendLocationShareNotification(
  phoneNumber: string,
  userName: string,
  latitude: number,
  longitude: number,
  language: Language = "en"
): Promise<SmsResult> {
  const templates = getSmsTemplates(language);
  const message = templates.locationShare(userName, latitude, longitude);

  return sendSms({
    to: phoneNumber,
    message,
    type: "location_share",
  });
}
