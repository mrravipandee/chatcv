'use client';

import React, { useRef, useEffect, useState } from 'react';
import { VisitorSession } from '@/types/visitors';
import { Globe, MapPin, Eye, MousePointer } from 'lucide-react';

interface VisitorMapProps {
  liveVisitors: VisitorSession[];
}

export default function VisitorMap({ liveVisitors }: VisitorMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredDot, setHoveredDot] = useState<VisitorSession | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  // Map equirectangular projection from lat/lng to canvas x/y
  const getCoordinates = (lat: number, lng: number, width: number, height: number) => {
    // Map longitude from [-180, 180] to [0, width]
    const x = ((lng + 180) * width) / 360;
    // Map latitude from [-90, 90] to [height, 0] (canvas 0,0 is top-left)
    const y = ((90 - lat) * height) / 180;
    return { x, y };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let pulseOpacity = 0.8;
    let pulseRadius = 1;
    let increment = 0.035;

    // Draw map elements
    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      
      // Clear screen
      ctx.clearRect(0, 0, w, h);

      // 1. Draw digital grid map background
      // We draw horizontal and vertical grids of soft dots to represent a grid map outline
      ctx.fillStyle = 'rgba(113, 113, 122, 0.12)';
      const dotSpacing = 8;
      for (let x = 0; x < w; x += dotSpacing) {
        for (let y = 0; y < h; y += dotSpacing) {
          // Draw dots excluding areas that wouldn't represent standard landmass coordinates to keep it sleek,
          // or just render a uniform background dot grid which looks highly styled (Stripe analytics style!)
          ctx.beginPath();
          ctx.arc(x, y, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Pulse radius increment
      pulseRadius += 0.35;
      pulseOpacity -= 0.015;
      if (pulseOpacity <= 0) {
        pulseRadius = 1;
        pulseOpacity = 0.8;
      }

      // 3. Render Visitor Glowing Pins
      liveVisitors.forEach((visitor) => {
        const { x, y } = getCoordinates(visitor.latitude, visitor.longitude, w, h);
        
        // Determine color based on session (Green for active, Purple for bot/suspicious)
        const dotColor = visitor.isBot ? '#a855f7' : '#00ff9c';
        const rippleColor = visitor.isBot ? 'rgba(168, 85, 247, ' : 'rgba(0, 255, 156, ';

        // Draw outer ripple
        ctx.strokeStyle = `${rippleColor}${pulseOpacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, pulseRadius + 3, 0, Math.PI * 2);
        ctx.stroke();

        // Draw glowing aura
        ctx.fillStyle = `${rippleColor}0.15)`;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();

        // Draw solid center core dot
        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [liveVisitors]);

  // Handle canvas mouse move hover card triggers
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    // Scale coords to match canvas internal resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Check if mouse is close to any active visitor dot
    let foundDot: VisitorSession | null = null;
    for (const vis of liveVisitors) {
      const { x, y } = getCoordinates(vis.latitude, vis.longitude, canvas.width, canvas.height);
      const dist = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
      
      if (dist < 10) { // Hover hit zone radius of 10px
        foundDot = vis;
        // Tooltip coordinate in client workspace screen units
        setHoverPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top - 85,
        });
        break;
      }
    }
    setHoveredDot(foundDot);
  };

  const handleMouseLeave = () => {
    setHoveredDot(null);
  };

  return (
    <div className="relative rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden group">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-900">
        <div className="flex items-center gap-2">
          <Globe className="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500 animate-spin-slow" />
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              Live Visitors Map
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Real-time telemetry showing absolute geolocation positions of current sessions.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-3xs font-bold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {liveVisitors.length} Active Sessions
        </div>
      </div>

      {/* Geolocation Canvas Map area */}
      <div className="relative mt-6 flex justify-center bg-zinc-50/50 rounded-xl py-2 dark:bg-zinc-900/10">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full max-w-2xl cursor-pointer aspect-2/1"
        />

        {/* Dynamic Tooltip Hover card */}
        {hoveredDot && (
          <div
            className="absolute z-10 w-44 rounded-lg border border-zinc-250/20 bg-white/95 p-2.5 shadow-md backdrop-blur-xs text-4xs transition-all pointer-events-none dark:border-zinc-800/80 dark:bg-zinc-950/95 animate-fade-in"
            style={{ left: hoverPos.x - 88, top: hoverPos.y }}
          >
            <div className="flex items-center justify-between font-bold border-b border-zinc-100/60 pb-1 mb-1.5 dark:border-zinc-900">
              <span className="text-zinc-800 dark:text-zinc-200">📍 {hoveredDot.city}</span>
              <span className="text-4xs text-zinc-400 font-bold uppercase">{hoveredDot.country}</span>
            </div>
            <div className="space-y-1 text-zinc-500">
              <div className="flex justify-between">
                <span>IP:</span>
                <span className="font-mono text-zinc-700 dark:text-zinc-350">{hoveredDot.ip}</span>
              </div>
              <div className="flex justify-between">
                <span>ISP:</span>
                <span className="truncate max-w-[100px] text-zinc-700 dark:text-zinc-350" title={hoveredDot.isp}>
                  {hoveredDot.isp}
                </span>
              </div>
              <div className="flex justify-between border-t border-zinc-100/60 pt-1 mt-1 dark:border-zinc-900">
                <span>Session:</span>
                <span className="font-semibold text-emerald-500">{hoveredDot.sessionDuration}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footnote tips */}
      <div className="mt-4 flex items-center justify-between text-4xs text-zinc-400 dark:text-zinc-500">
        <span className="flex items-center gap-1">
          <MousePointer className="h-3 w-3" /> Hover over glowing points to reveal ISP and city information nodes.
        </span>
        <div className="flex gap-3">
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#00ff9c]" /> Active User</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Bot Crawler</span>
        </div>
      </div>
    </div>
  );
}
