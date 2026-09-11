"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Bot,
  FileCode2,
  SearchCheck,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Badge, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";

export default function Features() {
  const bentoFeatures = [
    {
      colSpan: "md:col-span-2",
      icon: <Bot className="w-5 h-5 text-emerald-400" />,
      badge: "Conversational",
      title: "Interactive AI Chat Editor",
      desc: "No more wrestling with multi-column table templates. Simply describe your experience in natural language, and our AI constructs quantified, Google XYZ bullet points in real-time.",
      visual: (
        <div className="mt-4 p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs font-mono space-y-2">
          <div className="flex items-center gap-2 text-zinc-500">
            <span className="text-emerald-400">user:</span> &quot;Rewrote GraphQL checkout flow&quot;
          </div>
          <div className="flex items-center gap-2 text-emerald-300">
            <span className="text-teal-400">chatcv:</span> &quot;Architected GraphQL federated gateway, reducing API response times by 48% across 14M transactions.&quot;
          </div>
        </div>
      ),
    },
    {
      colSpan: "md:col-span-1",
      icon: <SearchCheck className="w-5 h-5 text-teal-400" />,
      badge: "Job Matcher",
      title: "ATS Keyword Matcher",
      desc: "Paste any job description to automatically detect missing skills, certifications, or keywords before you apply.",
      visual: (
        <div className="mt-4 flex flex-wrap gap-1.5">
          <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px]">
            ✓ Next.js 15
          </span>
          <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px]">
            ✓ TypeScript
          </span>
          <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px]">
            ✓ Microservices
          </span>
          <span className="px-2 py-1 rounded-md bg-zinc-800 text-zinc-400 text-[11px]">
            + 8 more matched
          </span>
        </div>
      ),
    },
    {
      colSpan: "md:col-span-1",
      icon: <FileCode2 className="w-5 h-5 text-cyan-400" />,
      badge: "Typesetting",
      title: "Mathematical LaTeX Precision",
      desc: "Compiles directly into clean LaTeX. Never worry about margins shifting, fonts breaking, or pages spilling by 2 lines.",
      visual: (
        <div className="mt-4 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-[11px] font-mono text-cyan-300">
          \begin&#123;itemize&#125;[noitemsep]<br />
          &nbsp;&nbsp;\item Precision ATS margins (0.75in)<br />
          \end&#123;itemize&#125;
        </div>
      ),
    },
    {
      colSpan: "md:col-span-2",
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      badge: "Performance",
      title: "Passed by 99.4% of Applicant Tracking Systems",
      desc: "Pre-tested across Workday, Greenhouse, Lever, and Taleo. Zero table corruption, zero unreadable text boxes, and zero parsing failures.",
      visual: (
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
            <span className="block font-bold text-white">Workday</span>
            <span className="text-[11px] text-emerald-400 font-semibold">100% Passed</span>
          </div>
          <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
            <span className="block font-bold text-white">Greenhouse</span>
            <span className="text-[11px] text-emerald-400 font-semibold">100% Passed</span>
          </div>
          <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
            <span className="block font-bold text-white">Lever</span>
            <span className="text-[11px] text-emerald-400 font-semibold">99.8% Passed</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="relative py-28 px-4 sm:px-6 bg-[#030712] text-white overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-3">
            <Badge variant="glow" withDot>
              Engineered for Results
            </Badge>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Everything you need to beat the ATS filter.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Built specifically for modern professionals seeking top-tier compensation offers and callback rates.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bentoFeatures.map((f, i) => (
            <motion.div
              key={i}
              className={f.colSpan}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full flex flex-col justify-between border-zinc-800/80 bg-zinc-900/40 hover:border-emerald-500/40 hover:bg-zinc-900/70 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60">
                      {f.icon}
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {f.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-bold">{f.title}</CardTitle>
                  <CardDescription className="mt-2 text-xs sm:text-sm">
                    {f.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {f.visual}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}