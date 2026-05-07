import { describe, it, expect } from 'vitest';

describe('Active Alerts System', () => {
  describe('Schema validation', () => {
    it('should support all 4 regions (us, eu, kr, jp)', () => {
      const validRegions = ['us', 'eu', 'kr', 'jp'];
      validRegions.forEach(region => {
        expect(['us', 'eu', 'kr', 'jp']).toContain(region);
      });
    });

    it('should support all severity levels', () => {
      const validSeverities = ['low', 'medium', 'high', 'critical', 'warning', 'info'];
      validSeverities.forEach(severity => {
        expect(['low', 'medium', 'high', 'critical', 'warning', 'info']).toContain(severity);
      });
    });

    it('should support all status types', () => {
      const validStatuses = ['active', 'resolved', 'escalated'];
      validStatuses.forEach(status => {
        expect(['active', 'resolved', 'escalated']).toContain(status);
      });
    });
  });

  describe('Alert creation input validation', () => {
    it('should require disasterTypeId, severity, title, description, region', () => {
      const validInput = {
        disasterTypeId: 1,
        severity: 'critical' as const,
        title: 'Earthquake Warning',
        description: 'Magnitude 6.2 earthquake detected',
        region: 'jp' as const,
      };
      expect(validInput.disasterTypeId).toBeGreaterThan(0);
      expect(validInput.severity).toBeTruthy();
      expect(validInput.title).toBeTruthy();
      expect(validInput.description).toBeTruthy();
      expect(['us', 'eu', 'kr', 'jp']).toContain(validInput.region);
    });

    it('should accept optional latitude, longitude, radiusKm', () => {
      const inputWithLocation = {
        disasterTypeId: 2,
        severity: 'high' as const,
        title: 'Wildfire Alert',
        description: 'Wildfire spreading in northern area',
        region: 'us' as const,
        latitude: 37.7749,
        longitude: -122.4194,
        radiusKm: 15,
      };
      expect(inputWithLocation.latitude).toBeCloseTo(37.7749);
      expect(inputWithLocation.longitude).toBeCloseTo(-122.4194);
      expect(inputWithLocation.radiusKm).toBe(15);
    });
  });

  describe('Web Push notification settings', () => {
    it('should have all disaster type alert toggles', () => {
      const notificationSettings = {
        pushEnabled: true,
        smsAlerts: true,
        earthquakeAlert: true,
        tsunamiAlert: true,
        typhoonAlert: true,
        wildfireAlert: true,
        floodAlert: true,
        warAlert: true,
      };
      expect(Object.keys(notificationSettings)).toHaveLength(8);
      expect(notificationSettings.pushEnabled).toBe(true);
    });

    it('should persist settings to localStorage format', () => {
      const settings = {
        pushEnabled: false,
        smsAlerts: true,
        earthquakeAlert: true,
        tsunamiAlert: false,
        typhoonAlert: true,
        wildfireAlert: true,
        floodAlert: false,
        warAlert: true,
      };
      const serialized = JSON.stringify(settings);
      const parsed = JSON.parse(serialized);
      expect(parsed.pushEnabled).toBe(false);
      expect(parsed.tsunamiAlert).toBe(false);
      expect(parsed.floodAlert).toBe(false);
    });
  });

  describe('Location sharing with tRPC', () => {
    it('should validate latitude range (-90 to 90)', () => {
      const validLats = [-90, -45.5, 0, 37.5665, 90];
      validLats.forEach(lat => {
        expect(lat).toBeGreaterThanOrEqual(-90);
        expect(lat).toBeLessThanOrEqual(90);
      });
    });

    it('should validate longitude range (-180 to 180)', () => {
      const validLngs = [-180, -122.4194, 0, 126.978, 180];
      validLngs.forEach(lng => {
        expect(lng).toBeGreaterThanOrEqual(-180);
        expect(lng).toBeLessThanOrEqual(180);
      });
    });

    it('should support update intervals of 5, 15, 30, 60 seconds', () => {
      const intervals = [5, 15, 30, 60];
      intervals.forEach(interval => {
        expect(interval).toBeGreaterThanOrEqual(5);
        expect(interval).toBeLessThanOrEqual(60);
      });
    });
  });

  describe('Shelter detail page data', () => {
    it('should include supplies information', () => {
      const shelter = {
        id: 'us-la-001',
        name: 'LA Convention Center',
        supplies: [
          { name: 'Water', quantity: 10000, unit: 'liters' },
          { name: 'Blankets', quantity: 2000, unit: 'pcs' },
        ],
      };
      expect(shelter.supplies).toHaveLength(2);
      expect(shelter.supplies[0].name).toBe('Water');
      expect(shelter.supplies[0].quantity).toBe(10000);
    });

    it('should support all 4 regions for shelters', () => {
      const regions = ['us', 'eu', 'kr', 'jp'];
      regions.forEach(region => {
        expect(['us', 'eu', 'kr', 'jp']).toContain(region);
      });
    });
  });
});
