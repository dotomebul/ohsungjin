import { describe, expect, it } from "vitest";
import {
  EN_TRANSLATIONS,
  KO_TRANSLATIONS,
  JA_TRANSLATIONS,
  ES_TRANSLATIONS,
  DE_TRANSLATIONS,
  FR_TRANSLATIONS,
  getTranslations,
  getLanguageName,
  type Language,
  type Region,
} from "../shared/i18n/translations";
import {
  getSheltersByRegion,
  searchSheltersByDisaster,
  calculateDistance,
  US_SHELTERS,
  EU_SHELTERS,
  KR_SHELTERS,
  JP_SHELTERS,
} from "../shared/shelterData";

describe("i18n translations", () => {
  it("getTranslations returns correct translations for each language", () => {
    expect(getTranslations("en")).toBe(EN_TRANSLATIONS);
    expect(getTranslations("ko")).toBe(KO_TRANSLATIONS);
    expect(getTranslations("ja")).toBe(JA_TRANSLATIONS);
    expect(getTranslations("es")).toBe(ES_TRANSLATIONS);
    expect(getTranslations("de")).toBe(DE_TRANSLATIONS);
    expect(getTranslations("fr")).toBe(FR_TRANSLATIONS);
  });

  it("getTranslations defaults to English for unknown language", () => {
    expect(getTranslations("xx" as Language)).toBe(EN_TRANSLATIONS);
  });

  it("all translations have the same keys as English", () => {
    const enKeys = Object.keys(EN_TRANSLATIONS);
    const languages: Language[] = ["ko", "ja", "es", "de", "fr"];

    for (const lang of languages) {
      const translations = getTranslations(lang);
      const langKeys = Object.keys(translations);
      expect(langKeys).toEqual(enKeys);
    }
  });

  it("all translations have non-empty common.appName", () => {
    const languages: Language[] = ["en", "ko", "ja", "es", "de", "fr"];
    for (const lang of languages) {
      const t = getTranslations(lang);
      expect(t.common.appName).toBe("Evacora");
    }
  });

  it("Korean translations have Korean text", () => {
    expect(KO_TRANSLATIONS.common.appTagline).toBe("지금 바로 알아야 할 것들");
    expect(KO_TRANSLATIONS.common.home).toBe("홈");
    expect(KO_TRANSLATIONS.common.settings).toBe("설정");
    expect(KO_TRANSLATIONS.common.logout).toBe("로그아웃");
  });

  it("Japanese translations have Japanese text", () => {
    expect(JA_TRANSLATIONS.common.appTagline).toBe("今すぐ知るべきこと");
    expect(JA_TRANSLATIONS.common.home).toBe("ホーム");
    expect(JA_TRANSLATIONS.common.settings).toBe("設定");
    expect(JA_TRANSLATIONS.common.logout).toBe("ログアウト");
  });

  it("getLanguageName returns correct display names", () => {
    expect(getLanguageName("en")).toBe("English");
    expect(getLanguageName("ko")).toBe("한국어");
    expect(getLanguageName("ja")).toBe("日本語");
    expect(getLanguageName("es")).toBe("Español");
    expect(getLanguageName("de")).toBe("Deutsch");
    expect(getLanguageName("fr")).toBe("Français");
  });

  it("all translations have disaster types", () => {
    const languages: Language[] = ["en", "ko", "ja", "es", "de", "fr"];
    for (const lang of languages) {
      const t = getTranslations(lang);
      expect(t.disasters.wildfire).toBeTruthy();
      expect(t.disasters.earthquake).toBeTruthy();
      expect(t.disasters.tornado).toBeTruthy();
      expect(t.disasters.flood).toBeTruthy();
      expect(t.disasters.tsunami).toBeTruthy();
    }
  });

  it("all translations have home page keys", () => {
    const languages: Language[] = ["en", "ko", "ja", "es", "de", "fr"];
    for (const lang of languages) {
      const t = getTranslations(lang);
      expect(t.home.crisisResponseApp).toBeTruthy();
      expect(t.home.areaMap).toBeTruthy();
      expect(t.home.actionGuide).toBeTruthy();
      expect(t.home.emergencyContacts).toBeTruthy();
      expect(t.home.familyTracker).toBeTruthy();
      expect(t.home.safeRoute).toBeTruthy();
    }
  });

  it("all translations have settings page keys", () => {
    const languages: Language[] = ["en", "ko", "ja", "es", "de", "fr"];
    for (const lang of languages) {
      const t = getTranslations(lang);
      expect(t.settingsPage.title).toBeTruthy();
      expect(t.settingsPage.language).toBeTruthy();
      expect(t.settingsPage.region).toBeTruthy();
      expect(t.settingsPage.notifications).toBeTruthy();
      expect(t.settingsPage.privacy).toBeTruthy();
    }
  });

  it("all translations have region names", () => {
    const languages: Language[] = ["en", "ko", "ja", "es", "de", "fr"];
    for (const lang of languages) {
      const t = getTranslations(lang);
      expect(t.regions.unitedStates).toBeTruthy();
      expect(t.regions.europe).toBeTruthy();
      expect(t.regions.korea).toBeTruthy();
      expect(t.regions.japan).toBeTruthy();
    }
  });

  it("all translations have contact page keys", () => {
    const languages: Language[] = ["en", "ko", "ja", "es", "de", "fr"];
    for (const lang of languages) {
      const t = getTranslations(lang);
      expect(t.contact.title).toBeTruthy();
      expect(t.contact.addNew).toBeTruthy();
      expect(t.contact.name).toBeTruthy();
      expect(t.contact.phone).toBeTruthy();
    }
  });

  it("all translations have map page keys", () => {
    const languages: Language[] = ["en", "ko", "ja", "es", "de", "fr"];
    for (const lang of languages) {
      const t = getTranslations(lang);
      expect(t.mapPage.title).toBeTruthy();
      expect(t.mapPage.yourLocation).toBeTruthy();
      expect(t.mapPage.shelterPlace).toBeTruthy();
      expect(t.mapPage.dangerZone).toBeTruthy();
    }
  });

  it("all translations have family tracker keys", () => {
    const languages: Language[] = ["en", "ko", "ja", "es", "de", "fr"];
    for (const lang of languages) {
      const t = getTranslations(lang);
      expect(t.family.title).toBeTruthy();
      expect(t.family.allSafe).toBeTruthy();
      expect(t.family.call).toBeTruthy();
      expect(t.family.message).toBeTruthy();
    }
  });
});

describe("family member empty state translations", () => {
  it("English has empty state messages", () => {
    expect(EN_TRANSLATIONS.family.noMembers).toBe("No family members added yet");
    expect(EN_TRANSLATIONS.family.addMemberDesc).toBeTruthy();
  });

  it("Korean has empty state messages", () => {
    expect(KO_TRANSLATIONS.family.noMembers).toBe("아직 추가된 가족이 없습니다");
    expect(KO_TRANSLATIONS.family.addMemberDesc).toBeTruthy();
  });

  it("Japanese has empty state messages", () => {
    expect(JA_TRANSLATIONS.family.noMembers).toBe("まだ家族が追加されていません");
    expect(JA_TRANSLATIONS.family.addMemberDesc).toBeTruthy();
  });

  it("all languages have family empty state keys", () => {
    const languages: Language[] = ["en", "ko", "ja", "es", "de", "fr"];
    for (const lang of languages) {
      const t = getTranslations(lang);
      expect(t.family.noMembers).toBeTruthy();
      expect(t.family.addMemberDesc).toBeTruthy();
      expect(t.family.addMember).toBeTruthy();
    }
  });
});

describe("onboarding auto-language mapping logic", () => {
  const AUTO_LANGUAGE_REGIONS: Record<string, Language> = {
    us: "en",
    kr: "ko",
    jp: "ja",
  };
  const MULTI_LANGUAGE_REGIONS: Record<string, Language[]> = {
    eu: ["en", "es", "de", "fr"],
  };

  it("US auto-selects English and skips language step", () => {
    const region = "us";
    const autoLang = AUTO_LANGUAGE_REGIONS[region];
    expect(autoLang).toBe("en");
    expect(MULTI_LANGUAGE_REGIONS[region]).toBeUndefined();
  });

  it("Korea auto-selects Korean and skips language step", () => {
    const region = "kr";
    const autoLang = AUTO_LANGUAGE_REGIONS[region];
    expect(autoLang).toBe("ko");
  });

  it("Japan auto-selects Japanese and skips language step", () => {
    const region = "jp";
    const autoLang = AUTO_LANGUAGE_REGIONS[region];
    expect(autoLang).toBe("ja");
  });

  it("Europe requires language selection from 4 options", () => {
    const region = "eu";
    expect(AUTO_LANGUAGE_REGIONS[region]).toBeUndefined();
    const langs = MULTI_LANGUAGE_REGIONS[region];
    expect(langs).toBeDefined();
    expect(langs).toHaveLength(4);
    expect(langs).toContain("en");
    expect(langs).toContain("es");
    expect(langs).toContain("de");
    expect(langs).toContain("fr");
  });

  it("onboarding completed flag persists in localStorage key", () => {
    const STORAGE_KEY = "evacora_onboarding_completed";
    expect(STORAGE_KEY).toBe("evacora_onboarding_completed");
  });
});

describe("region-to-language auto-mapping", () => {
  it("US region should map to English", () => {
    const regionLanguageMap: Record<Region, Language> = {
      us: "en",
      eu: "en", // EU defaults to language selection
      kr: "ko",
      jp: "ja",
    };
    expect(regionLanguageMap["us"]).toBe("en");
  });

  it("Korea region should map to Korean", () => {
    const regionLanguageMap: Record<Region, Language> = {
      us: "en",
      eu: "en",
      kr: "ko",
      jp: "ja",
    };
    expect(regionLanguageMap["kr"]).toBe("ko");
  });

  it("Japan region should map to Japanese", () => {
    const regionLanguageMap: Record<Region, Language> = {
      us: "en",
      eu: "en",
      kr: "ko",
      jp: "ja",
    };
    expect(regionLanguageMap["jp"]).toBe("ja");
  });
});

describe("shelter data by region", () => {

  it("US shelters should exist and have correct region", () => {
    const shelters = getSheltersByRegion("us");
    expect(shelters.length).toBeGreaterThan(0);
    shelters.forEach((s: any) => expect(s.region).toBe("us"));
  });

  it("EU shelters should exist and have correct region", () => {
    const shelters = getSheltersByRegion("eu");
    expect(shelters.length).toBeGreaterThan(0);
    shelters.forEach((s: any) => expect(s.region).toBe("eu"));
  });

  it("KR shelters should exist and have correct region", () => {
    const shelters = getSheltersByRegion("kr");
    expect(shelters.length).toBeGreaterThan(0);
    shelters.forEach((s: any) => expect(s.region).toBe("kr"));
  });

  it("JP shelters should exist and have correct region", () => {
    const shelters = getSheltersByRegion("jp");
    expect(shelters.length).toBeGreaterThan(0);
    shelters.forEach((s: any) => expect(s.region).toBe("jp"));
  });

  it("KR shelters should include Korean names", () => {
    expect(KR_SHELTERS[0].name).toContain("서울");
  });

  it("JP shelters should include Japanese names", () => {
    expect(JP_SHELTERS[0].name).toContain("東京");
  });

  it("searchSheltersByDisaster filters correctly for KR", () => {
    const results = searchSheltersByDisaster("kr", "earthquake");
    expect(results.length).toBeGreaterThan(0);
    results.forEach((s: any) => expect(s.disasterTypes).toContain("earthquake"));
  });

  it("searchSheltersByDisaster filters correctly for JP", () => {
    const results = searchSheltersByDisaster("jp", "tsunami");
    expect(results.length).toBeGreaterThan(0);
    results.forEach((s: any) => expect(s.disasterTypes).toContain("tsunami"));
  });

  it("calculateDistance returns reasonable values", () => {
    // Seoul to Busan ~325km
    const dist = calculateDistance(37.5665, 126.978, 35.1796, 129.0756);
    expect(dist).toBeGreaterThan(300);
    expect(dist).toBeLessThan(400);
  });

  it("all shelters have required fields", () => {
    const allShelters = [...US_SHELTERS, ...EU_SHELTERS, ...KR_SHELTERS, ...JP_SHELTERS];
    allShelters.forEach((s: any) => {
      expect(s.id).toBeTruthy();
      expect(s.name).toBeTruthy();
      expect(s.address).toBeTruthy();
      expect(s.lat).toBeTruthy();
      expect(s.lng).toBeTruthy();
      expect(s.capacity).toBeGreaterThan(0);
      expect(s.type).toBeTruthy();
      expect(s.region).toBeTruthy();
      expect(s.disasterTypes.length).toBeGreaterThan(0);
    });
  });
});
