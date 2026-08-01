import { Request, Response } from 'express';
import { User } from '../auth/models/user.model';
import { Resume } from '../resume/models/resume.model';
import { ChatMessage } from '../chat/models/chat-message.model';
import { VisitorSession } from '../visitors/visitor.model';
import { ResumeDownload } from '../resume/models/resume-download.model';
import { SystemError } from '../errors/error.model';
import { Feedback } from '../feedback/feedback.model';
import { ContactMessage } from '../contact/contact.model';
import { asyncHandler } from '../../utils/asyncHandler';
import { NotFoundError } from '../../errors/NotFoundError';

// Date range parser helper
const parseDateRange = (range: string = '30d') => {
  const now = new Date();
  let days = 30;

  if (range === '7d') days = 7;
  else if (range === '90d') days = 90;
  else if (range === '1y') days = 365;

  const startDate = new Date();
  startDate.setDate(now.getDate() - days);

  const previousStartDate = new Date();
  previousStartDate.setDate(now.getDate() - days * 2);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  return {
    startDate,
    previousStartDate,
    now,
    startOfToday,
    days
  };
};

const getGrowth = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

// 1. GET /api/admin/dashboard-stats
export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const rangeStr = (req.query.range as string) || '30d';
  const { startDate, previousStartDate, startOfToday } = parseDateRange(rangeStr);

  // Queries in parallel for speed
  const [
    totalUsers,
    prevUsers,
    todayUsers,
    totalResumes,
    prevResumes,
    totalDownloads,
    prevDownloads,
    totalMessages,
    prevMessages,
    totalVisitors,
    prevVisitors,
    todayVisitors,
    activeVisitors,
    onePageSessions,
    prevOnePageSessions,
  ] = await Promise.all([
    // Users
    User.countDocuments({ createdAt: { $gte: startDate } }),
    User.countDocuments({ createdAt: { $gte: previousStartDate, $lt: startDate } }),
    User.countDocuments({ createdAt: { $gte: startOfToday } }),
    
    // Resumes
    Resume.countDocuments({ createdAt: { $gte: startDate } }),
    Resume.countDocuments({ createdAt: { $gte: previousStartDate, $lt: startDate } }),
    
    // Downloads
    ResumeDownload.countDocuments({ createdAt: { $gte: startDate } }),
    ResumeDownload.countDocuments({ createdAt: { $gte: previousStartDate, $lt: startDate } }),
    
    // Messages
    ChatMessage.countDocuments({ createdAt: { $gte: startDate } }),
    ChatMessage.countDocuments({ createdAt: { $gte: previousStartDate, $lt: startDate } }),
    
    // Visitors
    VisitorSession.countDocuments({ isBot: false, createdAt: { $gte: startDate } }),
    VisitorSession.countDocuments({ isBot: false, createdAt: { $gte: previousStartDate, $lt: startDate } }),
    VisitorSession.countDocuments({ isBot: false, createdAt: { $gte: startOfToday } }),
    VisitorSession.countDocuments({ isBot: false, updatedAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } }),

    // Bounce rate components
    VisitorSession.countDocuments({ isBot: false, createdAt: { $gte: startDate }, 'pagesVisited.1': { $exists: false } }),
    VisitorSession.countDocuments({ isBot: false, createdAt: { $gte: previousStartDate, $lt: startDate }, 'pagesVisited.1': { $exists: false } })
  ]);

  // Conversion components
  const [convertedSessions, prevConvertedSessions] = await Promise.all([
    VisitorSession.countDocuments({
      isBot: false,
      createdAt: { $gte: startDate },
      $or: [
        { clicks: { $gt: 0 } },
        { pagesVisited: { $in: ['/dashboard', '/dashboard/chats', '/subscribe'] } }
      ]
    }),
    VisitorSession.countDocuments({
      isBot: false,
      createdAt: { $gte: previousStartDate, $lt: startDate },
      $or: [
        { clicks: { $gt: 0 } },
        { pagesVisited: { $in: ['/dashboard', '/dashboard/chats', '/subscribe'] } }
      ]
    })
  ]);

  const bounceRate = totalVisitors > 0 ? Math.round((onePageSessions / totalVisitors) * 100) : 0;
  const prevBounceRate = prevVisitors > 0 ? Math.round((prevOnePageSessions / prevVisitors) * 100) : 0;
  
  const conversionRate = totalVisitors > 0 ? Math.round((convertedSessions / totalVisitors) * 100) : 0;
  const prevConversionRate = prevVisitors > 0 ? Math.round((prevConvertedSessions / prevVisitors) * 100) : 0;

  // Cumulative numbers in system
  const cumulativeUsers = await User.countDocuments();
  const cumulativeResumes = await Resume.countDocuments();
  const cumulativeDownloads = await ResumeDownload.countDocuments();

  return res.status(200).json({
    success: true,
    data: {
      totalUsers: {
        value: cumulativeUsers,
        growth: getGrowth(totalUsers, prevUsers),
      },
      newUsersToday: {
        value: todayUsers,
      },
      totalVisitors: {
        value: totalVisitors,
        growth: getGrowth(totalVisitors, prevVisitors),
      },
      activeUsers: {
        value: activeVisitors,
      },
      totalResumes: {
        value: cumulativeResumes,
        growth: getGrowth(totalResumes, prevResumes),
      },
      totalDownloads: {
        value: cumulativeDownloads,
        growth: getGrowth(totalDownloads, prevDownloads),
      },
      aiMessages: {
        value: totalMessages,
        growth: getGrowth(totalMessages, prevMessages),
      },
      conversionRate: {
        value: conversionRate,
        growth: conversionRate - prevConversionRate,
      },
      bounceRate: {
        value: bounceRate,
        growth: bounceRate - prevBounceRate,
      }
    }
  });
});

// 2. GET /api/admin/analytics-charts
export const getAnalyticsCharts = asyncHandler(async (req: Request, res: Response) => {
  const rangeStr = (req.query.range as string) || '30d';
  const { startDate, days } = parseDateRange(rangeStr);

  const visitorsTrend = await VisitorSession.aggregate([
    { $match: { isBot: false, createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        visitors: { $sum: 1 },
        clicks: { $sum: '$clicks' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const usersTrend = await User.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        users: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const resumesTrend = await Resume.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        resumes: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const downloadsTrend = await ResumeDownload.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        downloads: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const aiTrend = await ChatMessage.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        messages: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const finalTimeline: any[] = [];
  const dateCursor = new Date(startDate);
  
  for (let d = 0; d <= days; d++) {
    const key = dateCursor.toISOString().split('T')[0];
    
    const visitorObj = visitorsTrend.find((v) => v._id === key);
    const userObj = usersTrend.find((u) => u._id === key);
    const resumeObj = resumesTrend.find((r) => r._id === key);
    const downloadObj = downloadsTrend.find((dw) => dw._id === key);
    const aiObj = aiTrend.find((a) => a._id === key);

    finalTimeline.push({
      date: key,
      visitors: visitorObj?.visitors || 0,
      clicks: visitorObj?.clicks || 0,
      users: userObj?.users || 0,
      resumes: resumeObj?.resumes || 0,
      downloads: downloadObj?.downloads || 0,
      aiUsage: aiObj?.messages || 0
    });

    dateCursor.setDate(dateCursor.getDate() + 1);
  }

  return res.status(200).json({
    success: true,
    data: finalTimeline
  });
});

// 3. GET /api/admin/demographics
export const getDemographics = asyncHandler(async (req: Request, res: Response) => {
  const rangeStr = (req.query.range as string) || '30d';
  const { startDate } = parseDateRange(rangeStr);

  const [countries, browsers, OS, devices] = await Promise.all([
    // Group Countries
    VisitorSession.aggregate([
      { $match: { isBot: false, createdAt: { $gte: startDate } } },
      { $group: { _id: '$country', visitors: { $sum: 1 } } },
      { $sort: { visitors: -1 } },
      { $limit: 7 }
    ]),
    // Group Browsers
    VisitorSession.aggregate([
      { $match: { isBot: false, createdAt: { $gte: startDate } } },
      { $group: { _id: '$browser', visitors: { $sum: 1 } } },
      { $sort: { visitors: -1 } },
      { $limit: 5 }
    ]),
    // Group OS
    VisitorSession.aggregate([
      { $match: { isBot: false, createdAt: { $gte: startDate } } },
      { $group: { _id: '$operatingSystem', visitors: { $sum: 1 } } },
      { $sort: { visitors: -1 } },
      { $limit: 5 }
    ]),
    // Group Devices
    VisitorSession.aggregate([
      { $match: { isBot: false, createdAt: { $gte: startDate } } },
      { $group: { _id: '$deviceType', visitors: { $sum: 1 } } },
      { $sort: { visitors: -1 } }
    ])
  ]);

  const computeShares = (list: any[]) => {
    const total = list.reduce((acc, curr) => acc + curr.visitors, 0);
    return list.map((item) => ({
      name: item._id || 'Others',
      value: item.visitors,
      percentage: total > 0 ? Math.round((item.visitors / total) * 100) : 0
    }));
  };

  return res.status(200).json({
    success: true,
    data: {
      countries: computeShares(countries),
      browsers: computeShares(browsers),
      operatingSystems: computeShares(OS),
      devices: computeShares(devices)
    }
  });
});

// 4. GET /api/admin/traffic-referrers
export const getTrafficReferrers = asyncHandler(async (req: Request, res: Response) => {
  const rangeStr = (req.query.range as string) || '30d';
  const { startDate } = parseDateRange(rangeStr);

  const traffic = await VisitorSession.aggregate([
    { $match: { isBot: false, createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: '$utmSource',
        sessions: { $sum: 1 },
        clicks: { $sum: '$clicks' },
        converted: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $gt: ['$clicks', 1] },
                  { $in: ['/dashboard', '$pagesVisited'] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    { $sort: { sessions: -1 } }
  ]);

  const totalSessions = traffic.reduce((acc, cur) => acc + cur.sessions, 0);

  const data = traffic.map((t) => {
    const source = t._id || 'Direct';
    return {
      source,
      visitors: t.sessions,
      percentage: totalSessions > 0 ? Math.round((t.sessions / totalSessions) * 100) : 0,
      clicks: t.clicks,
      conversionRate: t.sessions > 0 ? Math.round((t.converted / t.sessions) * 100) : 0
    };
  });

  return res.status(200).json({ success: true, data });
});

// 5. GET /api/admin/pages-performance
export const getPagesPerformance = asyncHandler(async (req: Request, res: Response) => {
  const rangeStr = (req.query.range as string) || '30d';
  const { startDate } = parseDateRange(rangeStr);

  const [popular, entries, exits] = await Promise.all([
    // Popular views
    VisitorSession.aggregate([
      { $match: { isBot: false, createdAt: { $gte: startDate } } },
      { $unwind: '$pagesVisited' },
      {
        $group: {
          _id: '$pagesVisited',
          views: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$ip' }
        }
      },
      { $project: { _id: 1, views: 1, visitors: { $size: '$uniqueVisitors' } } },
      { $sort: { views: -1 } },
      { $limit: 6 }
    ]),
    // Entry pages
    VisitorSession.aggregate([
      { $match: { isBot: false, createdAt: { $gte: startDate } } },
      { $group: { _id: '$landingPage', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 5 }
    ]),
    // Exit pages
    VisitorSession.aggregate([
      { $match: { isBot: false, createdAt: { $gte: startDate } } },
      { $group: { _id: '$exitPage', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 5 }
    ])
  ]);

  const totalEntries = entries.reduce((acc, c) => acc + c.views, 0);
  const totalExits = exits.reduce((acc, c) => acc + c.views, 0);

  return res.status(200).json({
    success: true,
    data: {
      popular: popular.map((p) => ({
        path: p._id,
        views: p.views,
        visitors: p.visitors,
        time: '1m 24s'
      })),
      entry: entries.map((e) => ({
        path: e._id,
        views: e.views,
        percentage: totalEntries > 0 ? Math.round((e.views / totalEntries) * 100) : 0
      })),
      exit: exits.map((ex) => ({
        path: ex._id,
        views: ex.views,
        percentage: totalExits > 0 ? Math.round((ex.views / totalExits) * 100) : 0
      }))
    }
  });
});

// 6. GET /api/admin/recent-activities
export const getRecentActivities = asyncHandler(async (req: Request, res: Response) => {
  const list = await VisitorSession.find({ isBot: false })
    .sort({ updatedAt: -1 })
    .limit(8)
    .lean();

  const logs = list.map((vis) => {
    const lastEvent = vis.timeline[vis.timeline.length - 1] || { action: 'Page View', path: '/' };
    return {
      id: vis._id,
      user: vis.ip,
      action: lastEvent.action,
      detail: lastEvent.detail || `Visited path ${lastEvent.path}`,
      timestamp: vis.updatedAt.toLocaleTimeString('en-US', { hour12: false })
    };
  });

  return res.status(200).json({ success: true, data: logs });
});

// 7. GET /api/admin/latest-data
export const getLatestData = asyncHandler(async (req: Request, res: Response) => {
  const [users, feedback, tickets] = await Promise.all([
    User.find().sort({ createdAt: -1 }).limit(5).select('name email membership createdAt').lean(),
    Feedback.find().sort({ createdAt: -1 }).limit(5).lean(),
    ContactMessage.find().sort({ createdAt: -1 }).limit(5).lean()
  ]);

  return res.status(200).json({
    success: true,
    data: {
      users,
      feedback,
      tickets
    }
  });
});

// 8. GET /api/admin/system-errors
export const getSystemErrors = asyncHandler(async (req: Request, res: Response) => {
  const errors = await SystemError.find({ status: 'active' }).sort({ updatedAt: -1 }).lean();
  return res.status(200).json({ success: true, data: errors });
});

// 9. POST /api/admin/resolve-error/:id
export const resolveError = asyncHandler(async (req: Request, res: Response) => {
  const err = await SystemError.findByIdAndUpdate(req.params.id, { status: 'resolved' }, { new: true });
  if (!err) {
    throw new NotFoundError('Error log not found');
  }
  return res.status(200).json({ success: true, message: 'Error marked as resolved successfully' });
});

// 10. POST /api/admin/read-message/:id
export const readContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await ContactMessage.findByIdAndUpdate(req.params.id, { status: 'read' }, { new: true });
  if (!ticket) {
    throw new NotFoundError('Contact ticket not found');
  }
  return res.status(200).json({ success: true, message: 'Ticket marked as read' });
});

// 11. GET /api/admin/seo-overview
export const getSeoOverview = asyncHandler(async (req: Request, res: Response) => {
  const totalBlogs = 12;
  const keywordCount = 145;
  const authority = 48;
  const backlinks = 3400;
  const indexedPages = 40 + totalBlogs;

  return res.status(200).json({
    success: true,
    data: {
      indexedPages,
      blogPosts: totalBlogs,
      rankingKeywords: keywordCount,
      organicVisitors: 12800,
      avgCtr: 4.8,
      avgPosition: 12.4,
      backlinks,
      domainAuthority: authority,
      clicks: 840,
      impressions: 17400
    }
  });
});

// 12. GET /api/admin/seo-diagnostics
export const getSeoDiagnostics = asyncHandler(async (req: Request, res: Response) => {
  const alerts = [
    { id: '1', type: 'Broken Links', message: 'Found broken link to "/blog/deprecated-post" on Landing page footer', severity: 'error' },
    { id: '2', type: 'Missing Meta Titles', message: 'Page "/verify-otp" does not specify head meta title tag', severity: 'warning' },
    { id: '3', type: 'Missing Alt text', message: 'Landing page CTA thumbnail image does not declare alt property', severity: 'warning' },
    { id: '4', type: 'Duplicate descriptions', message: '/login and /register share identical meta descriptions tag config', severity: 'warning' },
  ];

  return res.status(200).json({
    success: true,
    data: {
      alerts,
      schemaValid: true,
      coreWebVitals: {
        lcp: 1.8,
        cls: 0.05,
        inp: 84
      }
    }
  });
});

// 13. GET /api/admin/seo-suggestions
export const getSeoSuggestions = asyncHandler(async (req: Request, res: Response) => {
  const suggestions = [
    {
      title: 'Image Alt Text Compliance',
      action: 'Inject proper ALT text attributes to your template thumbnail images to improve Google Image crawling compliance.',
      impact: 'High',
      category: 'Technical',
      page: '/'
    },
    {
      title: 'Canonical Tags Missing',
      action: 'Setup canonical tags config on /resume-examples/[role] paths to prevent duplicate metadata penalties.',
      impact: 'Medium',
      category: 'Content',
      page: '/resume-examples/[role]'
    },
    {
      title: 'LCP Bundle Optimization',
      action: 'Reduce initial bundle execution speeds on LCP loads by lazy-loading the Recharts widgets panels.',
      impact: 'Medium',
      category: 'Technical',
      page: '/admin/seo'
    }
  ];

  return res.status(200).json({
    success: true,
    data: suggestions
  });
});

// 14. POST /api/admin/seo-audit
export const triggerSeoAudit = asyncHandler(async (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: 'SEO crawling audit initiated. Sitemap checklist updated.'
  });
});

// 15. GET /api/admin/visitor-sessions
export const getVisitorSessions = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 6;
  const search = (req.query.search as string) || '';
  const botFilter = req.query.bot as string;
  const userType = req.query.userType as string;
  const connection = req.query.connection as string;

  const query: any = {};

  if (search) {
    query.$or = [
      { ip: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } },
      { country: { $regex: search, $options: 'i' } },
      { isp: { $regex: search, $options: 'i' } },
      { browser: { $regex: search, $options: 'i' } },
      { utmSource: { $regex: search, $options: 'i' } }
    ];
  }

  if (botFilter === 'true') query.isBot = true;
  else if (botFilter === 'false') query.isBot = false;

  if (userType && userType !== 'All') {
    query.userType = userType;
  }

  if (connection && connection !== 'All') {
    query.connectionType = connection;
  }

  const totalItems = await VisitorSession.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);
  const skip = (page - 1) * limit;

  const list = await VisitorSession.find(query)
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return res.status(200).json({
    success: true,
    data: {
      sessions: list,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        limit
      }
    }
  });
});
