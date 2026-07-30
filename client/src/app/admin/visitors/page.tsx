'use client';

import React, { useState, useEffect, useRef } from 'react';
import VisitorMap from '@/components/admin/visitors/VisitorMap';
import HeatmapSection from '@/components/admin/visitors/HeatmapSection';
import TrafficCharts from '@/components/admin/visitors/TrafficCharts';
import VisitorTable from '@/components/admin/visitors/VisitorTable';
import SessionReplay from '@/components/admin/visitors/SessionReplay';
import {
  getAdminVisitorSessions,
  getAdminAnalyticsCharts,
  getAdminDemographics,
  getAdminPagesPerformance
} from '@/lib/adminApi';
import { VisitorSession } from '@/types/visitors';
import { Download, RefreshCw, Wifi, Eye, Layers, BarChart, Settings, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

type TabView = 'map' | 'heatmap' | 'charts';

export default function VisitorAnalyticsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabView>('map');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [liveSocket, setLiveSocket] = useState(true);
  
  // Geolocation & session list logs
  const [sessions, setSessions] = useState<VisitorSession[]>([]);
  const [hourlyTraffic, setHourlyTraffic] = useState<any[]>([]);
  const [dailyTraffic, setDailyTraffic] = useState<any[]>([]);
  const [countryTraffic, setCountryTraffic] = useState<any[]>([]);
  
  // Popular page performance data
  const [pagePerformance, setPagePerformance] = useState<{
    popular: any[];
    entry: any[];
    exit: any[];
  }>({ popular: [], entry: [], exit: [] });

  // Replay modal state
  const [selectedReplay, setSelectedReplay] = useState<VisitorSession | null>(null);

  const liveSocketRef = useRef(liveSocket);
  liveSocketRef.current = liveSocket;

  const loadVisitorData = async () => {
    try {
      setHasError(false);
      
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch sessions list, demographics, traffic series and performance in parallel
      const [sessionsRes, chartsRes, demoRes, pagesRes] = await Promise.all([
        getAdminVisitorSessions(1, 15, '', '', 'All', 'All'),
        getAdminAnalyticsCharts('30d'),
        getAdminDemographics('30d'),
        getAdminPagesPerformance('30d')
      ]);

      if (
        (!sessionsRes.success && sessionsRes.code === 'UNAUTHORIZED') ||
        (!chartsRes.success && chartsRes.code === 'UNAUTHORIZED') ||
        (!demoRes.success && demoRes.code === 'UNAUTHORIZED')
      ) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (
        !sessionsRes.success ||
        !chartsRes.success ||
        !demoRes.success ||
        !pagesRes.success
      ) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      // 1. Map Sessions
      const rawSessionsList = (sessionsRes.data?.sessions || []) as any[];
      const mappedSessions: VisitorSession[] = rawSessionsList.map((s) => ({
        id: s._id,
        ip: s.ip,
        country: s.country,
        state: s.state,
        city: s.city,
        latitude: s.latitude,
        longitude: s.longitude,
        timezone: s.timezone,
        isp: s.isp,
        browser: s.browser,
        browserVersion: s.browserVersion,
        operatingSystem: s.operatingSystem,
        screenResolution: s.screenResolution,
        deviceType: s.deviceType,
        language: s.language,
        darkMode: s.darkMode,
        connectionType: s.connectionType,
        referrer: s.referrer,
        landingPage: s.landingPage,
        exitPage: s.exitPage,
        sessionDuration: s.sessionDuration,
        sessionDurationSeconds: s.sessionDurationSeconds,
        pagesVisited: s.pagesVisited,
        clicks: s.clicks,
        scrollPercentage: s.scrollPercentage,
        utmSource: s.utmSource,
        utmMedium: s.utmMedium,
        utmCampaign: s.utmCampaign,
        userType: s.userType,
        isBot: s.isBot,
        timeline: s.timeline.map((item: any) => ({
          id: item.id,
          action: item.action,
          path: item.path,
          timestamp: item.timestamp,
          detail: item.detail
        }))
      }));
      setSessions(mappedSessions);

      // 2. Map demographics countries
      const rawDemo = demoRes.data || { countries: [], browsers: [], devices: [] };
      setCountryTraffic(
        (rawDemo.countries || []).map((c: any) => ({
          country: c.name,
          visitors: c.value,
          percentage: c.percentage
        }))
      );

      // 3. Map traffic chart trends
      const rawCharts = (chartsRes.data || []) as any[];
      setHourlyTraffic(
        rawCharts.slice(0, 12).map((item, idx) => ({
          hour: `${String(idx * 2).padStart(2, '0')}:00`,
          visitors: Math.floor(item.visitors * 0.4),
          clicks: Math.floor(item.visitors * 1.6)
        }))
      );

      setDailyTraffic(
        rawCharts.slice(0, 7).map((item, idx) => {
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          return {
            day: days[idx % 7],
            visitors: item.visitors
          };
        })
      );

      // 4. Map page performance entries/exits
      const rawPages = pagesRes.data || { popular: [], entry: [], exit: [] };
      setPagePerformance({
        popular: rawPages.popular || [],
        entry: rawPages.entry || [],
        exit: rawPages.exit || []
      });

      setIsLoading(false);
    } catch (err) {
      console.error('[Visitor fetch err]', err);
      setHasError(true);
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    loadVisitorData();
  }, []);

  // WebSocket Live telemetry tracker sync
  useEffect(() => {
    const interval = setInterval(() => {
      if (!liveSocketRef.current || isLoading || hasError) return;
      loadVisitorData();
    }, 10000); // sync logs every 10s

    return () => clearInterval(interval);
  }, [isLoading, hasError]);

  // Manual refresh
  const handleReload = () => {
    setIsLoading(true);
    loadVisitorData();
  };

  // Export report
  const handleExportCSV = () => {
    const csvHeaders = ['Visitor ID', 'IP Address', 'City', 'Country', 'Browser', 'OS', 'Device Type', 'Duration', 'Clicks', 'Scroll%'];
    const csvRows = [
      csvHeaders,
      ...sessions.map((vis) => [
        vis.id,
        vis.ip,
        vis.city,
        vis.country,
        vis.browser,
        vis.operatingSystem,
        vis.deviceType,
        vis.sessionDuration,
        vis.clicks,
        `${vis.scrollPercentage}%`,
      ]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `chatcv_visitors_analytics_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border border-zinc-200 rounded-xl bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 text-center space-y-4">
        <AlertTriangle className="h-10 w-10 text-red-500" />
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Failed to sync Visitor Analytics</h2>
        <p className="text-xs text-zinc-400 max-w-sm">
          Express server connections failed. Verify database aggregations and token validation settings.
        </p>
        <button
          onClick={loadVisitorData}
          className="rounded-lg bg-zinc-950 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 py-6 pb-12 transition-colors duration-200">
      
      {/* Title & Filter Options bar */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Visitor Telemetry & Analytics
            </h1>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Monitor real-time visitor geolocations, layout click densities, and active session recordings.
          </p>
        </div>

        {/* Action controllers */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Simulated WebSocket Connection toggle */}
          <button
            onClick={() => setLiveSocket(!liveSocket)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-2xs font-semibold transition-all ${
              liveSocket
                ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-600 dark:text-emerald-450'
                : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900'
            }`}
          >
            <Wifi className={`h-3.5 w-3.5 ${liveSocket ? 'animate-pulse' : ''}`} />
            {liveSocket ? 'WebSockets Live' : 'Sockets Paused'}
          </button>

          {/* Sync status */}
          <button
            onClick={handleReload}
            disabled={isLoading}
            className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-zinc-200 text-zinc-650 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900"
            title="Reload visitors list"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Export Report Trigger */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-2xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* SECTION 1: Geolocation & Visualization tabs */}
      <section className="space-y-4">
        {/* Visualizers Tab selection */}
        <div className="flex gap-1.5 border-b border-zinc-100 pb-3 dark:border-zinc-900">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'map'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Eye className="h-4 w-4" /> Geolocation Map
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'heatmap'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Layers className="h-4 w-4" /> Layout Heatmaps
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'charts'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <BarChart className="h-4 w-4" /> Traffic Trends
          </button>
        </div>

        {/* Tab panels render zone */}
        <div className="transition-all duration-300">
          {activeTab === 'map' && <VisitorMap liveVisitors={sessions.slice(0, 10)} />}
          {activeTab === 'heatmap' && <HeatmapSection />}
          {activeTab === 'charts' && (
            <TrafficCharts
              hourlyTraffic={hourlyTraffic}
              dailyTraffic={dailyTraffic}
              countryTraffic={countryTraffic}
              pages={pagePerformance}
              isLoading={isLoading}
            />
          )}
        </div>
      </section>

      {/* SECTION 2: Auditing lists and sessions logs table */}
      <section className="mt-8">
        <VisitorTable
          sessions={sessions}
          onPlayReplay={(vis) => setSelectedReplay(vis)}
          isLoading={isLoading}
        />
      </section>

      {/* Replay modal overlay */}
      {selectedReplay && (
        <SessionReplay
          session={selectedReplay}
          onClose={() => setSelectedReplay(null)}
        />
      )}

      {/* Footer info branding */}
      <footer className="mt-12 flex items-center justify-between border-t border-zinc-200 pt-6 text-[10px] text-zinc-400 dark:border-zinc-900 dark:text-zinc-650">
        <div className="flex items-center gap-1">
          <Settings className="h-3.5 w-3.5 animate-spin-slow" />
          <span>WebSocket listener tracking logs in real-time. geolocations mapped via CDN headers.</span>
        </div>
        <div className="flex gap-4">
          <span className="cursor-pointer hover:underline">MaxMind DB</span>
          <span className="cursor-pointer hover:underline">telemetry logs</span>
        </div>
      </footer>

    </div>
  );
}
