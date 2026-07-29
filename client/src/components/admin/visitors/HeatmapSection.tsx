'use client';

import React, { useRef, useEffect, useState } from 'react';
import { MousePointer, Eye, Activity, Sliders } from 'lucide-react';

interface HeatmapPoint {
  x: number;
  y: number;
  value: number; // intensity
  label?: string;
}

export default function HeatmapSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState<'landing' | 'editor'>('landing');
  const [showOverlay, setShowOverlay] = useState(true);
  const [showOutlines, setShowOutlines] = useState(true);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  // Simulated heatmap coordinate nodes for Landing page
  const landingPoints: HeatmapPoint[] = [
    { x: 400, y: 110, value: 0.95, label: 'Hero CTA: "Start Building Free"' },
    { x: 380, y: 45, value: 0.45, label: 'Navbar Link: "Features"' },
    { x: 460, y: 45, value: 0.35, label: 'Navbar Link: "Pricing"' },
    { x: 620, y: 45, value: 0.65, label: 'Navbar CTA: "Login / Register"' },
    { x: 220, y: 280, value: 0.75, label: 'Template card: Software Engineer' },
    { x: 380, y: 280, value: 0.85, label: 'Template card: Product Manager' },
    { x: 540, y: 280, value: 0.55, label: 'Template card: Graphic Designer' },
  ];

  // Simulated heatmap coordinates for AI Editor workspace
  const editorPoints: HeatmapPoint[] = [
    { x: 180, y: 350, value: 0.98, label: 'Chat Panel: Message Send button' },
    { x: 120, y: 350, value: 0.78, label: 'Chat Panel: Upload Resume PDF icon' },
    { x: 180, y: 55, value: 0.58, label: 'Sidebar Switcher: "Chats history"' },
    { x: 540, y: 55, value: 0.88, label: 'Preview Tools: "Download PDF"' },
    { x: 680, y: 55, value: 0.48, label: 'Preview Tools: "Copy LaTex code"' },
  ];

  const activePoints = currentPage === 'landing' ? landingPoints : editorPoints;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    // 1. Draw Schematic Outlines of the page (Blueprint UI)
    if (showOutlines) {
      ctx.strokeStyle = 'rgba(113, 113, 122, 0.18)';
      ctx.lineWidth = 1.2;

      if (currentPage === 'landing') {
        // --- LANDING PAGE SCHEMATIC OUTLINES ---
        // Header navbar
        ctx.strokeRect(40, 25, w - 80, 40);
        ctx.fillStyle = 'rgba(113, 113, 122, 0.05)';
        ctx.fillRect(40, 25, w - 80, 40);
        
        // Logo and Menu items
        ctx.fillStyle = 'rgba(113, 113, 122, 0.35)';
        ctx.fillRect(60, 40, 60, 10);
        ctx.fillRect(360, 40, 40, 10);
        ctx.fillRect(440, 40, 40, 10);
        ctx.fillRect(600, 35, 70, 20); // Login button box

        // Hero title block
        ctx.fillRect(240, 95, 320, 15);
        ctx.fillRect(280, 120, 240, 15);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.25)'; // Highlighted CTA box outline
        ctx.fillRect(310, 150, 180, 32); 

        // Template selector section
        ctx.strokeStyle = 'rgba(113, 113, 122, 0.15)';
        ctx.fillStyle = 'rgba(113, 113, 122, 0.02)';
        
        // Card 1
        ctx.strokeRect(150, 220, 140, 120);
        ctx.fillRect(150, 220, 140, 120);
        // Card 2
        ctx.strokeRect(310, 220, 140, 120);
        ctx.fillRect(310, 220, 140, 120);
        // Card 3
        ctx.strokeRect(470, 220, 140, 120);
        ctx.fillRect(470, 220, 140, 120);
      } else {
        // --- EDITOR WORKSPACE SCHEMATIC OUTLINES ---
        // Topbar header
        ctx.strokeRect(40, 25, w - 80, 50);
        ctx.fillStyle = 'rgba(113, 113, 122, 0.05)';
        ctx.fillRect(40, 25, w - 80, 50);

        // Sidebar Chats list (Left column)
        ctx.strokeRect(40, 85, 180, 280);
        ctx.strokeRect(50, 100, 160, 25);
        ctx.strokeRect(50, 135, 160, 25);

        // Active Chat Input (Middle column)
        ctx.strokeRect(230, 85, 230, 280);
        ctx.strokeRect(240, 335, 210, 22); // Chat text box

        // PDF Previewer (Right column)
        ctx.strokeRect(470, 85, 290, 280);
        ctx.fillRect(485, 100, 260, 250); // PDF document page outline
      }
    }

    // 2. Draw Click Heatmap points using concentric radial gradients
    if (showOverlay) {
      activePoints.forEach((point) => {
        // Draw radial glow center (Red hot center -> Green cooler outer ring -> Blue transparent cold ring)
        const radius = 26 * point.value;
        const grad = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
        
        // Define color gradient offsets (Thermal spectrum)
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.65)'); // Hot red inner core
        grad.addColorStop(0.3, 'rgba(245, 158, 11, 0.45)'); // Warm amber
        grad.addColorStop(0.65, 'rgba(16, 185, 129, 0.15)'); // Cool emerald
        grad.addColorStop(1, 'rgba(59, 130, 246, 0.0)'); // Cold transparent blue boundary

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }, [currentPage, showOverlay, showOutlines]);

  // Handle heatmap mouse move click coordinate descriptions
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    // Convert client coords
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Check hit index
    let activeLabel: string | null = null;
    for (const point of activePoints) {
      const dist = Math.sqrt((mouseX - point.x) ** 2 + (mouseY - point.y) ** 2);
      if (dist < 22) { // 22px click hotspot range
        activeLabel = `${point.label} (${Math.floor(point.value * 100)}% clicking density)`;
        break;
      }
    }
    setHoveredHotspot(activeLabel);
  };

  const handleMouseLeave = () => {
    setHoveredHotspot(null);
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
      
      {/* Header controls bar */}
      <div className="flex flex-col border-b border-zinc-100 pb-5 sm:flex-row sm:items-center sm:justify-between gap-4 dark:border-zinc-900">
        <div className="flex items-center gap-2">
          <Activity className="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500" />
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              Interactive Heatmaps
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Analyze user clicking densities and hover hotspots across layouts.
            </p>
          </div>
        </div>

        {/* View togglers */}
        <div className="flex rounded-lg bg-zinc-100/80 p-1 dark:bg-zinc-900/60 scrollbar-none">
          <button
            onClick={() => setCurrentPage('landing')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              currentPage === 'landing'
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-950 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-450 dark:hover:text-zinc-200'
            }`}
          >
            Landing Page
          </button>
          <button
            onClick={() => setCurrentPage('editor')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              currentPage === 'editor'
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-950 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-450 dark:hover:text-zinc-200'
            }`}
          >
            AI Editor Suite
          </button>
        </div>
      </div>

      {/* Control panel options */}
      <div className="mt-4 flex flex-wrap gap-4 items-center justify-between text-2xs text-zinc-500">
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showOverlay}
              onChange={(e) => setShowOverlay(e.target.checked)}
              className="rounded border-zinc-300 text-indigo-650"
            />
            Show Click Heatmap
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showOutlines}
              onChange={(e) => setShowOutlines(e.target.checked)}
              className="rounded border-zinc-300 text-indigo-650"
            />
            Show UI Blueprints
          </label>
        </div>

        {/* Dynamic coordinate hover indicator */}
        <div className="h-5 flex items-center">
          {hoveredHotspot ? (
            <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 animate-fade-in">
              🎯 {hoveredHotspot}
            </span>
          ) : (
            <span className="text-zinc-400">Hover over click thermal glows to explore...</span>
          )}
        </div>
      </div>

      {/* Schematic Heatmap Canvas container */}
      <div className="relative mt-5 flex justify-center bg-zinc-50 rounded-xl py-3 border border-zinc-150/40 dark:bg-zinc-900/10 dark:border-zinc-900">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full max-w-2xl aspect-2/1 cursor-crosshair"
        />
      </div>

      {/* Legend footnote */}
      <div className="mt-4 flex items-center justify-between text-4xs text-zinc-400 dark:text-zinc-500">
        <span className="flex items-center gap-1">
          <Sliders className="h-3 w-3" /> Filters and overlays update click grids dynamically.
        </span>
        <div className="flex gap-3">
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Hot (CTA clicks)</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Warm (Nav hover)</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-blue-450" /> Cold (Nav boundary)</span>
        </div>
      </div>

    </div>
  );
}
