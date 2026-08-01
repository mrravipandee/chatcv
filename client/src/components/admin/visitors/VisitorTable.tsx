'use client';

import React, { useState } from 'react';
import { VisitorSession } from '@/types/visitors';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Cpu,
  Monitor,
  ExternalLink,
  Bot,
  User,
  Zap,
  PlayCircle,
  HelpCircle,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface VisitorTableProps {
  sessions: VisitorSession[];
  onPlayReplay: (vis: VisitorSession) => void;
  isLoading: boolean;
}

type SortKey = 'ip' | 'city' | 'browser' | 'operatingSystem' | 'sessionDurationSeconds' | 'clicks' | 'scrollPercentage';
type SortOrder = 'asc' | 'desc';

export default function VisitorTable({ sessions, onPlayReplay, isLoading }: VisitorTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBot, setFilterBot] = useState<boolean | null>(null); // null means all, true bot only, false human only
  const [filterUserType, setFilterUserType] = useState<'All' | 'New' | 'Returning'>('All');
  const [filterConnection, setFilterConnection] = useState<string>('All');
  
  // Pagination & Sorting state
  const [sortKey, setSortKey] = useState<SortKey>('sessionDurationSeconds');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  
  // Row expanding state mapping
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 animate-pulse">
        <div className="h-6 w-32 rounded bg-zinc-200 dark:bg-zinc-800 mb-4" />
        <div className="h-60 rounded bg-zinc-50 dark:bg-zinc-900/40" />
      </div>
    );
  }

  // Row expand toggler
  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 1. Apply search and state filters
  const filteredSessions = sessions.filter((vis) => {
    // Search IP, City, Country, ISP
    const matchSearch =
      vis.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vis.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vis.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vis.isp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vis.browser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vis.utmSource && vis.utmSource.toLowerCase().includes(searchTerm.toLowerCase()));

    // Bot filter
    const matchBot = filterBot === null ? true : vis.isBot === filterBot;

    // User Type filter
    const matchUserType = filterUserType === 'All' ? true : vis.userType === filterUserType;

    // Connection filter
    const matchConnection = filterConnection === 'All' ? true : vis.connectionType === filterConnection;

    return matchSearch && matchBot && matchUserType && matchConnection;
  });

  // 2. Sorting
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // 3. Pagination bounds
  const totalItems = sortedSessions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedSessions = sortedSessions.slice(indexOfFirstItem, indexOfLastItem);

  const getBrowserTagClass = (browser: string) => {
    switch (browser) {
      case 'Chrome':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400';
      case 'Safari':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400';
      default:
        return 'bg-zinc-50 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-400';
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
      {/* Search and Advanced Filters control panel */}
      <div className="border-b border-zinc-150/40 p-6 space-y-4 dark:border-zinc-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              Visitor Audit Trail
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Comprehensive sessions inspector. Click rows to inspect event logs timeline and playback recordings.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search IP, City, UTM Source..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-2 pr-4 pl-9 text-xs placeholder-zinc-400 outline-hidden transition-all focus:border-zinc-350 dark:border-zinc-900 dark:bg-zinc-900/40"
            />
          </div>
        </div>

        {/* Detailed Filters row */}
        <div className="flex flex-wrap gap-3 items-center text-xs text-zinc-650 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-150 px-2.5 py-1.5 bg-zinc-50/40 dark:border-zinc-900 dark:bg-zinc-950/20">
            <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />
            <span className="font-semibold text-zinc-500">Filters:</span>
          </div>

          {/* Bot detection selector */}
          <select
            value={filterBot === null ? 'All' : filterBot ? 'Bots' : 'Humans'}
            onChange={(e) => {
              const val = e.target.value;
              setFilterBot(val === 'All' ? null : val === 'Bots');
              setCurrentPage(1);
            }}
            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-700 outline-hidden dark:border-zinc-900 dark:bg-zinc-900/60 dark:text-zinc-300"
          >
            <option value="All">All Traffic</option>
            <option value="Humans">Humans only</option>
            <option value="Bots">Search Bots only</option>
          </select>

          {/* User type selector */}
          <select
            value={filterUserType}
            onChange={(e) => {
              setFilterUserType(e.target.value as any);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-700 outline-hidden dark:border-zinc-900 dark:bg-zinc-900/60 dark:text-zinc-300"
          >
            <option value="All">User Tiers</option>
            <option value="New">New Users</option>
            <option value="Returning">Returning Users</option>
          </select>

          {/* Connection Speed selector */}
          <select
            value={filterConnection}
            onChange={(e) => {
              setFilterConnection(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-700 outline-hidden dark:border-zinc-900 dark:bg-zinc-900/60 dark:text-zinc-300"
          >
            <option value="All">Network Speed</option>
            <option value="Wifi">Wi-Fi</option>
            <option value="4G">4G LTE</option>
            <option value="5G">5G Speed</option>
          </select>

          {/* Quick Clear */}
          {(searchTerm !== '' || filterBot !== null || filterUserType !== 'All' || filterConnection !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterBot(null);
                setFilterUserType('All');
                setFilterConnection('All');
                setCurrentPage(1);
              }}
              className="text-2xs font-semibold text-indigo-500 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Visitor Table Zone */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-150/40 text-2xs font-semibold tracking-wider text-zinc-400 uppercase dark:border-zinc-900 dark:text-zinc-500">
              <th className="py-3 px-6 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200" onClick={() => handleSort('ip')}>
                IP / Host
              </th>
              <th className="py-3 px-4 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200" onClick={() => handleSort('city')}>
                Location
              </th>
              <th className="py-3 px-4 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200" onClick={() => handleSort('browser')}>
                Browser
              </th>
              <th className="py-3 px-4 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200" onClick={() => handleSort('operatingSystem')}>
                System
              </th>
              <th className="py-3 px-4 cursor-pointer text-right hover:text-zinc-700 dark:hover:text-zinc-200" onClick={() => handleSort('sessionDurationSeconds')}>
                Duration
              </th>
              <th className="py-3 px-4 cursor-pointer text-center hover:text-zinc-700 dark:hover:text-zinc-200" onClick={() => handleSort('clicks')}>
                Clicks
              </th>
              <th className="py-3 px-4 cursor-pointer text-center hover:text-zinc-700 dark:hover:text-zinc-200" onClick={() => handleSort('scrollPercentage')}>
                Scroll
              </th>
              <th className="py-3 px-6 text-right">Replay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 text-xs dark:divide-zinc-900/40">
            {paginatedSessions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-zinc-400 dark:text-zinc-500">
                  No visitor sessions matching the filter parameters.
                </td>
              </tr>
            ) : (
              paginatedSessions.map((vis) => {
                const isExpanded = !!expandedRows[vis.id];
                return (
                  <React.Fragment key={vis.id}>
                    {/* Core Row */}
                    <tr
                      onClick={() => toggleRow(vis.id)}
                      className={`group hover:bg-zinc-50/50 cursor-pointer dark:hover:bg-zinc-900/10 ${
                        isExpanded ? 'bg-zinc-50/20 dark:bg-zinc-900/5' : ''
                      }`}
                    >
                      {/* IP and bot check */}
                      <td className="py-3.5 px-6 font-semibold text-zinc-800 dark:text-zinc-200">
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{vis.ip}</span>
                          {vis.isBot ? (
                            <span className="inline-flex items-center rounded-sm bg-purple-50 px-1 py-0.5 text-4xs font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-400">
                              <Bot className="h-2.5 w-2.5 mr-0.5" /> Bot
                            </span>
                          ) : vis.userType === 'Returning' ? (
                            <span className="inline-flex items-center rounded-sm bg-blue-50 px-1 py-0.5 text-4xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                              <User className="h-2.5 w-2.5 mr-0.5" /> Returner
                            </span>
                          ) : null}
                        </div>
                        {/* ISP subtext */}
                        <div className="mt-0.5 text-4xs text-zinc-400 font-normal line-clamp-1 max-w-[130px]" title={vis.isp}>
                          {vis.isp}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 font-semibold text-zinc-800 dark:text-zinc-200">
                        📍 {vis.city}, <span className="text-zinc-400 dark:text-zinc-500 font-normal">{vis.country}</span>
                      </td>

                      {/* Browser version */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-4xs font-semibold ${getBrowserTagClass(vis.browser)}`}>
                          {vis.browser} v{vis.browserVersion.split('.')[0]}
                        </span>
                      </td>

                      {/* System and connection */}
                      <td className="py-3.5 px-4 text-zinc-650 dark:text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <span>{vis.deviceType === 'Desktop' ? '🖥️' : '📱'} {vis.operatingSystem}</span>
                          <span className="text-4xs text-zinc-400 font-normal border border-zinc-100 rounded px-1 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950/20">
                            {vis.connectionType}
                          </span>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4 text-right font-semibold text-zinc-900 dark:text-zinc-200">
                        {vis.sessionDuration}
                      </td>

                      {/* Clicks */}
                      <td className="py-3.5 px-4 text-center font-bold text-zinc-900 dark:text-zinc-200">
                        {vis.clicks}
                      </td>

                      {/* Scroll Percentage progress card */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="h-1.5 w-12 rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                            <div className="h-full bg-[#00ff9c]" style={{ width: `${vis.scrollPercentage}%` }} />
                          </div>
                          <span className="font-mono text-3xs text-zinc-500 dark:text-zinc-400">{vis.scrollPercentage}%</span>
                        </div>
                      </td>

                      {/* Replay session modal button */}
                      <td className="py-3.5 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onPlayReplay(vis)}
                          className="inline-flex items-center gap-1.5 rounded bg-zinc-950 p-1 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
                          title="Watch Session Replay"
                        >
                          <PlayCircle className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>

                    {/* Expanded timeline section */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={8} className="bg-zinc-50/30 p-5 dark:bg-zinc-950/5">
                          <div className="space-y-4">
                            {/* Campaign metadata info tags */}
                            {vis.utmSource && (
                              <div className="flex flex-wrap gap-2 text-4xs">
                                <span className="rounded border border-zinc-200 bg-white px-2 py-0.5 text-zinc-500 dark:border-zinc-900 dark:bg-zinc-950">
                                  UTM Source: <span className="font-bold text-zinc-700 dark:text-zinc-200">{vis.utmSource}</span>
                                </span>
                                <span className="rounded border border-zinc-200 bg-white px-2 py-0.5 text-zinc-500 dark:border-zinc-900 dark:bg-zinc-950">
                                  UTM Medium: <span className="font-bold text-zinc-700 dark:text-zinc-200">{vis.utmMedium}</span>
                                </span>
                                <span className="rounded border border-zinc-200 bg-white px-2 py-0.5 text-zinc-500 dark:border-zinc-900 dark:bg-zinc-950">
                                  UTM Campaign: <span className="font-bold text-indigo-500">{vis.utmCampaign}</span>
                                </span>
                                <span className="rounded border border-zinc-200 bg-white px-2 py-0.5 text-zinc-500 dark:border-zinc-900 dark:bg-zinc-950">
                                  Dark Mode: <span className="font-bold">{vis.darkMode ? 'Enabled' : 'Disabled'}</span>
                                </span>
                                <span className="rounded border border-zinc-200 bg-white px-2 py-0.5 text-zinc-500 dark:border-zinc-900 dark:bg-zinc-950">
                                  Resolution: <span className="font-mono font-bold">{vis.screenResolution}</span>
                                </span>
                              </div>
                            )}

                            {/* Timeline steps */}
                            <div className="relative border-l border-zinc-200 pl-4.5 space-y-3 dark:border-zinc-800">
                              <span className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full border border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900" />
                              
                              {vis.timeline.map((item, idx) => (
                                <div key={idx} className="text-2xs text-zinc-600 dark:text-zinc-400">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-zinc-900 dark:text-zinc-200">{item.action}</span>
                                    <span className="font-mono text-3xs text-zinc-400">{item.timestamp}</span>
                                    <span className="font-mono text-3xs text-zinc-400">{item.path}</span>
                                  </div>
                                  {item.detail && <p className="mt-0.5 text-3xs text-zinc-450 italic dark:text-zinc-500">Detail: "{item.detail}"</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-4.5 dark:border-zinc-900">
          <span className="text-2xs text-zinc-500">
            Showing <span className="font-bold">{indexOfFirstItem + 1}</span> to{' '}
            <span className="font-bold">{Math.min(indexOfLastItem, totalItems)}</span> of{' '}
            <span className="font-bold">{totalItems}</span> visitor sessions
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-900 dark:hover:bg-zinc-900"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="flex items-center text-xs font-semibold text-zinc-700 px-2.5 dark:text-zinc-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-900 dark:hover:bg-zinc-900"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
