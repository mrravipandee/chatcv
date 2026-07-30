export interface GeoIpProfile {
  country: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
}

const CITIES_DB = [
  { name: 'San Francisco', state: 'California', country: 'United States', lat: 37.7749, lng: -122.4194, tz: 'America/Los_Angeles', isp: 'Comcast Cable' },
  { name: 'Bengaluru', state: 'Karnataka', country: 'India', lat: 12.9716, lng: 77.5946, tz: 'Asia/Kolkata', isp: 'Reliance Jio' },
  { name: 'London', state: 'England', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, tz: 'Europe/London', isp: 'British Telecom' },
  { name: 'Berlin', state: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, tz: 'Europe/Berlin', isp: 'Deutsche Telekom' },
  { name: 'Tokyo', state: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, tz: 'Asia/Tokyo', isp: 'Softbank Corp' },
  { name: 'Sydney', state: 'New South Wales', country: 'Australia', lat: -33.8688, lng: 151.2093, tz: 'Australia/Sydney', isp: 'Telstra Corp' },
  { name: 'Toronto', state: 'Ontario', country: 'Canada', lat: 43.6532, lng: -79.3832, tz: 'America/Toronto', isp: 'Rogers Communications' },
  { name: 'São Paulo', state: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, tz: 'America/Sao_Paulo', isp: 'Vivo Brazil' },
  { name: 'Cape Town', state: 'Western Cape', country: 'South Africa', lat: -33.9249, lng: 18.4241, tz: 'Africa/Johannesburg', isp: 'Telkom SA' },
];

export const getGeoIpProfile = (ip: string): GeoIpProfile => {
  // Compute a simple hash based on the IP address string
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    hash = ip.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Resolve city
  const cityIndex = Math.abs(hash) % CITIES_DB.length;
  const city = CITIES_DB[cityIndex];

  return {
    country: city.country,
    state: city.state,
    city: city.name,
    latitude: city.lat,
    longitude: city.lng,
    timezone: city.tz,
    isp: city.isp
  };
};
