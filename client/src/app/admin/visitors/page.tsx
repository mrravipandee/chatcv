'use client';

import React, { useState, useEffect, useRef } from 'react';
import VisitorMap from '@/components/admin/visitors/VisitorMap';
import HeatmapSection from '@/components/admin/visitors/HeatmapSection';
import TrafficCharts from '@/components/admin/visitors/TrafficCharts';
import VisitorTable from '@/components/admin/visitors/VisitorTable';
import SessionReplay from '@/components/admin/visitors/SessionReplay';
import {
  generateVisitorSessions,
  generateLiveVisitor,
  generateHourlyTraffic,
  generateDailyTraffic,
  generateMonthlyTraffic,
  generateCountryTraffic,
  generatePopularPages,
  generateEntryPages,
  generateExitPages
} from '@/lib/visitorData';
import { VisitorSession } from '@/types/visitors';
import { Download, RefreshCw, Wifi, Eye, Layers, BarChart, Settings } from 'lucide-react';

type TabView = 'map' | 'heatmap' | 'charts';

export default function VisitorAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabView>('map');
  const [isLoading, setIsLoading] = useState(false);
  const [liveSocket, setLiveSocket] = useState(true);
  
  // Geolocation & session list logs
  const [sessions, setSessions] = useState<VisitorSession[]>([]);
  const [hourlyTraffic, setHourlyTraffic] = useState(() => generateHourlyTraffic());
  const [dailyTraffic, setDailyTraffic] = useState(() => generateDailyTraffic());
  const [monthlyTraffic, setMonthlyTraffic] = useState(() => generateMonthlyTraffic());
  const [countryTraffic, setCountryTraffic] = useState(() => generateCountryTraffic());
  
  // Popular page performance data
  const [pagePerformance, setPagePerformance] = useState(() => ({
    popular: generatePopularPages(),
    entry: generateEntryPages(),
    exit: generateExitPages(),
  }));

  // Replay modal state
  const [selectedReplay, setSelectedReplay] = useState<VisitorSession | null>(null);

  const liveSocketRef = useRef(liveSocket);
  liveSocketRef.current = liveSocket;

  // Initialize data
  useEffect(() => {
    setIsLoading(true);
    setSessions(generateVisitorSessions(15));
    setIsLoading(false);
  }, []);

  // Simulated WebSocket tick logs (Updates every 6 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!liveSocketRef.current) return;

      // 1. Roll dice: add a new visitor or modify existing visitor actions
      const chance = Math.random();
      
      if (chance > 0.45) {
        // Option A: Add a new live visitor session
        const newVis = generateLiveVisitor();
        setSessions((prev) => [newVis, ...prev].slice(0, 30));
        
        // Add country tally count
        setCountryTraffic((prev) => {
          const index = prev.findIndex((c) => c.country === newVis.country);
          if (index !== -1) {
            const copy = [...prev];
            copy[index] = {
              ...copy[index],
              visitors: copy[index].visitors + 1,
            };
            return copy;
          }
          return prev;
        });
      } else {
        // Option B: Simulate clicking actions on an existing live visitor
        setSessions((prev) => {
          if (prev.length === 0) return prev;
          const copy = [...prev];
          const randomIdx = Math.floor(Math.random() * copy.length);
          const target = copy[randomIdx];

          // Increment clicks and scroll percentages
          const updatedVis = {
            ...target,
            clicks: target.clicks + 1,
            scrollPercentage: Math.min(target.scrollPercentage + 10, 100),
            sessionDurationSeconds: target.sessionDurationSeconds + 6,
            sessionDuration: `${Math.floor((target.sessionDurationSeconds + 6) / 60)}m ${(target.sessionDurationSeconds + 6) % 60}s`,
            timeline: [
              ...target.timeline,
              {
                id: `evt-socket-${Date.now()}`,
                action: 'Click' as const,
                path: target.exitPage,
                timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
                detail: 'Simulated WebSocket mouse click interaction',
              },
            ],
          };

          copy[randomIdx] = updatedVis;
          return copy;
        });
      }
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Reload action
  const handleReload = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSessions(generateVisitorSessions(15));
      setHourlyTraffic(generateHourlyTraffic());
      setDailyTraffic(generateDailyTraffic());
      setCountryTraffic(generateCountryTraffic());
      setIsLoading(false);
    }, 850);
  };

  // Export visitor metrics CSV download
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

  // Compute active live visitors (Human users under 2 minutes duration)
  const liveCount = sessions.filter((s) => !s.isBot && s.sessionDurationSeconds < 120).length;

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
