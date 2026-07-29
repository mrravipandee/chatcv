'use client';

import React, { useState, useEffect } from 'react';
import SeoOverview from '@/components/admin/seo/SeoOverview';
import SeoCharts from '@/components/admin/seo/SeoCharts';
import KeywordTracker from '@/components/admin/seo/KeywordTracker';
import TechnicalAudit from '@/components/admin/seo/TechnicalAudit';
import { generateSeoData } from '@/lib/seoData';
import { SeoSuggestion } from '@/types/seo';
import { Download, RefreshCw, Sparkles, BarChart2, ShieldCheck } from 'lucide-react';

export default function SeoDashboardPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [seoData, setSeoData] = useState(() => generateSeoData('30d'));

  // Trigger reloading skeleton
  const handleReload = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSeoData(generateSeoData(timeRange));
      setIsLoading(false);
    }, 850);
  };

  // Re-generate when time range switches
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setSeoData(generateSeoData(timeRange));
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [timeRange]);

  // Callback to update recommendations list from AI Auditor stream
  const handleUpdateSuggestions = (newSuggestions: SeoSuggestion[]) => {
    setSeoData((prev) => ({
      ...prev,
      suggestions: newSuggestions,
    }));
  };

  // Export report as CSV download
  const handleExportCSV = () => {
    const csvContent = [
      ['Metric', 'Value'],
      ...seoData.stats.map((s) => [s.title, s.value.toString().replace(/,/g, '')]),
      ['Technical SEO Score', seoData.technicalSeoScore],
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `chatcv_seo_report_${timeRange}.csv`);
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
            <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-indigo-500 animate-pulse" />
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              SEO Analytics & Console
            </h1>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Audit technical SEO factors, track active keywords positions, and explore AI organic growth ideas.
          </p>
        </div>

        {/* Action controllers */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time range picker */}
          <div className="flex rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-900 dark:bg-zinc-900/50">
            {(['7d', '30d', '90d'] as Array<'7d' | '30d' | '90d'>).map((range) => {
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
                  {range}
                </button>
              );
            })}
          </div>

          {/* Sync status */}
          <button
            onClick={handleReload}
            disabled={isLoading}
            className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-zinc-200 text-zinc-650 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900"
            title="Reload SEO metrics"
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

      {/* SECTION 1: Metrics Overview Grid */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-zinc-450 dark:text-zinc-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-500">
            Organic Traffic Overview
          </h2>
        </div>
        <SeoOverview
          stats={seoData.stats}
          technicalScore={seoData.technicalSeoScore}
          isLoading={isLoading}
        />
      </section>

      {/* SECTION 2: Search Console Curves & Web Vitals Gauges */}
      <section className="mt-8">
        <SeoCharts
          chartData={seoData.chartData}
          coreWebVitals={seoData.coreWebVitals}
          demographics={seoData.demographics}
          isLoading={isLoading}
        />
      </section>

      {/* SECTION 3: Keyword Tracking & Technical Health Logs */}
      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <KeywordTracker
          keywords={seoData.keywords}
          isLoading={isLoading}
        />
        <TechnicalAudit
          diagnostics={seoData.diagnostics}
          metaIssues={seoData.metaIssues}
          schemaItems={seoData.schemaItems}
          suggestions={seoData.suggestions}
          pages={seoData.pages}
          onUpdateSuggestions={handleUpdateSuggestions}
          isLoading={isLoading}
        />
      </div>

      {/* Footer info branding */}
      <footer className="mt-12 flex items-center justify-between border-t border-zinc-200 pt-6 text-[10px] text-zinc-400 dark:border-zinc-900 dark:text-zinc-650">
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Lighthouse & Search Console active telemetry nodes.</span>
        </div>
        <div className="flex gap-4">
          <span className="cursor-pointer hover:underline">XML Sitemap</span>
          <span className="cursor-pointer hover:underline">Google Index API</span>
        </div>
      </footer>
    </div>
  );
}
