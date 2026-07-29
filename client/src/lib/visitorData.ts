import {
  VisitorSession,
  VisitorEventLog,
  HourlyTrafficPoint,
  DailyTrafficPoint,
  MonthlyTrafficPoint,
  CountryTrafficPoint
} from '@/types/visitors';

const seedRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Global cities list for GPS mapping
const CITIES = [
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

const REFERRERS = [
  { ref: 'https://www.google.com/', source: 'google', medium: 'organic' },
  { ref: 'https://lnkd.in/chatcv', source: 'linkedin', medium: 'post' },
  { ref: 'https://t.co/chatcv', source: 'twitter', medium: 'social' },
  { ref: 'https://www.producthunt.com/posts/chatcv', source: 'producthunt', medium: 'launch' },
  { ref: 'https://github.com/mrravipandee/chatcv', source: 'github', medium: 'repository' },
  { ref: 'Direct', source: undefined, medium: undefined },
];

const PAGES = [
  '/',
  '/dashboard',
  '/dashboard/chats',
  '/dashboard/settings',
  '/resume-examples',
  '/resume-examples/software-engineer',
  '/blog/ats-friendly-resume',
  '/subscribe',
];

export const generateVisitorSessions = (count: number = 18): VisitorSession[] => {
  const list: VisitorSession[] = [];

  for (let i = 0; i < count; i++) {
    const s = seedRandom(200 + i);
    const cityObj = CITIES[Math.floor(s * CITIES.length)];
    const refObj = REFERRERS[Math.floor(seedRandom(300 + i) * REFERRERS.length)];

    const browserSeed = seedRandom(400 + i);
    const browser = browserSeed > 0.6 ? 'Chrome' : browserSeed > 0.25 ? 'Safari' : 'Firefox';
    const browserVersion = browser === 'Chrome' ? '124.0.0.0' : browser === 'Safari' ? '17.4' : '125.0';
    
    const osSeed = seedRandom(500 + i);
    const operatingSystem = osSeed > 0.5 ? 'macOS' : osSeed > 0.15 ? 'Windows' : 'Linux';
    const screenResolution = osSeed > 0.5 ? '1440x900' : '1920x1080';
    
    const deviceType = osSeed > 0.8 ? 'Mobile' : osSeed > 0.15 ? 'Desktop' : 'Tablet';

    const ip = `192.168.${Math.floor(10 + s * 100)}.${Math.floor(1 + s * 250)}`;
    const timezone = cityObj.tz;
    const isp = cityObj.isp;

    // Generate random event logs timeline
    const timeline: VisitorEventLog[] = [];
    const numPages = Math.floor(1 + s * 5);
    const visited: string[] = [];

    let elapsed = 0;
    for (let p = 0; p < numPages; p++) {
      const path = PAGES[Math.floor(seedRandom(600 + i + p) * PAGES.length)];
      if (!visited.includes(path)) visited.push(path);
      
      const ts = new Date();
      ts.setSeconds(ts.getSeconds() - (numPages - p) * 45);
      const tsStr = ts.toLocaleTimeString('en-US', { hour12: false });

      timeline.push({
        id: `evt-${i}-${p}`,
        action: 'Page View',
        path,
        timestamp: tsStr,
      });

      // Add a simulated click or compiling step
      if (seedRandom(700 + i + p) > 0.4) {
        timeline.push({
          id: `evt-${i}-${p}-clk`,
          action: path === '/dashboard' ? 'Compile PDF' : 'Click',
          path,
          timestamp: tsStr,
          detail: path === '/dashboard' ? 'Compiled LaTex Resume' : 'Clicked "Get Started" anchor',
        });
      }
    }

    const clicksCount = timeline.filter((t) => t.action === 'Click' || t.action === 'Compile PDF').length;
    const durationSec = numPages * 45 + Math.floor(s * 30);
    const minutes = Math.floor(durationSec / 60);
    const seconds = durationSec % 60;
    const sessionDuration = `${minutes}m ${seconds}s`;

    list.push({
      id: `vis-${1000 + i}`,
      ip,
      country: cityObj.country,
      state: cityObj.state,
      city: cityObj.name,
      latitude: cityObj.lat,
      longitude: cityObj.lng,
      timezone,
      isp,
      browser,
      browserVersion,
      operatingSystem,
      screenResolution,
      deviceType: deviceType as any,
      language: s > 0.7 ? 'en-US' : s > 0.45 ? 'en-GB' : 'de-DE',
      darkMode: s > 0.5,
      connectionType: s > 0.6 ? 'Wifi' : s > 0.2 ? '4G' : '5G',
      referrer: refObj.ref,
      landingPage: visited[0] || '/',
      exitPage: visited[visited.length - 1] || '/',
      sessionDuration,
      sessionDurationSeconds: durationSec,
      pagesVisited: visited,
      clicks: clicksCount + 2,
      scrollPercentage: Math.floor(40 + s * 55),
      utmSource: refObj.source,
      utmMedium: refObj.medium,
      utmCampaign: refObj.source ? 'summer_launch_2026' : undefined,
      userType: s > 0.4 ? 'New' : 'Returning',
      isBot: s > 0.96, // 4% bot rate
      timeline,
    });
  }

  return list;
};

// Generates a single live visitor session dynamically to simulate WebSocket push
export const generateLiveVisitor = (): VisitorSession => {
  const seed = Math.floor(Math.random() * 10000);
  const s = seedRandom(seed);
  const cityObj = CITIES[Math.floor(s * CITIES.length)];
  const refObj = REFERRERS[Math.floor(seedRandom(seed + 10) * REFERRERS.length)];

  const browser = s > 0.65 ? 'Chrome' : s > 0.2 ? 'Safari' : 'Edge';
  const browserVersion = browser === 'Chrome' ? '124.0.0.0' : browser === 'Safari' ? '17.4' : '123.0';
  const operatingSystem = s > 0.5 ? 'macOS' : s > 0.15 ? 'Windows' : 'Android';
  const deviceType = operatingSystem === 'Android' ? 'Mobile' : 'Desktop';
  const ip = `192.168.${Math.floor(20 + s * 80)}.${Math.floor(10 + s * 220)}`;

  const visited = [PAGES[Math.floor(s * PAGES.length)]];
  const tsStr = new Date().toLocaleTimeString('en-US', { hour12: false });
  const timeline: VisitorEventLog[] = [
    { id: `evt-live-${seed}-1`, action: 'Page View', path: visited[0], timestamp: tsStr },
  ];

  return {
    id: `vis-live-${seed}`,
    ip,
    country: cityObj.country,
    state: cityObj.state,
    city: cityObj.name,
    latitude: cityObj.lat,
    longitude: cityObj.lng,
    timezone: cityObj.tz,
    isp: cityObj.isp,
    browser,
    browserVersion,
    operatingSystem,
    screenResolution: deviceType === 'Mobile' ? '390x844' : '1440x900',
    deviceType: deviceType as any,
    language: 'en-US',
    darkMode: Math.random() > 0.5,
    connectionType: '5G',
    referrer: refObj.ref,
    landingPage: visited[0],
    exitPage: visited[0],
    sessionDuration: '0m 05s',
    sessionDurationSeconds: 5,
    pagesVisited: visited,
    clicks: 1,
    scrollPercentage: 10,
    utmSource: refObj.source,
    utmMedium: refObj.medium,
    utmCampaign: refObj.source ? 'summer_launch_2026' : undefined,
    userType: Math.random() > 0.4 ? 'New' : 'Returning',
    isBot: Math.random() > 0.98,
    timeline,
  };
};

// Hourly traffic trend list generator
export const generateHourlyTraffic = (): HourlyTrafficPoint[] => {
  const hours = [
    '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
    '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
  ];
  return hours.map((hour, idx) => {
    const s = seedRandom(70 + idx);
    const baseline = idx >= 4 && idx <= 9 ? 280 : 80; // daytime peaks
    return {
      hour,
      visitors: Math.floor(baseline + s * 140),
      clicks: Math.floor((baseline + s * 140) * (3 + s * 2.5)),
    };
  });
};

// Daily traffic trends (for BarChart)
export const generateDailyTraffic = (): DailyTrafficPoint[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, idx) => {
    const s = seedRandom(90 + idx);
    const baseline = idx >= 5 ? 400 : 780; // weekend traffic slightly lower
    return {
      day,
      visitors: Math.floor(baseline + s * 180),
    };
  });
};

// Monthly traffic trends
export const generateMonthlyTraffic = (): MonthlyTrafficPoint[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  return months.map((month, idx) => {
    const s = seedRandom(120 + idx);
    return {
      month,
      visitors: Math.floor(4200 + idx * 800 + s * 1200), // showing continuous growth
    };
  });
};

// Country percentages rankings
export const generateCountryTraffic = (): CountryTrafficPoint[] => {
  return [
    { country: 'United States', visitors: 14820, percentage: 46 },
    { country: 'India', visitors: 6440, percentage: 20 },
    { country: 'United Kingdom', visitors: 2890, percentage: 9 },
    { country: 'Canada', visitors: 2250, percentage: 7 },
    { country: 'Germany', visitors: 1610, percentage: 5 },
    { country: 'Australia', visitors: 1280, percentage: 4 },
    { country: 'Others', visitors: 2890, percentage: 9 },
  ];
};

// Popular pages listings
export const generatePopularPages = () => {
  return [
    { path: '/', views: 24820, visitors: 18450, time: '0m 48s' },
    { path: '/dashboard', views: 18400, visitors: 8900, time: '4m 12s' },
    { path: '/resume-examples', views: 12400, visitors: 9400, time: '2m 15s' },
    { path: '/blog/ats-friendly-resume', views: 6800, visitors: 5800, time: '3m 50s' },
    { path: '/subscribe', views: 3400, visitors: 2900, time: '1m 20s' },
  ];
};

export const generateEntryPages = () => {
  return [
    { path: '/', views: 16400, percentage: 58 },
    { path: '/resume-examples', views: 6800, percentage: 24 },
    { path: '/blog/ats-friendly-resume', views: 3400, percentage: 12 },
    { path: '/dashboard', views: 1700, percentage: 6 },
  ];
};

export const generateExitPages = () => {
  return [
    { path: '/subscribe', views: 8200, percentage: 29 },
    { path: '/', views: 6800, percentage: 24 },
    { path: '/dashboard', views: 5600, percentage: 20 },
    { path: '/blog/ats-friendly-resume', views: 4200, percentage: 15 },
    { path: '/resume-examples', views: 3400, percentage: 12 },
  ];
};
