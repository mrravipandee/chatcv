import {
  TimeRange,
  StatCardData,
  ChartDataPoint,
  DemographicItem,
  TrafficSource,
  PagePerformance,
  ActivityLog,
  RegisteredUser,
  ResumeDownload,
  FeedbackItem,
  ContactMessage,
  SystemError,
  SparklinePoint
} from '@/types/admin';

// Helper to generate a date offset string
const getDateAgo = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getHourAgo = (hoursAgo: number): string => {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

// Seeded random number generator for stability
const seedRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const generateDashboardData = (range: TimeRange) => {
  // Define intervals based on time range
  let dataPointsCount = 30;
  let labelFunc = (i: number) => getDateAgo(30 - i);
  let seedMultiplier = 1;

  if (range === '24h') {
    dataPointsCount = 24;
    labelFunc = (i: number) => getHourAgo(24 - i);
    seedMultiplier = 0.5;
  } else if (range === '7d') {
    dataPointsCount = 7;
    labelFunc = (i: number) => getDateAgo(7 - i);
    seedMultiplier = 0.8;
  } else if (range === '90d') {
    dataPointsCount = 90;
    labelFunc = (i: number) => getDateAgo(90 - i);
    seedMultiplier = 1.8;
  }

  const seed = range === '24h' ? 24 : range === '7d' ? 7 : range === '30d' ? 30 : 90;

  // 1. Generate Time-series Chart Data
  const chartData: ChartDataPoint[] = [];
  for (let i = 0; i < dataPointsCount; i++) {
    const s = seedRandom(seed + i);
    const dateStr = labelFunc(i);

    // Baseline metrics
    const baseVisitors = Math.floor(400 + s * 300 * seedMultiplier);
    const baseUsers = Math.floor(baseVisitors * (0.12 + s * 0.05)); // 12-17% conversion to signup
    const baseResumes = Math.floor(baseUsers * (1.5 + s * 0.8)); // users make multiple resumes
    const baseDownloads = Math.floor(baseResumes * (0.6 + s * 0.25)); // 60-85% download rate
    const baseAiMessages = Math.floor(baseResumes * (8 + s * 6)); // 8-14 messages per resume

    chartData.push({
      date: dateStr,
      visitors: baseVisitors,
      users: baseUsers,
      resumes: baseResumes,
      downloads: baseDownloads,
      aiMessages: baseAiMessages,
    });
  }

  // Calculate totals/averages from chart data
  const totalVisitors = chartData.reduce((sum, item) => sum + item.visitors, 0);
  const totalUsers = Math.floor(totalVisitors * 0.145);
  const totalResumes = chartData.reduce((sum, item) => sum + item.resumes, 0);
  const totalDownloads = chartData.reduce((sum, item) => sum + item.downloads, 0);
  const totalAiMessages = chartData.reduce((sum, item) => sum + item.aiMessages, 0);

  // New users today
  const newUsersToday = chartData[chartData.length - 1].users;

  // Active Users (typically ~35% of total users in a given window)
  const activeUsers = Math.floor(totalUsers * 0.38);
  const returningUsers = Math.floor(activeUsers * 0.55);

  // Conversion rates
  const conversionRate = ((totalUsers / totalVisitors) * 100).toFixed(2);
  const bounceRate = (34.2 + seedRandom(seed) * 5.5).toFixed(1);

  // Helper to make a sparkline
  const makeSparkline = (metricKey: keyof Omit<ChartDataPoint, 'date'>): SparklinePoint[] => {
    return chartData.map((d) => ({
      date: d.date,
      value: d[metricKey] as number,
    }));
  };

  // 2. Overview Stats Cards
  const stats: StatCardData[] = [
    {
      id: 'total-visitors',
      title: 'Total Visitors',
      value: totalVisitors.toLocaleString(),
      change: '+14.2%',
      changeType: 'increase',
      icon: 'Eye',
      sparkline: makeSparkline('visitors'),
      description: 'Total absolute visitors tracked across all pages.',
    },
    {
      id: 'total-users',
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      change: '+18.7%',
      changeType: 'increase',
      icon: 'Users',
      sparkline: makeSparkline('users'),
      description: 'Total signups inside the platform database.',
    },
    {
      id: 'new-users-today',
      title: 'New Users Today',
      value: newUsersToday.toLocaleString(),
      change: '+8.3%',
      changeType: 'increase',
      icon: 'UserPlus',
      sparkline: makeSparkline('users').slice(-Math.min(dataPointsCount, 10)),
      description: 'Number of new users registered in the last 24h cycle.',
    },
    {
      id: 'active-users',
      title: 'Active Users',
      value: activeUsers.toLocaleString(),
      change: '+12.4%',
      changeType: 'increase',
      icon: 'Activity',
      sparkline: makeSparkline('users'),
      description: 'Users who performed at least one chat or resume edit action.',
    },
    {
      id: 'returning-users',
      title: 'Returning Users',
      value: returningUsers.toLocaleString(),
      change: '+5.1%',
      changeType: 'increase',
      icon: 'RefreshCw',
      sparkline: makeSparkline('users').map((p, idx) => ({ ...p, value: Math.floor(p.value * 0.55) })),
      description: 'Users returning after 24h of initial registration.',
    },
    {
      id: 'total-resumes',
      title: 'Resumes Created',
      value: totalResumes.toLocaleString(),
      change: '+22.5%',
      changeType: 'increase',
      icon: 'FileText',
      sparkline: makeSparkline('resumes'),
      description: 'Total TeX/LaTeX resume documents generated by users.',
    },
    {
      id: 'total-messages',
      title: 'AI Messages',
      value: totalAiMessages.toLocaleString(),
      change: '+28.1%',
      changeType: 'increase',
      icon: 'MessageSquare',
      sparkline: makeSparkline('aiMessages'),
      description: 'Number of chat requests handled by ChatCV AI.',
    },
    {
      id: 'total-downloads',
      title: 'Total Downloads',
      value: totalDownloads.toLocaleString(),
      change: '+20.3%',
      changeType: 'increase',
      icon: 'Download',
      sparkline: makeSparkline('downloads'),
      description: 'Total resume downloads (PDF, LaTeX source, or JSON format).',
    },
    {
      id: 'conversion-rate',
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      change: '+1.8%',
      changeType: 'increase',
      icon: 'Zap',
      sparkline: chartData.map((d) => ({
        date: d.date,
        value: Number(((d.users / d.visitors) * 100).toFixed(1)),
      })),
      description: 'Percentage of visitors who signed up for a ChatCV account.',
    },
    {
      id: 'bounce-rate',
      title: 'Bounce Rate',
      value: `${bounceRate}%`,
      change: '-0.9%',
      changeType: 'decrease', // decrease bounce rate is positive (green)
      icon: 'TrendingDown',
      sparkline: chartData.map((d, i) => ({
        date: d.date,
        value: Number((35.0 - seedRandom(seed + i) * 3).toFixed(1)),
      })),
      description: 'Percentage of single-page sessions without user interaction.',
    },
  ];

  // 3. Demographics Lists
  const countries: DemographicItem[] = [
    { name: 'United States', count: Math.floor(totalVisitors * 0.42), percentage: 42 },
    { name: 'India', count: Math.floor(totalVisitors * 0.18), percentage: 18 },
    { name: 'United Kingdom', count: Math.floor(totalVisitors * 0.09), percentage: 9 },
    { name: 'Canada', count: Math.floor(totalVisitors * 0.07), percentage: 7 },
    { name: 'Germany', count: Math.floor(totalVisitors * 0.05), percentage: 5 },
    { name: 'Australia', count: Math.floor(totalVisitors * 0.04), percentage: 4 },
    { name: 'France', count: Math.floor(totalVisitors * 0.03), percentage: 3 },
    { name: 'Others', count: Math.floor(totalVisitors * 0.12), percentage: 12 },
  ];

  const cities: DemographicItem[] = [
    { name: 'San Francisco', count: Math.floor(totalVisitors * 0.14), percentage: 14 },
    { name: 'New York', count: Math.floor(totalVisitors * 0.11), percentage: 11 },
    { name: 'Bengaluru', count: Math.floor(totalVisitors * 0.09), percentage: 9 },
    { name: 'London', count: Math.floor(totalVisitors * 0.08), percentage: 8 },
    { name: 'Toronto', count: Math.floor(totalVisitors * 0.05), percentage: 5 },
    { name: 'Berlin', count: Math.floor(totalVisitors * 0.04), percentage: 4 },
    { name: 'Sydney', count: Math.floor(totalVisitors * 0.03), percentage: 3 },
    { name: 'Others', count: Math.floor(totalVisitors * 0.46), percentage: 46 },
  ];

  const devices: DemographicItem[] = [
    { name: 'Desktop', count: Math.floor(totalVisitors * 0.68), percentage: 68 },
    { name: 'Mobile', count: Math.floor(totalVisitors * 0.27), percentage: 27 },
    { name: 'Tablet', count: Math.floor(totalVisitors * 0.05), percentage: 5 },
  ];

  const browsers: DemographicItem[] = [
    { name: 'Chrome', count: Math.floor(totalVisitors * 0.62), percentage: 62 },
    { name: 'Safari', count: Math.floor(totalVisitors * 0.22), percentage: 22 },
    { name: 'Firefox', count: Math.floor(totalVisitors * 0.08), percentage: 8 },
    { name: 'Edge', count: Math.floor(totalVisitors * 0.06), percentage: 6 },
    { name: 'Brave', count: Math.floor(totalVisitors * 0.02), percentage: 2 },
  ];

  const operatingSystems: DemographicItem[] = [
    { name: 'macOS', count: Math.floor(totalVisitors * 0.45), percentage: 45 },
    { name: 'Windows', count: Math.floor(totalVisitors * 0.35), percentage: 35 },
    { name: 'iOS', count: Math.floor(totalVisitors * 0.12), percentage: 12 },
    { name: 'Android', count: Math.floor(totalVisitors * 0.06), percentage: 6 },
    { name: 'Linux', count: Math.floor(totalVisitors * 0.02), percentage: 2 },
  ];

  // 4. Traffic Referrals
  const trafficSources: TrafficSource[] = [
    { source: 'Google Search', sessions: Math.floor(totalVisitors * 0.35), visitors: Math.floor(totalVisitors * 0.32), bounceRate: '28.4%', conversionRate: '16.2%' },
    { source: 'Direct Traffic', sessions: Math.floor(totalVisitors * 0.22), visitors: Math.floor(totalVisitors * 0.20), bounceRate: '22.1%', conversionRate: '21.5%' },
    { source: 'LinkedIn Referral', sessions: Math.floor(totalVisitors * 0.15), visitors: Math.floor(totalVisitors * 0.13), bounceRate: '35.6%', conversionRate: '12.8%' },
    { source: 'Product Hunt Launch', sessions: Math.floor(totalVisitors * 0.10), visitors: Math.floor(totalVisitors * 0.095), bounceRate: '41.2%', conversionRate: '9.4%' },
    { source: 'GitHub Link', sessions: Math.floor(totalVisitors * 0.08), visitors: Math.floor(totalVisitors * 0.075), bounceRate: '30.1%', conversionRate: '18.1%' },
    { source: 'Twitter / X', sessions: Math.floor(totalVisitors * 0.06), visitors: Math.floor(totalVisitors * 0.058), bounceRate: '44.8%', conversionRate: '8.2%' },
    { source: 'Reddit Community', sessions: Math.floor(totalVisitors * 0.03), visitors: Math.floor(totalVisitors * 0.028), bounceRate: '51.9%', conversionRate: '5.6%' },
    { source: 'Instagram Stories', sessions: Math.floor(totalVisitors * 0.01), visitors: Math.floor(totalVisitors * 0.009), bounceRate: '62.4%', conversionRate: '3.1%' },
  ];

  // 5. Page Performance
  const mostVisitedPages: PagePerformance[] = [
    { path: '/', views: Math.floor(totalVisitors * 1.2), uniqueVisitors: Math.floor(totalVisitors * 0.95), avgDuration: '0m 45s' },
    { path: '/dashboard', views: Math.floor(totalVisitors * 0.85), uniqueVisitors: Math.floor(totalVisitors * 0.35), avgDuration: '4m 12s' },
    { path: '/login', views: Math.floor(totalVisitors * 0.30), uniqueVisitors: Math.floor(totalVisitors * 0.28), avgDuration: '0m 28s' },
    { path: '/register', views: Math.floor(totalVisitors * 0.25), uniqueVisitors: Math.floor(totalVisitors * 0.22), avgDuration: '1m 02s' },
    { path: '/resume-examples', views: Math.floor(totalVisitors * 0.40), uniqueVisitors: Math.floor(totalVisitors * 0.32), avgDuration: '2m 15s' },
    { path: '/blog/ats-friendly-resume', views: Math.floor(totalVisitors * 0.18), uniqueVisitors: Math.floor(totalVisitors * 0.15), avgDuration: '3m 48s' },
    { path: '/blog/free-ai-resume-builder', views: Math.floor(totalVisitors * 0.12), uniqueVisitors: Math.floor(totalVisitors * 0.10), avgDuration: '3m 05s' },
    { path: '/subscribe', views: Math.floor(totalVisitors * 0.08), uniqueVisitors: Math.floor(totalVisitors * 0.075), avgDuration: '1m 40s' },
  ];

  const topLandingPages: PagePerformance[] = [
    { path: '/', views: Math.floor(totalVisitors * 0.55), uniqueVisitors: Math.floor(totalVisitors * 0.52), avgDuration: '0m 52s' },
    { path: '/resume-examples', views: Math.floor(totalVisitors * 0.22), uniqueVisitors: Math.floor(totalVisitors * 0.20), avgDuration: '2m 04s' },
    { path: '/blog/ats-friendly-resume', views: Math.floor(totalVisitors * 0.12), uniqueVisitors: Math.floor(totalVisitors * 0.11), avgDuration: '4m 02s' },
    { path: '/register', views: Math.floor(totalVisitors * 0.06), uniqueVisitors: Math.floor(totalVisitors * 0.055), avgDuration: '1m 15s' },
    { path: '/blog/free-ai-resume-builder', views: Math.floor(totalVisitors * 0.05), uniqueVisitors: Math.floor(totalVisitors * 0.048), avgDuration: '2m 50s' },
  ];

  const avgSessionDuration = '3m 24s';

  // 6. Recent Logs Feed Data
  const latestUsers: RegisteredUser[] = [
    { id: 'usr-1', name: 'Alex Rivera', email: 'alex.rivera@gmail.com', plan: 'Premium', date: 'Just now' },
    { id: 'usr-2', name: 'Priyah Sharma', email: 'priyah22@yahoo.co.in', plan: 'Free', date: '3 mins ago' },
    { id: 'usr-3', name: 'Marcus Sterling', email: 'msterl@protonmail.ch', plan: 'Premium', date: '12 mins ago' },
    { id: 'usr-4', name: 'Yuki Tanaka', email: 'tanaka.yuki@ne.jp', plan: 'Free', date: '28 mins ago' },
    { id: 'usr-5', name: 'Elena Rostova', email: 'elena.rostova@yandex.ru', plan: 'Free', date: '45 mins ago' },
    { id: 'usr-6', name: 'Jordan Croft', email: 'jordan.croft@outlook.com', plan: 'Premium', date: '1 hour ago' },
    { id: 'usr-7', name: 'Chen Wei', email: 'chen.wei@qq.com', plan: 'Free', date: '2 hours ago' },
  ];

  const latestDownloads: ResumeDownload[] = [
    { id: 'dl-1', title: 'Software Engineer Resume', format: 'PDF', userEmail: 'msterl@protonmail.ch', timestamp: 'Just now' },
    { id: 'dl-2', title: 'Product Manager ATS CV', format: 'LaTeX', userEmail: 'jordan.croft@outlook.com', timestamp: '8 mins ago' },
    { id: 'dl-3', title: 'Data Scientist OnePage', format: 'PDF', userEmail: 'tanaka.yuki@ne.jp', timestamp: '15 mins ago' },
    { id: 'dl-4', title: 'Marketing Lead Resume', format: 'JSON', userEmail: 'priyah22@yahoo.co.in', timestamp: '34 mins ago' },
    { id: 'dl-5', title: 'Senior Architect LaTeX', format: 'LaTeX', userEmail: 'alex.rivera@gmail.com', timestamp: '52 mins ago' },
    { id: 'dl-6', title: 'Financial Analyst Resume', format: 'PDF', userEmail: 'david.b@verizon.net', timestamp: '1 hour ago' },
  ];

  const latestFeedback: FeedbackItem[] = [
    { id: 'fb-1', name: 'Marcus Sterling', email: 'msterl@protonmail.ch', rating: 5, comment: 'The LaTeX compilation was seamless! Got an interview call in 3 days.', timestamp: '12 mins ago' },
    { id: 'fb-2', name: 'Emma Watson', email: 'em.watson@gmail.com', rating: 4, comment: 'Chatbot was super helpful for tailoring my bullet points. Can we get more minimalist templates?', timestamp: '35 mins ago' },
    { id: 'fb-3', name: 'Raj Patel', email: 'rajpatel99@gmail.com', rating: 5, comment: 'Hands down the best AI resume builder. No templates fight, just talking to it. Love the PDF export quality.', timestamp: '1 hour ago' },
    { id: 'fb-4', name: 'Yuki Tanaka', email: 'tanaka.yuki@ne.jp', rating: 3, comment: 'Good UI but sometimes OpenAI times out. Re-trying fixes it though.', timestamp: '2 hours ago' },
  ];

  const latestMessages: ContactMessage[] = [
    { id: 'msg-1', name: 'Sarah Connor', email: 's.connor@cyberdyne.org', message: 'Inquiring about team pricing plans for student cohorts. Do you offer bulk premium vouchers?', status: 'unread', timestamp: '18 mins ago' },
    { id: 'msg-2', name: 'Carlos Mendez', email: 'carlos.m@hotmail.com', message: 'My payment processed but my account is still showing Free plan. Order ID is #DODO-981726.', status: 'unread', timestamp: '45 mins ago' },
    { id: 'msg-3', name: 'Liam Neeson', email: 'liam@taken.com', message: 'Do you support CV parser exports directly to LinkedIn XML format? Keep up the good work.', status: 'read', timestamp: '3 hours ago' },
    { id: 'msg-4', name: 'Sophia Loren', email: 'sophia@cinematic.it', message: 'Interested in partnering with ChatCV for our university recruitment drive next semester.', status: 'replied', timestamp: '1 day ago' },
  ];

  const recentErrors: SystemError[] = [
    { id: 'err-1', error: 'LaTeX compiler timed out after 30s limit', path: '/api/resume/compile', count: 18, status: 'active', time: '5 mins ago' },
    { id: 'err-2', error: 'OpenAI RateLimitError: Limit exceeded (RPMS)', path: '/api/chat/message', count: 42, status: 'active', time: '12 mins ago' },
    { id: 'err-3', error: 'DodoPayments Signature mismatch on webhook body', path: '/api/billing/webhook', count: 3, status: 'resolved', time: '1 hour ago' },
    { id: 'err-4', error: 'MongoDB ConnectionPoolLimitExceeded: pool size 100 reached', path: '/api/auth/login', count: 9, status: 'active', time: '2 hours ago' },
    { id: 'err-5', error: 'JWTExpiredError: user token expired in server session middleware', path: '/api/user/profile', count: 124, status: 'resolved', time: '4 hours ago' },
  ];

  const recentActivities: ActivityLog[] = [
    { id: 'act-1', type: 'register', user: 'Alex Rivera', action: 'signed up', detail: 'Created account with Google Auth (Premium Tier)', timestamp: 'Just now', status: 'success' },
    { id: 'act-2', type: 'download', user: 'Marcus Sterling', action: 'downloaded PDF', detail: 'Downloaded file "Software Engineer Resume.pdf"', timestamp: 'Just now', status: 'info' },
    { id: 'act-3', type: 'register', user: 'Priyah Sharma', action: 'signed up', detail: 'Created account with email confirmation (Free Tier)', timestamp: '3 mins ago', status: 'success' },
    { id: 'act-4', type: 'error', user: 'System', action: 'LaTeX Error', detail: 'Compiler timed out on PDF compile requests', timestamp: '5 mins ago', status: 'error' },
    { id: 'act-5', type: 'download', user: 'Jordan Croft', action: 'downloaded LaTeX', detail: 'Downloaded source archive "pm_cv_v2.tar.gz"', timestamp: '8 mins ago', status: 'info' },
    { id: 'act-6', type: 'feedback', user: 'Marcus Sterling', action: 'left feedback', detail: 'Submitted 5-star rating: "The LaTeX compilation was seamless!"', timestamp: '12 mins ago', status: 'success' },
    { id: 'act-7', type: 'error', user: 'System', action: 'OpenAI API Error', detail: 'RateLimitError: model gpt-4o-mini limits reached', timestamp: '12 mins ago', status: 'warning' },
    { id: 'act-8', type: 'contact', user: 'Carlos Mendez', action: 'sent contact inquiry', detail: 'Contact ticket #102: "My payment processed but account still Free"', timestamp: '45 mins ago', status: 'info' },
  ];

  return {
    stats,
    chartData,
    demographics: {
      countries,
      cities,
      devices,
      browsers,
      operatingSystems,
    },
    trafficSources,
    mostVisitedPages,
    topLandingPages,
    avgSessionDuration,
    latestUsers,
    latestDownloads,
    latestFeedback,
    latestMessages,
    recentErrors,
    recentActivities,
  };
};

// Return a random event to append for live updates simulation
export const generateLiveEvent = (): ActivityLog => {
  const types: Array<'register' | 'download' | 'feedback' | 'contact' | 'error'> = [
    'register',
    'download',
    'feedback',
    'contact',
    'error',
  ];
  const type = types[Math.floor(Math.random() * types.length)];
  const id = `act-live-${Math.floor(Math.random() * 10000)}`;

  const names = ['John Doe', 'Sarah Miller', 'David Miller', 'Li Jing', 'Maria Gomez', 'Hans Müller', 'Fatima Al-Sayed'];
  const user = type === 'error' ? 'System' : names[Math.floor(Math.random() * names.length)];

  let action = '';
  let detail = '';
  let status: ActivityLog['status'] = 'info';

  if (type === 'register') {
    const plans = ['Free Tier', 'Premium Tier'];
    const selectedPlan = plans[Math.floor(Math.random() * plans.length)];
    action = 'signed up';
    detail = `Created account with email verification (${selectedPlan})`;
    status = 'success';
  } else if (type === 'download') {
    const formats = ['PDF', 'LaTeX source', 'JSON format'];
    const chosenFormat = formats[Math.floor(Math.random() * formats.length)];
    action = `downloaded ${chosenFormat}`;
    detail = `Downloaded resume file "Resume_2026_${chosenFormat.replace(' ', '_')}"`;
    status = 'info';
  } else if (type === 'feedback') {
    const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars
    action = 'left feedback';
    detail = `Submitted ${rating}-star rating review: "Really helpful AI!"`;
    status = 'success';
  } else if (type === 'contact') {
    action = 'sent contact inquiry';
    detail = `Submitted support ticket: "Question about resume formatting template sizes."`;
    status = 'info';
  } else {
    const errorMsgs = [
      'LaTeX compilation failed on line 42: missing closing brace }',
      'OpenAI API Connection timed out after 10s retry',
      'DodoPayments network request failed on client transaction capture',
      'Auth Token validation error: signature expired',
    ];
    action = 'Error occurred';
    detail = errorMsgs[Math.floor(Math.random() * errorMsgs.length)];
    status = 'error';
  }

  return {
    id,
    type,
    user,
    action,
    detail,
    timestamp: 'Just now',
    status,
  };
};
