'use client';

import React, { useState } from 'react';
import { KeywordItem } from '@/types/seo';
import { Search, ChevronUp, ChevronDown, MoveUp, MoveDown, Minus, ExternalLink } from 'lucide-react';

interface KeywordTrackerProps {
  keywords: KeywordItem[];
  isLoading: boolean;
}

type SortKey = 'keyword' | 'position' | 'volume' | 'traffic' | 'difficulty';
type SortOrder = 'asc' | 'desc';

export default function KeywordTracker({ keywords, isLoading }: KeywordTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('position');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 animate-pulse">
        <div className="flex items-center justify-between pb-4">
          <div className="h-6 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-9 w-48 rounded bg-zinc-100 dark:bg-zinc-900" />
        </div>
        <div className="h-60 rounded bg-zinc-50 dark:bg-zinc-900/40" />
      </div>
    );
  }

  // Filter keywords
  const filteredKeywords = keywords.filter((item) =>
    item.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting helper
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedKeywords = [...filteredKeywords].sort((a, b) => {
    let valA: any = a[sortKey];
    let valB: any = b[sortKey];

    // Map difficulty to numeric rank for sorting
    if (sortKey === 'difficulty') {
      const difficultyRank = { Easy: 1, Medium: 2, Hard: 3 };
      valA = difficultyRank[a.difficulty];
      valB = difficultyRank[b.difficulty];
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getDifficultyChip = (diff: 'Easy' | 'Medium' | 'Hard') => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-950/30';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-950/30';
      case 'Hard':
        return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-450 dark:border-red-950/30';
    }
  };

  const getPositionDeltaIndicator = (curr: number, prev: number) => {
    if (curr < prev) {
      // Lower position is climbing up!
      return (
        <span className="inline-flex items-center gap-0.5 text-2xs font-bold text-emerald-500">
          <MoveUp className="h-3 w-3 shrink-0" />
          {prev - curr}
        </span>
      );
    }
    if (curr > prev) {
      return (
        <span className="inline-flex items-center gap-0.5 text-2xs font-bold text-red-500">
          <MoveDown className="h-3 w-3 shrink-0" />
          {curr - prev}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 text-2xs text-zinc-400">
        <Minus className="h-3 w-3 shrink-0" />
      </span>
    );
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
      {/* Search Header */}
      <div className="flex flex-col border-b border-zinc-150/40 px-6 py-5 sm:flex-row sm:items-center sm:justify-between gap-4 dark:border-zinc-900">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
            Keyword Tracker
          </h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Monitor dynamic organic ranking positions, search volumes, and difficulty tiers.
          </p>
        </div>

        {/* Search input field */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-2 pr-4 pl-9 text-xs placeholder-zinc-400 outline-hidden transition-all focus:border-zinc-350 dark:border-zinc-900 dark:bg-zinc-900/40"
          />
        </div>
      </div>

      {/* Grid listing */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-150/40 text-2xs font-semibold tracking-wider text-zinc-400 uppercase dark:border-zinc-900 dark:text-zinc-500">
              <th className="py-3 px-6 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200" onClick={() => handleSort('keyword')}>
                Keyword
              </th>
              <th className="py-3 px-4 cursor-pointer text-center hover:text-zinc-700 dark:hover:text-zinc-200" onClick={() => handleSort('position')}>
                Position
              </th>
              <th className="py-3 px-4 text-center">Change</th>
              <th className="py-3 px-4 cursor-pointer text-right hover:text-zinc-700 dark:hover:text-zinc-200" onClick={() => handleSort('volume')}>
                Volume (Mo.)
              </th>
              <th className="py-3 px-4 cursor-pointer text-center hover:text-zinc-700 dark:hover:text-zinc-200" onClick={() => handleSort('difficulty')}>
                Difficulty
              </th>
              <th className="py-3 px-4 cursor-pointer text-right hover:text-zinc-700 dark:hover:text-zinc-200" onClick={() => handleSort('traffic')}>
                Traffic (Mo.)
              </th>
              <th className="py-3 px-6">Landing Page</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 text-xs dark:divide-zinc-900/40">
            {sortedKeywords.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-zinc-450 dark:text-zinc-500">
                  No matching keywords found.
                </td>
              </tr>
            ) : (
              sortedKeywords.map((item) => (
                <tr key={item.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                  {/* Keyword */}
                  <td className="py-3.5 px-6 font-bold text-zinc-800 dark:text-zinc-200">
                    {item.keyword}
                  </td>
                  {/* Current Position */}
                  <td className="py-3.5 px-4 text-center font-bold text-zinc-900 dark:text-zinc-50">
                    #{item.position}
                  </td>
                  {/* Position Delta */}
                  <td className="py-3.5 px-4 text-center">
                    {getPositionDeltaIndicator(item.position, item.previousPosition)}
                  </td>
                  {/* Search Volume */}
                  <td className="py-3.5 px-4 text-right text-zinc-600 dark:text-zinc-300">
                    {item.volume.toLocaleString()}
                  </td>
                  {/* Difficulty */}
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex rounded-md border px-2 py-0.5 text-3xs font-bold uppercase tracking-wider ${getDifficultyChip(item.difficulty)}`}>
                      {item.difficulty}
                    </span>
                  </td>
                  {/* Estimated Traffic */}
                  <td className="py-3.5 px-4 text-right font-semibold text-zinc-900 dark:text-zinc-200">
                    {item.traffic.toLocaleString()}
                  </td>
                  {/* Targeted Landing Page */}
                  <td className="py-3.5 px-6">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[10px] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-150 transition-colors"
                    >
                      /{item.url.split('.app/')[1] || ''}
                      <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
