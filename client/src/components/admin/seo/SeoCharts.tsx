'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { SeoChartPoint, CoreWebVitalsData, QueryRecord, DemographicRecord } from '@/types/seo';
import { Monitor, Smartphone, Cpu, ShieldCheck, Gauge, HelpCircle } from 'lucide-react';

interface SeoChartsProps {
  chartData: SeoChartPoint[];
  coreWebVitals: CoreWebVitalsData;
  demographics?: {
    searchQueries: QueryRecord[];
    countries: DemographicRecord[];
    devices: DemographicRecord[];
    browsers: DemographicRecord[];
  };
  isLoading: boolean;
}

type SpeedTab = 'mobile' | 'desktop';

export default function SeoCharts({
  chartData,
  coreWebVitals,
  demographics,
  isLoading,
}: SeoChartsProps) {
  const [speedTab, setSpeedTab] = useState<SpeedTab>('desktop');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-72 rounded bg-zinc-100 dark:bg-zinc-900" />
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-72 rounded bg-zinc-100 dark:bg-zinc-900" />
          </div>
        </div>
      </div>
    );
  }

  const speedData = speedTab === 'mobile' ? coreWebVitals.mobile : coreWebVitals.desktop;

  // Custom tooltips matching Apple/Vercel styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-zinc-200/80 bg-white/95 p-3 shadow-md backdrop-blur-xs dark:border-zinc-850/80 dark:bg-zinc-950/95">
          <p className="text-3xs font-semibold text-zinc-500 uppercase dark:text-zinc-400">{label}</p>
          <div className="mt-1.5 space-y-1 text-xs">
            {payload.map((pld: any) => (
              <div key={pld.name} className="flex items-center gap-4 justify-between">
                <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-300">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: pld.fill || pld.stroke }}
                  />
                  {pld.name === 'clicks' ? 'Clicks' : 'Impressions'}
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-50">
                  {pld.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const getMetricClass = (score: number) => {
    if (score >= 90) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20';
    if (score >= 50) return 'text-amber-500 bg-amber-50 dark:bg-amber-950/20';
    return 'text-red-500 bg-red-50 dark:bg-red-950/20';
  };

  const getMetricBorderClass = (score: number) => {
    if (score >= 90) return 'border-emerald-500';
    if (score >= 50) return 'border-amber-500';
    return 'border-red-500';
  };

  const getVitalColor = (value: number | string, type: 'lcp' | 'cls' | 'inp') => {
    if (type === 'cls') {
      const clsVal = Number(value);
      if (clsVal <= 0.1) return 'text-emerald-500 dark:text-emerald-400';
      if (clsVal <= 0.25) return 'text-amber-500 dark:text-amber-400';
      return 'text-red-500 dark:text-red-400';
    }
    if (type === 'lcp') {
      const lcpSec = parseFloat(value as string);
      if (lcpSec <= 2.5) return 'text-emerald-500 dark:text-emerald-400';
      if (lcpSec <= 4.0) return 'text-amber-500 dark:text-amber-400';
      return 'text-red-500 dark:text-red-400';
    }
    // INP
    const inpMs = parseInt((value as string).replace('ms', ''));
    if (inpMs <= 200) return 'text-emerald-500 dark:text-emerald-400';
    if (inpMs <= 500) return 'text-amber-500 dark:text-amber-400';
    return 'text-red-500 dark:text-red-400';
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* 1. Google Search Console clicks/impressions line chart */}
      <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-150/40 pb-5 dark:border-zinc-900">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              Google Search Console Performance
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Double-axes representation of CTR clicks vs query impressions.
            </p>
          </div>
          <div className="flex gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1 text-blue-500">
              <span className="h-2 w-2 rounded-full bg-blue-500" /> Clicks
            </span>
            <span className="flex items-center gap-1 text-purple-500">
              <span className="h-2 w-2 rounded-full bg-purple-500" /> Impressions
            </span>
          </div>
        </div>

        {/* Recharts graph */}
        <div className="mt-6 h-72 w-full text-xs">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: -10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSeoClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSeoImpressions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-900" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#888888" tickMargin={8} />
                <YAxis yAxisId="left" tickLine={false} axisLine={false} stroke="#3b82f6" tickMargin={8} />
                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} stroke="#a855f7" tickMargin={8} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  name="clicks"
                  dataKey="clicks"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSeoClicks)"
                  activeDot={{ r: 4, strokeWidth: 0, fill: '#3b82f6' }}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  name="impressions"
                  dataKey="impressions"
                  stroke="#a855f7"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorSeoImpressions)"
                  activeDot={{ r: 4, strokeWidth: 0, fill: '#a855f7' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <p className="text-zinc-400">Loading charts...</p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Page Speed & Core Web Vitals audit panel */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-150/40 pb-5 dark:border-zinc-900">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              Core Web Vitals
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Lighthouse loading speeds audits.
            </p>
          </div>

          {/* Device Tabs */}
          <div className="flex rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-900">
            <button
              onClick={() => setSpeedTab('desktop')}
              className={`rounded-md p-1.5 text-zinc-500 transition-colors ${
                speedTab === 'desktop'
                  ? 'bg-white text-zinc-950 shadow-3xs dark:bg-zinc-950 dark:text-zinc-50'
                  : 'hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              title="Desktop Performance"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setSpeedTab('mobile')}
              className={`rounded-md p-1.5 text-zinc-500 transition-colors ${
                speedTab === 'mobile'
                  ? 'bg-white text-zinc-950 shadow-3xs dark:bg-zinc-950 dark:text-zinc-50'
                  : 'hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              title="Mobile Performance"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Audits display */}
        <div className="mt-6 flex flex-col items-center">
          {/* Circular dial gauge */}
          <div className="relative flex h-28 w-28 items-center justify-center">
            <svg className="h-full w-full -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="48"
                className="fill-none stroke-zinc-100 dark:stroke-zinc-900"
                strokeWidth="7"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                className={`fill-none transition-all duration-500 ${
                  speedData.score >= 90 ? 'stroke-emerald-500' : speedData.score >= 50 ? 'stroke-amber-500' : 'stroke-red-500'
                }`}
                strokeWidth="7"
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={2 * Math.PI * 48 * (1 - speedData.score / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-2xl font-black ${speedData.score >= 90 ? 'text-emerald-500' : speedData.score >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                {speedData.score}
              </span>
              <span className="text-4xs font-bold uppercase tracking-wider text-zinc-400">
                Speed Score
              </span>
            </div>
          </div>

          {/* Vitals detail list */}
          <div className="mt-8 w-full space-y-3.5">
            {/* LCP */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-900">
              <div className="flex items-center gap-1.5">
                <Gauge className="h-4 w-4 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  LCP (Largest Contentful Paint)
                </span>
              </div>
              <span className={`text-xs font-extrabold ${getVitalColor(speedData.lcp, 'lcp')}`}>
                {speedData.lcp}
              </span>
            </div>

            {/* CLS */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-900">
              <div className="flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  CLS (Layout Shift Index)
                </span>
              </div>
              <span className={`text-xs font-extrabold ${getVitalColor(speedData.cls, 'cls')}`}>
                {speedData.cls}
              </span>
            </div>

            {/* INP */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Monitor className="h-4 w-4 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  INP (Interaction Next Paint)
                </span>
              </div>
              <span className={`text-xs font-extrabold ${getVitalColor(speedData.inp, 'inp')}`}>
                {speedData.inp}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
