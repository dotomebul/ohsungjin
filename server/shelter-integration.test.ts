/**
 * Test suite for European shelter data integration
 * Verifies that all 160 European shelters are properly loaded and accessible
 */

import { describe, it, expect } from "vitest";
import { EU_SHELTERS, getSheltersByRegion, findNearestShelter, calculateDistance } from "../shared/shelterData";

describe("European Shelter Data Integration", () => {
  describe("Shelter Data Loading", () => {
    it("should load exactly 160 European shelters", () => {
      expect(EU_SHELTERS.length).toBe(160);
    });

    it("should have correct country distribution", () => {
      const byCountry: Record<string, number> = {};
      EU_SHELTERS.forEach((shelter) => {
        if (shelter.country) {
          byCountry[shelter.country] = (byCountry[shelter.country] || 0) + 1;
        }
      });

      expect(byCountry["UK"]).toBe(20);
      expect(byCountry["France"]).toBe(20);
      expect(byCountry["Germany"]).toBe(25);
      expect(byCountry["Greece"]).toBe(15);
      expect(byCountry["Italy"]).toBe(20);
      expect(byCountry["Spain"]).toBe(15);
      expect(byCountry["Portugal"]).toBe(10);
      expect(byCountry["Netherlands"]).toBe(12);
      expect(byCountry["Belgium"]).toBe(10);
      expect(byCountry["Austria"]).toBe(13);
    });

    it("should have all required shelter fields", () => {
      EU_SHELTERS.forEach((shelter) => {
        expect(shelter.id).toBeDefined();
        expect(shelter.name).toBeDefined();
        expect(shelter.address).toBeDefined();
        expect(shelter.lat).toBeDefined();
        expect(shelter.lng).toBeDefined();
        expect(shelter.capacity).toBeGreaterThan(0);
        expect(shelter.type).toBeDefined();
        expect(shelter.region).toBe("eu");
        expect(shelter.disasterTypes).toContain("war");
        expect(shelter.disasterTypes).toContain("bombing");
        expect(shelter.disasterTypes).toContain("nuclear");
      });
    });

    it("should have valid coordinates for all shelters", () => {
      EU_SHELTERS.forEach((shelter) => {
        const lat = parseFloat(shelter.lat);
        const lng = parseFloat(shelter.lng);
        expect(lat).toBeGreaterThanOrEqual(-90);
        expect(lat).toBeLessThanOrEqual(90);
        expect(lng).toBeGreaterThanOrEqual(-180);
        expect(lng).toBeLessThanOrEqual(180);
      });
    });

    it("should have unique IDs for all shelters", () => {
      const ids = EU_SHELTERS.map((s) => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(EU_SHELTERS.length);
    });
  });

  describe("Shelter Retrieval by Region", () => {
    it("should return all EU shelters when querying EU region", () => {
      const shelters = getSheltersByRegion("eu");
      expect(shelters.length).toBe(160);
      expect(shelters).toEqual(EU_SHELTERS);
    });

    it("should return empty array for non-EU regions when called with EU", () => {
      const shelters = getSheltersByRegion("eu");
      shelters.forEach((shelter) => {
        expect(shelter.region).toBe("eu");
      });
    });
  });

  describe("Distance Calculation", () => {
    it("should calculate distance between two points correctly", () => {
      // London to Paris approximately 340 km
      const londonLat = 51.5074;
      const londonLng = -0.1278;
      const parisLat = 48.8566;
      const parisLng = 2.3522;

      const distance = calculateDistance(londonLat, londonLng, parisLat, parisLng);
      expect(distance).toBeGreaterThan(330);
      expect(distance).toBeLessThan(350);
    });

    it("should return 0 distance for same coordinates", () => {
      const distance = calculateDistance(48.8566, 2.3522, 48.8566, 2.3522);
      expect(distance).toBe(0);
    });
  });

  describe("Nearest Shelter Finding", () => {
    it("should find nearest shelter from a given location", () => {
      // London coordinates
      const userLat = 51.5074;
      const userLng = -0.1278;

      const nearest = findNearestShelter(userLat, userLng, EU_SHELTERS);
      expect(nearest).toBeDefined();
      expect(nearest?.country).toBe("UK");
    });

    it("should return null for empty shelter list", () => {
      const nearest = findNearestShelter(51.5074, -0.1278, []);
      expect(nearest).toBeNull();
    });

    it("should find different nearest shelters for different locations", () => {
      // London
      const londonNearest = findNearestShelter(51.5074, -0.1278, EU_SHELTERS);
      // Berlin
      const berlinNearest = findNearestShelter(52.52, 13.405, EU_SHELTERS);

      expect(londonNearest?.country).toBe("UK");
      expect(berlinNearest?.country).toBe("Germany");
      expect(londonNearest?.id).not.toBe(berlinNearest?.id);
    });
  });

  describe("Shelter Capacity", () => {
    it("should have reasonable capacity values", () => {
      EU_SHELTERS.forEach((shelter) => {
        expect(shelter.capacity).toBeGreaterThan(0);
        expect(shelter.capacity).toBeLessThan(10000);
      });
    });

    it("should calculate total capacity", () => {
      const totalCapacity = EU_SHELTERS.reduce((sum, shelter) => sum + shelter.capacity, 0);
      expect(totalCapacity).toBeGreaterThan(150000);
      expect(totalCapacity).toBeLessThan(250000);
    });
  });

  describe("Shelter Types", () => {
    it("should have valid shelter types", () => {
      const validTypes = ["metro", "basement", "bunker", "cave"];
      EU_SHELTERS.forEach((shelter) => {
        expect(validTypes).toContain(shelter.type);
      });
    });

    it("should have distribution of shelter types", () => {
      const typeCount: Record<string, number> = {};
      EU_SHELTERS.forEach((shelter) => {
        typeCount[shelter.type] = (typeCount[shelter.type] || 0) + 1;
      });

      expect(typeCount["metro"]).toBeGreaterThan(0);
      expect(typeCount["basement"]).toBeGreaterThan(0);
      expect(typeCount["bunker"]).toBeGreaterThan(0);
    });
  });

  describe("Country Color Mapping", () => {
    it("should have all countries represented in shelters", () => {
      const countries = new Set(EU_SHELTERS.map((s) => s.country).filter(Boolean));
      expect(countries.size).toBe(10);
      expect(Array.from(countries)).toContain("UK");
      expect(Array.from(countries)).toContain("France");
      expect(Array.from(countries)).toContain("Germany");
      expect(Array.from(countries)).toContain("Greece");
      expect(Array.from(countries)).toContain("Italy");
      expect(Array.from(countries)).toContain("Spain");
      expect(Array.from(countries)).toContain("Portugal");
      expect(Array.from(countries)).toContain("Netherlands");
      expect(Array.from(countries)).toContain("Belgium");
      expect(Array.from(countries)).toContain("Austria");
    });
  });

  describe("Disaster Type Coverage", () => {
    it("should support war, bombing, and nuclear disasters", () => {
      EU_SHELTERS.forEach((shelter) => {
        expect(shelter.disasterTypes).toContain("war");
        expect(shelter.disasterTypes).toContain("bombing");
        expect(shelter.disasterTypes).toContain("nuclear");
      });
    });
  });
});
