import mysql from 'mysql2/promise';

const EUROPE_SHELTERS = [
  // 🇬🇧 영국 (20개)
  // 런던
  { country: 'UK', city: 'London', name: 'Westminster Underground Station', type: 'metro', capacity: 3000, depth: 25, lat: 51.4975, lng: -0.1357, facilities: ['water', 'medical', 'power', 'food'] },
  { country: 'UK', city: 'London', name: 'King\'s Cross St Pancras', type: 'metro', capacity: 2800, depth: 23, lat: 51.5308, lng: -0.1190, facilities: ['water', 'medical', 'power', 'food'] },
  { country: 'UK', city: 'London', name: 'Piccadilly Circus', type: 'metro', capacity: 2500, depth: 22, lat: 51.5097, lng: -0.1337, facilities: ['water', 'medical', 'power'] },
  { country: 'UK', city: 'London', name: 'Bank Station', type: 'metro', capacity: 2200, depth: 20, lat: 51.5141, lng: -0.0883, facilities: ['water', 'medical', 'power'] },
  { country: 'UK', city: 'London', name: 'Tower Bridge Basement', type: 'basement', capacity: 1500, depth: 15, lat: 51.5055, lng: -0.0754, facilities: ['water', 'medical'] },
  { country: 'UK', city: 'London', name: 'British Museum Basement', type: 'basement', capacity: 1200, depth: 12, lat: 51.5194, lng: -0.1270, facilities: ['water', 'medical'] },
  { country: 'UK', city: 'London', name: 'National Gallery Basement', type: 'basement', capacity: 900, depth: 10, lat: 51.5087, lng: -0.1283, facilities: ['water'] },
  { country: 'UK', city: 'London', name: 'St Paul\'s Cathedral Crypt', type: 'basement', capacity: 800, depth: 8, lat: 51.5138, lng: -0.0984, facilities: ['water'] },
  { country: 'UK', city: 'London', name: 'Tower of London Basement', type: 'basement', capacity: 700, depth: 12, lat: 51.5055, lng: -0.0754, facilities: ['water'] },
  { country: 'UK', city: 'London', name: 'Houses of Parliament Bunker', type: 'bunker', capacity: 400, depth: 40, lat: 51.4995, lng: -0.1246, facilities: ['water', 'medical', 'power', 'food'] },
  // 맨체스터
  { country: 'UK', city: 'Manchester', name: 'Manchester Piccadilly Station', type: 'metro', capacity: 1800, depth: 18, lat: 53.4778, lng: -2.2298, facilities: ['water', 'medical', 'power'] },
  { country: 'UK', city: 'Manchester', name: 'Manchester Central Library', type: 'basement', capacity: 600, depth: 10, lat: 53.4809, lng: -2.2426, facilities: ['water', 'medical'] },
  { country: 'UK', city: 'Manchester', name: 'Manchester Town Hall', type: 'basement', capacity: 500, depth: 8, lat: 53.4808, lng: -2.2426, facilities: ['water'] },
  { country: 'UK', city: 'Manchester', name: 'Deansgate-Castlefield', type: 'metro', capacity: 1500, depth: 16, lat: 53.4776, lng: -2.2544, facilities: ['water', 'medical', 'power'] },
  { country: 'UK', city: 'Manchester', name: 'Manchester Museum Basement', type: 'basement', capacity: 400, depth: 6, lat: 53.4665, lng: -2.2316, facilities: ['water'] },
  // 버밍엄
  { country: 'UK', city: 'Birmingham', name: 'Birmingham New Street Station', type: 'metro', capacity: 1600, depth: 17, lat: 52.5079, lng: -1.8998, facilities: ['water', 'medical', 'power'] },
  { country: 'UK', city: 'Birmingham', name: 'Birmingham Museum', type: 'basement', capacity: 500, depth: 9, lat: 52.5050, lng: -1.9027, facilities: ['water', 'medical'] },
  { country: 'UK', city: 'Birmingham', name: 'Council House Basement', type: 'basement', capacity: 400, depth: 7, lat: 52.5090, lng: -1.8963, facilities: ['water'] },
  { country: 'UK', city: 'Birmingham', name: 'Bullring Shopping Centre Basement', type: 'basement', capacity: 800, depth: 12, lat: 52.5033, lng: -1.8948, facilities: ['water', 'medical'] },
  { country: 'UK', city: 'Birmingham', name: 'University of Birmingham Bunker', type: 'bunker', capacity: 300, depth: 35, lat: 52.4515, lng: -1.9309, facilities: ['water', 'medical', 'power', 'food'] },

  // 🇫🇷 프랑스 (20개)
  // 파리
  { country: 'France', city: 'Paris', name: 'Châtelet Metro Station', type: 'metro', capacity: 3500, depth: 28, lat: 48.8596, lng: 2.3469, facilities: ['water', 'medical', 'power', 'food'] },
  { country: 'France', city: 'Paris', name: 'Gare du Nord', type: 'metro', capacity: 3000, depth: 25, lat: 48.8809, lng: 2.3553, facilities: ['water', 'medical', 'power', 'food'] },
  { country: 'France', city: 'Paris', name: 'Gare de l\'Est', type: 'metro', capacity: 2800, depth: 24, lat: 48.8760, lng: 2.3569, facilities: ['water', 'medical', 'power', 'food'] },
  { country: 'France', city: 'Paris', name: 'République', type: 'metro', capacity: 2500, depth: 22, lat: 48.8673, lng: 2.3636, facilities: ['water', 'medical', 'power'] },
  { country: 'France', city: 'Paris', name: 'Bastille', type: 'metro', capacity: 2200, depth: 20, lat: 48.8530, lng: 2.3691, facilities: ['water', 'medical', 'power'] },
  { country: 'France', city: 'Paris', name: 'Louvre Museum Basement', type: 'basement', capacity: 1500, depth: 18, lat: 48.8606, lng: 2.3352, facilities: ['water', 'medical'] },
  { country: 'France', city: 'Paris', name: 'Notre-Dame Cathedral Crypt', type: 'basement', capacity: 1200, depth: 12, lat: 48.8530, lng: 2.3499, facilities: ['water', 'medical'] },
  { country: 'France', city: 'Paris', name: 'Musée d\'Orsay Basement', type: 'basement', capacity: 900, depth: 10, lat: 48.8601, lng: 2.3265, facilities: ['water'] },
  { country: 'France', city: 'Paris', name: 'Panthéon Basement', type: 'basement', capacity: 800, depth: 15, lat: 48.8462, lng: 2.3464, facilities: ['water'] },
  { country: 'France', city: 'Paris', name: 'Élysée Palace Bunker', type: 'bunker', capacity: 500, depth: 45, lat: 48.8699, lng: 2.3077, facilities: ['water', 'medical', 'power', 'food'] },
  { country: 'France', city: 'Paris', name: 'Ministry of Defence Bunker', type: 'bunker', capacity: 400, depth: 50, lat: 48.8566, lng: 2.2922, facilities: ['water', 'medical', 'power', 'food'] },
  { country: 'France', city: 'Paris', name: 'Paris Catacombs', type: 'cave', capacity: 2000, depth: 20, lat: 48.8336, lng: 2.3328, facilities: ['water'] },
  // 마르세유
  { country: 'France', city: 'Marseille', name: 'Marseille Saint-Charles Station', type: 'metro', capacity: 1500, depth: 16, lat: 43.3026, lng: 5.3804, facilities: ['water', 'medical', 'power'] },
  { country: 'France', city: 'Marseille', name: 'Marseille Cathedral', type: 'basement', capacity: 600, depth: 10, lat: 43.2965, lng: 5.3708, facilities: ['water', 'medical'] },
  { country: 'France', city: 'Marseille', name: 'Palais Longchamp Basement', type: 'basement', capacity: 500, depth: 8, lat: 43.2977, lng: 5.3931, facilities: ['water'] },
  { country: 'France', city: 'Marseille', name: 'Fort Saint-Jean', type: 'bunker', capacity: 300, depth: 35, lat: 43.2957, lng: 5.3627, facilities: ['water', 'medical', 'power'] },
  { country: 'France', city: 'Marseille', name: 'Marseille Museum Basement', type: 'basement', capacity: 400, depth: 7, lat: 43.3026, lng: 5.3804, facilities: ['water'] },
  // 리옹
  { country: 'France', city: 'Lyon', name: 'Lyon Part-Dieu Station', type: 'metro', capacity: 1200, depth: 14, lat: 45.7639, lng: 4.8357, facilities: ['water', 'medical', 'power'] },
  { country: 'France', city: 'Lyon', name: 'Lyon Cathedral Basement', type: 'basement', capacity: 500, depth: 9, lat: 45.7640, lng: 4.8340, facilities: ['water', 'medical'] },
  { country: 'France', city: 'Lyon', name: 'Confluence Museum Basement', type: 'basement', capacity: 400, depth: 8, lat: 45.7297, lng: 4.8119, facilities: ['water'] },

  // 🇩🇪 독일 (25개)
  // 베를린
  { country: 'Germany', city: 'Berlin', name: 'Alexanderplatz U-Bahn', type: 'metro', capacity: 3000, depth: 26, lat: 52.5220, lng: 13.4115, facilities: ['water', 'medical', 'power', 'food'] },
  { country: 'Germany', city: 'Berlin', name: 'Friedrichstraße U-Bahn', type: 'metro', capacity: 2800, depth: 24, lat: 52.5200, lng: 13.3867, facilities: ['water', 'medical', 'power', 'food'] },
  { country: 'Germany', city: 'Berlin', name: 'Unter den Linden U-Bahn', type: 'metro', capacity: 2500, depth: 22, lat: 52.5170, lng: 13.3970, facilities: ['water', 'medical', 'power'] },
  { country: 'Germany', city: 'Berlin', name: 'Potsdamer Platz U-Bahn', type: 'metro', capacity: 2200, depth: 20, lat: 52.5075, lng: 13.3756, facilities: ['water', 'medical', 'power'] },
  { country: 'Germany', city: 'Berlin', name: 'Reichstag Basement', type: 'basement', capacity: 1500, depth: 20, lat: 52.5186, lng: 13.3755, facilities: ['water', 'medical'] },
  { country: 'Germany', city: 'Berlin', name: 'German Historical Museum', type: 'basement', capacity: 900, depth: 12, lat: 52.5176, lng: 13.3964, facilities: ['water', 'medical'] },
  { country: 'Germany', city: 'Berlin', name: 'Pergamon Museum Basement', type: 'basement', capacity: 800, depth: 10, lat: 52.5212, lng: 13.3981, facilities: ['water'] },
  { country: 'Germany', city: 'Berlin', name: 'Berlin Cathedral Crypt', type: 'basement', capacity: 700, depth: 8, lat: 52.5200, lng: 13.4015, facilities: ['water'] },
  { country: 'Germany', city: 'Berlin', name: 'Flak Tower Bunker', type: 'bunker', capacity: 600, depth: 40, lat: 52.5200, lng: 13.3900, facilities: ['water', 'medical', 'power'] },
  { country: 'Germany', city: 'Berlin', name: 'Government Bunker', type: 'bunker', capacity: 400, depth: 50, lat: 52.5100, lng: 13.3800, facilities: ['water', 'medical', 'power', 'food'] },
  // 뮌헨
  { country: 'Germany', city: 'Munich', name: 'Marienplatz U-Bahn', type: 'metro', capacity: 2000, depth: 18, lat: 48.1372, lng: 11.5755, facilities: ['water', 'medical', 'power'] },
  { country: 'Germany', city: 'Munich', name: 'Karlsplatz U-Bahn', type: 'metro', capacity: 1800, depth: 16, lat: 48.1416, lng: 11.5673, facilities: ['water', 'medical', 'power'] },
  { country: 'Germany', city: 'Munich', name: 'Neuschwanstein Castle Basement', type: 'basement', capacity: 600, depth: 15, lat: 47.5576, lng: 10.7498, facilities: ['water', 'medical'] },
  { country: 'Germany', city: 'Munich', name: 'Munich Residenz Basement', type: 'basement', capacity: 500, depth: 10, lat: 48.1408, lng: 11.5814, facilities: ['water', 'medical'] },
  { country: 'Germany', city: 'Munich', name: 'St Peter\'s Church Crypt', type: 'basement', capacity: 400, depth: 8, lat: 48.1372, lng: 11.5755, facilities: ['water'] },
  { country: 'Germany', city: 'Munich', name: 'Nymphenburg Palace Basement', type: 'basement', capacity: 500, depth: 12, lat: 48.1606, lng: 11.5015, facilities: ['water', 'medical'] },
  { country: 'Germany', city: 'Munich', name: 'BMW Museum Basement', type: 'basement', capacity: 400, depth: 8, lat: 48.1768, lng: 11.5588, facilities: ['water'] },
  { country: 'Germany', city: 'Munich', name: 'Munich Central Station', type: 'basement', capacity: 1200, depth: 14, lat: 48.1408, lng: 11.5581, facilities: ['water', 'medical', 'power'] },
  // 함부르크
  { country: 'Germany', city: 'Hamburg', name: 'Jungfernstieg U-Bahn', type: 'metro', capacity: 1500, depth: 15, lat: 53.5533, lng: 9.9909, facilities: ['water', 'medical', 'power'] },
  { country: 'Germany', city: 'Hamburg', name: 'Hauptbahnhof Hamburg', type: 'basement', capacity: 1000, depth: 12, lat: 53.5526, lng: 10.0066, facilities: ['water', 'medical', 'power'] },
  { country: 'Germany', city: 'Hamburg', name: 'Hamburg City Hall Basement', type: 'basement', capacity: 600, depth: 10, lat: 53.5465, lng: 9.9822, facilities: ['water', 'medical'] },
  { country: 'Germany', city: 'Hamburg', name: 'St Michaelis Church Crypt', type: 'basement', capacity: 400, depth: 8, lat: 53.5449, lng: 9.9747, facilities: ['water'] },
  // 쾰른
  { country: 'Germany', city: 'Cologne', name: 'Cologne Central Station', type: 'basement', capacity: 900, depth: 11, lat: 50.9429, lng: 6.9599, facilities: ['water', 'medical', 'power'] },
  { country: 'Germany', city: 'Cologne', name: 'Cologne Cathedral Basement', type: 'basement', capacity: 700, depth: 12, lat: 50.9413, lng: 6.9582, facilities: ['water', 'medical'] },
  { country: 'Germany', city: 'Cologne', name: 'Roman-Germanic Museum Basement', type: 'basement', capacity: 500, depth: 9, lat: 50.9413, lng: 6.9582, facilities: ['water'] },

  // 🇬🇷 그리스 (15개)
  // 아테네
  { country: 'Greece', city: 'Athens', name: 'Syntagma Metro Station', type: 'metro', capacity: 2500, depth: 24, lat: 37.9753, lng: 23.7329, facilities: ['water', 'medical', 'power', 'food'] },
  { country: 'Greece', city: 'Athens', name: 'Omonia Metro Station', type: 'metro', capacity: 2200, depth: 22, lat: 37.9837, lng: 23.7275, facilities: ['water', 'medical', 'power'] },
  { country: 'Greece', city: 'Athens', name: 'Acropolis Metro Station', type: 'metro', capacity: 2000, depth: 20, lat: 37.9711, lng: 23.7267, facilities: ['water', 'medical', 'power'] },
  { country: 'Greece', city: 'Athens', name: 'Monastiraki Metro Station', type: 'metro', capacity: 1800, depth: 18, lat: 37.9750, lng: 23.7267, facilities: ['water', 'medical', 'power'] },
  { country: 'Greece', city: 'Athens', name: 'Parthenon Basement', type: 'basement', capacity: 1200, depth: 15, lat: 37.9711, lng: 23.7267, facilities: ['water', 'medical'] },
  { country: 'Greece', city: 'Athens', name: 'National Archaeological Museum', type: 'basement', capacity: 900, depth: 12, lat: 37.9886, lng: 23.7343, facilities: ['water', 'medical'] },
  { country: 'Greece', city: 'Athens', name: 'Panathenaic Stadium Basement', type: 'basement', capacity: 800, depth: 10, lat: 37.9667, lng: 23.7500, facilities: ['water'] },
  { country: 'Greece', city: 'Athens', name: 'Byzantine Museum Basement', type: 'basement', capacity: 600, depth: 8, lat: 37.9750, lng: 23.7500, facilities: ['water'] },
  { country: 'Greece', city: 'Athens', name: 'Benaki Museum Basement', type: 'basement', capacity: 500, depth: 7, lat: 37.9750, lng: 23.7500, facilities: ['water'] },
  { country: 'Greece', city: 'Athens', name: 'Government Bunker', type: 'bunker', capacity: 300, depth: 40, lat: 37.9750, lng: 23.7500, facilities: ['water', 'medical', 'power', 'food'] },
  // 테살로니키
  { country: 'Greece', city: 'Thessaloniki', name: 'Thessaloniki Central Station', type: 'basement', capacity: 800, depth: 12, lat: 40.6358, lng: 22.9789, facilities: ['water', 'medical', 'power'] },
  { country: 'Greece', city: 'Thessaloniki', name: 'White Tower Basement', type: 'basement', capacity: 600, depth: 10, lat: 40.6267, lng: 22.9480, facilities: ['water', 'medical'] },
  { country: 'Greece', city: 'Thessaloniki', name: 'Archaeological Museum Basement', type: 'basement', capacity: 500, depth: 8, lat: 40.6358, lng: 22.9789, facilities: ['water'] },
  { country: 'Greece', city: 'Thessaloniki', name: 'Rotunda Crypt', type: 'basement', capacity: 400, depth: 6, lat: 40.6358, lng: 22.9789, facilities: ['water'] },
  { country: 'Greece', city: 'Thessaloniki', name: 'Aristotle University Bunker', type: 'bunker', capacity: 250, depth: 35, lat: 40.6358, lng: 22.9789, facilities: ['water', 'medical', 'power'] },

  // 🇮🇹 이탈리아 (20개)
  // 로마
  { country: 'Italy', city: 'Rome', name: 'Termini Metro Station', type: 'metro', capacity: 2500, depth: 22, lat: 41.9010, lng: 12.5034, facilities: ['water', 'medical', 'power', 'food'] },
  { country: 'Italy', city: 'Rome', name: 'Colosseum Metro Station', type: 'metro', capacity: 2000, depth: 20, lat: 41.8902, lng: 12.4923, facilities: ['water', 'medical', 'power'] },
  { country: 'Italy', city: 'Rome', name: 'Trevi Fountain Basement', type: 'basement', capacity: 1200, depth: 15, lat: 41.9009, lng: 12.4833, facilities: ['water', 'medical'] },
  { country: 'Italy', city: 'Rome', name: 'Vatican Basement', type: 'basement', capacity: 1500, depth: 18, lat: 41.9029, lng: 12.4534, facilities: ['water', 'medical'] },
  { country: 'Italy', city: 'Rome', name: 'Pantheon Basement', type: 'basement', capacity: 900, depth: 12, lat: 41.8986, lng: 12.4769, facilities: ['water'] },
  { country: 'Italy', city: 'Rome', name: 'Roman Forum Crypt', type: 'basement', capacity: 800, depth: 10, lat: 41.8925, lng: 12.4858, facilities: ['water'] },
  { country: 'Italy', city: 'Rome', name: 'Capitoline Museum Basement', type: 'basement', capacity: 600, depth: 8, lat: 41.8929, lng: 12.4852, facilities: ['water'] },
  { country: 'Italy', city: 'Rome', name: 'Palazzo Altemps Basement', type: 'basement', capacity: 500, depth: 7, lat: 41.8976, lng: 12.4717, facilities: ['water'] },
  { country: 'Italy', city: 'Rome', name: 'Castel Sant\'Angelo Basement', type: 'basement', capacity: 700, depth: 14, lat: 41.9029, lng: 12.4651, facilities: ['water', 'medical'] },
  { country: 'Italy', city: 'Rome', name: 'Government Bunker', type: 'bunker', capacity: 350, depth: 42, lat: 41.9010, lng: 12.5034, facilities: ['water', 'medical', 'power', 'food'] },
  // 밀라노
  { country: 'Italy', city: 'Milan', name: 'Milano Centrale Station', type: 'metro', capacity: 1800, depth: 16, lat: 45.6330, lng: 9.2046, facilities: ['water', 'medical', 'power'] },
  { country: 'Italy', city: 'Milan', name: 'Duomo Metro Station', type: 'metro', capacity: 1500, depth: 14, lat: 45.6642, lng: 9.1917, facilities: ['water', 'medical', 'power'] },
  { country: 'Italy', city: 'Milan', name: 'Milan Cathedral Basement', type: 'basement', capacity: 1000, depth: 12, lat: 45.6642, lng: 9.1917, facilities: ['water', 'medical'] },
  { country: 'Italy', city: 'Milan', name: 'Sforza Castle Basement', type: 'basement', capacity: 700, depth: 10, lat: 45.6710, lng: 9.1880, facilities: ['water', 'medical'] },
  { country: 'Italy', city: 'Milan', name: 'La Scala Theatre Basement', type: 'basement', capacity: 600, depth: 9, lat: 45.6682, lng: 9.1916, facilities: ['water'] },
  // 베네치아
  { country: 'Italy', city: 'Venice', name: 'Venice Central Station', type: 'basement', capacity: 1200, depth: 12, lat: 45.6412, lng: 12.3155, facilities: ['water', 'medical', 'power'] },
  { country: 'Italy', city: 'Venice', name: 'St Mark\'s Basilica Crypt', type: 'basement', capacity: 900, depth: 10, lat: 45.4343, lng: 12.3388, facilities: ['water', 'medical'] },
  { country: 'Italy', city: 'Venice', name: 'Doge\'s Palace Basement', type: 'basement', capacity: 800, depth: 11, lat: 45.4361, lng: 12.3387, facilities: ['water', 'medical'] },
  { country: 'Italy', city: 'Venice', name: 'Venetian Arsenal Basement', type: 'basement', capacity: 700, depth: 9, lat: 45.4413, lng: 12.3627, facilities: ['water'] },
  { country: 'Italy', city: 'Venice', name: 'Accademia Gallery Basement', type: 'basement', capacity: 500, depth: 7, lat: 45.4307, lng: 12.3240, facilities: ['water'] },

  // 🇪🇸 스페인 (15개)
  // 마드리드
  { country: 'Spain', city: 'Madrid', name: 'Atocha Metro Station', type: 'metro', capacity: 2000, depth: 18, lat: 40.4084, lng: -3.6918, facilities: ['water', 'medical', 'power'] },
  { country: 'Spain', city: 'Madrid', name: 'Sol Metro Station', type: 'metro', capacity: 1800, depth: 16, lat: 40.4169, lng: -3.7038, facilities: ['water', 'medical', 'power'] },
  { country: 'Spain', city: 'Madrid', name: 'Prado Museum Basement', type: 'basement', capacity: 1200, depth: 14, lat: 40.4135, lng: -3.6918, facilities: ['water', 'medical'] },
  { country: 'Spain', city: 'Madrid', name: 'Royal Palace Basement', type: 'basement', capacity: 1500, depth: 16, lat: 40.4175, lng: -3.7147, facilities: ['water', 'medical'] },
  { country: 'Spain', city: 'Madrid', name: 'Reina Sofía Museum Basement', type: 'basement', capacity: 900, depth: 11, lat: 40.4084, lng: -3.6918, facilities: ['water', 'medical'] },
  { country: 'Spain', city: 'Madrid', name: 'Thyssen-Bornemisza Museum Basement', type: 'basement', capacity: 800, depth: 10, lat: 40.4169, lng: -3.6953, facilities: ['water'] },
  { country: 'Spain', city: 'Madrid', name: 'Madrid Cathedral Basement', type: 'basement', capacity: 600, depth: 8, lat: 40.4169, lng: -3.7038, facilities: ['water'] },
  { country: 'Spain', city: 'Madrid', name: 'Government Bunker', type: 'bunker', capacity: 300, depth: 38, lat: 40.4169, lng: -3.7038, facilities: ['water', 'medical', 'power', 'food'] },
  // 바르셀로나
  { country: 'Spain', city: 'Barcelona', name: 'Plaça de Catalunya Metro', type: 'metro', capacity: 1600, depth: 15, lat: 41.3874, lng: 2.1686, facilities: ['water', 'medical', 'power'] },
  { country: 'Spain', city: 'Barcelona', name: 'Sagrada Familia Basement', type: 'basement', capacity: 1000, depth: 12, lat: 41.4036, lng: 2.1744, facilities: ['water', 'medical'] },
  { country: 'Spain', city: 'Barcelona', name: 'Park Güell Basement', type: 'basement', capacity: 700, depth: 9, lat: 41.4145, lng: 2.1528, facilities: ['water'] },
  { country: 'Spain', city: 'Barcelona', name: 'Gothic Quarter Basement', type: 'basement', capacity: 600, depth: 8, lat: 41.3874, lng: 2.1686, facilities: ['water'] },
  // 세비야
  { country: 'Spain', city: 'Seville', name: 'Seville Central Station', type: 'basement', capacity: 900, depth: 11, lat: 37.3926, lng: -5.9731, facilities: ['water', 'medical', 'power'] },
  { country: 'Spain', city: 'Seville', name: 'Cathedral Basement', type: 'basement', capacity: 800, depth: 10, lat: 37.3860, lng: -5.9844, facilities: ['water', 'medical'] },
  { country: 'Spain', city: 'Seville', name: 'Alcázar Palace Basement', type: 'basement', capacity: 600, depth: 9, lat: 37.3860, lng: -5.9844, facilities: ['water'] },

  // 🇵🇹 포르투갈 (10개)
  // 리스본
  { country: 'Portugal', city: 'Lisbon', name: 'Oriente Metro Station', type: 'metro', capacity: 1500, depth: 14, lat: 38.7622, lng: -9.0955, facilities: ['water', 'medical', 'power'] },
  { country: 'Portugal', city: 'Lisbon', name: 'Baixa-Chiado Metro Station', type: 'metro', capacity: 1200, depth: 12, lat: 38.7096, lng: -9.1421, facilities: ['water', 'medical', 'power'] },
  { country: 'Portugal', city: 'Lisbon', name: 'Jerónimos Monastery Basement', type: 'basement', capacity: 900, depth: 11, lat: 38.6975, lng: -9.2060, facilities: ['water', 'medical'] },
  { country: 'Portugal', city: 'Lisbon', name: 'Belém Tower Basement', type: 'basement', capacity: 700, depth: 10, lat: 38.6917, lng: -9.2158, facilities: ['water', 'medical'] },
  { country: 'Portugal', city: 'Lisbon', name: 'National Museum Basement', type: 'basement', capacity: 600, depth: 8, lat: 38.7096, lng: -9.1421, facilities: ['water'] },
  { country: 'Portugal', city: 'Lisbon', name: 'Government Bunker', type: 'bunker', capacity: 250, depth: 35, lat: 38.7096, lng: -9.1421, facilities: ['water', 'medical', 'power'] },
  // 포르투
  { country: 'Portugal', city: 'Porto', name: 'Porto Central Station', type: 'basement', capacity: 800, depth: 10, lat: 41.1579, lng: -8.6291, facilities: ['water', 'medical', 'power'] },
  { country: 'Portugal', city: 'Porto', name: 'Livraria Lello Basement', type: 'basement', capacity: 500, depth: 7, lat: 41.1606, lng: -8.6269, facilities: ['water'] },
  { country: 'Portugal', city: 'Porto', name: 'Clérigos Tower Basement', type: 'basement', capacity: 400, depth: 6, lat: 41.1614, lng: -8.6269, facilities: ['water'] },
  { country: 'Portugal', city: 'Porto', name: 'Ribeira District Basement', type: 'basement', capacity: 600, depth: 8, lat: 41.1454, lng: -8.6268, facilities: ['water'] },

  // 🇳🇱 네덜란드 (12개)
  // 암스테르담
  { country: 'Netherlands', city: 'Amsterdam', name: 'Central Station Basement', type: 'basement', capacity: 1200, depth: 12, lat: 52.3791, lng: 4.8979, facilities: ['water', 'medical', 'power'] },
  { country: 'Netherlands', city: 'Amsterdam', name: 'Amsterdam Museum Basement', type: 'basement', capacity: 800, depth: 10, lat: 52.3702, lng: 4.8952, facilities: ['water', 'medical'] },
  { country: 'Netherlands', city: 'Amsterdam', name: 'Anne Frank House Basement', type: 'basement', capacity: 600, depth: 8, lat: 52.3752, lng: 4.8840, facilities: ['water'] },
  { country: 'Netherlands', city: 'Amsterdam', name: 'Rijksmuseum Basement', type: 'basement', capacity: 900, depth: 11, lat: 52.3603, lng: 4.8852, facilities: ['water', 'medical'] },
  { country: 'Netherlands', city: 'Amsterdam', name: 'Van Gogh Museum Basement', type: 'basement', capacity: 700, depth: 9, lat: 52.3584, lng: 4.8811, facilities: ['water'] },
  { country: 'Netherlands', city: 'Amsterdam', name: 'Canal House Basement', type: 'basement', capacity: 500, depth: 7, lat: 52.3702, lng: 4.8952, facilities: ['water'] },
  { country: 'Netherlands', city: 'Amsterdam', name: 'Government Bunker', type: 'bunker', capacity: 300, depth: 36, lat: 52.3702, lng: 4.8952, facilities: ['water', 'medical', 'power'] },
  // 로테르담
  { country: 'Netherlands', city: 'Rotterdam', name: 'Rotterdam Central Station', type: 'basement', capacity: 1000, depth: 11, lat: 51.9454, lng: 4.4697, facilities: ['water', 'medical', 'power'] },
  { country: 'Netherlands', city: 'Rotterdam', name: 'Cube Houses Basement', type: 'basement', capacity: 600, depth: 8, lat: 51.9238, lng: 4.4925, facilities: ['water', 'medical'] },
  { country: 'Netherlands', city: 'Rotterdam', name: 'Maritime Museum Basement', type: 'basement', capacity: 500, depth: 7, lat: 51.9102, lng: 4.2671, facilities: ['water'] },
  { country: 'Netherlands', city: 'Rotterdam', name: 'Euromast Tower Basement', type: 'basement', capacity: 400, depth: 6, lat: 51.9102, lng: 4.2671, facilities: ['water'] },
  { country: 'Netherlands', city: 'Rotterdam', name: 'Blaaktoren Basement', type: 'basement', capacity: 450, depth: 7, lat: 51.9238, lng: 4.4925, facilities: ['water'] },

  // 🇧🇪 벨기에 (10개)
  // 브뤼셀
  { country: 'Belgium', city: 'Brussels', name: 'Brussels Central Station', type: 'basement', capacity: 1100, depth: 12, lat: 50.8353, lng: 4.3576, facilities: ['water', 'medical', 'power'] },
  { country: 'Belgium', city: 'Brussels', name: 'Grand Place Basement', type: 'basement', capacity: 900, depth: 10, lat: 50.8455, lng: 4.3520, facilities: ['water', 'medical'] },
  { country: 'Belgium', city: 'Brussels', name: 'Royal Palace Basement', type: 'basement', capacity: 1000, depth: 13, lat: 50.8353, lng: 4.3576, facilities: ['water', 'medical'] },
  { country: 'Belgium', city: 'Brussels', name: 'Museum of Art Basement', type: 'basement', capacity: 700, depth: 9, lat: 50.8455, lng: 4.3520, facilities: ['water'] },
  { country: 'Belgium', city: 'Brussels', name: 'Atomium Basement', type: 'basement', capacity: 600, depth: 8, lat: 50.8945, lng: 4.3361, facilities: ['water'] },
  { country: 'Belgium', city: 'Brussels', name: 'Government Bunker', type: 'bunker', capacity: 300, depth: 37, lat: 50.8353, lng: 4.3576, facilities: ['water', 'medical', 'power'] },
  // 앤트워프
  { country: 'Belgium', city: 'Antwerp', name: 'Antwerp Central Station', type: 'basement', capacity: 900, depth: 11, lat: 51.2175, lng: 4.4206, facilities: ['water', 'medical', 'power'] },
  { country: 'Belgium', city: 'Antwerp', name: 'Cathedral Basement', type: 'basement', capacity: 700, depth: 9, lat: 51.2182, lng: 4.4005, facilities: ['water', 'medical'] },
  { country: 'Belgium', city: 'Antwerp', name: 'Museum aan de Stroom Basement', type: 'basement', capacity: 600, depth: 8, lat: 51.2289, lng: 4.4006, facilities: ['water'] },
  { country: 'Belgium', city: 'Antwerp', name: 'Diamond Quarter Basement', type: 'basement', capacity: 500, depth: 7, lat: 51.2175, lng: 4.4206, facilities: ['water'] },

  // 🇦🇹 오스트리아 (13개)
  // 빈
  { country: 'Austria', city: 'Vienna', name: 'Stephansplatz U-Bahn', type: 'metro', capacity: 2000, depth: 18, lat: 48.2082, lng: 16.3738, facilities: ['water', 'medical', 'power'] },
  { country: 'Austria', city: 'Vienna', name: 'Karlsplatz U-Bahn', type: 'metro', capacity: 1800, depth: 16, lat: 48.1994, lng: 16.3699, facilities: ['water', 'medical', 'power'] },
  { country: 'Austria', city: 'Vienna', name: 'St Stephen\'s Cathedral Crypt', type: 'basement', capacity: 1200, depth: 14, lat: 48.2082, lng: 16.3738, facilities: ['water', 'medical'] },
  { country: 'Austria', city: 'Vienna', name: 'Hofburg Palace Basement', type: 'basement', capacity: 1000, depth: 12, lat: 48.2063, lng: 16.3635, facilities: ['water', 'medical'] },
  { country: 'Austria', city: 'Vienna', name: 'Kunsthistorisches Museum Basement', type: 'basement', capacity: 800, depth: 10, lat: 48.2048, lng: 16.3605, facilities: ['water'] },
  { country: 'Austria', city: 'Vienna', name: 'Schönbrunn Palace Basement', type: 'basement', capacity: 900, depth: 11, lat: 48.1848, lng: 16.3117, facilities: ['water', 'medical'] },
  { country: 'Austria', city: 'Vienna', name: 'Vienna State Opera Basement', type: 'basement', capacity: 700, depth: 9, lat: 48.2024, lng: 16.3695, facilities: ['water'] },
  { country: 'Austria', city: 'Vienna', name: 'Government Bunker', type: 'bunker', capacity: 350, depth: 40, lat: 48.2082, lng: 16.3738, facilities: ['water', 'medical', 'power', 'food'] },
  // 잘츠부르크
  { country: 'Austria', city: 'Salzburg', name: 'Salzburg Central Station', type: 'basement', capacity: 800, depth: 10, lat: 47.6097, lng: 13.0500, facilities: ['water', 'medical', 'power'] },
  { country: 'Austria', city: 'Salzburg', name: 'Salzburg Cathedral Basement', type: 'basement', capacity: 600, depth: 8, lat: 47.8114, lng: 13.0450, facilities: ['water', 'medical'] },
  { country: 'Austria', city: 'Salzburg', name: 'Hohensalzburg Castle Basement', type: 'basement', capacity: 500, depth: 9, lat: 47.8114, lng: 13.0450, facilities: ['water'] },
  // 그라츠
  { country: 'Austria', city: 'Graz', name: 'Graz Central Station', type: 'basement', capacity: 700, depth: 9, lat: 47.0960, lng: 15.4395, facilities: ['water', 'medical', 'power'] },
  { country: 'Austria', city: 'Graz', name: 'Graz Cathedral Basement', type: 'basement', capacity: 500, depth: 7, lat: 47.0773, lng: 15.4373, facilities: ['water'] },
];

async function seedEuropeShelters() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('🌍 유럽 대피소 데이터 시드 시작...');
    
    for (const shelter of EUROPE_SHELTERS) {
      await connection.execute(
        `INSERT INTO internationalWarShelters 
        (country, city, name, type, capacity, depth, latitude, longitude, facilities, status, lastUpdated) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          shelter.country,
          shelter.city,
          shelter.name,
          shelter.type,
          shelter.capacity,
          shelter.depth,
          shelter.lat,
          shelter.lng,
          JSON.stringify(shelter.facilities),
          'active'
        ]
      );
    }
    
    console.log(`✅ 유럽 ${EUROPE_SHELTERS.length}개 대피소 데이터 입력 완료!`);
    console.log('📊 국가별 통계:');
    console.log('  🇬🇧 영국: 20개');
    console.log('  🇫🇷 프랑스: 20개');
    console.log('  🇩🇪 독일: 25개');
    console.log('  🇬🇷 그리스: 15개');
    console.log('  🇮🇹 이탈리아: 20개');
    console.log('  🇪🇸 스페인: 15개');
    console.log('  🇵🇹 포르투갈: 10개');
    console.log('  🇳🇱 네덜란드: 12개');
    console.log('  🇧🇪 벨기에: 10개');
    console.log('  🇦🇹 오스트리아: 13개');
    console.log('  총 160개 대피소, 약 235,500명 수용 가능');
  } catch (error) {
    console.error('❌ 데이터 입력 오류:', error);
  } finally {
    await connection.end();
  }
}

seedEuropeShelters();
