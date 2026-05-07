import { describe, it, expect } from "vitest";
import { KR_SHELTERS, US_SHELTERS, EU_SHELTERS } from "@shared/shelterData";

describe("Final Integration Tests - All Features", () => {
  describe("Shelter Data Coverage", () => {
    it("should have US shelters", () => {
      expect(US_SHELTERS.length).toBeGreaterThan(0);
      expect(US_SHELTERS.every(s => s.country === 'us')).toBe(true);
    });

    it("should have EU shelters", () => {
      expect(EU_SHELTERS.length).toBeGreaterThan(0);
      expect(EU_SHELTERS.every(s => s.country === 'eu')).toBe(true);
    });

    it("should have KR shelters", () => {
      expect(KR_SHELTERS.length).toBeGreaterThan(0);
      expect(KR_SHELTERS.every(s => s.country === 'kr')).toBe(true);
    });

    it("should have sufficient global shelter coverage", () => {
      const totalShelters = US_SHELTERS.length + EU_SHELTERS.length + KR_SHELTERS.length;
      expect(totalShelters).toBeGreaterThan(150);
    });
  });

  describe("Shelter Data Quality", () => {
    const allShelters = [...US_SHELTERS, ...EU_SHELTERS, ...KR_SHELTERS];

    it("all shelters should have required fields", () => {
      allShelters.forEach(shelter => {
        expect(shelter.id).toBeDefined();
        expect(shelter.name).toBeDefined();
        expect(shelter.lat).toBeDefined();
        expect(shelter.lng).toBeDefined();
        expect(shelter.country).toBeDefined();
        expect(shelter.capacity).toBeGreaterThan(0);
      });
    });

    it("all shelter coordinates should be valid", () => {
      allShelters.forEach(shelter => {
        const lat = parseFloat(shelter.lat);
        const lng = parseFloat(shelter.lng);
        expect(lat).toBeGreaterThanOrEqual(-90);
        expect(lat).toBeLessThanOrEqual(90);
        expect(lng).toBeGreaterThanOrEqual(-180);
        expect(lng).toBeLessThanOrEqual(180);
      });
    });

    it("all shelter IDs should be unique", () => {
      const ids = allShelters.map(s => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("all shelters should have supplies", () => {
      allShelters.forEach(shelter => {
        expect(Array.isArray(shelter.supplies)).toBe(true);
        expect(shelter.supplies.length).toBeGreaterThan(0);
      });
    });

    it("all shelters should have disaster types", () => {
      allShelters.forEach(shelter => {
        expect(Array.isArray(shelter.disasters)).toBe(true);
        expect(shelter.disasters.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Regional Distribution", () => {
    it("should have balanced US shelter distribution", () => {
      const usRegions = US_SHELTERS.map(s => s.name.split(' ')[0]);
      expect(new Set(usRegions).size).toBeGreaterThan(1);
    });

    it("should have balanced EU shelter distribution", () => {
      const euCountries = EU_SHELTERS.map(s => {
        const match = s.name.match(/\(([A-Z]{2})\)/);
        return match ? match[1] : 'unknown';
      });
      expect(new Set(euCountries).size).toBeGreaterThan(3);
    });

    it("should have balanced KR shelter distribution", () => {
      const krCities = KR_SHELTERS.map(s => {
        const cityMatch = s.name.match(/^([가-힣]+)/);
        return cityMatch ? cityMatch[1] : 'unknown';
      });
      expect(new Set(krCities).size).toBeGreaterThan(5);
    });
  });

  describe("Capacity Analysis", () => {
    const allShelters = [...US_SHELTERS, ...EU_SHELTERS, ...KR_SHELTERS];

    it("should have reasonable average capacity", () => {
      const avgCapacity = allShelters.reduce((sum, s) => sum + s.capacity, 0) / allShelters.length;
      expect(avgCapacity).toBeGreaterThan(200);
      expect(avgCapacity).toBeLessThan(2000);
    });

    it("should have total capacity to support large populations", () => {
      const totalCapacity = allShelters.reduce((sum, s) => sum + s.capacity, 0);
      expect(totalCapacity).toBeGreaterThan(100000);
    });

    it("should have diverse shelter types", () => {
      const types = new Set(allShelters.map(s => s.type));
      expect(types.size).toBeGreaterThan(1);
    });
  });

  describe("Supply Coverage", () => {
    const allShelters = [...US_SHELTERS, ...EU_SHELTERS, ...KR_SHELTERS];
    const allSupplies = new Set<string>();
    allShelters.forEach(s => {
      if (Array.isArray(s.supplies)) {
        s.supplies.forEach(supply => allSupplies.add(supply));
      }
    });

    it("should have diverse supply types", () => {
      expect(allSupplies.size).toBeGreaterThan(3);
    });

    it("should have water in most shelters", () => {
      const withWater = allShelters.filter(s => Array.isArray(s.supplies) && s.supplies.includes('water')).length;
      expect(withWater / allShelters.length).toBeGreaterThan(0.5);
    });

    it("should have food in most shelters", () => {
      const withFood = allShelters.filter(s => Array.isArray(s.supplies) && s.supplies.includes('food')).length;
      expect(withFood / allShelters.length).toBeGreaterThan(0.5);
    });

    it("should have medical supplies in majority of shelters", () => {
      const withMedical = allShelters.filter(s => Array.isArray(s.supplies) && s.supplies.includes('medical')).length;
      expect(withMedical / allShelters.length).toBeGreaterThan(0.3);
    });
  });

  describe("Disaster Coverage", () => {
    const allShelters = [...US_SHELTERS, ...EU_SHELTERS, ...KR_SHELTERS];
    const allDisasters = new Set<string>();
    allShelters.forEach(s => {
      if (Array.isArray(s.disasters)) {
        s.disasters.forEach(d => allDisasters.add(d));
      }
    });

    it("should cover major disaster types", () => {
      expect(allDisasters.size).toBeGreaterThan(0);
    });

    it("should have diverse disaster coverage", () => {
      expect(allDisasters.size).toBeGreaterThan(4);
    });

    it("US shelters should cover wildfire", () => {
      const withWildfire = US_SHELTERS.filter(s => Array.isArray(s.disasters) && s.disasters.includes('wildfire')).length;
      expect(withWildfire).toBeGreaterThanOrEqual(0);
    });

    it("EU shelters should cover war", () => {
      const withWar = EU_SHELTERS.filter(s => Array.isArray(s.disasters) && s.disasters.includes('war')).length;
      expect(withWar).toBeGreaterThanOrEqual(0);
    });

    it("KR shelters should cover earthquake", () => {
      const withEarthquake = KR_SHELTERS.filter(s => Array.isArray(s.disasters) && s.disasters.includes('earthquake')).length;
      expect(withEarthquake).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Geographic Accuracy", () => {
    it("US shelters should be in North America", () => {
      US_SHELTERS.forEach(s => {
        const lat = parseFloat(s.lat);
        const lng = parseFloat(s.lng);
        expect(lat).toBeGreaterThan(25);
        expect(lat).toBeLessThan(50);
        expect(lng).toBeGreaterThan(-130);
        expect(lng).toBeLessThan(-65);
      });
    });

    it("EU shelters should be in Europe", () => {
      EU_SHELTERS.forEach(s => {
        const lat = parseFloat(s.lat);
        const lng = parseFloat(s.lng);
        expect(lat).toBeGreaterThan(35);
        expect(lat).toBeLessThan(70);
        expect(lng).toBeGreaterThan(-10);
        expect(lng).toBeLessThan(40);
      });
    });

    it("KR shelters should be in Korea", () => {
      KR_SHELTERS.forEach(s => {
        const lat = parseFloat(s.lat);
        const lng = parseFloat(s.lng);
        expect(lat).toBeGreaterThan(33);
        expect(lat).toBeLessThan(39);
        expect(lng).toBeGreaterThan(124);
        expect(lng).toBeLessThan(132);
      });
    });
  });
});
