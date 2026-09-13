"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, FileCode, Download, ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: <MessageSquare className="w-5 h-5 text-[#00ff9c]" />,
      title: "Talk Through Your Career",
      desc: "Speak naturally with the AI assistant. Mention your past companies, projects, responsibilities, and achievements without wrestling with rigid forms.",
      badge: "No forms required",
    },
    {
      step: "02",
      icon: <FileCode className="w-5 h-5 text-[#00ff9c]" />,
      title: "Automated Data & LaTeX Structuring",
      desc: "Chat CV extracts your details into structured resume data and converts accomplishments into quantified Google XYZ bullets typeset in pure LaTeX.",
      badge: "Deterministic compilation",
    },
    {
      step: "03",
      icon: <Download className="w-5 h-5 text-[#00ff9c]" />,
      title: "Instant PDF & Source Export",
      desc: "Preview your resume live on screen. Download a print-ready vector PDF or copy the complete .tex source code to customize in Overleaf.",
      badge: "One-click download",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#05070a] text-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          badgeText="Simple Workflow"
          title="From raw experience to standard LaTeX resume in"
          gradientText="3 straightforward steps."
          description="Engineered to eliminate formatting headaches and produce clean, recruiter-ready resumes without template lock-in."
        />

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0b1016] p-6 sm:p-7 hover:border-[#00ff9c]/30 transition-all duration-300 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                    {item.icon}
                  </div>
                  <span className="text-2xl font-mono font-extrabold text-zinc-600">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{item.title}</h3>
                <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-5 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
                <span className="text-[#00ff9c] font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> {item.badge}
                </span>
                <span className="text-zinc-600 font-mono text-[11px]">Step {item.step}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}