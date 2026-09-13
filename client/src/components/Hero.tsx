"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Terminal, FileCode2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function Hero() {
  return (
    <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center overflow-hidden bg-[#05070a] text-white">
      {/* Ambient background glow - subtle and controlled */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[350px] bg-[#00ff9c]/10 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-grid-subtle opacity-60" />
      </div>

      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Product Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-zinc-300 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-[#00ff9c] animate-pulse" />
            <span className="font-semibold text-white">AI-Powered Resume Builder</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">Pure LaTeX Precision</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.03em] text-white leading-[1.1] max-w-3xl"
        >
          Your resume starts with a{" "}
          <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            conversation.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-zinc-400 max-w-2xl leading-relaxed font-normal"
        >
          Tell Chat CV about your experience. It turns your story into a structured,
          ATS-friendly resume with deterministic LaTeX formatting and a clean vector PDF you can use immediately.
        </motion.p>

        {/* Primary and Secondary Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
        >
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              variant="glow"
              size="lg"
              className="w-full sm:w-auto text-sm sm:text-base font-bold shadow-[0_0_30px_rgba(0,255,156,0.3)]"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Building Free
            </Button>
          </Link>

          <a href="#showcase" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-sm sm:text-base text-zinc-300 hover:text-white border-white/10 hover:border-white/20 bg-white/[0.03]"
            >
              See How It Works
            </Button>
          </a>
        </motion.div>

        {/* Technical differentiators (replaces fake social proof) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-zinc-400"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9c]" />
            <span>No templates or form fields to fight</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9c]" />
            <span>Standard single-column ATS structure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9c]" />
            <span>Raw .tex code exportable to Overleaf</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}