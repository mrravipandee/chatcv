'use client';

import React, { useState } from 'react';
import {
  CrawlDiagnostic,
  MetaIssue,
  SchemaItem,
  SeoSuggestion,
  PageSpeedRecord
} from '@/types/seo';
import { getAiStreamingSuggestions } from '@/lib/seoData';
import {
  ShieldAlert,
  Sparkles,
  Terminal,
  CheckCircle,
  AlertTriangle,
  Play,
  ArrowUpRight,
  TrendingDown,
  Code
} from 'lucide-react';

interface TechnicalAuditProps {
  diagnostics: CrawlDiagnostic[];
  metaIssues: MetaIssue[];
  schemaItems: SchemaItem[];
  suggestions: SeoSuggestion[];
  pages: {
    topPerformingPages: Array<{ path: string; clicks: number; impressions: number; ctr: string; pos: number }>;
    worstPerformingPages: Array<{ path: string; clicks: number; impressions: number; ctr: string; pos: number }>;
  };
  onUpdateSuggestions: (sug: SeoSuggestion[]) => void;
  isLoading: boolean;
}

type TechTabType = 'ai' | 'meta' | 'crawl' | 'rankings' | 'schema';

export default function TechnicalAudit({
  diagnostics,
  metaIssues,
  schemaItems,
  suggestions,
  pages,
  onUpdateSuggestions,
  isLoading,
}: TechnicalAuditProps) {
  const [activeTab, setActiveTab] = useState<TechTabType>('ai');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedLogs, setStreamedLogs] = useState('');

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 animate-pulse">
        <div className="h-6 w-48 rounded bg-zinc-200 dark:bg-zinc-800 mb-4" />
        <div className="h-40 rounded bg-zinc-50 dark:bg-zinc-900/40" />
      </div>
    );
  }

  // Trigger AI Auditor Streamer
  const handleTriggerAudit = async () => {
    setIsStreaming(true);
    setStreamedLogs('');
    
    await getAiStreamingSuggestions(
      (chunk) => {
        setStreamedLogs(chunk);
      },
      (newSuggestions) => {
        onUpdateSuggestions(newSuggestions);
        setIsStreaming(false);
      }
    );
  };

  const getSeverityBadge = (sev: 'high' | 'medium' | 'low') => {
    switch (sev) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-150 dark:bg-red-950/20 dark:text-red-400 dark:border-red-950/30';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-150 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-950/30';
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-150 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-950/30';
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
      {/* Tab select bar */}
      <div className="flex flex-col border-b border-zinc-150/40 px-6 py-5 xl:flex-row xl:items-center xl:justify-between gap-4 dark:border-zinc-900">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
            Technical Audit Logs
          </h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Crawl parameters, duplicates indexes, schema errors, and recommendations.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-zinc-100/80 p-1 dark:bg-zinc-900/60 scrollbar-none">
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'ai'
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-950 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" /> AI SEO Advisor
          </button>
          <button
            onClick={() => setActiveTab('meta')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'meta'
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-950 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            HTML Meta Audits
          </button>
          <button
            onClick={() => setActiveTab('crawl')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'crawl'
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-950 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Crawl Errors
          </button>
          <button
            onClick={() => setActiveTab('rankings')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'rankings'
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-950 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Page Performance
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'schema'
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-950 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Schema Validate
          </button>
        </div>
      </div>

      {/* Panels content area */}
      <div className="p-6 max-h-[460px] overflow-y-auto scrollbar-thin">
        
        {/* TAB 1: AI SEO Recommendations Advisor */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-indigo-500/10 bg-indigo-500/5 p-4 dark:border-indigo-950/20">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-400">
                  AI Organic Growth Advisor
                </h4>
                <p className="text-2xs text-zinc-500 dark:text-zinc-450">
                  Runs sitemap crawls and generates suggestions to maximize keyword position curves.
                </p>
              </div>
              <button
                onClick={handleTriggerAudit}
                disabled={isStreaming}
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-1.5 text-2xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
              >
                <Play className="h-3 w-3 fill-current" /> {isStreaming ? 'Analyzing...' : 'Run SEO Audit'}
              </button>
            </div>

            {/* AI Streaming Console Logger */}
            {isStreaming && (
              <div className="rounded-lg border border-zinc-850 bg-zinc-900 p-4 font-mono text-[11px] text-emerald-400 leading-relaxed shadow-inner dark:bg-zinc-950">
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 mb-3 text-zinc-500">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>AI Auditor Shell Output</span>
                </div>
                <pre className="whitespace-pre-wrap">{streamedLogs}</pre>
                <div className="mt-2 h-2.5 w-1 animate-pulse bg-emerald-400" />
              </div>
            )}

            {/* Render Suggestion Cards */}
            {!isStreaming && (
              <div className="space-y-3">
                {suggestions.map((sug) => (
                  <div key={sug.id} className="relative group rounded-lg border border-zinc-100 bg-zinc-50/20 p-4 transition-colors hover:bg-zinc-50/50 dark:border-zinc-900 dark:bg-zinc-950/20 dark:hover:bg-zinc-900/20">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100/50 pb-2 mb-2 dark:border-zinc-900/60">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-sm px-1.5 py-0.5 text-4xs font-bold uppercase tracking-wider ${
                          sug.impact === 'High' ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400' :
                          sug.impact === 'Medium' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
                          'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                        }`}>
                          {sug.impact} Impact
                        </span>
                        <span className="text-4xs text-zinc-400 font-bold uppercase tracking-wider">{sug.category}</span>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-450 dark:text-zinc-500">{sug.page}</span>
                    </div>
                    <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{sug.title}</h5>
                    <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{sug.action}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: HTML Meta Audits */}
        {activeTab === 'meta' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-amber-500/10 bg-amber-500/5 p-4 dark:border-amber-950/20">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-450">HTML Meta Warning Logs</h4>
                  <p className="text-2xs text-zinc-500 dark:text-zinc-450">Duplicate tags or missing content optimization tags.</p>
                </div>
              </div>
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-3xs font-extrabold text-amber-800 dark:bg-amber-950 dark:text-amber-400">
                {metaIssues.length} Issues Open
              </span>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {metaIssues.map((issue) => (
                <div key={issue.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xs text-zinc-500 dark:text-zinc-400">{issue.url}</span>
                    <span className="rounded px-1.5 py-0.5 text-4xs font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                      {issue.issue.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-zinc-700 dark:text-zinc-350">{issue.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Crawl Errors & 404s */}
        {activeTab === 'crawl' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-red-500/10 bg-red-500/5 p-4 dark:border-red-950/20">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-red-900 dark:text-red-450">Critical Crawl Issues</h4>
                  <p className="text-2xs text-zinc-500 dark:text-zinc-450">Broken links, dead endpoints, or circular redirections.</p>
                </div>
              </div>
              <span className="rounded-md bg-red-100 px-2 py-0.5 text-3xs font-extrabold text-red-800 dark:bg-red-950 dark:text-red-450">
                {diagnostics.length} Active Errors
              </span>
            </div>

            <div className="space-y-3">
              {diagnostics.map((diag) => (
                <div key={diag.id} className="rounded-lg border border-zinc-100 bg-zinc-50/20 p-4 dark:border-zinc-900 dark:bg-zinc-950/10">
                  <div className="flex items-center justify-between">
                    <span className={`rounded-sm border px-1.5 py-0.5 text-4xs font-bold uppercase tracking-wider ${getSeverityBadge(diag.severity)}`}>
                      {diag.severity} Severity
                    </span>
                    <span className="font-mono text-3xs text-zinc-400">{diag.type} diagnostic</span>
                  </div>
                  <h5 className="mt-2 text-xs font-mono font-bold text-zinc-950 dark:text-zinc-200">{diag.url}</h5>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{diag.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Page Rankings (Best vs Worst) */}
        {activeTab === 'rankings' && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Top Performing */}
            <div>
              <div className="mb-4 flex items-center gap-1.5 text-emerald-500">
                <ArrowUpRight className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Top Organic Pages
                </h4>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
                {pages.topPerformingPages.map((page, idx) => (
                  <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                    <span className="font-mono text-2xs text-zinc-700 dark:text-zinc-350">{page.path}</span>
                    <div className="text-right">
                      <span className="text-2xs font-extrabold text-zinc-950 dark:text-zinc-100">{page.clicks} clicks</span>
                      <p className="text-4xs text-zinc-400 dark:text-zinc-550">Avg Pos: #{page.pos}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Worst Performing */}
            <div>
              <div className="mb-4 flex items-center gap-1.5 text-red-500">
                <TrendingDown className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Low Visibility Pages
                </h4>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
                {pages.worstPerformingPages.map((page, idx) => (
                  <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                    <span className="font-mono text-2xs text-zinc-700 dark:text-zinc-350">{page.path}</span>
                    <div className="text-right">
                      <span className="text-2xs font-extrabold text-zinc-950 dark:text-zinc-100">{page.clicks} clicks</span>
                      <p className="text-4xs text-zinc-400 dark:text-zinc-550">Avg Pos: #{page.pos}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Schema Validation */}
        {activeTab === 'schema' && (
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-zinc-450 dark:text-zinc-500">
              <Code className="h-4 w-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                LD+JSON Structured Schemas
              </h4>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {schemaItems.map((sch) => (
                <div key={sch.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-zinc-950 dark:text-zinc-100">{sch.type}</span>
                    <p className="text-4xs text-zinc-400 dark:text-zinc-550">Errors: {sch.errorsCount} | Warnings: {sch.warningsCount}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-4xs font-bold uppercase tracking-wider ${
                      sch.status === 'valid' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450' :
                      sch.status === 'warning' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-450' :
                      'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-450'
                    }`}>
                      {sch.status === 'valid' ? <CheckCircle className="h-2.5 w-2.5 shrink-0" /> : <AlertTriangle className="h-2.5 w-2.5 shrink-0" />}
                      {sch.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
