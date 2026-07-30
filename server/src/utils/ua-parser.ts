export interface parsedUA {
  browser: string;
  browserVersion: string;
  operatingSystem: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  isBot: boolean;
}

export const parseUserAgent = (uaString: string = ''): parsedUA => {
  const ua = uaString.toLowerCase();
  
  let browser = 'Unknown';
  let browserVersion = 'Unknown';
  let operatingSystem = 'Unknown';
  let deviceType: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
  let isBot = false;

  // Bot detection
  const botKeywords = [
    'googlebot', 'bingbot', 'yandexbot', 'duckduckbot', 'slurp', 'twitterbot',
    'facebookexternalhit', 'linkedinbot', 'embedly', 'baiduspider', 'pinterest',
    'slackbot', 'discordbot', 'telegrambot', 'applebot', 'screaming frog'
  ];
  if (botKeywords.some(keyword => ua.includes(keyword))) {
    isBot = true;
  }

  // Device detection
  if (/ipad|tablet/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/mobile|iphone|ipod|android/i.test(ua)) {
    deviceType = 'Mobile';
  }

  // OS detection
  if (ua.includes('macintosh') || ua.includes('mac os x')) {
    operatingSystem = 'macOS';
  } else if (ua.includes('windows')) {
    operatingSystem = 'Windows';
  } else if (ua.includes('android')) {
    operatingSystem = 'Android';
  } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    operatingSystem = 'iOS';
  } else if (ua.includes('linux')) {
    operatingSystem = 'Linux';
  }

  // Browser detection
  if (ua.includes('firefox')) {
    browser = 'Firefox';
    const match = ua.match(/firefox\/([\d\.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.includes('seamonkey')) {
    browser = 'SeaMonkey';
  } else if (ua.includes('chrome') && !ua.includes('chromium')) {
    browser = 'Chrome';
    const match = ua.match(/chrome\/([\d\.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser = 'Safari';
    const match = ua.match(/version\/([\d\.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.includes('opr') || ua.includes('opera')) {
    browser = 'Opera';
  } else if (ua.includes('edge') || ua.includes('edg')) {
    browser = 'Edge';
    const match = ua.match(/(?:edge|edg)\/([\d\.]+)/);
    if (match) browserVersion = match[1];
  }

  return {
    browser,
    browserVersion,
    operatingSystem,
    deviceType,
    isBot
  };
};
