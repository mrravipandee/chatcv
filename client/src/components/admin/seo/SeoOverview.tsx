'use client';

import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { SeoStatCard } from '@/types/seo';

const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  const LucideIcon = (Icons as any)[name];
  if (!LucideIcon) return <Icons.HelpCircle className={className} />;
  return <LucideIcon className={className} />;
};

interface SeoOverviewProps {
  stats: SeoStatCard[];
  technicalScore: number;
  isLoading: boolean;
}

export default function SeoOverview({ stats, technicalScore, isLoading }: SeoOverviewProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-7 w-7 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-7 w-14 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-28 rounded bg-zinc-100 dark:bg-zinc-900" />
            </div>
            <div className="mt-4 h-8 w-full rounded bg-zinc-100 dark:bg-zinc-900" />
          </div>
        ))}
      </div>
    );
  }

  // Get color for technical score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 70) return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
    return 'text-red-500 border-red-500/20 bg-red-500/5';
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Core Technical SEO Score Card */}
        <div className={`relative overflow-hidden rounded-xl border p-5 shadow-xs transition-all duration-200 ${getScoreColor(technicalScore)}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-tight uppercase opacity-80">
              Technical Health Score
            </span>
            <Icons.HeartPulse className="h-5 w-5 opacity-90" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight">
              {technicalScore}
            </span>
            <span className="text-xs font-bold">/ 100</span>
          </div>
          <p className="mt-2 text-2xs opacity-85">
            Overall site crawlability, schema correctness, speed, and meta diagnostics compliance.
          </p>
          {/* Visual Progress gauge */}
          <div className="mt-4 h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                technicalScore >= 90 ? 'bg-emerald-500' : technicalScore >= 70 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${technicalScore}%` }}
            />
          </div>
        </div>

        {/* Regular stats mapped */}
        {stats.map((card) => {
          const isDecrease = card.changeType === 'decrease';
          const isNeutral = card.changeType === 'neutral';
          const changeColor = isDecrease
            ? 'text-red-500 bg-red-50 dark:bg-red-950/20'
            : isNeutral
            ? 'text-zinc-500 bg-zinc-50 dark:bg-zinc-900/20'
            : 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20';

          const chartColor = isDecrease ? '#ef4444' : '#10b981';

          return (
            <div
              key={card.id}
              className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700/80"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-tight text-zinc-500 uppercase dark:text-zinc-400">
                  {card.title}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-100 bg-zinc-50/50 text-zinc-600 transition-colors group-hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:group-hover:bg-zinc-800">
                  <IconRenderer name={card.icon} className="h-4.5 w-4.5" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {card.value}
                </span>
                <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-2xs font-semibold ${changeColor}`}>
                  {card.change}
                </span>
              </div>

              <p className="mt-1 text-2xs text-zinc-400 line-clamp-1 dark:text-zinc-400">
                {card.description}
              </p>

              {/* Sparkline Graph */}
              <div className="mt-4 h-9 w-full overflow-hidden">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={card.sparkline}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id={`seo-gradient-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartColor} stopOpacity={0.15} />
                          <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={chartColor}
                        strokeWidth={1.5}
                        fillOpacity={1}
                        fill={`url(#seo-gradient-${card.id})`}
                        dot={false}
                        activeDot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-zinc-50/50 dark:bg-zinc-900/50" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
