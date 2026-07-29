'use client';

import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { StatCardData } from '@/types/admin';

// Helper to resolve icon dynamically
const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  const LucideIcon = (Icons as any)[name];
  if (!LucideIcon) return <Icons.HelpCircle className={className} />;
  return <LucideIcon className={className} />;
};

interface OverviewCardsProps {
  stats: StatCardData[];
  isLoading: boolean;
}

export default function OverviewCards({ stats, isLoading }: OverviewCardsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-950"
          >
            {/* Skeleton Shimmer */}
            <div className="animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 rounded-md bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="space-y-2">
                <div className="h-7 w-16 rounded-md bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-3 w-32 rounded-md bg-zinc-100 dark:bg-zinc-900" />
              </div>
              <div className="h-8 w-full rounded-md bg-zinc-100 dark:bg-zinc-900" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((card) => {
        const isDecrease = card.changeType === 'decrease';
        const isNeutral = card.changeType === 'neutral';
        const changeColor = isDecrease
          ? 'text-red-500 bg-red-50 dark:bg-red-950/20'
          : isNeutral
          ? 'text-zinc-500 bg-zinc-50 dark:bg-zinc-900/20'
          : 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20';

        // Choose chart gradient color based on change status
        const chartColor = isDecrease ? '#ef4444' : '#10b981';

        return (
          <div
            key={card.id}
            className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700/80"
          >
            {/* Header info */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-tight text-zinc-500 uppercase dark:text-zinc-400">
                {card.title}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-100 bg-zinc-50/50 text-zinc-600 transition-colors group-hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:group-hover:bg-zinc-800">
                <IconRenderer name={card.icon} className="h-4.5 w-4.5" />
              </div>
            </div>

            {/* Metric & percentage details */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {card.value}
              </span>
              <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-2xs font-semibold ${changeColor}`}>
                {card.change}
              </span>
            </div>

            {/* Sub-label description */}
            <p className="mt-1 text-2xs text-zinc-400 line-clamp-1 dark:text-zinc-500" title={card.description}>
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
                      <linearGradient id={`gradient-${card.id}`} x1="0" y1="0" x2="0" y2="1">
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
                      fill={`url(#gradient-${card.id})`}
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
  );
}
