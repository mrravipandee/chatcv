'use client';

import React, { useState } from 'react';
import { DemographicItem, TrafficSource, PagePerformance } from '@/types/admin';
import { Globe, Monitor, ShieldAlert, Navigation, Clock, Link2 } from 'lucide-react';

interface DemographicsProps {
  demographics: {
    countries: DemographicItem[];
    cities: DemographicItem[];
    devices: DemographicItem[];
    browsers: DemographicItem[];
    operatingSystems: DemographicItem[];
  };
  trafficSources: TrafficSource[];
  mostVisitedPages: PagePerformance[];
  topLandingPages: PagePerformance[];
  avgSessionDuration: string;
  isLoading: boolean;
}

type TabType = 'sources' | 'audience' | 'tech' | 'pages';

export default function Demographics({
  demographics,
  trafficSources,
  mostVisitedPages,
  topLandingPages,
  avgSessionDuration,
  isLoading,
}: DemographicsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('sources');

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-10 w-full rounded bg-zinc-100 dark:bg-zinc-900" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="h-64 rounded bg-zinc-50 dark:bg-zinc-900/50" />
            <div className="h-64 rounded bg-zinc-50 dark:bg-zinc-900/50" />
          </div>
        </div>
      </div>
    );
  }

  // Helper to format country flags
  const getFlagEmoji = (countryName: string) => {
    switch (countryName) {
      case 'United States': return '🇺🇸';
      case 'India': return '🇮🇳';
      case 'United Kingdom': return '🇬🇧';
      case 'Canada': return '🇨🇦';
      case 'Germany': return '🇩🇪';
      case 'Australia': return '🇦🇺';
      case 'France': return '🇫🇷';
      default: return '🌐';
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
      {/* Header section with tab control */}
      <div className="flex flex-col border-b border-zinc-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between gap-4 dark:border-zinc-900">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
            Traffic & Demographics
          </h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Detailed breakdown of who is using ChatCV and where they come from.
          </p>
        </div>

        {/* Tab switches */}
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-zinc-100/80 p-1 dark:bg-zinc-900/60 scrollbar-none">
          <button
            onClick={() => setActiveTab('sources')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'sources'
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-950 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Link2 className="h-3.5 w-3.5" /> Referrals
          </button>
          <button
            onClick={() => setActiveTab('audience')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'audience'
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-950 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Globe className="h-3.5 w-3.5" /> Audience Locations
          </button>
          <button
            onClick={() => setActiveTab('tech')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'tech'
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-950 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" /> Systems & Devices
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'pages'
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-950 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Navigation className="h-3.5 w-3.5" /> Visited Pages
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="p-6">
        {/* TAB 1: Traffic Sources / Referrals */}
        {activeTab === 'sources' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 text-2xs font-semibold tracking-wider text-zinc-400 uppercase dark:border-zinc-900 dark:text-zinc-500">
                  <th className="pb-3 font-semibold">Referral Source</th>
                  <th className="pb-3 text-right font-semibold">Sessions</th>
                  <th className="pb-3 text-right font-semibold">Visitors</th>
                  <th className="pb-3 text-right font-semibold">Bounce Rate</th>
                  <th className="pb-3 text-right font-semibold">Conv. Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 text-xs dark:divide-zinc-900/50">
                {trafficSources.map((source, i) => (
                  <tr key={i} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                    <td className="py-3.5 font-medium text-zinc-700 dark:text-zinc-300">
                      {source.source}
                    </td>
                    <td className="py-3.5 text-right font-semibold text-zinc-900 dark:text-zinc-100">
                      {source.sessions.toLocaleString()}
                    </td>
                    <td className="py-3.5 text-right text-zinc-600 dark:text-zinc-400">
                      {source.visitors.toLocaleString()}
                    </td>
                    <td className="py-3.5 text-right text-zinc-500 dark:text-zinc-400">
                      {source.bounceRate}
                    </td>
                    <td className="py-3.5 text-right font-bold text-emerald-600 dark:text-emerald-500">
                      {source.conversionRate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: Audience Locations */}
        {activeTab === 'audience' && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Top Countries */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Top Countries
              </h4>
              <div className="space-y-3.5">
                {demographics.countries.map((country, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        <span className="mr-2">{getFlagEmoji(country.name)}</span>
                        {country.name}
                      </span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                        {country.count.toLocaleString()} ({country.percentage}%)
                      </span>
                    </div>
                    {/* Progress indicator */}
                    <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-900">
                      <div
                        className="h-full rounded-full bg-zinc-900 transition-all dark:bg-[#00ff9c]"
                        style={{ width: `${country.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Cities */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Top Cities
              </h4>
              <div className="space-y-3.5">
                {demographics.cities.map((city, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        📍 {city.name}
                      </span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                        {city.count.toLocaleString()} ({city.percentage}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-900">
                      <div
                        className="h-full rounded-full bg-zinc-500/80 transition-all dark:bg-cyan-500/80"
                        style={{ width: `${city.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Tech Specs */}
        {activeTab === 'tech' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Devices Card */}
            <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4.5 dark:border-zinc-900 dark:bg-zinc-950/20">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Devices Share
              </h4>
              <div className="space-y-3">
                {demographics.devices.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs border-b border-zinc-100 pb-2 last:border-0 last:pb-0 dark:border-zinc-900">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {item.name === 'Desktop' ? '🖥️ Desktop' : item.name === 'Mobile' ? '📱 Mobile' : '📁 Tablet'}
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-200">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Browsers Card */}
            <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4.5 dark:border-zinc-900 dark:bg-zinc-950/20">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Top Browsers
              </h4>
              <div className="space-y-3">
                {demographics.browsers.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs border-b border-zinc-100 pb-2 last:border-0 last:pb-0 dark:border-zinc-900">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      🧭 {item.name}
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-200">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* OS Card */}
            <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4.5 dark:border-zinc-900 dark:bg-zinc-950/20">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Operating Systems
              </h4>
              <div className="space-y-3">
                {demographics.operatingSystems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs border-b border-zinc-100 pb-2 last:border-0 last:pb-0 dark:border-zinc-900">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      ⚙️ {item.name}
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-200">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Page Rankings */}
        {activeTab === 'pages' && (
          <div className="space-y-8">
            {/* Info Summary header card */}
            <div className="flex flex-wrap items-center gap-6 rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-900 dark:bg-zinc-950/20">
              <div className="flex items-center gap-2">
                <Clock className="h-4.5 w-4.5 text-indigo-500" />
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Avg. Session Duration:</span>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{avgSessionDuration}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Most Visited */}
              <div>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Most Visited Pages
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-100 text-3xs font-semibold uppercase tracking-wider text-zinc-400 dark:border-zinc-900 dark:text-zinc-500">
                        <th className="pb-2">Path</th>
                        <th className="pb-2 text-right">Views</th>
                        <th className="pb-2 text-right">Unique</th>
                        <th className="pb-2 text-right">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50 text-2xs dark:divide-zinc-900/40">
                      {mostVisitedPages.map((page, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/5">
                          <td className="py-2.5 font-mono text-zinc-700 dark:text-zinc-350">{page.path}</td>
                          <td className="py-2.5 text-right font-semibold text-zinc-900 dark:text-zinc-200">{page.views.toLocaleString()}</td>
                          <td className="py-2.5 text-right text-zinc-600 dark:text-zinc-350">{page.uniqueVisitors.toLocaleString()}</td>
                          <td className="py-2.5 text-right text-zinc-500 dark:text-zinc-400">{page.avgDuration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Landing Pages */}
              <div>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Top Landing Pages
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-100 text-3xs font-semibold uppercase tracking-wider text-zinc-400 dark:border-zinc-900 dark:text-zinc-500">
                        <th className="pb-2">Path</th>
                        <th className="pb-2 text-right">Views</th>
                        <th className="pb-2 text-right">Unique</th>
                        <th className="pb-2 text-right">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50 text-2xs dark:divide-zinc-900/40">
                      {topLandingPages.map((page, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/5">
                          <td className="py-2.5 font-mono text-zinc-700 dark:text-zinc-350">{page.path}</td>
                          <td className="py-2.5 text-right font-semibold text-zinc-900 dark:text-zinc-200">{page.views.toLocaleString()}</td>
                          <td className="py-2.5 text-right text-zinc-600 dark:text-zinc-350">{page.uniqueVisitors.toLocaleString()}</td>
                          <td className="py-2.5 text-right text-zinc-500 dark:text-zinc-400">{page.avgDuration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
