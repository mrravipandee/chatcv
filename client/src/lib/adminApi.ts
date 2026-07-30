import { ApiResponse } from './api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Helper to retrieve auth header
const getHeaders = () => {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

async function fetchAdmin<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...(options.headers as any),
      },
    });

    if (response.status === 401 || response.status === 403) {
      return {
        success: false,
        message: 'Unauthorized. Admin session expired or access forbidden.',
        code: 'UNAUTHORIZED'
      };
    }

    const data = (await response.json()) as ApiResponse<T>;
    return data;
  } catch (error) {
    console.error('[Admin API Error]', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network failure connecting to admin gateway',
      code: 'NETWORK_ERROR'
    };
  }
}

// 1. Dashboard core metrics
export async function getAdminDashboardStats(range: string = '30d'): Promise<ApiResponse<any>> {
  return fetchAdmin(`/api/admin/dashboard-stats?range=${range}`);
}

// 2. Trend curves lists
export async function getAdminAnalyticsCharts(range: string = '30d'): Promise<ApiResponse<any>> {
  return fetchAdmin(`/api/admin/analytics-charts?range=${range}`);
}

// 3. User geolocations shares
export async function getAdminDemographics(range: string = '30d'): Promise<ApiResponse<any>> {
  return fetchAdmin(`/api/admin/demographics?range=${range}`);
}

// 4. Traffic referrals breakdown
export async function getAdminTrafficReferrers(range: string = '30d'): Promise<ApiResponse<any>> {
  return fetchAdmin(`/api/admin/traffic-referrers?range=${range}`);
}

// 5. Popular url logs
export async function getAdminPagesPerformance(range: string = '30d'): Promise<ApiResponse<any>> {
  return fetchAdmin(`/api/admin/pages-performance?range=${range}`);
}

// 6. Recent timeline activities
export async function getAdminRecentActivities(): Promise<ApiResponse<any>> {
  return fetchAdmin(`/api/admin/recent-activities`);
}

// 7. Feedback and contact tables lists
export async function getAdminLatestData(): Promise<ApiResponse<any>> {
  return fetchAdmin(`/api/admin/latest-data`);
}

// 8. Errors logs and resolve events
export async function getAdminSystemErrors(): Promise<ApiResponse<any>> {
  return fetchAdmin(`/api/admin/system-errors`);
}

export async function resolveSystemError(errorId: string): Promise<ApiResponse<any>> {
  return fetchAdmin(`/api/admin/resolve-error/${errorId}`, { method: 'POST' });
}

export async function readContactTicket(ticketId: string): Promise<ApiResponse<any>> {
  return fetchAdmin(`/api/admin/read-message/${ticketId}`, { method: 'POST' });
}

// 9. SEO statistics and Crawl checker triggers
export async function getAdminSeoOverview(): Promise<ApiResponse<any>> {
  return fetchAdmin(`/api/admin/seo-overview`);
}

export async function getAdminSeoDiagnostics(): Promise<ApiResponse<any>> {
  return fetchAdmin(`/api/admin/seo-diagnostics`);
}

export async function getAdminSeoSuggestions(): Promise<ApiResponse<any>> {
  return fetchAdmin(`/api/admin/seo-suggestions`);
}

export async function triggerAdminSeoAudit(): Promise<ApiResponse<any>> {
  return fetchAdmin(`/api/admin/seo-audit`, { method: 'POST' });
}

// 10. Visitor session logs
export async function getAdminVisitorSessions(
  page: number = 1,
  limit: number = 6,
  search: string = '',
  bot: string = '',
  userType: string = '',
  connection: string = ''
): Promise<ApiResponse<any>> {
  const query = `page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&bot=${bot}&userType=${userType}&connection=${connection}`;
  return fetchAdmin(`/api/admin/visitor-sessions?${query}`);
}

// 11. Client visitor tracking POST telemetry script
export async function trackVisitorTelemetry(payload: {
  sessionId: string;
  path: string;
  referrer?: string;
  screenResolution?: string;
  language?: string;
  darkMode?: boolean;
  connectionType?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  scrollPercentage?: number;
  action?: 'Page View' | 'Click' | 'Scroll' | 'Compile PDF' | 'Download' | 'Sign Up';
  detail?: string;
}): Promise<ApiResponse<any>> {
  return fetch(`/api/visitors/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((r) => r.json())
    .catch((err) => ({ success: false, message: err.message, code: 'NETWORK_ERROR' }));
}
