export interface VisitorEventLog {
  id: string;
  action: 'Page View' | 'Click' | 'Scroll' | 'Compile PDF' | 'Download' | 'Sign Up';
  path: string;
  timestamp: string;
  detail?: string;
}

export interface VisitorSession {
  id: string;
  ip: string;
  country: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
  browser: string;
  browserVersion: string;
  operatingSystem: string;
  screenResolution: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  language: string;
  darkMode: boolean;
  connectionType: 'Wifi' | '4G' | '5G' | 'Ethernet' | 'Unknown';
  referrer: string;
  landingPage: string;
  exitPage: string;
  sessionDuration: string; // e.g. "3m 45s"
  sessionDurationSeconds: number;
  pagesVisited: string[];
  clicks: number;
  scrollPercentage: number;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  userType: 'New' | 'Returning';
  isBot: boolean;
  timeline: VisitorEventLog[];
}

export interface HourlyTrafficPoint {
  hour: string;
  visitors: number;
  clicks: number;
}

export interface DailyTrafficPoint {
  day: string;
  visitors: number;
}

export interface MonthlyTrafficPoint {
  month: string;
  visitors: number;
}

export interface CountryTrafficPoint {
  country: string;
  visitors: number;
  percentage: number;
}
