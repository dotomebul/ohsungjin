/**
 * Evacora - 유럽 재난 데이터 API 통합
 * GDACS, Copernicus EMS, ESWD 연동
 */

export interface DisasterEvent {
  id: string;
  type: 'earthquake' | 'flood' | 'wildfire' | 'volcano' | 'storm' | 'tornado' | 'war';
  lat: number;
  lng: number;
  magnitude?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  country?: string;
  region?: string;
  source: 'GDACS' | 'Copernicus' | 'ESWD' | 'USGS' | 'NWS';
}

/**
 * GDACS API - 글로벌 재난 경보 시스템
 * 지진, 홍수, 산불, 화산 등 주요 재난 정보 제공
 */
export async function fetchGDACSDisasters(): Promise<DisasterEvent[]> {
  try {
    const response = await fetch('https://www.gdacs.org/api/v1/events');
    if (!response.ok) return [];
    
    const data = await response.json();
    const events: DisasterEvent[] = [];
    
    if (data.features && Array.isArray(data.features)) {
      for (const feature of data.features) {
        const props = feature.properties;
        const coords = feature.geometry.coordinates;
        
        // 재난 유형 매핑
        let disasterType: DisasterEvent['type'] = 'earthquake';
        if (props.eventtype === 'FL') disasterType = 'flood';
        else if (props.eventtype === 'WF') disasterType = 'wildfire';
        else if (props.eventtype === 'VO') disasterType = 'volcano';
        else if (props.eventtype === 'EQ') disasterType = 'earthquake';
        
        // 심각도 결정
        let severity: DisasterEvent['severity'] = 'low';
        const alert = props.alertscore || 0;
        if (alert >= 8) severity = 'critical';
        else if (alert >= 6) severity = 'high';
        else if (alert >= 4) severity = 'medium';
        
        events.push({
          id: `gdacs-${props.eventid}`,
          type: disasterType,
          lat: coords[1],
          lng: coords[0],
          magnitude: props.magnitude,
          severity,
          description: props.title || props.eventtype,
          timestamp: new Date(props.eventdate),
          source: 'GDACS',
        });
      }
    }
    
    return events;
  } catch (error) {
    console.error('GDACS API error:', error);
    return [];
  }
}

/**
 * Copernicus Emergency Management Service - 위성 기반 재난 감지
 * 산불, 홍수 등 지표 기반 재난 정보 제공
 */
export async function fetchCopernicusDisasters(): Promise<DisasterEvent[]> {
  try {
    // Copernicus EMS는 WMS/WFS 기반이므로 직접 API 호출 대신
    // 공개 데이터 포인트 사용
    const response = await fetch('https://emergency.copernicus.eu/mapping/api/v1/activations');
    if (!response.ok) return [];
    
    const data = await response.json();
    const events: DisasterEvent[] = [];
    
    if (data.data && Array.isArray(data.data)) {
      for (const activation of data.data) {
        let disasterType: DisasterEvent['type'] = 'flood';
        if (activation.event_type?.includes('wildfire') || activation.event_type?.includes('fire')) {
          disasterType = 'wildfire';
        } else if (activation.event_type?.includes('flood')) {
          disasterType = 'flood';
        }
        
        events.push({
          id: `copernicus-${activation.id}`,
          type: disasterType,
          lat: activation.latitude || 0,
          lng: activation.longitude || 0,
          severity: 'high',
          description: `${activation.event_type} - ${activation.country}`,
          timestamp: new Date(activation.activation_date),
          country: activation.country,
          source: 'Copernicus',
        });
      }
    }
    
    return events;
  } catch (error) {
    console.error('Copernicus API error:', error);
    return [];
  }
}

/**
 * European Severe Weather Database (ESWD)
 * 폭풍, 토네이도, 강풍 등 악기상 데이터 제공
 */
export async function fetchESWDDisasters(): Promise<DisasterEvent[]> {
  try {
    // ESWD는 데이터베이스 기반이므로 공개 API 엔드포인트 사용
    const response = await fetch('https://www.essl.org/cgi-bin/eswd/query');
    if (!response.ok) return [];
    
    // ESWD는 HTML 기반 응답이므로 실제 구현에서는
    // 공개 데이터 피드 또는 데이터 다운로드 사용
    const events: DisasterEvent[] = [];
    
    // 샘플 데이터 (실제로는 파싱 필요)
    // 이 부분은 ESWD 데이터 가용성에 따라 조정 필요
    
    return events;
  } catch (error) {
    console.error('ESWD API error:', error);
    return [];
  }
}

/**
 * 미국 USGS 지진 데이터
 */
export async function fetchUSGSEarthquakes(): Promise<DisasterEvent[]> {
  try {
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson');
    if (!response.ok) return [];
    
    const data = await response.json();
    const events: DisasterEvent[] = [];
    
    if (data.features && Array.isArray(data.features)) {
      for (const feature of data.features) {
        const props = feature.properties;
        const coords = feature.geometry.coordinates;
        const magnitude = coords[2]; // 깊이 정보
        
        let severity: DisasterEvent['severity'] = 'low';
        if (props.mag >= 7) severity = 'critical';
        else if (props.mag >= 6) severity = 'high';
        else if (props.mag >= 5) severity = 'medium';
        
        events.push({
          id: `usgs-${props.code}`,
          type: 'earthquake',
          lat: coords[1],
          lng: coords[0],
          magnitude: props.mag,
          severity,
          description: props.title,
          timestamp: new Date(props.time),
          source: 'USGS',
        });
      }
    }
    
    return events;
  } catch (error) {
    console.error('USGS API error:', error);
    return [];
  }
}

/**
 * 미국 NWS 기상 경보
 */
export async function fetchNWSAlerts(): Promise<DisasterEvent[]> {
  try {
    const response = await fetch('https://api.weather.gov/alerts/active?point=39.8283,-98.5795');
    if (!response.ok) return [];
    
    const data = await response.json();
    const events: DisasterEvent[] = [];
    
    if (data.features && Array.isArray(data.features)) {
      for (const feature of data.features) {
        const props = feature.properties;
        
        let disasterType: DisasterEvent['type'] = 'storm';
        const event = props.event?.toLowerCase() || '';
        if (event.includes('tornado')) disasterType = 'tornado';
        else if (event.includes('flood')) disasterType = 'flood';
        else if (event.includes('fire')) disasterType = 'wildfire';
        
        let severity: DisasterEvent['severity'] = 'medium';
        if (props.severity === 'Extreme') severity = 'critical';
        else if (props.severity === 'Severe') severity = 'high';
        else if (props.severity === 'Moderate') severity = 'medium';
        
        events.push({
          id: `nws-${props.id}`,
          type: disasterType,
          lat: feature.geometry?.coordinates?.[1] || 0,
          lng: feature.geometry?.coordinates?.[0] || 0,
          severity,
          description: props.headline || props.event,
          timestamp: new Date(props.effective),
          source: 'NWS',
        });
      }
    }
    
    return events;
  } catch (error) {
    console.error('NWS API error:', error);
    return [];
  }
}

/**
 * 모든 재난 데이터 소스 통합
 */
export async function fetchAllDisasterEvents(region: 'us' | 'eu' | 'kr' | 'jp'): Promise<DisasterEvent[]> {
  const allEvents: DisasterEvent[] = [];
  
  try {
    if (region === 'us') {
      const [usgs, nws] = await Promise.all([
        fetchUSGSEarthquakes(),
        fetchNWSAlerts(),
      ]);
      allEvents.push(...usgs, ...nws);
    } else if (region === 'eu') {
      const [gdacs, copernicus] = await Promise.all([
        fetchGDACSDisasters(),
        fetchCopernicusDisasters(),
      ]);
      allEvents.push(...gdacs, ...copernicus);
    } else {
      // 아시아 지역은 GDACS 사용
      const gdacs = await fetchGDACSDisasters();
      allEvents.push(...gdacs);
    }
    
    // 중복 제거 및 정렬
    const uniqueEvents = Array.from(
      new Map(allEvents.map(e => [e.id, e])).values()
    );
    
    return uniqueEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  } catch (error) {
    console.error('Error fetching disaster events:', error);
    return [];
  }
}

/**
 * 특정 위치 근처의 재난 이벤트 필터링
 */
export function filterDisastersByLocation(
  events: DisasterEvent[],
  lat: number,
  lng: number,
  radiusKm: number = 100
): DisasterEvent[] {
  return events.filter(event => {
    const dlat = event.lat - lat;
    const dlng = event.lng - lng;
    const distance = Math.sqrt(dlat * dlat + dlng * dlng) * 111; // km 변환
    return distance <= radiusKm;
  });
}
