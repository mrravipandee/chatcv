import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { adminMiddleware } from '../../middlewares/admin.middleware';
import {
  getDashboardStats,
  getAnalyticsCharts,
  getDemographics,
  getTrafficReferrers,
  getPagesPerformance,
  getRecentActivities,
  getLatestData,
  getSystemErrors,
  resolveError,
  readContactMessage,
  getSeoOverview,
  getSeoDiagnostics,
  getSeoSuggestions,
  triggerSeoAudit,
  getVisitorSessions
} from './admin.controller';

const router = Router();

// Protect all admin routes using JWT and Role checks
router.use(authMiddleware);
router.use(adminMiddleware);

// Overview console routes
router.get('/dashboard-stats', getDashboardStats);
router.get('/analytics-charts', getAnalyticsCharts);
router.get('/demographics', getDemographics);
router.get('/traffic-referrers', getTrafficReferrers);
router.get('/pages-performance', getPagesPerformance);
router.get('/recent-activities', getRecentActivities);
router.get('/latest-data', getLatestData);

// System logs management
router.get('/system-errors', getSystemErrors);
router.post('/resolve-error/:id', resolveError);
router.post('/read-message/:id', readContactMessage);

// SEO audits
router.get('/seo-overview', getSeoOverview);
router.get('/seo-diagnostics', getSeoDiagnostics);
router.get('/seo-suggestions', getSeoSuggestions);
router.post('/seo-audit', triggerSeoAudit);

// Visitor logs
router.get('/visitor-sessions', getVisitorSessions);

export default router;
