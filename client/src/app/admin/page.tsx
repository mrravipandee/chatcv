'use client';

import React, { useState, useEffect, useRef } from 'react';
import OverviewCards from '@/components/admin/OverviewCards';
import ChartsSection from '@/components/admin/ChartsSection';
import Demographics from '@/components/admin/Demographics';
import RecentActivity from '@/components/admin/RecentActivity';
import {
  getAdminDashboardStats,
  getAdminAnalyticsCharts,
  getAdminDemographics,
  getAdminTrafficReferrers,
  getAdminRecentActivities,
  getAdminLatestData,
  getAdminSystemErrors,
  resolveSystemError,
  readContactTicket,
  getAdminPagesPerformance
} from '@/lib/adminApi';
import { StatCardData, ChartDataPoint, DemographicItem, TrafficSource, ActivityLog, RegisteredUser, ResumeDownload, FeedbackItem, ContactMessage, SystemError, TimeRange, PagePerformance } from '@/types/admin';
import { Download, RefreshCw, Database, Wifi, AlertTriangle, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [liveSync, setLiveSync] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('—');

  // Stats cards state
  const [statsCards, setStatsCards] = useState<StatCardData[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  
  // Demographics tables state
  const [demoAudience, setDemoAudience] = useState<{
    countries: DemographicItem[];
    cities: DemographicItem[];
    devices: DemographicItem[];
    browsers: DemographicItem[];
    operatingSystems: DemographicItem[];
  }>({ countries: [], cities: [], devices: [], browsers: [], operatingSystems: [] });

  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [mostVisitedPages, setMostVisitedPages] = useState<PagePerformance[]>([]);
  const [topLandingPages, setTopLandingPages] = useState<PagePerformance[]>([]);

  // Logs feeds state
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([]);
  const [latestUsers, setLatestUsers] = useState<RegisteredUser[]>([]);
  const [latestDownloads, setLatestDownloads] = useState<ResumeDownload[]>([]);
  const [latestFeedback, setLatestFeedback] = useState<FeedbackItem[]>([]);
  const [latestMessages, setLatestMessages] = useState<ContactMessage[]>([]);
  const [systemErrors, setSystemErrors] = useState<SystemError[]>([]);

  const liveSyncRef = useRef(liveSync);
  liveSyncRef.current = liveSync;

  const loadData = async (range: TimeRange) => {
    try {
      setHasError(false);
      setIsLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Query in parallel
      const [
        statsRes,
        chartsRes,
        demoRes,
        trafficRes,
        activitiesRes,
        latestRes,
        errorsRes,
        pagesRes
      ] = await Promise.all([
        getAdminDashboardStats(range),
        getAdminAnalyticsCharts(range),
        getAdminDemographics(range),
        getAdminTrafficReferrers(range),
        getAdminRecentActivities(),
        getAdminLatestData(),
        getAdminSystemErrors(),
        getAdminPagesPerformance(range)
      ]);

      // Check authorization bounds
      if (
        (!statsRes.success && statsRes.code === 'UNAUTHORIZED') ||
        (!chartsRes.success && chartsRes.code === 'UNAUTHORIZED') ||
        (!errorsRes.success && errorsRes.code === 'UNAUTHORIZED') ||
        (!pagesRes.success && pagesRes.code === 'UNAUTHORIZED')
      ) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (
        !statsRes.success ||
        !chartsRes.success ||
        !demoRes.success ||
        !trafficRes.success ||
        !activitiesRes.success ||
        !latestRes.success ||
        !errorsRes.success ||
        !pagesRes.success
      ) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      // 1. Process Chart Trend Points
      const rawCharts = (chartsRes.data || []) as any[];
      const mappedCharts: ChartDataPoint[] = rawCharts.map((item) => ({
        date: item.date,
        visitors: item.visitors || 0,
        resumes: item.resumes || 0,
        users: item.users || 0,
        downloads: item.downloads || 0,
        aiMessages: item.aiUsage || 0
      }));
      setChartData(mappedCharts);

      // 2. Build Sparkline data helpers
      const getSpark = (key: keyof Omit<ChartDataPoint, 'date'>) => {
        return mappedCharts.map((pt) => ({
          date: pt.date,
          value: pt[key]
        }));
      };

      // 3. Populate Stats Cards
      const rawStats = statsRes.data;
      const statsList: StatCardData[] = [
        {
          id: 'total-users',
          title: 'Total Users',
          value: rawStats.totalUsers.value.toLocaleString(),
          change: `${rawStats.totalUsers.growth >= 0 ? '+' : ''}${rawStats.totalUsers.growth}%`,
          changeType: rawStats.totalUsers.growth > 0 ? 'increase' : rawStats.totalUsers.growth < 0 ? 'decrease' : 'neutral',
          icon: 'Users',
          description: 'Total active users registered',
          sparkline: getSpark('users')
        },
        {
          id: 'total-visitors',
          title: 'Total Visitors',
          value: rawStats.totalVisitors.value.toLocaleString(),
          change: `${rawStats.totalVisitors.growth >= 0 ? '+' : ''}${rawStats.totalVisitors.growth}%`,
          changeType: rawStats.totalVisitors.growth > 0 ? 'increase' : rawStats.totalVisitors.growth < 0 ? 'decrease' : 'neutral',
          icon: 'Eye',
          description: 'Unique traffic sessions logged',
          sparkline: getSpark('visitors')
        },
        {
          id: 'total-resumes',
          title: 'Total Resumes',
          value: rawStats.totalResumes.value.toLocaleString(),
          change: `${rawStats.totalResumes.growth >= 0 ? '+' : ''}${rawStats.totalResumes.growth}%`,
          changeType: rawStats.totalResumes.growth > 0 ? 'increase' : rawStats.totalResumes.growth < 0 ? 'decrease' : 'neutral',
          icon: 'FileCode',
          description: 'Created PDF document variants',
          sparkline: getSpark('resumes')
        },
        {
          id: 'total-downloads',
          title: 'Downloads Rate',
          value: rawStats.totalDownloads.value.toLocaleString(),
          change: `${rawStats.totalDownloads.growth >= 0 ? '+' : ''}${rawStats.totalDownloads.growth}%`,
          changeType: rawStats.totalDownloads.growth > 0 ? 'increase' : rawStats.totalDownloads.growth < 0 ? 'decrease' : 'neutral',
          icon: 'Download',
          description: 'Successful file exports downloaded',
          sparkline: getSpark('downloads')
        },
        {
          id: 'total-messages',
          title: 'AI Chats Usage',
          value: rawStats.aiMessages.value.toLocaleString(),
          change: `${rawStats.aiMessages.growth >= 0 ? '+' : ''}${rawStats.aiMessages.growth}%`,
          changeType: rawStats.aiMessages.growth > 0 ? 'increase' : rawStats.aiMessages.growth < 0 ? 'decrease' : 'neutral',
          icon: 'MessageSquareCode',
          description: 'Consultant prompts executed',
          sparkline: getSpark('aiMessages')
        },
        {
          id: 'conversion-rate',
          title: 'Conversion Rate',
          value: `${rawStats.conversionRate.value}%`,
          change: `${rawStats.conversionRate.growth >= 0 ? '+' : ''}${rawStats.conversionRate.growth}%`,
          changeType: rawStats.conversionRate.growth > 0 ? 'increase' : rawStats.conversionRate.growth < 0 ? 'decrease' : 'neutral',
          icon: 'TrendingUp',
          description: 'Visitors converted to active accounts',
          sparkline: []
        }
      ];
      setStatsCards(statsList);

      // 4. Process Demographics
      const demoData = demoRes.data || { countries: [], cities: [], devices: [], browsers: [], operatingSystems: [] };
      const trafficData = trafficRes.data || [];
      
      setDemoAudience({
        countries: demoData.countries || [],
        cities: demoData.cities || [],
        devices: demoData.devices || [],
        browsers: demoData.browsers || [],
        operatingSystems: demoData.operatingSystems || []
      });

      setTrafficSources(
        trafficData.map((t: any) => ({
          source: t.source,
          sessions: t.visitors,
          visitors: t.visitors,
          bounceRate: '35%',
          conversionRate: `${t.conversionRate}%`
        }))
      );

      const rawPages = pagesRes.data || { popular: [], entry: [], exit: [] };
      setMostVisitedPages(
        (rawPages.popular || []).map((p: any) => ({
          path: p.path,
          views: p.views,
          uniqueVisitors: p.visitors,
          avgDuration: p.time
        }))
      );

      setTopLandingPages(
        (rawPages.entry || []).map((e: any) => ({
          path: e.path,
          views: e.views,
          uniqueVisitors: e.views,
          avgDuration: '1m 10s'
        }))
      );

      // 5. Process Feeds and timelines
      setRecentActivities(activitiesRes.data || []);
      const latestObj = latestRes.data || { users: [], feedback: [], tickets: [] };
      
      setLatestUsers(
        (latestObj.users || []).map((u: any) => ({
          id: u._id,
          name: u.name || 'Anonymous',
          email: u.email,
          plan: u.membership === 'premium' ? 'Premium' : 'Free',
          date: new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }))
      );

      setLatestDownloads(
        (latestObj.downloads || []).map((d: any) => ({
          id: d._id,
          title: d.title || 'Resume File PDF',
          format: d.format || 'PDF',
          userEmail: d.userEmail,
          timestamp: new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }))
      );

      setLatestFeedback(
        (latestObj.feedback || []).map((f: any) => ({
          id: f._id,
          name: f.name,
          email: f.email,
          rating: f.rating,
          comment: f.comment,
          timestamp: new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }))
      );

      setLatestMessages(
        (latestObj.tickets || []).map((t: any) => ({
          id: t._id,
          name: t.name,
          email: t.email,
          message: t.message,
          status: t.status,
          timestamp: new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }))
      );

      setSystemErrors(
        (errorsRes.data || []).map((e: any) => ({
          id: e._id,
          error: e.error,
          path: e.path,
          count: e.count,
          status: e.status,
          time: new Date(e.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }))
      );

      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      setIsLoading(false);
    } catch (err) {
      console.error('[Dashboard fetch err]', err);
      setHasError(true);
      setIsLoading(false);
    }
  };

  // Resolve system exceptions
  const handleResolveError = async (id: string) => {
    const res = await resolveSystemError(id);
    if (res.success) {
      setSystemErrors((prev) => prev.filter((e) => e.id !== id));
    }
  };

  // Mark contact tickets as read
  const handleReadMessage = async (id: string) => {
    const res = await readContactTicket(id);
    if (res.success) {
      setLatestMessages((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: 'read' as const } : t))
      );
    }
  };

  // CSV download trigger
  const handleExportCSV = () => {
    const headers = ['Date', 'Visitors', 'Signups', 'Resumes Created', 'Downloads', 'AI Messages'];
    const rows = [
      headers,
      ...chartData.map((pt) => [
        pt.date,
        pt.visitors,
        pt.users,
        pt.resumes,
        pt.downloads,
        pt.aiMessages
      ])
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `chatcv_performance_report_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sync range changes
  useEffect(() => {
    loadData(timeRange);
  }, [timeRange]);

  // Real-time synchronization simulated sockets telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      if (!liveSyncRef.current || isLoading || hasError) return;
      loadData(timeRange);
    }, 15000); // sync every 15s

    return () => clearInterval(interval);
  }, [timeRange, isLoading, hasError]);

  if (hasError) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-6 text-center space-y-4 dark:border-zinc-800 dark:bg-zinc-950">
        <AlertTriangle className="h-10 w-10 text-red-500" />
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Failed to sync with API Server</h2>
        <p className="text-xs text-zinc-400 max-w-sm">
          Please check that your backend Express server is running, the MongoDB connection is alive, and your token is valid.
        </p>
        <button
          onClick={() => loadData(timeRange)}
          className="rounded-lg bg-zinc-950 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 py-6 pb-12 transition-colors duration-200">
      <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white px-6 py-6 shadow-2xs dark:border-zinc-900 dark:bg-zinc-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,255,156,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.08),transparent_28%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-2xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              ChatCV Live Command Center
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                Real-time resume platform activity, generated from live ChatCV APIs.
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
                Track registrations, resume creation, downloads, AI usage, support activity, and system health in one live view.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-2xs text-zinc-500 dark:text-zinc-400">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-900/70">
                <Database className="h-3.5 w-3.5 text-emerald-500" />
                API connected
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-900/70">
                <Wifi className={`h-3.5 w-3.5 ${liveSync ? 'animate-pulse text-emerald-500' : 'text-zinc-400'}`} />
                {liveSync ? 'Live sync enabled' : 'Live sync paused'}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-900/70">
                Last updated {lastUpdated}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setLiveSync(!liveSync)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-2xs font-semibold transition-all ${
                liveSync
                  ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-600 dark:text-emerald-450'
                  : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900'
              }`}
            >
              <Wifi className={`h-3.5 w-3.5 ${liveSync ? 'animate-pulse' : ''}`} />
              {liveSync ? 'Real-Time Syncing' : 'Sync Paused'}
            </button>

            <button
              onClick={() => loadData(timeRange)}
              disabled={isLoading}
              className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-zinc-200 text-zinc-650 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <div className="flex rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-900">
              {([
                { label: '7 Days', val: '7d' },
                { label: '30 Days', val: '30d' },
                { label: '90 Days', val: '90d' }
              ] as Array<{ label: string; val: TimeRange }>).map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setTimeRange(opt.val)}
                  className={`rounded-md px-3 py-1 text-2xs font-medium transition-all ${
                    timeRange === opt.val
                      ? 'bg-white text-zinc-950 shadow-3xs dark:bg-zinc-950 dark:text-zinc-50'
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-250'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Registrations', value: statsCards.find((card) => card.id === 'total-users')?.value || '0', hint: 'Live account growth' },
          { label: 'Resumes created', value: statsCards.find((card) => card.id === 'total-resumes')?.value || '0', hint: 'Compiled documents' },
          { label: 'PDF downloads', value: statsCards.find((card) => card.id === 'total-downloads')?.value || '0', hint: 'Exports and shares' },
          { label: 'AI chats', value: statsCards.find((card) => card.id === 'total-messages')?.value || '0', hint: 'Assistant interactions' }
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-900 dark:bg-zinc-950">
            <p className="text-2xs font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{item.value}</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{item.hint}</p>
          </div>
        ))}
      </section>

      {/* Stats Cards Row */}
      <OverviewCards stats={statsCards} isLoading={isLoading} />

      {/* Main Charts Area */}
      <ChartsSection
        data={chartData}
        isLoading={isLoading}
        onExportCSV={handleExportCSV}
      />

      {/* Demographics Columns grid */}
      <Demographics
        demographics={demoAudience}
        trafficSources={trafficSources}
        mostVisitedPages={mostVisitedPages}
        topLandingPages={topLandingPages}
        avgSessionDuration="2m 15s"
        isLoading={isLoading}
      />

      {/* Recent Activities Lists tables */}
      <RecentActivity
        activities={recentActivities}
        users={latestUsers}
        downloads={latestDownloads}
        feedback={latestFeedback}
        messages={latestMessages}
        errors={systemErrors}
        onResolveError={handleResolveError}
        onMarkMessageRead={handleReadMessage}
        isLoading={isLoading}
      />

      {/* Footer system status */}
      <footer className="mt-12 flex items-center justify-between border-t border-zinc-200 pt-6 text-[10px] text-zinc-400 dark:border-zinc-900 dark:text-zinc-650">
        <div className="flex items-center gap-1.5">
          <Database className="h-3.5 w-3.5 text-[#00ff9c] animate-pulse" />
          <span>ChatCV live admin view. Powered by MongoDB aggregation engines and API telemetry.</span>
        </div>
        <div>
          <span>API Server: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}</span>
        </div>
      </footer>

    </div>
  );
}
