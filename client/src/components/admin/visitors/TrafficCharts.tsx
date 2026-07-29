'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { HourlyTrafficPoint, DailyTrafficPoint, CountryTrafficPoint } from '@/types/visitors';
import { TrendingUp, Clock, Calendar, Globe, LogOut, LogIn } from 'lucide-react';

interface TrafficChartsProps {
  hourlyTraffic: HourlyTrafficPoint[];
  dailyTraffic: DailyTrafficPoint[];
  countryTraffic: CountryTrafficPoint[];
  pages: {
    popular: Array<{ path: string; views: number; visitors: number; time: string }>;
    entry: Array<{ path: string; views: number; percentage: number }>;
    exit: Array<{ path: string; views: number; percentage: number }>;
  };
  isLoading: boolean;
}

export default function TrafficCharts({
  hourlyTraffic,
  dailyTraffic,
  countryTraffic,
  pages,
  isLoading,
}: TrafficChartsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 animate-pulse">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-64 rounded-xl bg-zinc-50 dark:bg-zinc-900/40" />
          <div className="h-64 rounded-xl bg-zinc-50 dark:bg-zinc-900/40" />
        </div>
        <div className="h-full rounded-xl bg-zinc-50 dark:bg-zinc-900/40" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* LEFT COLUMN: Time-series graphs (Hourly & Weekly charts) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Graph 1: Traffic by Hour */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-4.5 dark:border-zinc-900">
            <Clock className="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500" />
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                Traffic by Hour
              </h3>
              <p className="text-3xs text-zinc-400 dark:text-zinc-500">
                Daily visitor session loads and clicks distributed across a 24h timezone cycle.
              </p>
            </div>
          </div>
          <div className="mt-6 h-56 w-full text-xs">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={hourlyTraffic}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSeoHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff9c" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#00ff9c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-900" />
                  <XAxis dataKey="hour" tickLine={false} axisLine={false} stroke="#888888" tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} stroke="#888888" tickMargin={8} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    name="visitors"
                    dataKey="visitors"
                    stroke="#00ff9c"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSeoHours)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-zinc-50/50 dark:bg-zinc-900/50" />
            )}
          </div>
        </div>

        {/* Graph 2: Traffic by Day */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-4.5 dark:border-zinc-900">
            <Calendar className="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500" />
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                Traffic by Day
              </h3>
              <p className="text-3xs text-zinc-400 dark:text-zinc-500">
                Weekly cycle visitor volume distributions (Mon - Sun).
              </p>
            </div>
          </div>
          <div className="mt-6 h-56 w-full text-xs">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyTraffic}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-900" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="#888888" tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} stroke="#888888" tickMargin={8} />
                  <Tooltip />
                  <Bar
                    dataKey="visitors"
                    name="visitors"
                    fill="#3b82f6"
                    radius={[3, 3, 0, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-zinc-50/50 dark:bg-zinc-900/50" />
            )}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Country breakdowns & Page entries/exits lists */}
      <div className="space-y-6">
        
        {/* Country traffic distribution list */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-4.5 dark:border-zinc-900">
            <Globe className="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500" />
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                Top Countries
              </h3>
              <p className="text-3xs text-zinc-400 dark:text-zinc-500">
                Ranked listings of user geo-origins.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {countryTraffic.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-2xs">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    🌍 {item.country}
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {item.visitors.toLocaleString()} ({item.percentage}%)
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-900">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Page entry vs exits split widgets */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
          <div className="grid grid-cols-2 gap-6">
            
            {/* Top entry pages */}
            <div>
              <div className="flex items-center gap-1 text-emerald-500 border-b border-zinc-100 pb-2 dark:border-zinc-900">
                <LogIn className="h-3.5 w-3.5" />
                <h4 className="text-3xs font-bold uppercase tracking-wider text-zinc-400">
                  Top Entries
                </h4>
              </div>
              <div className="mt-3.5 space-y-3">
                {pages.entry.map((p, i) => (
                  <div key={i} className="text-3xs space-y-0.5">
                    <span className="font-mono text-zinc-700 truncate block dark:text-zinc-350">{p.path}</span>
                    <span className="font-bold text-zinc-950 dark:text-zinc-100">{p.percentage}% entry</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top exit pages */}
            <div>
              <div className="flex items-center gap-1 text-red-500 border-b border-zinc-100 pb-2 dark:border-zinc-900">
                <LogOut className="h-3.5 w-3.5" />
                <h4 className="text-3xs font-bold uppercase tracking-wider text-zinc-400">
                  Top Exits
                </h4>
              </div>
              <div className="mt-3.5 space-y-3">
                {pages.exit.map((p, i) => (
                  <div key={i} className="text-3xs space-y-0.5">
                    <span className="font-mono text-zinc-700 truncate block dark:text-zinc-350">{p.path}</span>
                    <span className="font-bold text-zinc-950 dark:text-zinc-100">{p.percentage}% exit</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
