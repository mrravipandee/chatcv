import {
  SeoChartPoint,
  SeoStatCard,
  KeywordItem,
  CoreWebVitalsData,
  CrawlDiagnostic,
  MetaIssue,
  SchemaItem,
  SeoSuggestion,
  QueryRecord,
  DemographicRecord,
  SeoSparklinePoint
} from '@/types/seo';

// Helper to generate dates
const getDateAgo = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Seeded random helper
const seedRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const generateSeoData = (range: '7d' | '30d' | '90d') => {
  const pointsCount = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const seed = range === '7d' ? 107 : range === '30d' ? 130 : 190;

  // 1. Generate Search Console Time-series Data
  const chartData: SeoChartPoint[] = [];
  for (let i = 0; i < pointsCount; i++) {
    const s = seedRandom(seed + i);
    const dateStr = getDateAgo(pointsCount - i);

    // Baseline trends: growing organic clicks and impressions
    const baseImpressions = Math.floor(1200 + i * (22 + s * 15) + s * 250);
    const baseCTR = 2.8 + (i / pointsCount) * 0.9 + s * 0.4; // CTR improving
    const baseClicks = Math.floor(baseImpressions * (baseCTR / 100));
    const basePosition = 22.4 - (i / pointsCount) * 4.2 + s * 0.8; // Position climbing (lower is better)

    chartData.push({
      date: dateStr,
      clicks: baseClicks,
      impressions: baseImpressions,
      ctr: Number(baseCTR.toFixed(2)),
      position: Number(basePosition.toFixed(1)),
    });
  }

  // Aggregate stats
  const totalClicks = chartData.reduce((sum, item) => sum + item.clicks, 0);
  const totalImpressions = chartData.reduce((sum, item) => sum + item.impressions, 0);
  const avgCTR = Number((chartData.reduce((sum, item) => sum + item.ctr, 0) / pointsCount).toFixed(2));
  const avgPosition = Number((chartData.reduce((sum, item) => sum + item.position, 0) / pointsCount).toFixed(1));

  const organicVisitors = Math.floor(totalClicks * 1.05); // Visitors ~ 1.05 * GSC clicks (direct bookmark/google referrers)
  const backlinksCount = 1482 + pointsCount * 4;
  const domainAuthority = 26;

  // Helper to make a sparkline
  const makeSparkline = (key: keyof Omit<SeoChartPoint, 'date'>): SeoSparklinePoint[] => {
    return chartData.map((d) => ({
      date: d.date,
      value: d[key] as number,
    }));
  };

  // 2. Overview Stats Cards
  const stats: SeoStatCard[] = [
    {
      id: 'indexed-pages',
      title: 'Indexed Pages',
      value: 62,
      change: '+4 new',
      changeType: 'increase',
      icon: 'FileCode',
      sparkline: Array.from({ length: 10 }).map((_, i) => ({ date: `Wk ${i}`, value: 54 + Math.floor(i * 0.8) })),
      description: 'Sitemap URLs successfully crawled and cached by Googlebot.',
    },
    {
      id: 'blog-posts',
      title: 'Blog Posts',
      value: 14,
      change: '+2 published',
      changeType: 'increase',
      icon: 'BookOpen',
      sparkline: Array.from({ length: 10 }).map((_, i) => ({ date: `Wk ${i}`, value: 10 + Math.floor(i * 0.4) })),
      description: 'Articles active inside the /blog index repository.',
    },
    {
      id: 'ranking-keywords',
      title: 'Keywords Ranking',
      value: 382,
      change: '+14.5%',
      changeType: 'increase',
      icon: 'Hash',
      sparkline: Array.from({ length: 15 }).map((_, i) => ({ date: `D ${i}`, value: 310 + Math.floor(i * 4.8) })),
      description: 'Search queries for which ChatCV ranks in top 100 results.',
    },
    {
      id: 'organic-visitors',
      title: 'Organic Visitors',
      value: organicVisitors.toLocaleString(),
      change: '+18.2%',
      changeType: 'increase',
      icon: 'Globe',
      sparkline: makeSparkline('clicks'),
      description: 'Absolute user visits originating from organic search queries.',
    },
    {
      id: 'avg-ctr',
      title: 'Average CTR',
      value: `${avgCTR}%`,
      change: '+0.4%',
      changeType: 'increase',
      icon: 'Percent',
      sparkline: makeSparkline('ctr'),
      description: 'Average Click-Through Rate across all Search Console results.',
    },
    {
      id: 'avg-position',
      title: 'Avg. Position',
      value: avgPosition,
      change: '-2.1 positions', // lower is better
      changeType: 'increase', // positive outcome
      icon: 'TrendingUp',
      sparkline: makeSparkline('position'),
      description: 'Weighted average position of all keywords in search results.',
    },
    {
      id: 'backlinks',
      title: 'Total Backlinks',
      value: backlinksCount.toLocaleString(),
      change: '+8.3%',
      changeType: 'increase',
      icon: 'Link',
      sparkline: Array.from({ length: 10 }).map((_, i) => ({ date: `Wk ${i}`, value: 1400 + i * 15 })),
      description: 'Total external hyper-links directing traffic to ChatCV.',
    },
    {
      id: 'domain-authority',
      title: 'Domain Authority',
      value: domainAuthority,
      change: '+2 DA',
      changeType: 'increase',
      icon: 'ShieldCheck',
      sparkline: Array.from({ length: 10 }).map((_, i) => ({ date: `Wk ${i}`, value: 24 + Math.floor(i * 0.25) })),
      description: 'Predictive website ranking strength score evaluated out of 100.',
    },
  ];

  // 3. Keyword Tracking Table list
  const keywords: KeywordItem[] = [
    { id: 'kw-1', keyword: 'free ai resume builder', position: 3, previousPosition: 5, volume: 8200, difficulty: 'Hard', traffic: 1250, url: 'https://resumebuilder-chatcv.vercel.app/' },
    { id: 'kw-2', keyword: 'best latex cv maker', position: 2, previousPosition: 1, volume: 2400, difficulty: 'Medium', traffic: 720, url: 'https://resumebuilder-chatcv.vercel.app/resume-examples' },
    { id: 'kw-3', keyword: 'ats friendly resume optimizer', position: 6, previousPosition: 12, volume: 4400, difficulty: 'Hard', traffic: 480, url: 'https://resumebuilder-chatcv.vercel.app/' },
    { id: 'kw-4', keyword: 'interactive resume builder free', position: 8, previousPosition: 7, volume: 1800, difficulty: 'Medium', traffic: 320, url: 'https://resumebuilder-chatcv.vercel.app/' },
    { id: 'kw-5', keyword: 'how to write resume bullet points', position: 11, previousPosition: 18, volume: 5400, difficulty: 'Easy', traffic: 290, url: 'https://resumebuilder-chatcv.vercel.app/blog/ats-friendly-resume' },
    { id: 'kw-6', keyword: 'software engineer latex resume template', position: 4, previousPosition: 4, volume: 1200, difficulty: 'Easy', traffic: 220, url: 'https://resumebuilder-chatcv.vercel.app/resume-examples/software-engineer' },
    { id: 'kw-7', keyword: 'copilot cover letter creator', position: 14, previousPosition: 22, volume: 900, difficulty: 'Medium', traffic: 85, url: 'https://resumebuilder-chatcv.vercel.app/subscribe' },
    { id: 'kw-8', keyword: 'free ats score checker online', position: 17, previousPosition: 16, volume: 3200, difficulty: 'Hard', traffic: 60, url: 'https://resumebuilder-chatcv.vercel.app/blog/free-ai-resume-builder' },
  ];

  // 4. Crawl Diagnostics & Meta issues
  const diagnostics: CrawlDiagnostic[] = [
    { id: 'cd-1', url: '/resume-examples/full-stack-developer', type: '404', detail: 'Linked inside sidebar, but template role name is /resume-examples/fullstack-developer', severity: 'high' },
    { id: 'cd-2', url: '/blog/posts/invalid-image-path', type: 'broken-link', detail: 'Linked image asset "/assets/images/ats-checks.png" returned status 404', source: '/blog/ats-friendly-resume', target: '/assets/images/ats-checks.png', severity: 'medium' },
    { id: 'cd-3', url: '/login-redirect-loop', type: 'redirect-chain', detail: 'Googlebot encountered redirect loop when fetching login dashboard', source: '/login -> /dashboard -> /login', severity: 'high' },
  ];

  const metaIssues: MetaIssue[] = [
    { id: 'mi-1', url: '/verify-otp', issue: 'missing-title', detail: 'Blank title tag in document head.' },
    { id: 'mi-2', url: '/blog/tag/[tag]', issue: 'duplicate-desc', detail: 'Dynamically generated index posts inherit root blog meta description.' },
    { id: 'mi-3', url: '/resume-examples', issue: 'missing-alt', detail: 'Three layout thumbnail previews render without alternative text attributes.' },
    { id: 'mi-4', url: '/subscribe', issue: 'missing-h1', detail: 'Pricing package headers use <h2> cards directly; missing primary page <h1>.' },
  ];

  const schemaItems: SchemaItem[] = [
    { id: 'sch-1', type: 'Organization Schema', status: 'valid', warningsCount: 0, errorsCount: 0 },
    { id: 'sch-2', type: 'WebSite Schema', status: 'valid', warningsCount: 0, errorsCount: 0 },
    { id: 'sch-3', type: 'SoftwareApplication Schema', status: 'warning', warningsCount: 1, errorsCount: 0 },
    { id: 'sch-4', type: 'Article Schema', status: 'valid', warningsCount: 0, errorsCount: 0 },
  ];

  // 5. Core Web Vitals Gauges
  const coreWebVitals: CoreWebVitalsData = {
    mobile: {
      score: 88,
      lcp: '2.4s', // Need to be under 2.5s for Good (Green)
      cls: 0.12, // Under 0.1 is Good, 0.1-0.25 needs improvement
      inp: '140ms', // Under 200ms is Good
    },
    desktop: {
      score: 98,
      lcp: '0.8s',
      cls: 0.02,
      inp: '45ms',
    },
  };

  // 6. Demographics grids
  const searchQueries: QueryRecord[] = [
    { query: 'free AI resume builder', clicks: Math.floor(totalClicks * 0.16), impressions: Math.floor(totalImpressions * 0.15), ctr: 3.5, position: 2.4 },
    { query: 'latex resume maker', clicks: Math.floor(totalClicks * 0.11), impressions: Math.floor(totalImpressions * 0.09), ctr: 4.1, position: 1.8 },
    { query: 'ATS optimizer online', clicks: Math.floor(totalClicks * 0.08), impressions: Math.floor(totalImpressions * 0.11), ctr: 2.2, position: 5.4 },
    { query: 'ChatGPT resume rewrite', clicks: Math.floor(totalClicks * 0.06), impressions: Math.floor(totalImpressions * 0.08), ctr: 2.8, position: 7.2 },
    { query: 'LaTeX resume generator', clicks: Math.floor(totalClicks * 0.05), impressions: Math.floor(totalImpressions * 0.06), pointer: 3, ctr: 3.1, position: 4.5 } as any,
  ];

  const countries: DemographicRecord[] = [
    { name: 'United States', value: Math.floor(totalClicks * 0.44), percentage: 44 },
    { name: 'India', value: Math.floor(totalClicks * 0.22), percentage: 22 },
    { name: 'United Kingdom', value: Math.floor(totalClicks * 0.08), percentage: 8 },
    { name: 'Canada', value: Math.floor(totalClicks * 0.06), percentage: 6 },
    { name: 'Others', value: Math.floor(totalClicks * 0.20), percentage: 20 },
  ];

  const devices: DemographicRecord[] = [
    { name: 'Desktop', value: Math.floor(totalClicks * 0.72), percentage: 72 },
    { name: 'Mobile', value: Math.floor(totalClicks * 0.24), percentage: 24 },
    { name: 'Tablet', value: Math.floor(totalClicks * 0.04), percentage: 4 },
  ];

  const browsers: DemographicRecord[] = [
    { name: 'Chrome', value: Math.floor(totalClicks * 0.64), percentage: 64 },
    { name: 'Safari', value: Math.floor(totalClicks * 0.20), percentage: 20 },
    { name: 'Firefox', value: Math.floor(totalClicks * 0.09), percentage: 9 },
    { name: 'Edge', value: Math.floor(totalClicks * 0.07), percentage: 7 },
  ];

  // 7. Page performance logs
  const topPerformingPages = [
    { path: '/', clicks: Math.floor(totalClicks * 0.52), impressions: Math.floor(totalImpressions * 0.55), ctr: '3.4%', pos: 4.2 },
    { path: '/resume-examples', clicks: Math.floor(totalClicks * 0.22), impressions: Math.floor(totalImpressions * 0.20), ctr: '3.6%', pos: 2.8 },
    { path: '/blog/ats-friendly-resume', clicks: Math.floor(totalClicks * 0.14), impressions: Math.floor(totalImpressions * 0.12), ctr: '3.1%', pos: 8.5 },
  ];

  const worstPerformingPages = [
    { path: '/subscribe', clicks: Math.floor(totalClicks * 0.01), impressions: Math.floor(totalImpressions * 0.04), ctr: '0.8%', pos: 28.4 },
    { path: '/verify-otp', clicks: 0, impressions: 420, ctr: '0.0%', pos: 84.2 },
    { path: '/login', clicks: Math.floor(totalClicks * 0.02), impressions: Math.floor(totalImpressions * 0.05), ctr: '1.2%', pos: 14.5 },
  ];

  // 8. Technical SEO score computation
  // Start with 100, deduct points for open diagnostics and meta issues
  const metaIssuesCount = metaIssues.length;
  const diagnosticsCount = diagnostics.length;
  const speedAvg = (coreWebVitals.mobile.score + coreWebVitals.desktop.score) / 2;
  const technicalSeoScore = Math.floor(100 - (metaIssuesCount * 3) - (diagnosticsCount * 8) - ((100 - speedAvg) * 0.2));

  // 9. AI SEO Recommendations
  const defaultSuggestions: SeoSuggestion[] = [
    {
      id: 'sug-1',
      title: 'Fix redirect chain loop on Auth gate',
      page: '/login-redirect-loop',
      action: 'Check auth gate redirection logic. Ensure user dashboard redirect is not bouncing session queries back to /login.',
      impact: 'High',
      category: 'Technical',
    },
    {
      id: 'sug-2',
      title: 'Add alternative text attributes to template cards',
      page: '/resume-examples',
      action: 'Add meaningful alt strings to LaTeX layout thumbnails. Use keywords like "Classic latex resume preview format".',
      impact: 'Medium',
      category: 'Technical',
    },
    {
      id: 'sug-3',
      title: 'Expand content for "free ats score checker online"',
      page: '/blog/free-ai-resume-builder',
      action: 'This page ranks #17. Add a dedicated FAQ section on "how to score resume files for ATS" to boost positions into top 10.',
      impact: 'High',
      category: 'Content',
    },
    {
      id: 'sug-4',
      title: 'Optimize metadata for tag index pages',
      page: '/blog/tag/[tag]',
      action: 'Dynamically assign tag description meta tags. Replace duplicate descriptions to avoid search queries cannibalization.',
      impact: 'Medium',
      category: 'Technical',
    },
    {
      id: 'sug-5',
      title: 'Inject target H1 tag on subscribing page',
      page: '/subscribe',
      action: 'Replace the package features grid <h2> with a clear main <h1> title "Choose Your ChatCV Premium Plan".',
      impact: 'Medium',
      category: 'Technical',
    },
  ];

  return {
    stats,
    chartData,
    searchConsoleData: {
      clicks: totalClicks,
      impressions: totalImpressions,
      ctr: avgCTR,
      position: avgPosition,
    },
    keywords,
    diagnostics,
    metaIssues,
    schemaItems,
    coreWebVitals,
    demographics: {
      searchQueries,
      countries,
      devices,
      browsers,
    },
    pages: {
      topPerformingPages,
      worstPerformingPages,
    },
    technicalSeoScore,
    suggestions: defaultSuggestions,
  };
};
export const getAiStreamingSuggestions = async (
  onChunk: (text: string) => void,
  onFinished: (suggestions: SeoSuggestion[]) => void
) => {
  const suggestionsText = [
    "🤖 **AI SEO Audit Engine Initialized**...\n",
    "🔍 *Scanning active sitemaps and index logs*...\n",
    "🛠️ **Crawling HTML tags on 62 dynamic URLs**...\n\n",
    "📈 **Audit Findings and Recommendations:**\n\n",
    "### 1. High Impact: Resolve Redirect Chain Loop\n",
    "- **Target Path**: `/login-redirect-loop`\n",
    "- **Action Required**: Clear session cookie validations in client middleware. Googlebot abandoned index paths due to redirect loops.\n\n",
    "### 2. High Impact: Keyword Boost for \"free ats score checker online\"\n",
    "- **Target Path**: `/blog/free-ai-resume-builder`\n",
    "- **Action Required**: Currently ranking #17. Incorporate H2 subheaders containing \"Best Free ATS Scanner Checkers\" and add 350 words of FAQ text to force indexing into page 1.\n\n",
    "### 3. Medium Impact: Missing Alt Tags on Images\n",
    "- **Target Path**: `/resume-examples`\n",
    "- **Action Required**: Renders 3 layout icons without alternative text. Update images with `alt=\"ATS compliant software engineer resume format preview\"`.\n\n",
    "### 4. Medium Impact: Missing H1 elements on pricing tables\n",
    "- **Target Path**: `/subscribe`\n",
    "- **Action Required**: Structure headers correctly. Nest sitemap title inside a primary `<h1>` element."
  ];

  const simulatedSuggestions: SeoSuggestion[] = [
    {
      id: 'sug-ai-1',
      title: 'Fix redirect chain loop on Auth gate',
      page: '/login-redirect-loop',
      action: 'Clear session validations in client middleware. Googlebot abandoned index paths due to redirect loops.',
      impact: 'High',
      category: 'Technical',
    },
    {
      id: 'sug-ai-2',
      title: 'Keyword Boost for "free ats score checker online"',
      page: '/blog/free-ai-resume-builder',
      action: 'Currently ranking #17. Incorporate H2 subheaders containing "Best Free ATS Scanner Checkers" and add 350 words of FAQ text.',
      impact: 'High',
      category: 'Content',
    },
    {
      id: 'sug-ai-3',
      title: 'Missing Alt Tags on Layout previews',
      page: '/resume-examples',
      action: 'Update preview images with alt="ATS compliant software engineer resume format preview".',
      impact: 'Medium',
      category: 'Technical',
    },
    {
      id: 'sug-ai-4',
      title: 'Missing H1 elements on subscribe page',
      page: '/subscribe',
      action: 'Nest sitemap title inside a primary H1 element.',
      impact: 'Medium',
      category: 'Technical',
    },
  ];

  let cumulativeText = "";
  for (const chunk of suggestionsText) {
    await new Promise((resolve) => setTimeout(resolve, 350)); // Simulating typing speed
    cumulativeText += chunk;
    onChunk(cumulativeText);
  }
  
  onFinished(simulatedSuggestions);
};
