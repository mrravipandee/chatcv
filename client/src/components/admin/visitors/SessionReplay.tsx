'use client';

import React, { useState, useEffect, useRef } from 'react';
import { VisitorSession } from '@/types/visitors';
import {
  Play,
  Pause,
  RotateCcw,
  Monitor,
  MousePointer,
  X,
  Clock,
  Sparkles,
  MapPin,
  Compass
} from 'lucide-react';

interface SessionReplayProps {
  session: VisitorSession | null;
  onClose: () => void;
}

export default function SessionReplay({ session, onClose }: SessionReplayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Simulated cursor path points for playback animation
  const cursorPath = [
    { x: 100, y: 80, event: 'Entered Page' },
    { x: 280, y: 120, event: 'Hovered Hero Description' },
    { x: 380, y: 155, event: 'Clicked "Get Started" Button' },
    { x: 420, y: 155, event: 'Double Click' },
    { x: 580, y: 220, event: 'Scrolled down to templates' },
    { x: 240, y: 290, event: 'Hovered Software Resume preview' },
    { x: 390, y: 290, event: 'Clicked PM template selector' },
    { x: 620, y: 55, event: 'Clicked Navbar Login' }
  ];

  // Playback timer controls
  useEffect(() => {
    if (isPlaying) {
      const interval = 100 / (session?.sessionDurationSeconds || 60);
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            clearInterval(timerRef.current!);
            return 100;
          }
          return prev + interval * playbackSpeed;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, session]);

  if (!session) return null;

  // Resolve current active cursor coordinate based on timeline progress
  const currentPathIndex = Math.min(
    Math.floor((progress / 100) * cursorPath.length),
    cursorPath.length - 1
  );
  const activeCoord = cursorPath[currentPathIndex];

  // Reset player state
  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const getBrowserIcon = (b: string) => {
    if (b.toLowerCase().includes('chrome')) return '🧭';
    if (b.toLowerCase().includes('safari')) return '🧭';
    return '🌐';
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative flex h-[580px] w-full max-w-4xl flex-col rounded-xl border border-zinc-200 bg-white shadow-2xl animate-fade-in dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between border-b border-zinc-150 px-6 py-4.5 dark:border-zinc-900">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <Monitor className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                Session Replay Player
              </h3>
              <p className="text-3xs text-zinc-400 dark:text-zinc-500">
                Tracking Session ID: <code className="rounded bg-zinc-100 px-1 py-0.5 text-4xs dark:bg-zinc-900">{session.id}</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Player split zone */}
        <div className="flex flex-1 min-h-0">
          
          {/* LEFT SIDE: Visual Replay Screen Workspace */}
          <div className="relative flex flex-1 flex-col bg-zinc-50 p-6 dark:bg-zinc-900/10">
            {/* Visual blueprint mock wrapper */}
            <div className="relative flex-1 rounded-xl border border-zinc-200 bg-white shadow-inner dark:border-zinc-900 dark:bg-zinc-950 overflow-hidden">
              
              {/* Interactive blueprint lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-8 pointer-events-none opacity-40">
                {/* Navbar outline */}
                <div className="h-10 w-full rounded border border-dashed border-zinc-300 dark:border-zinc-800" />
                {/* Hero title */}
                <div className="mx-auto h-20 w-3/4 rounded border border-dashed border-zinc-300 dark:border-zinc-800" />
                {/* CTA buttons */}
                <div className="mx-auto flex gap-4">
                  <div className="h-8 w-24 rounded border border-dashed border-zinc-300 dark:border-zinc-800" />
                  <div className="h-8 w-24 rounded border border-dashed border-zinc-300 dark:border-zinc-800" />
                </div>
                {/* Template cards */}
                <div className="flex gap-4">
                  <div className="h-20 flex-1 rounded border border-dashed border-zinc-300 dark:border-zinc-800" />
                  <div className="h-20 flex-1 rounded border border-dashed border-zinc-300 dark:border-zinc-800" />
                </div>
              </div>

              {/* Glowing animated cursor dot */}
              <div
                className="absolute z-50 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 border border-indigo-500 transition-all duration-300"
                style={{
                  left: `${activeCoord?.x || 100}px`,
                  top: `${activeCoord?.y || 80}px`,
                }}
              >
                <MousePointer className="h-3 w-3 fill-indigo-500 text-indigo-500 rotate-90" />
                {/* Click animation ring when click matches */}
                {activeCoord?.event.includes('Clicked') && (
                  <span className="absolute -inset-2.5 rounded-full border border-red-500/60 animate-ping" />
                )}
              </div>
            </div>

            {/* Playback controller timeline bar */}
            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
                >
                  {isPlaying ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                </button>
                <button
                  onClick={handleReset}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-650 hover:bg-zinc-50 dark:border-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900"
                  title="Reset playback"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Progress Slider scrubber */}
              <div className="relative flex-1">
                <div className="h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="absolute -top-1 w-full opacity-0 cursor-pointer"
                />
              </div>

              {/* Speed switcher */}
              <div className="flex gap-1 rounded-lg bg-zinc-150 p-0.5 dark:bg-zinc-900">
                {([1, 2, 4] as Array<1 | 2 | 4>).map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`rounded px-1.5 py-1 text-4xs font-bold ${
                      playbackSpeed === speed
                        ? 'bg-white text-zinc-950 shadow-3xs dark:bg-zinc-950 dark:text-zinc-50'
                        : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-450 dark:hover:text-zinc-200'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Controls & Meta timeline log list */}
          <div className="w-80 shrink-0 border-l border-zinc-150 px-6 py-6 flex flex-col min-h-0 dark:border-zinc-900">
            {/* Meta session config info */}
            <div className="space-y-3.5 border-b border-zinc-100 pb-5 dark:border-zinc-900">
              <h4 className="text-3xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Visitor Meta Profile
              </h4>
              <div className="space-y-2 text-2xs text-zinc-550 dark:text-zinc-400">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">IP:</span>
                  <span className="font-mono text-zinc-800 dark:text-zinc-200">{session.ip}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Location:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-red-500" /> {session.city}, {session.country}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Browser:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                    {getBrowserIcon(session.browser)} {session.browser} ({session.browserVersion.split('.')[0]})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Resolution:</span>
                  <span className="font-mono text-zinc-800 dark:text-zinc-200">{session.screenResolution}</span>
                </div>
              </div>
            </div>

            {/* Event stream timeline logs */}
            <div className="flex-1 flex flex-col min-h-0 mt-5">
              <h4 className="mb-4 text-3xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Session Event Stream
              </h4>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                {cursorPath.map((item, idx) => {
                  const active = idx === currentPathIndex;
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-2.5 rounded-lg p-2 text-2xs transition-colors duration-200 ${
                        active
                          ? 'border border-indigo-500/10 bg-indigo-500/5 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400'
                          : 'text-zinc-550 dark:text-zinc-405'
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5 text-zinc-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{item.event}</span>
                        <p className="mt-0.5 text-3xs text-zinc-400 dark:text-zinc-500">Event Coordinate index: x={item.x}, y={item.y}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
