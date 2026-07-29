'use client';

import React, { useState, useEffect, useRef } from 'react';
import OverviewCards from '@/components/admin/OverviewCards';
import ChartsSection from '@/components/admin/ChartsSection';
import Demographics from '@/components/admin/Demographics';
import RecentActivity from '@/components/admin/RecentActivity';
import { generateDashboardData, generateLiveEvent } from '@/lib/adminData';
import { TimeRange, ActivityLog, ContactMessage, SystemError } from '@/types/admin';
import { Download, RefreshCw, Sparkles, Database, Wifi } from 'lucide-react';

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [liveSync, setLiveSync] = useState(true);
  
  // Dashboard mock data state
  const [dashboardData, setDashboardData] = useState(() => generateDashboardData('30d'));
  
  const liveSyncRef = useRef(liveSync);
  liveSyncRef.current = liveSync;

  // Trigger reloading shimmer skeleton
  const handleReload = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDashboardData(generateDashboardData(timeRange));
      setIsLoading(false);
    }, 900);
  };

  // Re-generate mock data when time range switches
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setDashboardData(generateDashboardData(timeRange));
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [timeRange]);

  // Live updates simulator interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (!liveSyncRef.current) return;

      // Generate a new random activity log
      const newEvent = generateLiveEvent();
      
      setDashboardData((prev) => {
        // Prepend event
        const updatedActivities = [newEvent, ...prev.recentActivities].slice(0, 15);
        
        // Slightly increment overview metrics to simulate active data ticking
        const updatedStats = prev.stats.map((stat) => {
          if (stat.id === 'total-visitors') {
            return { ...stat, value: (parseInt(String(stat.value).replace(/,/g, '')) + 1).toLocaleString() };
          }
          if (stat.id === 'total-messages' && newEvent.type === 'feedback') {
            return { ...stat, value: (parseInt(String(stat.value).replace(/,/g, '')) + 1).toLocaleString() };
          }
          if (stat.id === 'total-downloads' && newEvent.type === 'download') {
            return { ...stat, value: (parseInt(String(stat.value).replace(/,/g, '')) + 1).toLocaleString() };
          }
          if (stat.id === 'total-users' && newEvent.type === 'register') {
            return { ...stat, value: (parseInt(String(stat.value).replace(/,/g, '')) + 1).toLocaleString() };
          }
          return stat;
        });

        // Add to appropriate tables
        let updatedUsers = prev.latestUsers;
        let updatedDownloads = prev.latestDownloads;
        let updatedFeedback = prev.latestFeedback;
        let updatedMessages = prev.latestMessages;
        let updatedErrors = prev.recentErrors;

        if (newEvent.type === 'register') {
          const userObj = {
            id: `usr-live-${Date.now()}`,
            name: newEvent.user,
            email: `${newEvent.user.toLowerCase().replace(/ /g, '')}@gmail.com`,
            plan: (Math.random() > 0.5 ? 'Premium' : 'Free') as 'Premium' | 'Free',
            date: 'Just now',
          };
          updatedUsers = [userObj, ...prev.latestUsers].slice(0, 7);
        } else if (newEvent.type === 'download') {
          const downloadObj = {
            id: `dl-live-${Date.now()}`,
            title: newEvent.detail.split('"')[1] || 'Resume File PDF',
            format: (Math.random() > 0.6 ? 'LaTeX' : 'PDF') as 'PDF' | 'LaTeX',
            userEmail: `${newEvent.user.toLowerCase().replace(/ /g, '')}@gmail.com`,
            timestamp: 'Just now',
          };
          updatedDownloads = [downloadObj, ...prev.latestDownloads].slice(0, 6);
        } else if (newEvent.type === 'feedback') {
          const ratingVal = Math.floor(Math.random() * 2) + 4;
          const feedbackObj = {
            id: `fb-live-${Date.now()}`,
            name: newEvent.user,
            email: `${newEvent.user.toLowerCase().replace(/ /g, '')}@gmail.com`,
            rating: ratingVal,
            comment: newEvent.detail.split('"')[1] || 'Excellent LaTeX output template',
            timestamp: 'Just now',
          };
          updatedFeedback = [feedbackObj, ...prev.latestFeedback].slice(0, 5);
        } else if (newEvent.type === 'error') {
          const errorObj: SystemError = {
            id: `err-live-${Date.now()}`,
            error: newEvent.detail,
            path: '/api/resume/compile',
            count: 1,
            status: 'active',
            time: 'Just now',
          };
          updatedErrors = [errorObj, ...prev.recentErrors].slice(0, 5);
        }

        return {
          ...prev,
          stats: updatedStats,
          recentActivities: updatedActivities,
          latestUsers: updatedUsers,
          latestDownloads: updatedDownloads,
          latestFeedback: updatedFeedback,
          latestMessages: updatedMessages,
          recentErrors: updatedErrors,
        };
      });
    }, 8000); // Trigger live tick event every 8 seconds

    return () => clearInterval(interval);
  }, []);

  // Action: Resolve an active system error from logs panel
  const handleResolveError = (id: string) => {
    setDashboardData((prev) => ({
      ...prev,
      recentErrors: prev.recentErrors.map((err) =>
        err.id === id ? { ...err, status: 'resolved' as const } : err
      ),
    }));
  };

  // Action: Mark an unread message as read
  const handleMarkMessageRead = (id: string) => {
    setDashboardData((prev) => ({
      ...prev,
      latestMessages: prev.latestMessages.map((msg) =>
        msg.id === id ? { ...msg, status: 'read' as const } : msg
      ),
    }));
  };

  // Export mock report (CSV downloads)
  const handleExportCSV = () => {
    const csvContent = [
      ['Metric', 'Current Value'],
      ...dashboardData.stats.map((s) => [s.title, s.value.toString().replace(/,/g, '')]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `chatcv_analytics_report_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 px-6 py-6 pb-12 transition-colors duration-200">
      
      {/* Title & Filter Options bar */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#00ff9c] animate-pulse" />
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Overview Dashboard
            </h1>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Monitor real-time visitors, user conversions, downloads, and platform health.
          </p>
        </div>

        {/* Action controllers */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe Range selector */}
          <div className="flex rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-900 dark:bg-zinc-900/50">
            {(['24h', '7d', '30d', '90d'] as TimeRange[]).map((range) => {
              const active = range === timeRange;
              return (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`rounded-md px-2.5 py-1 text-2xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    active
                      ? 'bg-white text-zinc-950 shadow-3xs dark:bg-zinc-950 dark:text-zinc-50'
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-450 dark:hover:text-zinc-200'
                  }`}
                >
                  {range === '24h' ? '24h' : range === '7d' ? '7d' : range === '30d' ? '30d' : '90d'}
                </button>
              );
            })}
          </div>

          {/* Simulate Refresh / Sync Shimmer toggle */}
          <button
            onClick={handleReload}
            disabled={isLoading}
            className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-zinc-200 text-zinc-650 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900"
            title="Reload mock data"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Live Sync Connection toggle */}
          <button
            onClick={() => setLiveSync(!liveSync)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-2xs font-semibold transition-all ${
              liveSync
                ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-600 dark:text-emerald-450'
                : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900'
            }`}
          >
            <Wifi className={`h-3.5 w-3.5 ${liveSync ? 'animate-pulse' : ''}`} />
            {liveSync ? 'Live Syncing' : 'Sync Paused'}
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

      {/* SECTION 1: Metrics Overview Grid */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-zinc-450 dark:text-zinc-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-500">
            Overview Metrics
          </h2>
        </div>
        <OverviewCards stats={dashboardData.stats} isLoading={isLoading} />
      </section>

      {/* SECTION 2: Analytics Visualization Charts */}
      <section className="mt-8">
        <ChartsSection data={dashboardData.chartData} isLoading={isLoading} />
      </section>

      {/* SECTION 3: Demographics and Real-time Activity listings */}
      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Demographics
          demographics={dashboardData.demographics}
          trafficSources={dashboardData.trafficSources}
          mostVisitedPages={dashboardData.mostVisitedPages}
          topLandingPages={dashboardData.topLandingPages}
          avgSessionDuration={dashboardData.avgSessionDuration}
          isLoading={isLoading}
        />
        <RecentActivity
          activities={dashboardData.recentActivities}
          users={dashboardData.latestUsers}
          downloads={dashboardData.latestDownloads}
          feedback={dashboardData.latestFeedback}
          messages={dashboardData.latestMessages}
          errors={dashboardData.recentErrors}
          onResolveError={handleResolveError}
          onMarkMessageRead={handleMarkMessageRead}
          isLoading={isLoading}
        />
      </div>

      {/* Footer Branding */}
      <footer className="mt-12 flex items-center justify-between border-t border-zinc-200 pt-6 text-[10px] text-zinc-400 dark:border-zinc-900 dark:text-zinc-650">
        <div>ChatCV AI resume compiler platform metrics. All values simulated.</div>
        <div className="flex gap-4">
          <span className="cursor-pointer hover:underline">API Logs</span>
          <span className="cursor-pointer hover:underline">Auth Gateway</span>
        </div>
      </footer>
    </div>
  );
}
