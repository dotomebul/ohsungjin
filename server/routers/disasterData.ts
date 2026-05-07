/**
 * Disaster Data Router
 * Fetches real-time disaster data from public APIs:
 * - USGS Earthquake Feed (Global)
 * - NOAA/NWS Active Alerts (USA)
 * - JMA Earthquake Data (Japan)
 * - GDACS Global Disaster Alert (Global)
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DisasterEvent {
  id: string;
  type: "earthquake" | "wildfire" | "flood" | "storm" | "tsunami" | "volcano" | "other";
  severity: "extreme" | "severe" | "moderate" | "minor";
  title: string;
  description: string;
  lat: number;
  lng: number;
  radius?: number; // km
  country?: string;
  source: string;
  url?: string;
  startedAt: number; // unix ms
  updatedAt: number; // unix ms
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function magnitudeToSeverity(mag: number): DisasterEvent["severity"] {
  if (mag >= 7.0) return "extreme";
  if (mag >= 5.5) return "severe";
  if (mag >= 4.0) return "moderate";
  return "minor";
}

function nwsSeverityMap(severity: string): DisasterEvent["severity"] {
  const s = severity?.toLowerCase() || "";
  if (s === "extreme") return "extreme";
  if (s === "severe") return "severe";
  if (s === "moderate") return "moderate";
  return "minor";
}

function nwsEventToType(event: string): DisasterEvent["type"] {
  const e = event?.toLowerCase() || "";
  if (e.includes("earthquake") || e.includes("tsunami")) return "earthquake";
  if (e.includes("fire") || e.includes("wildfire")) return "wildfire";
  if (e.includes("flood")) return "flood";
  if (e.includes("tornado") || e.includes("hurricane") || e.includes("typhoon") || e.includes("wind")) return "storm";
  if (e.includes("volcano")) return "volcano";
  return "other";
}

// Parse NWS polygon/point to centroid
function parseNwsGeometry(geometry: any): { lat: number; lng: number } | null {
  if (!geometry) return null;
  if (geometry.type === "Point" && geometry.coordinates) {
    return { lat: geometry.coordinates[1], lng: geometry.coordinates[0] };
  }
  if (geometry.type === "Polygon" && geometry.coordinates?.[0]) {
    const coords = geometry.coordinates[0] as [number, number][];
    const lat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
    const lng = coords.reduce((s, c) => s + c[0], 0) / coords.length;
    return { lat, lng };
  }
  return null;
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

async function fetchUSGSEarthquakes(minMag = 4.0): Promise<DisasterEvent[]> {
  try {
    const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.features || [])
      .filter((f: any) => (f.properties?.mag || 0) >= minMag)
      .map((f: any): DisasterEvent => ({
        id: `usgs-${f.id}`,
        type: "earthquake",
        severity: magnitudeToSeverity(f.properties.mag),
        title: `M${f.properties.mag.toFixed(1)} Earthquake`,
        description: f.properties.place || "Unknown location",
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
        radius: Math.round(Math.pow(10, 0.5 * f.properties.mag - 1.8) * 10),
        country: "Global",
        source: "USGS",
        url: f.properties.url,
        startedAt: f.properties.time,
        updatedAt: f.properties.updated || f.properties.time,
      }));
  } catch {
    return [];
  }
}

async function fetchNWSAlerts(): Promise<DisasterEvent[]> {
  try {
    const url = `https://api.weather.gov/alerts/active?status=actual&message_type=alert&urgency=Immediate,Expected`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Evacora/1.0 (evacora.manus.space)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.features || [])
      .slice(0, 50) // limit to 50 most recent
      .map((f: any): DisasterEvent | null => {
        const geo = parseNwsGeometry(f.geometry);
        if (!geo) return null;
        const props = f.properties;
        return {
          id: `nws-${f.id}`,
          type: nwsEventToType(props.event || ""),
          severity: nwsSeverityMap(props.severity),
          title: props.headline || props.event || "Weather Alert",
          description: props.description?.slice(0, 200) || props.event || "",
          lat: geo.lat,
          lng: geo.lng,
          country: "US",
          source: "NWS",
          url: props["@id"],
          startedAt: new Date(props.onset || props.effective || Date.now()).getTime(),
          updatedAt: new Date(props.expires || Date.now()).getTime(),
        };
      })
      .filter(Boolean) as DisasterEvent[];
  } catch {
    return [];
  }
}

async function fetchGDACS(): Promise<DisasterEvent[]> {
  try {
    // GDACS RSS feed - global disaster alerts
    const url = `https://www.gdacs.org/xml/rss.xml`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const text = await res.text();

    // Simple XML parse for RSS items
    const items: DisasterEvent[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(text)) !== null) {
      const item = match[1];
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
      const latStr = item.match(/<geo:lat>(.*?)<\/geo:lat>/)?.[1] || item.match(/<gdacs:latitude>(.*?)<\/gdacs:latitude>/)?.[1];
      const lngStr = item.match(/<geo:long>(.*?)<\/geo:long>/)?.[1] || item.match(/<gdacs:longitude>(.*?)<\/gdacs:longitude>/)?.[1];
      const alertLevel = item.match(/<gdacs:alertlevel>(.*?)<\/gdacs:alertlevel>/)?.[1]?.toLowerCase() || "green";
      const eventType = item.match(/<gdacs:eventtype>(.*?)<\/gdacs:eventtype>/)?.[1]?.toLowerCase() || "";
      const country = item.match(/<gdacs:country>(.*?)<\/gdacs:country>/)?.[1] || "";

      if (!latStr || !lngStr) continue;
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      if (isNaN(lat) || isNaN(lng)) continue;

      let type: DisasterEvent["type"] = "other";
      if (eventType.includes("eq") || eventType.includes("earthquake")) type = "earthquake";
      else if (eventType.includes("tc") || eventType.includes("cyclone") || eventType.includes("hurricane")) type = "storm";
      else if (eventType.includes("fl") || eventType.includes("flood")) type = "flood";
      else if (eventType.includes("vo") || eventType.includes("volcano")) type = "volcano";
      else if (eventType.includes("wf") || eventType.includes("fire")) type = "wildfire";
      else if (eventType.includes("ts") || eventType.includes("tsunami")) type = "tsunami";

      let severity: DisasterEvent["severity"] = "minor";
      if (alertLevel === "red") severity = "extreme";
      else if (alertLevel === "orange") severity = "severe";
      else if (alertLevel === "green") severity = "moderate";

      const ts = pubDate ? new Date(pubDate).getTime() : Date.now();
      items.push({
        id: `gdacs-${ts}-${lat}-${lng}`,
        type,
        severity,
        title: title.trim(),
        description: country ? `Country: ${country}` : "",
        lat,
        lng,
        country,
        source: "GDACS",
        url: link,
        startedAt: ts,
        updatedAt: ts,
      });
    }
    return items.slice(0, 30);
  } catch {
    return [];
  }
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const disasterDataRouter = router({
  // Get all active disaster events (merged from multiple sources)
  getActiveEvents: publicProcedure
    .input(
      z.object({
        lat: z.number().optional(),
        lng: z.number().optional(),
        radiusKm: z.number().default(5000), // filter by distance if provided
        minSeverity: z.enum(["minor", "moderate", "severe", "extreme"]).default("moderate"),
      }).optional()
    )
    .query(async ({ input }) => {
      const severityOrder = { minor: 0, moderate: 1, severe: 2, extreme: 3 };
      const minSev = input?.minSeverity || "moderate";

      // Fetch from all sources in parallel
      const [usgsEvents, nwsEvents, gdacsEvents] = await Promise.all([
        fetchUSGSEarthquakes(4.0),
        fetchNWSAlerts(),
        fetchGDACS(),
      ]);

      let allEvents = [...usgsEvents, ...nwsEvents, ...gdacsEvents];

      // Filter by severity
      allEvents = allEvents.filter(
        e => severityOrder[e.severity] >= severityOrder[minSev]
      );

      // Filter by distance if lat/lng provided
      if (input?.lat && input?.lng) {
        const { lat: userLat, lng: userLng, radiusKm = 5000 } = input;
        allEvents = allEvents.filter(e => {
          const dLat = (e.lat - userLat) * Math.PI / 180;
          const dLng = (e.lng - userLng) * Math.PI / 180;
          const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(userLat * Math.PI / 180) * Math.cos(e.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
          const distKm = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return distKm <= radiusKm;
        });
      }

      // Sort by severity desc, then by time desc
      allEvents.sort((a, b) => {
        const sevDiff = severityOrder[b.severity] - severityOrder[a.severity];
        if (sevDiff !== 0) return sevDiff;
        return b.startedAt - a.startedAt;
      });

      return allEvents.slice(0, 100);
    }),

  // Get earthquake data specifically (USGS)
  getEarthquakes: publicProcedure
    .input(z.object({ minMag: z.number().default(4.0) }).optional())
    .query(async ({ input }) => {
      return fetchUSGSEarthquakes(input?.minMag || 4.0);
    }),

  // Get US weather alerts (NWS)
  getUSWeatherAlerts: publicProcedure.query(async () => {
    return fetchNWSAlerts();
  }),
});
