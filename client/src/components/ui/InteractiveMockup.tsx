"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Code2,
  CheckCircle2,
  Sparkles,
  SearchCheck,
  Zap,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import { useAppStore, PRESET_PROFILES } from "@/lib/store/useAppStore";

export function InteractiveMockup() {
  const {
    selectedProfileId,
    setSelectedProfileId,
    activeTab,
    setActiveTab,
    getCurrentProfile,
  } = useAppStore();

  const [copied, setCopied] = useState(false);
  const currentProfile = getCurrentProfile();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentProfile.latexSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-3xl border border-white/[0.12] bg-[#0c1017]/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden">
      
      {/* Top Bar: Window Controls + Role Selector (Zustand Cache Linked) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-white/[0.08] bg-[#090d13] px-5 py-3.5 gap-3">
        
        {/* Mock Window Dots + Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono font-medium text-zinc-400 pl-2 border-l border-white/10 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            ChatCV Engine v2.4 (Active)
          </span>
        </div>

        {/* Role Switcher (Cached instant switch) */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.06] overflow-x-auto">
          {PRESET_PROFILES.map((p) => {
            const isSelected = p.id === selectedProfileId;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProfileId(p.id)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all duration-200 cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {p.id === "frontend"
                  ? "Frontend"
                  : p.id === "product"
                  ? "Product"
                  : "AI Engineer"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center justify-between px-5 pt-3 pb-2 border-b border-white/[0.06] bg-[#090d14]/50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "preview"
                ? "bg-white/10 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            Resume Preview
          </button>

          <button
            onClick={() => setActiveTab("ats-audit")}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "ats-audit"
                ? "bg-white/10 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <SearchCheck className="w-3.5 h-3.5 text-teal-400" />
            ATS Audit (99%)
          </button>

          <button
            onClick={() => setActiveTab("latex")}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "latex"
                ? "bg-white/10 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            LaTeX Output
          </button>
        </div>

        {/* Dynamic Badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" />
          <span>ATS Passed ({currentProfile.atsScore}/100)</span>
        </div>
      </div>

      {/* Main Tab Content Area */}
      <div className="p-5 sm:p-6 min-h-[340px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {activeTab === "preview" && (
            <motion.div
              key={`preview-${currentProfile.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Header Box */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {currentProfile.name}
                    </h3>
                    <span className="text-xs text-zinc-400">|</span>
                    <span className="text-xs text-emerald-400 font-medium">
                      {currentProfile.role}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {currentProfile.highlightSkill}
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl shrink-0">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300">
                    ATS Score: {currentProfile.atsScore}%
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-white/[0.05]">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-1">
                  Professional Summary
                </span>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {currentProfile.summary}
                </p>
              </div>

              {/* Bullets */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                  Core High-Impact Bullet Points (Google XYZ Format)
                </span>
                {currentProfile.experienceBullets.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs text-zinc-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "ats-audit" && (
            <motion.div
              key={`ats-${currentProfile.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-xs text-zinc-400 block">Keyword Match</span>
                  <span className="text-xl font-bold text-emerald-400">99.2%</span>
                  <p className="text-[11px] text-zinc-400 mt-1">14/14 technical terms detected</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20">
                  <span className="text-xs text-zinc-400 block">Quantified Impact</span>
                  <span className="text-xl font-bold text-teal-400">100%</span>
                  <p className="text-[11px] text-zinc-400 mt-1">Every bullet has $ or % metrics</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <span className="text-xs text-zinc-400 block">Parser Health</span>
                  <span className="text-xl font-bold text-blue-400">A+ Clean</span>
                  <p className="text-[11px] text-zinc-400 mt-1">Single column, 0 font corruption</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/[0.06] space-y-2.5">
                <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                  Workday & Greenhouse Compatibility Check
                </span>
                <div className="text-xs text-zinc-400 space-y-1.5 leading-relaxed">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>LaTeX mathematical spacing prevents multi-column text collision.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>No unreadable icons, graphical progress bars, or hidden tables.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Recruiter-ready text extraction verified at 100% fidelity.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "latex" && (
            <motion.div
              key={`latex-${currentProfile.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-mono">
                  main.tex (Pristine Typeset Code)
                </span>
                <button
                  onClick={handleCopy}
                  className="text-xs px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  {copied ? "Copied!" : "Copy Source"}
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-[#07090e] border border-white/[0.06] text-xs font-mono text-emerald-300/90 overflow-x-auto leading-relaxed max-h-[220px]">
                {currentProfile.latexSnippet}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Status Ribbon */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Real-time client caching active • Instant sync
          </span>
          <span className="text-emerald-400/80 font-medium hidden sm:inline-block">
            Standard Latex & PDF Engine
          </span>
        </div>

      </div>
    </div>
  );
}
