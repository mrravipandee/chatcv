"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CTA() {
  return (
    <section id="cta" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#05070a] text-white overflow-hidden">
      {/* Background Central Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#00ff9c]/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl border border-white/[0.08] bg-[#0b1016] p-8 sm:p-14 text-center backdrop-blur-2xl shadow-2xl overflow-hidden specular-border"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00ff9c]/30 bg-[#00ff9c]/10 px-3.5 py-1 text-xs font-semibold text-[#00ff9c] mb-6">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>Ready to upgrade your job hunt?</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-white leading-tight max-w-2xl mx-auto">
            Turn your experience into a{" "}
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              resume that represents you.
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Stop wrestling with clunky Word templates and brittle table layouts. Talk to Chat CV and download your ATS-ready vector PDF in minutes.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                variant="glow"
                size="lg"
                className="w-full sm:w-auto font-bold shadow-[0_0_25px_rgba(0,255,156,0.3)]"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Start Building Free
              </Button>
            </Link>

            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-zinc-300 hover:text-white border-white/10"
              >
                Explore How It Works
              </Button>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00ff9c]" />
              <span>Standard LaTeX typesetting</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00ff9c]" />
              <span>Single-column ATS compliance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#00ff9c]" />
              <span>No credit card required</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}