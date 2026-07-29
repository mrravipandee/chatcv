'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { ChartDataPoint } from '@/types/admin';
import { HelpCircle, Eye, Users, FileText, Download, MessageSquare } from 'lucide-react';

interface ChartsSectionProps {
  data: ChartDataPoint[];
  isLoading: boolean;
}

type MainChartType = 'visitors' | 'users' | 'resumes' | 'downloads' | 'aiMessages';

export default function ChartsSection({ data, isLoading }: ChartsSectionProps) {
  const [activeTab, setActiveTab] = useState<MainChartType>('visitors');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="animate-pulse space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="h-6 w-32 rounded-md bg-zinc-200 dark:bg-zinc-800" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-8 w-16 rounded-md bg-zinc-200 dark:bg-zinc-800" />
                ))}
              </div>
            </div>
            <div className="h-80 w-full rounded-lg bg-zinc-100 dark:bg-zinc-900" />
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="animate-pulse space-y-6">
            <div className="h-6 w-24 rounded-md bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-80 w-full rounded-lg bg-zinc-100 dark:bg-zinc-900" />
          </div>
        </div>
      </div>
    );
  }

  // Get active chart configuration details
  const getChartConfig = (type: MainChartType) => {
    switch (type) {
      case 'visitors':
        return {
          title: 'Visitors Trend',
          color: '#06b6d4', // cyan
          gradientId: 'colorVisitors',
          dataKey: 'visitors',
          icon: <Eye className="h-4 w-4" />,
          desc: 'Daily visitor traffic sessions compiled across static content pages and sub-routes.'
        };
      case 'users':
        return {
          title: 'User Registrations',
          color: '#8b5cf6', // violet
          gradientId: 'colorUsers',
          dataKey: 'users',
          icon: <Users className="h-4 w-4" />,
          desc: 'New registrations and accounts verified during the active duration.'
        };
      case 'resumes':
        return {
          title: 'Resumes Created',
          color: '#ec4899', // pink/magenta
          gradientId: 'colorResumes',
          dataKey: 'resumes',
          icon: <FileText className="h-4 w-4" />,
          desc: 'LaTeX documents compiled and parsed inside the chat editor database.'
        };
      case 'downloads':
        return {
          title: 'Resume Downloads',
          color: '#3b82f6', // blue
          gradientId: 'colorDownloads',
          dataKey: 'downloads',
          icon: <Download className="h-4 w-4" />,
          desc: 'Total times resume PDFs or LaTeX sources were exported and saved locally.'
        };
      case 'aiMessages':
        return {
          title: 'AI Usage Trend',
          color: '#10b981', // emerald
          gradientId: 'colorAiMessages',
          dataKey: 'aiMessages',
          icon: <MessageSquare className="h-4 w-4" />,
          desc: 'Interaction and token counts processed by the resume builder chatbot.'
        };
    }
  };

  const config = getChartConfig(activeTab);

  // Custom tooltips matching Apple/Vercel styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-zinc-200/80 bg-white/95 p-3 shadow-md backdrop-blur-xs dark:border-zinc-800/80 dark:bg-zinc-950/95">
          <p className="text-2xs font-semibold text-zinc-500 uppercase dark:text-zinc-400">{label}</p>
          <div className="mt-1.5 space-y-1">
            {payload.map((pld: any) => (
              <div key={pld.name} className="flex items-center gap-4 justify-between">
                <span className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: pld.fill || pld.stroke }}
                  />
                  {pld.name === 'visitors' ? 'Visitors' :
                   pld.name === 'users' ? 'New Signups' :
                   pld.name === 'resumes' ? 'Resumes Created' :
                   pld.name === 'downloads' ? 'Downloads' :
                   pld.name === 'aiMessages' ? 'AI Messages' : pld.name}
                </span>
                <span className="text-xs font-bold text-zinc-950 dark:text-zinc-50">
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

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Primary Analytics Chart Selector */}
      <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-5 dark:border-zinc-900">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-100 bg-zinc-50 text-zinc-600 dark:border-zinc-850 dark:bg-zinc-900 dark:text-zinc-400">
              {config.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                {config.title}
              </h3>
              <p className="hidden text-xs text-zinc-400 sm:block dark:text-zinc-500">
                Interactive trend view
              </p>
            </div>
          </div>

          {/* Quick tab controls */}
          <div className="flex flex-wrap gap-1 rounded-lg bg-zinc-100/80 p-1 dark:bg-zinc-900/60">
            {(['visitors', 'users', 'resumes', 'downloads', 'aiMessages'] as MainChartType[]).map((tab) => {
              const active = tab === activeTab;
              const tabLabel = tab === 'visitors' ? 'Visitors' :
                               tab === 'users' ? 'Signups' :
                               tab === 'resumes' ? 'Resumes' :
                               tab === 'downloads' ? 'Downloads' : 'AI Chat';
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    active
                      ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-950 dark:text-zinc-50'
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  {tabLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart render zone */}
        <div className="mt-6 h-80 w-full text-xs">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={config.color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={config.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-900" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  stroke="#888888"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  stroke="#888888"
                  tickFormatter={(val) => val.toLocaleString()}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  name={config.dataKey}
                  dataKey={config.dataKey}
                  stroke={config.color}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#${config.gradientId})`}
                  activeDot={{ r: 5, strokeWidth: 0, fill: config.color }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <p className="text-zinc-400">Loading trend view...</p>
            </div>
          )}
        </div>
        <div className="mt-3 flex items-start gap-1 text-2xs text-zinc-400 dark:text-zinc-500">
          <HelpCircle className="mt-0.5 h-3 w-3 shrink-0" />
          <span>{config.desc}</span>
        </div>
      </div>

      {/* Secondary Combined Downloads and AI Messages trend */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-5 dark:border-zinc-900">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              Downloads & AI Trend
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Composed performance metrics
            </p>
          </div>
        </div>

        {/* Composed Chart render zone */}
        <div className="mt-6 h-80 w-full text-xs">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 10, right: -15, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-900" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  stroke="#888888"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  stroke="#888888"
                />
                <Tooltip content={<CustomTooltip />} />
                {/* AI messages represented as bars */}
                <Bar
                  dataKey="downloads"
                  name="downloads"
                  fill="#3b82f6"
                  radius={[3, 3, 0, 0]}
                  barSize={12}
                />
                {/* Downloads represented as a smooth line */}
                <Line
                  type="monotone"
                  dataKey="resumes"
                  name="resumes"
                  stroke="#ec4899"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <p className="text-zinc-400">Loading trend view...</p>
            </div>
          )}
        </div>
        <div className="mt-3 flex gap-4 text-2xs justify-center">
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
            <span className="h-2 w-2 rounded-xs bg-blue-500" />
            Downloads (Bar)
          </div>
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
            <span className="h-2 w-0.5 bg-pink-500" />
            Resumes Created (Line)
          </div>
        </div>
      </div>
    </div>
  );
}
