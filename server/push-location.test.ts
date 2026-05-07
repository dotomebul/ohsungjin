import { describe, it, expect } from 'vitest';
import { ALL_SHELTERS, getSheltersByRegion, ShelterData } from '../shared/shelterData';
import { getTranslations } from '../shared/i18n/translations';

describe('Shelter Detail Data', () => {
  it('ALL_SHELTERS should contain shelters from all 4 regions', () => {
    const regions = new Set(ALL_SHELTERS.map(s => s.region));
    expect(regions.has('us')).toBe(true);
    expect(regions.has('eu')).toBe(true);
    expect(regions.has('kr')).toBe(true);
    expect(regions.has('jp')).toBe(true);
  });

  it('should have at least 4 shelters per region', () => {
    expect(getSheltersByRegion('us').length).toBeGreaterThanOrEqual(4);
    expect(getSheltersByRegion('eu').length).toBeGreaterThanOrEqual(4);
    expect(getSheltersByRegion('kr').length).toBeGreaterThanOrEqual(4);
    expect(getSheltersByRegion('jp').length).toBeGreaterThanOrEqual(4);
  });

  it('each shelter should have required fields', () => {
    ALL_SHELTERS.forEach((shelter: ShelterData) => {
      expect(shelter.id).toBeTruthy();
      expect(shelter.name).toBeTruthy();
      expect(shelter.address).toBeTruthy();
      expect(shelter.lat).toBeTruthy();
      expect(shelter.lng).toBeTruthy();
      expect(shelter.capacity).toBeGreaterThan(0);
      expect(shelter.type).toBeTruthy();
      expect(shelter.region).toMatch(/^(us|eu|kr|jp)$/);
      expect(shelter.disasterTypes.length).toBeGreaterThan(0);
    });
  });

  it('some shelters should have supplies data', () => {
    const withSupplies = ALL_SHELTERS.filter(s => s.supplies && s.supplies.length > 0);
    expect(withSupplies.length).toBeGreaterThanOrEqual(4);

    withSupplies.forEach((shelter) => {
      shelter.supplies!.forEach((supply) => {
        expect(supply.name).toBeTruthy();
        expect(supply.quantity).toBeGreaterThan(0);
        expect(supply.unit).toBeTruthy();
      });
    });
  });

  it('shelter IDs should be unique', () => {
    const ids = ALL_SHELTERS.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe('Push Notification Translations', () => {
  const languages = ['en', 'ko', 'ja', 'es', 'de', 'fr'] as const;

  languages.forEach((lang) => {
    it(`should have pushNotification translations for ${lang}`, () => {
      const t = getTranslations(lang);
      expect(t.pushNotification.title).toBeTruthy();
      expect(t.pushNotification.enable).toBeTruthy();
      expect(t.pushNotification.disable).toBeTruthy();
      expect(t.pushNotification.enabled).toBeTruthy();
      expect(t.pushNotification.disabled).toBeTruthy();
      expect(t.pushNotification.permissionDenied).toBeTruthy();
      expect(t.pushNotification.alertTypes).toBeTruthy();
      expect(t.pushNotification.earthquakeAlert).toBeTruthy();
      expect(t.pushNotification.tsunamiAlert).toBeTruthy();
      expect(t.pushNotification.typhoonAlert).toBeTruthy();
      expect(t.pushNotification.wildfireAlert).toBeTruthy();
      expect(t.pushNotification.floodAlert).toBeTruthy();
      expect(t.pushNotification.warAlert).toBeTruthy();
    });
  });
});

describe('Location Sharing Translations', () => {
  const languages = ['en', 'ko', 'ja', 'es', 'de', 'fr'] as const;

  languages.forEach((lang) => {
    it(`should have locationSharing translations for ${lang}`, () => {
      const t = getTranslations(lang);
      expect(t.locationSharing.title).toBeTruthy();
      expect(t.locationSharing.subtitle).toBeTruthy();
      expect(t.locationSharing.toggleSharing).toBeTruthy();
      expect(t.locationSharing.sharingOn).toBeTruthy();
      expect(t.locationSharing.sharingOff).toBeTruthy();
      expect(t.locationSharing.updateInterval).toBeTruthy();
      expect(t.locationSharing.seconds).toBeTruthy();
      expect(t.locationSharing.friendsOnMap).toBeTruthy();
      expect(t.locationSharing.noFriends).toBeTruthy();
    });
  });
});

describe('Shelter Detail Translations', () => {
  const languages = ['en', 'ko', 'ja', 'es', 'de', 'fr'] as const;

  languages.forEach((lang) => {
    it(`should have shelterDetail translations for ${lang}`, () => {
      const t = getTranslations(lang);
      expect(t.shelterDetail.title).toBeTruthy();
      expect(t.shelterDetail.capacity).toBeTruthy();
      expect(t.shelterDetail.overview).toBeTruthy();
      expect(t.shelterDetail.facilities).toBeTruthy();
      expect(t.shelterDetail.supplies).toBeTruthy();
      expect(t.shelterDetail.getDirections).toBeTruthy();
      expect(t.shelterDetail.callShelter).toBeTruthy();
      expect(t.shelterDetail.notFound).toBeTruthy();
    });
  });
});
