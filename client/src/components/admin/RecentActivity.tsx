'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ActivityLog,
  RegisteredUser,
  ResumeDownload,
  FeedbackItem,
  ContactMessage,
  SystemError
} from '@/types/admin';
import {
  Activity,
  UserCheck,
  Download,
  Star,
  Mail,
  AlertOctagon,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface RecentActivityProps {
  activities: ActivityLog[];
  users: RegisteredUser[];
  downloads: ResumeDownload[];
  feedback: FeedbackItem[];
  messages: ContactMessage[];
  errors: SystemError[];
  onResolveError: (id: string) => void;
  onMarkMessageRead: (id: string) => void;
  isLoading: boolean;
}

type FeedTabType = 'live' | 'users' | 'downloads' | 'feedback' | 'contact' | 'errors';

export default function RecentActivity({
  activities,
  users,
  downloads,
  feedback,
  messages,
  errors,
  onResolveError,
  onMarkMessageRead,
  isLoading,
}: RecentActivityProps) {
  const [activeTab, setActiveTab] = useState<FeedTabType>('live');

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-10 w-full rounded bg-zinc-100 dark:bg-zinc-900" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 rounded bg-zinc-50 dark:bg-zinc-900/40" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Count alerts/active logs
  const unreadMessageCount = messages.filter((m) => m.status === 'unread').length;
  const activeErrorCount = errors.filter((e) => e.status === 'active').length;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
      {/* Header section with tab control */}
      <div className="flex flex-col border-b border-zinc-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between gap-4 dark:border-zinc-900">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
            Real-time Feed & Logs
          </h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Live updates on user onboarding, downloads, compiler errors, and support inquiries.
          </p>
        </div>

        {/* Tab switch control */}
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-zinc-100/80 p-1 dark:bg-zinc-900/60 scrollbar-none">
          <button
            onClick={() => setActiveTab('live')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'live'
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-950 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Activity className="h-3.5 w-3.5" /> Live Log
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'users'
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-950 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" /> Signups
          </button>
          <button
            onClick={() => setActiveTab('downloads')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'downloads'
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-950 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Download className="h-3.5 w-3.5" /> Downloads
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'feedback'
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-950 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Star className="h-3.5 w-3.5" /> Feedback
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'contact'
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-950 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Mail className="h-3.5 w-3.5" /> Support
            {unreadMessageCount > 0 && (
              <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-4xs font-bold text-white">
                {unreadMessageCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('errors')}
            className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'errors'
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-950 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <AlertOctagon className="h-3.5 w-3.5" /> Errors
            {activeErrorCount > 0 && (
              <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-4xs font-bold text-white">
                {activeErrorCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Panels with scrolling */}
      <div className="max-h-[460px] overflow-y-auto px-6 py-4 scrollbar-thin">
        {/* TAB 1: Live Logs */}
        {activeTab === 'live' && (
          <div className="relative space-y-4">
            {/* Top notification for live feeds */}
            <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-2xs text-emerald-600 dark:text-emerald-450">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>Simulated live connection established. Fresh events auto-insert at the top.</span>
            </div>

            <div className="relative border-l-2 border-zinc-100 pl-4 space-y-4.5 dark:border-zinc-900">
              <AnimatePresence initial={false}>
                {activities.map((act) => {
                  let colorClass = 'bg-zinc-400';
                  let icon = <Activity className="h-3.5 w-3.5 text-white" />;

                  if (act.type === 'register') {
                    colorClass = 'bg-emerald-500';
                    icon = <UserCheck className="h-3.5 w-3.5 text-white" />;
                  } else if (act.type === 'download') {
                    colorClass = 'bg-blue-500';
                    icon = <Download className="h-3.5 w-3.5 text-white" />;
                  } else if (act.type === 'feedback') {
                    colorClass = 'bg-pink-500';
                    icon = <Star className="h-3.5 w-3.5 text-white" />;
                  } else if (act.type === 'contact') {
                    colorClass = 'bg-indigo-500';
                    icon = <Mail className="h-3.5 w-3.5 text-white" />;
                  } else if (act.type === 'error') {
                    colorClass = 'bg-red-500';
                    icon = <AlertOctagon className="h-3.5 w-3.5 text-white" />;
                  }

                  return (
                    <motion.div
                      key={act.id}
                      initial={{ opacity: 0, y: -12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="relative group flex items-start gap-3 text-xs"
                    >
                      {/* Timeline dot */}
                      <span className={`absolute -left-[24.5px] top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full ring-4 ring-white dark:ring-zinc-950 ${colorClass}`}>
                        {React.cloneElement(icon, { className: 'h-2.5 w-2.5 text-white' })}
                      </span>

                      <div className="flex-1 rounded-lg border border-zinc-100 bg-zinc-50/40 p-3 hover:bg-zinc-100/40 transition-colors dark:border-zinc-900/50 dark:bg-zinc-950/20 dark:hover:bg-zinc-900/20">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                            {act.user}
                          </span>
                          <span className="flex items-center gap-1 text-4xs text-zinc-400 dark:text-zinc-500">
                            <Clock className="h-2.5 w-2.5" /> {act.timestamp}
                          </span>
                        </div>
                        <p className="mt-1 text-zinc-700 dark:text-zinc-400">
                          <span className="font-medium text-zinc-800 dark:text-zinc-300">{act.action}</span> - {act.detail}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* TAB 2: Latest Users */}
        {activeTab === 'users' && (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 hover:bg-zinc-50/20 dark:hover:bg-zinc-900/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-650 dark:bg-zinc-900 dark:text-zinc-400">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{user.name}</h4>
                    <p className="text-2xs text-zinc-450 dark:text-zinc-550">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex rounded-md px-1.5 py-0.5 text-4xs font-bold uppercase tracking-wider ${
                    user.plan === 'Premium'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400'
                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400'
                  }`}>
                    {user.plan}
                  </span>
                  <p className="mt-1 text-4xs text-zinc-400 dark:text-zinc-550">{user.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Downloads */}
        {activeTab === 'downloads' && (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {downloads.map((dl) => (
              <div key={dl.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3 text-xs">
                  <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-950/20 dark:text-blue-400">
                    <Download className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{dl.title}</h4>
                    <p className="text-2xs text-zinc-500 dark:text-zinc-400">User: {dl.userEmail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex rounded-md px-1.5 py-0.5 text-4xs font-bold uppercase tracking-wider ${
                    dl.format === 'PDF' ? 'bg-red-50 text-red-500 dark:bg-red-950/20 dark:text-red-450' :
                    dl.format === 'LaTeX' ? 'bg-teal-50 text-teal-600 dark:bg-teal-950/20 dark:text-teal-450' :
                    'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-450'
                  }`}>
                    {dl.format}
                  </span>
                  <p className="mt-1 text-4xs text-zinc-400 dark:text-zinc-550">{dl.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: Feedback Logs */}
        {activeTab === 'feedback' && (
          <div className="space-y-4">
            {feedback.map((fb) => (
              <div key={fb.id} className="rounded-lg border border-zinc-100 bg-zinc-50/20 p-4 dark:border-zinc-900 dark:bg-zinc-950/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{fb.name}</span>
                    <span className="text-2xs text-zinc-400 dark:text-zinc-550">({fb.email})</span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-3 w-3 ${idx < fb.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200 dark:text-zinc-800'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-xs italic text-zinc-650 dark:text-zinc-400">"{fb.comment}"</p>
                <div className="mt-3 text-right text-4xs text-zinc-400 dark:text-zinc-500">
                  Logged {fb.timestamp}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: Contact Messages Support */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="py-8 text-center text-zinc-450">All support tickets handled! 🎉</div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`rounded-lg border p-4 transition-all duration-200 ${
                  msg.status === 'unread'
                    ? 'border-indigo-100 bg-indigo-50/5 dark:border-indigo-950/30 dark:bg-indigo-950/5'
                    : 'border-zinc-100 bg-zinc-50/20 dark:border-zinc-900 dark:bg-zinc-950/20'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100/60 pb-2.5 dark:border-zinc-900/60">
                    <div>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-150">{msg.name}</span>
                      <span className="ml-1 text-2xs text-zinc-450 dark:text-zinc-550">({msg.email})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-1.5 py-0.5 text-4xs font-bold uppercase ${
                        msg.status === 'unread' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400' :
                        msg.status === 'replied' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' :
                        'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400'
                      }`}>
                        {msg.status}
                      </span>
                      <span className="text-4xs text-zinc-450 dark:text-zinc-500">{msg.timestamp}</span>
                    </div>
                  </div>
                  <p className="mt-2.5 text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">"{msg.message}"</p>
                  
                  {msg.status !== 'replied' && (
                    <div className="mt-4.5 flex gap-2 justify-end">
                      {msg.status === 'unread' && (
                        <button
                          onClick={() => onMarkMessageRead(msg.id)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-2xs font-semibold text-zinc-650 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-350 dark:hover:bg-zinc-850"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => alert(`Replying to ${msg.email} (Simulated)`)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-2xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 6: System Errors Log */}
        {activeTab === 'errors' && (
          <div className="space-y-4">
            {errors.length === 0 ? (
              <div className="py-8 text-center text-zinc-400 flex flex-col items-center gap-2">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
                <span>Zero system errors reported. Nice!</span>
              </div>
            ) : (
              errors.map((err) => (
                <div key={err.id} className="rounded-lg border border-red-500/10 bg-red-500/5 p-4 dark:border-red-950/20">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        <h4 className="font-mono text-xs font-bold text-red-600 dark:text-red-400">{err.error}</h4>
                      </div>
                      <p className="text-2xs text-zinc-500 dark:text-zinc-400">
                        Route endpoint: <code className="rounded bg-zinc-100 px-1 py-0.5 text-4xs font-mono dark:bg-zinc-900">{err.path}</code>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-4xs font-bold text-red-800 dark:bg-red-950 dark:text-red-400">
                        {err.count} Occurred
                      </span>
                      <p className="mt-1 text-4xs text-zinc-400 dark:text-zinc-500">Last: {err.time}</p>
                    </div>
                  </div>

                  {err.status === 'active' && (
                    <div className="mt-3.5 flex justify-end">
                      <button
                        onClick={() => onResolveError(err.id)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-2xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-950/30 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                      >
                        <CheckCircle className="h-3.5 w-3.5" /> Resolve Issue
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
