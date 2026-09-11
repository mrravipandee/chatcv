"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Sparkles, Download, ArrowRight, Check } from "lucide-react";
import { Badge, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: <MessageSquare className="w-5 h-5 text-emerald-400" />,
      title: "Chat Your Background",
      desc: "Speak naturally. Tell the AI about your projects, internships, metrics, or career pivots in plain conversational English.",
      badge: "No forms required",
    },
    {
      step: "02",
      icon: <Sparkles className="w-5 h-5 text-teal-400" />,
      title: "AI Compiles in LaTeX",
      desc: "ChatCV formats your experience with Google's XYZ formula, mathematically aligning margins and headers in pure LaTeX.",
      badge: "ATS Guaranteed",
    },
    {
      step: "03",
      icon: <Download className="w-5 h-5 text-cyan-400" />,
      title: "Instant PDF Export",
      desc: "Download high-resolution PDFs or copy raw .tex code with 100% Workday and Greenhouse parse rates guaranteed.",
      badge: "One-click download",
    },
  ];

  return (
    <section id="how" className="relative py-28 px-4 sm:px-6 bg-[#030712] text-white overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[130px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-3">
            <Badge variant="glow" withDot>
              How It Works
            </Badge>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            From raw experience to top-tier resume in 3 simple steps.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Engineered by senior software developers to eliminate formatting headaches and maximize your interview callback rate.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.5 }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full flex flex-col justify-between border-zinc-800/80 bg-zinc-900/40 hover:border-emerald-500/40 hover:bg-zinc-900/70 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60">
                      {item.icon}
                    </div>
                    <span className="text-2xl font-mono font-extrabold text-zinc-700">
                      {item.step}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold">{item.title}</CardTitle>
                  <CardDescription className="mt-2 text-xs sm:text-sm">
                    {item.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> {item.badge}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}