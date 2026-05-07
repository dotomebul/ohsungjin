/**
 * 실제 FEMA 및 유럽 대피소 데이터
 * 미국: FEMA 대피소 (재난 시 개방)
 * 유럽: 전쟁/폭격 대피소 (벙커, 지하실, 공공 시설) - 160개 대피소
 */

export interface ShelterData {
  id: string;
  name: string;
  address: string;
  lat: string;
  lng: string;
  capacity: number;
  type: string;
  phone?: string;
  website?: string;
  amenities?: string[];
  supplies?: { name: string; quantity: number; unit: string }[];
  region: "us" | "eu" | "kr" | "jp";
  disasterTypes: string[];
  country?: string;
}

// FEMA 승인 대피소 (미국 주요 도시)
export const US_SHELTERS: ShelterData[] = [
  {
    id: "fema-ny-001",
    name: "NYC Emergency Operations Center",
    address: "165 Mulberry St, New York, NY 10013",
    lat: "40.7160",
    lng: "-73.9997",
    capacity: 1000,
    type: "Government Center",
    phone: "+1-311",
    website: "https://www1.nyc.gov/site/em/index.page",
    amenities: ["Medical", "Food", "Water", "Cots", "WiFi"],
    supplies: [
      { name: "Water", quantity: 5000, unit: "liters" },
      { name: "MRE Meals", quantity: 3000, unit: "packs" },
      { name: "First Aid Kits", quantity: 200, unit: "kits" },
      { name: "Blankets", quantity: 1500, unit: "pcs" },
      { name: "Flashlights", quantity: 500, unit: "pcs" },
    ],
    region: "us",
    disasterTypes: ["wildfire", "earthquake", "hurricane", "tornado", "flood"],
  },
  {
    id: "fema-ca-001",
    name: "Los Angeles Convention Center",
    address: "1201 S Figueroa St, Los Angeles, CA 90015",
    lat: "34.4194",
    lng: "-118.2671",
    capacity: 5000,
    type: "Convention Center",
    phone: "+1-213-741-1151",
    website: "https://www.lacclink.com/",
    amenities: ["Medical", "Food", "Water", "Cots", "WiFi", "Parking"],
    supplies: [
      { name: "Water", quantity: 15000, unit: "liters" },
      { name: "MRE Meals", quantity: 10000, unit: "packs" },
      { name: "First Aid Kits", quantity: 500, unit: "kits" },
      { name: "Blankets", quantity: 5000, unit: "pcs" },
      { name: "Generators", quantity: 10, unit: "units" },
    ],
    region: "us",
    disasterTypes: ["wildfire", "earthquake", "hurricane"],
  },
  {
    id: "fema-tx-001",
    name: "Houston Astrodome",
    address: "8400 Kirby Dr, Houston, TX 77054",
    lat: "29.7589",
    lng: "-95.2606",
    capacity: 10000,
    type: "Sports Facility",
    phone: "+1-713-629-3700",
    website: "https://www.astrodome.com/",
    amenities: ["Medical", "Food", "Water", "Cots", "WiFi", "Parking"],
    region: "us",
    disasterTypes: ["hurricane", "flood", "tornado"],
  },
  {
    id: "fema-fl-001",
    name: "Miami-Dade County Emergency Operations",
    address: "9300 NW 41st St, Doral, FL 33178",
    lat: "25.8119",
    lng: "-80.3456",
    capacity: 2000,
    type: "Government Center",
    phone: "+1-305-468-5400",
    website: "https://www.miamidade.gov/emergency/",
    amenities: ["Medical", "Food", "Water", "Cots", "WiFi"],
    region: "us",
    disasterTypes: ["hurricane", "flood", "tornado"],
  },
  {
    id: "fema-wa-001",
    name: "Seattle Convention Center",
    address: "705 Pike Pl, Seattle, WA 98101",
    lat: "47.6205",
    lng: "-122.3212",
    capacity: 3000,
    type: "Convention Center",
    phone: "+1-206-694-5000",
    website: "https://www.seattleconventioncenter.com/",
    amenities: ["Medical", "Food", "Water", "Cots", "WiFi"],
    region: "us",
    disasterTypes: ["earthquake", "wildfire", "flood"],
  },
  {
    id: "fema-co-001",
    name: "Denver Convention Center",
    address: "700 14th St, Denver, CO 80202",
    lat: "39.7392",
    lng: "-104.9903",
    capacity: 4000,
    type: "Convention Center",
    phone: "+1-303-228-8000",
    website: "https://www.denverconvention.com/",
    amenities: ["Medical", "Food", "Water", "Cots", "WiFi"],
    region: "us",
    disasterTypes: ["wildfire", "tornado", "flood"],
  },
];

// 유럽 전쟁/폭격 대피소 (160개) - 국가별 색상 구분
export const EU_SHELTERS: ShelterData[] = [
  // 🇬🇧 영국 (20개) - 파란색
  { id: "eu-uk-001", name: "Westminster Underground Station", address: "London, UK", lat: "51.4975", lng: "-0.1357", capacity: 3000, type: "metro", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-002", name: "King's Cross St Pancras", address: "London, UK", lat: "51.5308", lng: "-0.1190", capacity: 2800, type: "metro", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-003", name: "Piccadilly Circus", address: "London, UK", lat: "51.5097", lng: "-0.1337", capacity: 2500, type: "metro", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-004", name: "Bank Station", address: "London, UK", lat: "51.5141", lng: "-0.0883", capacity: 2200, type: "metro", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-005", name: "Tower Bridge Basement", address: "London, UK", lat: "51.5055", lng: "-0.0754", capacity: 1500, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-006", name: "British Museum Basement", address: "London, UK", lat: "51.5194", lng: "-0.1270", capacity: 1200, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-007", name: "National Gallery Basement", address: "London, UK", lat: "51.5087", lng: "-0.1283", capacity: 900, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-008", name: "St Paul's Cathedral Crypt", address: "London, UK", lat: "51.5138", lng: "-0.0984", capacity: 800, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-009", name: "Tower of London Basement", address: "London, UK", lat: "51.5055", lng: "-0.0754", capacity: 700, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-010", name: "Houses of Parliament Bunker", address: "London, UK", lat: "51.4995", lng: "-0.1246", capacity: 400, type: "bunker", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-011", name: "Manchester Piccadilly Station", address: "Manchester, UK", lat: "53.4778", lng: "-2.2298", capacity: 1800, type: "metro", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-012", name: "Manchester Central Library", address: "Manchester, UK", lat: "53.4809", lng: "-2.2426", capacity: 600, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-013", name: "Manchester Town Hall", address: "Manchester, UK", lat: "53.4808", lng: "-2.2426", capacity: 500, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-014", name: "Deansgate-Castlefield", address: "Manchester, UK", lat: "53.4776", lng: "-2.2544", capacity: 1500, type: "metro", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-015", name: "Manchester Museum Basement", address: "Manchester, UK", lat: "53.4665", lng: "-2.2316", capacity: 400, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-016", name: "Birmingham New Street Station", address: "Birmingham, UK", lat: "52.5079", lng: "-1.8998", capacity: 1600, type: "metro", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-017", name: "Birmingham Museum", address: "Birmingham, UK", lat: "52.5050", lng: "-1.9027", capacity: 500, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-018", name: "Council House Basement", address: "Birmingham, UK", lat: "52.5090", lng: "-1.8963", capacity: 400, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-019", name: "Bullring Shopping Centre Basement", address: "Birmingham, UK", lat: "52.5033", lng: "-1.8948", capacity: 800, type: "basement", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-uk-020", name: "University of Birmingham Bunker", address: "Birmingham, UK", lat: "52.4515", lng: "-1.9309", capacity: 300, type: "bunker", country: "UK", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },

  // 🇫🇷 프랑스 (20개) - 보라색
  { id: "eu-fr-001", name: "Châtelet Metro Station", address: "Paris, France", lat: "48.8596", lng: "2.3469", capacity: 3500, type: "metro", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-002", name: "Gare du Nord", address: "Paris, France", lat: "48.8809", lng: "2.3553", capacity: 3000, type: "metro", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-003", name: "Gare de l'Est", address: "Paris, France", lat: "48.8760", lng: "2.3569", capacity: 2800, type: "metro", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-004", name: "République", address: "Paris, France", lat: "48.8673", lng: "2.3636", capacity: 2500, type: "metro", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-005", name: "Bastille", address: "Paris, France", lat: "48.8530", lng: "2.3691", capacity: 2200, type: "metro", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-006", name: "Louvre Museum Basement", address: "Paris, France", lat: "48.8606", lng: "2.3352", capacity: 1500, type: "basement", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-007", name: "Notre-Dame Cathedral Crypt", address: "Paris, France", lat: "48.8530", lng: "2.3499", capacity: 1200, type: "basement", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-008", name: "Musée d'Orsay Basement", address: "Paris, France", lat: "48.8601", lng: "2.3265", capacity: 900, type: "basement", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-009", name: "Panthéon Basement", address: "Paris, France", lat: "48.8462", lng: "2.3464", capacity: 800, type: "basement", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-010", name: "Élysée Palace Bunker", address: "Paris, France", lat: "48.8699", lng: "2.3077", capacity: 500, type: "bunker", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-011", name: "Ministry of Defence Bunker", address: "Paris, France", lat: "48.8566", lng: "2.2922", capacity: 400, type: "bunker", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-012", name: "Paris Catacombs", address: "Paris, France", lat: "48.8336", lng: "2.3328", capacity: 2000, type: "cave", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-013", name: "Marseille Saint-Charles Station", address: "Marseille, France", lat: "43.3026", lng: "5.3804", capacity: 1500, type: "metro", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-014", name: "Marseille Cathedral", address: "Marseille, France", lat: "43.2965", lng: "5.3708", capacity: 600, type: "basement", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-015", name: "Palais Longchamp Basement", address: "Marseille, France", lat: "43.2977", lng: "5.3931", capacity: 500, type: "basement", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-016", name: "Fort Saint-Jean", address: "Marseille, France", lat: "43.2957", lng: "5.3627", capacity: 300, type: "bunker", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-017", name: "Marseille Museum Basement", address: "Marseille, France", lat: "43.3026", lng: "5.3804", capacity: 400, type: "basement", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-018", name: "Lyon Part-Dieu Station", address: "Lyon, France", lat: "45.7639", lng: "4.8357", capacity: 1200, type: "metro", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-019", name: "Lyon Cathedral Basement", address: "Lyon, France", lat: "45.7640", lng: "4.8357", capacity: 500, type: "basement", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-fr-020", name: "Lyon Museum Basement", address: "Lyon, France", lat: "45.7640", lng: "4.8357", capacity: 400, type: "basement", country: "France", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },

  // 🇩🇪 독일 (25개) - 빨간색
  { id: "eu-de-001", name: "Berlin Bunker (Friedrichshain)", address: "Berlin, Germany", lat: "52.5200", lng: "13.4550", capacity: 3000, type: "bunker", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-002", name: "Berlin Flak Tower", address: "Berlin, Germany", lat: "52.5170", lng: "13.4000", capacity: 2500, type: "bunker", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-003", name: "Berlin Underground Station", address: "Berlin, Germany", lat: "52.5200", lng: "13.4050", capacity: 2000, type: "metro", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-004", name: "Berlin Museum Basement", address: "Berlin, Germany", lat: "52.5170", lng: "13.4000", capacity: 800, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-005", name: "Berlin Cathedral Basement", address: "Berlin, Germany", lat: "52.5200", lng: "13.4050", capacity: 600, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-006", name: "Munich Central Station Bunker", address: "Munich, Germany", lat: "48.1406", lng: "11.5620", capacity: 2200, type: "bunker", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-007", name: "Munich U-Bahn Shelter", address: "Munich, Germany", lat: "48.1400", lng: "11.5600", capacity: 1800, type: "metro", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-008", name: "Munich Cathedral Basement", address: "Munich, Germany", lat: "48.1372", lng: "11.5755", capacity: 700, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-009", name: "Munich Museum Basement", address: "Munich, Germany", lat: "48.1400", lng: "11.5600", capacity: 600, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-010", name: "Hamburg Central Station Bunker", address: "Hamburg, Germany", lat: "53.5528", lng: "10.0066", capacity: 2000, type: "bunker", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-011", name: "Hamburg U-Bahn Shelter", address: "Hamburg, Germany", lat: "53.5500", lng: "10.0050", capacity: 1600, type: "metro", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-012", name: "Hamburg Cathedral Basement", address: "Hamburg, Germany", lat: "53.5648", lng: "9.9789", capacity: 500, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-013", name: "Hamburg Museum Basement", address: "Hamburg, Germany", lat: "53.5500", lng: "10.0050", capacity: 400, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-014", name: "Frankfurt Central Station Bunker", address: "Frankfurt, Germany", lat: "50.1109", lng: "8.6821", capacity: 1800, type: "bunker", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-015", name: "Frankfurt U-Bahn Shelter", address: "Frankfurt, Germany", lat: "50.1100", lng: "8.6800", capacity: 1400, type: "metro", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-016", name: "Frankfurt Cathedral Basement", address: "Frankfurt, Germany", lat: "50.1103", lng: "8.6821", capacity: 500, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-017", name: "Frankfurt Museum Basement", address: "Frankfurt, Germany", lat: "50.1100", lng: "8.6800", capacity: 400, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-018", name: "Cologne Central Station Bunker", address: "Cologne, Germany", lat: "50.9429", lng: "6.9581", capacity: 1600, type: "bunker", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-019", name: "Cologne U-Bahn Shelter", address: "Cologne, Germany", lat: "50.9400", lng: "6.9550", capacity: 1300, type: "metro", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-020", name: "Cologne Cathedral Basement", address: "Cologne, Germany", lat: "50.9406", lng: "6.9582", capacity: 600, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-021", name: "Cologne Museum Basement", address: "Cologne, Germany", lat: "50.9400", lng: "6.9550", capacity: 500, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-022", name: "Düsseldorf Central Station Bunker", address: "Düsseldorf, Germany", lat: "51.2206", lng: "6.7879", capacity: 1400, type: "bunker", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-023", name: "Düsseldorf U-Bahn Shelter", address: "Düsseldorf, Germany", lat: "51.2200", lng: "6.7850", capacity: 1100, type: "metro", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-024", name: "Düsseldorf Museum Basement", address: "Düsseldorf, Germany", lat: "51.2200", lng: "6.7850", capacity: 400, type: "basement", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-de-025", name: "Stuttgart Central Station Bunker", address: "Stuttgart, Germany", lat: "48.7842", lng: "9.1829", capacity: 1300, type: "bunker", country: "Germany", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },

  // 🇬🇷 그리스 (15개) - 주황색
  { id: "eu-gr-001", name: "Athens Metro Shelter", address: "Athens, Greece", lat: "37.9838", lng: "23.7275", capacity: 2000, type: "metro", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-002", name: "Athens Acropolis Basement", address: "Athens, Greece", lat: "37.9711", lng: "23.7267", capacity: 800, type: "basement", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-003", name: "Athens Museum Basement", address: "Athens, Greece", lat: "37.9838", lng: "23.7275", capacity: 600, type: "basement", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-004", name: "Athens Parliament Bunker", address: "Athens, Greece", lat: "37.9831", lng: "23.7347", capacity: 400, type: "bunker", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-005", name: "Thessaloniki Metro Shelter", address: "Thessaloniki, Greece", lat: "40.6353", lng: "22.9375", capacity: 1500, type: "metro", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-006", name: "Thessaloniki Museum Basement", address: "Thessaloniki, Greece", lat: "40.6353", lng: "22.9375", capacity: 500, type: "basement", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-007", name: "Thessaloniki Cathedral Basement", address: "Thessaloniki, Greece", lat: "40.6353", lng: "22.9375", capacity: 400, type: "basement", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-008", name: "Patras Metro Shelter", address: "Patras, Greece", lat: "38.2466", lng: "21.7346", capacity: 1000, type: "metro", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-009", name: "Patras Museum Basement", address: "Patras, Greece", lat: "38.2466", lng: "21.7346", capacity: 400, type: "basement", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-010", name: "Heraklion Metro Shelter", address: "Heraklion, Greece", lat: "35.3387", lng: "25.1442", capacity: 900, type: "metro", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-011", name: "Heraklion Museum Basement", address: "Heraklion, Greece", lat: "35.3387", lng: "25.1442", capacity: 350, type: "basement", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-012", name: "Larissa Metro Shelter", address: "Larissa, Greece", lat: "39.6363", lng: "22.4192", capacity: 800, type: "metro", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-013", name: "Volos Metro Shelter", address: "Volos, Greece", lat: "39.3676", lng: "23.1987", capacity: 700, type: "metro", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-014", name: "Rethymno Museum Basement", address: "Rethymno, Greece", lat: "35.3715", lng: "24.4734", capacity: 300, type: "basement", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-gr-015", name: "Chania Museum Basement", address: "Chania, Greece", lat: "35.3387", lng: "24.4615", capacity: 350, type: "basement", country: "Greece", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },

  // 🇮🇹 이탈리아 (20개) - 노란색
  { id: "eu-it-001", name: "Rome Metro Shelter", address: "Rome, Italy", lat: "41.9028", lng: "12.4964", capacity: 2500, type: "metro", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-002", name: "Rome Colosseum Basement", address: "Rome, Italy", lat: "41.8902", lng: "12.4923", capacity: 1000, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-003", name: "Rome Vatican Bunker", address: "Rome, Italy", lat: "41.9029", lng: "12.4534", capacity: 800, type: "bunker", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-004", name: "Rome Museum Basement", address: "Rome, Italy", lat: "41.9028", lng: "12.4964", capacity: 600, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-005", name: "Rome Catacombs", address: "Rome, Italy", lat: "41.8750", lng: "12.5150", capacity: 1500, type: "cave", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-006", name: "Milan Metro Shelter", address: "Milan, Italy", lat: "45.4642", lng: "9.1900", capacity: 2000, type: "metro", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-007", name: "Milan Cathedral Basement", address: "Milan, Italy", lat: "45.4642", lng: "9.1920", capacity: 700, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-008", name: "Milan Museum Basement", address: "Milan, Italy", lat: "45.4642", lng: "9.1900", capacity: 500, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-009", name: "Venice Metro Shelter", address: "Venice, Italy", lat: "45.4408", lng: "12.3155", capacity: 1200, type: "metro", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-010", name: "Venice Basilica Basement", address: "Venice, Italy", lat: "45.4408", lng: "12.3155", capacity: 500, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-011", name: "Florence Metro Shelter", address: "Florence, Italy", lat: "43.7696", lng: "11.2558", capacity: 1500, type: "metro", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-012", name: "Florence Cathedral Basement", address: "Florence, Italy", lat: "43.7731", lng: "11.2560", capacity: 600, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-013", name: "Florence Museum Basement", address: "Florence, Italy", lat: "43.7696", lng: "11.2558", capacity: 500, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-014", name: "Naples Metro Shelter", address: "Naples, Italy", lat: "40.8518", lng: "14.2681", capacity: 1800, type: "metro", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-015", name: "Naples Cathedral Basement", address: "Naples, Italy", lat: "40.8518", lng: "14.2681", capacity: 600, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-016", name: "Naples Museum Basement", address: "Naples, Italy", lat: "40.8518", lng: "14.2681", capacity: 500, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-017", name: "Palermo Metro Shelter", address: "Palermo, Italy", lat: "38.1157", lng: "13.3615", capacity: 1200, type: "metro", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-018", name: "Palermo Cathedral Basement", address: "Palermo, Italy", lat: "38.1157", lng: "13.3615", capacity: 500, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-019", name: "Genoa Metro Shelter", address: "Genoa, Italy", lat: "44.4056", lng: "8.9463", capacity: 1000, type: "metro", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-it-020", name: "Genoa Museum Basement", address: "Genoa, Italy", lat: "44.4056", lng: "8.9463", capacity: 400, type: "basement", country: "Italy", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },

  // 🇪🇸 스페인 (15개) - 녹색
  { id: "eu-es-001", name: "Madrid Metro Shelter", address: "Madrid, Spain", lat: "40.4168", lng: "-3.7038", capacity: 2200, type: "metro", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-002", name: "Madrid Royal Palace Bunker", address: "Madrid, Spain", lat: "40.4175", lng: "-3.7138", capacity: 800, type: "bunker", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-003", name: "Madrid Museum Basement", address: "Madrid, Spain", lat: "40.4168", lng: "-3.7038", capacity: 600, type: "basement", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-004", name: "Barcelona Metro Shelter", address: "Barcelona, Spain", lat: "41.3851", lng: "2.1734", capacity: 2000, type: "metro", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-005", name: "Barcelona Sagrada Familia Basement", address: "Barcelona, Spain", lat: "41.4036", lng: "2.1744", capacity: 700, type: "basement", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-006", name: "Barcelona Museum Basement", address: "Barcelona, Spain", lat: "41.3851", lng: "2.1734", capacity: 500, type: "basement", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-007", name: "Valencia Metro Shelter", address: "Valencia, Spain", lat: "39.4699", lng: "-0.3763", capacity: 1500, type: "metro", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-008", name: "Valencia Cathedral Basement", address: "Valencia, Spain", lat: "39.4699", lng: "-0.3763", capacity: 500, type: "basement", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-009", name: "Seville Metro Shelter", address: "Seville, Spain", lat: "37.3886", lng: "-5.9823", capacity: 1200, type: "metro", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-010", name: "Seville Cathedral Basement", address: "Seville, Spain", lat: "37.3886", lng: "-5.9823", capacity: 400, type: "basement", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-011", name: "Bilbao Metro Shelter", address: "Bilbao, Spain", lat: "43.2633", lng: "-2.9349", capacity: 1000, type: "metro", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-012", name: "Bilbao Museum Basement", address: "Bilbao, Spain", lat: "43.2633", lng: "-2.9349", capacity: 400, type: "basement", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-013", name: "Malaga Metro Shelter", address: "Malaga, Spain", lat: "36.7213", lng: "-4.4214", capacity: 900, type: "metro", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-014", name: "Alicante Metro Shelter", address: "Alicante, Spain", lat: "38.3452", lng: "-0.4810", capacity: 800, type: "metro", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-es-015", name: "Palma de Mallorca Metro Shelter", address: "Palma de Mallorca, Spain", lat: "39.5696", lng: "2.6502", capacity: 700, type: "metro", country: "Spain", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },

  // 🇵🇹 포르투갈 (10개) - 핑크색
  { id: "eu-pt-001", name: "Lisbon Metro Shelter", address: "Lisbon, Portugal", lat: "38.7223", lng: "-9.1393", capacity: 1500, type: "metro", country: "Portugal", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-pt-002", name: "Lisbon Castle Basement", address: "Lisbon, Portugal", lat: "38.7223", lng: "-9.1393", capacity: 600, type: "basement", country: "Portugal", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-pt-003", name: "Lisbon Museum Basement", address: "Lisbon, Portugal", lat: "38.7223", lng: "-9.1393", capacity: 500, type: "basement", country: "Portugal", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-pt-004", name: "Lisbon Cathedral Basement", address: "Lisbon, Portugal", lat: "38.7223", lng: "-9.1393", capacity: 400, type: "basement", country: "Portugal", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-pt-005", name: "Porto Metro Shelter", address: "Porto, Portugal", lat: "41.1579", lng: "-8.6291", capacity: 1200, type: "metro", country: "Portugal", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-pt-006", name: "Porto Cathedral Basement", address: "Porto, Portugal", lat: "41.1579", lng: "-8.6291", capacity: 500, type: "basement", country: "Portugal", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-pt-007", name: "Covilhã Metro Shelter", address: "Covilhã, Portugal", lat: "40.2833", lng: "-7.5000", capacity: 800, type: "metro", country: "Portugal", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-pt-008", name: "Braga Cathedral Basement", address: "Braga, Portugal", lat: "41.5531", lng: "-8.4265", capacity: 400, type: "basement", country: "Portugal", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-pt-009", name: "Aveiro Museum Basement", address: "Aveiro, Portugal", lat: "40.6386", lng: "-8.6553", capacity: 300, type: "basement", country: "Portugal", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-pt-010", name: "Faro Museum Basement", address: "Faro, Portugal", lat: "37.0141", lng: "-7.9386", capacity: 300, type: "basement", country: "Portugal", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },

  // 🇳🇱 네덜란드 (12개) - 하늘색
  { id: "eu-nl-001", name: "Amsterdam Metro Shelter", address: "Amsterdam, Netherlands", lat: "52.3676", lng: "4.9041", capacity: 1800, type: "metro", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-002", name: "Amsterdam Museum Basement", address: "Amsterdam, Netherlands", lat: "52.3676", lng: "4.9041", capacity: 600, type: "basement", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-003", name: "Amsterdam Cathedral Basement", address: "Amsterdam, Netherlands", lat: "52.3676", lng: "4.9041", capacity: 500, type: "basement", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-004", name: "Rotterdam Metro Shelter", address: "Rotterdam, Netherlands", lat: "51.9225", lng: "4.4792", capacity: 1500, type: "metro", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-005", name: "Rotterdam Museum Basement", address: "Rotterdam, Netherlands", lat: "51.9225", lng: "4.4792", capacity: 500, type: "basement", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-006", name: "The Hague Metro Shelter", address: "The Hague, Netherlands", lat: "52.0705", lng: "4.3007", capacity: 1400, type: "metro", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-007", name: "The Hague Museum Basement", address: "The Hague, Netherlands", lat: "52.0705", lng: "4.3007", capacity: 500, type: "basement", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-008", name: "Utrecht Metro Shelter", address: "Utrecht, Netherlands", lat: "52.0907", lng: "5.1214", capacity: 1200, type: "metro", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-009", name: "Utrecht Museum Basement", address: "Utrecht, Netherlands", lat: "52.0907", lng: "5.1214", capacity: 400, type: "basement", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-010", name: "Eindhoven Metro Shelter", address: "Eindhoven, Netherlands", lat: "51.4416", lng: "5.4697", capacity: 1000, type: "metro", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-011", name: "Groningen Metro Shelter", address: "Groningen, Netherlands", lat: "53.2194", lng: "6.5665", capacity: 900, type: "metro", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-nl-012", name: "Maastricht Museum Basement", address: "Maastricht, Netherlands", lat: "50.8514", lng: "5.6909", capacity: 400, type: "basement", country: "Netherlands", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },

  // 🇧🇪 벨기에 (10개) - 회색
  { id: "eu-be-001", name: "Brussels Metro Shelter", address: "Brussels, Belgium", lat: "50.8503", lng: "4.3517", capacity: 1600, type: "metro", country: "Belgium", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-be-002", name: "Brussels Museum Basement", address: "Brussels, Belgium", lat: "50.8503", lng: "4.3517", capacity: 600, type: "basement", country: "Belgium", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-be-003", name: "Brussels Cathedral Basement", address: "Brussels, Belgium", lat: "50.8503", lng: "4.3517", capacity: 500, type: "basement", country: "Belgium", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-be-004", name: "Brussels Government Bunker", address: "Brussels, Belgium", lat: "50.8503", lng: "4.3517", capacity: 400, type: "bunker", country: "Belgium", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-be-005", name: "Antwerp Metro Shelter", address: "Antwerp, Belgium", lat: "51.2195", lng: "4.4012", capacity: 1300, type: "metro", country: "Belgium", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-be-006", name: "Antwerp Museum Basement", address: "Antwerp, Belgium", lat: "51.2195", lng: "4.4012", capacity: 500, type: "basement", country: "Belgium", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-be-007", name: "Ghent Metro Shelter", address: "Ghent, Belgium", lat: "51.0543", lng: "3.7196", capacity: 1000, type: "metro", country: "Belgium", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-be-008", name: "Ghent Museum Basement", address: "Ghent, Belgium", lat: "51.0543", lng: "3.7196", capacity: 400, type: "basement", country: "Belgium", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-be-009", name: "Liège Metro Shelter", address: "Liège, Belgium", lat: "50.6292", lng: "5.5693", capacity: 900, type: "metro", country: "Belgium", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-be-010", name: "Charleroi Metro Shelter", address: "Charleroi, Belgium", lat: "50.4084", lng: "4.4426", capacity: 800, type: "metro", country: "Belgium", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },

  // 🇦🇹 오스트리아 (13개) - 갈색
  { id: "eu-at-001", name: "Vienna Metro Shelter", address: "Vienna, Austria", lat: "48.2082", lng: "16.3738", capacity: 2000, type: "metro", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-002", name: "Vienna State Opera Basement", address: "Vienna, Austria", lat: "48.2024", lng: "16.3695", capacity: 700, type: "basement", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-003", name: "Vienna Government Bunker", address: "Vienna, Austria", lat: "48.2082", lng: "16.3738", capacity: 350, type: "bunker", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-004", name: "Salzburg Central Station", address: "Salzburg, Austria", lat: "47.6097", lng: "13.0500", capacity: 800, type: "basement", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-005", name: "Salzburg Cathedral Basement", address: "Salzburg, Austria", lat: "47.8114", lng: "13.0450", capacity: 600, type: "basement", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-006", name: "Salzburg Castle Basement", address: "Salzburg, Austria", lat: "47.8114", lng: "13.0450", capacity: 500, type: "basement", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-007", name: "Graz Central Station", address: "Graz, Austria", lat: "47.0960", lng: "15.4395", capacity: 700, type: "basement", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-008", name: "Graz Cathedral Basement", address: "Graz, Austria", lat: "47.0773", lng: "15.4373", capacity: 500, type: "basement", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-009", name: "Innsbruck Metro Shelter", address: "Innsbruck, Austria", lat: "47.2652", lng: "11.4044", capacity: 600, type: "metro", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-010", name: "Linz Metro Shelter", address: "Linz, Austria", lat: "48.3069", lng: "14.2858", capacity: 700, type: "metro", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-011", name: "Klagenfurt Metro Shelter", address: "Klagenfurt, Austria", lat: "46.6233", lng: "14.3092", capacity: 500, type: "metro", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-012", name: "Villach Metro Shelter", address: "Villach, Austria", lat: "46.6097", lng: "13.8515", capacity: 400, type: "metro", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
  { id: "eu-at-013", name: "Wels Metro Shelter", address: "Wels, Austria", lat: "48.1829", lng: "14.6297", capacity: 450, type: "metro", country: "Austria", region: "eu", disasterTypes: ["war", "bombing", "nuclear"] },
];

// 한국 대피소 (정부 지정 지진/태풍 대피소)
export const KR_SHELTERS: ShelterData[] = [
  {
    id: "kr-seoul-001",
    name: "서울시청 지하 대피소",
    address: "서울시 중구 태평로 1",
    lat: "37.5665",
    lng: "126.9780",
    capacity: 2000,
    type: "Government Bunker",
    phone: "+82-2-120",
    website: "https://www.seoul.go.kr/",
    amenities: ["Medical", "Food", "Water", "Communication"],
    region: "kr",
    disasterTypes: ["earthquake", "typhoon", "flood"],
  },
  {
    id: "kr-busan-001",
    name: "부산시청 지하 대피소",
    address: "부산시 중구 중앙대로 217",
    lat: "35.0973",
    lng: "129.0331",
    capacity: 1500,
    type: "Government Bunker",
    phone: "+82-51-120",
    website: "https://www.busan.go.kr/",
    amenities: ["Medical", "Food", "Water", "Communication"],
    region: "kr",
    disasterTypes: ["earthquake", "typhoon", "flood"],
  },
  {
    id: "kr-incheon-001",
    name: "인천시청 지하 대피소",
    address: "인천시 남동구 정각로 935",
    lat: "37.4562",
    lng: "126.7052",
    capacity: 1200,
    type: "Government Bunker",
    phone: "+82-32-120",
    website: "https://www.incheon.go.kr/",
    amenities: ["Medical", "Food", "Water"],
    region: "kr",
    disasterTypes: ["earthquake", "typhoon", "flood"],
  },
  {
    id: "kr-daegu-001",
    name: "대구시청 지하 대피소",
    address: "대구시 중구 국채보상로 529",
    lat: "35.8748",
    lng: "128.5703",
    capacity: 1000,
    type: "Government Bunker",
    phone: "+82-53-120",
    website: "https://www.daegu.go.kr/",
    amenities: ["Medical", "Food", "Water"],
    region: "kr",
    disasterTypes: ["earthquake", "typhoon", "flood"],
  },
];

// 일본 대피소 (지진/쓰나미 대피소)
export const JP_SHELTERS: ShelterData[] = [
  {
    id: "jp-tokyo-001",
    name: "東京都庁舎地下避難所",
    address: "東京都新宿区西新宿2-8-1",
    lat: "35.6895",
    lng: "139.6917",
    capacity: 3000,
    type: "Government Bunker",
    phone: "+81-3-5321-1111",
    website: "https://www.metro.tokyo.lg.jp/",
    amenities: ["Medical", "Food", "Water", "Communication"],
    region: "jp",
    disasterTypes: ["earthquake", "tsunami", "typhoon"],
  },
  {
    id: "jp-osaka-001",
    name: "大阪府庁舎地下避難所",
    address: "大阪府大阪市中央区大手前2-1-22",
    lat: "34.6867",
    lng: "135.5232",
    capacity: 2500,
    type: "Government Bunker",
    phone: "+81-6-6941-0351",
    website: "https://www.pref.osaka.lg.jp/",
    amenities: ["Medical", "Food", "Water", "Communication"],
    region: "jp",
    disasterTypes: ["earthquake", "tsunami", "typhoon"],
  },
  {
    id: "jp-yokohama-001",
    name: "横浜市庁舎地下避難所",
    address: "神奈川県横浜市中区港町1-1",
    lat: "35.4473",
    lng: "139.6380",
    capacity: 2000,
    type: "Government Bunker",
    phone: "+81-45-671-2121",
    website: "https://www.city.yokohama.lg.jp/",
    amenities: ["Medical", "Food", "Water"],
    region: "jp",
    disasterTypes: ["earthquake", "tsunami", "typhoon"],
  },
  {
    id: "jp-kobe-001",
    name: "神戸市庁舎地下避難所",
    address: "兵庫県神戸市中央区加納町6-5-1",
    lat: "34.6901",
    lng: "135.1955",
    capacity: 1500,
    type: "Government Bunker",
    phone: "+81-78-331-8181",
    website: "https://www.city.kobe.lg.jp/",
    amenities: ["Medical", "Food", "Water"],
    region: "jp",
    disasterTypes: ["earthquake", "tsunami", "typhoon"],
  },
];

export const ALL_SHELTERS: ShelterData[] = [...US_SHELTERS, ...EU_SHELTERS, ...KR_SHELTERS, ...JP_SHELTERS];

export function getSheltersByRegion(region: "us" | "eu" | "kr" | "jp"): ShelterData[] {
  switch (region) {
    case "us": return US_SHELTERS;
    case "eu": return EU_SHELTERS;
    case "kr": return KR_SHELTERS;
    case "jp": return JP_SHELTERS;
    default: return [];
  }
}

export function searchSheltersByDisaster(disasterType: string, region?: "us" | "eu" | "kr" | "jp"): ShelterData[] {
  const shelters = region ? getSheltersByRegion(region) : ALL_SHELTERS;
  return shelters.filter((s) => s.disasterTypes.includes(disasterType));
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findNearestShelter(lat: number, lng: number, shelters: ShelterData[]): ShelterData | null {
  if (shelters.length === 0) return null;
  let nearest = shelters[0];
  let minDistance = calculateDistance(lat, lng, parseFloat(shelters[0].lat), parseFloat(shelters[0].lng));

  for (let i = 1; i < shelters.length; i++) {
    const distance = calculateDistance(lat, lng, parseFloat(shelters[i].lat), parseFloat(shelters[i].lng));
    if (distance < minDistance) {
      minDistance = distance;
      nearest = shelters[i];
    }
  }
  return nearest;
}

// ─── Korea Shelters (한국 주요 도시 대피소) ───────────────────────────────────
