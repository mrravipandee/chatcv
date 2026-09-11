"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Star,
  Terminal,
  Bot,
  FileCheck,
  Zap,
  Copy,
  Check,
} from "lucide-react";
import { Button, Badge, Card, AnimatedGradientText } from "@/components/ui";

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [activeRole, setActiveRole] = useState<"dev" | "pm" | "ai">("dev");

  const roles = {
    dev: {
      input: "Write my experience as a Fullstack Dev with React, Node.js & AWS.",
      output: "Architected microservices handling 2.4M daily requests with 99.99% uptime.",
      score: 99,
      tags: ["React 19", "Node.js", "AWS", "vLLM"],
    },
    pm: {
      input: "I led product roadmap for a B2B SaaS onboarding flow.",
      output: "Redesigned onboarding funnels, lifting free-to-paid conversion by 34% in Q3.",
      score: 98,
      tags: ["Product Strategy", "PLG", "SQL", "A/B Testing"],
    },
    ai: {
      input: "I built RAG pipelines and fine-tuned LLMs on internal data.",
      output: "Deployed hybrid vector-BM25 RAG pipeline, cutting inference latency by 45%.",
      score: 99,
      tags: ["PyTorch", "RAG", "vLLM", "CUDA"],
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roles[activeRole].output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 px-4 sm:px-6 flex flex-col items-center justify-center overflow-hidden bg-[#030712] text-white">
      {/* Animated Subtle Background Glows */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/20 blur-[140px] rounded-full"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Animated Announcement Pill (shadcn style) */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/subscribe">
            <div className="group inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1.5 text-xs text-zinc-300 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 hover:bg-zinc-850">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-white">ChatCV 2.0 is live</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400 group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                Build ATS resumes by chatting <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl"
        >
          Create an ATS-proof resume <br />
          <AnimatedGradientText>by simply chatting.</AnimatedGradientText>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-zinc-400 max-w-2xl leading-relaxed"
        >
          Stop struggling with clunky templates. Talk to our career AI to transform your raw experience into mathematical LaTeX precision guaranteed to pass ATS screens.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
        >
          <Link href="/subscribe" className="w-full sm:w-auto">
            <Button
              variant="glow"
              size="lg"
              className="w-full sm:w-auto text-base"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Building Free
            </Button>
          </Link>

          <Link href="/demo" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base text-zinc-300 hover:text-white"
            >
              Watch 2-Min Demo
            </Button>
          </Link>
        </motion.div>

        {/* Social Proof Avatars & 5-Star Rating */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400"
        >
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-7 w-7 rounded-full border-2 border-[#030712] bg-zinc-800 bg-cover bg-center"
                style={{ backgroundImage: `url('https://i.pravatar.cc/80?img=${i + 15}')` }}
              />
            ))}
          </div>

          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>

          <span>
            Trusted by <strong className="text-white">40,000+ candidates</strong> placed at Google, Stripe, Meta
          </span>
        </motion.div>

        {/* Interactive Animated Product Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-16 w-full max-w-4xl relative"
        >
          {/* Subtle Outer Glow Frame */}
          <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-emerald-500/30 via-teal-500/20 to-cyan-500/30 blur-xl opacity-50" />

          <div className="relative rounded-2xl border border-zinc-800/90 bg-zinc-950/80 backdrop-blur-2xl shadow-2xl p-4 sm:p-6 text-left overflow-hidden">
            
            {/* Window Header + Role Switcher */}
            <div className="flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-zinc-800/80 gap-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 ml-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  chatcv-assistant.tsx
                </span>
              </div>

              {/* Role Switcher Pill */}
              <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-xs">
                {(["dev", "pm", "ai"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setActiveRole(r)}
                    className={`px-3 py-1 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                      activeRole === r
                        ? "bg-zinc-800 text-emerald-300 shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {r === "dev" ? "Engineer" : r === "pm" ? "Product Mgr" : "AI Specialist"}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Animated Conversation */}
            <div className="space-y-4">
              {/* User Prompt */}
              <motion.div
                key={`user-${activeRole}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start justify-end gap-3"
              >
                <div className="max-w-md rounded-2xl rounded-tr-xs bg-emerald-500/15 border border-emerald-500/30 px-4 py-2.5 text-xs sm:text-sm text-emerald-200 shadow-sm">
                  {roles[activeRole].input}
                </div>
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold border border-emerald-500/30">
                  You
                </div>
              </motion.div>

              {/* AI Response */}
              <motion.div
                key={`ai-${activeRole}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="flex items-start gap-3"
              >
                <div className="h-8 w-8 rounded-full bg-zinc-800 text-emerald-400 flex items-center justify-center shrink-0 border border-zinc-700">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 max-w-xl rounded-2xl rounded-tl-xs bg-zinc-900/80 border border-zinc-800/80 p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      ATS Optimized (Score: {roles[activeRole].score}/100)
                    </span>
                    <button
                      onClick={handleCopy}
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>

                  {/* High impact bullet */}
                  <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 text-xs sm:text-sm text-zinc-200 leading-relaxed font-mono">
                    • {roles[activeRole].output}
                  </div>

                  {/* Keyword Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-zinc-500 mr-1">ATS Keywords:</span>
                    {roles[activeRole].tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] py-0 px-2">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom Status Ribbon */}
            <div className="mt-6 pt-4 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Passes Workday, Greenhouse & Lever parser benchmarks</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <Zap className="w-3 h-3" /> LaTeX Engine Active
                </span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}