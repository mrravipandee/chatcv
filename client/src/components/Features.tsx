"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Bot,
  FileCode2,
  FileUp,
  Eye,
  Layers,
  Sparkles,
  Terminal,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function Features() {
  const bentoFeatures = [
    {
      colSpan: "md:col-span-2",
      icon: <Bot className="w-5 h-5 text-[#00ff9c]" />,
      badge: "Conversational Interview",
      title: "Interactive AI Career Interviewer",
      desc: "Stop staring at empty form inputs. The AI assistant guides you with conversational prompts, extracting your responsibilities and structuring them into impactful, result-driven statements.",
      visual: (
        <div className="mt-4 p-3.5 rounded-xl bg-[#060a0f] border border-white/[0.08] text-xs font-mono space-y-2">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="text-[#00ff9c] font-bold">you:</span> "I migrated our payments infrastructure to Stripe"
          </div>
          <div className="flex items-start gap-2 text-zinc-200">
            <span className="text-zinc-500 font-bold shrink-0">chatcv:</span>
            <span>"Led payment platform migration to Stripe, processing $4.8M monthly with 99.98% reliability."</span>
          </div>
        </div>
      ),
    },
    {
      colSpan: "md:col-span-1",
      icon: <FileUp className="w-5 h-5 text-[#00ff9c]" />,
      badge: "Fast Onboarding",
      title: "Existing Resume Import",
      desc: "Already have a resume? Upload your PDF or plain text file. Chat CV parses your existing history and populates your workspace in seconds.",
      visual: (
        <div className="mt-4 p-3 rounded-xl bg-[#060a0f] border border-white/[0.08] flex items-center justify-between text-xs font-mono text-zinc-300">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00ff9c]" />
            <span>resume_2025.pdf</span>
          </div>
          <span className="text-[11px] text-[#00ff9c]">Extracted</span>
        </div>
      ),
    },
    {
      colSpan: "md:col-span-1",
      icon: <FileCode2 className="w-5 h-5 text-[#00ff9c]" />,
      badge: "Deterministic Code",
      title: "LaTeX-First Architecture",
      desc: "Every resume is backed by rigorous LaTeX markup. Margins, line-spacing, and typography are mathematically aligned — no misaligned tables.",
      visual: (
        <div className="mt-4 p-3 rounded-xl bg-[#060a0f] border border-white/[0.08] text-[11px] font-mono text-zinc-300">
          \begin&#123;itemize&#125;[leftmargin=0.15in]<br />
          &nbsp;&nbsp;\item \textbf&#123;Standardized ATS Margins&#125;<br />
          \end&#123;itemize&#125;
        </div>
      ),
    },
    {
      colSpan: "md:col-span-2",
      icon: <Eye className="w-5 h-5 text-[#00ff9c]" />,
      badge: "Real-Time Feedback",
      title: "Live WebSocket PDF Compilation",
      desc: "As you chat, background workers compile your resume using pdflatex. WebSocket events stream progress directly to your live document preview.",
      visual: (
        <div className="mt-4 p-3.5 rounded-xl bg-[#060a0f] border border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00ff9c] animate-ping" />
            <span className="text-zinc-200 font-mono">compiling_pdf → ready</span>
          </div>
          <span className="text-[11px] font-mono text-[#00ff9c] bg-[#00ff9c]/10 px-2.5 py-1 rounded-full border border-[#00ff9c]/20">
            Render Time: ~4.2s
          </span>
        </div>
      ),
    },
    {
      colSpan: "md:col-span-2",
      icon: <Layers className="w-5 h-5 text-[#00ff9c]" />,
      badge: "Workflow",
      title: "Multi-Resume Workspace",
      desc: "Tailoring resumes for different roles is effortless. Create multiple resume drafts in your account, switch between them instantly, and preserve each unique conversation history.",
      visual: (
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-[#060a0f] border border-[#00ff9c]/30 text-white flex items-center justify-between">
            <span>Frontend Engineer</span>
            <span className="text-[10px] text-[#00ff9c]">Active</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#060a0f] border border-white/[0.08] text-zinc-400 flex items-center justify-between">
            <span>Fullstack Generalist</span>
            <span className="text-[10px] text-zinc-600">Saved</span>
          </div>
        </div>
      ),
    },
    {
      colSpan: "md:col-span-1",
      icon: <ShieldCheck className="w-5 h-5 text-[#00ff9c]" />,
      badge: "Standards Compliant",
      title: "Zero Layout Traps",
      desc: "No multi-column column collisions, unreadable progress bars, or graphic icons that cause applicant tracking systems to fail parsing.",
      visual: (
        <div className="mt-4 space-y-1.5 text-xs text-zinc-300">
          <div className="flex items-center gap-2 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9c] shrink-0" />
            <span>Single-column text flow</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9c] shrink-0" />
            <span>Overleaf source copyable</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#05070a] text-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          badgeText="Product Capabilities"
          title="Engineered specifically for"
          gradientText="clean technical hiring."
          description="Every feature in Chat CV exists to remove friction between your raw career history and a professional, ATS-compliant application."
        />

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bentoFeatures.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className={`${item.colSpan} flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0b1016] p-6 sm:p-7 hover:border-white/20 transition-all duration-300 shadow-xl`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-[#00ff9c] uppercase tracking-wider bg-[#00ff9c]/10 border border-[#00ff9c]/20 px-2.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{item.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2">
                {item.visual}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}